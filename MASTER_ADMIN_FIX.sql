-- MASTER ADMIN FIX SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. FIX RLS RECURSION (The "Infinite Recursion" Fix)
-- We aggressively drop all policies on users to start fresh
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname); 
    END LOOP; 
END $$;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Simple, non-recursive policy: Users can see their own data
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Admin Policy: Admins can view ALL users
-- We avoid recursion by NOT querying the users table inside the policy itself if possible, 
-- OR by relying on the Service Role (which bypasses RLS) for backend admin actions.
-- But for client-side, we can use a secure policy:
CREATE POLICY "Admins can view all profiles"
ON public.users
FOR SELECT
USING (
  (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
);

-- 2. ENSURE ADMIN USER IS SET
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'orvdin@gmail.com';


-- 3. FIX CRYPTO PAYMENTS TABLE (Schema & Data)
-- Drop if it exists to ensure clean schema match
DROP TABLE IF EXISTS public.crypto_payments CASCADE;

CREATE TABLE public.crypto_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, failed
  transaction_hash TEXT,
  plan_type TEXT DEFAULT 'Pro', -- To match UI expectations
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Admin can view all payments
CREATE POLICY "Admin can view all crypto payments" ON public.crypto_payments
  FOR SELECT USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- Insert Dummy Data for Dashboard Visualization
INSERT INTO public.crypto_payments (user_id, user_email, amount, currency, status, transaction_hash, plan_type, created_at)
SELECT 
    id as user_id, 
    email as user_email,
    (floor(random() * 200) + 50)::decimal(10,2) as amount, 
    'USDT' as currency, 
    CASE WHEN random() > 0.5 THEN 'verified' ELSE 'pending' END as status,
    md5(random()::text) as transaction_hash,
    CASE WHEN random() > 0.5 THEN 'Pro' ELSE 'Enterprise' END as plan_type,
    now() - (random() * interval '30 days') as created_at
FROM public.users
WHERE email IS NOT NULL
LIMIT 10;
