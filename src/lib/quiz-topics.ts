export type QuizTopic = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
};

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    slug: "animals",
    title: "Animals",
    description: "Creatures, habitats, and simple facts.",
    emoji: "🐾",
  },
  {
    slug: "food",
    title: "Food & drink",
    description: "Meals, markets, and kitchen vocabulary.",
    emoji: "🍽️",
  },
  {
    slug: "travel",
    title: "Travel",
    description: "Airports, directions, and places.",
    emoji: "✈️",
  },
  {
    slug: "daily-life",
    title: "Daily life",
    description: "Home, routines, and errands.",
    emoji: "🏠",
  },
  {
    slug: "school",
    title: "School",
    description: "Classroom words and study habits.",
    emoji: "📚",
  },
  {
    slug: "work",
    title: "Work",
    description: "Jobs, offices, and polite phrases.",
    emoji: "💼",
  },
  {
    slug: "supermarket",
    title: "Supermarket",
    description: "Aisles, produce, and checkout.",
    emoji: "🛒",
  },
  {
    slug: "weather",
    title: "Weather",
    description: "Seasons, forecasts, and clothing.",
    emoji: "🌤️",
  },
];

export function getTopic(slug: string) {
  return QUIZ_TOPICS.find((t) => t.slug === slug) ?? null;
}
