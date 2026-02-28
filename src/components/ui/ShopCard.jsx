import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart, addItemToWishlist, getCartItems } from "../../api/api";

const starIconFull = "/icon7.svg";
const starIconHalf = "/icon9.svg";
const starIconEmpty = "/icon8.svg";

const ShopCard = ({
  product,
  userId,
  onCartUpdate,
  onWishlistUpdate,
  onRemove,
}) => {
  const [loadingCart, setLoadingCart] = useState(false);
  const [addedCart, setAddedCart] = useState(false);

  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addedWishlist, setAddedWishlist] = useState(false);

  const navigate = useNavigate();

  if (!product) return null;

  const resolvedUserId =
    userId || JSON.parse(localStorage.getItem("user") || "null")?._id || "";

  const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.pageTitle ||
        product.category.categoryKey ||
        "Uncategorized"
      : "Uncategorized";

  const variant = product.variants?.[0];
  const price = variant?.price || 0;
  const oldPrice = variant?.compareAtPrice || price + 5000;
  const saveAmount = oldPrice - price;

  const rating = Math.min(5, product.avgRating || 0);
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const reviews = product.reviewCount || 0;
  const hasStock = variant?.hasStock && variant?.stockQuantity > 0;

  // ---------------- ADD TO CART ----------------
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!product._id || !variant?.sku)
      return alert("Product/variant not found");

    setLoadingCart(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (user?._id) {
        // Logged in: API call (same as before)
        await addItemToCart({
          productId: product._id,
          sku: variant.sku,
          quantity: 1,
        });
        if (onCartUpdate) {
          const updatedCart = await getCartItems();
          onCartUpdate(updatedCart);
        }
      } else {
        // Guest: localStorage mein save
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existingIndex = guestCart.findIndex(
          (item) => item.productId === product._id && item.sku === variant.sku
        );
        if (existingIndex > -1) {
          guestCart[existingIndex].quantity += 1;
        } else {
          guestCart.push({
            productId: product._id,
            sku: variant.sku,
            quantity: 1,
            name: product.name,
            image: imageUrl,
            price: price,
            category: categoryName,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        if (onCartUpdate) onCartUpdate(guestCart);
      }

      setAddedCart(true);
      setTimeout(() => navigate("/cart"), 500);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add to cart");
      setAddedCart(false);
    } finally {
      setLoadingCart(false);
    }
  };

  // ---------------- ADD TO WISHLIST ----------------
  const handleAddToWishlist = async (e) => {
    e.stopPropagation();

    if (!product._id || !price) return alert("Product not found");

    setLoadingWishlist(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (user?._id) {
        // Logged in: API call (same as before)
        await addItemToWishlist({
          userId: user._id,
          productId: product._id,
          title: product.name,
          images: product.images?.map((img) => ({
            url: img.url,
            public_id: img.public_id || img.url,
            alt: img.alt || product.name || "",
          })),
          category: categoryName,
          priceSnapshot: price,
          variant: variant ? { sku: variant.sku } : undefined,
        });
        if (onWishlistUpdate) onWishlistUpdate();
      } else {
        // Guest: localStorage mein save
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        const alreadyExists = guestWishlist.some(
          (item) => item.productId === product._id
        );
        if (!alreadyExists) {
          guestWishlist.push({
            productId: product._id,
            name: product.name,
            image: imageUrl,
            price: price,
            category: categoryName,
            sku: variant?.sku || "",
          });
          localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
        }
        if (onWishlistUpdate) onWishlistUpdate(guestWishlist);
      }

      setAddedWishlist(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add to wishlist");
      setAddedWishlist(false);
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div
        className="shop-card text-center position-relative"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/product-details/${product._id}`)}
      >
        {/* Remove button (wishlist page) */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove from wishlist"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          >
            ❌
          </button>
        )}

        {saveAmount > 0 && (
          <span className="shop-card-badge">
            Save ₹{saveAmount.toLocaleString()}
          </span>
        )}

        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="img-fluid shop-card-img"
        />

        <h5 className="product-title2">{product.name}</h5>

        <p className="product-price2">₹{price.toLocaleString()}</p>

        {oldPrice > price && (
          <p className="product-old-price2">₹{oldPrice.toLocaleString()}</p>
        )}

        <div className="product-rating1">
          {[...Array(fullStars)].map((_, i) => (
            <img
              key={`full-${i}`}
              src={starIconFull}
              alt="star"
              className="star1"
            />
          ))}
          {halfStar && (
            <img src={starIconHalf} alt="half-star" className="star1" />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <img
              key={`empty-${i}`}
              src={starIconEmpty}
              alt="star"
              className="star1"
            />
          ))}
          <span>
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>

        <div className="d-flex justify-content-between mt-2">
          <button
            className={`shop-card-btn-cart btn ${
              addedCart ? "btn-success" : "btn-primary"
            }`}
            style={{ width: "75%", marginLeft: "5%" }}
            onClick={handleAddToCart}
            disabled={loadingCart || addedCart || !hasStock}
          >
            {loadingCart ? (
              "Adding..."
            ) : addedCart ? (
              "Added"
            ) : !hasStock ? (
              "Out of Stock"
            ) : (
              <>
                <i className="bi bi-cart"></i> Add to Cart
              </>
            )}
          </button>

          {!onRemove && (
            <button
              className={`btn shop-card-btn-wishlist ${
                addedWishlist ? "btn-danger" : ""
              }`}
              onClick={handleAddToWishlist}
              disabled={loadingWishlist || addedWishlist}
            >
              <i className="bi bi-heart-fill"></i>
              {loadingWishlist ? " Adding..." : addedWishlist ? " Added" : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCard;