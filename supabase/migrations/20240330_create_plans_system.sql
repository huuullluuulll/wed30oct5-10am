-- Create service plans table
CREATE TABLE IF NOT EXISTS public.service_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create add-ons table
CREATE TABLE IF NOT EXISTS public.service_addons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.service_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user add-ons table
CREATE TABLE IF NOT EXISTS public.user_addons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    addon_id UUID REFERENCES public.service_addons(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.service_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active plans"
    ON public.service_plans FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Anyone can view active addons"
    ON public.service_addons FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Users can view their own subscriptions"
    ON public.user_subscriptions FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can view their own addons"
    ON public.user_addons FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Insert initial plans
INSERT INTO public.service_plans (name, name_en, price, billing_period, features) VALUES
('ستارتر', 'Starter', 220, 'yearly', '[
    "تأسيس شركة في المملكة المتحدة",
    "عنوان مسجل لمدة عام",
    "خدمة استلام البريد",
    "دعم عبر البريد الإلكتروني",
    "المستندات الأساسية"
]'),
('بروفيشنال', 'Professional', 420, 'yearly', '[
    "جميع مميزات باقة ستارتر",
    "خدمة محاسبة سنوية",
    "رقم هاتف بريطاني",
    "دعم عبر الواتساب",
    "خدمة مدير حساب مخصص",
    "استشارات قانونية شهرية"
]'),
('إنتربرايز', 'Enterprise', 820, 'yearly', '[
    "جميع مميزات باقة بروفيشنال",
    "خدمة محاسبة شهرية",
    "فتح حساب بنكي تجاري",
    "خدمات التأشيرات",
    "استشارات قانونية أسبوعية",
    "دعم على مدار الساعة"
]');

-- Insert initial add-ons
INSERT INTO public.service_addons (name, name_en, description, description_en, price, category) VALUES
('خدمة المحاسبة الشهرية', 'Monthly Accounting', 'خدمة محاسبية شهرية شاملة', 'Comprehensive monthly accounting service', 150, 'accounting'),
('رقم هاتف بريطاني', 'UK Phone Number', 'رقم هاتف بريطاني مع خدمة التحويل', 'UK phone number with forwarding service', 50, 'communication'),
('عنوان تجاري', 'Business Address', 'عنوان تجاري في لندن', 'Business address in London', 100, 'address'),
('خدمة مدير حساب', 'Account Manager', 'مدير حساب مخصص لشركتك', 'Dedicated account manager for your company', 200, 'support');