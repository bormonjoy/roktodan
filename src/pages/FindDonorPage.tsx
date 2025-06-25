import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Filter } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import BloodGroupSelector from '../components/common/BloodGroupSelector';
import DonorCard from '../components/common/DonorCard';
import FormSelect from '../components/common/FormSelect';
import { supabase } from '../lib/supabase';
import { divisions, districtsByDivision } from '../data/locations';

// Interfaces remain the same
interface Donor {
  id: string;
  name: string;
  blood_group: string;
  phone: string;
  division: string;
  district: string;
  last_donation: string | null;
  is_available: boolean;
  total_donations: number;
  created_at: string;
}

interface DonationRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  required_units: number;
  required_date: string;
  hospital: string;
  division: string;
  district: string;
  contact_person: string;
  contact_phone: string;
  status: string;
  created_at: string;
}

const FindDonorPage = () => {
  // Filters state
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availableDistricts, setAvailableDistricts] = useState<Array<{ value: string; label: string }>>([]);

  // Data state
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [allRequests, setAllRequests] = useState<DonationRequest[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'donors' | 'requests'>('donors');

  // --- FIX 1: Fetch data only ONCE on component mount ---
  useEffect(() => {
    document.title = 'Find Blood Donors | RaktoDan';
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both donors and requests in parallel for speed
      const [donorsResponse, requestsResponse] = await Promise.all([
        supabase
          .from('donors')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('donation_requests')
          .select('*')
          .eq('status', 'pending')
          .order('required_date', { ascending: true })
      ]);

      if (donorsResponse.error) throw donorsResponse.error;
      if (requestsResponse.error) throw requestsResponse.error;

      setAllDonors(donorsResponse.data || []);
      setAllRequests(requestsResponse.data || []);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update available districts when division changes
  useEffect(() => {
    if (selectedDivision) {
      setAvailableDistricts(districtsByDivision[selectedDivision] || []);
      setSelectedDistrict(''); // Reset district when division changes
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedDivision]);

  // --- FIX 2: Use useMemo for efficient, reactive filtering ---
  // This calculates the filtered list whenever the source data or filters change.
  const filteredData = useMemo(() => {
    const dataToFilter = activeTab === 'donors' ? allDonors : allRequests;

    return dataToFilter.filter(item => {
      const bloodGroupMatch = selectedBloodGroup === 'All' || item.blood_group === selectedBloodGroup;
      const divisionMatch = !selectedDivision || item.division.toLowerCase() === selectedDivision.toLowerCase();
      const districtMatch = !selectedDistrict || item.district.toLowerCase() === selectedDistrict.toLowerCase();
      
      return bloodGroupMatch && divisionMatch && districtMatch;
    });
  }, [activeTab, allDonors, allRequests, selectedBloodGroup, selectedDivision, selectedDistrict]);


  if (error) {
    return (
      <div className="pt-24 pb-16 container-custom">
        <div className="bg-error/10 p-6 rounded-lg border border-error text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-error mb-2">Error Loading Data</h3>
          <p className="mb-4">{error}</p>
          <button onClick={fetchInitialData} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <SectionTitle title="Find Blood" subtitle="Search for available donors and active donation requests" center />
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white shadow-sm">
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'donors' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Available Donors
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'requests' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active Requests
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <BloodGroupSelector selectedGroup={selectedBloodGroup} onChange={setSelectedBloodGroup} />
            </div>
            <FormSelect id="division" label="Division" value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} options={divisions} />
            <FormSelect id="district" label="District" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} options={availableDistricts} disabled={!selectedDivision} />
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <Filter className="w-6 h-6 mr-3 text-primary" />
            Showing {filteredData.length} {activeTab === 'donors' ? 'Donor(s)' : 'Request(s)'}
          </h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading initial data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'donors' ? (
                (filteredData as Donor[]).map((donor) => (
                  <DonorCard 
                    key={donor.id} 
                    donor={{
                      id: donor.id, name: donor.name, bloodGroup: donor.blood_group,
                      phone: donor.phone, division: donor.division, district: donor.district,
                      lastDonation: donor.last_donation || '', availableNow: donor.is_available
                    }} 
                  />
                ))
              ) : (
                (filteredData as DonationRequest[]).map((request) => (
                  <div key={request.id} className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-500">{request.hospital}</p>
                        <h4 className="text-lg font-bold text-gray-800">{request.patient_name}</h4>
                      </div>
                      <span className="flex-shrink-0 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                        {request.blood_group}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700 flex-grow">
                      <p><strong>Required By:</strong> {new Date(request.required_date).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {request.district}, {request.division}</p>
                      <p><strong>Contact:</strong> {request.contact_person} ({request.contact_phone})</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">Posted on {new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h4 className="text-xl font-semibold mb-2 text-gray-800">No {activeTab === 'donors' ? 'donors' : 'requests'} match your criteria</h4>
              <p className="text-gray-600">Please try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDonorPage;