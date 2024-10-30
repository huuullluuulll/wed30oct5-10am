-- Create content_sections table for managing different content areas
CREATE TABLE IF NOT EXISTS public.content_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_items table for actual content pieces
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID REFERENCES public.content_sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_en TEXT,
    description TEXT,
    description_en TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_plans table for managing subscription plans
CREATE TABLE IF NOT EXISTS public.service_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    billing_period TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create document_types table for managing available document types
CREATE TABLE IF NOT EXISTS public.document_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL,
    processing_time TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create uk_calendar_events table for managing UK calendar events
CREATE TABLE IF NOT EXISTS public.uk_calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uk_calendar_events ENABLE ROW LEVEL SECURITY;

-- Policies for content sections and items (public read, admin write)
CREATE POLICY "Public can view content sections"
ON public.content_sections FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Public can view content items"
ON public.content_items FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Public can view service plans"
ON public.service_plans FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Public can view document types"
ON public.document_types FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Public can view calendar events"
ON public.uk_calendar_events FOR SELECT
TO authenticated
USING (is_active = true);

-- Insert initial content sections
INSERT INTO public.content_sections (key, title, description) VALUES
('home_features', 'ميزات الصفحة الرئيسية', 'الميزات المعروضة في الصفحة الرئيسية'),
('pricing_plans', 'باقات الأسعار', 'خطط وباقات الاشتراك المتاحة'),
('document_types', 'أنواع المستندات', 'أنواع المستندات المتاحة للطلب'),
('uk_calendar', 'التقويم البريطاني', 'المناسبات والعطل في المملكة المتحدة');

-- Insert initial service plans
INSERT INTO public.service_plans (name, name_en, price, billing_period, features) VALUES
('ستارتر', 'Starter', 220, 'yearly', '["تأسيس شركة في المملكة المتحدة", "عنوان مسجل لمدة عام", "خدمة استلام البريد", "دعم عبر البريد الإلكتروني", "المستندات الأساسية"]'::jsonb),
('بروفيشنال', 'Professional', 420, 'yearly', '["جميع مميزات باقة ستارتر", "خدمة محاسبة سنوية", "رقم هاتف بريطاني", "دعم عبر الواتساب", "خدمة مدير حساب مخصص", "استشارات قانونية شهرية"]'::jsonb),
('إنتربرايز', 'Enterprise', 820, 'yearly', '["جميع مميزات باقة بروفيشنال", "خدمة محاسبة شهرية", "فتح حساب بنكي تجاري", "خدمات التأشيرات", "استشارات قانونية أسبوعية", "دعم على مدار الساعة"]'::jsonb);

-- Insert initial document types
INSERT INTO public.document_types (name, name_en, description, description_en, price, processing_time) VALUES
('رمز المصادقة', 'Authentication Code', 'الحصول على رمز المصادقة الرسمي للشركة', 'Get official company authentication code', 79, '2-3 أيام عمل'),
('خطاب UTR', 'UTR Letter', 'إصدار خطاب الرقم المرجعي الضريبي الفريد', 'Issue Unique Tax Reference letter', 99, '3-4 أيام عمل'),
('شهادة التأسيس', 'Certificate of Incorporation', 'إصدار شهادة تأسيس الشركة الرسمية', 'Issue official company incorporation certificate', 149, '4-5 أيام عمل'),
('عقد التأسيس', 'Memorandum of Association', 'إعداد وثيقة عقد التأسيس القانونية', 'Prepare legal memorandum of association', 199, '5-7 أيام عمل');

-- Insert initial calendar events
INSERT INTO public.uk_calendar_events (title, title_en, date, type, description) VALUES
('رأس السنة الميلادية', 'New Year''s Day', '2024-01-01', 'bank', 'عطلة رأس السنة الميلادية'),
('الجمعة العظيمة', 'Good Friday', '2024-03-29', 'bank', 'عطلة الجمعة العظيمة'),
('عيد الفصح', 'Easter Monday', '2024-04-01', 'bank', 'عطلة عيد الفصح'),
('عطلة مايو المصرفية', 'Early May Bank Holiday', '2024-05-06', 'bank', 'عطلة بنكية في مايو'),
('عطلة الربيع', 'Spring Bank Holiday', '2024-05-27', 'bank', 'عطلة الربيع البنكية'),
('عطلة الصيف', 'Summer Bank Holiday', '2024-08-26', 'bank', 'عطلة الصيف البنكية'),
('عيد الميلاد', 'Christmas Day', '2024-12-25', 'bank', 'عطلة عيد الميلاد'),
('عيد الملاكمة', 'Boxing Day', '2024-12-26', 'bank', 'عطلة يوم الملاكمة');

-- Create indexes for better performance
CREATE INDEX idx_content_items_section_id ON public.content_items(section_id);
CREATE INDEX idx_content_items_order_index ON public.content_items(order_index);
CREATE INDEX idx_service_plans_is_active ON public.service_plans(is_active);
CREATE INDEX idx_document_types_is_active ON public.document_types(is_active);
CREATE INDEX idx_calendar_events_date ON public.uk_calendar_events(date);