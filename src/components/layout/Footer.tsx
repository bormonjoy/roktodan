import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-accent-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <Droplet className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl ml-2">RaktoDan</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting blood donors with recipients across Bangladesh. Our mission is to ensure timely access to safe blood for all who need it.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/find-donor" className="text-gray-300 hover:text-primary transition-colors">Find Donor</Link>
              </li>
              <li>
                <Link to="/become-donor" className="text-gray-300 hover:text-primary transition-colors">Become a Donor</Link>
              </li>
              <li>
                <Link to="/donation-request" className="text-gray-300 hover:text-primary transition-colors">Request Donation</Link>
              </li>
              <li>
                <Link to="/donate-money" className="text-gray-300 hover:text-primary transition-colors">Donate Money</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-2 mt-1" />
                <span className="text-gray-300">
                  123 Blood Donor Avenue, Gulshan, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-2" />
                <span className="text-gray-300">+880 1234-567890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-2" />
                <span className="text-gray-300">info@raktodan.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for updates on blood drives and donation campaigns.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="bg-primary hover:bg-primary-light text-white py-2 rounded transition-colors duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} RaktoDan. All rights reserved.</p>
          <p className="mt-1 text-sm">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link> | 
            <Link to="#" className="hover:text-primary transition-colors ml-2">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;