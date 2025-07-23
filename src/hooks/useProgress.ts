export const useProgress = () => {
  // Simple mock implementation for now
  return {
    progress: [],
    courseProgress: [],
    updateLessonProgress: () => {},
    getLessonProgress: () => undefined,
    getCourseProgress: () => undefined,
    calculateCourseProgress: () => {}
  };
};