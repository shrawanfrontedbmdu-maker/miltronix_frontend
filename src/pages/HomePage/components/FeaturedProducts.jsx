import React, { useEffect, useState } from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import ProductCard from "../../../components/ui/ProductCard";
import { fetchFeaturedProducts } from "../../../api/api";
import "./feturedproduct.css";

// ─── Global cache ─────────────────────────────────────────────────────────────
let featuredCache = null;

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState(featuredCache || []);
  const [loading, setLoading] = useState(!featuredCache);

  useEffect(() => {
    if (featuredCache) {
      setFeaturedProducts(featuredCache);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchFeaturedProducts();
        const data = res?.products || [];
        featuredCache = data;
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return null;
  if (!featuredProducts.length) return null;

  return (
    <section className="product-section">
      <SectionHeader
        title="Featured"
        subtitle="Products"
        description={
          <p className="make">
            Discover our most popular electronics with cutting-edge <br /> features and
            unbeatable prices
          </p>
        }
        buttonText="View All Products"
        buttonLink="/category/qled"
      />

      <div className="container">
        <div className="row g-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
