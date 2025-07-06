import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Small Act Can Make a Big Difference
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Every three seconds, someone needs blood. By donating just once, you can save up to three lives. Join our community of lifesavers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/become-donor" className="btn bg-white text-primary hover:bg-gray-100">
              Become a Donor
            </Link>
            <Link to="/donation-request" className="btn border-2 border-white hover:bg-white hover:text-primary">
              Request Blood
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;