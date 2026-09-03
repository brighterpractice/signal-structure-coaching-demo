(() => {
  'use strict';

  try {
    const configNode = document.querySelector(
      'script[data-bs-analytics-config]'
    );

    if (!configNode) return;

    let config;

    try {
      config = JSON.parse(configNode.textContent || '');
    } catch {
      return;
    }

    if (
      !config ||
      typeof config.collectorUrl !== 'string' ||
      typeof config.siteKey !== 'string' ||
      typeof config.scriptVersion !== 'string'
    ) {
      return;
    }

    const SESSION_KEY = 'bs_analytics_session_v2';
    const VISITOR_KEY = 'bs_analytics_visitor_v2';

    // Preserve the existing tab-scoped opt-out key so an
    // already opted-out tab remains opted out after v2 deploys.
    const OPTOUT_KEY = 'bs_analytics_opt_out_v1';

    const INACTIVITY_MS = 30 * 60 * 1000;
    const ABSOLUTE_MS = 24 * 60 * 60 * 1000;
    const VISITOR_LIFETIME_MS =
      180 * 24 * 60 * 60 * 1000;

    const UUID_PATTERN =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const privacyDisabled = () => {
      try {
        const dnt = String(
          navigator.doNotTrack ||
          window.doNotTrack ||
          navigator.msDoNotTrack ||
          ''
        ).toLowerCase();

        const meta = document.querySelector(
          'meta[name="brighter-sites-analytics"]'
        );

        return (
          navigator.globalPrivacyControl === true ||
          dnt === '1' ||
          dnt === 'yes' ||
          window.brighterSitesAnalyticsOptOut === true ||
          meta?.getAttribute('content')?.toLowerCase() === 'off' ||
          sessionStorage.getItem(OPTOUT_KEY) === '1'
        );
      } catch {
        return true;
      }
    };

    if (privacyDisabled()) return;

    const uuid = () => {
      try {
        return crypto.randomUUID();
      } catch {
        return null;
      }
    };

    const now = () => Date.now();

    const validUuid = (value) =>
      typeof value === 'string' &&
      UUID_PATTERN.test(value);

    const createVisitor = () => {
      // This check must happen before any visitor
      // localStorage write.
      if (privacyDisabled()) return null;

      const id = uuid();

      if (!id) return null;

      const timestamp = now();

      const visitor = {
        id,
        createdAt: timestamp,
        expiresAt:
          timestamp + VISITOR_LIFETIME_MS,
      };

      try {
        localStorage.setItem(
          VISITOR_KEY,
          JSON.stringify(visitor)
        );

        return visitor;
      } catch {
        // Session analytics may continue without
        // persistent visitor recognition.
        return null;
      }
    };

    const readOrCreateVisitor = () => {
      // This check must happen before any visitor
      // localStorage read.
      if (privacyDisabled()) return null;

      let stored;

      try {
        stored =
          localStorage.getItem(VISITOR_KEY);
      } catch {
        return null;
      }

      const timestamp = now();

      if (stored) {
        try {
          const parsed = JSON.parse(stored);

          if (
            parsed &&
            validUuid(parsed.id) &&
            typeof parsed.createdAt === 'number' &&
            typeof parsed.expiresAt === 'number' &&
            parsed.expiresAt - parsed.createdAt ===
              VISITOR_LIFETIME_MS &&
            parsed.expiresAt > timestamp
          ) {
            return {
              id: parsed.id,
              expiresAt: parsed.expiresAt,
              isReturning: true,
            };
          }
        } catch {
          // Invalid visitor state is replaced below.
        }

        try {
          localStorage.removeItem(VISITOR_KEY);
        } catch {
          // A following setItem may still succeed.
        }
      }

      const created = createVisitor();

      if (!created) return null;

      return {
        id: created.id,
        expiresAt: created.expiresAt,
        isReturning: false,
      };
    };

    const saveSession = (session) => {
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify(session)
        );

        return true;
      } catch {
        return false;
      }
    };

    const newSession = () => {
      const id = uuid();

      if (!id) return null;

      const timestamp = now();
      const visitor = readOrCreateVisitor();

      const session = {
        id,
        createdAt: timestamp,
        lastActivityAt: timestamp,
        entrySent: false,

        // Visitor state is deliberately fixed for
        // the lifetime of this session.
        visitorId: visitor?.id ?? null,
        visitorIsReturning:
          visitor?.isReturning ?? null,
        visitorExpiresAt:
          visitor?.expiresAt ?? null,
      };

      return saveSession(session)
        ? session
        : null;
    };

    const validSessionVisitorState = (
      session,
      timestamp
    ) => {
      const noVisitor =
        session.visitorId === null &&
        session.visitorIsReturning === null &&
        session.visitorExpiresAt === null;

      const validVisitor =
        validUuid(session.visitorId) &&
        typeof session.visitorIsReturning ===
          'boolean' &&
        typeof session.visitorExpiresAt ===
          'number' &&
        session.visitorExpiresAt > timestamp;

      return noVisitor || validVisitor;
    };

    const readSession = () => {
      try {
        const parsed = JSON.parse(
          sessionStorage.getItem(SESSION_KEY) || 'null'
        );

        const timestamp = now();

        if (
          !parsed ||
          !validUuid(parsed.id) ||
          typeof parsed.createdAt !== 'number' ||
          typeof parsed.lastActivityAt !== 'number' ||
          typeof parsed.entrySent !== 'boolean' ||
          !validSessionVisitorState(
            parsed,
            timestamp
          ) ||
          timestamp - parsed.lastActivityAt >=
            INACTIVITY_MS ||
          timestamp - parsed.createdAt >=
            ABSOLUTE_MS
        ) {
          return newSession();
        }

        parsed.lastActivityAt = timestamp;

        return saveSession(parsed)
          ? parsed
          : null;
      } catch {
        return newSession();
      }
    };

    const pagePath = () => {
      const value = window.location.pathname || '/';

      if (
        !value.startsWith('/') ||
        value.startsWith('//') ||
        value.includes('?') ||
        value.includes('#') ||
        value.includes('\\')
      ) {
        return '/';
      }

      return value.slice(0, 256);
    };

    const referrerHost = () => {
      if (!document.referrer) return null;

      try {
        const hostname =
          new URL(document.referrer)
            .hostname
            .toLowerCase();

        if (
          !hostname ||
          hostname === window.location.hostname
        ) {
          return null;
        }

        return hostname.slice(0, 253);
      } catch {
        return null;
      }
    };

    const deviceCategory = () => {
      try {
        if (
          window.matchMedia(
            '(max-width: 767px)'
          ).matches
        ) {
          return 'mobile';
        }

        if (
          window.matchMedia(
            '(max-width: 1024px)'
          ).matches
        ) {
          return 'tablet';
        }

        return 'desktop';
      } catch {
        return 'unknown';
      }
    };

    const endpoint =
      config.collectorUrl.replace(/\/$/, '') +
      '/api/analytics/events?site_key=' +
      encodeURIComponent(config.siteKey);

    const deliver = (payload) => {
      const body = JSON.stringify(payload);

      const attempt = (retry) => {
        try {
          fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            keepalive: true,
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
          }).catch(() => {
            if (!retry) {
              window.setTimeout(
                () => attempt(true),
                250
              );
            }
          });
        } catch {
          if (!retry) {
            window.setTimeout(
              () => attempt(true),
              250
            );
          }
        }
      };

      attempt(false);
    };

    const send = (eventName, extra = {}) => {
      if (privacyDisabled()) return;

      const session = readSession();
      const eventId = uuid();

      if (!session || !eventId) return;

      const visitorFields =
        validUuid(session.visitorId) &&
        typeof session.visitorIsReturning ===
          'boolean'
          ? {
              visitor_id: session.visitorId,
              visitor_is_returning:
                session.visitorIsReturning,
            }
          : {};

      deliver({
        site_key: config.siteKey,
        event_id: eventId,
        session_id: session.id,
        event_name: eventName,
        page_path:
          eventName === '404_view'
            ? '/404'
            : pagePath(),
        ...extra,
        ...visitorFields,
      });
    };

    /*
     * Static Brighter Sites themes use data-track as
     * their event vocabulary while sharing the
     * standalone Brighter Sites collector.
     */
    const eventForLink = (link) => {
      const explicit =
        link.getAttribute('data-track') || '';

      const href =
        link.getAttribute('href') || '';

      if (explicit === 'request-appointment') {
        return {
          eventName: 'appointment_click',
          extra: {},
        };
      }

      if (explicit === 'client-portal') {
        return {
          eventName: 'client_portal_click',
          extra: {},
        };
      }

      if (/^tel:/i.test(href)) {
        return {
          eventName: 'phone_click',
          extra: {},
        };
      }

      if (/^mailto:/i.test(href)) {
        return {
          eventName: 'email_click',
          extra: {},
        };
      }

      try {
        const url = new URL(
          link.href,
          window.location.href
        );

        const serviceMatch =
          explicit.match(
            /^service-([a-z0-9][a-z0-9_-]{0,79})$/
          );

        if (
          serviceMatch &&
          url.origin === window.location.origin &&
          url.pathname.startsWith('/services/')
        ) {
          return {
            eventName: 'service_click',
            extra: {
              content_key: serviceMatch[1],
            },
          };
        }

        const normalizedPath =
          url.pathname.replace(/\/$/, '') || '/';

        if (
          url.origin === window.location.origin &&
          normalizedPath === '/contact' &&
          url.searchParams
            .get('intent')
            ?.toLowerCase() === 'appointment'
        ) {
          return {
            eventName: 'appointment_click',
            extra: {},
          };
        }

        if (
          explicit === 'outbound' &&
          /^https?:$/.test(url.protocol) &&
          url.hostname !== window.location.hostname
        ) {
          return {
            eventName: 'outbound_click',
            extra: {
              destination_host:
                url.hostname
                  .toLowerCase()
                  .slice(0, 253),
            },
          };
        }
      } catch {
        // Ignore malformed links.
      }

      return null;
    };

    const is404 =
      document.documentElement.getAttribute(
        'data-bs-analytics-page'
      ) === '404';

    const session = readSession();

    if (session) {
      const isEntry = !session.entrySent;

      session.entrySent = true;
      session.lastActivityAt = now();

      if (saveSession(session)) {
        send(
          is404 ? '404_view' : 'page_view',
          {
            is_entry: isEntry,
            referrer_host: referrerHost(),
            device_category: deviceCategory(),
          }
        );
      }
    }

    document.addEventListener(
      'click',
      (event) => {
        try {
          if (privacyDisabled()) return;

          const target = event.target;

          if (!(target instanceof Element)) {
            return;
          }

          const link =
            target.closest('a[href]');

          if (!link) return;

          const analyticsEvent =
            eventForLink(link);

          if (!analyticsEvent) return;

          send(
            analyticsEvent.eventName,
            analyticsEvent.extra
          );
        } catch {
          // Analytics must never interrupt navigation.
        }
      },
      {
        capture: true,
        passive: true,
      }
    );
  } catch {
    // Analytics failure must never affect the site.
  }
})();
