import { useState, useEffect } from 'react';

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

interface StaticDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

async function fetchStaticData<T>(path: string): Promise<T> {
  try {
    // Try to fetch from static files first (for SSG builds)
    const response = await fetch(`/static/${path}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Static data not found');
  } catch (error) {
    // Fallback to API if static files aren't available
    console.warn(`Static data not available for ${path}, falling back to API`);
    throw error;
  }
}

export function useStaticBlogPosts(): StaticDataResponse<BlogPost[]> {
  const [data, setData] = useState<BlogPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const posts = await fetchStaticData<BlogPost[]>('blog-posts.json');
        if (mounted) {
          setData(posts);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load blog posts');
          setData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useStaticBlogCategories(): StaticDataResponse<BlogCategory[]> {
  const [data, setData] = useState<BlogCategory[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const categories = await fetchStaticData<BlogCategory[]>('blog-categories.json');
        if (mounted) {
          setData(categories);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load categories');
          setData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useStaticBlogPost(slug: string): StaticDataResponse<BlogPost> {
  const [data, setData] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let mounted = true;

    const loadData = async () => {
      try {
        const post = await fetchStaticData<BlogPost>(`posts/${slug}.json`);
        if (mounted) {
          setData(post);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load blog post');
          setData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return { data, loading, error };
}