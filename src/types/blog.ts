export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  category_id?: string;
  category?: BlogCategory;
  tags?: BlogTag[];
  publish_date: string;
  featured: boolean;
  published: boolean;
  meta_title?: string;
  meta_description?: string;
  read_time?: number;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostWithRelations extends BlogPost {
  blog_categories?: BlogCategory;
  blog_post_tags?: Array<{
    blog_tags: BlogTag;
  }>;
}

export interface ParsedBlogPost {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publish_date: string;
  featured: boolean;
  content: string;
}