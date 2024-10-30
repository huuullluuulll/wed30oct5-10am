-- Reset policies
DROP POLICY IF EXISTS "Only admins can insert documents" ON documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy for admins to insert documents
CREATE POLICY "Only admins can insert documents"
ON documents
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM auth.users
    WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy for users to view their own documents
CREATE POLICY "Users can view their own documents"
ON documents
FOR SELECT
TO public
USING (
  auth.uid() = user_id
);

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid NOT NULL PRIMARY KEY,
  email text,
  raw_user_meta_data jsonb DEFAULT '{}'::jsonb
);