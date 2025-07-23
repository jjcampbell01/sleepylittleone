import { Course, User, Progress, CourseProgress } from '@/types/course';

export const mockUser: User = {
  id: 'user-1',
  email: 'student@example.com',
  name: 'John Doe',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
};

export const mockAdmin: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Sarah Admin',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2f5de1a?w=32&h=32&fit=crop&crop=face'
};

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'React Mastery: From Beginner to Expert',
    description: 'Master React development with this comprehensive course covering hooks, state management, performance optimization, and modern patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    published: true,
    totalLessons: 9,
    totalDuration: 18000, // 5 hours
    modules: [
      {
        id: 'module-1',
        title: 'Getting Started with React',
        description: 'Learn the fundamentals of React including components, JSX, and props.',
        order: 1,
        lessons: [
          {
            id: 'lesson-1',
            title: 'Introduction to React',
            description: 'Understanding what React is and why it\'s popular for building user interfaces.',
            videoUrl: 'https://vimeo.com/placeholder-1', // Placeholder for Vimeo
            moduleId: 'module-1',
            order: 1,
            duration: 1800, // 30 minutes
            resources: [
              {
                id: 'resource-1',
                title: 'React Documentation',
                type: 'link',
                url: 'https://react.dev'
              },
              {
                id: 'resource-2',
                title: 'Course Slides - Introduction',
                type: 'pdf',
                url: '/resources/react-intro-slides.pdf'
              }
            ],
            comments: [
              {
                id: 'comment-1',
                userId: 'user-1',
                username: 'John Doe',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
                content: 'Great introduction! Really helped me understand the basics.',
                createdAt: '2024-01-15T10:30:00Z'
              }
            ]
          },
          {
            id: 'lesson-2',
            title: 'Your First React Component',
            description: 'Create your first React component and understand JSX syntax.',
            videoUrl: 'https://vimeo.com/placeholder-2',
            moduleId: 'module-1',
            order: 2,
            duration: 2400, // 40 minutes
            resources: [
              {
                id: 'resource-3',
                title: 'Component Example Code',
                type: 'doc',
                url: '/resources/first-component.jsx'
              }
            ]
          },
          {
            id: 'lesson-3',
            title: 'Props and Component Communication',
            description: 'Learn how to pass data between components using props.',
            videoUrl: 'https://vimeo.com/placeholder-3',
            moduleId: 'module-1',
            order: 3,
            duration: 2100, // 35 minutes
          }
        ]
      },
      {
        id: 'module-2',
        title: 'React Hooks Deep Dive',
        description: 'Master React hooks including useState, useEffect, and custom hooks.',
        order: 2,
        lessons: [
          {
            id: 'lesson-4',
            title: 'useState Hook',
            description: 'Managing component state with the useState hook.',
            videoUrl: 'https://vimeo.com/placeholder-4',
            moduleId: 'module-2',
            order: 1,
            duration: 2700, // 45 minutes
          },
          {
            id: 'lesson-5',
            title: 'useEffect Hook',
            description: 'Side effects and lifecycle management with useEffect.',
            videoUrl: 'https://vimeo.com/placeholder-5',
            moduleId: 'module-2',
            order: 2,
            duration: 3000, // 50 minutes
          },
          {
            id: 'lesson-6',
            title: 'Custom Hooks',
            description: 'Create reusable logic with custom React hooks.',
            videoUrl: 'https://vimeo.com/placeholder-6',
            moduleId: 'module-2',
            order: 3,
            duration: 2400, // 40 minutes
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Advanced React Patterns',
        description: 'Learn advanced patterns like context, reducers, and performance optimization.',
        order: 3,
        lessons: [
          {
            id: 'lesson-7',
            title: 'Context API',
            description: 'Global state management with React Context.',
            videoUrl: 'https://vimeo.com/placeholder-7',
            moduleId: 'module-3',
            order: 1,
            duration: 2700, // 45 minutes
          },
          {
            id: 'lesson-8',
            title: 'useReducer Hook',
            description: 'Complex state management with useReducer.',
            videoUrl: 'https://vimeo.com/placeholder-8',
            moduleId: 'module-3',
            order: 2,
            duration: 2400, // 40 minutes
          },
          {
            id: 'lesson-9',
            title: 'Performance Optimization',
            description: 'Optimize your React apps with memoization and lazy loading.',
            videoUrl: 'https://vimeo.com/placeholder-9',
            moduleId: 'module-3',
            order: 3,
            duration: 3600, // 60 minutes
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'TypeScript for Modern Web Development',
    description: 'Learn TypeScript from the ground up and build type-safe applications.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
    published: true,
    totalLessons: 6,
    totalDuration: 14400, // 4 hours
    modules: [
      {
        id: 'module-4',
        title: 'TypeScript Fundamentals',
        description: 'Learn the basics of TypeScript syntax and type system.',
        order: 1,
        lessons: [
          {
            id: 'lesson-10',
            title: 'Introduction to TypeScript',
            description: 'What is TypeScript and why use it?',
            videoUrl: 'https://vimeo.com/placeholder-10',
            moduleId: 'module-4',
            order: 1,
            duration: 2400, // 40 minutes
          },
          {
            id: 'lesson-11',
            title: 'Basic Types and Interfaces',
            description: 'Understanding TypeScript types and interfaces.',
            videoUrl: 'https://vimeo.com/placeholder-11',
            moduleId: 'module-4',
            order: 2,
            duration: 2700, // 45 minutes
          },
          {
            id: 'lesson-12',
            title: 'Functions and Classes',
            description: 'Typing functions and working with classes in TypeScript.',
            videoUrl: 'https://vimeo.com/placeholder-12',
            moduleId: 'module-4',
            order: 3,
            duration: 2400, // 40 minutes
          }
        ]
      },
      {
        id: 'module-5',
        title: 'Advanced TypeScript',
        description: 'Master advanced TypeScript features and patterns.',
        order: 2,
        lessons: [
          {
            id: 'lesson-13',
            title: 'Generics and Utility Types',
            description: 'Create flexible and reusable code with generics.',
            videoUrl: 'https://vimeo.com/placeholder-13',
            moduleId: 'module-5',
            order: 1,
            duration: 3000, // 50 minutes
          },
          {
            id: 'lesson-14',
            title: 'Advanced Type Patterns',
            description: 'Conditional types, mapped types, and template literals.',
            videoUrl: 'https://vimeo.com/placeholder-14',
            moduleId: 'module-5',
            order: 2,
            duration: 2700, // 45 minutes
          },
          {
            id: 'lesson-15',
            title: 'TypeScript with React',
            description: 'Using TypeScript effectively in React applications.',
            videoUrl: 'https://vimeo.com/placeholder-15',
            moduleId: 'module-5',
            order: 3,
            duration: 2700, // 45 minutes
          }
        ]
      }
    ]
  }
];

export const mockProgress: Progress[] = [
  {
    userId: 'user-1',
    courseId: 'course-1',
    lessonId: 'lesson-1',
    completed: true,
    completedAt: '2024-01-15T14:30:00Z',
    watchTime: 1800
  },
  {
    userId: 'user-1',
    courseId: 'course-1',
    lessonId: 'lesson-2',
    completed: true,
    completedAt: '2024-01-16T10:15:00Z',
    watchTime: 2400
  },
  {
    userId: 'user-1',
    courseId: 'course-1',
    lessonId: 'lesson-3',
    completed: false,
    watchTime: 1200 // Partially watched
  }
];

export const mockCourseProgress: CourseProgress[] = [
  {
    courseId: 'course-1',
    userId: 'user-1',
    completedLessons: 2,
    totalLessons: 9,
    completionPercentage: 22,
    lastAccessed: '2024-01-16T10:15:00Z',
    currentLesson: 'lesson-3'
  },
  {
    courseId: 'course-2',
    userId: 'user-1',
    completedLessons: 0,
    totalLessons: 6,
    completionPercentage: 0
  }
];