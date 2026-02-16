// src/components/ui/ShopCard.jsx
import React, { useState } from "react";
import { addItemToCart, getCartItems } from "../../api/api";
import { useNavigate } from "react-router-dom";

const starIconFull = "/src/assets/icon 7.svg";
const starIconHalf = "/src/assets/icon 9.svg";
const starIconEmpty = "/src/assets/icon 8.svg";

const ShopCard = ({ product, onCartUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const navigate = useNavigate();

  if (!product) return null;

  // ===== IMAGE =====
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "/images/placeholder.png";

  // ===== CATEGORY NAME =====
  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.pageTitle || product.category.categoryKey || "Uncategorized"
      : "Uncategorized";

  // ===== PRICE (from first variant) =====
  const price =
    product.variants && product.variants.length > 0
      ? product.variants[0].price
      : 0;

  // ===== OLD PRICE (MRP or compare price) =====
  const oldPrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].compareAtPrice || price + 5000
      : price + 5000;

  // ===== SAVE AMOUNT =====
  const saveAmount = oldPrice - price;

  // ===== RATING =====
  const rating = Math.min(5, product.avgRating || 0);
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  // ===== REVIEWS COUNT =====
  const reviews = product.reviewCount || 0;

  // ===== STOCK CHECK =====
  const hasStock =
    product.variants && product.variants.length > 0
      ? product.variants[0].hasStock
      : false;

  const handleAddToCart = async () => {
    if (!product._id) return alert("Product ID not found");

    if (!product.variants || product.variants.length === 0) {
      return alert("Product has no variants available");
    }

    setLoading(true);
    try {
      await addItemToCart({
        productId: product._id,
        quantity: 1,
        variantSku: product.variants[0].sku,
      });

      setAdded(true);

      if (onCartUpdate) {
        const updatedCart = await getCartItems();
        onCartUpdate(updatedCart);
      }

      setTimeout(() => {
        navigate("/cart");
      }, 500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert(error.message || "Failed to add item to cart");
      setAdded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="shop-card text-center">
        {/* SAVE BADGE */}
        {saveAmount > 0 && (
          <span className="shop-card-badge">Save ₹{saveAmount.toLocaleString()}</span>
        )}

        {/* IMAGE */}
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="img-fluid shop-card-img"
          onClick={() => navigate(`/product/${product._id}`)}
          style={{ cursor: "pointer" }}
        />

        {/* CATEGORY */}
        <h6 className="product-category2">{categoryName}</h6>

        {/* TITLE */}
        <h5
          className="product-title2"
          onClick={() => navigate(`/product/${product._id}`)}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </h5>

        {/* PRICE */}
        <p className="product-price2">₹{price.toLocaleString()}</p>

        {/* OLD PRICE */}
        {oldPrice > price && (
          <p className="product-old-price2">₹{oldPrice.toLocaleString()}</p>
        )}

        {/* RATING */}
        <div className="product-rating1">
          {[...Array(fullStars)].map((_, i) => (
            <img key={`full-${i}`} src={starIconFull} alt="star" className="star1" />
          ))}

          {halfStar && <img src={starIconHalf} alt="half-star" className="star1" />}

          {[...Array(emptyStars)].map((_, i) => (
            <img key={`empty-${i}`} src={starIconEmpty} alt="star" className="star1" />
          ))}

          <span>
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>

        {/* BUTTONS */}
        <div className="d-flex justify-content-between">
          <button
            className={`shop-card-btn-cart w-75 ${added ? "btn-success" : ""}`}
            onClick={handleAddToCart}
            disabled={loading || added || !hasStock}
          >
            {loading ? (
              "Adding..."
            ) : added ? (
              "Added"
            ) : !hasStock ? (
              "Out of Stock"
            ) : (
              <>
                <i className="bi bi-cart"></i> Add to Cart
              </>
            )}
          </button>

          <button
            className="btn shop-card-btn-wishlist"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Add to wishlist:", product._id);
            }}
          >
            <i className="bi bi-heart-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;