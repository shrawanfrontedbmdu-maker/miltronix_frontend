import React from "react";
import { useNavigate } from "react-router-dom";

const DealCard = ({ deal, onClick }) => {
  const navigate = useNavigate();

  // ── Support both formats ──────────────────────────────────────────
  // Format A: raw backend product  { name, images:[{url}], variants:[{price,mrp}], _id }
  // Format B: mapped deal          { title, image, price, oldPrice, id }

  const title = deal?.name || deal?.title || "Product";

  // ✅ Backend compatible id only (slug removed to avoid Product not found)
  const productId = deal?._id || deal?.id;

  // Image — raw format pehle, phir mapped format, phir placeholder
  const image =
    deal?.images?.[0]?.url ||
    (typeof deal?.images?.[0] === "string" ? deal.images[0] : null) ||
    (deal?.image && deal.image !== "" ? deal.image : null) ||
    null;

  // Variant — raw format
  const variant = deal?.variants?.find((v) => v.isActive) || deal?.variants?.[0];
  const price = variant?.price ?? deal?.price ?? 0;
  const mrp = variant?.mrp ?? deal?.oldPrice ?? 0;
  const saveAmount = mrp > price ? Math.round(mrp - price) : 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (!productId) {
      console.error("No valid product identifier found");
      return;
    }

    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        className="product-card h-100"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {saveAmount > 0 && (
          <span className="badge-save1">Save ₹{saveAmount}</span>
        )}

        {/* image null hone par render hi mat karo — browser warning fix */}
        {image ? (
          <img
            src={image}
            alt={title}
            className="product-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            className="product-img"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#dddddc",
              color: "#9a9e9d",
              fontSize: "0.75rem",
            }}
          >
            No Image
          </div>
        )}

        <div className="product-body text-center pb-3">
          <h6 className="product-category1">{title}</h6>
          <p className="product-price1">
            ₹{Number(price).toLocaleString("en-IN")}
            {mrp > price && (
              <span className="custom-span">
                ₹{Number(mrp).toLocaleString("en-IN")}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
