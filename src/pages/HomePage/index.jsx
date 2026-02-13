import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer'; // Assuming you create this
import CategorySlider from '../../components/ui/CategorySlider';
import FeaturedProducts from './components/FeaturedProducts';
import PromoBanner from './components/PromoBanner';
import SecondaryBanner from './components/SecondaryBanner';
import QledFeatures from './components/QledFeatures';
import AboutUs from './components/AboutUs';
import TopDealsSection from './components/TopDealsSection';
import ServicesSection from './components/ServicesSection';
import PremiumServiceCTA from './components/PremiumServiceCTA';
import TestimonialSection from './components/TestimonialSection';
import SubscriptionSection from './components/SubscriptionSection';

// import Career from './components/Carrer';
// import Press from  './components/press';
// Import other sections as you build them

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <CategorySlider />
        <PromoBanner />
        <SecondaryBanner />
        <QledFeatures />
        <FeaturedProducts />
        <AboutUs />
        <TopDealsSection />
        <ServicesSection />
        <PremiumServiceCTA />
        <TestimonialSection />
        <SubscriptionSection />
        {/* <Career />
        <Press/> */}
        {/* Add other sections here as needed */}
      </main>
      <Footer />
    </>
  );
}

export default HomePage;