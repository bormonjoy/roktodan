import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import FormInput from '../components/common/FormInput';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | RaktoDan';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is being changed
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) errors.name = 'Name is required';
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.message) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, send data to backend
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <SectionTitle
          title="Contact Us"
          subtitle="We're here to help. Reach out to us with any questions or concerns."
          center
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md h-full">
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">Our Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mr-3">
                    <MapPin className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Office Location</h4>
                    <p className="text-gray-600">
                      123 Blood Donor Avenue, Gulshan, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mr-3">
                    <Phone className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone Number</h4>
                    <p className="text-gray-600">+880 1234-567890</p>
                    <p className="text-gray-600">+880 1234-567891</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mr-3">
                    <Mail className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email Address</h4>
                    <p className="text-gray-600">info@raktodan.org</p>
                    <p className="text-gray-600">support@raktodan.org</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mr-3">
                    <Clock className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Office Hours</h4>
                    <p className="text-gray-600">Sunday - Thursday: 9 AM - 5 PM</p>
                    <p className="text-gray-600">Friday - Saturday: Closed</p>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8">
                <h4 className="font-semibold mb-2">Find Us on Map</h4>
                <div className="rounded-lg overflow-hidden border border-gray-200 h-52 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="https://images.pexels.com/photos/67980/pexels-photo-67980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Map of Bangladesh" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              {isSubmitted ? (
                <div className="bg-success/10 p-8 rounded-lg border border-success text-center">
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-success mb-2">Message Sent Successfully!</h3>
                  <p className="mb-6">
                    Thank you for contacting us. We have received your message and will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="btn btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-6 border-b pb-2">Send Us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        id="name"
                        name="name"
                        label="Your Name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        error={formErrors.name}
                        required
                      />
                      
                      <FormInput
                        id="email"
                        name="email"
                        label="Your Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                        required
                      />
                    </div>
                    
                    <FormInput
                      id="subject"
                      name="subject"
                      label="Subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      error={formErrors.subject}
                      required
                    />
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className={`input-field ${formErrors.message ? 'border-error focus:ring-error' : ''}`}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      {formErrors.message && <p className="mt-1 text-sm text-error">{formErrors.message}</p>}
                    </div>
                    
                    <div className="flex justify-center">
                      <button type="submit" className="btn btn-primary">
                        Send Message
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            
            {/* Mission Statement */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Our Mission</h3>
              
              <p className="text-gray-600 mb-4">
                RaktoDan is dedicated to solving the blood supply gap in Bangladesh through an organized network of volunteer donors. We aim to:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                <li>Provide timely access to safe blood for all patients in need</li>
                <li>Educate the public about the importance of regular blood donation</li>
                <li>Eliminate barriers to blood donation through awareness and accessibility</li>
                <li>Support hospitals and healthcare providers with an efficient blood supply system</li>
              </ul>
              
              <p className="text-gray-600">
                Together, we can create a Bangladesh where no one dies due to lack of blood. Join us in our mission to save lives, one donation at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;