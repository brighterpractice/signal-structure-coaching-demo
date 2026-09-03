import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(
  new URL(
    '../public/brighter-analytics.js',
    import.meta.url
  ),
  'utf8'
);

const VISITOR_KEY =
  'bs_analytics_visitor_v2';

const VISITOR_LIFETIME_MS =
  180 * 24 * 60 * 60 * 1000;

function makeUuid(value) {
  return (
    '00000000-0000-4000-8000-' +
    String(value).padStart(12, '0')
  );
}

class StorageMock {
  constructor(
    initial = {},
    {
      throwOnGet = false,
      throwOnSet = false,
    } = {}
  ) {
    this.values = new Map(
      Object.entries(initial)
    );

    this.throwOnGet = throwOnGet;
    this.throwOnSet = throwOnSet;

    this.gets = 0;
    this.sets = 0;
    this.removes = 0;
  }

  getItem(key) {
    this.gets += 1;

    if (this.throwOnGet) {
      throw new Error('storage unavailable');
    }

    return this.values.has(key)
      ? this.values.get(key)
      : null;
  }

  setItem(key, value) {
    this.sets += 1;

    if (this.throwOnSet) {
      throw new Error('storage unavailable');
    }

    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.removes += 1;
    this.values.delete(key);
  }
}

function runTracker({
  localStorage = new StorageMock(),
  sessionStorage = new StorageMock(),
  gpc = false,
  dnt = '',
} = {}) {
  const requests = [];
  let uuidCounter = 0;

  const config = {
    collectorUrl:
      'https://analytics.brightersites.app',
    siteKey:
      'bs_live_' + 'a'.repeat(48),
    scriptVersion: '2.0.0',
  };

  class Element {}

  const document = {
    referrer: '',

    documentElement: {
      getAttribute() {
        return null;
      },
    },

    querySelector(selector) {
      if (
        selector ===
        'script[data-bs-analytics-config]'
      ) {
        return {
          textContent: JSON.stringify(config),
        };
      }

      if (
        selector ===
        'meta[name="brighter-sites-analytics"]'
      ) {
        return null;
      }

      return null;
    },

    addEventListener() {},
  };

  const navigator = {
    globalPrivacyControl: gpc,
    doNotTrack: dnt,
    msDoNotTrack: '',
  };

  const window = {
    location: {
      pathname: '/',
      hostname: 'brightersites.app',
      origin: 'https://brightersites.app',
      href: 'https://brightersites.app/',
    },

    doNotTrack: dnt,
    brighterSitesAnalyticsOptOut: false,

    matchMedia() {
      return { matches: false };
    },

    setTimeout() {
      return 0;
    },
  };

  const context = {
    URL,
    Element,
    console,
    document,
    navigator,
    window,
    localStorage,
    sessionStorage,

    crypto: {
      randomUUID() {
        uuidCounter += 1;
        return makeUuid(uuidCounter);
      },
    },

    fetch(url, options) {
      requests.push({
        url,
        options,
        payload: JSON.parse(options.body),
      });

      return Promise.resolve({
        status: 204,
      });
    },
  };

  vm.runInNewContext(
    source,
    vm.createContext(context)
  );

  return {
    requests,
    localStorage,
    sessionStorage,
  };
}

test(
  'first session creates a fixed-lifetime new visitor',
  () => {
    const localStorage =
      new StorageMock();

    const result = runTracker({
      localStorage,
    });

    assert.equal(result.requests.length, 1);

    const payload =
      result.requests[0].payload;

    assert.equal(
      payload.visitor_is_returning,
      false
    );

    assert.match(
      payload.visitor_id,
      /^[0-9a-f-]{36}$/
    );

    const visitor = JSON.parse(
      localStorage.getItem(VISITOR_KEY)
    );

    assert.equal(
      visitor.id,
      payload.visitor_id
    );

    assert.equal(
      visitor.expiresAt -
        visitor.createdAt,
      VISITOR_LIFETIME_MS
    );
  }
);

test(
  'a later session on the same origin is returning',
  () => {
    const localStorage =
      new StorageMock();

    const first = runTracker({
      localStorage,
      sessionStorage:
        new StorageMock(),
    });

    const visitorId =
      first.requests[0].payload.visitor_id;

    const second = runTracker({
      localStorage,
      sessionStorage:
        new StorageMock(),
    });

    assert.equal(
      second.requests[0].payload.visitor_id,
      visitorId
    );

    assert.equal(
      second.requests[0].payload
        .visitor_is_returning,
      true
    );
  }
);

test(
  'later page loads in the first session stay new',
  () => {
    const localStorage =
      new StorageMock();

    const sessionStorage =
      new StorageMock();

    const first = runTracker({
      localStorage,
      sessionStorage,
    });

    assert.equal(
      first.requests[0].payload
        .visitor_is_returning,
      false
    );

    const second = runTracker({
      localStorage,
      sessionStorage,
    });

    assert.equal(
      second.requests[0].payload
        .visitor_is_returning,
      false
    );

    assert.equal(
      second.requests[0].payload.visitor_id,
      first.requests[0].payload.visitor_id
    );
  }
);

test(
  'GPC prevents visitor storage access and collection',
  () => {
    const localStorage =
      new StorageMock();

    const result = runTracker({
      localStorage,
      gpc: true,
    });

    assert.equal(
      result.requests.length,
      0
    );

    assert.equal(localStorage.gets, 0);
    assert.equal(localStorage.sets, 0);
    assert.equal(localStorage.removes, 0);
  }
);

test(
  'session analytics continue if localStorage is unavailable',
  () => {
    const localStorage =
      new StorageMock(
        {},
        { throwOnGet: true }
      );

    const result = runTracker({
      localStorage,
    });

    assert.equal(result.requests.length, 1);

    const payload =
      result.requests[0].payload;

    assert.equal(
      Object.hasOwn(
        payload,
        'visitor_id'
      ),
      false
    );

    assert.equal(
      Object.hasOwn(
        payload,
        'visitor_is_returning'
      ),
      false
    );
  }
);

test(
  'expired visitor storage creates a new visitor',
  () => {
    const expiredId = makeUuid(99);

    const localStorage =
      new StorageMock({
        [VISITOR_KEY]:
          JSON.stringify({
            id: expiredId,
            createdAt: 0,
            expiresAt:
              VISITOR_LIFETIME_MS,
          }),
      });

    const result = runTracker({
      localStorage,
    });

    const payload =
      result.requests[0].payload;

    assert.notEqual(
      payload.visitor_id,
      expiredId
    );

    assert.equal(
      payload.visitor_is_returning,
      false
    );

    assert.equal(
      localStorage.removes,
      1
    );
  }
);

test(
  'Do Not Track prevents visitor storage access and collection',
  () => {
    const localStorage =
      new StorageMock();

    const result = runTracker({
      localStorage,
      dnt: '1',
    });

    assert.equal(
      result.requests.length,
      0
    );

    assert.equal(localStorage.gets, 0);
    assert.equal(localStorage.sets, 0);
    assert.equal(localStorage.removes, 0);
  }
);

test(
  'existing tab opt-out prevents visitor storage access and collection',
  () => {
    const localStorage =
      new StorageMock();

    const sessionStorage =
      new StorageMock({
        bs_analytics_opt_out_v1: '1',
      });

    const result = runTracker({
      localStorage,
      sessionStorage,
    });

    assert.equal(
      result.requests.length,
      0
    );

    assert.equal(localStorage.gets, 0);
    assert.equal(localStorage.sets, 0);
    assert.equal(localStorage.removes, 0);
  }
);

test(
  'returning activity does not extend visitor expiration',
  () => {
    const localStorage =
      new StorageMock();

    const first = runTracker({
      localStorage,
      sessionStorage:
        new StorageMock(),
    });

    assert.equal(
      first.requests.length,
      1
    );

    const original = JSON.parse(
      localStorage.getItem(
        VISITOR_KEY
      )
    );

    assert.equal(
      localStorage.sets,
      1
    );

    const second = runTracker({
      localStorage,
      sessionStorage:
        new StorageMock(),
    });

    assert.equal(
      second.requests.length,
      1
    );

    assert.equal(
      second.requests[0].payload
        .visitor_is_returning,
      true
    );

    const afterReturn = JSON.parse(
      localStorage.getItem(
        VISITOR_KEY
      )
    );

    assert.equal(
      afterReturn.id,
      original.id
    );

    assert.equal(
      afterReturn.createdAt,
      original.createdAt
    );

    assert.equal(
      afterReturn.expiresAt,
      original.expiresAt
    );

    assert.equal(
      localStorage.sets,
      1,
      'Returning activity must not rewrite or extend the visitor record'
    );
  }
);
