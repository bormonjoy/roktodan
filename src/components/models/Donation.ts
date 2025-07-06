// src/models/Donation.ts

// This interface matches your Supabase 'donations' table
export interface Donation {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email?: string | null;
  amount: number;
  payment_method: string;
  transaction_id: string;
}

// This interface is for the data after it's been formatted for display
export interface FormattedDonation extends Donation {
  displayContact: string;
  formattedDate: string;
}

/**
 * Formats an array of raw donation records for safe public display.
 * - Hides parts of phone numbers and emails for privacy.
 * - Formats the ISO date string into a readable format.
 * @param donations The raw array of Donation objects from Supabase.
 * @returns An array of FormattedDonation objects ready for the UI.
 */
export const formatDonationsForDisplay = (donations: Donation[]): FormattedDonation[] => {
  return donations.map(donation => {
    // Privacy-first formatting for contact info
    const hiddenPhone = donation.phone.substring(0, 5) + '******';
    let displayContact = hiddenPhone;

    if (donation.email) {
      const [localPart, domain] = donation.email.split('@');
      const hiddenEmail = localPart.length > 2
        ? localPart.substring(0, 3) + '***@' + domain
        : localPart.substring(0, 1) + '***@' + domain;
      displayContact += `\n${hiddenEmail}`;
    }

    return {
      ...donation,
      displayContact,
      formattedDate: new Date(donation.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
  });
};