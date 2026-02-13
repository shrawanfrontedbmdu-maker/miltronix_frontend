import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { pressCards } from "../../../data/mockData";

function Press() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={
          <h2 className="qled-title ff2 mb-3">
            <div className="qled-top"></div>
            <em>Press</em>
          </h2>
        }
        buttonText={
          <>
            View All <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/press"
        description={
          <>
            <p>
              Stay updated with the latest news, announcements,<br />
              and media coverage from Mitronix as we continue<br />
              to innovate and grow globally.
            </p>
          </>
        }
      />

      <div className="container">
        <div className="row g-4">
          {pressCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Press;
