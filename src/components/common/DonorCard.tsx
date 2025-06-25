import React from 'react';
import { Phone, MapPin, Clock, User } from 'lucide-react';

export interface DonorProps {
  id: string;
  name: string;
  bloodGroup: string;
  district: string;
  division: string;
  lastDonation: string;
  phone: string;
  availableNow: boolean;
}

const DonorCard: React.FC<{ donor: DonorProps }> = ({ donor }) => {
  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
            {donor.bloodGroup}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-lg">{donor.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{donor.district}, {donor.division}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${donor.availableNow ? 'bg-success-light/20 text-success' : 'bg-warning-light/20 text-warning'}`}>
          {donor.availableNow ? 'Available' : 'Unavailable'}
        </div>
      </div>
      
      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-center text-gray-700">
          <Phone className="w-4 h-4 mr-2 text-primary" />
          <span>{donor.phone}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-primary" />
          <span>Last Donation: {donor.lastDonation}</span>
        </div>
      </div>
      
      <div className="mt-auto">
        <button className="btn btn-outline w-full">
          Contact Donor
        </button>
      </div>
    </div>
  );
};

export default DonorCard;