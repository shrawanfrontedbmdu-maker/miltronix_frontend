import React from 'react';

const ProductInfo = ({ product = {} }) => {
  return (
    <div className="col-12 col-lg-6">
      <h4 className="product-title-new mb-3 mt-2">
        {product.title} - {product.description}
      </h4>

      <div className="product-price mb-2">
        <span className="fw-bold display-6 price-new me-3">₹{product.price}</span>
        <span className="text-decoration-line-through h5 old-price-2">MRP ₹{product.oldPrice}</span>
      </div>
      <p className="text-muted mb-3">(Incl. of all taxes)</p>

      <span className="badge new-model mb-3 px-3 py-2">New Model</span>

      <ul className="list-unstyled mb-4 product-features">
        <li>EMI Starting from ₹5000/month for 24 months</li>
        <li>Free Delivery by Tomorrow</li>
        <li>Discount up to 30%</li>
        <li>New Stock</li>
      </ul>

      <div className="d-flex gap-3">
        <button className="btn shop-card-btn-wishlist">
          <i className="bi bi-heart"></i>
        </button>
        <button className="shop-card-btn-cart w-50 me-2">
          <i className="bi bi-cart"></i> Add to Cart
        </button>
        <button className="shop-card-btn-cart w-50 me-2">
          <i className="bi bi-cart"></i> Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;