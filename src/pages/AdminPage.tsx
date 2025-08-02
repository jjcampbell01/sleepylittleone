import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Calendar, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  meta_description: string;
  meta_title: string;
  featured_image_url: string;
  published: boolean;
  slug: string;
  publish_date: string;
  category_id: string;
  created_at: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

const AdminPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    meta_description: "",
    meta_title: "",
    featured_image_url: "",
    published: false,
    slug: "",
    publish_date: "",
    category_id: ""
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.slug || generateSlug(formData.title);
    const publishDate = formData.publish_date || new Date().toISOString();
    
    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            meta_description: formData.meta_description,
            meta_title: formData.meta_title,
            featured_image_url: formData.featured_image_url,
            published: formData.published,
            slug: slug,
            publish_date: publishDate,
            category_id: formData.category_id || null
          })
          .eq('id', editingPost.id);

        if (error) throw error;
        toast({ title: "Success", description: "Post updated successfully" });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            meta_description: formData.meta_description,
            meta_title: formData.meta_title,
            featured_image_url: formData.featured_image_url,
            published: formData.published,
            slug: slug,
            publish_date: publishDate,
            category_id: formData.category_id || null
          });

        if (error) throw error;
        toast({ title: "Success", description: "Post created successfully" });
      }

      setFormData({ 
        title: "", 
        content: "", 
        excerpt: "", 
        meta_description: "", 
        meta_title: "", 
        featured_image_url: "", 
        published: false, 
        slug: "", 
        publish_date: "", 
        category_id: "" 
      });
      setEditingPost(null);
      setIsCreating(false);
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      meta_description: post.meta_description || "",
      meta_title: post.meta_title || "",
      featured_image_url: post.featured_image_url || "",
      published: post.published,
      slug: post.slug,
      publish_date: post.publish_date ? new Date(post.publish_date).toISOString().split('T')[0] : "",
      category_id: post.category_id || ""
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Post deleted successfully" });
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: "", 
      content: "", 
      excerpt: "", 
      meta_description: "", 
      meta_title: "", 
      featured_image_url: "", 
      published: false, 
      slug: "", 
      publish_date: "", 
      category_id: "" 
    });
    setEditingPost(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog CMS</h1>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
            <CardDescription>
              {editingPost ? "Update your blog post" : "Add a new blog post to your website"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="Auto-generated from title if empty"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    placeholder="Short summary for blog listings and previews"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    required
                  />
                </div>
              </div>

              {/* SEO Section */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">SEO & Social Sharing</h3>
                
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="Custom title for search engines (defaults to post title)"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    rows={3}
                    placeholder="Description for search engines and social previews (160 chars recommended)"
                  />
                </div>

                <div>
                  <Label htmlFor="featured_image_url" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Cover Image URL
                  </Label>
                  <Input
                    id="featured_image_url"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Publishing Section */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Publishing
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input
                      id="publish_date"
                      type="date"
                      value={formData.publish_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Published</Label>
                  <span className="text-sm text-muted-foreground ml-2">
                    Only published posts appear on the blog
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Posts</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet. Create your first post!</p>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;