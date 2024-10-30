-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.company_subscriptions;
DROP TABLE IF EXISTS public.companies;

-- Create companies table with more detailed fields
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    registration_number TEXT,
    company_type TEXT NOT NULL CHECK (company_type IN ('private_limited', 'public_limited', 'sole_trader', 'partnership', 'llp')),
    registered_address TEXT NOT NULL,
    correspondence_address TEXT,
    incorporation_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'dissolved')),
    vat_number TEXT,
    utr_number TEXT,
    auth_code TEXT,
    directors JSONB DEFAULT '[]'::jsonb,
    shareholders JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create company_subscriptions table
CREATE TABLE IF NOT EXISTS public.company_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('starter', 'professional', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    start_date TIMESTAMPTZ NOT NULL,
    renewal_date TIMESTAMPTZ NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    payment_frequency TEXT NOT NULL DEFAULT 'yearly' CHECK (payment_frequency IN ('monthly', 'yearly')),
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create company_addresses table for address history
CREATE TABLE IF NOT EXISTS public.company_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    address_type TEXT NOT NULL CHECK (address_type IN ('registered', 'correspondence', 'business')),
    address TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create company_contacts table
CREATE TABLE IF NOT EXISTS public.company_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('primary', 'billing', 'technical', 'legal')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_addresses ENABLE ROW LEVEL_SECURITY;
ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own companies"
ON public.companies FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can update their own companies"
ON public.companies FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can view their own subscriptions"
ON public.company_subscriptions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_id
        AND (companies.user_id = auth.uid() OR is_admin())
    )
);

CREATE POLICY "Users can view their company addresses"
ON public.company_addresses FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_id
        AND (companies.user_id = auth.uid() OR is_admin())
    )
);

CREATE POLICY "Users can view their company contacts"
ON public.company_contacts FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_id
        AND (companies.user_id = auth.uid() OR is_admin())
    )
);

-- Create indexes
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
CREATE INDEX idx_companies_status ON public.companies(status);
CREATE INDEX idx_company_subscriptions_company_id ON public.company_subscriptions(company_id);
CREATE INDEX idx_company_addresses_company_id ON public.company_addresses(company_id);
CREATE INDEX idx_company_contacts_company_id ON public.company_contacts(company_id);

-- Insert some dummy data
INSERT INTO public.companies (
    user_id,
    name_ar,
    name_en,
    registration_number,
    company_type,
    registered_address,
    incorporation_date,
    status,
    vat_number,
    utr_number,
    auth_code,
    directors,
    shareholders
) VALUES (
    '3373f0fd-d146-491d-94f7-3ea4467a5e13',
    'مجموعة حلول المحدودة',
    'Hulul Group Ltd',
    'UK12345678',
    'private_limited',
    '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
    '2024-01-15',
    'active',
    'GB123456789',
    '1234567890',
    'ABC123',
    '[{"name": "محمد أحمد", "role": "director", "appointed_date": "2024-01-15"}]',
    '[{"name": "محمد أحمد", "shares": 100, "share_type": "ordinary", "issue_date": "2024-01-15"}]'
);

-- Get the company ID for the subscription
DO $$
DECLARE
    company_id UUID;
BEGIN
    SELECT id INTO company_id FROM public.companies WHERE registration_number = 'UK12345678';
    
    INSERT INTO public.company_subscriptions (
        company_id,
        plan,
        status,
        start_date,
        renewal_date,
        price,
        payment_frequency
    ) VALUES (
        company_id,
        'starter',
        'active',
        '2024-01-15',
        '2025-01-15',
        220.00,
        'yearly'
    );

    INSERT INTO public.company_addresses (
        company_id,
        address_type,
        address,
        start_date
    ) VALUES (
        company_id,
        'registered',
        '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
        '2024-01-15'
    );

    INSERT INTO public.company_contacts (
        company_id,
        contact_type,
        name,
        email,
        phone
    ) VALUES (
        company_id,
        'primary',
        'محمد أحمد',
        'contact@hululgroup.com',
        '+44 20 1234 5678'
    );
END $$;