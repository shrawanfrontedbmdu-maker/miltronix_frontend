import React, { useState, useEffect } from "react";
import { addItemToWishlist, removeWishlistItem, addItemToCart, getCartItems } from "../../api/api";

const BACKEND_URL = "https://miltronix-backend-2.onrender.com";

// Icons
const starFull = "/assets/icon7.svg";
const starEmpty = "/assets/icon8.svg";
const cartIcon = "/assets/cart.png";
const wishlistIcon = "/assets/icon9.svg";

function ProductCard({ product, onCartUpdate, wishlistItems = [], onWishlistUpdate }) {
  const [loadingCart, setLoadingCart] = useState(false);
  const [addedCart, setAddedCart] = useState(false);

  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addedWishlist, setAddedWishlist] = useState(false);

  const userId = localStorage.getItem("userId");

  if (!product) return null;

  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  const imageUrl = product.image
    ? `${BACKEND_URL}${product.image}`
    : `${BACKEND_URL}/images/placeholder.png`;

  // Check if product is already in wishlist
  useEffect(() => {
    if (wishlistItems && product._id) {
      const exists = wishlistItems.some((item) => item.product._id === product._id);
      setAddedWishlist(exists);
    }
  }, [wishlistItems, product._id]);

  // ---------------- ADD TO CART ----------------
  const handleAddToCart = async () => {
    if (!product._id) return alert("Product ID not found");

    setLoadingCart(true);
    try {
      await addItemToCart({
        productId: product._id,
        quantity: 1,
        variant: product.variant || {},
      });

      setAddedCart(true);

      if (onCartUpdate) {
        const updatedCart = await getCartItems();
        onCartUpdate(updatedCart.items || []);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(err?.response?.data?.message || "Failed to add item to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  // ---------------- TOGGLE WISHLIST ----------------
  const handleToggleWishlist = async () => {
    if (!userId) return alert("Please login to manage wishlist");
    if (!product._id) return;

    setLoadingWishlist(true);
    try {
      if (!addedWishlist) {
        await addItemToWishlist({
          productId: product._id,
          title: product.title || product.name,
          images: product.images?.map((img) => img.url) || [],
          category: product.category || product.categoryKey || "Uncategorized",
          priceSnapshot: product.price || 0,
          variant: product.variant ? { sku: product.variant.sku } : undefined,
        });
        setAddedWishlist(true);
      } else {
        const wishlistItem = wishlistItems.find((item) => item.product._id === product._id);
        if (wishlistItem) {
          await removeWishlistItem(userId, wishlistItem._id);
          setAddedWishlist(false);
        }
      }

      if (onWishlistUpdate) onWishlistUpdate(); // refresh parent
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      alert(err?.message || "Failed to update wishlist");
    } finally {
      setLoadingWishlist(false);
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
            <span> {rating.toFixed(1)} ({product.reviews || 0})</span>
          </div>
        </div>

        <div className="product-footer d-flex justify-content-between mt-2">
          <button
            className={`btn-add-cart w-75 ${addedCart ? "btn-success" : ""}`}
            onClick={handleAddToCart}
            disabled={loadingCart || addedCart}
          >
            <img src={cartIcon} alt="Cart" width="16" height="16" className="me-2" />
            {loadingCart ? "Adding..." : addedCart ? "Added" : "Add to Cart"}
          </button>

          <button
            className={`btn-wishlist ${addedWishlist ? "btn-danger" : ""}`}
            onClick={handleToggleWishlist}
            disabled={loadingWishlist}
          >
            <img
              src={wishlistIcon}
              alt="Wishlist"
              width="19"
              height="19"
              className={`me-1 ${addedWishlist ? "filled" : ""}`}
            />
            {addedWishlist ? " Added" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
