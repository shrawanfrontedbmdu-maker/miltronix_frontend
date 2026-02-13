import React, { useState } from 'react';
import { subscriptionFeatures } from '../../../data/mockData'; // Import the new data

const SubscriptionSection = () => {
  // State to manage the email input
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the page from reloading on submit
    alert(`Thank you for subscribing with: ${email}`);
    setEmail(''); // Clear the input after submission
  };

  return (
    <section className="subscription-section">
      <div className="container">
        {/* Top Row: Title & Form */}
        <div className="row align-items-center mb-5">
          <div className="col-md-7 mb-4 mb-md-0 text-center text-md-start">
            <h2 className="subscription-title ff2">
              Stay Updated with <em>Latest Deals</em>
            </h2>
          </div>
          <div className="col-md-5">
            <form
              onSubmit={handleSubmit}
              className="d-flex flex-column flex-md-row gap-2"
            >
              <input
                type="email"
                className="subscription-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="subscription-btn">
                Subscribe
              </button>
            </form>
            <p className="disclaimer">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>

        {/* Bottom Row: Features */}
        <div className="row text-center text-md-end testimonial-row">
          {subscriptionFeatures.map((feature) => (
            <div key={feature.title} className="col-md-4 mb-4">
              <div className="row g-3 align-items-start">
                <div className="col-md-2">
                  <div className="feature-icon">
                    <img src={feature.icon} alt={feature.alt} />
                  </div>
                </div>
                <div className="col-md-10 text-start px-4">
                  <h5 className="feature-title ff2">{feature.title}</h5>
                  <p className="feature-text hv">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;