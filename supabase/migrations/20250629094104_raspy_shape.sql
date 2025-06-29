/*
  # Create tables for tiered calculation architecture

  1. New Tables
    - `calculation_jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `status` (text)
      - `progress` (integer)
      - `current_step` (text)
      - `estimated_time_remaining` (integer)
      - `inputs` (jsonb)
      - `priority` (text)
      - `notification_preferences` (jsonb)
      - `created_at` (timestamptz)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `error_message` (text)
    - `calculation_results`
      - `id` (uuid, primary key)
      - `job_id` (uuid, references calculation_jobs.id)
      - `user_id` (uuid, references profiles.id)
      - `calculation_type` (text)
      - `results` (jsonb)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `access_count` (integer)
      - `last_accessed` (timestamptz)
  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own calculations
*/

-- Create calculation_jobs table
CREATE TABLE IF NOT EXISTS calculation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0,
  current_step TEXT,
  estimated_time_remaining INTEGER,
  inputs JSONB NOT NULL,
  priority TEXT DEFAULT 'standard' CHECK (priority IN ('standard', 'priority', 'urgent')),
  notification_preferences JSONB DEFAULT '{"email": true, "push": false, "inApp": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Create calculation_results table
CREATE TABLE IF NOT EXISTS calculation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES calculation_jobs(id),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  calculation_type TEXT NOT NULL CHECK (calculation_type IN ('basic', 'comprehensive')),
  results JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_calculation_jobs_user_id ON calculation_jobs(user_id);
CREATE INDEX idx_calculation_jobs_status ON calculation_jobs(status);
CREATE INDEX idx_calculation_jobs_created_at ON calculation_jobs(created_at);

CREATE INDEX idx_calculation_results_user_id ON calculation_results(user_id);
CREATE INDEX idx_calculation_results_job_id ON calculation_results(job_id);
CREATE INDEX idx_calculation_results_expires_at ON calculation_results(expires_at);

-- Enable Row Level Security
ALTER TABLE calculation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_results ENABLE ROW LEVEL SECURITY;

-- Create policies for calculation_jobs
CREATE POLICY "Users can view their own calculation jobs"
  ON calculation_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculation jobs"
  ON calculation_jobs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculation jobs"
  ON calculation_jobs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for calculation_results
CREATE POLICY "Users can view their own calculation results"
  ON calculation_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculation results"
  ON calculation_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add calculation_type column to wealth_calculations table
ALTER TABLE wealth_calculations 
ADD COLUMN IF NOT EXISTS calculation_type TEXT DEFAULT 'basic';