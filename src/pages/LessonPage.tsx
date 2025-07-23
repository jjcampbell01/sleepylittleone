import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Download, MessageCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { mockCourses, mockProgress } from '@/data/mockCourses';
import { Lesson, Module, Course } from '@/types/course';

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Find lesson and course data
  let currentLesson: Lesson | null = null;
  let currentModule: Module | null = null;
  let currentCourse: Course | null = null;

  for (const course of mockCourses) {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) {
        currentLesson = lesson;
        currentModule = module;
        currentCourse = course;
        break;
      }
    }
    if (currentLesson) break;
  }

  useEffect(() => {
    if (currentLesson) {
      const progress = mockProgress.find(p => p.lessonId === currentLesson!.id);
      setIsCompleted(progress?.completed || false);
    }
  }, [currentLesson]);

  if (!currentLesson || !currentModule || !currentCourse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Lesson Not Found</h1>
          <p className="text-muted-foreground mb-4">The lesson you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAllLessons = () => {
    const allLessons: Array<{lesson: Lesson, module: Module}> = [];
    currentCourse!.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        allLessons.push({ lesson, module });
      });
    });
    return allLessons;
  };

  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(item => item.lesson.id === lessonId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const toggleCompletion = () => {
    setIsCompleted(!isCompleted);
    // In a real app, this would update the backend
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would add the comment to the backend
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <h1 className="font-semibold truncate">{currentLesson.title}</h1>
        <Link to={`/course/${currentCourse.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="flex h-screen lg:h-[calc(100vh-0px)]">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative z-30 w-80 bg-card border-r h-full transition-transform duration-300 overflow-y-auto`}>
          
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <Link to={`/course/${currentCourse.id}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Link>
            <h2 className="font-semibold text-lg mt-2 line-clamp-2">{currentCourse.title}</h2>
          </div>

          {/* Module and Lesson List */}
          <div className="p-4 space-y-4">
            {currentCourse.modules.map((module) => (
              <div key={module.id}>
                <h3 className="font-medium text-sm text-foreground mb-3">
                  Module {module.order}: {module.title}
                </h3>
                <div className="space-y-2">
                  {module.lessons.map((lesson, index) => {
                    const progress = mockProgress.find(p => p.lessonId === lesson.id);
                    const completed = progress?.completed;
                    const isCurrent = lesson.id === lessonId;
                    
                    return (
                      <Link
                        key={lesson.id}
                        to={`/lesson/${lesson.id}`}
                        className={`block p-3 rounded-lg transition-colors ${
                          isCurrent 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            completed 
                              ? 'bg-green-100 text-green-600' 
                              : isCurrent
                              ? 'bg-white/20 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {completed ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm line-clamp-1 ${
                              isCurrent ? 'text-white' : ''
                            }`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs opacity-75">
                                {lesson.duration ? formatDuration(lesson.duration) : 'TBD'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video Section */}
          <div className="bg-black aspect-video lg:aspect-[16/9] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-primary border-t-[4px] border-b-[4px] border-t-transparent border-b-transparent ml-0.5"></div>
                  </div>
                </div>
                <p className="text-lg font-medium mb-2">Video Player</p>
                <p className="text-sm text-white/70">Vimeo integration coming soon</p>
                <p className="text-xs text-white/50 mt-2 font-mono">{currentLesson.videoUrl}</p>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Lesson Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold font-inter text-foreground">
                      {currentLesson.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {currentModule.title} • Lesson {currentLesson.order}
                    </p>
                  </div>
                  <Button
                    onClick={toggleCompletion}
                    variant={isCompleted ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
                
                <p className="text-foreground leading-relaxed">
                  {currentLesson.description}
                </p>
              </div>

              {/* Resources */}
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentLesson.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Discussion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div>
                    <Textarea
                      placeholder="Ask a question or share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-3"
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>

                  {/* Existing Comments */}
                  {currentLesson.comments && currentLesson.comments.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                      {currentLesson.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <img
                            src={comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&size=32`}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                {previousLesson ? (
                  <Link to={`/lesson/${previousLesson.lesson.id}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Previous: {previousLesson.lesson.title}
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link to={`/lesson/${nextLesson.lesson.id}`}>
                    <Button className="flex items-center gap-2">
                      Next: {nextLesson.lesson.title}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/course/${currentCourse.id}`}>
                    <Button variant="outline">
                      Back to Course
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
