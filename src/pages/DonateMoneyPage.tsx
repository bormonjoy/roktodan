import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import FormInput from '../components/common/FormInput';
import { paymentMethods } from '../data/paymentMethods';

interface FormData {
  name: string;
  email: string;
  phone: string;
  amount: string;
  paymentMethod: string;
  transactionId: string;
}

interface FormErrors {
  [key: string]: string;
}

const DonateMoneyPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    amount: '',
    paymentMethod: '',
    transactionId: '',
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    document.title = 'Donate Money | RaktoDan';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is being changed
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name) errors.name = 'Name is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid Bangladeshi phone number (e.g., 01712345678)';
    }
    
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) < 100) {
      errors.amount = 'Minimum donation amount is 100 BDT';
    }
    
    if (!formData.paymentMethod) errors.paymentMethod = 'Please select a payment method';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.transactionId) {
      errors.transactionId = 'Transaction ID is required';
    } else if (formData.transactionId.length < 6) {
      errors.transactionId = 'Please enter a valid transaction ID';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep2()) {
      // In a real app, send data to backend
      console.log('Donation submitted:', formData);
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      amount: '',
      paymentMethod: '',
      transactionId: '',
    });
    setStep(1);
    setIsSubmitted(false);
  };

  const selectedPaymentMethod = paymentMethods.find(method => method.id === formData.paymentMethod);

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <SectionTitle
          title="Donate Money"
          subtitle="Your financial contributions help us organize blood donation drives and awareness campaigns"
          center
        />
        
        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="bg-success/10 p-8 rounded-lg border border-success text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-success mb-2">Thank You for Your Donation!</h3>
              <p className="mb-6">
                Your contribution of <span className="font-semibold">{formData.amount} BDT</span> has been recorded. We appreciate your support in our mission to save lives through blood donation.
              </p>
              <button 
                onClick={resetForm} 
                className="btn btn-primary"
              >
                Make Another Donation
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === 1 ? 'bg-primary text-white' : 'bg-success text-white'}`}>
                  1
                </div>
                <div className={`h-1 w-16 ${step === 1 ? 'bg-gray-300' : 'bg-success'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === 1 ? 'bg-gray-200 text-gray-600' : 'bg-primary text-white'}`}>
                  2
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Donation Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                        label="Email (Optional)"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                      />
                      
                      <FormInput
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={formErrors.phone}
                        placeholder="01712345678"
                        required
                      />
                      
                      <FormInput
                        id="amount"
                        name="amount"
                        label="Donation Amount (BDT)"
                        type="number"
                        min="100"
                        value={formData.amount}
                        onChange={handleChange}
                        error={formErrors.amount}
                        required
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Payment Method</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Payment Method
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                          <div 
                            key={method.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              formData.paymentMethod === method.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                          >
                            <div className="flex items-center mb-2">
                              <img 
                                src={method.logo} 
                                alt={method.name} 
                                className="w-8 h-8 object-contain mr-2"
                              />
                              <span className="font-medium">{method.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {formErrors.paymentMethod && (
                        <p className="mt-1 text-sm text-error">{formErrors.paymentMethod}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={handleNextStep}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Complete Your Payment</h3>
                    
                    {selectedPaymentMethod && (
                      <div className="mb-6 p-4 bg-accent rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="w-6 h-6 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold">Payment Instructions</h4>
                            <p className="text-sm text-gray-700 mb-2">
                              Please send {formData.amount} BDT to the following {selectedPaymentMethod.name} number:
                            </p>
                            <div className="flex items-center p-2 bg-white rounded border border-gray-200 mb-2">
                              <img 
                                src={selectedPaymentMethod.logo} 
                                alt={selectedPaymentMethod.name} 
                                className="w-6 h-6 object-contain mr-2"
                              />
                              <span className="font-semibold">{selectedPaymentMethod.number}</span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {selectedPaymentMethod.instructions}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <FormInput
                        id="transactionId"
                        name="transactionId"
                        label="Transaction ID"
                        type="text"
                        value={formData.transactionId}
                        onChange={handleChange}
                        error={formErrors.transactionId}
                        placeholder="Enter the transaction ID received from your payment"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                      >
                        Complete Donation
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonateMoneyPage;