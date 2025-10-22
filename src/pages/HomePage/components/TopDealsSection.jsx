import React from 'react';
import { qledDeals } from '../../../data/mockData';
import DealCard from '../../../components/ui/DealCard';
// We don't need the SectionHeader for this specific layout, we can define it locally.

const TopDealsSection = () => {
  return (
    <>
      {/* Top QLED Deals Header */}
      <div className="qled-features">
        <div className="container">
          <div className="row align-items-end heading-row">
            <div className="col-md-4">
              <h2 className="qled-title1 ff2" style={{ position: 'relative' }}>
                <div className="qled-top">Top QLED</div>
                <em style={{ top: '-2px' }}>Deals</em>
              </h2>
            </div>
            <div className="col-md-8 d-flex justify-content-between align-items-end">
              <p className="qled-desc mb-0 d-none d-md-block">
                Discover our best-selling QLED TVs at unbeatable prices. Enjoy <br />
                stunning picture quality, vibrant colors, and the latest technology—all <br />
                with exclusive discounts you won't want to miss.
              </p>
              <a href="/category/qled" className="btn custom-btn px-4">
                View All Products
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <section className="product-section">
        <div className="container">
          <div className="row g-4">
            {qledDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TopDealsSection;