-- Update the user role to admin for thiagomartinsv@gmail.com
UPDATE profiles 
SET role = 'admin' 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'thiagomartinsv@gmail.com'
);