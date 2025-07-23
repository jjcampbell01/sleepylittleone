import { formatDistanceToNow } from 'date-fns';

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const calculateCourseProgress = (completedLessons: number, totalLessons: number): number => {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
};

export const calculateWatchProgress = (watchTime: number, duration: number): number => {
  if (duration === 0) return 0;
  return Math.min(100, Math.round((watchTime / duration) * 100));
};

export const getNextLesson = (currentLessonId: string, allLessons: Array<{lesson: any, module: any}>): {lesson: any, module: any} | null => {
  const currentIndex = allLessons.findIndex(item => item.lesson.id === currentLessonId);
  return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
};

export const getPreviousLesson = (currentLessonId: string, allLessons: Array<{lesson: any, module: any}>): {lesson: any, module: any} | null => {
  const currentIndex = allLessons.findIndex(item => item.lesson.id === currentLessonId);
  return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
};

export const saveProgressToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
};

export const loadProgressFromStorage = (key: string): any | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return null;
  }
};