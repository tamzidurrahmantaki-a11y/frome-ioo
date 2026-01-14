-- Simply ensure your user is an admin
-- Replace 'YOUR_EMAIL' with your actual email address
UPDATE public.users 
SET is_admin = true 
WHERE email = 'YOUR_EMAIL';

-- Verify the change
SELECT id, email, is_admin FROM public.users WHERE email = 'YOUR_EMAIL';
