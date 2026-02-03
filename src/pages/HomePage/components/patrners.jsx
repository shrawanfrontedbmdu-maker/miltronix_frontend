import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { partnerCards } from "../../../data/mockData";

function Partners() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={
          <h2 className="qled-title ff2 mb-3">
            <div className="qled-top"></div>
            <em>Partners</em>
          </h2>
        }
        buttonText={
          <>
            Become a Partner <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/partners"
        description={
          <>
            <p>
              We collaborate with trusted partners to deliver<br />
              innovative solutions, expand global reach, and<br />
              create long-term value together.
            </p>
          </>
        }
      />

      <div className="container">
        <div className="row g-4">
          {partnerCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
