// src/pages/products/components/ProductGrid.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "../../../components/ui/ProductCard";

const ProductGrid = ({ products = [], onCartUpdate, pageSize = 12, searchQuery = "", filter = {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ===== Filter & Search =====
  useEffect(() => {
    let temp = [...products];

    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      temp = temp.filter((p) => regex.test(p.title) || regex.test(p.description));
    }

    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (filter[key] !== undefined && filter[key] !== "") {
          temp = temp.filter((p) => p[key] === filter[key]);
        }
      });
    }

    setFilteredProducts(temp);
    setCurrentPage(1);
  }, [products, searchQuery, filter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!products || products.length === 0)
    return <div style={{ padding: "2rem", textAlign: "center" }}>No products found</div>;

  return (
    <div>
      <div className="row g-4">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product._id || product.id || product.title}
            product={product}
            categoryKey={product.categoryKey}
            onCartUpdate={onCartUpdate}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination d-flex justify-content-center align-items-center mt-4">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
