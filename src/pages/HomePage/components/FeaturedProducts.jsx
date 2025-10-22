import React from 'react';
import { featuredProducts } from '../../../data/mockData';
import ProductCard from '../../../components/ui/ProductCard';
import SectionHeader from '../../../components/ui/SectionHeader';

const FeaturedProducts = () => {
  return (
    <section className="product-section">
      <SectionHeader
        title="Featured"
        subtitle="Products"
        description={<>Discover our most popular electronics with cutting-edge <br /> features and unbeatable prices</>}
        buttonText="View All Products"
        buttonLink='/category/qled'
      />

      <div className="container">
        <div className="row g-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;