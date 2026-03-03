import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";

const PageHeader = ({ title, subtitle, description }) => {
  // Fallback values agar backend me missing ho
  const finalTitle = title || "Category";
  const finalSubtitle = subtitle || "";
  const finalDescription = description || "";

  return (
    <section className="page-header-section py-4">
      <div className="container">
        <SectionHeader
          title={finalTitle}
          subtitle={finalSubtitle}
          description={finalDescription}
        />
      </div>
    </section>
  );
};

export default PageHeader;
