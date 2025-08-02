import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { BlogSkeleton } from "@/components/blog/BlogSkeleton";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category_id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        getCategoryName(post.category_id).toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [posts, selectedCategory, searchQuery, categories]);

  // Calculate post counts per category
  const postCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      if (post.category_id) {
        counts[post.category_id] = (counts[post.category_id] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <>
      <SEO
        title="Blog - Sleep Training & Baby Sleep Tips"
        description="Expert advice and tips on baby sleep training, sleep schedules, and helping your little one sleep through the night."
        canonical="/blog"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Baby Sleep Resources
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Expert-backed advice, gentle strategies, and proven methods to help your little one sleep peacefully through the night.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12 space-y-8">
            <BlogSearch 
              onSearch={setSearchQuery} 
              placeholder="Search sleep tips, night routines, and more..." 
            />
            
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              postCounts={postCounts}
            />
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl">💤</span>
                </div>
                <h2 className="text-3xl font-semibold mb-6">Sleep Resources Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're preparing helpful content about baby sleep training, schedules, and gentle methods. Check back soon!
                </p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4">No articles found</h2>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Post */}
              {!selectedCategory && !searchQuery && filteredPosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold">Featured Article</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-primary text-white">
                      ✨ Must Read
                    </span>
                  </div>
                  <BlogCard 
                    post={filteredPosts[0]} 
                    getCategoryName={getCategoryName}
                    variant="featured"
                  />
                </section>
              )}

              {/* All Posts Grid */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">
                    {searchQuery ? `Search Results (${filteredPosts.length})` : 
                     selectedCategory ? `${getCategoryName(selectedCategory)} Articles` : 
                     'Latest Articles'}
                  </h2>
                  
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Show all articles
                    </button>
                  )}
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {(selectedCategory || searchQuery ? filteredPosts : filteredPosts.slice(1)).map((post) => (
                    <BlogCard 
                      key={post.id}
                      post={post} 
                      getCategoryName={getCategoryName}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}