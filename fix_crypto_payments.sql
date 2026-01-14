CREATE TABLE IF NOT EXISTS public.crypto_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT, -- Added for easier unchecked display
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  transaction_hash TEXT, -- Renamed from tx_hash to match error log implication, or just standardizing
  plan_id UUID REFERENCES public.plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Admin Policy
CREATE POLICY "Admin can view all crypto payments" ON public.crypto_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.is_admin = true
    )
  );

-- Insert dummy data for visualization
INSERT INTO public.crypto_payments (user_id, user_email, amount, currency, status, transaction_hash, created_at)
SELECT 
    id as user_id, 
    email as user_email,
    (random() * 100)::decimal(10,2) as amount, 
    'USDT' as currency, 
    'completed' as status,
    md5(random()::text) as transaction_hash,
    now() - (random() * interval '30 days') as created_at
FROM public.users
WHERE email IS NOT NULL
LIMIT 5;
