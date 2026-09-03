export interface ServicePageContent {
  title: string;
  description: string;
  hero: string;
  leadTitle: string;
  lead: string[];
  experiencesTitle: string;
  experiencesIntro?: string;
  experiences: string[];
  approachTitle: string;
  approach: string[];
  wholePersonTitle?: string;
  wholePerson?: string[];
  related?: { slug: string; label: string }[];
}

export const servicePages: Record<string, ServicePageContent> = {
  'adhd-coaching': {
    title: 'ADHD Coaching | Signal & Structure Coaching',
    description:
      'Practical ADHD coaching for adults who want better systems for attention, planning, organization, and follow-through.',
    hero:
      'Build systems around the way your attention actually works instead of repeatedly forcing strategies that do not stick.',
    leadTitle: 'Start with the friction that keeps repeating.',
    lead: [
      'Coaching can help make everyday obstacles more visible and turn them into practical systems you can test, adjust, and use.',
    ],
    experiencesTitle: 'Areas we may work on',
    experiences: [
      'Starting tasks without waiting for urgency',
      'Planning realistically instead of overloading the day',
      'Keeping important information visible',
      'Following through after the initial motivation fades',
      'Managing transitions between tasks and responsibilities',
      'Building routines that are flexible enough to survive real life',
    ],
    approachTitle: 'Observe, design, test, adjust.',
    approach: [
      'Coaching focuses on the systems around the problem: what is expected, where friction appears, what currently happens, and what could make the next step easier to see and complete.',
    ],
    related: [
      { slug: 'executive-function-coaching', label: 'Explore executive function coaching' },
    ],
  },

  'executive-function-coaching': {
    title: 'Executive Function Coaching | Signal & Structure Coaching',
    description:
      'Executive-function coaching for planning, organization, time awareness, prioritization, task initiation, and follow-through.',
    hero:
      'When knowing what to do is not the same thing as being able to organize and execute it consistently.',
    leadTitle: 'Make the invisible parts of getting things done visible.',
    lead: [
      'Executive-function coaching can help break large demands into clearer decisions, external supports, and repeatable processes.',
    ],
    experiencesTitle: 'Areas we may work on',
    experiences: [
      'Prioritizing when everything feels important',
      'Breaking projects into concrete next actions',
      'Estimating time more realistically',
      'Creating systems for reminders and follow-up',
      'Reducing decision overload',
      'Recovering when a routine or plan gets interrupted',
    ],
    approachTitle: 'Create structure outside your head.',
    approach: [
      'The goal is not perfect organization. It is a system that makes priorities easier to see, actions easier to begin, and progress easier to recover when plans change.',
    ],
    related: [
      { slug: 'adhd-coaching', label: 'Explore ADHD coaching' },
    ],
  },

  'student-coaching': {
    title: 'College & Student Coaching | Signal & Structure Coaching',
    description:
      'Coaching for college students who want stronger systems for workload, deadlines, routines, focus, and independent follow-through.',
    hero:
      'College asks you to manage a large amount of structure on your own—often all at once.',
    leadTitle: 'Build a system for school that does not depend on constant urgency.',
    lead: [
      'Student coaching can help turn syllabi, assignments, study plans, and competing responsibilities into a clearer weekly structure.',
    ],
    experiencesTitle: 'Areas we may work on',
    experiences: [
      'Tracking assignments and deadlines',
      'Starting longer projects before they become emergencies',
      'Planning study time around real energy and attention',
      'Balancing school, work, sleep, and personal responsibilities',
      'Building routines across changing class schedules',
      'Recovering after missed deadlines or disrupted weeks',
    ],
    approachTitle: 'Make the semester easier to see.',
    approach: [
      'Together, we can create external systems for planning, prioritization, study routines, and follow-through that fit the demands of school and the way you work best.',
    ],
    related: [
      { slug: 'executive-function-coaching', label: 'Explore executive function coaching' },
    ],
  },

  'professional-coaching': {
    title: 'Career & Professional Coaching | Signal & Structure Coaching',
    description:
      'Coaching for professionals who want better systems for focus, workload, priorities, communication, and execution.',
    hero:
      'Complex work becomes harder when priorities live in too many places and every task competes for attention.',
    leadTitle: 'Build a working system for the role you actually have.',
    lead: [
      'Professional coaching can help clarify workload, create more reliable planning systems, and reduce the amount of work that depends on remembering everything at once.',
    ],
    experiencesTitle: 'Areas we may work on',
    experiences: [
      'Managing competing projects and deadlines',
      'Protecting time for focused work',
      'Preparing for meetings and follow-up',
      'Tracking commitments across multiple systems',
      'Communicating priorities and capacity more clearly',
      'Building routines that scale with responsibility',
    ],
    approachTitle: 'Design around the real demands of your work.',
    approach: [
      'The focus stays practical: identify where work gets lost or delayed, externalize the process, and build structures that support consistent execution.',
    ],
    related: [
      { slug: 'executive-function-coaching', label: 'Explore executive function coaching' },
    ],
  },
};
