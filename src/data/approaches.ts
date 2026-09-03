export interface Approach {
  slug: string;
  title: string;
  seoTitle?: string;
  shortTitle: string;
  href: string;
  description: string;
  cardDescription: string;
  hero: string;
  whatItIsTitle: string;
  whatItIs: string[];
  sessionTitle: string;
  session: string[];
  considerationsTitle: string;
  considerations: string[];
  related: { label: string; href: string }[];
}

export const approaches: Approach[] = [
  {
    slug: 'internal-family-systems',
    title: 'Internal Family Systems (IFS)',
    seoTitle: 'IFS Therapy | Madison, WI',
    shortTitle: 'IFS',
    href: '/approaches/internal-family-systems/',
    description:
      'A clear introduction to how Jordan Ellis may use Internal Family Systems concepts in individual therapy.',
    cardDescription:
      'A way to understand conflicting inner reactions without treating any part of you as the enemy.',
    hero:
      'A framework for making sense of the parts of you that push, protect, criticize, withdraw, or want different things.',
    whatItIsTitle: 'Conflict inside does not mean something is wrong with you.',
    whatItIs: [
      'You may want closeness and pull away from it. One part of you may demand change while another insists that staying exactly as you are is safer. IFS offers language for approaching these reactions as parts with roles, histories, and protective intentions.',
      'Instead of arguing with a reaction or trying to remove it, the work asks what it is protecting, what it expects would happen if it stopped, and what it may need now.',
    ],
    sessionTitle: 'Notice the reaction. Separate from it. Get curious.',
    session: [
      'Jordan may help you identify an internal voice, emotion, image, impulse, or body cue and create enough space to observe it without being completely overtaken by it.',
      'You do not need to adopt special terminology or visualize parts in a particular way. The framework can remain practical and can be combined with direct conversation, somatic awareness, or other methods.',
    ],
    considerationsTitle: 'You remain in charge of the pace and language.',
    considerations: [
      'No part has to be confronted or disclosed before you are ready.',
      'The framework is adapted to the person rather than followed as a script.',
      'IFS may be one part of counseling, not the entire process.',
    ],
    related: [
      { label: 'Trauma & Difficult Experiences', href: '/services/trauma-ptsd/' },
      { label: 'Relationship Patterns', href: '/services/relationship-concerns/' },
      { label: 'Meet Jordan', href: '/about/jordan-ellis/' },
    ],
  },
  {
    slug: 'somatic-experiencing',
    title: 'Somatic Experiencing & Body-Informed Therapy',
    seoTitle: 'Somatic Experiencing Therapy | Madison, WI',
    shortTitle: 'Somatic Experiencing',
    href: '/approaches/somatic-experiencing/',
    description:
      'How Jordan Ellis may use Somatic Experiencing and body-informed practices in individual therapy.',
    cardDescription:
      'A method that includes the body’s signals without assuming every problem begins—or ends—in the body.',
    hero:
      'Sometimes the body registers a change before the mind has words for it.',
    whatItIsTitle: 'Tension, distance, energy, movement, and breath can all carry information.',
    whatItIs: [
      'Stress and emotion can appear through bracing, restlessness, numbness, changes in breathing, tightness, temperature, energy, or the urge to move toward or away from something.',
      'Somatic Experiencing and related body-informed practices can help notice these shifts in manageable amounts and explore what increases steadiness, choice, or connection to the present.',
    ],
    sessionTitle: 'The work can be subtle and brief.',
    session: [
      'Jordan may ask what you notice physically while discussing an experience, then slow down to observe whether the sensation changes. A session may include posture, movement, orientation to the room, or attention to breathing.',
      'Body awareness is an invitation, not a requirement. It can be shortened, adjusted, or set aside at any time.',
    ],
    considerationsTitle: 'The body is useful information—not the only information.',
    considerations: [
      'Physical symptoms are not automatically interpreted as psychological.',
      'Conversation and reflection remain central parts of therapy.',
      'Medical concerns stay within the care of appropriate healthcare professionals.',
    ],
    related: [
      { label: 'Trauma & Difficult Experiences', href: '/services/trauma-ptsd/' },
      { label: 'Anxiety & Stress', href: '/services/anxiety-stress/' },
      { label: 'Meet Jordan', href: '/about/jordan-ellis/' },
    ],
  },
  {
    slug: 'emotionally-focused-therapy',
    title: 'Emotion- & Attachment-Focused Work',
    shortTitle: 'Emotion & attachment',
    href: '/approaches/',
    description:
      'Emotion- and attachment-focused principles in individual counseling.',
    cardDescription:
      'A way to examine the needs and fears beneath recurring reactions in important relationships.',
    hero: '',
    whatItIsTitle: '',
    whatItIs: [],
    sessionTitle: '',
    session: [],
    considerationsTitle: '',
    considerations: [],
    related: [],
  },
  {
    slug: 'mindfulness-based-therapy',
    title: 'Present-Moment Awareness',
    shortTitle: 'Present-moment awareness',
    href: '/approaches/',
    description:
      'Practical present-moment awareness within individual counseling.',
    cardDescription:
      'Brief ways to notice thoughts, emotions, attention, and body cues before reacting automatically.',
    hero: '',
    whatItIsTitle: '',
    whatItIs: [],
    sessionTitle: '',
    session: [],
    considerationsTitle: '',
    considerations: [],
    related: [],
  },
];

export const detailApproachSlugs = new Set([
  'internal-family-systems',
  'somatic-experiencing',
]);
