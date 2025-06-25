import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import ProcessSection from '../components/home/ProcessSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import StatsSection from '../components/home/StatsSection';
import CallToActionSection from '../components/home/CallToActionSection';

const HomePage = () => {
  useEffect(() => {
    document.title = 'RaktoDan - Blood Donation Bangladesh';
  }, []);

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
};

export default HomePage;