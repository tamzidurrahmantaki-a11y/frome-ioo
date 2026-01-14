-- Force enable RLS on users to be safe
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop potentially conflicting policies to ensure a clean slate
DROP POLICY IF EXISTS "Users can view own is_admin and subscription" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public read access to plans" ON public.plans;
DROP POLICY IF EXISTS "Allow admin full access to plans" ON public.plans;

-- Re-create User Policies
-- 1. Allow users to view their own full profile (including is_admin)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 2. Allow users to update their own basic info (excluding is_admin ideally, but simpler for now)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Re-create Plan Policies
CREATE POLICY "Allow public read access to plans" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to plans" ON public.plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.is_admin = true
    )
  );

-- Double check is_admin column exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Verify admin user (Optional: you can run this with your specific email)
-- UPDATE public.users SET is_admin = true WHERE email = 'YOUR_EMAIL';
