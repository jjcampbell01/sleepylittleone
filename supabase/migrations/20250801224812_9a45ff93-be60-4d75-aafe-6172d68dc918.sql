-- Fix authentication issue by removing problematic user and creating proper admin account

-- First, delete the problematic manually created user and its profile
DELETE FROM public.profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'support@sleepylittleone.com'
);

DELETE FROM auth.users WHERE email = 'support@sleepylittleone.com';

-- We cannot directly insert into auth.users properly via SQL migration
-- Instead, we'll create the profile entry that will be needed when the user signs up
-- The admin user should be created through Supabase Dashboard or signup flow

-- Create a temporary way to make the first user an admin
-- This function will automatically make the first user who signs up an admin
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If this is the first profile being created, make them admin
  IF (SELECT COUNT(*) FROM public.profiles) = 0 THEN
    NEW.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to make first user admin
DROP TRIGGER IF EXISTS make_first_user_admin_trigger ON public.profiles;
CREATE TRIGGER make_first_user_admin_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.make_first_user_admin();