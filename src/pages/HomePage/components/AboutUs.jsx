import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { aboutCards } from "../../../data/mockData";

function AboutUs() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={<h2 className="qled-title ff2 mb-3">
          <div className="qled-top"></div>
          <em>About Us</em>
        </h2>}
        buttonText={
          <>
            Learn More <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/about-us"
        description={<><p>We are committed to delivering high-quality products and<br />reliable services that bring value, innovation, and trust to every<br />customer we serve.</p></>}
      />

      <div className="container">
        <div className="row g-4">
          {aboutCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
