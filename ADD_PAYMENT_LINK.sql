-- focused-fix: Add payment_link column to plans table
-- This script is safe to run multiple times.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'payment_link') THEN
        ALTER TABLE public.plans ADD COLUMN payment_link TEXT;
    END IF;
END $$;

-- Refresh the schema cache (Supabase specific hint)
NOTIFY pgrst, 'reload schema';
