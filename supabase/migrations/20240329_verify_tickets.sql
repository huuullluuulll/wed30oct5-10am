-- First verify the schema is correct
DROP VIEW IF EXISTS public.admin_tickets_view CASCADE;
DROP TABLE IF EXISTS public.support_messages CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;

-- Recreate tables
CREATE TABLE public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.support_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the admin view
CREATE VIEW public.admin_tickets_view AS
SELECT 
    t.*,
    u.email as user_email,
    u.raw_user_meta_data->>'full_name' as user_full_name,
    (
        SELECT COUNT(*)
        FROM public.support_messages m
        WHERE m.ticket_id = t.id
    ) as message_count
FROM public.support_tickets t
JOIN auth.users u ON t.user_id = u.id;

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can insert tickets"
ON public.support_tickets FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update tickets"
ON public.support_tickets FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Anyone can view messages"
ON public.support_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can insert messages"
ON public.support_messages FOR INSERT
TO authenticated
WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_messages TO authenticated;
GRANT SELECT ON public.admin_tickets_view TO authenticated;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON public.support_messages(ticket_id);