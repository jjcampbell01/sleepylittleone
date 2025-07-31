-- Create quiz_responses table to store all quiz submissions
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  baby_age TEXT NOT NULL,
  naps_per_day TEXT,
  night_wakings TEXT NOT NULL,
  sleep_struggles TEXT[] NOT NULL,
  tried_strategies TEXT NOT NULL,
  sleep_training_concerns TEXT,
  result_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own quiz responses
CREATE POLICY "select_own_quiz_responses" ON public.quiz_responses
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create policy for inserting quiz responses (allow anonymous)
CREATE POLICY "insert_quiz_responses" ON public.quiz_responses
FOR INSERT
WITH CHECK (true);

-- Create policy for admins to view all quiz responses
CREATE POLICY "admin_view_all_quiz_responses" ON public.quiz_responses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_quiz_responses_updated_at
  BEFORE UPDATE ON public.quiz_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();