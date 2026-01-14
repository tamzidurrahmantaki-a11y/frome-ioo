-- 1. Create site_settings table (Unified Global Config)
DROP TABLE IF EXISTS public.site_settings CASCADE;

CREATE TABLE public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE, -- e.g., 'site_name', 'primary_color', 'logo_url'
    value TEXT NOT NULL,
    label TEXT, -- Helper text for Admin UI
    group_name TEXT DEFAULT 'general', -- 'general', 'visual', 'security', 'automation'
    type TEXT DEFAULT 'text', -- 'text', 'color', 'url', 'password'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Public Read (for Theme/Branding to work on Landing Page)
CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT TO public USING (true);

-- Admin Full Access (handled by Service Role in code, but good to have)
-- We rely on createAdminClient bypassing RLS, but standard Admin user policy:
-- (Assuming we had an authenticated admin user in supabase auth, which we don't, we use custom auth)
-- So RLS is strictly Public Read, and Server-Side Write.


-- 4. Seed Default Data (Luxury Minimal Defaults)
INSERT INTO public.site_settings (key, value, label, group_name, type)
VALUES 
    -- General
    ('site_name', 'Frome.io', 'Site Name', 'general', 'text'),
    ('support_email', 'support@frome.io', 'Support Email', 'general', 'text'),
    ('logo_url', '', 'Logo URL', 'general', 'url'),
    
    -- Visuals
    ('primary_color', '#00C975', 'Primary Accent Color', 'visual', 'color'),
    ('font_family', 'Inter', 'Font Family', 'visual', 'text'),
    
    -- Security (Placeholder for UI, actual creds in admin_credentials)
    ('admin_email_display', 'admin@frome.io', 'Admin Email', 'security', 'text'),
    
    -- Automation
    ('sellix_webhook_secret', '', 'Sellix Webhook Secret', 'automation', 'password')
ON CONFLICT (key) DO NOTHING;

-- 5. Migrate old data if exists (support_settings)
-- If you had valuable data there, we could move it, but starting fresh is cleaner for this restructure.
-- public.support_settings can be dropped later.

-- 6. Verify admin_credentials exists (Created in Task 1)
-- schema: id, email, password_hash (or plain as requested), created_at
-- We will use this table for the actual Login check.

-- Refresh Schema
NOTIFY pgrst, 'reload schema';
