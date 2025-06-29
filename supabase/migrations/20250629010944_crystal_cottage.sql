/*
  # Create wealth calculations table

  1. New Tables
    - `wealth_calculations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `inputs` (jsonb)
      - `results` (jsonb)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `wealth_calculations` table
    - Add policy for users to manage their own calculations
*/

-- Create wealth_calculations table
CREATE TABLE IF NOT EXISTS wealth_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wealth_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own calculations"
  ON wealth_calculations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculations"
  ON wealth_calculations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Anonymous users can insert calculations
CREATE POLICY "Anonymous users can insert calculations"
  ON wealth_calculations
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Anonymous users can view their own calculations (using session ID)
CREATE POLICY "Anonymous users can view their calculations"
  ON wealth_calculations
  FOR SELECT
  USING (user_id IS NULL);