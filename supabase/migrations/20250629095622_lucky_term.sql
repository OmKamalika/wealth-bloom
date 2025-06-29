/*
  # Fix wealth_calculations RLS policies

  1. Security Updates
    - Update RLS policies to properly handle INSERT operations for both authenticated and anonymous users
    - Allow anonymous users to insert calculations without requiring session_id
    - Ensure authenticated users can insert their own calculations

  2. Changes
    - Drop existing INSERT policies that are too restrictive
    - Create new INSERT policies that handle both user scenarios properly
*/

-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Anonymous users can insert calculations with session_id" ON wealth_calculations;
DROP POLICY IF EXISTS "Users can insert their own calculations" ON wealth_calculations;

-- Create new INSERT policy for authenticated users
CREATE POLICY "Users can insert their own calculations"
  ON wealth_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create new INSERT policy for anonymous users
CREATE POLICY "Anonymous users can insert calculations"
  ON wealth_calculations
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND anonymous = true);

-- Create new INSERT policy for public role (covers both authenticated and anonymous)
CREATE POLICY "Public can insert calculations"
  ON wealth_calculations
  FOR INSERT
  TO public
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND anonymous = true)
  );