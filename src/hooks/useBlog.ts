import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory, BlogTag, BlogPostWithRelations } from '@/types/blog';

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (tagsError) throw tagsError;
      setTags(tagsData || []);

      // Fetch posts with relations
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .eq('published', true)
        .order('publish_date', { ascending: false });

      if (postsError) throw postsError;
      
      // Transform the data to match our BlogPost interface
      const transformedPosts: BlogPost[] = (postsData as BlogPostWithRelations[] || []).map(post => ({
        ...post,
        category: post.blog_categories || undefined,
        tags: post.blog_post_tags?.map(pt => pt.blog_tags) || []
      }));

      setPosts(transformedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      if (!data) return null;

      const postData = data as BlogPostWithRelations;
      return {
        ...postData,
        category: postData.blog_categories || undefined,
        tags: postData.blog_post_tags?.map(pt => pt.blog_tags) || []
      };
    } catch (err) {
      console.error('Error fetching post:', err);
      return null;
    }
  };

  const searchPosts = async (query: string, categorySlug?: string): Promise<BlogPost[]> => {
    try {
      let queryBuilder = supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .eq('published', true);

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`);
      }

      if (categorySlug) {
        queryBuilder = queryBuilder.eq('blog_categories.slug', categorySlug);
      }

      const { data, error } = await queryBuilder.order('publish_date', { ascending: false });

      if (error) throw error;

      const transformedPosts: BlogPost[] = (data as BlogPostWithRelations[] || []).map(post => ({
        ...post,
        category: post.blog_categories || undefined,
        tags: post.blog_post_tags?.map(pt => pt.blog_tags) || []
      }));

      return transformedPosts;
    } catch (err) {
      console.error('Error searching posts:', err);
      return [];
    }
  };

  return {
    posts,
    categories,
    tags,
    loading,
    error,
    getPostBySlug,
    searchPosts,
    refetch: fetchBlogData
  };
};