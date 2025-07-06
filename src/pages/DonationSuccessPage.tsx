import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, History } from 'lucide-react';

export default function DonationSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    document.title = 'Donation Successful | RaktoDan';

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 10000); // 10 seconds

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-24 pb-16">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white max-w-xl w-full p-8 md:p-12 rounded-2xl shadow-lg text-center">
          <div className="mx-auto mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={40} />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Donation Successful!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Thank you for your generous donation. Your support helps us save lives.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition w-full sm:w-auto"
            >
              <Home className="inline-block mr-2" size={18} />
              Return to Home
            </Link>

            <Link
              to="/donation-history"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition w-full sm:w-auto"
            >
              <History className="inline-block mr-2" size={18} />
              View Donation History
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            You will be automatically redirected to the homepage in {countdown} seconds...
          </p>
        </div>
      </main>
    </div>
  );
}