import React from 'react';

// --- Reusable Components ---
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SubscriptionSection from '../HomePage/components/SubscriptionSection';

// --- Data for Career Page ---
const careerContent = [
  {
    title: 'Why Work With Us',
    text: 'At Mitronix, we believe in fostering talent and providing an environment where innovation thrives. Our team enjoys challenging projects, collaborative culture, and opportunities to grow professionally.',
  },
  {
    title: 'Our Culture',
    text: 'We value creativity, teamwork, and continuous learning. Employees are encouraged to share ideas, experiment with new technologies, and contribute to meaningful projects that impact our global customers.',
  },
  {
    title: 'Open Positions',
    text: 'Explore our current openings and find a role that matches your skills and passion. We offer positions in engineering, design, marketing, sales, and more.',
  },
];

const logoBanner = 'src/assets/MILTRONIX APP DESIGN 3.png';

const CareerPage = () => {
  return (
    <>
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
        </section>
      </div>

      <main className="main-content-padding">
        {/* Breadcrumb & Title */}
        <section className="profile-container2">
          <div className="container">
            <div className="breadcrumb-bar hv">
              <div className="breadcrumb-custom hv">
                Home Page &nbsp;&gt;&nbsp;&nbsp; <span className="hv">Career</span>
                <h2 className="ff2 see-more privacy-policy fw-ssemibold">Career</h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="profile-container1">
          <div className="container my-5 oc-privacy">
            <div className="row justify-content-center">
              {careerContent.map((section) => (
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

export default CareerPage;
