import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Droplet, Heart, Phone, MapPin, Edit3 } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

interface DonationHistory {
  id: string;
  recipient_name: string;
  hospital: string;
  donation_date: string;
  blood_group: string;
  units: number;
  status: string;
}

interface RequestHistory {
  id: string;
  patient_name: string;
  hospital: string;
  blood_group: string;
  required_units: number;
  required_date: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'requests'>('overview');
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchHistory();
    }
  }, [user, profile]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      // Fetch donation history
      const { data: donations } = await supabase
        .from('donation_history')
        .select('*')
        .eq('donor_id', user.id)
        .order('donation_date', { ascending: false });

      // Fetch request history
      const { data: requests } = await supabase
        .from('request_history')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      setDonationHistory(donations || []);
      setRequestHistory(requests || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'fulfilled':
        return 'text-success bg-success/10';
      case 'pending':
      case 'scheduled':
        return 'text-warning bg-warning/10';
      case 'cancelled':
      case 'expired':
        return 'text-error bg-error/10';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <SectionTitle
          title={`Welcome, ${profile.name}`}
          subtitle="Manage your blood donation activities and profile"
          center
        />

        {/* Profile Overview Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Profile Overview</h3>
            <button className="btn btn-outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mr-3">
                {profile.blood_group}
              </div>
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <p className="font-semibold">{profile.blood_group}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg mr-3">
                <Phone className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{profile.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg mr-3">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{profile.district}, {profile.division}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg mr-3">
                <Heart className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="font-semibold">{profile.total_donations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-primary">{donationHistory.length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Droplet className="text-primary w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blood Requests</p>
                <p className="text-2xl font-bold text-primary">{requestHistory.length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Heart className="text-primary w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Donation</p>
                <p className="text-2xl font-bold text-primary">
                  {profile.last_donation ? new Date(profile.last_donation).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Calendar className="text-primary w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'donations', label: 'Donation History' },
                { key: 'requests', label: 'Request History' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.key as any)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
                <div className="space-y-4">
                  {donationHistory.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                          <Droplet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Donated to {donation.recipient_name}</p>
                          <p className="text-sm text-gray-600">{donation.hospital} • {new Date(donation.donation_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </div>
                  ))}
                  
                  {requestHistory.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Requested for {request.patient_name}</p>
                          <p className="text-sm text-gray-600">{request.hospital} • {new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'donations' && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Donation History</h4>
                {loadingHistory ? (
                  <div className="text-center py-8">Loading...</div>
                ) : donationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {donationHistory.map((donation) => (
                      <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{donation.recipient_name}</h5>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Hospital:</span> {donation.hospital}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(donation.donation_date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Blood Group:</span> {donation.blood_group}
                          </div>
                          <div>
                            <span className="font-medium">Units:</span> {donation.units}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No donation history found
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Request History</h4>
                {loadingHistory ? (
                  <div className="text-center py-8">Loading...</div>
                ) : requestHistory.length > 0 ? (
                  <div className="space-y-4">
                    {requestHistory.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{request.patient_name}</h5>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Hospital:</span> {request.hospital}
                          </div>
                          <div>
                            <span className="font-medium">Required Date:</span> {new Date(request.required_date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Blood Group:</span> {request.blood_group}
                          </div>
                          <div>
                            <span className="font-medium">Units:</span> {request.required_units}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No request history found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;