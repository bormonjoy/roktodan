import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FindDonorPage from './pages/FindDonorPage';
import DonationRequestPage from './pages/DonationRequestPage';
import BecomeDonorPage from './pages/BecomeDonorPage';
import DonateMoneyPage from './pages/DonateMoneyPage';
import ContactPage from './pages/ContactPage';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import AuthCallback from './components/auth/AuthCallback';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/utils/ScrollToTop';
import OTPVerificationPage from './pages/OTPVerificationPage';
import DonationHistoryPage from './pages/DonationHistoryPage';

function App() {
  return (
    // The AuthProvider must wrap the Router so that hooks like useNavigate
    // are available within the AuthContext.
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/find-donor" element={<FindDonorPage />} />
              <Route path="/donate-money" element={<DonateMoneyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/donation-history" element={<DonationHistoryPage />} />
              
              {/* Auth Routes */}
              <Route path="/signin" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/verify-otp" element={<OTPVerificationPage />} /> {/* <-- ADDED ROUTE */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Routes */}
              <Route path="/donation-request" element={
                <ProtectedRoute>
                  <DonationRequestPage />
                </ProtectedRoute>
              } />
              <Route path="/become-donor" element={
                <ProtectedRoute>
                  <BecomeDonorPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;