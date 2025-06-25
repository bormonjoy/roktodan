import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import { divisions, districtsByDivision, bloodGroups } from '../../data/locations';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  division: string;
  district: string;
}

const SignUpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
    division: '',
    district: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<Array<{ value: string; label: string }>>([]);
  
  const { signUp } = useAuth();
  const navigate = useNavigate(); // <-- INITIALIZE useNavigate

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Bangladeshi phone number';
    }
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18 || age > 60) {
            newErrors.dateOfBirth = 'You must be between 18 and 60 years old to register';
        }
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.division) newErrors.division = 'Division is required';
    if (!formData.district) newErrors.district = 'District is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const profileData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        blood_group: formData.bloodGroup,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        division: formData.division,
        district: formData.district,
    };

    const { data, error } = await signUp(formData.email.trim(), formData.password, profileData);

    setLoading(false);

    if (error) {
      if (error.message?.includes('profiles_phone_key')) {
          setErrors({ phone: 'This phone number is already registered.' });
      } else if (error.message?.includes('User already registered')) {
          setErrors({ email: 'This email address is already registered.' });
      } else {
          setErrors({ general: `Sign up failed: ${error.message}` });
      }
    } else if (data.user) {
      // --- MODIFIED PART ---
      // On success, navigate to the OTP verification page
      // Pass the email in the navigation state
      navigate('/verify-otp', { state: { email: formData.email.trim() } });
      // ---------------------
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-accent-dark">Create Account</h2>
          <p className="mt-2 text-gray-600">
            Join our community of blood donors
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md">
          {errors.general && (
            <div className="mb-4 p-3 border rounded-lg bg-red-100 border-red-400">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <FormInput id="name" name="name" label="Full Name" type="text" value={formData.name} onChange={handleChange} error={errors.name} className="pl-10" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <FormInput id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} error={errors.email} className="pl-10" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <FormInput id="password" name="password" label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={errors.password} className="pl-10 pr-10" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <FormInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} className="pl-10 pr-10" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <FormInput id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} className="pl-10" placeholder="01712345678" required />
              </div>
              <FormSelect id="bloodGroup" name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} options={bloodGroups} error={errors.bloodGroup} required />
              <FormInput id="dateOfBirth" name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} required />
              <FormSelect id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={genderOptions} error={errors.gender} required />
              <FormSelect id="division" name="division" label="Division" value={formData.division} onChange={handleChange} options={divisions} error={errors.division} required />
              <FormSelect id="district" name="district" label="District" value={formData.district} onChange={handleChange} options={availableDistricts} error={errors.district} disabled={!formData.division} required />
            </div>
            
            <button type="submit" disabled={loading} className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:text-primary-light font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;