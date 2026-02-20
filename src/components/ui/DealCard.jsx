import React from "react";
import { useNavigate } from "react-router-dom";

const DealCard = ({ deal }) => {
  const navigate = useNavigate();

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        className="product-card h-100"
        onClick={() => navigate(deal.link)}
        style={{ cursor: "pointer" }}
      >
        {deal.saveAmount > 0 && (
          <span className="badge-save1">Save ₹{deal.saveAmount}</span>
        )}

        <img src={deal.image} alt={deal.title} className="product-img" />

        <div className="product-body text-center pb-3">
          <h6 className="product-category1">{deal.title}</h6>
          <p className="product-price1">
            ₹ {deal.price}
            <span className="custom-span"> ₹ {deal.oldPrice}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealCard;