import React from 'react';

const ProductSpecs = ({ specs = [] }) => {
  return (
    <>
      <div>
        <h2 className="qled-title1 ff2 px-3">
          <div className="qled-top text-lg-start" style={{ position: 'relative' }}>
            Product Specification
          </div>
        </h2>
      </div>

      <div className="details-card">
        {/* Outer loop: Iterate over each category (e.g., "Television Category") */}
        {specs.map((section, index) => (
          <React.Fragment key={section.category}>
            <h5 className="details-heading">{section.category}</h5>
            <div className="row mb-2">
              {/* Inner loop: Iterate over the details within that category */}
              {section.details.map((detail) => (
                <div key={detail.label} className="col-md-4 col-sm-6 mb-3">
                  <div className="details-label">{detail.label}</div>
                  <div className="details-value">{detail.value}</div>
                </div>
              ))}
            </div>

            {/* Add an <hr> after each section except the last one */}
            {index < specs.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default ProductSpecs;