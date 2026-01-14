-- SUPPORT & FAQs SCHEMA
-- DROP to ensure clean slate if needed
DROP TABLE IF EXISTS public.faqs CASCADE;

CREATE TABLE public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS just in case meant for Supabase Auth, but we use Admin Client
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow Public Read
create policy "Public can view active faqs"
on "public"."faqs"
as PERMISSIVE
for SELECT
to public
using (
  (is_active = true)
);

-- SECURE PLANS TABLE
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Allow Public Read for Plans
create policy "Public can view plans"
on "public"."plans"
as PERMISSIVE
for SELECT
to public
using (true);
