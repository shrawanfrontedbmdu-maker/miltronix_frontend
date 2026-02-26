import React from "react";
import { useNavigate } from "react-router-dom";

const DealCard = ({ deal }) => {
  const navigate = useNavigate();

  // Backend product fields se data nikalo
  const title      = deal?.name || "Product";
  const slug       = deal?.slug || deal?._id;
  const image      = deal?.images?.[0]?.url || "";
  const alt        = deal?.images?.[0]?.alt || title;

  // Pehle active variant lo, warna pehla variant
  const variant    = deal?.variants?.find(v => v.isActive) || deal?.variants?.[0];
  const price      = variant?.price || 0;
  const mrp        = variant?.mrp || 0;
  const saveAmount = mrp > price ? Math.round(mrp - price) : 0;

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        className="product-card h-100"
        onClick={() => navigate(`/product/${slug}`)}
        style={{ cursor: "pointer" }}
      >
        {saveAmount > 0 && (
          <span className="badge-save1">Save ₹{saveAmount}</span>
        )}

        <img src={image} alt={alt} className="product-img" />

        <div className="product-body text-center pb-3">
          <h6 className="product-category1">{title}</h6>
          <p className="product-price1">
            ₹{price.toLocaleString("en-IN")}
            {mrp > price && (
              <span className="custom-span"> ₹{mrp.toLocaleString("en-IN")}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealCard;