import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  postId?: string;
}

export const TagSelector = ({ selectedTags, onTagsChange, postId }: TagSelectorProps) => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
    if (postId) {
      fetchPostTags();
    }
  }, [postId]);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const fetchPostTags = async () => {
    if (!postId) return;
    
    try {
      const { data, error } = await supabase
        .from('blog_post_tags')
        .select('tag_id')
        .eq('post_id', postId);

      if (error) throw error;
      const tagIds = data?.map(item => item.tag_id) || [];
      onTagsChange(tagIds);
    } catch (error) {
      console.error('Failed to fetch post tags:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreatingTag(true);
    try {
      const slug = generateSlug(newTagName);
      const { data, error } = await supabase
        .from('blog_tags')
        .insert({ name: newTagName.trim(), slug })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      onTagsChange([...selectedTags, data.id]);
      setNewTagName("");
      setIsOpen(false);
      
      toast({
        title: "Success",
        description: `Tag "${newTagName}" created successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive"
      });
    } finally {
      setIsCreatingTag(false);
    }
  };

  const toggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newSelectedTags);
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div className="space-y-3">
      <Label>Tags</Label>
      
      {/* Selected Tags Display */}
      {selectedTagsData.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagsData.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
              {tag.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Selector */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="justify-between"
          >
            Select tags...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>
              <div className="p-4 space-y-3">
                <p>No tags found.</p>
                <div className="space-y-2">
                  <Input
                    placeholder="Create new tag..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        createTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={createTag}
                    disabled={!newTagName.trim() || isCreatingTag}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isCreatingTag ? "Creating..." : "Create Tag"}
                  </Button>
                </div>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => toggleTag(tag.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {tag.name}
                </CommandItem>
              ))}
              {tags.length > 0 && (
                <div className="border-t p-2">
                  <div className="space-y-2">
                    <Input
                      placeholder="Create new tag..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          createTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={createTag}
                      disabled={!newTagName.trim() || isCreatingTag}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isCreatingTag ? "Creating..." : "Create Tag"}
                    </Button>
                  </div>
                </div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};