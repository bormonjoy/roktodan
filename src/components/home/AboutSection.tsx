import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, DropletIcon, Calendar, Users } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const AboutSection = () => {
  return (
    <section className="section bg-accent">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg" 
              alt="Blood Donation Process" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <SectionTitle
              title="About RaktoDan"
              subtitle="We are dedicated to connecting blood donors with those in need across Bangladesh."
            />
            <p className="mb-6 text-gray-600">
              RaktoDan is a nationwide network of blood donors and healthcare providers working together to ensure timely access to safe blood for all patients in Bangladesh.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="bg-primary-light/10 p-3 rounded-lg mr-3">
                  <Heart className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Save Lives</h4>
                  <p className="text-sm text-gray-600">Your donation can save up to 3 lives</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-light/10 p-3 rounded-lg mr-3">
                  <DropletIcon className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">All Blood Types</h4>
                  <p className="text-sm text-gray-600">We need all blood types</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-light/10 p-3 rounded-lg mr-3">
                  <Calendar className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Regular Drives</h4>
                  <p className="text-sm text-gray-600">Organized across Bangladesh</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-light/10 p-3 rounded-lg mr-3">
                  <Users className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Community</h4>
                  <p className="text-sm text-gray-600">Join our network of heroes</p>
                </div>
              </div>
            </div>
            <Link to="/become-donor" className="btn btn-primary">
              Join as Donor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;