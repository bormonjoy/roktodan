import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SectionTitle from '../components/common/SectionTitle';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import { divisions, districtsByDivision, bloodGroups } from '../data/locations';

interface FormData {
  patientName: string;
  hospital: string;
  bloodGroup: string;
  requiredUnits: string;
  date: string;
  division: string;
  district: string;
  contactPerson: string;
  contactPhone: string;
  additionalInfo: string;
}

interface FormErrors {
  [key: string]: string;
}

const DonationRequestPage = () => {
  // --- FIX 1: Get the authentication loading status ---
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    hospital: '',
    bloodGroup: '',
    requiredUnits: '1',
    date: '',
    division: '',
    district: '',
    contactPerson: '',
    contactPhone: '',
    additionalInfo: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    document.title = 'Request Blood Donation | RaktoDan';
  }, []);

  useEffect(() => {
    if (formData.division) {
      setAvailableDistricts(districtsByDivision[formData.division] || []);
      if (!districtsByDivision[formData.division]?.some(d => d.value === formData.district)) {
        setFormData(prev => ({ ...prev, district: '' }));
      }
    } else {
      setAvailableDistricts([]);
      setFormData(prev => ({ ...prev, district: '' }));
    }
  }, [formData.division]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const requiredFields = ['patientName', 'hospital', 'bloodGroup', 'date', 'division', 'district', 'contactPerson', 'contactPhone'];

    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.contactPhone && !/^01[3-9]\d{8}$/.test(formData.contactPhone)) {
      errors.contactPhone = 'Please enter a valid Bangladeshi phone number (e.g., 01712345678)';
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.date && selectedDate < today) {
      errors.date = 'Please select today or a future date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setFormErrors({
        submit: 'Authentication error. You must be logged in to submit a request.'
      });
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      console.log('Attempting to submit request with data:', {
        created_by: user.id,
        patient_name: formData.patientName.trim(),
        hospital: formData.hospital.trim(),
        blood_group: formData.bloodGroup,
        required_units: parseInt(formData.requiredUnits),
        required_date: formData.date,
        division: formData.division,
        district: formData.district,
        contact_person: formData.contactPerson.trim(),
        contact_phone: formData.contactPhone.trim(),
        additional_info: formData.additionalInfo.trim() || null,
        status: 'pending'
      });

      const { data, error } = await supabase
        .from('donation_requests')
        .insert([{  // Note: Wrap the object in an array
          created_by: user.id,
          patient_name: formData.patientName.trim(),
          hospital: formData.hospital.trim(),
          blood_group: formData.bloodGroup,
          required_units: parseInt(formData.requiredUnits),
          required_date: formData.date,
          division: formData.division,
          district: formData.district,
          contact_person: formData.contactPerson.trim(),
          contact_phone: formData.contactPhone.trim(),
          additional_info: formData.additionalInfo.trim() || null,
          status: 'pending'
        }])
        .select('*');  // Use select('*') to get all fields

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Error submitting request:', error);
        if (error.code === '42501' || error.message.includes('permission denied for table')) {
          setFormErrors({ submit: 'Permission Denied. Please contact support or try again later.' });
        } else if (error.message.includes('violates row-level security policy')) {
          setFormErrors({ submit: 'Permission denied. Please ensure you are logged in and try again.' });
        } else if (error.code === '23505') {
          setFormErrors({ submit: 'A request with this information already exists.' });
        } else {
          setFormErrors({ 
            submit: `Database error: ${error.message}. Please try again or contact support.` 
          });
        }
        return;
      }

      if (data && data.length > 0) {
        console.log('Successfully created request:', data[0]);
        setIsSubmitted(true);
        setFormData({
          patientName: '', hospital: '', bloodGroup: '', requiredUnits: '1', date: '',
          division: '', district: '', contactPerson: '', contactPhone: '', additionalInfo: '',
        });

        // Add a delay before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setFormErrors({ 
          submit: 'The request was not created. Please try again or contact support.' 
        });
      }

    } catch (error: any) {
      console.error('Catastrophic error in handleSubmit:', error);
      setFormErrors({ 
        submit: `System error: ${error.message}. Please try again or contact support.` 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- FIX 2: Handle the authentication loading state ---
  if (authLoading) {
    return (
      <div className="pt-24 pb-16 flex justify-center items-center h-screen">
        <p>Loading Your Session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-error/10 p-6 rounded-lg border border-error text-center">
              <h3 className="text-xl font-semibold text-error mb-2">Authentication Required</h3>
              <p className="mb-4">You must be logged in to submit a blood donation request.</p>
              <button onClick={() => navigate('/signin')} className="btn btn-primary">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <SectionTitle
          title="Request Blood Donation"
          subtitle="Fill out the form below to request blood donation for a patient in need"
          center
        />
        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className="bg-success/10 p-8 rounded-lg border border-success text-center">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-success mb-2">Request Submitted Successfully!</h3>
                <p className="mb-6">Your request is now pending verification. Donors will be notified once it's approved.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
                        Go to Dashboard
                    </button>
                    <button onClick={() => setIsSubmitted(false)} className="btn btn-primary">
                        Submit Another Request
                    </button>
                </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="bg-white p-8 rounded-xl shadow-md space-y-6">
              {formErrors.submit && (
                <div className="p-4 bg-error/10 rounded-lg border border-error">
                  <p className="text-error text-sm font-semibold">{formErrors.submit}</p>
                </div>
              )}
              <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">Important Notice</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Please provide accurate information. All requests are subject to verification before being published to potential donors.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Patient & Requirement Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormInput id="patientName" name="patientName" label="Patient Name" type="text" value={formData.patientName} onChange={handleChange} error={formErrors.patientName} required />
                  <FormInput id="hospital" name="hospital" label="Hospital Name" type="text" value={formData.hospital} onChange={handleChange} error={formErrors.hospital} required />
                  <FormSelect id="bloodGroup" name="bloodGroup" label="Required Blood Group" value={formData.bloodGroup} onChange={handleChange} options={bloodGroups} error={formErrors.bloodGroup} required />
                  <FormInput id="requiredUnits" name="requiredUnits" label="Required Units (Bags)" type="number" min="1" max="10" value={formData.requiredUnits} onChange={handleChange} error={formErrors.requiredUnits} required />
                  <FormInput id="date" name="date" label="Required By Date" type="date" value={formData.date} onChange={handleChange} error={formErrors.date} required />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Location & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormSelect id="division" name="division" label="Division" value={formData.division} onChange={handleChange} options={divisions} error={formErrors.division} required />
                  <FormSelect id="district" name="district" label="District" value={formData.district} onChange={handleChange} options={availableDistricts} error={formErrors.district} disabled={!formData.division} required />
                  <FormInput id="contactPerson" name="contactPerson" label="Contact Person Name" type="text" value={formData.contactPerson} onChange={handleChange} error={formErrors.contactPerson} required />
                  <FormInput id="contactPhone" name="contactPhone" label="Contact Phone Number" type="tel" value={formData.contactPhone} onChange={handleChange} error={formErrors.contactPhone} placeholder="01712345678" required />
                </div>
              </div>
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
                <textarea id="additionalInfo" name="additionalInfo" rows={4} className="input-field" value={formData.additionalInfo} onChange={handleChange} placeholder="e.g., Ward/Bed number, specific case details, alternative contact." />
              </div>
              <div className="flex justify-center pt-4">
                <button type="submit" className="btn btn-primary w-full md:w-auto" disabled={loading || authLoading}>
                  {/* --- FIX 3: Disable button during auth loading --- */}
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationRequestPage;