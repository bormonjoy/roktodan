import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.25,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              <Heart className="text-white w-8 h-8" />
            </div>
          ))}
        </div>
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Donate Blood, Save Lives in Bangladesh
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg mx-auto md:mx-0">
              Every donation can help save up to three lives. Join our community of donors and make a difference today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/become-donor" className="btn bg-white text-primary hover:bg-gray-100">
                Become a Donor
              </Link>
              <Link to="/find-donor" className="btn border-2 border-white text-white hover:bg-white hover:text-primary">
                Find a Donor <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.pexels.com/photos/6823517/pexels-photo-6823517.jpeg" 
              alt="Blood Donation" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold">10K+</h3>
            <p className="text-sm md:text-base mt-2">Registered Donors</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold">5K+</h3>
            <p className="text-sm md:text-base mt-2">Lives Saved</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold">64</h3>
            <p className="text-sm md:text-base mt-2">Districts Covered</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold">24/7</h3>
            <p className="text-sm md:text-base mt-2">Support Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;