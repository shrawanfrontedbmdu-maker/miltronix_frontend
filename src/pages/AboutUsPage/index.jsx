import React from 'react';

// --- Reusable Components ---
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SubscriptionSection from '../HomePage/components/SubscriptionSection'; // Reusing this whole section!

// --- Data ---
const aboutUsContent = [
  {
    title: 'Our Story',
    text: "Founded in 2005, Mitronix began as a small startup with a big vision: to revolutionize the electronics industry. Over the years, we've grown into a global leader, known for our commitment to quality, innovation, and customer satisfaction. Our journey has been marked by significant milestones, including the development of groundbreaking technologies and the expansion of our product line to meet the evolving needs of our customers.",
  },
  {
    title: 'Our Mission',
    text: 'Our mission is to empower individuals and businesses with innovative electronic solutions that enhance their lives and drive progress. We strive to create products that are not only technologically advanced but also user-friendly, reliable, and sustainable. By focusing on research and development, we aim to stay ahead of the curve and continue delivering exceptional value to our customers.',
  },
  {
    title: 'Our Vision',
    text: 'Our vision is to be the leading provider of electronic solutions worldwide, recognized for our innovation, quality, and commitment to sustainability. We envision a future where our products seamlessly integrate into everyday life, making technology accessible to everyone. By fostering a culture of creativity and collaboration, we aim to inspire the next generation of innovators and shape the future of electronics.',
  },
];

const logoBanner = 'src/assets/MILTRONIX APP DESIGN 3.png';
const AboutUsPage = () => {
  return (
    <>
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
        </section>
        </div>
      <main className="main-content-padding"> {/* Use this class to add space below the fixed header */}

        {/* Breadcrumb & Title */}
        <section className="profile-container2">
          <div className="container">
            <div className="breadcrumb-bar hv">
              <div className="breadcrumb-custom hv">
                Home Page &nbsp;&gt;&nbsp;&nbsp; <span className="hv">About Us</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">About Us</h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {aboutUsContent.map((section) => (
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

export default AboutUsPage;