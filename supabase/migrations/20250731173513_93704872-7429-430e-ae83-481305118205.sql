-- Create lead_captures table for storing opt-in submissions
CREATE TABLE public.lead_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all lead captures
CREATE POLICY "Admins can view all lead captures" 
ON public.lead_captures 
FOR SELECT 
USING (
  ( SELECT profiles.role
    FROM profiles
    WHERE profiles.user_id = auth.uid()) = 'admin'::text
);

-- Create policy to allow anyone to insert lead captures (public form)
CREATE POLICY "Anyone can create lead captures" 
ON public.lead_captures 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lead_captures_updated_at
BEFORE UPDATE ON public.lead_captures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on email for better performance
CREATE INDEX idx_lead_captures_email ON public.lead_captures(email);
CREATE INDEX idx_lead_captures_created_at ON public.lead_captures(created_at DESC);