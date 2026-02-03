import React from 'react';

// Define the image source
const bannerImage = '/src/assets/b.png';

const SecondaryBanner = () => {
  return (
    <section className="miltronix-banner d-flex justify-content-center align-items-center">
      <img src={bannerImage} alt="Miltronix Offer Banner" className="img-fluid miltronix-logo" />
    </section>
  );
};

export default SecondaryBanner;