import React from 'react';

// --- Data for the Feature Icons ---
// Place your image paths here. This makes it easy to add or remove features.
const featureIcons = [
  { src: '/src/assets/image 2.png', alt: 'Quantum Dot Technology' },
  { src: '/src/assets/image 3.png', alt: 'Direct Full Array' },
  { src: '/src/assets/image 4.png', alt: 'Quantum HDR' },
  { src: '/src/assets/image 5.png', alt: '100% Color Volume' },
  { src: '/src/assets/image 6.png', alt: 'Ultra Viewing Angle' },
  { src: '/src/assets/image 7.png', alt: 'Object Tracking Sound' },
  { src: '/src/assets/image 8.png', alt: 'Adaptive Picture' },
  { src: '/src/assets/image 9.png', alt: 'AI Upscaling' },
];

const QledFeatures = () => {
  return (
    <section className="qled-features">
      <div className="container-fluid px-4">

        {/* Heading Section */}
        <div className="row align-items-end heading-row">
          <div className="col-md-4">
            <h2 className="qled-title ff2">
              <div className="qled-top">QLED</div>
              <em>Features</em>
            </h2>
          </div>
          <div className="col-md-8">
            <p className="qled-desc d-none d-md-block">
              QLED delivers vibrant colors, deeper contrast, and brighter visuals with long-lasting <br />
              performance for an immersive viewing experience.
            </p>
          </div>
        </div>

        {/* Icons Grid: Mapped from the data array */}
        <div className="features-grid">
          {featureIcons.map((icon, index) => (
            <div key={index} className="feature-item">
              <div className="circle">
                <img src={icon.src} alt={icon.alt} />
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default QledFeatures;