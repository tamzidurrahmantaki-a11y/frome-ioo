-- ADMIN SEPARATION SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create admin_credentials table
CREATE TABLE IF NOT EXISTS public.admin_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Plain text as requested for manual control
    role TEXT DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert Default Admin
INSERT INTO public.admin_credentials (email, password, role)
VALUES ('orvdin@gmail.com', 'admin12345', 'super_admin')
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password; -- Ensure password is reset if exists

-- 3. Enable RLS (but we use Service Role in code, so irrelevant for now, but good practice)
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- 4. Create Plans Table
-- DROP to ensure schema matches exactly what we need (User reported column mismatch)
DROP TABLE IF EXISTS public.plans CASCADE;

CREATE TABLE public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_yearly DECIMAL(10, 2) NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Plans if empty
INSERT INTO public.plans (name, price_monthly, price_yearly, features, is_popular)
SELECT 'Starter', 0, 0, ARRAY['Basic Features', '1 User'], false
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Starter');

INSERT INTO public.plans (name, price_monthly, price_yearly, features, is_popular)
SELECT 'Pro', 15, 150, ARRAY['Advanced Features', '5 Users', 'Priority Support'], true
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Pro');

INSERT INTO public.plans (name, price_monthly, price_yearly, features, is_popular)
SELECT 'Enterprise', 99, 990, ARRAY['All Features', 'Unlimited Users', 'Dedicated Support'], false
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Enterprise');
