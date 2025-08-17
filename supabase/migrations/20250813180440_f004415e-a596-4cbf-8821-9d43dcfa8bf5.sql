-- Create table for public shareable sleep plans
CREATE TABLE public.public_sleep_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  age_months INTEGER NOT NULL,
  age_weeks INTEGER,
  input_data JSONB NOT NULL,
  derived_data JSONB NOT NULL,
  baby_name_public TEXT,
  consent_analytics BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.public_sleep_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view public sleep plans" 
ON public.public_sleep_plans 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create public sleep plans" 
ON public.public_sleep_plans 
FOR INSERT 
WITH CHECK (true);

-- Create index for slug lookups
CREATE INDEX idx_public_sleep_plans_slug ON public.public_sleep_plans(slug);

-- Create analytics table for tracking (consent-based)
CREATE TABLE public.sleep_plan_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_slug TEXT NOT NULL,
  event_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

-- Enable RLS on analytics
ALTER TABLE public.sleep_plan_analytics ENABLE ROW LEVEL SECURITY;

-- Policy for analytics - anyone can insert events
CREATE POLICY "Anyone can create analytics events" 
ON public.sleep_plan_analytics 
FOR INSERT 
WITH CHECK (true);

-- Index for analytics queries
CREATE INDEX idx_sleep_plan_analytics_slug ON public.sleep_plan_analytics(plan_slug);
CREATE INDEX idx_sleep_plan_analytics_event ON public.sleep_plan_analytics(event_type);