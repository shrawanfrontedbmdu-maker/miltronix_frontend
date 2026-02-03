// src/components/ui/ProductCard.jsx
import React, { useState } from "react";
import { addItemToCart, getCartItems } from "../../api/api";

const starFull = "/assets/icon7.svg";
const starEmpty = "/assets/icon8.svg";
const cartIcon = "/assets/cart.png";
const wishlistIcon = "/assets/icon9.svg";

function ProductCard({ product, onCartUpdate, categoryKey }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  const categoryName = categoryKey || product.category || "General";

  const imageUrl =
    product.images?.length > 0
      ? product.images[0].url
      : product.image || "/images/placeholder.png";

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const payload = product._id
        ? { productId: product._id, categoryKey: categoryName, quantity: 1, variant: product.variant || {} }
        : { productId: null, categoryKey: categoryName, quantity: 1, variant: product.variant || {}, categoryProduct: product };

      const res = await addItemToCart(payload);

      setAdded(true);
      if (onCartUpdate) {
        const updatedCart = await getCartItems();
        onCartUpdate(updatedCart);
      }

      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 mb-4">
      <div className="product-card h-100 text-center position-relative">
        <img src={imageUrl} alt={product.title || "Product"} className="product-img" onError={e => e.currentTarget.src="/images/placeholder.png"} />

        <div className="product-body mt-2">
          <h6 className="product-category">{categoryName}</h6>
          <h5 className="product-title">{product.title}</h5>
          <p className="product-price">₹{product.price || product.sellingprice || 0}</p>

          <div className="product-rating d-flex align-items-center justify-content-center gap-1">
            {[...Array(fullStars)].map((_, i) => <img key={i} src={starFull} className="star" />)}
            {[...Array(emptyStars)].map((_, i) => <img key={i} src={starEmpty} className="star" />)}
            <span>{rating.toFixed(1)} ({product.reviews || 0})</span>
          </div>
        </div>

        <div className="product-footer d-flex justify-content-between mt-2">
          <button className={`btn-add-cart w-75 ${added ? "btn-success" : ""}`} onClick={handleAddToCart} disabled={loading || added}>
            <img src={cartIcon} alt="Cart" width="16" height="16" className="me-2" />
            {loading ? "Adding..." : added ? "Added" : "Add to Cart"}
          </button>
          <button className="btn-wishlist"><img src={wishlistIcon} alt="Wishlist" width="19" height="19" /></button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
