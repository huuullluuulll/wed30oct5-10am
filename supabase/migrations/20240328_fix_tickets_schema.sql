-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.ticket_messages CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;

-- Create tickets table
CREATE TABLE public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ticket_messages table with proper foreign key
CREATE TABLE public.ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Policies for tickets
CREATE POLICY "Users can view their own tickets"
ON public.tickets FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
ON public.tickets FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policies for messages
CREATE POLICY "Users can view messages for their tickets"
ON public.ticket_messages FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tickets
        WHERE tickets.id = ticket_id
        AND tickets.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create messages for their tickets"
ON public.ticket_messages FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tickets
        WHERE tickets.id = ticket_id
        AND tickets.user_id = auth.uid()
    )
);

-- Indexes
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);