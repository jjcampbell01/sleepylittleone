import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { BlogManagement } from "@/components/BlogManagement";

const AdminPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  console.log('AdminPage - Auth State:', { 
    isAuthenticated, 
    isLoading,
    hasUser: !!user,
    userId: user?.id 
  });
  
  // Simple timeout fallback - if loading takes more than 3 seconds, assume not authenticated
  const [timeoutReached, setTimeoutReached] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Auth loading timeout reached - proceeding without auth');
        setTimeoutReached(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  // Show loading only for first 3 seconds
  if (isLoading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated after timeout or loading is complete
  if ((!isAuthenticated && !isLoading) || (!isAuthenticated && timeoutReached)) {
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
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