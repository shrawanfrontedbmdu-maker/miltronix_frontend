import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart, addItemToWishlist, getCartItems } from "../../api/api";

const starIconFull = "/icon7.svg";
const starIconHalf = "/icon9.svg";
const starIconEmpty = "/icon8.svg";

const yellowFilter =
  "brightness(0) saturate(100%) invert(78%) sepia(60%) saturate(500%) hue-rotate(5deg)";

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
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existingIndex = guestCart.findIndex(
          (item) => item.productId === product._id && item.sku === variant.sku,
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
        const guestWishlist = JSON.parse(
          localStorage.getItem("guestWishlist") || "[]",
        );
        const alreadyExists = guestWishlist.some(
          (item) => item.productId === product._id,
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
              background: "rgba(108, 99, 255, 0.15)",
              border: "1px solid rgba(108, 99, 255, 0.35)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 101, 132, 0.25)";
              e.currentTarget.style.borderColor = "rgba(255, 101, 132, 0.5)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(108, 99, 255, 0.15)";
              e.currentTarget.style.borderColor = "rgba(108, 99, 255, 0.35)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="url(#closeGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="closeGrad" x1="1" y1="1" x2="11" y2="11">
                  <stop offset="0%" stopColor="#6c63ff" />
                  <stop offset="100%" stopColor="#ff6584" />
                </linearGradient>
              </defs>
            </svg>
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
          {/* ⭐ Full Stars - Yellow */}
          {[...Array(fullStars)].map((_, i) => (
            <img
              key={`full-${i}`}
              src={starIconFull}
              alt="star"
              className="star1"
              style={{ filter: yellowFilter }}
            />
          ))}
          {/* ⭐ Half Star - Yellow */}
          {halfStar && (
            <img
              src={starIconHalf}
              alt="half-star"
              className="star1"
              style={{ filter: yellowFilter }}
            />
          )}
          {/* Empty Stars - Grey (no filter) */}
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
