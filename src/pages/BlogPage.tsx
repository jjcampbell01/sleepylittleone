import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  publish_date: string;
  read_time: number;
  meta_title: string;
  meta_description: string;
  published: boolean;
  category_id: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedPosts();
    fetchCategories();
  }, []);

  const fetchPublishedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('publish_date', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">Loading blog posts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Blog - Sleep Training & Baby Sleep Tips"
        description="Expert advice and tips on baby sleep training, sleep schedules, and helping your little one sleep through the night."
        canonical="/blog"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Sleep Training Blog
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Expert advice and proven strategies to help your little one develop healthy sleep habits and sleep through the night.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-3xl font-semibold mb-6">No blog posts yet</h2>
              <p className="text-lg text-muted-foreground">Check back soon for helpful sleep training content!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Post */}
              {posts.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                    <div className="md:flex">
                      {posts[0].featured_image_url && (
                        <div className="md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                          <img
                            src={posts[0].featured_image_url}
                            alt={posts[0].title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      
                      <div className="md:w-1/2 p-8">
                        <div className="flex items-center gap-2 mb-4">
                          {posts[0].category_id && (
                            <Badge variant="default" className="text-sm">
                              {getCategoryName(posts[0].category_id)}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                          {posts[0].title}
                        </h3>
                        
                        {posts[0].excerpt && (
                          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                            {posts[0].excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            {format(new Date(posts[0].publish_date), 'MMM d, yyyy')}
                          </div>
                          
                          {posts[0].read_time > 0 && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {posts[0].read_time} min read
                            </div>
                          )}
                        </div>
                        
                        <Button asChild size="lg" className="gap-2">
                          <Link to={`/blog/${posts[0].slug}`}>
                            Read Article
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </section>
              )}

              {/* Recent Posts Grid */}
              {posts.length > 1 && (
                <section>
                  <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.slice(1).map((post) => (
                      <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/20">
                        <Link to={`/blog/${post.slug}`} className="block">
                          {post.featured_image_url && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 mb-3">
                              {post.category_id && (
                                <Badge variant="secondary" className="text-xs">
                                  {getCategoryName(post.category_id)}
                                </Badge>
                              )}
                            </div>
                            
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-200 text-lg leading-tight">
                              {post.title}
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            {post.excerpt && (
                              <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}
                            
                            <Separator className="my-4" />
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                {format(new Date(post.publish_date), 'MMM d, yyyy')}
                              </div>
                              
                              {post.read_time > 0 && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {post.read_time} min read
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}