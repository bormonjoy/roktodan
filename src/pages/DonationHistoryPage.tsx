// src/pages/DonationHistoryPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import SectionTitle from '../components/common/SectionTitle';
import DonationHistoryTable from '../components/donation/DonationHistoryTable';
import { Donation, formatDonationsForDisplay } from '../components/models/Donation';

const DonationHistoryPage = () => {
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllDonations = async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all donations:', error);
        setError('Could not load donation history. Please try again later.');
      } else {
        setAllDonations(data);
      }
      setIsLoading(false);
    };

    document.title = 'Donation History | RaktoDan';
    fetchAllDonations();
  }, []);

  // useMemo prevents re-formatting the list on every render, improving performance
  const formattedDonations = useMemo(() => formatDonationsForDisplay(allDonations), [allDonations]);

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <SectionTitle title="Complete Donation History" subtitle="A heartfelt thank you to every one of our supporters" center />
        <div className="max-w-4xl mx-auto">
          {error ? (
            <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>
          ) : (
            <DonationHistoryTable 
              donations={formattedDonations} 
              isLoading={isLoading} 
              loadingMessage="Loading Full History..." 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryPage;