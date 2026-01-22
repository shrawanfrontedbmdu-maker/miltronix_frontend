import React, { useState } from "react";
import {
  addItemToCart, // our API function
  getCartItems,
} from "../../api/api"; // make sure path is correct

const starIconFull = "/src/assets/icon7.svg";
const starIconEmpty = "/src/assets/icon8.svg";

const ShopCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  const imageUrl = product.image || "/src/assets/placeholder.png";
  const categoryName = product.category || product.categoryKey || "";
  const saveAmount = product.saveAmount ? Number(product.saveAmount) : null;

  // ---------------- Add to Cart Handler ----------------
  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addItemToCart({
        productId: product.id,
        quantity: 1,
        price: product.price,
      });
      setAdded(true);
      // Optional: refresh cart or show toast
      const cart = await getCartItems();
      console.log("Updated Cart:", cart);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="shop-card text-center position-relative">
        {saveAmount && (
          <span className="shop-card-badge">
            Save ₹{saveAmount.toLocaleString()}
          </span>
        )}

        <img
          src={imageUrl}
          alt={product.title || "Product"}
          className="img-fluid shop-card-img"
        />

        <h6 className="product-category2">{categoryName}</h6>
        <h5 className="product-title2">{product.title || "Product"}</h5>
        <p className="product-price2">₹{product.price?.toLocaleString() || 0}</p>
        {product.oldPrice && (
          <p className="product-old-price2">₹{product.oldPrice?.toLocaleString()}</p>
        )}

        <div className="product-rating1 d-flex align-items-center justify-content-center gap-1">
          {[...Array(fullStars)].map((_, i) => (
            <img key={`full-${i}`} src={starIconFull} alt="star" className="star1" />
          ))}
          {[...Array(emptyStars)].map((_, i) => (
            <img key={`empty-${i}`} src={starIconEmpty} alt="star" className="star1" />
          ))}
          <span>{rating} ({product.reviews || 0})</span>
        </div>

        <div className="d-flex justify-content-between mt-2">
          <button
            className={`shop-card-btn-cart w-75 ${added ? "btn-success" : ""}`}
            onClick={handleAddToCart}
            disabled={loading || added}
          >
            {loading ? "Adding..." : added ? "Added" : "Add to Cart"}
            <i className="bi bi-cart ms-1"></i>
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
