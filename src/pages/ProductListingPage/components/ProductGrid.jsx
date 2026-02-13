import React from "react";
import ShopCard from "../../../components/ui/ShopCard";

const ProductGrid = ({ products = [] }) => {
  if (!products || products.length === 0)
    return <div style={{ padding: "2rem", textAlign: "center" }}>No products found</div>;

  return (
    <div className="row g-4">
      {products.map((product) => (
        <ShopCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;