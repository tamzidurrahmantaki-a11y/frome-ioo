-- 1. Drop ALL policies on the users table aggressively
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname); 
    END LOOP; 
END $$;

-- 2. Create the non-recursive policy
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- 3. Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Verify admin status for orvdin@gmail.com (Just to be sure)
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'orvdin@gmail.com';
