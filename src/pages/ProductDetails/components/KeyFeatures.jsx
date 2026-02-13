import React from 'react';

const KeyFeatures = ({ features = [] }) => {
  return (
    <section className="key-features-section py-5">
      <div className="container">
        <h3 className="key-features-title mb-4">
          <span className="fw-light ff2">Key</span>{' '}
          <em className="ff2" style={{ fontStyle: 'italic' }}>Features</em>
        </h3>

        <ul className="key-features-list list-unstyled">
          {features.map((feature, index) => {
            // Split the string at the first colon to separate the label from the value
            const parts = feature.split(/:(.*)/s);
            const label = parts[0];
            const value = parts[1];

            return (
              <li key={index} className="hv">
                <strong>{label}:</strong>{value}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default KeyFeatures;