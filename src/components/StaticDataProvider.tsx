import React, { createContext, useContext, ReactNode } from 'react';
import { useStaticBlogPosts, useStaticBlogCategories } from '@/hooks/useStaticData';

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

interface StaticDataContextType {
  posts: BlogPost[];
  categories: BlogCategory[];
  loading: boolean;
  error: string | null;
}

const StaticDataContext = createContext<StaticDataContextType | undefined>(undefined);

interface StaticDataProviderProps {
  children: ReactNode;
}

export const StaticDataProvider: React.FC<StaticDataProviderProps> = ({ children }) => {
  const { data: posts, loading: postsLoading, error: postsError } = useStaticBlogPosts();
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useStaticBlogCategories();

  const loading = postsLoading || categoriesLoading;
  const error = postsError || categoriesError;

  const value: StaticDataContextType = {
    posts: posts || [],
    categories: categories || [],
    loading,
    error
  };

  return (
    <StaticDataContext.Provider value={value}>
      {children}
    </StaticDataContext.Provider>
  );
};

export const useStaticData = (): StaticDataContextType => {
  const context = useContext(StaticDataContext);
  if (context === undefined) {
    throw new Error('useStaticData must be used within a StaticDataProvider');
  }
  return context;
};