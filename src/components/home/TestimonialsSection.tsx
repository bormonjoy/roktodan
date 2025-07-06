import SectionTitle from '../common/SectionTitle';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I was in desperate need of blood for my surgery. Within an hour of posting a request, I found three donors. This platform saved my life.",
      name: "Fatima Ahmed",
      role: "Patient, Dhaka",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "Being able to donate blood and directly help someone in need has been incredibly fulfilling. The process is simple and well-organized.",
      name: "Rahul Khan",
      role: "Regular Donor, Chattogram",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "As a hospital administrator, this platform has been a valuable resource during emergencies. The quick response time has helped save countless lives.",
      name: "Dr. Nusrat Rahman",
      role: "Medical Officer, Sylhet",
      image: "https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  return (
    <section className="section bg-accent">
      <div className="container-custom">
        <SectionTitle
          title="Success Stories"
          subtitle="Hear from those who have experienced the life-changing impact of blood donation"
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card p-8 flex flex-col h-full">
              <div className="mb-6">
                <svg width="45" height="36" className="text-primary/30" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.4 36C8.86667 36 5.15833 34.5333 2.275 31.6C0.758333 29.9333 0 26.9667 0 22.7C0 16.1667 1.99167 10.5833 5.975 5.95C9.95833 1.31667 15.1333 0 21.5 2V12C18.5 12 16.3167 12.6333 14.95 13.9C13.5833 15.1667 12.9 16.8333 12.9 18.9H19.4V36H13.4ZM38.4 36C33.8667 36 30.1583 34.5333 27.275 31.6C25.7583 29.9333 25 26.9667 25 22.7C25 16.1667 26.9917 10.5833 30.975 5.95C34.9583 1.31667 40.1333 0 46.5 2V12C43.5 12 41.3167 12.6333 39.95 13.9C38.5833 15.1667 37.9 16.8333 37.9 18.9H44.4V36H38.4Z"/>
                </svg>
              </div>
              <p className="text-gray-600 mb-6 flex-grow italic">{testimonial.quote}</p>
              <div className="flex items-center mt-auto">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;