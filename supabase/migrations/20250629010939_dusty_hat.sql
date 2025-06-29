/*
  # Create bills table

  1. New Tables
    - `bills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `family_member_id` (uuid, references family_members.id)
      - `type` (text)
      - `provider` (text)
      - `amount` (numeric)
      - `due_date` (date)
      - `account_number` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `bills` table
    - Add policy for users to manage their own bills
*/

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  family_member_id UUID REFERENCES family_members(id),
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  account_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bills"
  ON bills
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bills"
  ON bills
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bills"
  ON bills
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bills"
  ON bills
  FOR DELETE
  USING (auth.uid() = user_id);