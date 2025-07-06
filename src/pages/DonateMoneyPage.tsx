// src/pages/DonateMoneyPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SectionTitle from '../components/common/SectionTitle';
import FormInput from '../components/common/FormInput';
import DonationHistoryTable from '../components/donation/DonationHistoryTable';
import { Donation, FormattedDonation, formatDonationsForDisplay } from '../components/models/Donation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  amount: string;
}

interface FormErrors { [key: string]: string; }

const DonateMoneyPage = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', amount: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting,] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // State for the history section
  const [recentDonations, setRecentDonations] = useState<FormattedDonation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Fetch recent donations from Supabase
  const fetchRecentDonations = useCallback(async () => {
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent donations:', error);
    } else if (data) {
      setRecentDonations(formatDonationsForDisplay(data as Donation[]));
    }
    setIsLoadingHistory(false);
  }, []);

  useEffect(() => {
    document.title = 'Donate Money | RaktoDan';
    fetchRecentDonations();
  }, [fetchRecentDonations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid Bangladeshi phone number';
    }
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) < 100) {
      errors.amount = 'Minimum donation amount is 100 BDT';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  const amount = Number(formData.amount);
  if (isNaN(amount)) {
    alert("Invalid donation amount.");
    return;
  }

  try {
    const donationPayload = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone,
      amount: amount,
    };

    console.log(donationPayload);

    const response = await fetch('https://roktodan-server.vercel.app/api/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationPayload),
    });

    const data: { url?: string; error?: string } = await response.json();

    if (response.ok && data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Failed to initiate payment.');
    }
  } catch (error) {
    console.error('Booking error:', error);
    alert('Error in donating: ' + (error instanceof Error ? error.message : 'Unknown error'));
  } finally {
    console.log('Donation request completed.');
  }
};


  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', amount: '' });
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom">
        {/* --- Donation Form Section --- */}
        <SectionTitle title="Donate Money" subtitle="Your financial contributions help us save lives" center />
        <div className="max-w-2xl mx-auto mb-16">
          {isSubmitted ? (
            <div className="bg-success/10 p-8 rounded-lg border border-success text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-success mb-2">Thank You!</h3>
              <p className="mb-6">Your donation of <span className="font-semibold">{formData.amount} BDT</span> has been recorded.</p>
              <button onClick={resetForm} className="btn btn-primary">Make Another Donation</button>
            </div>
          ) : (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <form onSubmit={handleSubmit} noValidate>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <FormInput id="name" name="name" label="Your Name" value={formData.name} onChange={handleChange} error={formErrors.name} required />
                  <FormInput id="email" name="email" label="Email (Optional)" type="email" value={formData.email} onChange={handleChange} error={formErrors.email} />
                  <FormInput id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} error={formErrors.phone} required />
                  <FormInput id="amount" name="amount" label="Amount (BDT)" type="number" value={formData.amount} onChange={handleChange} error={formErrors.amount} required min="100"/>
                </div>
                {submitError && <div className="text-red-600 font-medium mb-4 text-center">{submitError}</div>}
                <div className="flex justify-center mt-6">
                  <button type="submit" className="btn btn-primary w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Complete Donation'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* --- Recent Donations Section --- */}
        <SectionTitle title="Recent Generous Donors" subtitle="We are grateful to our supporters who make our work possible" center />
        <div className="max-w-4xl mx-auto">
          <DonationHistoryTable 
            donations={recentDonations} 
            isLoading={isLoadingHistory} 
            loadingMessage="Loading Recent Donations..." 
          />
          <div className="text-center mt-8">
            <Link to="/donation-history" className="btn btn-secondary">
              View All Donations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateMoneyPage;