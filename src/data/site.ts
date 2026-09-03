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
export const clientPortalUrl = '#';

export const externalLinkAttrs = () => ({
 target: '_blank',
 rel: 'noopener noreferrer',
});

export const site = {
 publicUrl: 'https://signal-structure.brightersites.app',
 practice,

 // Temporary inherited profile data.
 // This will be replaced when the coaching About/profile pages are rebuilt.
 clinician: {
 name: 'Jordan Ellis',
 credentials: 'LPC',
 title: 'Licensed Professional Counselor',
 },
};
