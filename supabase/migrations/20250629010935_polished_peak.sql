/*
  # Create family members table

  1. New Tables
    - `family_members`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `name` (text)
      - `relationship` (text)
      - `email` (text)
      - `mobile_number` (text)
      - `iso_code` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `family_members` table
    - Add policy for users to manage their own family members
*/

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  email TEXT,
  mobile_number TEXT,
  iso_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own family members"
  ON family_members
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own family members"
  ON family_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own family members"
  ON family_members
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own family members"
  ON family_members
  FOR DELETE
  USING (auth.uid() = user_id);