import React from "react";
import { useNavigate } from "react-router-dom";
import DealCard from "../../../components/ui/DealCard";

const SimilarProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  // Safety: agar products empty hai, return null
  if (!products.length) return null;

  // Map products to consistent structure
  const mappedProducts = products.map((prod) => {
    const sv = prod.variants?.[0];
    const price = sv?.price ?? prod.price ?? 0;
    const mrp = sv?.compareAtPrice ?? prod.mrp ?? 0;
    const img = prod.images?.[0]?.url || prod.images?.[0] || "";

    return {
      id: prod._id || prod.id,
      title: prod.name || prod.title || "",
      price,
      oldPrice: mrp > price ? mrp : null,
      image: img,
      _raw: prod,
    };
  });

  return (
    <>
      {/* Section Header */}
      <div className="qled-features">
        <div className="container">
          <h2 className="qled-title1 ff2">
            <div className="qled-top text-lg-start" style={{ position: "relative" }}>
              Similar Products
            </div>
          </h2>
        </div>
      </div>

      {/* Product Grid */}
      <section className="product-section">
        <div className="container">
          <div className="row g-4">
            {mappedProducts.map((product) => (
              <DealCard
                key={product.id}
                deal={product}
                onClick={() => navigate(`/product-details/${product.id}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SimilarProducts;