import React from 'react';
import { businessServices } from '../../../data/mockData'; // Import the new data

const ServicesSection = () => {
  return (
    // Use a React Fragment to group the sections
    <>
      {/* Header Section */}
      <div className="qled-features">
        <div className="container">
          <div className="row align-items-end heading-row">
            <div className="col-md-6">
              <h2 className="qled-title2 ff2">
                <div className="qled-top" style={{ position: 'relative' }}>
                  Services Built
                </div>
                <em style={{ position: 'relative', top: '-2px' }}>
                  Specifically for Your Business
                </em>
              </h2>
            </div>
            <div className="col-md-6 d-flex justify-content-between align-items-end">
              <p className="qled-desc mb-0 d-none d-md-block">
                We understand that your business needs more than just <br />
                products. Our comprehensive service ecosystem is <br />
                designed to support your success at every step.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Icon Grid Section */}
      <section className="services-section">
        <div className="container px-5">
          <div className="row text-center g-1">
            {/* Map over the services data to render each item */}
            {businessServices.map((service) => (
              <div key={service.label} className="col-6 col-md-3">
                <div className="service-item">
                  <div className="service-icon">
                    <img src={service.icon} alt={service.alt} />
                  </div>
                  <p className="service-text">{service.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;