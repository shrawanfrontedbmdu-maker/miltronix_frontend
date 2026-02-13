import React from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

// --- Data for Corporate Sales Page ---
const corporateSalesContent = [
  {
    title: "Corporate Sales",
    text: "Mitronix provides tailored corporate and enterprise sales solutions designed to meet large-scale business requirements with efficiency and reliability.",
  },
  {
    title: "Enterprise Solutions",
    text: "We offer customized technology solutions for enterprises, institutions, and organizations across multiple industries.",
  },
  {
    title: "Bulk & Project Procurement",
    text: "Our corporate sales team specializes in bulk orders and project-based procurement with competitive pricing and assured quality.",
  },
  {
    title: "Dedicated Account Management",
    text: "Corporate clients receive dedicated relationship managers, priority support, and end-to-end assistance throughout the engagement.",
  },
];

const logoBanner = "src/assets/MILTRONIX APP DESIGN 3.png";

const CorporateSalesPage = () => {
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
                <span className="hv">Corporate Sales</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">
                  Corporate Sales
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {corporateSalesContent.map((section) => (
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

export default CorporateSalesPage;
