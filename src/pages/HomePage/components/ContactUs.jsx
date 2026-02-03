import React from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import AboutCard from "../../../components/ui/AboutCard";
import { contactCards } from "../../../data/mockData";

function ContactUs() {
  return (
    <section className="qled-features">
      <SectionHeader
        title={
          <h2 className="qled-title ff2 mb-3">
            <div className="qled-top"></div>
            <em>Contact Us</em>
          </h2>
        }
        buttonText={
          <>
            Get in Touch <i className="bi bi-arrow-right ms-2"></i>
          </>
        }
        buttonLink="/contact-us"
        description={
          <>
            <p>
              Have questions or need assistance?<br />
              Reach out to our team for sales, support,<br />
              or general inquiries anytime.
            </p>
          </>
        }
      />

      <div className="container">
        <div className="row g-4">
          {contactCards.map((card) => (
            <AboutCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
