import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { BlogManagement } from "@/components/BlogManagement";

const AdminPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  console.log('AdminPage accessed', { 
    isAuthenticated, 
    isLoading,
    user, 
    role: user?.role,
    userId: user?.id 
  });
  
  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Only redirect to login if not loading AND not authenticated
  if (!isLoading && !isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Only redirect to home if not loading AND no user
  if (!isLoading && !user) {
    console.log('No user found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage blog posts, categories, and content</p>
          </div>

          <Tabs defaultValue="blog" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Blog
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="blog">
              <BlogManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;