import { z } from 'zod';
import { parseTime } from '@/lib/time';

// ----- helpers -----
const isHalfHour = (n: number) => Number.isFinite(n) && Math.abs(n * 2 - Math.round(n * 2)) < 1e-9;

// Time validation schema
const timeSchema = z.string().refine((time) => {
  const parsed = parseTime(time);
  return parsed && /^\d{2}:\d{2}$/.test(parsed);
}, "Please enter a valid time (e.g., 7:30 AM or 19:30)");

// Email validation
const emailSchema = z.string().email("Please enter a valid email address");

// ----- base field schemas -----
const baseShape = {
  // Intro
  email: emailSchema,
  age_months: z.number().min(0).max(36, "Age must be between 0 and 36 months"),
  adjusted_age: z.boolean().optional(),
  consent_analytics: z.boolean().refine((val) => val === true, "Analytics consent is required"),

  // Pressure
  anchor_wake: timeSchema,
  nap_count: z.number().min(0).max(4),
  first_nap_start: timeSchema.optional(),
  last_nap_end: timeSchema.optional(),
  avg_nap_len_min: z.number().min(10).max(180).optional(),
  last_wake_window_h: z.number().min(0.5).max(6),
  bed_latency_min: z.number().min(0).max(120),

  // Settling
  settling_help: z.enum(['none', 'minimal', 'moderate', 'full']),
  associations: z.array(z.string()),
  night_wakings: z.number().min(0).max(10),
  longest_stretch_h: z
    .number()
    .min(1)
    .max(12)
    .refine((v) => isHalfHour(v), 'Use .5 hour increments (e.g., 2, 2.5, 3)'),

  // Nutrition
  night_feeds: z.number().min(0).max(6),
  feed_clock_times: z.array(timeSchema).optional(),

  // Environment
  dark_hand_test: z.enum(['pass', 'fail']),
  white_noise_on: z.boolean(),
  white_noise_distance_ft: z.number().min(1).max(12).optional(),
  white_noise_db: z.number().min(40).max(80).optional(),
  temp_f: z.number().min(60).max(80),
  humidity_pct: z.number().min(10).max(90).optional(),
  sleep_surface: z.enum(['crib', 'bassinet', 'pack_n_play', 'co_sleep', 'other']),

  // Routine
  routine_steps: z.array(z.string()).min(1, 'Pick at least one step.').max(6, 'Keep the routine to at most 6 steps.'),
  wake_variability: z.enum(['0-15', '15-45', '45+']),

  // Other
  health_flags: z.array(z.string()).optional(),
  parent_preference: z.enum(['gentle', 'faster']).optional(),
} as const;

// Base form data schema
export const sleepPlannerSchema = z
  .object(baseShape)
  .superRefine((val, ctx) => {
    // --- Nap-time conditionals (mirror your visibleIf) ---
    // If at least 1 nap, first_nap_start should be provided
    if (val.nap_count >= 1 && !val.first_nap_start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['first_nap_start'],
        message: 'Please provide the first nap start time.',
      });
    }
    // If 2+ naps, last_nap_end should be provided
    if (val.nap_count >= 2 && !val.last_nap_end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['last_nap_end'],
        message: 'Please provide the last nap end time.',
      });
    }

    // --- Night feeds ↔ times consistency ---
    if (val.night_feeds > 0) {
      if (!val.feed_clock_times || val.feed_clock_times.length !== val.night_feeds) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['feed_clock_times'],
          message: `Please specify ${val.night_feeds} feed time${val.night_feeds === 1 ? '' : 's'}.`,
        });
      } else {
        // ensure all times parse (timeSchema already does, but we keep a clear message here)
        const badIdx = val.feed_clock_times.findIndex((t) => !parseTime(t));
        if (badIdx >= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['feed_clock_times', badIdx],
            message: 'Enter a valid time (e.g., 01:30 or 1:30 AM).',
          });
        }
      }
    } else {
      // if 0 feeds, normalize to [] (validator returns normalized data later anyway)
      if (val.feed_clock_times && val.feed_clock_times.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['feed_clock_times'],
          message: 'Remove feed times when night feeds are 0.',
        });
      }
    }

    // --- White noise optional checks (not required, but if present, keep within bounds) ---
    // Bounds are already enforced by field schemas; no extra work needed here.
  });

export type SleepPlannerFormData = z.infer<typeof sleepPlannerSchema>;

/**
 * Validate form data and return normalized values
 */
export function validateSleepPlannerData(data: unknown): {
  success: boolean;
  data?: SleepPlannerFormData;
  errors?: Record<string, string>;
} {
  try {
    const result = sleepPlannerSchema.parse(data);

    // Normalize time fields to "HH:MM"
    const normalized: SleepPlannerFormData = {
      ...result,
      anchor_wake: parseTime(result.anchor_wake)!,
      first_nap_start: result.first_nap_start ? parseTime(result.first_nap_start)! : undefined,
      last_nap_end: result.last_nap_end ? parseTime(result.last_nap_end)! : undefined,
      feed_clock_times: result.feed_clock_times?.map((t) => parseTime(t)!) ?? undefined,
    };

    return { success: true, data: normalized };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        // If multiple issues map to the same field, keep the first readable message
        if (!errors[field]) errors[field] = issue.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: 'Validation failed' },
    };
  }
}

/**
 * Get derived age for calculations
 */
export function getDerivedAge(ageMonths: number, adjustedAge?: boolean): number {
  // Placeholder: if you later add corrected-age math, use adjustedAge toggle here.
  return ageMonths;
}

/**
 * Get age bucket for wake window targets
 */
export function getAgeBucket(ageMonths: number): string {
  if (ageMonths >= 5 && ageMonths < 7) return "5-7";
  if (ageMonths >= 7 && ageMonths < 10) return "7-10";
  if (ageMonths >= 11 && ageMonths < 14) return "11-14";
  if (ageMonths >= 14) return "14+";
  return "under-5";
}
