export interface User {
  id: string;
  created_at: string;
  email: string;
  phone: string;
  name: string;
  blood_group: string;
  date_of_birth: string;
  gender: string;
  division: string;
  district: string;
  last_donation: string | null;
  is_available: boolean;
  medical_conditions: string | null;
}

export interface DonationRequest {
  id: string;
  created_at: string;
  patient_name: string;
  hospital: string;
  blood_group: string;
  required_units: number;
  required_date: string;
  division: string;
  district: string;
  contact_person: string;
  contact_phone: string;
  additional_info: string | null;
  status: 'pending' | 'fulfilled' | 'expired';
}

export interface Donation {
  id: string;
  created_at: string;
  donor_id: string;
  request_id: string;
  donation_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface MonetaryDonation {
  id: string;
  created_at: string;
  donor_name: string;
  email: string | null;
  phone: string;
  amount: number;
  payment_method: 'bkash' | 'nagad' | 'rocket';
  transaction_id: string;
  status: 'pending' | 'verified' | 'rejected';
}