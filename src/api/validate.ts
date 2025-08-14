import { z } from 'zod';
import { parseTime } from '@/lib/time';

// Time validation schema
const timeSchema = z.string().refine((time) => {
  const parsed = parseTime(time);
  return parsed && /^\d{2}:\d{2}$/.test(parsed);
}, "Please enter a valid time (e.g., 7:30 AM or 19:30)");

// Email validation
const emailSchema = z.string().email("Please enter a valid email address");

// Base form data schema
export const sleepPlannerSchema = z.object({
  // Intro section
  email: emailSchema,
  age_months: z.number().min(0).max(36, "Age must be between 0 and 36 months"),
  adjusted_age: z.boolean().optional(),
  consent_analytics: z.boolean().refine(val => val === true, "Analytics consent is required"),

  // Pressure section
  anchor_wake: timeSchema,
  nap_count: z.number().min(0).max(4),
  first_nap_start: timeSchema.optional(),
  last_nap_end: timeSchema.optional(),
  avg_nap_len_min: z.number().min(10).max(180).optional(),
  last_wake_window_h: z.number().min(0.5).max(6),
  bed_latency_min: z.number().min(0).max(120),

  // Settling section
  settling_help: z.enum(['none', 'minimal', 'moderate', 'full']),
  associations: z.array(z.string()),
  night_wakings: z.number().min(0).max(10),
  longest_stretch_h: z.number().min(1).max(12),

  // Nutrition section
  night_feeds: z.number().min(0).max(6),
  feed_clock_times: z.array(timeSchema).optional(),

  // Environment section
  dark_hand_test: z.enum(['pass', 'fail']),
  white_noise_on: z.boolean(),
  white_noise_distance_ft: z.number().min(1).max(12).optional(),
  white_noise_db: z.number().min(40).max(80).optional(),
  temp_f: z.number().min(60).max(80),
  humidity_pct: z.number().min(10).max(90).optional(),
  sleep_surface: z.enum(['crib', 'bassinet', 'pack_n_play', 'co_sleep', 'other']),

  // Routine section
  routine_steps: z.array(z.string()),
  wake_variability: z.enum(['0-15', '15-45', '45+']),

  // Other section
  health_flags: z.array(z.string()).optional(),
  parent_preference: z.enum(['gentle', 'faster']).optional(),
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
    
    // Normalize time fields
    if (result.anchor_wake) {
      result.anchor_wake = parseTime(result.anchor_wake);
    }
    if (result.first_nap_start) {
      result.first_nap_start = parseTime(result.first_nap_start);
    }
    if (result.last_nap_end) {
      result.last_nap_end = parseTime(result.last_nap_end);
    }
    if (result.feed_clock_times) {
      result.feed_clock_times = result.feed_clock_times.map(parseTime);
    }
    
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        errors[field] = issue.message;
      });
      return { success: false, errors };
    }
    
    return { 
      success: false, 
      errors: { general: "Validation failed" }
    };
  }
}

/**
 * Get derived age for calculations
 */
export function getDerivedAge(ageMonths: number, adjustedAge?: boolean): number {
  // For adjusted age calculation, we'd need additional birth info
  // For now, just return the provided age
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
