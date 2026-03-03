import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart, addItemToWishlist, getCartItems } from "../../api/api";

const starIconFull = "/icon7.svg";
const starIconHalf = "/icon9.svg";
const starIconEmpty = "/icon8.svg";

const brandFilter =
  "invert(43%) sepia(11%) saturate(542%) hue-rotate(122deg) brightness(93%) contrast(87%)";

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
      alert(err.message || "Failed to add to cart");
    } finally {
      setLoadingCart(false);
    }
  };

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
            alt: img.alt || "",
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
        if (!guestWishlist.some((item) => item.productId === product._id)) {
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
      alert(err.message || "Failed to add to wishlist");
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
        {saveAmount > 0 && (
          <span className="shop-card-badge">
            Save ₹{saveAmount.toLocaleString()}
          </span>
        )}

        {/* ✅ Remove button — sirf wishlist page pe dikhega */}
        {onRemove && (
          <button
            className="shop-card-close-btn"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Remove from Wishlist"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}

        <img
          src={imageUrl}
          alt={product.name}
          className="img-fluid shop-card-img"
        />
        <h5 className="product-title2">{product.name}</h5>
        <p className="product-price2">₹{price.toLocaleString()}</p>

        {oldPrice > price && (
          <p className="product-old-price2">₹{oldPrice.toLocaleString()}</p>
        )}

        <div
          className="product-rating1"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            justifyContent: "center",
          }}
        >
          {[...Array(fullStars)].map((_, i) => (
            <img
              key={`f-${i}`}
              src={starIconFull}
              alt="s"
              className="star1"
              style={{ filter: brandFilter }}
            />
          ))}
          {halfStar && (
            <img
              src={starIconHalf}
              alt="h"
              className="star1"
              style={{ filter: brandFilter }}
            />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <img key={`e-${i}`} src={starIconEmpty} alt="e" className="star1" />
          ))}
          <span>
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>

        <div className="d-flex justify-content-between mt-2">
          <button
            className={`shop-card-btn-cart btn ${addedCart ? "btn-success" : "btn-primary"}`}
            style={{ width: "75%", marginLeft: "5%" }}
            onClick={handleAddToCart}
            disabled={loadingCart || addedCart || !hasStock}
          >
            {loadingCart
              ? "Adding..."
              : addedCart
                ? "Added"
                : !hasStock
                  ? "Out of Stock"
                  : "Add to Cart"}
          </button>
          {/* ✅ Wishlist button — sirf tab dikhega jab onRemove nahi hai */}
          {!onRemove && (
            <button
              className={`btn shop-card-btn-wishlist ${addedWishlist ? "btn-danger" : ""}`}
              onClick={handleAddToWishlist}
              disabled={loadingWishlist || addedWishlist}
            >
              <i className="bi bi-heart-fill"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCard;