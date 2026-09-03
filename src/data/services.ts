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
    slug: 'adhd-coaching',
    title: 'ADHD Coaching',
    href: '/services/adhd-coaching/',
    description:
      'Practical coaching for adults who want better systems for attention, planning, follow-through, and daily life.',
    summary:
      'Build structures that reduce friction without expecting your brain to work like someone else’s.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
  {
    slug: 'executive-function-coaching',
    title: 'Executive Function Coaching',
    href: '/services/executive-function-coaching/',
    description:
      'Support for planning, organization, prioritization, time awareness, task initiation, and follow-through.',
    summary:
      'Turn vague intentions into visible systems, manageable next steps, and repeatable routines.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
  {
    slug: 'student-coaching',
    title: 'College & Student Coaching',
    href: '/services/student-coaching/',
    description:
      'Coaching for college students navigating workload, independence, deadlines, routines, and competing priorities.',
    summary:
      'Create a workable structure for school without relying on panic, memory, or last-minute pressure.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
  {
    slug: 'professional-coaching',
    title: 'Career & Professional Coaching',
    href: '/services/professional-coaching/',
    description:
      'Executive-function coaching for professionals managing complex workloads, competing priorities, and demanding roles.',
    summary:
      'Build systems for focus, communication, planning, and execution that hold up in real work.',
    showOnHome: true,
    published: true,
    hasDetailPage: true,
  },
];

export const homepageServices = services.filter((service) => service.showOnHome);
