import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { helpSupportCards } from "../../../data/mockData";

function HelpSupport() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={
          <h2 className="qled-title ff2 mb-3">
            <div className="qled-top"></div>
            <em>Help & Support</em>
          </h2>
        }
        buttonText={
          <>
            Get Help <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/help-support"
        description={
          <>
            <p>
              We are here to assist you with product support,<br />
              technical guidance, and after-sales services to<br />
              ensure a smooth experience.
            </p>
          </>
        }
      />

      <div className="container">
        <div className="row g-4">
          {helpSupportCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HelpSupport;
