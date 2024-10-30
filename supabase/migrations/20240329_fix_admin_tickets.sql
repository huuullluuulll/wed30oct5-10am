-- Drop existing view if exists
DROP VIEW IF EXISTS public.admin_tickets_view;

-- Create admin tickets view
CREATE VIEW public.admin_tickets_view AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.category,
    t.created_at,
    t.updated_at,
    t.user_id,
    u.email as user_email,
    u.raw_user_meta_data->>'full_name' as user_full_name,
    (
        SELECT COUNT(*)::integer
        FROM public.support_messages m
        WHERE m.ticket_id = t.id
    ) as message_count
FROM public.support_tickets t
JOIN auth.users u ON t.user_id = u.id;

-- Grant access to authenticated users
GRANT SELECT ON public.admin_tickets_view TO authenticated;