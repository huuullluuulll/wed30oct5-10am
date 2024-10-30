-- Update ticket_messages table permissions
ALTER TABLE public.ticket_messages ALTER COLUMN sender_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create messages for their tickets" ON public.ticket_messages;
DROP POLICY IF EXISTS "Users can view messages for their tickets" ON public.ticket_messages;

-- Create updated policies
CREATE POLICY "Users can view messages for their tickets"
ON public.ticket_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tickets
    WHERE tickets.id = ticket_id
    AND (tickets.user_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
    ))
  )
);

CREATE POLICY "Users can create messages for their tickets"
ON public.ticket_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tickets
    WHERE tickets.id = ticket_id
    AND tickets.user_id = auth.uid()
  )
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);