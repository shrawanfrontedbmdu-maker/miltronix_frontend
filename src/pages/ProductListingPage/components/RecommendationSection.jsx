import React from "react";
import DealCard from "../../../components/ui/DealCard";

const RecommendationSection = ({ products = [] }) => {
  if (!products || products.length === 0) return null; // hide section if empty

  return (
    <>
      <div className="recommendation-header py-4 bg-light">
        <div className="container text-center">
          <h2 className="ff2">
            <span style={{ display: "block" }}>Our</span>
            <em style={{ display: "block", marginTop: "-4px" }}>Recommendations</em>
          </h2>
        </div>
      </div>

      <section className="product-section py-4">
        <div className="container">
          <div className="row g-4">
            {products.map((product) => (
              <DealCard
                key={product.id || product._id}
                deal={{
                  title: product.title,
                  image: product.image,
                  link: product.link || "#",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecommendationSection;
