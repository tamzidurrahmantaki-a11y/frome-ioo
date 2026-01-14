-- Update password for a specific user ID
-- Replace 'NEW_PASSWORD_HERE' with your desired password
UPDATE auth.users
SET encrypted_password = crypt('NEW_PASSWORD_HERE', gen_salt('bf'))
WHERE id = 'a7130f57-2e83-4ff3-bad4-02adbb1d0184';

-- Force a logout for safety (optional)
-- DELETE FROM auth.sessions WHERE user_id = 'a7130f57-2e83-4ff3-bad4-02adbb1d0184';
