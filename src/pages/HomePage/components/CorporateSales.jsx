import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { corporateSalesCards } from "../../../data/mockData";

function CorporateSales() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={
          <h2 className="qled-title ff2 mb-3">
            <div className="qled-top"></div>
            <em>Corporate Sales</em>
          </h2>
        }
        buttonText={
          <>
            Contact Sales <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/corporate-sales"
        description={
          <>
            <p>
              Tailored enterprise solutions designed to meet<br />
              large-scale business requirements with reliability,<br />
              innovation, and dedicated support.
            </p>
          </>
        }
      />

      <div className="container">
        <div className="row g-4">
          {corporateSalesCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CorporateSales;
