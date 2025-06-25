import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        // Redirect to dashboard after successful confirmation
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message || 'An error occurred during email confirmation');
        // Redirect to sign in page after a delay if there's an error
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-error mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Verifying Email</h2>
          <p className="text-gray-600">Please wait while we verify your email...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;