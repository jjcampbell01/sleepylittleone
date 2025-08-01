import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit, Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogPost, BlogCategory, BlogTag, ParsedBlogPost } from "@/types/blog";

export const BlogManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState("");

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      
      // Fetch all blog data
      const [postsResult, categoriesResult, tagsResult] = await Promise.all([
        supabase.from('blog_posts').select(`
          *,
          blog_categories(*),
          blog_post_tags(blog_tags(*))
        `).order('created_at', { ascending: false }),
        supabase.from('blog_categories').select('*').order('name'),
        supabase.from('blog_tags').select('*').order('name')
      ]);

      if (postsResult.error) throw postsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      if (tagsResult.error) throw tagsResult.error;

      setCategories(categoriesResult.data || []);
      setTags(tagsResult.data || []);

      // Transform posts data
      const transformedPosts = (postsResult.data || []).map(post => ({
        ...post,
        category: post.blog_categories,
        tags: post.blog_post_tags?.map(pt => pt.blog_tags) || []
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      toast({
        title: "Error",
        description: "Failed to load blog data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const parseBlogPost = (markdownText: string): ParsedBlogPost | null => {
    try {
      const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = markdownText.match(frontMatterRegex);
      
      if (!match) {
        throw new Error('Invalid markdown format. Expected front matter.');
      }

      const frontMatter = match[1];
      const content = match[2];

      // Parse front matter
      const meta: any = {};
      frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          let value = valueParts.join(':').trim();
          // Remove quotes
          value = value.replace(/^["']|["']$/g, '');
          
          if (key.trim() === 'tags') {
            meta[key.trim()] = JSON.parse(value);
          } else if (key.trim() === 'featured') {
            meta[key.trim()] = value === 'true';
          } else {
            meta[key.trim()] = value;
          }
        }
      });

      return {
        title: meta.title,
        excerpt: meta.excerpt,
        category: meta.category,
        tags: meta.tags || [],
        publish_date: meta.publish_date,
        featured: meta.featured || false,
        content: content.trim()
      };
    } catch (error) {
      console.error('Error parsing blog post:', error);
      return null;
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const createPost = async (parsedPost: ParsedBlogPost) => {
    try {
      // Find category
      const category = categories.find(c => c.name === parsedPost.category);
      if (!category) {
        throw new Error(`Category "${parsedPost.category}" not found`);
      }

      // Create post
      const { data: newPost, error: postError } = await supabase
        .from('blog_posts')
        .insert({
          title: parsedPost.title,
          slug: generateSlug(parsedPost.title),
          excerpt: parsedPost.excerpt,
          content: parsedPost.content,
          category_id: category.id,
          publish_date: parsedPost.publish_date,
          featured: parsedPost.featured,
          read_time: calculateReadTime(parsedPost.content),
          published: true
        })
        .select()
        .single();

      if (postError) throw postError;

      // Add tags
      if (parsedPost.tags.length > 0) {
        const tagInserts = [];
        for (const tagName of parsedPost.tags) {
          let tag = tags.find(t => t.name === tagName);
          if (!tag) {
            // Create new tag
            const { data: newTag, error: tagError } = await supabase
              .from('blog_tags')
              .insert({
                name: tagName,
                slug: generateSlug(tagName)
              })
              .select()
              .single();

            if (tagError) throw tagError;
            tag = newTag;
            setTags(prev => [...prev, newTag]);
          }

          tagInserts.push({
            post_id: newPost.id,
            tag_id: tag.id
          });
        }

        if (tagInserts.length > 0) {
          const { error: tagLinkError } = await supabase
            .from('blog_post_tags')
            .insert(tagInserts);

          if (tagLinkError) throw tagLinkError;
        }
      }

      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) {
      toast({
        title: "Error",
        description: "Please paste blog post content",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const parsedPost = parseBlogPost(bulkImportText);
      if (!parsedPost) {
        throw new Error('Failed to parse blog post');
      }

      await createPost(parsedPost);

      toast({
        title: "Success",
        description: "Blog post imported successfully"
      });

      setBulkImportText("");
      setShowBulkImport(false);
      fetchBlogData();
    } catch (error) {
      console.error('Error importing post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import blog post",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully"
      });

      fetchBlogData();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const togglePostPublished = async (postId: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${published ? 'published' : 'unpublished'} successfully`
      });

      fetchBlogData();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading blog management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Blog Management</h2>
        <Button 
          onClick={() => setShowBulkImport(!showBulkImport)}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import Blog Post
        </Button>
      </div>

      {showBulkImport && (
        <Card>
          <CardHeader>
            <CardTitle>Import Blog Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Paste your markdown blog post (with front matter):
              </label>
              <Textarea
                value={bulkImportText}
                onChange={(e) => setBulkImportText(e.target.value)}
                placeholder="---
title: &quot;Your Blog Post Title&quot;
excerpt: &quot;Your excerpt here&quot;
category: &quot;Newborn Sleep&quot;
tags: [&quot;tag1&quot;, &quot;tag2&quot;]
publish_date: &quot;2024-01-15&quot;
featured: false
---

# Your Blog Content Here

Your blog content in markdown format..."
                rows={15}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBulkImport} disabled={loading}>
                Import Post
              </Button>
              <Button variant="outline" onClick={() => setShowBulkImport(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No blog posts yet. Import your first post above.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{post.title}</h3>
                        {post.featured && <Badge variant="secondary">Featured</Badge>}
                        <Badge variant={post.published ? "default" : "outline"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        {post.category && (
                          <Badge variant="outline">{post.category.name}</Badge>
                        )}
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Slug: {post.slug}</span>
                        <span>{post.read_time} min read</span>
                        <span>{new Date(post.publish_date).toLocaleDateString()}</span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={post.published}
                          onCheckedChange={(checked) => togglePostPublished(post.id, checked)}
                        />
                        <span className="text-sm">Published</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={`/blog/${post.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePost(post.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({category.slug})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags ({tags.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};