export type LessonDirection = "en-fr" | "fr-en";

export type LessonStep =
  | {
      type: "intro";
      title: string;
      body: string;
    }
  | {
      type: "tip";
      title: string;
      body: string;
      bullets?: string[];
    }
  | {
      type: "vocab";
      title: string;
      items: { term: string; meaning: string; note?: string }[];
    }
  | {
      type: "phrase";
      title: string;
      sourceLabel?: string;
      targetLabel?: string;
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
  direction: LessonDirection;
  level: "beginner" | "elementary" | "intermediate";
  estimatedMinutes: number;
  steps: LessonStep[];
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  order: number;
  direction: LessonDirection;
};

export const UNITS: Unit[] = [
  {
    id: "foundations",
    title: "Foundations (EN → FR)",
    description: "Greetings, politeness, numbers — English into French.",
    order: 1,
    direction: "en-fr",
  },
  {
    id: "everyday",
    title: "Everyday life (EN → FR)",
    description: "Café, food, and small talk in French.",
    order: 2,
    direction: "en-fr",
  },
  {
    id: "travel",
    title: "Travel (EN → FR)",
    description: "Directions, tickets, and getting around.",
    order: 3,
    direction: "en-fr",
  },
  {
    id: "grammar-core",
    title: "Grammar core (EN → FR)",
    description: "Gender, articles, and present-tense essentials.",
    order: 4,
    direction: "en-fr",
  },
  {
    id: "fr-en-basics",
    title: "Basics (FR → EN)",
    description: "Read French, say it in English — reverse practice.",
    order: 5,
    direction: "fr-en",
  },
  {
    id: "fr-en-daily",
    title: "Daily French → English",
    description: "Everyday French lines decoded into natural English.",
    order: 6,
    direction: "fr-en",
  },
];

function dirLabels(direction: LessonDirection) {
  return direction === "en-fr"
    ? { sourceLabel: "English", targetLabel: "Français" }
    : { sourceLabel: "Français", targetLabel: "English" };
}

export const LESSONS: Lesson[] = [
  {
    id: "greetings-1",
    slug: "greetings",
    title: "Greetings",
    description: "Hello and goodbye across the day, with formality notes.",
    unitId: "foundations",
    direction: "en-fr",
    level: "beginner",
    estimatedMinutes: 10,
    steps: [
      {
        type: "intro",
        title: "A soft start",
        body: "French greetings shift with time of day and how well you know someone. Learn a small set well rather than many poorly.",
      },
      {
        type: "tip",
        title: "Form vs. familiarity",
        body: "Use vous with strangers, older people, and formal situations. Use tu with friends, family, and peers when invited.",
        bullets: [
          "Bonjour works almost all day until evening.",
          "Bonsoir from late afternoon onward.",
          "Salut is friendly and informal — both hi and bye.",
        ],
      },
      {
        type: "vocab",
        title: "Core greetings",
        items: [
          { term: "Bonjour", meaning: "Hello / good morning", note: "Safe default" },
          { term: "Bonsoir", meaning: "Good evening" },
          { term: "Salut", meaning: "Hi / bye", note: "Informal" },
          { term: "Au revoir", meaning: "Goodbye" },
          { term: "À bientôt", meaning: "See you soon" },
          { term: "À demain", meaning: "See you tomorrow" },
          { term: "Bonne journée", meaning: "Have a good day" },
          { term: "Bonne soirée", meaning: "Have a good evening" },
        ],
      },
      {
        type: "phrase",
        title: "Useful lines",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "Hello, how are you? (formal)", target: "Bonjour, comment allez-vous ?" },
          { source: "Hi, how are you? (informal)", target: "Salut, ça va ?" },
          { source: "I'm fine, thanks. And you?", target: "Ça va bien, merci. Et vous ?" },
          { source: "See you soon.", target: "À bientôt." },
          { source: "Have a good day.", target: "Bonne journée." },
        ],
      },
      {
        type: "check",
        title: "Check · time of day",
        prompt: "Which greeting fits late afternoon into evening?",
        options: ["Bonjour", "Bonsoir", "Au revoir", "Merci"],
        answerIndex: 1,
        explanation: "Bonsoir is the natural evening greeting.",
      },
      {
        type: "check",
        title: "Check · formality",
        prompt: "You meet your friend’s parent for the first time. Best choice?",
        options: ["Salut !", "Bonjour, comment allez-vous ?", "Ça va, mec ?", "À demain"],
        answerIndex: 1,
        explanation: "Bonjour + vous keeps things respectful with someone new and older.",
      },
    ],
  },
  {
    id: "polite-1",
    slug: "please-and-thank-you",
    title: "Please & thank you",
    description: "Politeness formulas that open every exchange.",
    unitId: "foundations",
    direction: "en-fr",
    level: "beginner",
    estimatedMinutes: 9,
    steps: [
      {
        type: "intro",
        title: "Small words, big difference",
        body: "French service and street interactions expect s’il vous plaît and merci. Skipping them can sound abrupt even when you don’t mean it.",
      },
      {
        type: "tip",
        title: "Te vs vous in please",
        body: "S’il te plaît is for people you tutoyer. S’il vous plaît is the default with staff and strangers.",
        bullets: [
          "Merci beaucoup = thank you very much.",
          "Je vous en prie / De rien = you’re welcome (formal / casual).",
          "Pardon can mean excuse me or sorry, depending on tone.",
        ],
      },
      {
        type: "vocab",
        title: "Politeness set",
        items: [
          { term: "S’il vous plaît", meaning: "Please", note: "Formal / plural" },
          { term: "S’il te plaît", meaning: "Please", note: "Informal" },
          { term: "Merci", meaning: "Thank you" },
          { term: "Merci beaucoup", meaning: "Thank you very much" },
          { term: "De rien", meaning: "You’re welcome", note: "Casual" },
          { term: "Je vous en prie", meaning: "You’re welcome", note: "Polite" },
          { term: "Pardon", meaning: "Excuse me / sorry" },
          { term: "Excusez-moi", meaning: "Excuse me" },
        ],
      },
      {
        type: "phrase",
        title: "In context",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "A coffee, please.", target: "Un café, s’il vous plaît." },
          { source: "Thank you very much.", target: "Merci beaucoup." },
          { source: "Excuse me (to pass).", target: "Pardon." },
          { source: "Sorry I’m late.", target: "Pardon pour le retard." },
        ],
      },
      {
        type: "check",
        title: "Check · shop",
        prompt: "How do you say “please” to a shop clerk?",
        options: ["S’il te plaît", "S’il vous plaît", "De rien", "Salut"],
        answerIndex: 1,
        explanation: "Use s’il vous plaît with strangers and in shops.",
      },
      {
        type: "check",
        title: "Check · reply",
        prompt: "Someone says merci. A casual reply is…",
        options: ["Bonjour", "De rien", "Au revoir", "S’il vous plaît"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "numbers-1",
    slug: "numbers-1-to-10",
    title: "Numbers 1–10",
    description: "Count clearly for prices, times, and quantities.",
    unitId: "foundations",
    direction: "en-fr",
    level: "beginner",
    estimatedMinutes: 10,
    steps: [
      {
        type: "intro",
        title: "Count slowly",
        body: "French numbers are used constantly — café prices, platform numbers, ages. Rhythm first; speed later.",
      },
      {
        type: "tip",
        title: "Pronunciation notes",
        body: "Liaison and silent letters matter more than perfect accent at this stage.",
        bullets: [
          "Un / une agree with gender (un livre, une pomme).",
          "Six and dix change slightly before a vowel or pause — listen in context.",
          "Learn numbers in short phrases, not only as a list.",
        ],
      },
      {
        type: "vocab",
        title: "1 to 10",
        items: [
          { term: "zéro", meaning: "0" },
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
        type: "phrase",
        title: "Mini uses",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "Two coffees, please.", target: "Deux cafés, s’il vous plaît." },
          { source: "It costs five euros.", target: "Ça coûte cinq euros." },
          { source: "Platform three.", target: "Quai numéro trois." },
        ],
      },
      {
        type: "check",
        title: "Check · seven",
        prompt: "What is “seven” in French?",
        options: ["six", "sept", "huit", "cinq"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · phrase",
        prompt: "“Deux cafés” means…",
        options: ["Ten coffees", "Two coffees", "Twelve coffees", "No coffee"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "introduce-yourself-1",
    slug: "introduce-yourself",
    title: "Introduce yourself",
    description: "Name, origin, and a simple nice-to-meet-you.",
    unitId: "foundations",
    direction: "en-fr",
    level: "beginner",
    estimatedMinutes: 12,
    steps: [
      {
        type: "intro",
        title: "First contact",
        body: "A short self-introduction is enough: name, where you’re from, and a polite close.",
      },
      {
        type: "vocab",
        title: "Building blocks",
        items: [
          { term: "Je m’appelle…", meaning: "My name is…" },
          { term: "Je suis…", meaning: "I am…" },
          { term: "Je viens de…", meaning: "I come from…" },
          { term: "J’habite à…", meaning: "I live in…" },
          { term: "Enchanté(e)", meaning: "Nice to meet you" },
          { term: "Et vous ?", meaning: "And you? (formal)" },
        ],
      },
      {
        type: "tip",
        title: "Enchanté vs enchantée",
        body: "In writing, agreement can follow the speaker’s gender. In speech, Enchanté is widely used.",
      },
      {
        type: "phrase",
        title: "Model intros",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "Hello, my name is Alex.", target: "Bonjour, je m’appelle Alex." },
          { source: "I’m from Canada.", target: "Je viens du Canada." },
          { source: "I live in Lyon.", target: "J’habite à Lyon." },
          { source: "Nice to meet you.", target: "Enchanté." },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“Je m’appelle Sam” means…",
        options: ["I live in Sam", "My name is Sam", "I am from Sam", "See you Sam"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · origin",
        prompt: "Best line for “I come from Belgium”?
",
        options: [
          "J’habite Belgique",
          "Je viens de Belgique",
          "Je m’appelle Belgique",
          "Au revoir Belgique",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "cafe-1",
    slug: "at-the-cafe",
    title: "At the café",
    description: "Order drinks and ask for the bill with confidence.",
    unitId: "everyday",
    direction: "en-fr",
    level: "elementary",
    estimatedMinutes: 12,
    steps: [
      {
        type: "intro",
        title: "A quiet table",
        body: "Je voudrais… plus s’il vous plaît covers most orders. Add numbers and sizes when you need them.",
      },
      {
        type: "tip",
        title: "Café vocabulary culture",
        body: "Un café often means an espresso. Un café allongé is longer; un crème is coffee with milk.",
        bullets: ["Sur place = for here", "À emporter = to go", "L’addition = the bill"],
      },
      {
        type: "vocab",
        title: "Drinks & service",
        items: [
          { term: "un café", meaning: "a coffee (often espresso)" },
          { term: "un café allongé", meaning: "a long coffee" },
          { term: "un thé", meaning: "a tea" },
          { term: "un jus d’orange", meaning: "an orange juice" },
          { term: "de l’eau", meaning: "some water" },
          { term: "une carafe d’eau", meaning: "a jug of tap water" },
          { term: "l’addition", meaning: "the bill" },
          { term: "Je voudrais…", meaning: "I would like…" },
        ],
      },
      {
        type: "phrase",
        title: "Ordering",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "I would like a coffee, please.", target: "Je voudrais un café, s’il vous plaît." },
          { source: "A tea to go, please.", target: "Un thé à emporter, s’il vous plaît." },
          { source: "The bill, please.", target: "L’addition, s’il vous plaît." },
          { source: "For here or to go?", target: "Sur place ou à emporter ?" },
        ],
      },
      {
        type: "check",
        title: "Check · bill",
        prompt: "How do you ask for the bill?",
        options: [
          "Un café, s’il vous plaît.",
          "L’addition, s’il vous plaît.",
          "À bientôt.",
          "Comment allez-vous ?",
        ],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · to go",
        prompt: "“À emporter” means…",
        options: ["For here", "To go", "Very hot", "With sugar"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "food-market-1",
    slug: "at-the-market",
    title: "At the market",
    description: "Fruit, quantities, and polite requests at a stall.",
    unitId: "everyday",
    direction: "en-fr",
    level: "elementary",
    estimatedMinutes: 12,
    steps: [
      {
        type: "intro",
        title: "Market pace",
        body: "Markets reward clear numbers and je voudrais. Pointing plus a word still works — language makes it smoother.",
      },
      {
        type: "vocab",
        title: "Food words",
        items: [
          { term: "une pomme", meaning: "an apple" },
          { term: "une banane", meaning: "a banana" },
          { term: "du pain", meaning: "some bread" },
          { term: "du fromage", meaning: "some cheese" },
          { term: "un kilo de…", meaning: "a kilo of…" },
          { term: "C’est combien ?", meaning: "How much is it?" },
        ],
      },
      {
        type: "phrase",
        title: "At the stall",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "I’d like three apples, please.", target: "Je voudrais trois pommes, s’il vous plaît." },
          { source: "A kilo of tomatoes, please.", target: "Un kilo de tomates, s’il vous plaît." },
          { source: "How much is it?", target: "C’est combien ?" },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“C’est combien ?” asks for…",
        options: ["The time", "The price", "Directions", "A table"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · order",
        prompt: "Best for “three apples, please”?
",
        options: [
          "Trois pommes, s’il vous plaît",
          "Trois cafés, merci",
          "Au revoir pommes",
          "Je m’appelle pomme",
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: "small-talk-1",
    slug: "small-talk-weather",
    title: "Small talk & weather",
    description: "Light conversation beyond hello.",
    unitId: "everyday",
    direction: "en-fr",
    level: "elementary",
    estimatedMinutes: 11,
    steps: [
      {
        type: "intro",
        title: "Beyond bonjour",
        body: "Weather and weekend questions are safe bridges after greetings.",
      },
      {
        type: "vocab",
        title: "Weather & chat",
        items: [
          { term: "Il fait beau", meaning: "The weather is nice" },
          { term: "Il pleut", meaning: "It’s raining" },
          { term: "Il fait froid", meaning: "It’s cold" },
          { term: "Il fait chaud", meaning: "It’s hot" },
          { term: "Le week-end", meaning: "The weekend" },
        ],
      },
      {
        type: "phrase",
        title: "Light exchanges",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "Nice weather today.", target: "Il fait beau aujourd’hui." },
          { source: "It’s raining a lot.", target: "Il pleut beaucoup." },
          { source: "How was your weekend?", target: "Comment était votre week-end ?" },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“Il pleut” means…",
        options: ["It’s sunny", "It’s raining", "It’s windy", "It’s late"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "directions-1",
    slug: "simple-directions",
    title: "Simple directions",
    description: "Left, right, straight — and asking where something is.",
    unitId: "travel",
    direction: "en-fr",
    level: "elementary",
    estimatedMinutes: 11,
    steps: [
      {
        type: "intro",
        title: "Finding your way",
        body: "Combine où est… ? with a few direction words for short walks in a new city.",
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
          { term: "au coin", meaning: "at the corner" },
          { term: "Où est… ?", meaning: "Where is…?" },
        ],
      },
      {
        type: "phrase",
        title: "Asking the way",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "Where is the station?", target: "Où est la gare ?" },
          { source: "Is it far?", target: "C’est loin ?" },
          { source: "Go straight ahead, then left.", target: "Allez tout droit, puis à gauche." },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“Tout droit” means…",
        options: ["to the left", "to the right", "straight ahead", "near"],
        answerIndex: 2,
      },
      {
        type: "check",
        title: "Check · ask",
        prompt: "“Où est la gare ?” asks for…",
        options: ["The price of a ticket", "Where the station is", "The time", "A taxi"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "travel-phrases-1",
    slug: "travel-phrases",
    title: "Travel phrases",
    description: "Tickets, platforms, and delays.",
    unitId: "travel",
    direction: "en-fr",
    level: "intermediate",
    estimatedMinutes: 12,
    steps: [
      {
        type: "intro",
        title: "On the move",
        body: "Stations and airports repeat the same patterns: destination, platform, delay, seat.",
      },
      {
        type: "vocab",
        title: "Travel words",
        items: [
          { term: "un billet", meaning: "a ticket" },
          { term: "aller-retour", meaning: "round trip" },
          { term: "aller simple", meaning: "one-way" },
          { term: "le train", meaning: "the train" },
          { term: "le quai", meaning: "the platform" },
          { term: "le vol", meaning: "the flight" },
          { term: "en retard", meaning: "delayed / late" },
          { term: "à l’heure", meaning: "on time" },
        ],
      },
      {
        type: "phrase",
        title: "At the counter",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "A ticket to Lyon, please.", target: "Un billet pour Lyon, s’il vous plaît." },
          { source: "A round trip to Paris.", target: "Un aller-retour pour Paris." },
          { source: "Which platform?", target: "Quel quai ?" },
          { source: "Is the train delayed?", target: "Le train est-il en retard ?" },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“Un billet” means…",
        options: ["a platform", "a ticket", "a train", "a delay"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · delay",
        prompt: "“En retard” means…",
        options: ["On time", "Cancelled", "Delayed / late", "Full"],
        answerIndex: 2,
      },
    ],
  },
  {
    id: "hotel-1",
    slug: "at-the-hotel",
    title: "At the hotel",
    description: "Check-in lines and simple room requests.",
    unitId: "travel",
    direction: "en-fr",
    level: "intermediate",
    estimatedMinutes: 11,
    steps: [
      {
        type: "intro",
        title: "Front desk",
        body: "Reservation, nights, and room type cover most check-ins.",
      },
      {
        type: "vocab",
        title: "Hotel words",
        items: [
          { term: "une réservation", meaning: "a reservation" },
          { term: "une chambre", meaning: "a room" },
          { term: "une nuit", meaning: "a night" },
          { term: "le passeport", meaning: "passport" },
          { term: "la clé / la carte", meaning: "the key / key card" },
          { term: "le petit-déjeuner", meaning: "breakfast" },
        ],
      },
      {
        type: "phrase",
        title: "Check-in",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "I have a reservation.", target: "J’ai une réservation." },
          { source: "Two nights, please.", target: "Deux nuits, s’il vous plaît." },
          { source: "Is breakfast included?", target: "Le petit-déjeuner est-il inclus ?" },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“J’ai une réservation” means…",
        options: [
          "I need a taxi",
          "I have a reservation",
          "The room is ready",
          "Where is breakfast?",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "articles-gender-1",
    slug: "articles-and-gender",
    title: "Articles & gender",
    description: "Le, la, un, une — why nouns feel gendered.",
    unitId: "grammar-core",
    direction: "en-fr",
    level: "elementary",
    estimatedMinutes: 14,
    steps: [
      {
        type: "intro",
        title: "Every noun has a gender",
        body: "French nouns are masculine or feminine. Articles show that gender. Memorize new nouns with their article.",
      },
      {
        type: "tip",
        title: "Learning habit",
        body: "Don’t learn maison = house. Learn la maison = the house. The article is part of the word for you as a learner.",
        bullets: [
          "le / un → masculine",
          "la / une → feminine",
          "l’ before a vowel sound (l’hôtel, l’eau)",
        ],
      },
      {
        type: "vocab",
        title: "Pairs to notice",
        items: [
          { term: "le livre", meaning: "the book", note: "masculine" },
          { term: "la table", meaning: "the table", note: "feminine" },
          { term: "un café", meaning: "a coffee" },
          { term: "une pomme", meaning: "an apple" },
          { term: "l’eau (f)", meaning: "water" },
          { term: "l’hôtel (m)", meaning: "hotel" },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "Which article fits with pomme (apple)?",
        options: ["le", "la", "les only", "No article ever"],
        answerIndex: 1,
        explanation: "Une/la pomme — feminine.",
      },
      {
        type: "check",
        title: "Check · vowel",
        prompt: "Before a vowel sound, le/la often become…",
        options: ["du", "l’", "des", "au"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "etre-avoir-1",
    slug: "etre-and-avoir",
    title: "Être & avoir (present)",
    description: "The two verbs you’ll use every day.",
    unitId: "grammar-core",
    direction: "en-fr",
    level: "elementary",
    estimatedMinutes: 15,
    steps: [
      {
        type: "intro",
        title: "Workhorses",
        body: "Être (to be) and avoir (to have) appear in descriptions, ages, and many perfect tenses later.",
      },
      {
        type: "vocab",
        title: "Être — present",
        items: [
          { term: "je suis", meaning: "I am" },
          { term: "tu es", meaning: "you are (informal)" },
          { term: "il / elle / on est", meaning: "he / she / one is" },
          { term: "nous sommes", meaning: "we are" },
          { term: "vous êtes", meaning: "you are (formal/plural)" },
          { term: "ils / elles sont", meaning: "they are" },
        ],
      },
      {
        type: "vocab",
        title: "Avoir — present",
        items: [
          { term: "j’ai", meaning: "I have" },
          { term: "tu as", meaning: "you have" },
          { term: "il / elle / on a", meaning: "he / she / one has" },
          { term: "nous avons", meaning: "we have" },
          { term: "vous avez", meaning: "you have" },
          { term: "ils / elles ont", meaning: "they have" },
        ],
      },
      {
        type: "phrase",
        title: "In sentences",
        ...dirLabels("en-fr"),
        phrases: [
          { source: "I am tired.", target: "Je suis fatigué(e)." },
          { source: "She is French.", target: "Elle est française." },
          { source: "I have a reservation.", target: "J’ai une réservation." },
          { source: "We have time.", target: "Nous avons le temps." },
        ],
      },
      {
        type: "check",
        title: "Check · être",
        prompt: "“Je suis” means…",
        options: ["I have", "I am", "I go", "I want"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · avoir",
        prompt: "“J’ai une réservation” uses…",
        options: ["être", "avoir", "aller", "faire"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "fr-en-greetings",
    slug: "fr-en-greetings",
    title: "Salutations → English",
    description: "Common French greetings into natural English.",
    unitId: "fr-en-basics",
    direction: "fr-en",
    level: "beginner",
    estimatedMinutes: 10,
    steps: [
      {
        type: "intro",
        title: "Sens inverse",
        body: "This track starts from French. Read the French line, then map it to English. Ideal for reverse practice or francophone learners of English.",
      },
      {
        type: "tip",
        title: "Register in English too",
        body: "Salut maps to hi, not good morning. Bonjour is closer to hello / good morning depending on time.",
        bullets: [
          "Comment allez-vous ? → How are you? (polite)",
          "Ça va ? → How’s it going? (casual)",
          "À tout à l’heure → See you in a bit",
        ],
      },
      {
        type: "vocab",
        title: "French → meaning",
        items: [
          { term: "Bonjour", meaning: "Hello / Good morning" },
          { term: "Bonsoir", meaning: "Good evening" },
          { term: "Salut", meaning: "Hi / Bye (informal)" },
          { term: "Au revoir", meaning: "Goodbye" },
          { term: "À bientôt", meaning: "See you soon" },
          { term: "Ça va ?", meaning: "How’s it going?" },
          { term: "Comment allez-vous ?", meaning: "How are you? (formal)" },
        ],
      },
      {
        type: "phrase",
        title: "Match the sense",
        ...dirLabels("fr-en"),
        phrases: [
          { source: "Bonjour, comment allez-vous ?", target: "Hello, how are you?" },
          { source: "Salut, ça va ?", target: "Hi, how’s it going?" },
          { source: "Ça va bien, merci. Et vous ?", target: "I’m fine, thanks. And you?" },
          { source: "À demain !", target: "See you tomorrow!" },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "What does “À bientôt” mean in English?",
        options: ["Good evening", "See you soon", "Thank you", "Please"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · formal",
        prompt: "“Comment allez-vous ?” is best rendered as…",
        options: [
          "What’s your name?",
          "How are you? (polite)",
          "Where are you going?",
          "How much is it?",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "fr-en-politeness",
    slug: "fr-en-politeness",
    title: "Politesse → English",
    description: "Please, thanks, and excuse me — from French cues.",
    unitId: "fr-en-basics",
    direction: "fr-en",
    level: "beginner",
    estimatedMinutes: 10,
    steps: [
      {
        type: "intro",
        title: "Formules de politesse",
        body: "Recognizing these quickly helps you respond when someone speaks French to you.",
      },
      {
        type: "vocab",
        title: "Core politeness",
        items: [
          { term: "S’il vous plaît", meaning: "Please (formal)" },
          { term: "S’il te plaît", meaning: "Please (informal)" },
          { term: "Merci", meaning: "Thank you" },
          { term: "Merci beaucoup", meaning: "Thank you very much" },
          { term: "De rien", meaning: "You’re welcome" },
          { term: "Pardon", meaning: "Excuse me / Sorry" },
          { term: "Je suis désolé(e)", meaning: "I’m sorry" },
        ],
      },
      {
        type: "phrase",
        title: "From French lines",
        ...dirLabels("fr-en"),
        phrases: [
          { source: "Un café, s’il vous plaît.", target: "A coffee, please." },
          { source: "Merci beaucoup !", target: "Thank you very much!" },
          { source: "Pardon, excusez-moi.", target: "Sorry — excuse me." },
          { source: "De rien.", target: "You’re welcome." },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“S’il vous plaît” in English is…",
        options: ["Thank you", "Please", "Goodbye", "Hello"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · reply",
        prompt: "A natural English meaning of “De rien” is…",
        options: ["Please", "You’re welcome", "Good morning", "See you"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "fr-en-numbers",
    slug: "fr-en-numbers",
    title: "Nombres → English",
    description: "Recognize French numbers 0–10 in English.",
    unitId: "fr-en-basics",
    direction: "fr-en",
    level: "beginner",
    estimatedMinutes: 9,
    steps: [
      {
        type: "intro",
        title: "Comprendre les chiffres",
        body: "When you see sept, think seven without translating word-by-word every time.",
      },
      {
        type: "vocab",
        title: "0–10",
        items: [
          { term: "zéro", meaning: "zero" },
          { term: "un / une", meaning: "one" },
          { term: "deux", meaning: "two" },
          { term: "trois", meaning: "three" },
          { term: "quatre", meaning: "four" },
          { term: "cinq", meaning: "five" },
          { term: "six", meaning: "six" },
          { term: "sept", meaning: "seven" },
          { term: "huit", meaning: "eight" },
          { term: "neuf", meaning: "nine" },
          { term: "dix", meaning: "ten" },
        ],
      },
      {
        type: "phrase",
        title: "In context",
        ...dirLabels("fr-en"),
        phrases: [
          { source: "Ça coûte cinq euros.", target: "It costs five euros." },
          { source: "Deux cafés, s’il vous plaît.", target: "Two coffees, please." },
          { source: "Quai numéro trois.", target: "Platform number three." },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“Huit” means…",
        options: ["six", "seven", "eight", "nine"],
        answerIndex: 2,
      },
      {
        type: "check",
        title: "Check · phrase",
        prompt: "“Deux cafés” is…",
        options: ["Ten coffees", "Two coffees", "Twelve coffees", "No coffee"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "fr-en-cafe",
    slug: "fr-en-at-the-cafe",
    title: "Au café → English",
    description: "Understand café French and answer in English.",
    unitId: "fr-en-daily",
    direction: "fr-en",
    level: "elementary",
    estimatedMinutes: 12,
    steps: [
      {
        type: "intro",
        title: "Au comptoir",
        body: "Staff might ask Sur place ou à emporter ? Knowing the English meaning keeps you calm at the counter.",
      },
      {
        type: "vocab",
        title: "Café French",
        items: [
          { term: "Je voudrais…", meaning: "I would like…" },
          { term: "un café", meaning: "a coffee" },
          { term: "l’addition", meaning: "the bill / check" },
          { term: "sur place", meaning: "for here" },
          { term: "à emporter", meaning: "to go" },
          { term: "une carafe d’eau", meaning: "a jug of water" },
        ],
      },
      {
        type: "phrase",
        title: "What they said",
        ...dirLabels("fr-en"),
        phrases: [
          { source: "Je voudrais un café, s’il vous plaît.", target: "I would like a coffee, please." },
          { source: "Sur place ou à emporter ?", target: "For here or to go?" },
          { source: "L’addition, s’il vous plaît.", target: "The bill, please." },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“À emporter” means…",
        options: ["For here", "To go", "Extra hot", "With milk"],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · bill",
        prompt: "“L’addition” is…",
        options: ["The menu", "The bill", "The tip", "The table"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "fr-en-directions",
    slug: "fr-en-directions",
    title: "Directions → English",
    description: "Decode French direction phrases into clear English.",
    unitId: "fr-en-daily",
    direction: "fr-en",
    level: "elementary",
    estimatedMinutes: 11,
    steps: [
      {
        type: "intro",
        title: "Dans la rue",
        body: "Someone answers in French — pick out tout droit, à gauche, à droite.",
      },
      {
        type: "vocab",
        title: "Direction cues",
        items: [
          { term: "à gauche", meaning: "to the left" },
          { term: "à droite", meaning: "to the right" },
          { term: "tout droit", meaning: "straight ahead" },
          { term: "C’est loin ?", meaning: "Is it far?" },
          { term: "C’est à côté", meaning: "It’s nearby / next door" },
          { term: "au bout de la rue", meaning: "at the end of the street" },
        ],
      },
      {
        type: "phrase",
        title: "What you might hear",
        ...dirLabels("fr-en"),
        phrases: [
          { source: "Allez tout droit, puis à gauche.", target: "Go straight ahead, then left." },
          { source: "C’est à côté de la gare.", target: "It’s next to the station." },
          { source: "Ce n’est pas loin.", target: "It’s not far." },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“Puis à gauche” means…",
        options: ["Then right", "Then left", "Go back", "Stop here"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "fr-en-travel",
    slug: "fr-en-travel",
    title: "Voyage → English",
    description: "Station and ticket French into plain English.",
    unitId: "fr-en-daily",
    direction: "fr-en",
    level: "intermediate",
    estimatedMinutes: 12,
    steps: [
      {
        type: "intro",
        title: "Gare & aéroport",
        body: "Announcements recycle billet, quai, en retard. Map them to English automatically.",
      },
      {
        type: "vocab",
        title: "Travel French",
        items: [
          { term: "un billet", meaning: "a ticket" },
          { term: "aller-retour", meaning: "round trip" },
          { term: "le quai", meaning: "the platform" },
          { term: "en retard", meaning: "delayed / late" },
          { term: "à l’heure", meaning: "on time" },
          { term: "correspondance", meaning: "connection (transfer)" },
        ],
      },
      {
        type: "phrase",
        title: "Counter & board",
        ...dirLabels("fr-en"),
        phrases: [
          { source: "Un billet pour Lyon, s’il vous plaît.", target: "A ticket to Lyon, please." },
          { source: "Le train est en retard.", target: "The train is delayed." },
          { source: "Quel quai ?", target: "Which platform?" },
        ],
      },
      {
        type: "check",
        title: "Check",
        prompt: "“Le train est en retard” means…",
        options: [
          "The train is on time",
          "The train is delayed",
          "The train is full",
          "The train is cancelled",
        ],
        answerIndex: 1,
      },
      {
        type: "check",
        title: "Check · ticket",
        prompt: "“Aller-retour” is…",
        options: ["One-way", "Round trip", "First class", "Platform pass"],
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

export function directionLabel(direction: LessonDirection): string {
  return direction === "en-fr" ? "EN → FR" : "FR → EN";
}
