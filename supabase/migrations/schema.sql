-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Use these to reset if needed
DROP TABLE IF EXISTS monetary_donations CASCADE;
DROP TABLE IF EXISTS donation_history CASCADE;
DROP TABLE IF EXISTS donation_requests CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Core Tables

-- Profiles table (Main user information)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  blood_group text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  division text NOT NULL,
  district text NOT NULL,
  last_donation date,
  is_available boolean DEFAULT true,
  medical_conditions text,
  total_donations integer DEFAULT 0,
  CONSTRAINT valid_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  CONSTRAINT valid_gender CHECK (gender IN ('male', 'female', 'other'))
);

-- Donation Requests table
CREATE TABLE IF NOT EXISTS public.donation_requests (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_by uuid REFERENCES auth.users(id),
    patient_name text NOT NULL,
    hospital text NOT NULL,
    blood_group text NOT NULL,
    required_units integer NOT NULL CHECK (required_units >= 1 AND required_units <= 10),
    required_date date NOT NULL,
    division text NOT NULL,
    district text NOT NULL,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    additional_info text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'expired', 'cancelled')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Donation History table
CREATE TABLE IF NOT EXISTS donation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  donor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  hospital text NOT NULL,
  donation_date date NOT NULL,
  blood_group text NOT NULL,
  units integer DEFAULT 1,
  status text DEFAULT 'completed',
  notes text,
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'completed', 'cancelled'))
);

-- Monetary Donations table
CREATE TABLE IF NOT EXISTS monetary_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  donor_name text NOT NULL,
  email text,
  phone text NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL,
  transaction_id text NOT NULL UNIQUE,
  status text DEFAULT 'pending',
  CONSTRAINT valid_payment_method CHECK (payment_method IN ('bkash', 'nagad', 'rocket')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'verified', 'rejected')),
  CONSTRAINT valid_amount CHECK (amount >= 100)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_blood_group ON profiles(blood_group);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(division, district);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON profiles(is_available);
CREATE INDEX IF NOT EXISTS idx_donation_requests_blood_group ON donation_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_donation_requests_location ON donation_requests(division, district);
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_donation_history_donor ON donation_history(donor_id);
CREATE INDEX IF NOT EXISTS idx_monetary_donations_status ON monetary_donations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetary_donations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies with proper permissions
-- Allow public read access to profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow authenticated users to create their own profile
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Donation requests policies
CREATE POLICY "Users can view all donation requests"
    ON public.donation_requests FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create donation requests when authenticated"
    ON public.donation_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own requests"
    ON public.donation_requests FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Donation history policies
CREATE POLICY "Users can view their own donation history"
  ON donation_history FOR SELECT
  USING (auth.uid() = donor_id);

CREATE POLICY "Users can insert their own donation history"
  ON donation_history FOR INSERT
  WITH CHECK (auth.uid() = donor_id);

-- Monetary donations policies
CREATE POLICY "Monetary donations are private"
  ON monetary_donations FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE phone = monetary_donations.phone));

-- Function to update profile's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- The handle_new_user function and its trigger have been intentionally removed.

-- Create donors table
CREATE TABLE IF NOT EXISTS public.donors (
    id uuid default uuid_generate_v4() primary key,
    created_by uuid references auth.users(id),
    name text not null,
    age integer not null check (age >= 18 and age <= 60),
    gender text not null check (gender in ('male', 'female', 'other')),
    blood_group text not null,
    phone text not null unique,
    email text,
    division text not null,
    district text not null,
    last_donation text,
    medical_conditions text,
    is_available boolean default true,
    total_donations integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all donors"
    ON public.donors FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert donors when authenticated"
    ON public.donors FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update donors they created"
    ON public.donors FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Create function to automatically set updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER handle_donors_updated_at
    BEFORE UPDATE ON public.donors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS donors_blood_group_idx ON public.donors(blood_group);
CREATE INDEX IF NOT EXISTS donors_division_district_idx ON public.donors(division, district);
CREATE INDEX IF NOT EXISTS donors_is_available_idx ON public.donors(is_available);
CREATE INDEX IF NOT EXISTS donors_created_by_idx ON public.donors(created_by);

-- Create function to automatically set updated_at for donation requests
CREATE OR REPLACE FUNCTION public.handle_donation_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER handle_donation_requests_updated_at
    BEFORE UPDATE ON public.donation_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_donation_requests_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS donation_requests_blood_group_idx ON public.donation_requests(blood_group);
CREATE INDEX IF NOT EXISTS donation_requests_division_district_idx ON public.donation_requests(division, district);
CREATE INDEX IF NOT EXISTS donation_requests_status_idx ON public.donation_requests(status);
CREATE INDEX IF NOT EXISTS donation_requests_created_by_idx ON public.donation_requests(created_by);