// src/pages/ProductListing/components/ProductGrid.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShopCard from "../../../components/ui/ShopCard";
import { fetchProducts } from "../../../api/api";

const ProductGrid = () => {
  const { categoryKey, categoryId } = useParams(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        // ✅ Category filter अगर available है
        if (categoryKey) {
          console.log("📦 Fetching products for categoryKey:", categoryKey);
          data = await fetchProducts({ categoryKey });
        } else if (categoryId) {
          console.log("📦 Fetching products for categoryId:", categoryId);
          data = await fetchProducts({ categoryId });
        } else {
          console.log("⚠️ No category filter, loading all products...");
          data = await fetchProducts(); // fetch all
        }

        console.log("✅ Products fetched:", data);

        // backend may return { products: [...] } or just array
        setProducts(data.products || data);
      } catch (err) {
        console.error("🔥 Error fetching products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryKey, categoryId]);

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading products...</h3>;
  if (error) return <h3 style={{ color: "red", textAlign: "center" }}>{error}</h3>;

  return (
    <div className="row">
      {products.length === 0 ? (
        <h4 style={{ textAlign: "center" }}>No products found</h4>
      ) : (
        products.map((product) => (
          <div className="col-md-3 mb-3" key={product._id}>
            <ShopCard product={product} />
          </div>
        ))
      )}
    </div>
  );
};

export default ProductGrid;
