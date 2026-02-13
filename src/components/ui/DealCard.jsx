import React from 'react';

// This component receives a single 'deal' object as a prop
const DealCard = ({ deal }) => {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="product-card h-70">
        <span className="badge-save1">Save {deal.saveAmount}</span>
        <img src={deal.image} className="product-img" alt={deal.title} />
        <div className="product-body text-center pb-3">
          <h6 className="product-category1">{deal.title}</h6>
          <p className="product-price1">
            ₹ {deal.price}
            <span className="custom-span">
              ₹ {deal.oldPrice}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealCard;