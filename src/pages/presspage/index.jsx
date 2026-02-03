import React from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

// --- Data for Press Page ---
const pressContent = [
  {
    title: "Press & Media",
    text: "Stay updated with the latest news, announcements, and media coverage about Mitronix. We actively engage with the press to share our innovations and milestones.",
  },
  {
    title: "Latest News",
    text: "Discover our most recent product launches, partnerships, achievements, and company updates that reflect our growth and commitment to innovation.",
  },
  {
    title: "Media Resources",
    text: "Access official logos, brand assets, press releases, and media kits. For press inquiries, journalists can connect directly with our communications team.",
  },
];

const logoBanner = "src/assets/MILTRONIX APP DESIGN 3.png";

const PressPage = () => {
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
                Home Page &nbsp;&gt;&nbsp;&nbsp; <span className="hv">Press</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">
                  Press
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {pressContent.map((section) => (
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

export default PressPage;
