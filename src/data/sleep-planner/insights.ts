export interface SleepInsight {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
}

export const wakeWindowTargets = {
  "5-7": { min: 2.5, max: 3, unit: "hours" },
  "7-10": { min: 3, max: 3.5, unit: "hours" },
  "11-14": { min: 3.5, max: 4, unit: "hours" },
  "14+": { min: 4, max: 5, unit: "hours" }
};

export const environmentTargets = {
  darkness: {
    target: "Cannot see hand in room",
    test: "Hand test at baby's eye level"
  },
  whiteNoise: {
    distance: { min: 3, max: 6, unit: "feet" },
    volume: { min: 65, max: 70, unit: "dB" },
    description: "Consistent, constant sound - about as loud as a shower"
  },
  temperature: {
    fahrenheit: { min: 68, max: 72 },
    celsius: { min: 20, max: 22 },
    description: "Cool enough for sleep sack without overheating"
  },
  humidity: {
    min: 40, max: 60, unit: "%",
    description: "Prevents dry air that can wake babies"
  }
};

export const protestCurveInsights = {
  title: "Understanding the Protest Curve",
  content: "When babies protest sleep changes, crying typically peaks in the first 5-10 minutes, then naturally decreases. This is normal brain development - not distress. Look for intensity to step down from 7-8 to 3-4 over 10-15 minutes.",
  disclaimer: "This is educational information only, not medical advice. Trust your instincts and consult your pediatrician with any concerns."
};

export const sleepScienceInsights: SleepInsight[] = [
  {
    id: "wake-windows",
    title: "Wake Windows by Age",
    content: "Wake windows are the time baby can comfortably stay awake between sleeps. Too short = not tired enough. Too long = overtired and harder to settle.",
    type: "info"
  },
  {
    id: "sleep-pressure",
    title: "Building Sleep Pressure",
    content: "Sleep pressure builds throughout wake periods. The last wake window before bed is most critical - it determines how easily baby falls asleep.",
    type: "info"
  },
  {
    id: "circadian-rhythm",
    title: "Circadian Rhythm Development",
    content: "Babies develop circadian rhythms around 3-4 months. Consistent wake times and darkness cues help strengthen this natural sleep-wake cycle.",
    type: "info"
  },
  {
    id: "environment-first",
    title: "Environment First Approach",
    content: "Optimizing sleep environment (darkness, white noise, temperature) often resolves 60-70% of sleep issues without any behavioral changes.",
    type: "success"
  }
];

export const disclaimers = {
  educational: "This tool provides educational content only and is not medical advice. Consult your pediatrician for any medical concerns about your baby's sleep.",
  privacy: "By continuing, you agree to our Privacy Policy. De-identified data may be used to improve our tools.",
  ageConsiderations: "For babies under 4 months: Frequent wakings and needing help to sleep are completely normal. Focus on environment and gentle routines rather than independence."
};