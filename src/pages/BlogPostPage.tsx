import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, ArrowLeft, Share2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
        return;
      }

      if (!data) {
        setNotFound(true);
        return;
      }

      setPost(data);

      // Fetch category if exists
      if (data.category_id) {
        const { data: categoryData } = await supabase
          .from('blog_categories')
          .select('*')
          .eq('id', data.category_id)
          .maybeSingle();

        if (categoryData) {
          setCategory(categoryData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">Loading blog post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        canonical={`/blog/${post.slug}`}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {/* Category */}
            {category && (
              <div className="mb-4">
                <Badge variant="secondary" className="text-sm">
                  {category.name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {format(new Date(post.publish_date), 'MMMM d, yyyy')}
                </div>
                
                {post.read_time > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.read_time} min read
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            <Separator />
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8">
              <div className="aspect-video md:aspect-[2/1] overflow-hidden rounded-lg">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:mb-6 prose-li:mb-2">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Back to Blog Footer */}
          <div className="mt-12 pt-8 border-t">
            <div className="text-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Posts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}