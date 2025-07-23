// Course Platform Data Models
export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link';
  url: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Vimeo URL
  moduleId: string;
  order: number;
  completed?: boolean;
  resources?: Resource[];
  comments?: Comment[];
  isDraft?: boolean;
  duration?: number; // in seconds
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  subModules?: Module[]; // For nested modules
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules: Module[];
  published?: boolean;
  totalLessons?: number;
  totalDuration?: number; // in seconds
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  avatar?: string;
}

export interface Progress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  watchTime?: number; // time watched in seconds
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  lastAccessed?: string;
  currentLesson?: string;
}