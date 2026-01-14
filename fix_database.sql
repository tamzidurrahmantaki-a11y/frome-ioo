-- COMPLETE DATABASE SETUP & FIX SCRIPT
-- Run this ENTIRE script in your Supabase SQL Editor to fix all "relation does not exist" errors.

-- 1. SETUP EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE USERS TABLE (If not exists)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')), -- Added role column directly here
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BACKFILL USERS (Crucial Fix)
-- This ensures that if you already signed up, your profile exists in the public table
INSERT INTO public.users (id, email, created_at)
SELECT id, email, created_at FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. CREATE LINKS TABLE
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  original_url TEXT NOT NULL,
  short_slug TEXT UNIQUE NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE CLICKS TABLE
CREATE TABLE IF NOT EXISTS public.clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ADMIN TABLES (Support & Payments)

CREATE TABLE IF NOT EXISTS public.support_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT DEFAULT 'HelpCircle',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.support_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_type TEXT NOT NULL UNIQUE CHECK (contact_type IN ('email', 'whatsapp', 'discord', 'telegram', 'live_chat', 'documentation')),
  contact_value TEXT NOT NULL,
  label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.support_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.crypto_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  transaction_hash TEXT UNIQUE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('Pro', 'Enterprise')),
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USDT',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 7. ENABLE RLS (Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- 8. CREATE POLICIES (Simplified for setup)

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Links policies
CREATE POLICY "Users can view own links" ON public.links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own links" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links" ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links" ON public.links FOR DELETE USING (auth.uid() = user_id);

-- Admin policies (The Magic)
CREATE POLICY "Admins have full access" ON public.users FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Public read support" ON public.support_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write support" ON public.support_cards FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write faqs" ON public.faqs FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 9. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION get_total_users() RETURNS INTEGER AS $$
BEGIN RETURN (SELECT COUNT(*)::INTEGER FROM public.users); END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_total_links() RETURNS INTEGER AS $$
BEGIN RETURN (SELECT COUNT(*)::INTEGER FROM public.links); END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. SEED DATA
INSERT INTO public.support_cards (title, description, icon_name) VALUES
('How To Create A Tracking Link', 'Learn How To Generate Your Unique Tracking Link.', 'Link'),
('How To Analyze Traffic Data', 'Understand Key Metrics Like Clicks and Referrers.', 'BarChart')
ON CONFLICT DO NOTHING;

INSERT INTO public.support_contacts (contact_type, contact_value, label) VALUES
('email', 'support@frome.io', 'Email Support')
ON CONFLICT DO NOTHING;

-- 12. PROMOTE YOUR USER TO ADMIN (The Fix)
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'strtakey123@gmail.com';
