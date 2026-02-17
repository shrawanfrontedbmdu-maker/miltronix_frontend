import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart, addItemToWishlist, getCartItems } from "../../api/api";

const starIconFull = "/src/assets/icon 7.svg";
const starIconHalf = "/src/assets/icon 9.svg";
const starIconEmpty = "/src/assets/icon 8.svg";

const ShopCard = ({ product, userId, onCartUpdate, onWishlistUpdate }) => {
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

  // ---------------- ADD TO CART ----------------
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

    await addItemToWishlist({
      productId: product._id,
      title: product.name,
      images: product.images?.map((img) => img.url),
      category: categoryName,
      priceSnapshot: price,
      variant: variant ? { sku: variant.sku } : undefined,
    });
    setAddedWishlist(true);
    if (onWishlistUpdate) onWishlistUpdate(); // refresh wishlist in parent
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="shop-card text-center">
        {saveAmount > 0 && (
          <span className="shop-card-badge">
            Save ₹{saveAmount.toLocaleString()}
          </span>
        )}

        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="img-fluid shop-card-img"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/product/${product._id}`)}
        />

        <h6 className="product-category2">{categoryName}</h6>
        <h5
          className="product-title2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h5>

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

        <div className="d-flex justify-content-between">
          <button
            className={`shop-card-btn-cart w-75 ${addedCart ? "btn-success" : ""}`}
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

          <button
            className={`btn shop-card-btn-wishlist ${addedWishlist ? "btn-danger" : ""}`}
            onClick={handleAddToWishlist}
            disabled={loadingWishlist || addedWishlist}
          >
            <i className="bi bi-heart-fill"></i>
            {addedWishlist ? " Added" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
