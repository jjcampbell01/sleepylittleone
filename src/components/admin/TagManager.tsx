import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Tag } from "lucide-react";

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export const TagManager = () => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [tagName, setTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    setIsSubmitting(true);
    try {
      const slug = generateSlug(tagName);

      if (editingTag) {
        const { error } = await supabase
          .from('blog_tags')
          .update({ name: tagName.trim(), slug })
          .eq('id', editingTag.id);

        if (error) throw error;
        toast({ title: "Success", description: "Tag updated successfully" });
      } else {
        const { error } = await supabase
          .from('blog_tags')
          .insert({ name: tagName.trim(), slug });

        if (error) throw error;
        toast({ title: "Success", description: "Tag created successfully" });
      }

      setTagName("");
      setEditingTag(null);
      setIsDialogOpen(false);
      fetchTags();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingTag ? 'update' : 'create'} tag`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag? This will also remove it from all posts.")) return;

    try {
      // First delete all post-tag relationships
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('tag_id', id);

      // Then delete the tag itself
      const { error } = await supabase
        .from('blog_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Tag deleted successfully" });
      fetchTags();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setTagName("");
    setEditingTag(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <div className="p-4">Loading tags...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            <div>
              <CardTitle>Tag Management</CardTitle>
              <CardDescription>Manage blog tags and categories</CardDescription>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTag(null)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTag ? "Edit Tag" : "Create New Tag"}</DialogTitle>
                <DialogDescription>
                  {editingTag ? "Update the tag name" : "Add a new tag for organizing blog posts"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tagName">Tag Name</Label>
                  <Input
                    id="tagName"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="Enter tag name..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingTag ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No tags yet. Create your first tag to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{tag.name}</Badge>
                  <span className="text-sm text-muted-foreground">/{tag.slug}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tag.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};