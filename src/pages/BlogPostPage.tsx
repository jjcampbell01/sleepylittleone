import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Share2, ChevronLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { BlogCard } from "@/components/blog/BlogCard";
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

interface BlogTag {
  id: string;
  name: string;
  slug: string;
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
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching post:", error);
        setNotFound(true);
        return;
      }

      if (!data) {
        setNotFound(true);
        return;
      }

      setPost(data);

      // Fetch tags for this post
      const { data: tagData } = await supabase
        .from("blog_post_tags")
        .select(
          `
          blog_tags (
            id,
            name,
            slug
          )
        `
        )
        .eq("post_id", data.id);

      if (tagData) {
        setTags(tagData.map((item: any) => item.blog_tags));
      }

      // Fetch category if exists
      if (data.category_id) {
        const { data: categoryData } = await supabase
          .from("blog_categories")
          .select("*")
          .eq("id", data.category_id)
          .maybeSingle();

        if (categoryData) setCategory(categoryData);

        // Related posts from same category
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("category_id", data.category_id)
          .eq("published", true)
          .neq("id", data.id)
          .order("publish_date", { ascending: false })
          .limit(3);

        setRelatedPosts(relatedData || []);
      }
    } catch (error) {
      console.error("Error:", error);
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
      } catch {
        // user canceled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // optionally show a toast
    }
  };

  const getCategoryName = (_categoryId: string) => category?.name || "Uncategorized";

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

  const canonicalUrl = `https://www.sleepylittleone.com/blog/${post.slug}`;

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        canonical={canonicalUrl}
        keywords={tags.map((t) => t.name).join(", ")}
        image={post.featured_image_url}
        type="article"
      />

      {/* JSON-LD: Article */}
      <StructuredData
        type="Article"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.featured_image_url
            ? [post.featured_image_url]
            : ["https://www.sleepylittleone.com/images/og-sleep.jpg"],
          author: {
            "@type": "Person",
            name: "Sleepy Little One",
          },
          publisher: {
            "@type": "Organization",
            name: "Sleepy Little One",
            logo: {
              "@type": "ImageObject",
              url: "https://www.sleepylittleone.com/images/logo.png",
            },
          },
          datePublished: post.publish_date,
          dateModified: post.publish_date,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
          url: canonicalUrl,
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="gap-2 -ml-2">
              <Link to="/blog">
                <ChevronLeft className="w-4 h-4" />
                Back to Articles
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {category && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {category.name}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {post.read_time} min read
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight bg-gradient-primary bg-clip-text text-transparent">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-card/50 rounded-lg border">
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>
                    Published {format(new Date(post.publish_date), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Article
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-12">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full aspect-[16/9] object-cover rounded-xl shadow-2xl"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg prose-primary max-w-none mb-16 bg-card/30 p-8 md:p-12 rounded-xl">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-foreground/90">
                    {children}
                  </p>
                ),
                ul: ({ children }) => <ul className="mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-foreground/90">{children}</li>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">More from {category?.name}</h2>
                <p className="text-muted-foreground">
                  Continue exploring helpful sleep training resources
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.id}
                    post={relatedPost}
                    getCategoryName={getCategoryName}
                  />
                ))}
              </div>
            </section>
          )}

          <Separator className="my-12" />

          {/* CTA Section */}
          <div className="text-center bg-gradient-primary p-8 md:p-12 rounded-xl text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Baby's Sleep?
            </h3>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Get personalized sleep strategies and gentle methods that work for your
              family.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/sleep-quiz">
                Take Our Sleep Quiz
                <span>→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
