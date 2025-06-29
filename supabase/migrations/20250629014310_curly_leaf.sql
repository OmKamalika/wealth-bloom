/*
  # Add session_id to wealth_calculations table

  1. New Columns
    - `session_id` (uuid) to track anonymous sessions
    - `anonymous` (boolean) to flag anonymous calculations

  2. Security
    - Update RLS policies for anonymous users to use session_id
*/

-- Add session_id column to wealth_calculations table
ALTER TABLE wealth_calculations 
ADD COLUMN session_id UUID;

-- Add anonymous flag column
ALTER TABLE wealth_calculations
ADD COLUMN anonymous BOOLEAN DEFAULT FALSE;

-- Create index on session_id for better query performance
CREATE INDEX idx_wealth_calculations_session_id ON wealth_calculations(session_id);

-- Drop the overly broad anonymous policy
DROP POLICY IF EXISTS "Anonymous users can view their calculations" ON wealth_calculations;

-- Create a more secure policy for anonymous users to view only their own calculations
CREATE POLICY "Anonymous users can view their own calculations by session_id"
  ON wealth_calculations
  FOR SELECT
  USING (
    user_id IS NULL AND 
    session_id::text = current_setting('request.headers')::json->>'x-session-id'
  );

-- Update anonymous insert policy to include session_id
DROP POLICY IF EXISTS "Anonymous users can insert calculations" ON wealth_calculations;

CREATE POLICY "Anonymous users can insert calculations with session_id"
  ON wealth_calculations
  FOR INSERT
  WITH CHECK (
    user_id IS NULL AND 
    session_id IS NOT NULL AND
    anonymous = TRUE
  );