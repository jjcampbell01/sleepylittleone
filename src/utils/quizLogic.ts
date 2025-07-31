interface QuizResponse {
  babyAge: string;
  napsPerDay?: string;
  nightWakings: string;
  sleepStruggles: string[];
  triedStrategies: string;
  sleepTrainingConcerns?: string;
}

export const determineResultType = (responses: QuizResponse): string => {
  const { babyAge, napsPerDay, nightWakings, sleepStruggles, triedStrategies, sleepTrainingConcerns } = responses;

  // The Sensitive Soul - check for gentle approach preferences
  if (sleepTrainingConcerns?.includes("I don't want my baby to cry") || 
      sleepTrainingConcerns?.includes("I don't want to break what's \"kind of\" working") ||
      triedStrategies === "Yes, but my baby cried too much") {
    return "sensitive-soul";
  }

  // The Nap Fighter - nap-related struggles
  if (sleepStruggles.includes("My baby fights naps") || 
      sleepStruggles.includes("Takes short naps (under 40 min)") ||
      napsPerDay === "My baby skips naps often") {
    return "nap-fighter";
  }

  // The Early Riser - early morning wakings
  if (sleepStruggles.includes("Wakes too early (before 6 a.m.)")) {
    return "early-riser";
  }

  // The Frequent Waker - multiple night wakings
  if (nightWakings === "3+ times" || 
      nightWakings === "Wakes hourly" || 
      nightWakings === "I've lost count" ||
      sleepStruggles.includes("Wakes up crying at night")) {
    return "frequent-waker";
  }

  // The Confused Routine Baby - inconsistent patterns
  if (sleepStruggles.includes("I don't even know — it's all over the place") ||
      napsPerDay === "I don't follow a nap schedule" ||
      sleepStruggles.includes("Can't fall asleep without help")) {
    return "confused-routine";
  }

  // Default fallback based on age and general struggles
  if (nightWakings === "1–2 times" && sleepStruggles.length > 1) {
    return "confused-routine";
  }

  // Final fallback to most common issue
  return "frequent-waker";
};

export const getQuestions = () => [
  {
    id: 'baby-age',
    question: "How old is your baby?",
    options: [
      "0–3 months",
      "4–6 months", 
      "7–9 months",
      "10–12 months",
      "13–18 months",
      "19–24 months"
    ],
    isMultiSelect: false
  },
  {
    id: 'naps-per-day',
    question: "How many naps does your baby take most days?",
    options: [
      "3 naps",
      "2 naps",
      "1 nap", 
      "My baby skips naps often",
      "I don't follow a nap schedule"
    ],
    isMultiSelect: false,
    showIf: (responses: any) => responses['baby-age'] !== "0–3 months"
  },
  {
    id: 'night-wakings',
    question: "How often does your baby wake at night?",
    options: [
      "Sleeps through the night",
      "1–2 times",
      "3+ times",
      "Wakes hourly", 
      "I've lost count"
    ],
    isMultiSelect: false
  },
  {
    id: 'sleep-struggles',
    question: "What's your biggest sleep struggle right now?",
    subtext: "Choose one or two",
    options: [
      "My baby fights naps",
      "Wakes too early (before 6 a.m.)",
      "Wakes up crying at night",
      "Takes short naps (under 40 min)",
      "Can't fall asleep without help",
      "I don't even know — it's all over the place"
    ],
    isMultiSelect: true,
    maxSelections: 2
  },
  {
    id: 'tried-strategies',
    question: "Have you tried any sleep strategies or routines?",
    options: [
      "No, I'm just starting",
      "Yes, but didn't work", 
      "Yes, helped a bit",
      "Yes, but my baby cried too much"
    ],
    isMultiSelect: false
  },
  {
    id: 'sleep-training-concerns',
    question: "What's your biggest concern when it comes to sleep training?",
    subtext: "Optional — this helps us personalize your plan",
    options: [
      "I don't want my baby to cry",
      "I don't know what method is right",
      "I've heard too much conflicting advice",
      "I don't want to break what's \"kind of\" working",
      "I just want a clear plan"
    ],
    isMultiSelect: false,
    isOptional: true
  }
];