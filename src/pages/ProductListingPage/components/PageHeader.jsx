import React from 'react';
import SectionHeader from '../../../components/ui/SectionHeader'; // Reusing our generic header

const PageHeader = () => {
  return (
    <section className="qled-features1">
      <SectionHeader
        title="QLED"
        subtitle="Television"
        description={
          <>
            QLED delivers vibrant colors, deeper contrast, and brighter visuals with long-lasting <br />
            performance for an immersive viewing experience.
          </>
        }
        // By not providing the 'buttonText' prop, the button will not be rendered.
      />
    </section>
  );
};

export default PageHeader;