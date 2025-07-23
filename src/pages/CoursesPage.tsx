import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockCourses, mockCourseProgress } from '@/data/mockCourses';

const CoursesPage = () => {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getCourseProgress = (courseId: string) => {
    return mockCourseProgress.find(p => p.courseId === courseId);
  };

  const filteredCourses = mockCourses.filter(course => {
    const progress = getCourseProgress(course.id);
    if (filter === 'in-progress') return progress && progress.completionPercentage > 0 && progress.completionPercentage < 100;
    if (filter === 'completed') return progress && progress.completionPercentage === 100;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-inter text-foreground mb-4">
            My Courses
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey and master new skills
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="font-medium"
          >
            All Courses
          </Button>
          <Button
            variant={filter === 'in-progress' ? 'default' : 'outline'}
            onClick={() => setFilter('in-progress')}
            className="font-medium"
          >
            In Progress
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className="font-medium"
          >
            Completed
          </Button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const progress = getCourseProgress(course.id);
            const isStarted = progress && progress.completionPercentage > 0;
            const isCompleted = progress && progress.completionPercentage === 100;

            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-tech-glow transition-all duration-300 group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {course.totalDuration ? formatDuration(course.totalDuration) : 'TBD'}
                      </span>
                      <BookOpen className="w-4 h-4 ml-2" />
                      <span className="text-sm font-medium">
                        {course.totalLessons} lessons
                      </span>
                    </div>
                    {progress && (
                      <Progress 
                        value={progress.completionPercentage} 
                        className="h-2 bg-white/20"
                      />
                    )}
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-inter text-lg leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    {progress && (
                      <div className="text-sm text-muted-foreground">
                        {progress.completedLessons} of {progress.totalLessons} lessons
                      </div>
                    )}
                    <Link to={`/course/${course.id}`}>
                      <Button className="ml-auto group/btn">
                        <Play className="w-4 h-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
                        {isStarted ? 'Continue' : 'Start Course'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {filter === 'completed' && 'You haven\'t completed any courses yet.'}
              {filter === 'in-progress' && 'You don\'t have any courses in progress.'}
              {filter === 'all' && 'No courses available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;