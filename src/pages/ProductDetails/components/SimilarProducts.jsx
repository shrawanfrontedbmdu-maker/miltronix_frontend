import React from 'react';
import DealCard from '../../../components/ui/DealCard'; // 👈 Reusing the existing component!

const SimilarProducts = ({ products = [] }) => {
  return (
    <>
      {/* Header for the section */}
      <div className="qled-features">
        <div className="container">
          <div className="row align-items-end heading-row">
            <div>
              <h2 className="qled-title1 ff2">
                <div className="qled-top text-lg-start" style={{ position: 'relative' }}>
                  Similar Products
                </div>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable card grid */}
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

export default SimilarProducts;