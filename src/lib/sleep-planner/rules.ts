import { SleepPlannerFormData, getAgeBucket, getDerivedAge } from '@/api/validate';
import { wakeWindowTargets, environmentTargets } from '@/data/sleep-planner/insights';
import { addHours, timeDifferenceHours } from '@/lib/time';

export interface PillarScores {
  pressure: number;
  settling: number;
  nutrition: number;
  environment: number;
  consistency: number;
}

export interface TonightPlan {
  wakeTime: string;
  napSchedule: Array<{
    startTime: string;
    endTime: string;
    maxDuration: number;
  }>;
  bedTimeWindow: {
    earliest: string;
    latest: string;
    ideal: string;            // NEW
  };
  asleepBy: string;           // NEW
  routineSteps: string[];
  keyTips: string[];
}

export interface GentleSettlingPlan {
  approach: string;
  comfortChecks: string;
  protestCurveGuidance: string;
  feedingSeparation?: string;
}

export interface RoadmapWeek {
  title: string;
  focus: string;
  tasks: string[];
}

/**
 * Get wake window target for age
 */
export function getWakeWindowTarget(ageMonths: number): { min: number; max: number } {
  const bucket = getAgeBucket(ageMonths);
  return wakeWindowTargets[bucket as keyof typeof wakeWindowTargets] || { min: 2, max: 3 };
}

/**
 * Score each pillar based on form data
 */
export function scorePillars(input: SleepPlannerFormData): PillarScores {
  const age = getDerivedAge(input.age_months, input.adjusted_age);
  const wakeTarget = getWakeWindowTarget(age);
  
  // Start each pillar at 100
  let pressure = 100;
  let settling = 100;
  let nutrition = 100;
  let environment = 100;
  let consistency = 100;

  // PRESSURE SCORING
  // Short naps penalty
  if (input.avg_nap_len_min && input.avg_nap_len_min < 45) {
    pressure -= 15;
  }
  
  // Wake window alignment
  const wakeWindowDiff = Math.abs(input.last_wake_window_h - ((wakeTarget.min + wakeTarget.max) / 2));
  if (wakeWindowDiff >= 0.5) {
    pressure -= 10;
  }
  
  // Long bedtime latency
  if (input.bed_latency_min > 25) {
    pressure -= 10;
  }
  
  // First nap timing (if applicable)
  if (input.first_nap_start && input.first_nap_start > "09:30") {
    pressure -= 10;
  }

  // SETTLING SCORING
  if (input.settling_help === 'moderate') {
    settling -= 15;
  } else if (input.settling_help === 'full') {
    settling -= 30;
  }
  
  // Night wakings penalty
  settling -= Math.min(input.night_wakings * 5, 30);
  
  // Strong associations penalty
  const strongAssociations = input.associations.filter(a => 
    ['feeding', 'rocking', 'motion', 'contact'].includes(a)
  );
  if (strongAssociations.length > 0) {
    settling -= 10;
  }

  // NUTRITION SCORING (age-dependent)
  if (age >= 4) {
    const excessFeeds = Math.max(input.night_feeds - 1, 0);
    nutrition -= Math.min(excessFeeds * 15, 30);
  }

  // ENVIRONMENT SCORING
  if (input.dark_hand_test === 'fail') {
    environment -= 15;
  }
  
  if (!input.white_noise_on) {
    environment -= 5;
  } else if (input.white_noise_distance_ft && 
    (input.white_noise_distance_ft < 3 || input.white_noise_distance_ft > 6)) {
    environment -= 5;
  }
  
  if (input.temp_f < 68 || input.temp_f > 72) {
    environment -= 10;
  }
  
  if (input.humidity_pct && (input.humidity_pct < 40 || input.humidity_pct > 60)) {
    environment -= 5;
  }

  // CONSISTENCY SCORING
  const wakeVariabilityScores = {
    '0-15': 100,
    '15-45': 85,
    '45+': 70
  };
  consistency = wakeVariabilityScores[input.wake_variability];
  
  if (input.routine_steps.length < 3) {
    consistency -= 10;
  }

  // Ensure scores don't go below 0
  return {
    pressure: Math.max(pressure, 0),
    settling: Math.max(settling, 0),
    nutrition: Math.max(nutrition, 0),
    environment: Math.max(environment, 0),
    consistency: Math.max(consistency, 0)
  };
}

/**
 * Compute overall Sleep Readiness Index
 */
export function computeIndex(scores: PillarScores, ageMonths: number): number {
  const age = getDerivedAge(ageMonths);
  
  if (age < 4) {
    // For babies under 4 months, don't weight settling and nutrition heavily
    const weighted = (
      scores.pressure * 0.4 +
      scores.environment * 0.3 +
      scores.consistency * 0.3
    );
    return Math.round(weighted);
  } else {
    // Full weighting for older babies
    const weighted = (
      scores.pressure * 0.3 +
      scores.settling * 0.25 +
      scores.nutrition * 0.15 +
      scores.environment * 0.15 +
      scores.consistency * 0.15
    );
    return Math.round(weighted);
  }
}

/**
 * Build tonight's sleep plan
 */
export function buildTonightPlan(input: SleepPlannerFormData): TonightPlan {
  const age = getDerivedAge(input.age_months, input.adjusted_age);
  const wakeTarget = getWakeWindowTarget(age);

  // Age midpoint as a sensible fallback
  const defaultWakeWindow = (wakeTarget.min + wakeTarget.max) / 2;

  // NEW: prefer the parent-entered last wake window when provided
  const lastWakeWindow =
    typeof input.last_wake_window_h === 'number' && input.last_wake_window_h > 0
      ? input.last_wake_window_h
      : defaultWakeWindow;
  
  // Build nap schedule
  const napSchedule: TonightPlan['napSchedule'] = [];
  if (input.nap_count > 0 && input.first_nap_start) {
    let currentTime = input.first_nap_start;
    
    for (let i = 0; i < Math.min(input.nap_count, 3); i++) {
      const napDuration = input.avg_nap_len_min || 60;
      const maxDuration = i === input.nap_count - 1 && age >= 7 && age <= 14 ? 30 : napDuration;
      
      napSchedule.push({
        startTime: currentTime,
        endTime: addHours(currentTime, maxDuration / 60),
        maxDuration: maxDuration
      });
      
      // Next nap starts after a wake window (uses default midpoint for intra-day spacing)
      currentTime = addHours(currentTime, (napDuration / 60) + defaultWakeWindow);
    }
  }
  
  // Calculate bedtime window (now based on the chosen last wake window)
  const lastNapEnd = input.last_nap_end || (napSchedule.length > 0 ? 
    napSchedule[napSchedule.length - 1].endTime : input.anchor_wake);
  
  const idealBedtime = addHours(lastNapEnd, lastWakeWindow);
  const earliestBedtime = addHours(idealBedtime, -0.5);
  const latestBedtime = addHours(idealBedtime, 0.5);

  // NEW: asleep-by adds bedtime latency
  const asleepBy = input.bed_latency_min
    ? addHours(idealBedtime, input.bed_latency_min / 60)
    : idealBedtime;
  
  // Routine steps
  const routineSteps = [
    'Dim lights 30 minutes before bed',
    'Sleep sack or appropriate sleepwear',
    'Brief, calm bedtime routine (5-10 minutes)',
    'Goodnight phrase and lights off',
    'Place baby in crib drowsy but awake'
  ];
  
  // Key tips based on data (unchanged in Step 1)
  const keyTips: string[] = [];
  
  if (input.bed_latency_min > 25) {
    keyTips.push('Consider extending last wake window by 15-30 minutes');
  }
  
  if (input.last_nap_end && input.last_nap_end >= "17:30" && age >= 7 && age <= 14) {
    keyTips.push('Cap last nap at 30 minutes or push bedtime to 8:00 PM');
  }
  
  if (input.dark_hand_test === 'fail') {
    keyTips.push('Prioritize room darkening - this often resolves 60% of sleep issues');
  }
  
  if (!input.white_noise_on) {
    keyTips.push('Consider adding consistent white noise for sound masking');
  }

  return {
    wakeTime: input.anchor_wake,
    napSchedule,
    bedTimeWindow: {
      earliest: earliestBedtime,
      latest: latestBedtime,
      ideal: idealBedtime            // NEW
    },
    asleepBy,                        // NEW
    routineSteps,
    keyTips
  };
}

/**
 * Build gentle settling plan
 */
export function buildGentleSettlingPlan(input: SleepPlannerFormData): GentleSettlingPlan {
  const age = getDerivedAge(input.age_months, input.adjusted_age);
  
  let approach = "Environment optimization first";
  let comfortChecks = "No specific check-ins needed";
  let protestCurveGuidance = "Focus on consistent routine and optimal sleep environment";
  let feedingSeparation;
  
  if (input.settling_help === 'moderate' || input.settling_help === 'full') {
    if (input.night_wakings >= 3) {
      approach = "Gradual fading with comfort checks";
      comfortChecks = "3/5/7 minute intervals - brief comfort without picking up";
      protestCurveGuidance = "Expect stronger protest in first 5-10 minutes, then intensity should step down from 7-8 to 3-4. This is normal brain development, not distress.";
    }
  }
  
  if (input.associations.includes('feeding')) {
    feedingSeparation = "Move feeding 15-20 minutes before crib time. Sequence: feed → sleep sack → book → goodnight phrase → lights down → crib drowsy-awake";
  }
  
  if (age < 4) {
    approach = "Gentle environment and routine focus";
    protestCurveGuidance = "For babies under 4 months, needing help is completely normal. Focus on consistent routines and optimal environment.";
  }
  
  return {
    approach,
    comfortChecks,
    protestCurveGuidance,
    feedingSeparation
  };
}

/**
 * Build 14-day roadmap
 */
export function buildRoadmap(input: SleepPlannerFormData, scores: PillarScores): RoadmapWeek[] {
  const age = getDerivedAge(input.age_months, input.adjusted_age);
  
  const roadmap: RoadmapWeek[] = [
    {
      title: "Days 1-3: Foundation",
      focus: "Environment & Rhythm",
      tasks: [
        "Establish consistent wake time (±15 minutes)",
        "Optimize room darkness (blackout curtains/shades)",
        "Set up white noise (3-6 feet from baby)",
        "Room temperature 68-72°F"
      ]
    },
    {
      title: "Days 4-7: Schedule Adjustment", 
      focus: "Wake Windows & Naps",
      tasks: [
        "Adjust first nap timing if starting after 9:30 AM",
        "Monitor wake windows - extend if bedtime takes >25 minutes",
        "Begin separating feeding from sleep (move 15-20 min earlier)",
        "Establish 3-5 step bedtime routine"
      ]
    }
  ];
  
  // Days 8-10: Nutrition adjustments (age-dependent)
  if (age >= 6 && input.night_feeds >= 2 && !input.health_flags?.includes('reflux')) {
    roadmap.push({
      title: "Days 8-10: Night Nutrition",
      focus: "Gentle Feed Reduction",
      tasks: [
        "Reduce one night feed (choose one after 1:30 AM)",
        "Maintain one feed before 1:30 AM if needed",
        "Replace removed feed with brief comfort if needed",
        "Monitor weight gain and daytime feeding"
      ]
    });
  } else {
    roadmap.push({
      title: "Days 8-10: Settling Support",
      focus: "Independent Sleep Skills",
      tasks: [
        "Practice crib placement drowsy but awake",
        "Use graduated comfort checks if needed (3/5/7 minutes)",
        "Stay consistent with routine timing",
        "Track progress and adjust wake windows as needed"
      ]
    });
  }
  
  // Days 11-14: Consolidation
  roadmap.push({
    title: "Days 11-14: Stabilization", 
    focus: "Consistency & Fine-tuning",
    tasks: [
      "Stabilize last wake window based on bedtime success",
      "Solidify 3-step routine sequence",
      "Reduce wake time variability to 0-15 minutes",
      "Celebrate progress and maintain consistency"
    ]
  });
  
  return roadmap;
}
