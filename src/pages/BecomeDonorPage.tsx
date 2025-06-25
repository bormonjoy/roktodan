import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SectionTitle from '../components/common/SectionTitle';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import { divisions, districtsByDivision, bloodGroups } from '../data/locations';

interface FormData {
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  lastDonation: string;
  medicalConditions: string;
  eligible: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const BecomeDonorPage = () => {
  const { user, loading: authLoading } = useAuth(); // <-- Get authLoading status
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '', // <-- Initialize as empty
    division: '',
    district: '',
    lastDonation: '',
    medicalConditions: '',
    eligible: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    document.title = 'Become a Blood Donor | RaktoDan';
  }, []);

  // --- FIX 1: SYNCHRONIZE USER EMAIL ---
  // This useEffect updates the form's email field once the user object is loaded.
  useEffect(() => {
    if (user && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user, formData.email]);


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
  }, [formData.division, formData.district]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const requiredFields = ['name', 'age', 'gender', 'bloodGroup', 'phone', 'division', 'district'];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        errors[field] = 'This field is required';
      }
    });
    
    const age = parseInt(formData.age);
    if (formData.age && (isNaN(age) || age < 18 || age > 60)) {
      errors.age = 'You must be between 18 and 60 years old to donate blood';
    }
    
    if (formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid Bangladeshi phone number (e.g., 01712345678)';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.eligible) {
      errors.eligible = 'You must confirm your eligibility to register as a donor';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!user) {
      setFormErrors({
        submit: 'Authentication error. You must be logged in to register a donor.'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // --- FIX 2: MAKE SUPABASE CALL MORE ROBUST ---
      // Removed .single() to get clearer errors from the INSERT operation itself.
      const { data, error } = await supabase
        .from('donors')
        .insert({
          created_by: user.id,
          name: formData.name.trim(),
          age: parseInt(formData.age),
          gender: formData.gender,
          blood_group: formData.bloodGroup,
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          division: formData.division,
          district: formData.district,
          last_donation: formData.lastDonation || null,
          medical_conditions: formData.medicalConditions.trim() || null,
          is_available: true,
          total_donations: 0
        })
        .select(); // We select to confirm the insert worked.

      if (error) {
        console.error('Supabase insert error:', error);
        if (error.code === '23505' && error.message.includes('phone')) {
          setFormErrors({ phone: 'This phone number is already registered.' });
        } else if (error.message.includes('violates row-level security policy')) {
          setFormErrors({ submit: 'Permission Denied. Your session might have expired. Please refresh and try again.' });
        } else {
          setFormErrors({ 
            submit: `Database error: ${error.message}. Please try again.` 
          });
        }
        return;
      }

      if (data && data.length > 0) {
        console.log('Successfully created donor:', data[0]);
        setIsSubmitted(true);
        // Reset form
        setFormData({
          name: '', age: '', gender: '', bloodGroup: '', phone: '',
          email: user?.email || '', division: '', district: '',
          lastDonation: '', medicalConditions: '', eligible: false,
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        // This case handles if there's no error but also no data, a rare edge case.
        setFormErrors({
          submit: 'The donor was not created due to an unknown issue. Please try again.'
        });
      }

    } catch (error: any) {
      console.error('Catastrophic error in handleSubmit:', error);
      setFormErrors({
        submit: `An unexpected error occurred: ${error.message}. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // --- FIX 3: HANDLE AUTH LOADING STATE ---
  if (authLoading) {
    return (
      <div className="pt-24 pb-16 flex justify-center items-center">
        <p>Loading Your Session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="bg-warning/10 p-8 rounded-lg border border-warning text-center">
              <Heart className="w-16 h-16 text-warning mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-warning mb-2">Authentication Required</h3>
              <p className="mb-6">
                Please sign in or create an account to register blood donors.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/signin')} 
                  className="btn btn-primary"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="btn btn-outline"
                >
                  Create Account
                </button>
              </div>
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
          title="Register a Blood Donor"
          subtitle="Help grow our community of lifesavers by registering blood donors"
          center
        />
        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className="bg-success/10 p-8 rounded-lg border border-success text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-success mb-2">Registration Successful!</h3>
              <p className="mb-6">
                The donor has been successfully registered. They will be contacted when someone in their area needs their blood type.
              </p>
              <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-md">
              {formErrors.submit && (
                <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg">
                  <p className="text-error text-sm">{formErrors.submit}</p>
                </div>
              )}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Heart className="w-12 h-12 text-primary" />
                </div>
              </div>
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* ... all your FormInput and FormSelect components ... */}
                {/* No changes needed inside the form fields themselves */}
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <FormInput id="name" name="name" label="Full Name" type="text" value={formData.name} onChange={handleChange} error={formErrors.name} required />
                  <FormInput id="age" name="age" label="Age" type="number" min="18" max="60" value={formData.age} onChange={handleChange} error={formErrors.age} required />
                  <FormSelect id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={[{ value: '', label: 'Select Gender' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} error={formErrors.gender} required />
                  <FormSelect id="bloodGroup" name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} options={bloodGroups} error={formErrors.bloodGroup} required />
                </div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <FormInput id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} error={formErrors.phone} placeholder="01712345678" required />
                  <FormInput id="email" name="email" label="Email (Optional)" type="email" value={formData.email} onChange={handleChange} error={formErrors.email} />
                  <FormSelect id="division" name="division" label="Division" value={formData.division} onChange={handleChange} options={divisions} error={formErrors.division} required />
                  <FormSelect id="district" name="district" label="District" value={formData.district} onChange={handleChange} options={availableDistricts} error={formErrors.district} disabled={!formData.division} required />
                </div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Donation History</h3>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <FormSelect id="lastDonation" name="lastDonation" label="Last Blood Donation (Optional)" value={formData.lastDonation} onChange={handleChange} options={[{ value: '', label: 'Select an option'}, { value: 'never', label: 'Never donated before' }, { value: 'less-than-3', label: 'Less than 3 months ago' }, { value: '3-6', label: '3-6 months ago' }, { value: 'more-than-6', label: 'More than 6 months ago' }]} error={formErrors.lastDonation} />
                  <div className="mb-4">
                    <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions (Optional)</label>
                    <textarea id="medicalConditions" name="medicalConditions" rows={3} className="input-field" value={formData.medicalConditions} onChange={handleChange} placeholder="List any conditions that might affect donation ability (e.g., diabetes, hypertension)"></textarea>
                  </div>
                </div>
                <div className="mb-6 p-4 bg-accent rounded-lg">
                  <div className="flex items-start">
                    <input id="eligible" name="eligible" type="checkbox" className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" checked={formData.eligible} onChange={handleChange} required />
                    <label htmlFor="eligible" className="ml-3 text-sm text-gray-800">I confirm the donor is in good health, weighs at least 50kg, and understands their contact information may be shared with blood seekers.</label>
                  </div>
                  {formErrors.eligible && <p className="mt-2 ml-7 text-sm text-error">{formErrors.eligible}</p>}
                </div>
                <div className="flex justify-center">
                  <button type="submit" className="btn btn-primary w-full md:w-auto" disabled={loading || authLoading}>
                    {loading ? 'Submitting...' : 'Register as Donor'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeDonorPage;