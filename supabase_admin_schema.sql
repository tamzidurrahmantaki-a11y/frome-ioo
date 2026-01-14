-- ADMIN DASHBOARD SCHEMA MIGRATION
-- Run this in your Supabase SQL Editor after the main schema

-- 1. ADD ROLE COLUMN TO USERS TABLE
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. CREATE SUPPORT CARDS TABLE (Help Center)
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

ALTER TABLE public.support_cards ENABLE ROW LEVEL SECURITY;

-- Allow public read access for support cards
CREATE POLICY "Anyone can view active support cards" ON public.support_cards
  FOR SELECT USING (is_active = true);

-- Admin-only write access
CREATE POLICY "Admins can manage support cards" ON public.support_cards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 3. CREATE FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active FAQs
CREATE POLICY "Anyone can view active faqs" ON public.faqs
  FOR SELECT USING (is_active = true);

-- Admin-only write access
CREATE POLICY "Admins can manage faqs" ON public.faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 4. CREATE SUPPORT CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.support_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_type TEXT NOT NULL UNIQUE CHECK (contact_type IN ('email', 'whatsapp', 'discord', 'telegram', 'live_chat', 'documentation')),
  contact_value TEXT NOT NULL,
  label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active contacts
CREATE POLICY "Anyone can view active contacts" ON public.support_contacts
  FOR SELECT USING (is_active = true);

-- Admin-only write access
CREATE POLICY "Admins can manage contacts" ON public.support_contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 5. CREATE SUPPORT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.support_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.support_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for settings
CREATE POLICY "Anyone can view support settings" ON public.support_settings
  FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admins can manage settings" ON public.support_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 6. CREATE CRYPTO PAYMENTS TABLE
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

ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments" ON public.crypto_payments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own payments
CREATE POLICY "Users can insert their own payments" ON public.crypto_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.crypto_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can update payments
CREATE POLICY "Admins can update payments" ON public.crypto_payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 7. INSERT DEFAULT SUPPORT CARDS
INSERT INTO public.support_cards (title, description, icon_name, order_index) VALUES
  ('How To Create A Tracking Link', 'Learn How To Generate Your Unique Tracking Link In Seconds And Start Monitoring Traffic Instantly.', 'Link', 0),
  ('How To Analyze Traffic Data', 'Understand Key Metrics Like Clicks, Referrers, And Locations To Make Smarter Decisions Based On Your Link Performance.', 'BarChart', 1),
  ('Link Expiration Or Deletion', 'Set An Expiration Date Or Delete Links Anytime To Stay In Full Control Of Your Shared URLs.', 'Trash', 2),
  ('UTM Parameters Explained', 'Discover How To Use UTM Tags To Track Campaigns Across Platforms And Gain Deeper Marketing Insights.', 'Tag', 3)
ON CONFLICT DO NOTHING;

-- 8. INSERT DEFAULT FAQS
INSERT INTO public.faqs (question, answer, order_index) VALUES
  ('How Accurate Is The Traffic Data?', 'Our tracking system uses advanced fingerprinting and server-side analysis to ensure 99.9% accuracy, filtering out bots and crawlers.', 0),
  ('What Kind Of Devices/Browsers Are Supported?', 'We support tracking across all modern browsers (Chrome, Safari, Firefox, Edge) and devices including Desktop, Mobile, and Tablets.', 1),
  ('Can I Track Traffic From Social Media?', 'Yes! Frome.io works perfectly on Instagram, Twitter, TikTok, and LinkedIn bios or posts.', 2),
  ('Is There A Link Limit In The Free Plan?', 'The Free plan allows up to 50 active links. You can upgrade to Pro for unlimited link generation.', 3),
  ('Can I Integrate This With Google Analytics?', 'Currently, we offer standalone analytics, but UTM parameter support allows you to feed data into GA4 seamlessly.', 4)
ON CONFLICT DO NOTHING;

-- 9. INSERT DEFAULT SUPPORT CONTACTS
INSERT INTO public.support_contacts (contact_type, contact_value, label) VALUES
  ('email', 'support@frome.io', 'Email Support'),
  ('live_chat', '#', 'Live Chat'),
  ('documentation', '#', 'Documentation')
ON CONFLICT DO NOTHING;

-- 10. INSERT DEFAULT SUPPORT SETTINGS
INSERT INTO public.support_settings (setting_key, setting_value) VALUES
  ('rules_text', 'Please read our terms of service and privacy policy before using our support services. All support requests are handled within 24-48 hours.')
ON CONFLICT DO NOTHING;

-- 11. CREATE FUNCTION TO GET TOTAL USERS
CREATE OR REPLACE FUNCTION get_total_users()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM public.users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. CREATE FUNCTION TO GET TOTAL LINKS
CREATE OR REPLACE FUNCTION get_total_links()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM public.links);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. CREATE FUNCTION TO GET TOTAL CRYPTO SUBSCRIPTIONS
CREATE OR REPLACE FUNCTION get_total_crypto_subscriptions()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM public.crypto_payments WHERE status = 'verified');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. ADD UPDATED_AT TRIGGERS
CREATE TRIGGER update_support_cards_updated_at BEFORE UPDATE ON public.support_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_contacts_updated_at BEFORE UPDATE ON public.support_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_settings_updated_at BEFORE UPDATE ON public.support_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
