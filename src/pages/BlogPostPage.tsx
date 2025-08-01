import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, Share2, Calendar } from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import { CTASection } from "@/components/CTASection";
import ReactMarkdown from "react-markdown";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug, posts } = useBlog();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const fetchedPost = await getPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

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

  const getRelatedPosts = () => {
    if (!post) return [];
    
    return posts
      .filter(p => p.id !== post.id && p.category?.id === post.category?.id)
      .slice(0, 3);
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const relatedPosts = getRelatedPosts();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `${post.title} - Expert sleep advice from Sleepy Little One`}
        canonical={`https://www.sleepylittleone.com/blog/${post.slug}`}
        type="article"
      />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/blog" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {post.category && (
              <Badge variant="secondary">{post.category.name}</Badge>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publish_date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time || calculateReadTime(post.content)} min read
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic text-foreground">{children}</em>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-foreground">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-muted/50 rounded-r">
                  <div className="text-foreground italic">{children}</div>
                </blockquote>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* CTA Section */}
        <div className="my-12">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Ready to Transform Your Baby's Sleep?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get personalized guidance with our gentle, science-backed approach. Join thousands of families who've found better nights with Sleepy Little One.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/sleep-quiz">Take Our Sleep Quiz</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="#pricing">View Courses</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    {relatedPost.category && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {relatedPost.category.name}
                      </Badge>
                    )}
                    <h3 className="font-semibold leading-tight mb-2">
                      <Link 
                        to={`/blog/${relatedPost.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {relatedPost.read_time || calculateReadTime(relatedPost.content)} min read
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Final CTA */}
      <CTASection />
    </div>
  );
};

export default BlogPostPage;