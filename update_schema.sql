-- 1. Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  payment_link TEXT,
  stripe_price_id TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add Columns to Users Table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 3. Enable RLS on Plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Plans
-- Allow everyone to read plans (for pricing page)
CREATE POLICY "Allow public read access to plans" ON public.plans
  FOR SELECT USING (true);

-- Allow admins to insert/update/delete plans
-- Note: This relies on the user having is_admin = true
CREATE POLICY "Allow admin full access to plans" ON public.plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.is_admin = true
    )
  );

-- 5. Update Users Policies to allow reading is_admin (optional, if not already covered)
-- Users can view their own profile
CREATE POLICY "Users can view own is_admin and subscription" ON public.users
  FOR SELECT USING (auth.uid() = id);
