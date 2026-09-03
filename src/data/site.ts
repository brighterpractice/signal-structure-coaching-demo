export const practice = {
 name: 'Signal & Structure Coaching',
 shortName: 'Signal & Structure',
 city: 'Minneapolis',
 state: 'Minnesota',
 stateAbbreviation: 'MN',
 address: 'Minneapolis, Minnesota',
 phone: '(612) 555-0148',
 email: 'hello@example.com',
 tagline: 'Build systems that work with your brain.',
 serviceLine: 'ADHD & executive-function coaching',
};

export const appointmentUrl = '/contact/';

export const externalLinkAttrs = (target?: string) =>
  target === '_blank'
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {
        target,
        rel: undefined,
      };

export const site = {
 publicUrl: 'https://signal-structure.brightersites.app',
 practice,
};
