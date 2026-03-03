import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addItemToCart,
  addItemToWishlist,
  getCartItems,
} from "../../../api/api";

const ProductInfo = ({
  product = {},
  selectedVariant = null,
  addingToCart = false,
}) => {
  const navigate = useNavigate();
  const [loadingCart, setLoadingCart] = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addedWishlist, setAddedWishlist] = useState(false);

  const price = Number(selectedVariant?.price ?? product.price ?? 0);
  const mrp = Number(
    selectedVariant?.compareAtPrice ?? product.oldPrice ?? product.mrp ?? 0,
  );
  const stock = Number(selectedVariant?.stock ?? product.stock ?? -1);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isOutOfStock = stock === 0;
  const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";
  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.pageTitle ||
        product.category.categoryKey ||
        "Uncategorized"
      : "Uncategorized";

  const handleAddToCart = async () => {
    if (!product._id || !selectedVariant?.sku)
      return alert("Product/variant not found");
    setLoadingCart(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?._id) {
        await addItemToCart({
          productId: product._id,
          sku: selectedVariant.sku,
          quantity: 1,
        });
        await getCartItems();
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existingIndex = guestCart.findIndex(
          (item) =>
            item.productId === product._id && item.sku === selectedVariant.sku,
        );
        if (existingIndex > -1) {
          guestCart[existingIndex].quantity += 1;
        } else {
          guestCart.push({
            productId: product._id,
            sku: selectedVariant.sku,
            quantity: 1,
            name: product.name || product.title,
            image: imageUrl,
            price,
            category: categoryName,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }
      setAddedCart(true);
      setTimeout(() => navigate("/cart"), 500);
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product._id || !selectedVariant?.sku)
      return alert("Product/variant not found");
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?._id) {
        await addItemToCart({
          productId: product._id,
          sku: selectedVariant.sku,
          quantity: 1,
        });
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existingIndex = guestCart.findIndex(
          (item) =>
            item.productId === product._id && item.sku === selectedVariant.sku,
        );
        if (existingIndex > -1) {
          guestCart[existingIndex].quantity += 1;
        } else {
          guestCart.push({
            productId: product._id,
            sku: selectedVariant.sku,
            quantity: 1,
            name: product.name || product.title,
            image: imageUrl,
            price,
            category: categoryName,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }
      navigate("/secendaddress");
    } catch (err) {
      alert(err.message || "Failed to proceed");
    }
  };

  const handleAddToWishlist = async () => {
    if (!product._id || !price) return alert("Product not found");
    setLoadingWishlist(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?._id) {
        await addItemToWishlist({
          userId: user._id,
          productId: product._id,
          title: product.name || product.title,
          images: product.images?.map((img) => ({
            url: img.url,
            public_id: img.public_id || img.url,
            alt: img.alt || "",
          })),
          category: categoryName,
          priceSnapshot: price,
          variant: selectedVariant ? { sku: selectedVariant.sku } : undefined,
        });
      } else {
        const guestWishlist = JSON.parse(
          localStorage.getItem("guestWishlist") || "[]",
        );
        if (!guestWishlist.some((item) => item.productId === product._id)) {
          guestWishlist.push({
            productId: product._id,
            name: product.name || product.title,
            image: imageUrl,
            price,
            category: categoryName,
            sku: selectedVariant?.sku || "",
          });
          localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
        }
      }
      setAddedWishlist(true);
    } catch (err) {
      alert(err.message || "Failed to add to wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className="col-12 col-lg-6">
      <h4 className="product-title-new mb-1 mt-2">
        {product.title || product.name}
      </h4>
      {product.description && (
        <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
          {product.description}
        </p>
      )}
      <div className="product-price mb-2">
        <span className="fw-bold display-6 price-new me-3">
          Rs.{price.toLocaleString("en-IN")}
        </span>
        {mrp > price && (
          <span className="text-decoration-line-through h5 old-price-2">
            MRP Rs.{mrp.toLocaleString("en-IN")}
          </span>
        )}
      </div>
      <p className="text-muted mb-3">(Incl. of all taxes)</p>
      {discount > 0 && (
        <span className="badge new-model mb-3 px-3 py-2">{discount}% Off</span>
      )}
      <ul className="list-unstyled mb-4 product-features">
        {product.emi && (
          <li>
            EMI Starting from Rs.{Number(product.emi).toLocaleString("en-IN")}
            /month
          </li>
        )}
        {product.deliveryInfo && <li>{product.deliveryInfo}</li>}
        {discount > 0 && <li>Discount up to {discount}%</li>}
        {product.brand && <li>Brand: {product.brand}</li>}
        {product.warranty && <li>Warranty: {product.warranty}</li>}
        {product.returnPolicy && <li>Return Policy: {product.returnPolicy}</li>}
      </ul>
      <div className="d-flex gap-3">
        <button
          className={
            "btn shop-card-btn-wishlist " + (addedWishlist ? "btn-danger" : "")
          }
          onClick={handleAddToWishlist}
          disabled={loadingWishlist || addedWishlist}
          title="Add to Wishlist"
        >
          <i
            className={"bi " + (addedWishlist ? "bi-heart-fill" : "bi-heart")}
          ></i>
        </button>
        <button
          className="shop-card-btn-cart w-50 me-2"
          onClick={handleAddToCart}
          disabled={loadingCart || addedCart || isOutOfStock}
        >
          <i className="bi bi-cart"></i>
          {loadingCart
            ? " Adding..."
            : addedCart
              ? " Added!"
              : isOutOfStock
                ? " Out of Stock"
                : " Add to Cart"}
        </button>
        <button
          className="shop-card-btn-cart w-50 me-2"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
        >
          <i className="bi bi-bag"></i> Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
