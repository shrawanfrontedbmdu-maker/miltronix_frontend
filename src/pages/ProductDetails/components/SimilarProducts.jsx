import React from "react";
import { useNavigate } from "react-router-dom";
import DealCard from "../../../components/ui/DealCard";

const SimilarProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  // ── Robust mapping — backend ke saare possible fields handle karta hai ──
  const mappedProducts = products.map((prod) => {
    const variant = prod.variants?.[0];

    // price — variant.price > prod.price > 0
    const price =
      Number(variant?.price ?? prod.price ?? prod.variants?.[0]?.price ?? 0);

    // mrp — variant.mrp > variant.compareAtPrice > prod.mrp > price
    const mrp =
      Number(
        variant?.mrp ??
        variant?.compareAtPrice ??
        prod.mrp ??
        prod.cutPrice ??
        0
      );

    // image — images[0].url > images[0] (string) > ""
    const img =
      prod.images?.[0]?.url ||
      (typeof prod.images?.[0] === "string" ? prod.images[0] : "") ||
      "";

    return {
      id: prod._id || prod.id,
      title: prod.name || prod.title || "Product",
      price,
      oldPrice: mrp > price ? mrp : null,
      image: img,
      category: prod.category?.name || prod.category || "",
      _raw: prod,
    };
  });

  return (
    <>
      {/* Section Header */}
      <div className="qled-features" style={{ width: "100%" }}>
        <div className="container">
          <h2 className="qled-title1 ff2">
            <span className="qled-top text-lg-start">Similar Products</span>
          </h2>
        </div>
      </div>

      {/* Product Grid */}
      <section className="product-section" style={{ width: "100%" }}>
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