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

 // Field name retained temporarily for inherited schema compatibility.
 clinician: {
 name: 'Avery Reed',
 credentials: '',
 title: 'ADHD & Executive Function Coach',
 },
};
