import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  publish_date: string;
  read_time: number;
  category_id: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

const CATEGORY_COLORS = {
  'Expert Advice': 'bg-blue-50 text-blue-700 border-blue-200',
  'Inclusive Parenting': 'bg-green-50 text-green-700 border-green-200',
  'Newborn Sleep': 'bg-purple-50 text-purple-700 border-purple-200',
  'Night Wakings': 'bg-orange-50 text-orange-700 border-orange-200',
  'Safe Sleep': 'bg-red-50 text-red-700 border-red-200',
  'Sleep Tools & Insights': 'bg-indigo-50 text-indigo-700 border-indigo-200',
} as const;

export function HomeBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
    fetchCategories();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('publish_date', { ascending: false })
        .limit(3);

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
    return category ? category.name : '';
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">From the Blog</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-muted"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            From the Blog
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover expert insights, practical tips, and proven strategies to help your little one sleep better
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => {
            const categoryName = getCategoryName(post.category_id);
            const categoryColorClass = CATEGORY_COLORS[categoryName as keyof typeof CATEGORY_COLORS] || 'bg-gray-50 text-gray-700 border-gray-200';

            return (
              <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border hover:border-primary/30 bg-gradient-to-br from-card to-card/50">
                <Link to={`/blog/${post.slug}`} className="block">
                  {post.featured_image_url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      {post.category_id && (
                        <Badge className={`text-xs font-medium ${categoryColorClass}`}>
                          {categoryName}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-300 text-xl leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {format(new Date(post.publish_date), 'MMM d')}
                        </div>
                        
                        {post.read_time > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.read_time} min
                          </div>
                        )}
                      </div>
                      
                      <Button variant="ghost" size="sm" className="group/btn p-0 h-auto text-primary hover:text-primary/80">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to="/blog">
              Explore All Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}