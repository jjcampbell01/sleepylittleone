import { Link } from 'react-router-dom';
import { ArrowRight, Play, BookOpen, Users, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockCourses, mockCourseProgress } from '@/data/mockCourses';

const Index = () => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getCourseProgress = (courseId: string) => {
    return mockCourseProgress.find(p => p.courseId === courseId);
  };

  const featuredCourse = mockCourses[0];
  const featuredProgress = getCourseProgress(featuredCourse.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold font-inter bg-gradient-primary bg-clip-text text-transparent">
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
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold font-inter mb-6">
              Master Skills That Matter
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Transform your career with our comprehensive course platform. Learn from industry experts, 
              practice with real projects, and advance your skills at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning Today
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View All Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-inter mb-4">Featured Course</h2>
            <p className="text-muted-foreground text-lg">Start your learning journey with our most popular course</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-tech-glow transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={featuredCourse.thumbnail}
                    alt={featuredCourse.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {featuredCourse.totalLessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {featuredCourse.totalDuration ? formatDuration(featuredCourse.totalDuration) : 'TBD'}
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Most Popular
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">(4.9)</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold font-inter mb-4">{featuredCourse.title}</h3>
                  <p className="text-muted-foreground mb-6">{featuredCourse.description}</p>

                  {featuredProgress && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Your Progress</span>
                        <span className="text-sm text-muted-foreground">{featuredProgress.completionPercentage}%</span>
                      </div>
                      <Progress value={featuredProgress.completionPercentage} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link to={`/course/${featuredCourse.id}`} className="flex-1">
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        {featuredProgress && featuredProgress.completionPercentage > 0 ? 'Continue Learning' : 'Start Course'}
                      </Button>
                    </Link>
                    <Button variant="outline">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* All Courses Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold font-inter mb-4">Explore All Courses</h2>
              <p className="text-muted-foreground text-lg">Discover courses that fit your learning goals</p>
            </div>
            <Link to="/courses">
              <Button variant="outline" className="flex items-center gap-2">
                View All Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.slice(0, 3).map((course) => {
              const progress = getCourseProgress(course.id);
              
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
                      <div className="flex items-center gap-4 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.totalLessons} lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.modules.length} modules
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="font-inter text-lg leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {progress && progress.completionPercentage > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm text-muted-foreground">{progress.completionPercentage}%</span>
                        </div>
                        <Progress value={progress.completionPercentage} className="h-2" />
                      </div>
                    )}
                    
                    <Link to={`/course/${course.id}`}>
                      <Button className="w-full group/btn">
                        <Play className="w-4 h-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
                        {progress && progress.completionPercentage > 0 ? 'Continue' : 'Start Course'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold font-inter mb-4 bg-gradient-primary bg-clip-text text-transparent">
                LearnFlow
              </h3>
              <p className="text-muted-foreground text-sm">
                Empowering learners worldwide with cutting-edge courses and expert instruction.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">Web Development</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Data Science</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Design</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Marketing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 LearnFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
