import React from 'react';

// This component is dynamic. It receives all its text content via props.
const SectionHeader = ({ title, subtitle, description, buttonText, buttonLink = '#' }) => {
  return (
    <div className="container mb-5"> {/* Added margin-bottom for spacing */}
      <div className="row align-items-end heading-row">

        {/* LEFT: Title */}
        <div className="col-md-4">
          <h2 className="qled-title ff2">
            <div className="qled-top">{title}</div>
            <em>{subtitle}</em>
          </h2>
        </div>

        {/* RIGHT: Description + Button */}
        <div className="col-md-8 d-flex justify-content-between align-items-center">
          {description && (
            <p className="qled-desc mb-0 d-none d-md-block">
              {description}
            </p>
          )}

          {buttonText && (
            <a href={buttonLink} className="btn custom-btn px-4">
              {buttonText}
            </a>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default SectionHeader;