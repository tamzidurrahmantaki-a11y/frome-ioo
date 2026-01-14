-- Drop ALL existing policies on users to be safe and clear recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.users;

-- Create a strictly non-recursive policy for users to read their own data
-- This is critical for the client-side 'is_admin' check if we were to use it
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Create a policy for Service Role (implicitly has access, but good practice to allow full access if bypass RLS is off)
-- Note: Service Role bypasses RLS by default, so this isn't strictly necessary but doesn't hurt.

-- Verify the fix
SELECT * FROM public.users LIMIT 1;
