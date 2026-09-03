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
  approachLinks?: { href: string; label: string }[];
}

export const servicePages: Record<string, ServicePageContent> = {
  'trauma-ptsd': {
    title: 'Trauma Therapy in Madison, Wisconsin',
    description:
      'Individual trauma therapy with Jordan Ellis, LPC, for adults in Madison, Wisconsin.',
    hero:
      'Your system may still be responding to something that is over—or to something that never felt fully over.',
    leadTitle: 'The response makes sense, even when it has become exhausting.',
    lead: [
      'After an overwhelming experience, the mind and body can keep scanning, bracing, avoiding, or shutting down. These reactions may have helped you get through something difficult. Later, they can interfere with sleep, concentration, trust, connection, or ordinary routines.',
      'Therapy begins by understanding what is happening now. You are not required to recount every detail, move faster than feels manageable, or make the experience the center of your identity.',
    ],
    experiencesTitle: 'Patterns worth noticing',
    experiences: [
      'Feeling alert even when nothing obvious is wrong',
      'Avoiding reminders, conversations, places, or emotions',
      'Intrusive memories, dreams, or strong reactions to cues',
      'Numbness, disconnection, or difficulty staying present',
      'Shame, self-blame, or changes in trust',
      'Physical tension or alarm that is difficult to settle',
    ],
    approachTitle: 'Stability first. Then careful, collaborative work.',
    approach: [
      'Jordan may begin with present-day patterns, resources, and ways to regain a sense of choice when a response takes over. From there, counseling can examine what keeps the pattern active and what helps it loosen.',
      'IFS concepts, Somatic Experiencing, body awareness, and mindfulness may be incorporated when they fit the client and the work. Method and pace are discussed rather than assumed.',
    ],
    wholePersonTitle: 'Trauma-informed does not mean trauma-only.',
    wholePerson: [
      'The work can include relationships, identity, work, boundaries, grief, and the life you want beyond symptom management. The difficult experience matters, but it is not the whole picture.',
    ],
    related: [
      { slug: 'anxiety-stress', label: 'Explore anxiety and stress support' },
    ],
    approachLinks: [
      { href: '/approaches/internal-family-systems/', label: 'Internal Family Systems' },
      { href: '/approaches/somatic-experiencing/', label: 'Somatic Experiencing' },
    ],
  },

  'anxiety-stress': {
    title: 'Anxiety Therapy in Madison, Wisconsin',
    description:
      'Individual counseling for anxiety, chronic stress, worry, and overwhelm with Jordan Ellis, LPC, in Madison.',
    hero:
      'When your mind stays three steps ahead and your body rarely gets the message that it can stand down.',
    leadTitle: 'Being prepared for everything can become its own form of exhaustion.',
    lead: [
      'Anxiety can look like racing thoughts, but it can also look like overpreparing, indecision, irritability, perfectionism, constant problem-solving, or difficulty resting without guilt.',
      'Counseling can help map the cycle: what triggers it, what your mind predicts, what your body does next, and which responses provide short-term relief while keeping the pattern in place.',
    ],
    experiencesTitle: 'Signals the cycle may be running',
    experiences: [
      'Replaying conversations or anticipating every possible outcome',
      'Tension, restlessness, shallow breathing, or disrupted sleep',
      'Perfectionism and fear of making the wrong choice',
      'Avoiding tasks because beginning feels overwhelming',
      'Difficulty being present when there is still something unfinished',
      'Feeling responsible for keeping everyone or everything okay',
    ],
    approachTitle: 'Make the pattern visible, then create room for another response.',
    approach: [
      'Sessions may combine practical observation with exploration of beliefs, protective strategies, earlier experiences, and nervous-system cues. The goal is not to eliminate every uncertain thought; it is to reduce how completely anxiety organizes your choices.',
      'Jordan may incorporate body-informed practices, mindfulness, or IFS concepts alongside direct conversation and real-life experiments.',
    ],
    related: [
      { slug: 'trauma-ptsd', label: 'Explore trauma and difficult experiences' },
    ],
    approachLinks: [
      { href: '/approaches/somatic-experiencing/', label: 'Somatic Experiencing' },
      { href: '/approaches/', label: 'View the approach map' },
    ],
  },

  'depression-emotional-disconnection': {
    title: 'Depression Therapy in Madison, Wisconsin',
    description:
      'Counseling for depression, shutdown, low mood, and emotional disconnection with Jordan Ellis, LPC.',
    hero:
      'Life may still be moving, even while you feel increasingly absent from it.',
    leadTitle: 'Disconnection is not always obvious sadness.',
    lead: [
      'It may feel like low energy, numbness, irritation, reduced interest, or the effort of completing each day on autopilot. You may appear capable while privately feeling far away from yourself and other people.',
      'Therapy creates a place to examine what has gone quiet, what has become too heavy, and what may be protecting you through withdrawal or shutdown.',
    ],
    experiencesTitle: 'What disconnection can look like',
    experiences: [
      'Going through routines without feeling engaged',
      'Pulling away from people, interests, or responsibilities',
      'Harsh internal criticism or a persistent sense of failure',
      'Low energy, reduced concentration, or difficulty beginning',
      'Feeling emotionally flat, unreachable, or stuck',
      'Wanting change while having little energy to pursue it',
    ],
    approachTitle: 'Begin with contact, not forced positivity.',
    approach: [
      'Jordan may help identify patterns around withdrawal, pressure, self-criticism, grief, exhaustion, or protective shutdown. The work can include small, realistic ways to reconnect with needs, relationships, values, and daily life.',
      'Counseling does not require pretending things feel better than they do. Progress may begin with clearer language, greater choice, and a less adversarial relationship with your current experience.',
    ],
    related: [
      { slug: 'relationship-concerns', label: 'Explore relationship patterns' },
    ],
    approachLinks: [
      { href: '/approaches/internal-family-systems/', label: 'Internal Family Systems' },
      { href: '/approaches/', label: 'View the approach map' },
    ],
  },

  'relationship-concerns': {
    title: 'Individual Therapy for Relationship Patterns | Madison, WI',
    description:
      'Individual counseling for boundaries, trust, conflict, and recurring relationship patterns in Madison, Wisconsin.',
    hero:
      'Understand what happens between the moment you feel threatened and the moment the familiar pattern takes over.',
    leadTitle: 'The same protective move can solve one problem and create another.',
    lead: [
      'You may become quiet, argumentative, accommodating, distant, intensely self-reliant, or focused on restoring connection at any cost. These reactions often have a history and a purpose—even when they no longer produce the relationship you want.',
      'Individual therapy offers space to study your side of the pattern: what you notice, what you fear, what you need, and where choice tends to disappear.',
    ],
    experiencesTitle: 'Patterns you may want to understand',
    experiences: [
      'Difficulty naming needs before resentment builds',
      'People-pleasing, overfunctioning, or unclear boundaries',
      'Recurring conflict that follows a familiar sequence',
      'Fear of closeness, rejection, dependence, or abandonment',
      'Carrying expectations from earlier relationships into current ones',
      'Uncertainty about whether to repair, change, or leave',
    ],
    approachTitle: 'Slow the sequence down enough to see it.',
    approach: [
      'Counseling may examine emotional cues, attachment needs, assumptions, body responses, and the strategies you use to protect yourself or preserve connection.',
      'This is individual therapy rather than couples counseling. The work does not assign blame or decide what you should do. It helps you understand your experience and act with greater clarity.',
    ],
    related: [
      { slug: 'depression-emotional-disconnection', label: 'Explore depression and disconnection' },
    ],
    approachLinks: [
      { href: '/approaches/internal-family-systems/', label: 'Internal Family Systems' },
      { href: '/approaches/', label: 'Emotion- and attachment-focused work' },
    ],
  },
};
