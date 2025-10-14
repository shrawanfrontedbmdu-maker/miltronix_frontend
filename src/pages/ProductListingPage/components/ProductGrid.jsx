import React from 'react';
import ShopCard from '../../../components/ui/ShopCard';

const ProductGrid = ({ products = [] }) => {
  return (
    <div className=" row g-4">
      {products.length > 0 ? (
        products.map(product => (
          <ShopCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products match your filters.</p>
      )}
    </div>
  );
};

export default ProductGrid;