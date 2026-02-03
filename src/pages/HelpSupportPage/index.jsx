import React from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

// --- Data for Help & Support Page ---
const helpSupportContent = [
  {
    title: "Help & Support",
    text: "At Mitronix, we are committed to providing reliable and timely support to ensure the best experience for our customers and partners.",
  },
  {
    title: "Customer Assistance",
    text: "Get help with product usage, installation guidance, troubleshooting, and general inquiries from our dedicated support team.",
  },
  {
    title: "Technical Support",
    text: "Our technical experts are available to assist with diagnostics, maintenance, and resolution of technical issues across our product range.",
  },
  {
    title: "Warranty & Service",
    text: "Find information about product warranties, service coverage, repair processes, and after-sales support policies.",
  },
  {
    title: "Contact Support",
    text: "Reach out to us via email, phone, or support request forms. Our team is here to help you every step of the way.",
  },
];

const logoBanner = "src/assets/MILTRONIX APP DESIGN 3.png";

const HelpSupportPage = () => {
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
                <span className="hv">Help & Support</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">
                  Help & Support
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {helpSupportContent.map((section) => (
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

export default HelpSupportPage;
