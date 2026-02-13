import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { investorCards } from "../../../data/mockData";

function InvestorRelations() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={
          <h2 className="qled-title ff2 mb-3">
            <div className="qled-top"></div>
            <em>Investor Relations</em>
          </h2>
        }
        buttonText={
          <>
            View Details <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/investor-relations"
        description={
          <>
            <p>
              We are committed to transparency, strong governance,<br />
              and delivering long-term value to our investors<br />
              and stakeholders.
            </p>
          </>
        }
      />

      <div className="container">
        <div className="row g-4">
          {investorCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default InvestorRelations;
