import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ArrowLeft } from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";

const BlogPage = () => {
  const { posts, categories, loading, error } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        post.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPosts = useMemo(() => {
    return filteredPosts.filter(post => post.featured);
  }, [filteredPosts]);

  const regularPosts = useMemo(() => {
    return filteredPosts.filter(post => !post.featured);
  }, [filteredPosts]);

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Blog</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Sleep Blog | Expert Advice & Tips"
        description="Discover evidence-based baby sleep advice, expert tips, and gentle strategies to help your little one sleep better. From newborn sleep to night wakings."
        canonical="https://www.sleepylittleone.com/blog"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">Sleep Blog</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Evidence-based advice and gentle strategies for better baby sleep
          </p>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Featured Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {post.category && (
                        <Badge variant="secondary">{post.category.name}</Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.publish_date)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold leading-tight">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {post.read_time || calculateReadTime(post.content)} min read
                      </div>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-primary hover:underline font-medium"
                      >
                        Read more
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">All Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {post.category && (
                        <Badge variant="outline" className="text-xs">
                          {post.category.name}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.publish_date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-tight">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.read_time || calculateReadTime(post.content)} min
                      </div>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Read more
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;