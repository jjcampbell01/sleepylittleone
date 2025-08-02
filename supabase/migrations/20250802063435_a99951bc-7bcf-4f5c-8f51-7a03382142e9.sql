-- Add public access policies for blog CMS functionality
-- Allow anyone to insert blog posts (for CMS)
CREATE POLICY "Anyone can create blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update blog posts (for CMS)
CREATE POLICY "Anyone can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (true);

-- Allow anyone to delete blog posts (for CMS) 
CREATE POLICY "Anyone can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (true);