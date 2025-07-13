import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

interface OnboardingData {
  businessName: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export default function MerchantOnboarding() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    businessName: '',
    description: '',
    address: '',
    city: 'Doha',
    phone: '',
    email: user?.emailAddresses[0]?.emailAddress || '',
  });

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // TODO: Submit to Supabase
    console.log('Submitting merchant data:', formData);
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Welcome to Relaxify</h1>
        <p>Let's set up your spa or salon profile</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <span className="step-indicator">Step {step} of 3</span>
      </div>

      <div className="onboarding-content">
        {step === 1 && (
          <div className="step-content">
            <h2>Business Information</h2>
            <div className="form-group">
              <label htmlFor="businessName">Business Name *</label>
              <input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter your spa or salon name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell customers about your services and what makes you special"
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Location & Contact</h2>
            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              >
                <option value="Doha">Doha</option>
                <option value="Al Rayyan">Al Rayyan</option>
                <option value="Al Wakrah">Al Wakrah</option>
                <option value="Umm Salal">Umm Salal</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+974 XXXX XXXX"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Review & Confirm</h2>
            <div className="review-section">
              <div className="review-item">
                <strong>Business Name:</strong> {formData.businessName}
              </div>
              <div className="review-item">
                <strong>Description:</strong> {formData.description || 'Not provided'}
              </div>
              <div className="review-item">
                <strong>Address:</strong> {formData.address}, {formData.city}
              </div>
              <div className="review-item">
                <strong>Phone:</strong> {formData.phone}
              </div>
              <div className="review-item">
                <strong>Email:</strong> {formData.email}
              </div>
            </div>
            <div className="terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to Relaxify's Terms of Service and Privacy Policy
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="onboarding-actions">
        {step > 1 && (
          <button className="btn-secondary" onClick={handlePrevious}>
            Previous
          </button>
        )}
        {step < 3 ? (
          <button 
            className="btn-primary" 
            onClick={handleNext}
            disabled={!formData.businessName || (step === 2 && (!formData.address || !formData.phone))}
          >
            Next
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
          >
            Create My Profile
          </button>
        )}
      </div>
    </div>
  );
}