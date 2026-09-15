import type { LessonDirection, LessonTag } from "@/data/lessons";
import type { ProgressState } from "@/lib/progress";

export type TutorUnit = "foundations" | "everyday" | "travel";

export type TutorScenario = {
    id: string;
    unit: TutorUnit;
    title: string;
    description: string;
    setting: string;
    openingHint: string;
    goal: string;
    tags: LessonTag[];
    level: "beginner" | "elementary";
    maxTurns: number;
    /** Lesson ids that unlock this scenario (any one completed is enough). */
    unlockLessonIds?: string[];
};

export const TUTOR_SCENARIOS: TutorScenario[] = [
    {
        id: "greet-neighbor",
        unit: "foundations",
        title: "Greet a neighbor",
        description: "Say hello, ask how they are, and close politely.",
        setting: "You meet a neighbor in the hallway of an apartment building.",
        openingHint: "Start with a warm hello as if you just opened your door.",
        goal: "Exchange a short greeting and goodbye.",
        tags: ["greetings", "politeness", "basics"],
        level: "beginner",
        maxTurns: 6,
        unlockLessonIds: ["greetings-1"],
    },
    {
        id: "thank-cashier",
        unit: "foundations",
        title: "Thank a cashier",
        description: "Pay, thank them, and take your leave.",
        setting: "You are at a small shop checkout.",
        openingHint:
            "You are the cashier. Greet the customer and wait for their reply.",
        goal: "Use please and thank-you formulas naturally.",
        tags: ["politeness", "basics", "shopping"],
        level: "beginner",
        maxTurns: 6,
        unlockLessonIds: ["polite-1"],
    },
    {
        id: "introduce-yourself",
        unit: "foundations",
        title: "Introduce yourself",
        description: "Share your name and where you are from.",
        setting: "A language-exchange meetup; first introductions.",
        openingHint:
            "Greet the learner and invite them to introduce themselves.",
        goal: "Say who you are in a few short sentences.",
        tags: ["greetings", "social", "basics"],
        level: "beginner",
        maxTurns: 6,
        unlockLessonIds: ["introduce-yourself-1"],
    },
    {
        id: "cafe-order",
        unit: "everyday",
        title: "Order at a caf\u00e9",
        description: "Order a drink and respond to a simple follow-up.",
        setting: "A quiet neighborhood caf\u00e9; you are the barista.",
        openingHint: "Welcome the customer and ask what they would like.",
        goal: "Order one item with a polite please.",
        tags: ["cafe", "food", "politeness"],
        level: "beginner",
        maxTurns: 8,
        unlockLessonIds: ["cafe-1"],
    },
    {
        id: "market-stall",
        unit: "everyday",
        title: "At the market",
        description: "Ask for something and a small quantity.",
        setting: "An outdoor food market; you run a produce stall.",
        openingHint: "Greet the shopper and ask how you can help.",
        goal: "Ask for an item and use a number or quantity.",
        tags: ["food", "shopping", "numbers"],
        level: "beginner",
        maxTurns: 8,
        unlockLessonIds: ["food-market-1"],
    },
    {
        id: "weekend-plans",
        unit: "everyday",
        title: "Weekend plans",
        description: "Talk about simple plans with a friend.",
        setting: "Two friends catching up on a messaging call.",
        openingHint: "Ask the learner what they are doing this weekend.",
        goal: "State one plan and ask a question back.",
        tags: ["social", "time"],
        level: "elementary",
        maxTurns: 8,
        unlockLessonIds: ["weekend-plans-1"],
    },
    {
        id: "ask-directions",
        unit: "travel",
        title: "Ask for directions",
        description: "Find a place and understand a short reply.",
        setting: "A city sidewalk; you are a local passerby.",
        openingHint:
            "Look approachable; wait for the learner to ask where something is.",
        goal: "Ask where a place is and confirm you understood.",
        tags: ["directions", "travel"],
        level: "elementary",
        maxTurns: 8,
        unlockLessonIds: ["directions-1"],
    },
    {
        id: "buy-ticket",
        unit: "travel",
        title: "Buy a ticket",
        description: "Request a ticket and handle a simple question.",
        setting: "A metro or train ticket window; you are the agent.",
        openingHint: "Ask how you can help the traveler.",
        goal: "Ask for a ticket to a destination.",
        tags: ["transport", "travel", "politeness"],
        level: "elementary",
        maxTurns: 8,
        unlockLessonIds: ["travel-phrases-1", "getting-around-1"],
    },
    {
        id: "hotel-checkin",
        unit: "travel",
        title: "Hotel check-in",
        description: "Give your name and number of nights.",
        setting: "A small hotel front desk; you are the receptionist.",
        openingHint:
            "Welcome the guest and ask for their name or reservation.",
        goal: "Check in with name and stay length.",
        tags: ["travel", "home", "politeness"],
        level: "elementary",
        maxTurns: 8,
        unlockLessonIds: ["hotel-1"],
    },
];

export function getScenario(id: string): TutorScenario | undefined {
    return TUTOR_SCENARIOS.find((s) => s.id === id);
}

export function scenariosByUnit(unit: TutorUnit): TutorScenario[] {
    return TUTOR_SCENARIOS.filter((s) => s.unit === unit);
}

export const TUTOR_UNIT_LABEL: Record<TutorUnit, string> = {
    foundations: "Foundations",
    everyday: "Everyday",
    travel: "Travel",
};

export function isScenarioUnlocked(
    scenario: TutorScenario,
    progress: ProgressState,
    direction: LessonDirection,
): boolean {
    const required = scenario.unlockLessonIds;
    if (!required?.length) return true;

    const completed =
        progress.lessonsCompleted?.get?.(direction) ??
        progress.lessonsCompleted?.get?.("en-fr") ??
        progress.lessonsCompleted?.get?.("fr-en") ??
        [];

    const set = new Set(completed);
    for (const id of required) {
        if (set.has(id)) return true;
    }
    return false;
}

export function unlockHint(scenario: TutorScenario): string {
    if (!scenario.unlockLessonIds?.length) return "";
    return "Complete the related lesson to unlock this roleplay.";
}
