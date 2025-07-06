import { ClipboardCheck, Search, Phone, Award } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const ProcessSection = () => {
  const steps = [
    {
      icon: <ClipboardCheck className="w-10 h-10 text-primary" />,
      title: 'Register',
      description: 'Sign up as a donor with your basic information and blood type'
    },
    {
      icon: <Search className="w-10 h-10 text-primary" />,
      title: 'Find or Be Found',
      description: 'Search for donors or be found by those in need'
    },
    {
      icon: <Phone className="w-10 h-10 text-primary" />,
      title: 'Get Connected',
      description: 'Connect directly with donors or recipients'
    },
    {
      icon: <Award className="w-10 h-10 text-primary" />,
      title: 'Save Lives',
      description: 'Donate blood and become a lifesaver'
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <SectionTitle
          title="How It Works"
          subtitle="Our simple process connects donors with those in need quickly and efficiently"
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="card p-6 text-center h-full flex flex-col items-center justify-center relative z-10">
                <div className="bg-primary-light/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 z-0 -translate-y-1/2">
                  <div className="absolute right-0 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-gray-200 transform rotate-45"></div>
                </div>
              )}
              
              {/* Step number */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg transform translate-x-1/4 -translate-y-1/4 z-20">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;