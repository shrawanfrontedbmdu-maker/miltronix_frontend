import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { careerCards } from "../../../data/mockData";

function Career() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={
          <h2 className="qled-title ff2 mb-3">
            <div className="qled-top"></div>
            <em>Careers</em>
          </h2>
        }
        buttonText={
          <>
            View Openings <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/careers"
        description={
          <>
            <p>
              Join our team and build a career where innovation,<br />
              growth, and collaboration come together to create<br />
              meaningful impact.
            </p>
          </>
        }
      />

      <div className="container">
        <div className="row g-4">
          {careerCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Career;
