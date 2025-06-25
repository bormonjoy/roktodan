import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Droplet, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      // Close all menus before signing out
      setShowProfileMenu(false);
      setIsOpen(false);
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
      setIsSigningOut(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donor', path: '/find-donor' },
    { name: 'Become Donor', path: '/become-donor' },
    { name: 'Donation Request', path: '/donation-request' },
    { name: 'Donate Money', path: '/donate-money' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Droplet className="w-8 h-8 text-primary" />
            <span className={`font-bold text-xl ml-2 ${isScrolled ? 'text-primary' : location.pathname === '/' ? 'text-white' : 'text-primary'}`}>
              RaktoDan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary font-semibold'
                    : isScrolled
                    ? 'text-accent-dark hover:text-primary'
                    : location.pathname === '/'
                    ? 'text-white hover:text-primary-light'
                    : 'text-accent-dark hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            {user && profile ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                    isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  }`}
                >
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={`font-medium ${
                    isScrolled ? 'text-accent-dark' : location.pathname === '/' ? 'text-white' : 'text-accent-dark'
                  }`}>
                    {profile.name.split(' ')[0]}
                  </span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className={`font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-accent-dark hover:text-primary' : location.pathname === '/' ? 'text-white hover:text-primary-light' : 'text-accent-dark hover:text-primary'
                  }`}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-accent-dark' : location.pathname === '/' ? 'text-white' : 'text-accent-dark'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-accent-dark' : location.pathname === '/' ? 'text-white' : 'text-accent-dark'}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-screen py-4' : 'max-h-0'
          }`}
        >
          <div className="container-custom flex flex-col space-y-4 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary font-semibold'
                    : 'text-accent-dark hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {user && profile ? (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center space-x-2 py-2">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-accent-dark">{profile.name}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="block py-2 text-accent-dark hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="block py-2 text-accent-dark hover:text-primary text-left w-full disabled:opacity-50"
                >
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="border-t pt-4 space-y-2">
                <Link
                  to="/signin"
                  className="block py-2 text-accent-dark hover:text-primary"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;