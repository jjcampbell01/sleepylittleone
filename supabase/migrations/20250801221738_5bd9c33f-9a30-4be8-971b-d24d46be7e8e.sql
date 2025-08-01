-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog tags table  
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  read_time INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog post tags junction table
CREATE TABLE public.blog_post_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, tag_id)
);

-- Enable RLS on all blog tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view blog categories" 
ON public.blog_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage blog categories" 
ON public.blog_categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for blog_tags
CREATE POLICY "Anyone can view blog tags" 
ON public.blog_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage blog tags" 
ON public.blog_tags 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for blog_post_tags
CREATE POLICY "Anyone can view blog post tags" 
ON public.blog_post_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage blog post tags" 
ON public.blog_post_tags 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Create storage policies for blog images
CREATE POLICY "Anyone can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'blog-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'blog-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'blog-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create triggers for updating timestamps
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON public.blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Newborn Sleep', 'newborn-sleep', 'Sleep guidance for newborns 0-3 months'),
('Night Wakings', 'night-wakings', 'Understanding and managing night wakings'),
('Safe Sleep', 'safe-sleep', 'Safe sleep practices and environment'),
('Expert Advice', 'expert-advice', 'Research-backed insights from sleep specialists'),
('Inclusive Parenting', 'inclusive-parenting', 'Culturally sensitive and accessible sleep support'),
('Sleep Tools & Insights', 'sleep-tools-insights', 'Practical tools and assessments for better sleep');

-- Insert common tags
INSERT INTO public.blog_tags (name, slug) VALUES
('night wakings', 'night-wakings'),
('infant sleep', 'infant-sleep'),
('normal sleep', 'normal-sleep'),
('self-soothing', 'self-soothing'),
('night care', 'night-care'),
('red light', 'red-light'),
('low stimulation', 'low-stimulation'),
('pediatric sleep', 'pediatric-sleep'),
('evidence-based', 'evidence-based'),
('routines', 'routines'),
('safety', 'safety'),
('crying peak', 'crying-peak'),
('soothing', 'soothing'),
('early parenting', 'early-parenting'),
('self-care', 'self-care'),
('multilingual', 'multilingual'),
('cultural support', 'cultural-support'),
('sleep equity', 'sleep-equity'),
('translated resources', 'translated-resources'),
('routine', 'routine'),
('newborn', 'newborn'),
('self-settling', 'self-settling'),
('wake windows', 'wake-windows'),
('baby sleep score', 'baby-sleep-score'),
('self-assessment', 'self-assessment'),
('confidence', 'confidence'),
('sleep environment', 'sleep-environment'),
('white noise', 'white-noise'),
('temperature', 'temperature'),
('crib safety', 'crib-safety');