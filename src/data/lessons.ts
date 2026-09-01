export type LessonStep =
  | {
      type: "intro";
      title: string;
      body: string;
    }
  | {
      type: "vocab";
      title: string;
      items: { term: string; meaning: string; note?: string }[];
    }
  | {
      type: "phrase";
      title: string;
      phrases: { source: string; target: string }[];
    }
  | {
      type: "check";
      title: string;
      prompt: string;
      options: string[];
      answerIndex: number;
      explanation?: string;
    };

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  unitId: string;
  level: "beginner" | "elementary" | "intermediate";
  estimatedMinutes: number;
  steps: LessonStep[];
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const UNITS: Unit[] = [
  {
    id: "foundations",
    title: "Foundations",
    description: "Sounds, greetings, and the first useful phrases.",
    order: 1,
  },
  {
    id: "everyday",
    title: "Everyday life",
    description: "Food, places, and short exchanges.",
    order: 2,
  },
  {
    id: "travel",
    title: "Travel",
    description: "Getting around with calm, clear language.",
    order: 3,
  },
];

export const LESSONS: Lesson[] = [
  {
    id: "greetings-1",
    slug: "greetings",
    title: "Greetings",
    description: "Say hello and goodbye at any time of day.",
    unitId: "foundations",
    level: "beginner",
    estimatedMinutes: 6,
    steps: [
      {
        type: "intro",
        title: "A soft start",
        body: "French greetings change with the time of day. You only need a few to sound natural.",
      },
      {
        type: "vocab",
        title: "Core words",
        items: [
          { term: "Bonjour", meaning: "Hello / good morning", note: "Until early evening" },
          { term: "Bonsoir", meaning: "Good evening" },
          { term: "Salut", meaning: "Hi / bye", note: "Informal" },
          { term: "Au revoir", meaning: "Goodbye" },
        ],
      },
      {
        type: "phrase",
        title: "Useful lines",
        phrases: [
          { source: "Hello, how are you?", target: "Bonjour, comment allez-vous ?" },
          { source: "I'm fine, thanks.", target: "Ça va bien, merci." },
          { source: "See you soon.", target: "À bientôt." },
        ],
      },
      {
        type: "check",
        title: "Quick check",
        prompt: "Which greeting fits late afternoon into evening?",
        options: ["Bonjour", "Bonsoir", "Au revoir", "Merci"],
        answerIndex: 1,
        explanation: "Bonsoir is used from the late afternoon / evening onward.",
      },
    ],
  },
  {
    id: "polite-1",
    slug: "please-and-thank-you",
    title: "Please & thank you",
    description: "Polite words that open almost every exchange.",
    unitId: "foundations",
    level: "beginner",
    estimatedMinutes: 5,
    steps: [
      {
        type: "intro",
        title: "Small words, big difference",
        body: "S’il vous plaît and merci do most of the work in polite French.",
      },
      {
        type: "vocab",
        title: "Politeness",
        items: [
          { term: "S’il vous plaît", meaning: "Please", note: "Formal / plural" },
          { term: "S’il te plaît", meaning: "Please", note: "Informal" },
          { term: "Merci", meaning: "Thank you" },
          { term: "De rien", meaning: "You’re welcome" },
          { term: "Pardon", meaning: "Excuse me / sorry" },
        ],
      },
      {
        type: "phrase",
        title: "In context",
        phrases: [
          { source: "A coffee, please.", target: "Un café, s’il vous plaît." },
          { source: "Thank you very much.", target: "Merci beaucoup." },
          { source: "Excuse me.", target: "Pardon." },
        ],
      },
      {
        type: "check",
        title: "Quick check",
        prompt: "How do you say “please” to a shop clerk?",
        options: ["S’il te plaît", "S’il vous plaît", "De rien", "Salut"],
        answerIndex: 1,
        explanation: "Use s’il vous plaît with strangers and in formal settings.",
      },
    ],
  },
  {
    id: "numbers-1",
    slug: "numbers-1-to-10",
    title: "Numbers 1–10",
    description: "Count to ten for prices, times, and quantities.",
    unitId: "foundations",
    level: "beginner",
    estimatedMinutes: 7,
    steps: [
      {
        type: "intro",
        title: "Count slowly",
        body: "Learn the rhythm first. Clarity matters more than speed.",
      },
      {
        type: "vocab",
        title: "1 to 10",
        items: [
          { term: "un / une", meaning: "1" },
          { term: "deux", meaning: "2" },
          { term: "trois", meaning: "3" },
          { term: "quatre", meaning: "4" },
          { term: "cinq", meaning: "5" },
          { term: "six", meaning: "6" },
          { term: "sept", meaning: "7" },
          { term: "huit", meaning: "8" },
          { term: "neuf", meaning: "9" },
          { term: "dix", meaning: "10" },
        ],
      },
      {
        type: "check",
        title: "Quick check",
        prompt: "What is “seven” in French?",
        options: ["six", "sept", "huit", "cinq"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "cafe-1",
    slug: "at-the-cafe",
    title: "At the café",
    description: "Order a drink without rushing.",
    unitId: "everyday",
    level: "elementary",
    estimatedMinutes: 8,
    steps: [
      {
        type: "intro",
        title: "A quiet table",
        body: "You can order almost anything with je voudrais… and s’il vous plaît.",
      },
      {
        type: "vocab",
        title: "Drinks",
        items: [
          { term: "un café", meaning: "a coffee" },
          { term: "un thé", meaning: "a tea" },
          { term: "un jus d’orange", meaning: "an orange juice" },
          { term: "de l’eau", meaning: "some water" },
          { term: "l’addition", meaning: "the bill" },
        ],
      },
      {
        type: "phrase",
        title: "Ordering",
        phrases: [
          { source: "I would like a coffee, please.", target: "Je voudrais un café, s’il vous plaît." },
          { source: "The bill, please.", target: "L’addition, s’il vous plaît." },
          { source: "For here or to go?", target: "Sur place ou à emporter ?" },
        ],
      },
      {
        type: "check",
        title: "Quick check",
        prompt: "How do you ask for the bill?",
        options: [
          "Un café, s’il vous plaît.",
          "L’addition, s’il vous plaît.",
          "À bientôt.",
          "Comment allez-vous ?",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "directions-1",
    slug: "simple-directions",
    title: "Simple directions",
    description: "Left, right, and straight ahead.",
    unitId: "travel",
    level: "elementary",
    estimatedMinutes: 7,
    steps: [
      {
        type: "intro",
        title: "Finding your way",
        body: "A few direction words are enough for short walks in a new city.",
      },
      {
        type: "vocab",
        title: "Directions",
        items: [
          { term: "à gauche", meaning: "to the left" },
          { term: "à droite", meaning: "to the right" },
          { term: "tout droit", meaning: "straight ahead" },
          { term: "près de", meaning: "near" },
          { term: "loin de", meaning: "far from" },
        ],
      },
      {
        type: "phrase",
        title: "Asking the way",
        phrases: [
          { source: "Where is the station?", target: "Où est la gare ?" },
          { source: "Is it far?", target: "C’est loin ?" },
          { source: "Go straight ahead.", target: "Allez tout droit." },
        ],
      },
      {
        type: "check",
        title: "Quick check",
        prompt: "“Tout droit” means…",
        options: ["to the left", "to the right", "straight ahead", "near"],
        answerIndex: 2,
      },
    ],
  },
  {
    id: "travel-phrases-1",
    slug: "travel-phrases",
    title: "Travel phrases",
    description: "Tickets, platforms, and polite requests on the move.",
    unitId: "travel",
    level: "intermediate",
    estimatedMinutes: 8,
    steps: [
      {
        type: "intro",
        title: "On the move",
        body: "Keep these ready for stations, airports, and ticket counters.",
      },
      {
        type: "vocab",
        title: "Travel words",
        items: [
          { term: "un billet", meaning: "a ticket" },
          { term: "le train", meaning: "the train" },
          { term: "le quai", meaning: "the platform" },
          { term: "le vol", meaning: "the flight" },
          { term: "retarder", meaning: "to delay" },
        ],
      },
      {
        type: "phrase",
        title: "At the counter",
        phrases: [
          { source: "A ticket to Lyon, please.", target: "Un billet pour Lyon, s’il vous plaît." },
          { source: "Which platform?", target: "Quel quai ?" },
          { source: "Is the train delayed?", target: "Le train est-il en retard ?" },
        ],
      },
      {
        type: "check",
        title: "Quick check",
        prompt: "“Un billet” means…",
        options: ["a platform", "a ticket", "a train", "a delay"],
        answerIndex: 1,
      },
    ],
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug || l.id === slug);
}

export function getLessonsByUnit(unitId: string): Lesson[] {
  return LESSONS.filter((l) => l.unitId === unitId);
}

export function getUnit(unitId: string): Unit | undefined {
  return UNITS.find((u) => u.id === unitId);
}

export function getNextLesson(currentId: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.id === currentId);
  if (idx < 0 || idx >= LESSONS.length - 1) return undefined;
  return LESSONS[idx + 1];
}
