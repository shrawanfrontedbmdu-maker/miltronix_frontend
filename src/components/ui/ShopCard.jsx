// src/components/ui/ShopCard.jsx
import React, { useState } from "react";
import { addItemToCart, getCartItems } from "../../api/api";

const BACKEND_URL = "http://localhost:3000";
const starIconFull = "/assets/icon7.svg";
const starIconHalf = "/assets/icon9.svg";
const starIconEmpty = "/assets/icon8.svg";

const ShopCard = ({ product, onCartUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const rating = Math.min(5, product.rating || 0);
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const imageUrl = product.image
    ? `${BACKEND_URL}${product.image}`
    : `${BACKEND_URL}/images/placeholder.png`;

  const categoryName = product.category || product.categoryKey || "";
  const saveAmount = product.saveAmount ? Number(product.saveAmount) : null;

  const handleAddToCart = async () => {
    if (!product._id || !categoryName) return alert("Product ID or Category not found");

    setLoading(true);
    try {
      await addItemToCart({
        productId: product._id,
        categoryKey: categoryName,
        quantity: 1,
        variant: product.variant || {},
      });

      setAdded(true);

      if (onCartUpdate) {
        const updatedCart = await getCartItems();
        onCartUpdate(updatedCart);
      }

      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="shop-card text-center position-relative">
        {saveAmount && <span className="shop-card-badge">Save ₹{saveAmount.toLocaleString()}</span>}

        <img
          src={imageUrl}
          alt={product.title || "Product"}
          className="img-fluid shop-card-img"
          onError={(e) => (e.currentTarget.src = `${BACKEND_URL}/images/placeholder.png`)}
        />

        <h6 className="product-category2">{categoryName}</h6>
        <h5 className="product-title2">{product.title || "Product"}</h5>
        <p className="product-price2">₹{product.price || 0}</p>
        {product.oldPrice && <p className="product-old-price2">₹{product.oldPrice.toLocaleString()}</p>}

        <div className="product-rating1 d-flex align-items-center justify-content-center gap-1">
          {[...Array(fullStars)].map((_, i) => <img key={`full-${i}`} src={starIconFull} alt="star" className="star1" />)}
          {halfStar && <img src={starIconHalf} alt="half-star" className="star1" />}
          {[...Array(emptyStars)].map((_, i) => <img key={`empty-${i}`} src={starIconEmpty} alt="star" className="star1" />)}
          <span>{rating.toFixed(1)} ({product.reviews || 0})</span>
        </div>

        <div className="d-flex justify-content-between mt-2">
          <button
            className={`shop-card-btn-cart w-75 ${added ? "btn-success" : ""}`}
            onClick={handleAddToCart}
            disabled={loading || added}
          >
            {loading ? "Adding..." : added ? "Added" : "Add to Cart"}
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
