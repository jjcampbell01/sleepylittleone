/**
 * Parse various time formats and normalize to HH:mm
 */
export function parseTime(timeStr: string): string {
  if (!timeStr) return '';
  
  // Handle 24-hour format (HH:mm)
  const twentyFourHourMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const [, hours, minutes] = twentyFourHourMatch;
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
  }
  
  // Handle 12-hour format (h:mm am/pm)
  const twelveHourMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (twelveHourMatch) {
    const [, hours, minutes, period] = twelveHourMatch;
    let h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    
    if (h >= 1 && h <= 12 && m >= 0 && m <= 59) {
      if (period.toLowerCase() === 'pm' && h !== 12) {
        h += 12;
      } else if (period.toLowerCase() === 'am' && h === 12) {
        h = 0;
      }
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
  }
  
  return timeStr; // Return as-is if parsing fails
}

/**
 * Format time for display
 */
export function formatTime(timeStr: string, format: '12h' | '24h' = '12h'): string {
  if (!timeStr) return '';
  
  const normalizedTime = parseTime(timeStr);
  if (!normalizedTime) return timeStr;
  
  const [hoursStr, minutesStr] = normalizedTime.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  if (format === '24h') {
    return normalizedTime;
  }
  
  // 12-hour format
  if (hours === 0) {
    return `12:${minutesStr} AM`;
  } else if (hours < 12) {
    return `${hours}:${minutesStr} AM`;
  } else if (hours === 12) {
    return `12:${minutesStr} PM`;
  } else {
    return `${hours - 12}:${minutesStr} PM`;
  }
}

/**
 * Add hours to a time string
 */
export function addHours(timeStr: string, hoursToAdd: number): string {
  const normalizedTime = parseTime(timeStr);
  if (!normalizedTime) return '';
  
  const [hoursStr, minutesStr] = normalizedTime.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  const totalMinutes = hours * 60 + minutes + (hoursToAdd * 60);
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate difference between two times in hours
 */
export function timeDifferenceHours(startTime: string, endTime: string): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  if (!start || !end) return 0;
  
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle next day
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }
  
  return (endTotalMinutes - startTotalMinutes) / 60;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9 / 5) + 32);
}