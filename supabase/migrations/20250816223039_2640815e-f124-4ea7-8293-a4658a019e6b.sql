-- Fix critical security vulnerability in quiz_responses table
-- Remove public read access that exposes customer email addresses

-- Drop the insecure policy that allows unauthenticated access
DROP POLICY "select_own_quiz_responses" ON public.quiz_responses;

-- Create a secure policy that only allows users to view their own responses
-- and only when they are authenticated
CREATE POLICY "Users can view only their own quiz responses" 
ON public.quiz_responses 
FOR SELECT 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- The admin policy "admin_view_all_quiz_responses" remains unchanged
-- as it properly restricts access to authenticated admin users only