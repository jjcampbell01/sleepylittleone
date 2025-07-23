import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, BookOpen, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserDropdown } from '@/components/UserDropdown';
import { mockCourses, mockCourseProgress, mockProgress } from '@/data/mockCourses';

const CoursePage = () => {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  const courseProgress = mockCourseProgress.find(p => p.courseId === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getLessonProgress = (lessonId: string) => {
    return mockProgress.find(p => p.lessonId === lessonId);
  };

  const getFirstIncompleteLesson = () => {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const progress = getLessonProgress(lesson.id);
        if (!progress?.completed) {
          return lesson;
        }
      }
    }
    return null;
  };

  const firstIncompleteLesson = getFirstIncompleteLesson();
  const hasStarted = courseProgress && courseProgress.completionPercentage > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/platform" className="text-2xl font-bold font-inter bg-gradient-primary bg-clip-text text-transparent">
                LearnFlow
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                  Courses
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Progress
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <Link to="/courses" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold font-inter mb-4">
                {course.title}
              </h1>
              <p className="text-white/90 text-lg mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center gap-6 text-white/80 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {course.totalDuration ? formatDuration(course.totalDuration) : 'TBD'}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {course.totalLessons} lessons
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {course.modules.length} modules
                </div>
              </div>

              {courseProgress && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 font-medium">Progress</span>
                    <span className="text-white/90">{courseProgress.completionPercentage}%</span>
                  </div>
                  <Progress 
                    value={courseProgress.completionPercentage} 
                    className="h-3 bg-white/20" 
                  />
                </div>
              )}

              <div className="flex gap-3">
                {firstIncompleteLesson && (
                  <Link to={`/lesson/${firstIncompleteLesson.id}`}>
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                      <Play className="w-5 h-5 mr-2" />
                      {hasStarted ? 'Continue Learning' : 'Start Course'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold font-inter mb-8">Course Content</h2>
        
        <div className="space-y-6">
          {course.modules.map((module, moduleIndex) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-inter text-xl">
                      Module {moduleIndex + 1}: {module.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {module.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {module.lessons.length} lessons
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const lessonProgress = getLessonProgress(lesson.id);
                    const isCompleted = lessonProgress?.completed;
                    
                    return (
                      <div key={lesson.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-medium">{lessonIndex + 1}</span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {lesson.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.duration ? formatDuration(lesson.duration) : 'TBD'}
                                </div>
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <span>{lesson.resources.length} resources</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Link to={`/lesson/${lesson.id}`}>
                            <Button variant="ghost" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              {isCompleted ? 'Review' : 'Watch'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;