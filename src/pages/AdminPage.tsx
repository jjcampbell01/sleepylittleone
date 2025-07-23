import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navigate } from "react-router-dom";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  vimeoUrl: string;
}

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Check if user is admin
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/courses" replace />;
  }

  const [courseTitle, setCourseTitle] = useState("React Mastery: From Beginner to Expert");
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Introduction to React",
      vimeoUrl: "https://vimeo.com/123456789"
    },
    {
      id: "2", 
      title: "Components and Props",
      vimeoUrl: "https://vimeo.com/123456790"
    },
    {
      id: "3",
      title: "State and Lifecycle",
      vimeoUrl: "https://vimeo.com/123456791"
    }
  ]);

  const addNewLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      vimeoUrl: ""
    };
    setLessons([...lessons, newLesson]);
  };

  const updateLesson = (id: string, field: keyof Lesson, value: string) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, [field]: value } : lesson
    ));
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const saveChanges = () => {
    // In production, this would save to a backend
    toast({
      title: "Changes saved",
      description: "Course content has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
              <p className="text-muted-foreground">Manage course content and lessons</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Course Title Section */}
              <div className="space-y-3">
                <Label htmlFor="courseTitle" className="text-lg font-semibold">
                  Course Title
                </Label>
                <Input
                  id="courseTitle"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="text-lg"
                  placeholder="Enter course title"
                />
              </div>

              <Separator />

              {/* Lessons Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Video Lessons</Label>
                  <Button onClick={addNewLesson} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Lesson
                  </Button>
                </div>

                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="p-4 border-2 border-muted">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Lesson {index + 1}</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeLesson(lesson.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${lesson.id}`}>Lesson Title</Label>
                            <Input
                              id={`title-${lesson.id}`}
                              value={lesson.title}
                              onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                              placeholder="Enter lesson title"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`vimeo-${lesson.id}`}>Vimeo URL</Label>
                            <Input
                              id={`vimeo-${lesson.id}`}
                              value={lesson.vimeoUrl}
                              onChange={(e) => updateLesson(lesson.id, 'vimeoUrl', e.target.value)}
                              placeholder="https://vimeo.com/123456789"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {lessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No lessons yet. Click "Add New Lesson" to get started.</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Save Section */}
              <div className="flex justify-end">
                <Button onClick={saveChanges} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;