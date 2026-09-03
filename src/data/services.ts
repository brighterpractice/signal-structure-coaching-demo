export interface Service {
  slug: string;
  title: string;
  href: string;
  description: string;
  homeDescription?: string;
  summary?: string;
  showOnHome?: boolean;
  published: boolean;
  hasDetailPage?: boolean;
}

export const services: Service[] = [
  {
    slug: 'trauma-ptsd',
    title: 'Trauma & Difficult Experiences',
    href: '/services/trauma-ptsd/',
    description:
      'For reactions that remain active after frightening, overwhelming, or deeply disruptive experiences.',
    summary:
      'When the past keeps showing up in attention, trust, sleep, relationships, or the body.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
  {
    slug: 'anxiety-stress',
    title: 'Anxiety & Stress',
    href: '/services/anxiety-stress/',
    description:
      'For worry, vigilance, perfectionism, overload, and the physical effort of always staying prepared.',
    summary:
      'When your mind stays three steps ahead and your body rarely gets the message that it can stand down.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
  {
    slug: 'depression-emotional-disconnection',
    title: 'Depression & Disconnection',
    href: '/services/depression-emotional-disconnection/',
    description:
      'For low mood, emotional distance, loss of interest, shutdown, and the sense that life is happening without you.',
    summary:
      'When you are functioning on the outside but feel distant, depleted, or absent from your own life.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
  {
    slug: 'relationship-concerns',
    title: 'Relationship Patterns',
    href: '/services/relationship-concerns/',
    description:
      'Individual therapy for boundaries, trust, conflict, closeness, and reactions that repeat across relationships.',
    summary:
      'When the same conflict, distance, or self-protective response keeps returning in important relationships.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
  {
    slug: 'grief-loss',
    title: 'Grief & Loss',
    href: '/services/',
    description:
      'Room for loss, mixed emotions, changed roles, and the practical work of living in a life that now feels different.',
    published: true,
  },
  {
    slug: 'chronic-pain-chronic-illness',
    title: 'Chronic Pain & Illness',
    href: '/services/',
    description:
      'Support for the emotional, relational, and identity changes that can accompany ongoing health concerns.',
    published: true,
  },
  {
    slug: 'life-transitions',
    title: 'Life Transitions',
    href: '/services/',
    description:
      'A place to think clearly during changes in work, family, identity, health, relationships, or direction.',
    published: true,
  },
  {
    slug: 'self-esteem-personal-growth',
    title: 'Identity, Boundaries & Growth',
    href: '/services/',
    description:
      'Focused work around self-trust, values, boundaries, internal criticism, and choices that fit more honestly.',
    published: true,
  },
];

export const homepageServices = services.filter((service) => service.showOnHome);
