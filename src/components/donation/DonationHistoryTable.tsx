// src/components/DonationHistoryTable.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { FormattedDonation } from '../models/Donation';

interface Props {
  donations: FormattedDonation[];
  isLoading: boolean;
  loadingMessage: string;
}

const DonationHistoryTable: React.FC<Props> = ({ donations, isLoading, loadingMessage }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 w-12 text-center">SL</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3 whitespace-nowrap">Contact Info</th>
            <th scope="col" className="px-6 py-3 text-right">Amount (BDT)</th>
            {/* --- NEW COLUMN HEADERS --- */}
            <th scope="col" className="px-6 py-3">Payment Method</th>
            <th scope="col" className="px-6 py-3">Transaction ID</th>
            <th scope="col" className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr key={donation.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 text-center font-medium text-gray-900">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{donation.name}</td>
              <td className="px-6 py-4 whitespace-pre-line text-xs">{donation.displayContact}</td>
              <td className="px-6 py-4 font-semibold text-right text-green-600">{donation.amount.toLocaleString()}</td>
              
              {/* --- NEW DATA CELLS --- */}
              <td className="px-6 py-4 whitespace-nowrap">{donation.payment_method}</td>
              {/* Styling for the transaction ID to make it more readable */}
              <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">{donation.transaction_id}</td>
              
              <td className="px-6 py-4 whitespace-nowrap">{donation.formattedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {donations.length === 0 && !isLoading && (
        <p className="text-center p-8 text-gray-500">No donations found yet. Be the first to contribute!</p>
      )}
    </div>
  );
};

export default DonationHistoryTable;