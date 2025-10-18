import React from 'react';
import SectionHeader from '../../../components/ui/SectionHeader'; // Reusing our generic header

const PageHeader = ({ title, subtitle, description }) => {
  return (
    <section className="qled-features1">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        description={description}
      />
    </section>
  );
};

export default PageHeader;