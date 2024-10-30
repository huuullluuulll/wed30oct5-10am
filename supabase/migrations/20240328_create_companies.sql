-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    registration_number TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own company"
ON public.companies FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own subscription"
ON public.company_subscriptions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_id
        AND companies.user_id = auth.uid()
    )
);

-- Create indexes
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
CREATE INDEX idx_company_subscriptions_company_id ON public.company_subscriptions(company_id);

-- Create function to get company status
CREATE OR REPLACE FUNCTION get_company_status(p_user_id UUID)
RETURNS TABLE (
    company_status TEXT,
    current_plan TEXT,
    renewal_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.status as company_status,
        cs.plan as current_plan,
        cs.renewal_date
    FROM public.companies c
    LEFT JOIN public.company_subscriptions cs ON cs.company_id = c.id
    WHERE c.user_id = p_user_id
    AND cs.status = 'active'
    ORDER BY cs.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;