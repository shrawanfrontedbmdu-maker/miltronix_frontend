import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart, addItemToWishlist, getCartItems } from "../../api/api";

const starIconFull = "/src/assets/icon 7.svg";
const starIconHalf = "/src/assets/icon 9.svg";
const starIconEmpty = "/src/assets/icon 8.svg";
const cartIcon = "/src/assets/cart.png";
const wishlistIcon = "/src/assets/icon 9.svg";

const ProductCard = ({ product, userId, onCartUpdate, onWishlistUpdate }) => {
  const [loadingCart, setLoadingCart] = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addedWishlist, setAddedWishlist] = useState(false);

  const navigate = useNavigate();
  if (!product) return null;

  const resolvedUserId =
    userId || JSON.parse(localStorage.getItem("user") || "null")?._id || "";

  const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";

  const variant = product.variants?.[0];
  const price = variant?.price || 0;
  const oldPrice = variant?.compareAtPrice || price + 5000;

  const rating = Math.min(5, product.avgRating || 0);
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const reviews = product.reviewCount || 0;

  const hasStock = variant?.hasStock && variant?.stockQuantity > 0;

  // ---- Add to Cart ----
  const handleAddToCart = async () => {
    if (!product._id || !variant?.sku)
      return alert("Product/variant not found");

    setLoadingCart(true);
    try {
      await addItemToCart({
        productId: product._id,
        sku: variant.sku,
        quantity: 1,
      });

      setAddedCart(true);

      if (onCartUpdate) {
        const updatedCart = await getCartItems();
        onCartUpdate(updatedCart);
      }

      setTimeout(() => navigate("/cart"), 500);
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  // ---- Add to Wishlist ----
  const handleAddToWishlist = async () => {
    if (!resolvedUserId) return alert("Please login");

    setLoadingWishlist(true);
    try {
      await addItemToWishlist({
        userId: resolvedUserId,
        productId: product._id,
        priceSnapshot: price,
        variant: { sku: variant?.sku },
      });

      setAddedWishlist(true);
      if (onWishlistUpdate) onWishlistUpdate();
    } catch (err) {
      alert(err.message || "Failed to add to wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="product-card h-100">

        <img
          src={imageUrl}
          className="product-img"
          alt={product.name}
          onClick={() => navigate(`/checkout/${product._id}`)}
          style={{ cursor: "pointer" }}
        />

        <div className="product-body text-center">
          {/* <h6 className="product-category">{product.category?.pageTitle || "Category"}</h6> */}
          <h5 className="product-title">{product.name}</h5>

          <p className="product-price">₹{price}</p>
          <p className="product-old-price">₹{oldPrice}</p>

          {/* Rating */}
          <div className="product-rating">
            {[...Array(fullStars)].map((_, i) => (
              <img key={i} src={starIconFull} className="star" />
            ))}
            {halfStar && <img src={starIconHalf} className="star" />}
            {[...Array(emptyStars)].map((_, i) => (
              <img key={i} src={starIconEmpty} className="star" />
            ))}
            <span> {rating.toFixed(1)} ({reviews})</span>
          </div>
        </div>

        <div className="product-footer">
          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            disabled={loadingCart || addedCart || !hasStock}
          >
            <img src={cartIcon} alt="Cart" width="16" height="16" />{" "}
            {loadingCart
              ? "Adding..."
              : addedCart
              ? "Added"
              : !hasStock
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          <button
            className="btn-wishlist"
            onClick={handleAddToWishlist}
            disabled={loadingWishlist || addedWishlist}
          >
            <img src={wishlistIcon} alt="Wishlist" width="19" height="19" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;