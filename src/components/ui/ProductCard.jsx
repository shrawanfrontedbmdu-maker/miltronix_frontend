import React, { useState } from "react";
import { addItemToCart, getCartItems } from "../../api/api";

const BACKEND_URL = "http://localhost:3000";

// Icons
const starFull = "/assets/icon7.svg";
const starEmpty = "/assets/icon8.svg";
const cartIcon = "/assets/cart.png";
const wishlistIcon = "/assets/icon9.svg";

function ProductCard({ product, onCartUpdate }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  const imageUrl = product.image
    ? `${BACKEND_URL}${product.image}`
    : `${BACKEND_URL}/images/placeholder.png`;

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addItemToCart({
        productId: product.id,
        quantity: 1,
        price: product.price,
      });
      setAdded(true);

      // Update parent cart state if callback provided
      if (onCartUpdate) {
        const updatedCart = await getCartItems();
        onCartUpdate(updatedCart);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="product-card h-100 text-center position-relative">
        {product.saveAmount && (
          <span className="product-badge">
            Save ₹{Number(product.saveAmount).toLocaleString()}
          </span>
        )}

        <img src={imageUrl} className="product-img" alt={product.title || "Product"} />

        <div className="product-body mt-2">
          <h6 className="product-category">{product.category || product.categoryKey}</h6>
          <h5 className="product-title">{product.title}</h5>

          <p className="product-price">₹{product.price?.toLocaleString() || 0}</p>
          {product.oldPrice && (
            <p className="product-old-price">₹{product.oldPrice.toLocaleString()}</p>
          )}

          <div className="product-rating d-flex align-items-center justify-content-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
              <img key={`full-${i}`} src={starFull} alt="star" className="star" />
            ))}
            {[...Array(emptyStars)].map((_, i) => (
              <img key={`empty-${i}`} src={starEmpty} alt="star" className="star" />
            ))}
            <span> {rating} ({product.reviews || 0})</span>
          </div>
        </div>

        <div className="product-footer d-flex justify-content-between mt-2">
          <button
            className={`btn-add-cart w-75 ${added ? "btn-success" : ""}`}
            onClick={handleAddToCart}
            disabled={loading || added}
          >
            <img src={cartIcon} alt="Cart" width="16" height="16" className="me-2" />
            {loading ? "Adding..." : added ? "Added" : "Add to Cart"}
          </button>

          <button className="btn-wishlist">
            <img src={wishlistIcon} alt="Wishlist" width="19" height="19" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
