-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for support tickets
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
CREATE POLICY "Admins can view all tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (
  is_admin(auth.uid()) OR user_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins can update any ticket" ON public.support_tickets;
CREATE POLICY "Admins can update any ticket"
ON public.support_tickets FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()) OR user_id = auth.uid());

-- Policies for support messages
DROP POLICY IF EXISTS "Admins can view all messages" ON public.support_messages;
CREATE POLICY "Admins can view all messages"
ON public.support_messages FOR SELECT
TO authenticated
USING (
  is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE support_tickets.id = ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can create messages" ON public.support_messages;
CREATE POLICY "Admins can create messages"
ON public.support_messages FOR INSERT
TO authenticated
WITH CHECK (
  is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE support_tickets.id = ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

-- Policies for users table
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
TO authenticated
USING (is_admin(auth.uid()) OR id = auth.uid());

DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users"
ON public.users FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()) OR id = auth.uid());

-- Policies for documents
DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;
CREATE POLICY "Admins can view all documents"
ON public.documents FOR SELECT
TO authenticated
USING (is_admin(auth.uid()) OR user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can create documents" ON public.documents;
CREATE POLICY "Admins can create documents"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()) OR user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update documents" ON public.documents;
CREATE POLICY "Admins can update documents"
ON public.documents FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()) OR user_id = auth.uid());

-- Policies for companies
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
CREATE POLICY "Admins can view all companies"
ON public.companies FOR SELECT
TO authenticated
USING (is_admin(auth.uid()) OR user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update companies" ON public.companies;
CREATE POLICY "Admins can update companies"
ON public.companies FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()) OR user_id = auth.uid());

-- Create admin stats function
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_tickets BIGINT,
  total_documents BIGINT,
  total_companies BIGINT,
  pending_tickets BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.support_tickets) as total_tickets,
    (SELECT COUNT(*) FROM public.documents) as total_documents,
    (SELECT COUNT(*) FROM public.companies) as total_companies,
    (SELECT COUNT(*) FROM public.support_tickets WHERE status = 'pending') as pending_tickets;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;