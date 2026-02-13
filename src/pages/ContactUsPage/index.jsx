import React from "react";

// --- Reusable Components ---
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";

// --- Data for Contact Us Page ---
const contactUsContent = [
  {
    title: "Get in Touch",
    text: "We would love to hear from you. Reach out to us for product inquiries, support, partnerships, or any general questions.",
  },
  {
    title: "Corporate Office",
    text: "Mitronix Electronics Pvt. Ltd.\n123 Business Park,\nNew Delhi, India",
  },
  {
    title: "Contact Information",
    text: "Phone: +91 98765 43210\nEmail: support@mitronix.com",
  },
  {
    title: "Business Hours",
    text: "Monday – Friday: 9:30 AM – 6:30 PM\nSaturday: 10:00 AM – 4:00 PM",
  },
];

const logoBanner = "src/assets/MILTRONIX APP DESIGN 3.png";

const ContactUsPage = () => {
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
                <span className="hv">Contact Us</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">
                  Contact Us
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {contactUsContent.map((section) => (
                <div key={section.title} className="oc-privacy-block mb-4">
                  <h5 className="oc-privacy-title hv">{section.title}</h5>
                  <p className="oc-privacy-text hv" style={{ whiteSpace: "pre-line" }}>
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="profile-container1">
          <div className="container my-5">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <h5 className="oc-privacy-title hv mb-3">Send Us a Message</h5>

                <form className="contact-form">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Your Name"
                  />
                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Your Email"
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Subject"
                  />
                  <textarea
                    className="form-control mb-3"
                    rows="4"
                    placeholder="Your Message"
                  ></textarea>

                  <button className="btn btn-dark px-4">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription */}
        <SubscriptionSection />
      </main>

      <Footer />
    </>
  );
};

export default ContactUsPage;
