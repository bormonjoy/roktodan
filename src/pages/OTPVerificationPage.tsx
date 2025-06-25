import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail } from 'lucide-react';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state, or redirect if not present
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifyOtp(email, otp);
      if (error) {
        throw error;
      }
      
      // On success, redirect to the sign-in page with a success message
      navigate('/signin', { 
        state: { message: 'Verification successful! You can now sign in.' } 
      });

    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await resendOtp(email);
      if (error) {
        throw error;
      }
      setMessage('A new OTP has been sent to your email.');
      setResendCooldown(60); // 60-second cooldown
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-accent-dark">Verify Your Account</h2>
          <p className="mt-2 text-gray-600">
            An OTP has been sent to <span className="font-medium text-accent-dark">{email}</span>
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md">
          {error && (
            <div className="mb-4 p-3 border rounded-lg bg-red-100 border-red-400 text-red-700 text-sm">
              {error}
            </div>
          )}
          {message && (
             <div className="mb-4 p-3 border rounded-lg bg-green-100 border-green-400 text-green-700 text-sm">
             {message}
           </div>
          )}
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={loading || resendCooldown > 0}
                className="font-medium text-primary hover:text-primary-light disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Resend {resendCooldown > 0 ? `(${resendCooldown}s)` : 'OTP'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;