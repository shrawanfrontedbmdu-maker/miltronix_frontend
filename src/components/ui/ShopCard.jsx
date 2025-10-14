import React from 'react';

const starIconFull = '/src/assets/icon 7.svg';
const starIconEmpty = '/src/assets/icon 8.svg';

const ShopCard = ({ product }) => {
  return (
    <div className="col-md-6 col-lg-6">
      <div className="shop-card text-center">
        <span className="shop-card-badge">Save {product.saveAmount}</span>
        <button className="shop-card-close-btn">&times;</button>
        <img src={product.image} alt={product.title} className="img-fluid shop-card-img" />
        <h6 className="product-category3">{product.category}</h6>
        <h5 className="product-title3">{product.title}</h5>
        <p className="product-price3">₹{product.price}</p>
        <p className="product-old-price3">₹{product.oldPrice}</p>
        <div className="product-rating2">
          <img src={starIconFull} alt="star" className="star2" />
          <img src={starIconFull} alt="star" className="star2" />
          <img src={starIconFull} alt="star" className="star2" />
          <img src={starIconFull} alt="star" className="star2" />
          <img src={starIconEmpty} alt="star" className="star2" />
          <span>{product.rating} ({product.reviews})</span>
        </div>
        <div className="d-flex justify-content-between">
          <button className="shop-card-btn-cart w-100 me-2">
            <i className="bi bi-cart"></i> Add to Cart
          </button>
          <button className="btn shop-card-btn-wishlist">
            <i className="bi bi-heart-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;