-- Create admin user account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  raw_app_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'support@sleepylittleone.com',
  crypt('Sleepyblog123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Support"}',
  false,
  '{}'
);

-- Create admin profile (this will be handled by the trigger, but let's ensure it has admin role)
-- First, let's get the user_id we just created
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'support@sleepylittleone.com';
  
  -- Insert or update the profile to ensure admin role
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (new_user_id, 'Support', 'admin')
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'admin', display_name = 'Support';
END $$;