import React from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

// --- Data for Partners Page ---
const partnersContent = [
  {
    title: "Our Partners",
    text: "At Mitronix, we collaborate with trusted partners worldwide to deliver innovative, scalable, and high-quality technology solutions.",
  },
  {
    title: "Technology Partnerships",
    text: "We work closely with leading technology providers to integrate advanced solutions that enhance performance, reliability, and customer experience.",
  },
  {
    title: "Channel & Strategic Partners",
    text: "Our channel and strategic partners help us expand our reach, strengthen market presence, and create long-term value for customers and stakeholders.",
  },
];

const logoBanner = "src/assets/MILTRONIX APP DESIGN 3.png";

const PartnersPage = () => {
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
                Home Page &nbsp;&gt;&nbsp;&nbsp;{" "}
                <span className="hv">Partners</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">
                  Partners
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {partnersContent.map((section) => (
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

export default PartnersPage;
