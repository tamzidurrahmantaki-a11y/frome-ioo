-- 1. Create support_contacts table if not exists
DROP TABLE IF EXISTS public.support_contacts CASCADE;

CREATE TABLE public.support_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_type TEXT NOT NULL UNIQUE, -- 'email', 'discord', 'twitter'
    contact_value TEXT NOT NULL,
    label TEXT,
    icon_name TEXT, -- 'Mail', 'MessageSquare', 'Twitter'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create support_cards table
DROP TABLE IF EXISTS public.support_cards CASCADE;

CREATE TABLE public.support_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT, -- 'HelpCircle', 'MessageCircle' etc
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create support_settings table
DROP TABLE IF EXISTS public.support_settings CASCADE;

CREATE TABLE public.support_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create crypto_payments table if not exists
CREATE TABLE IF NOT EXISTS public.crypto_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Can be null for guest payments? Or linked to users
    user_email TEXT,
    transaction_hash TEXT NOT NULL,
    amount DECIMAL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Allow Public Read
CREATE POLICY "Public can view support contacts"
ON public.support_contacts FOR SELECT TO public USING (true);

CREATE POLICY "Public can view support cards"
ON public.support_cards FOR SELECT TO public USING (true);

CREATE POLICY "Public can view support settings"
ON public.support_settings FOR SELECT TO public USING (true);

-- Allow Public Read for Crypto Payments (or restrict, but Admin Client bypasses anyway)
CREATE POLICY "Public can view crypto payments"
ON public.crypto_payments FOR SELECT TO public USING (true);


-- Insert Default Contacts
INSERT INTO public.support_contacts (contact_type, contact_value, label, icon_name)
VALUES 
    ('email', 'support@frome.io', 'Email Support', 'Mail'),
    ('discord', 'https://discord.gg/frome', 'Join Community', 'MessageSquare'),
    ('twitter', 'https://twitter.com/frome_io', 'Follow Updates', 'Twitter')
ON CONFLICT (contact_type) DO NOTHING;

-- Insert Default Support Cards
INSERT INTO public.support_cards (title, description, icon_name, order_index)
VALUES 
    ('Documentation', 'Read the docs to master the platform.', 'BookOpen', 0),
    ('Live Chat', 'Chat with our support team.', 'MessageCircle', 1),
    ('Email Support', 'Get help via email within 24 hours.', 'Mail', 2);

-- Insert Default Settings
INSERT INTO public.support_settings (setting_key, setting_value)
VALUES 
    ('support_email', 'support@frome.io'),
    ('documentation_url', 'https://docs.frome.io'),
    ('community_url', 'https://discord.gg/frome')
ON CONFLICT (setting_key) DO NOTHING;


-- 6. Verify Plans Table RLS and Ensure `payment_link` column
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view plans" ON public.plans;
CREATE POLICY "Public can view plans" ON public.plans FOR SELECT TO public USING (true);

-- Add payment_link column if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'payment_link') THEN
        ALTER TABLE public.plans ADD COLUMN payment_link TEXT;
    END IF;
END $$;


-- 7. AUTOMATIC USER CREATION TRIGGER (Free Plan Default)
-- This ensures that when a new user signs up in Supabase Auth, they get a public.users row with 'Free' plan.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, subscription_plan, country)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name', -- Grab from metadata if available
    'Free',
    COALESCE(new.raw_user_meta_data->>'country', 'Unknown')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
