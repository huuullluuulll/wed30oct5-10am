-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can update any ticket" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.support_messages;
DROP POLICY IF EXISTS "Admins can create messages" ON public.support_messages;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(raw_user_meta_data->>'role', '') = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tickets policies
CREATE POLICY "Admins can view all tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (is_admin() OR user_id = auth.uid());

CREATE POLICY "Admins can update any ticket"
ON public.support_tickets FOR UPDATE
TO authenticated
USING (is_admin() OR user_id = auth.uid());

-- Messages policies
CREATE POLICY "Admins can view all messages"
ON public.support_messages FOR SELECT
TO authenticated
USING (is_admin() OR EXISTS (
  SELECT 1 FROM public.support_tickets
  WHERE support_tickets.id = ticket_id
  AND support_tickets.user_id = auth.uid()
));

CREATE POLICY "Admins can create messages"
ON public.support_messages FOR INSERT
TO authenticated
WITH CHECK (is_admin() OR EXISTS (
  SELECT 1 FROM public.support_tickets
  WHERE support_tickets.id = ticket_id
  AND support_tickets.user_id = auth.uid()
));

-- Users policies
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
TO authenticated
USING (is_admin() OR id = auth.uid());

CREATE POLICY "Admins can update users"
ON public.users FOR UPDATE
TO authenticated
USING (is_admin() OR id = auth.uid());

-- Documents policies
CREATE POLICY "Admins can manage documents"
ON public.documents FOR ALL
TO authenticated
USING (is_admin() OR user_id = auth.uid())
WITH CHECK (is_admin() OR user_id = auth.uid());

-- Create admin function to set user role
CREATE OR REPLACE FUNCTION public.set_user_role(user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can set user roles';
  END IF;
  
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('role', new_role)
      ELSE
        raw_user_meta_data || jsonb_build_object('role', new_role)
    END
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;