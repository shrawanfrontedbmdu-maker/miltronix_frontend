import React from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

// --- Data for Investor Relations Page ---
const investorRelationsContent = [
  {
    title: "Investor Relations",
    text: "Mitronix is committed to maintaining transparency, integrity, and long-term value creation for our investors and stakeholders.",
  },
  {
    title: "Financial Performance",
    text: "Access key financial highlights, annual reports, and performance insights that reflect our steady growth and strong market position.",
  },
  {
    title: "Corporate Governance",
    text: "We follow robust corporate governance practices to ensure accountability, ethical conduct, and sustainable business operations.",
  },
  {
    title: "Investor Updates",
    text: "Stay informed with the latest investor announcements, regulatory disclosures, and strategic developments from Mitronix.",
  },
];

const logoBanner = "src/assets/MILTRONIX APP DESIGN 3.png";

const InvestorRelationsPage = () => {
  return (
    <>
      {/* Banner */}
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <img
            src={logoBanner}
            alt="Miltronix Logo"
            className="img-fluid miltronix-logo"
          />
        </section>
      </div>

      <main className="main-content-padding">
        {/* Breadcrumb & Title */}
        <section className="profile-container2">
          <div className="container">
            <div className="breadcrumb-bar hv">
              <div className="breadcrumb-custom hv">
                Home Page &nbsp;&gt;&nbsp;&nbsp;
                <span className="hv">Investor Relations</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">
                  Investor Relations
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {investorRelationsContent.map((section) => (
                <div key={section.title} className="oc-privacy-block mb-4">
                  <h5 className="oc-privacy-title hv">{section.title}</h5>
                  <p className="oc-privacy-text hv">{section.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reusable Subscription Section */}
        <SubscriptionSection />
      </main>

      <Footer />
    </>
  );
};

export default InvestorRelationsPage;
