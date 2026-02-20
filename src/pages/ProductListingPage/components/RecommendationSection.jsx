import React from "react";
import "./RecommendationSection.css";

const RecommendationSection = ({ products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="recommend-section">
      {/* Heading */}
      <div className="recommend-heading">
        <h2>
          Our <br /> Recommendation
        </h2>
      </div>

      {/* Products */}
      <div className="recommend-container">
        <div className="recommend-grid">
          {products.map((product) => {
            const variant =
              product?.variants?.find((v) => v.hasStock) ||
              product?.variants?.[0] ||
              {};

            const price = variant?.price ?? 0;
            const oldPrice = variant?.mrp ?? 0;
            const saveAmount =
              oldPrice && price ? Math.max(oldPrice - price, 0) : 0;

            const image =
              product?.images?.[0]?.url ||
              product?.images?.[0] ||
              "/images/placeholder.png";

            return (
              <div key={product._id || product.id} className="recommend-card">
                {/* Save badge */}
                {saveAmount > 0 && (
                  <div className="save-badge">
                    Save ₹{saveAmount.toLocaleString()}
                  </div>
                )}

                {/* Image */}
                <div className="card-image">
                  <img src={image} alt={product.name} />
                </div>

                {/* Title */}
                <h3 className="card-title">
                  {product.name || "Product"}
                </h3>

                {/* Price */}
                <div className="card-price">
                  <span className="price">
                    ₹ {price.toLocaleString()}
                  </span>
                  {oldPrice > 0 && (
                    <span className="old-price">
                      ₹ {oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;