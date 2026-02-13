import React from 'react';

const PremiumServiceCTA = () => {
  return (
    <section className="premium-section d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 text-center pt-4 pt-md-0 col-md-10">
            {/* HEADING */}
            <h1 className="premium-title ff2">
              Ready to experience <span className="premium-highlight">Premium Service?</span>
            </h1>

            {/* SUBTEXT */}
            <p className="premium-subtext hv">
              Join over 500,000 satisfied customers who trust us <br />
              with their technology needs.
            </p>

            {/* BUTTONS */}
            <div className="premium-buttons mb-3 mb-md-3">
              <a href="#" className="btn btn-light me-3 mb-3 mb-md-3">Get Started Today</a>
              <a href="#" className="btn btn-light mb-3 mb-md-3">Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumServiceCTA;