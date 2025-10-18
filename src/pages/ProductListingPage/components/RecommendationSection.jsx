import React from 'react';
import DealCard from '../../../components/ui/DealCard';
// import { productData } from '../../../data/mockData';

const RecommendationSection = ({ products = [] }) => {
  return (
    <>
      <div className="qled-features">
        <div className="container">
          <h2 className="qled-title1 ff2">
            <div className="qled-top" style={{ position: 'relative' }}>Our</div>
            <em style={{ position: 'relative', top: '-2px' }}>Recommendation</em>
          </h2>
        </div>
      </div>
      <section className="product-section">
        <div className="container">
          <div className="row g-4">
            {products.map((product) => (
              <DealCard key={product.id} deal={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecommendationSection;