import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addItemToCart,
  addItemToWishlist,
  getCartItems,
} from "../../../api/api";

const COLOR_MAP = {
  black: "#1a1a1a", white: "#f5f5f5", silver: "#c0c0c0", grey: "#808080",
  gray: "#808080", blue: "#2563eb", red: "#dc2626", green: "#16a34a",
  gold: "#d97706", yellow: "#eab308", pink: "#ec4899", purple: "#7c3aed",
  orange: "#ea580c", brown: "#92400e", navy: "#4a5856", cyan: "#0891b2",
  "space grey": "#4b5563", "midnight": "#616D6B", "starlight": "#f0ede6",
  "rose gold": "#e8a598", "deep purple": "#581c87",
};

const getColorHex = (val) => COLOR_MAP[val?.toLowerCase()] || null;

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

  .pi-root { font-family: 'Bricolage Grotesque', sans-serif; }

  .pi-title {
    font-family: 'Arapey', serif;
    font-size: clamp(18px, 2.6vw, 26px);
    font-weight: 700;
    color: #616D6B;
    line-height: 1.3;
    letter-spacing: -0.3px;
    margin: 0 0 6px;
  }

  .pi-desc {
    font-size: 13px;
    color: #64748b;
    line-height: 1.65;
    margin: 0 0 16px;
  }

  .pi-price-block {
    position: relative;
    border-radius: 14px;
    background: linear-gradient(135deg, #2d3a38 0%, #4a5856 100%);
    padding: 16px 20px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  .pi-price-block::before {
    content: '';
    position: absolute;
    top: -28px; right: -28px;
    width: 110px; height: 110px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .pi-price-block::after {
    content: '';
    position: absolute;
    bottom: -18px; left: 50px;
    width: 70px; height: 70px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .pi-price-main {
    font-family: 'Arapey', serif;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.8px;
    line-height: 1;
  }
  .pi-price-mrp {
    font-size: 14px;
    color: rgba(255,255,255,0.42);
    text-decoration: line-through;
    font-weight: 400;
    margin-top: 2px;
  }
  .pi-discount-badge {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff;
    font-size: 11.5px;
    font-weight: 700;
    padding: 4px 11px;
    border-radius: 20px;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .pi-savings {
    font-size: 11.5px;
    color: #86efac;
    font-weight: 600;
    margin-top: 4px;
  }
  .pi-tax-note {
    font-size: 10.5px;
    color: rgba(255,255,255,0.28);
    margin-top: 2px;
  }

  .pi-stock-in {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #16a34a;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    padding: 4px 11px; border-radius: 20px;
  }
  .pi-stock-out {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #dc2626;
    background: #fef2f2; border: 1px solid #fecaca;
    padding: 4px 11px; border-radius: 20px;
  }
  .pi-dot-green {
    width: 7px; height: 7px; border-radius: 50%; background: #16a34a;
    animation: pi-pulse 2s infinite; flex-shrink: 0;
  }
  .pi-dot-red { width: 7px; height: 7px; border-radius: 50%; background: #dc2626; flex-shrink: 0; }
  @keyframes pi-pulse {
    0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
    50%      { opacity:.8; box-shadow: 0 0 0 5px rgba(22,163,74,0); }
  }

  .pi-variant-key {
    font-size: 10.5px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;
  }
  .pi-variant-key span {
    color: #616D6B; letter-spacing: 0; text-transform: none; font-size: 12px;
  }

  .pi-var-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 9px; font-size: 12.5px;
    font-weight: 600; border: 1.5px solid #e2e8f0;
    background: #fff; color: #334155;
    cursor: pointer; transition: all 0.18s; font-family: 'Bricolage Grotesque', sans-serif;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .pi-var-btn:hover:not(:disabled) {
    border-color: #4a5856; color: #4a5856;
    background: #f8fafc;
    box-shadow: 0 3px 8px rgba(97,109,107,0.1);
    transform: translateY(-1px);
  }
  .pi-var-btn.active {
    border-color: #616D6B; background: #2d3a38; color: #fff;
    box-shadow: 0 4px 12px rgba(45,58,56,0.22);
  }
  .pi-var-btn:disabled { opacity: 0.38; cursor: not-allowed; }

  /* ── Detail cards: horizontal list style ── */
  .pi-detail-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 20px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
  }

  .pi-detail-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 16px;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;
    position: relative;
  }
  .pi-detail-row:last-child { border-bottom: none; }
  .pi-detail-row:hover { background: #f8fafc; }

  /* left accent on hover */
  .pi-detail-row::before {
    content: '';
    position: absolute;
    left: 0; top: 18%; bottom: 18%;
    width: 3px; border-radius: 0 3px 3px 0;
    background: #616D6B;
    opacity: 0; transition: opacity 0.18s;
  }
  .pi-detail-row:hover::before { opacity: 1; }

  .pi-detail-icon-wrap {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, #f1f5f9, #e8edf3);
    border: 1px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: all 0.18s;
  }
  .pi-detail-row:hover .pi-detail-icon-wrap {
    background: linear-gradient(135deg, #4a5856, #616D6B);
    border-color: #616D6B;
  }

  .pi-detail-texts { flex: 1; min-width: 0; }
  .pi-pill-label {
    font-size: 10px; color: #94a3b8; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.6px;
    display: block; margin-bottom: 1px;
    transition: color 0.15s;
  }
  .pi-detail-row:hover .pi-pill-label { color: #616D6B; }
  .pi-pill-value {
    font-size: 13px; color: #1e293b; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .pi-detail-arrow {
    color: #cbd5e1; flex-shrink: 0; transition: color 0.15s, transform 0.15s;
  }
  .pi-detail-row:hover .pi-detail-arrow {
    color: #616D6B; transform: translateX(2px);
  }

  .pi-btn-wish {
    width: 46px; height: 46px; border-radius: 11px; flex-shrink: 0;
    border: 1.5px solid #e2e8f0; background: #fff;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .pi-btn-wish:hover { border-color: #fca5a5; background: #fef2f2; transform: scale(1.05); }
  .pi-btn-wish.active { border-color: #ef4444; background: #fef2f2; }

  .pi-btn-cart {
    flex: 1; height: 46px; border-radius: 11px;
    border: 2px solid #616D6B; background: #fff; color: #616D6B;
    font-size: 13px; font-weight: 700; font-family: 'Bricolage Grotesque', sans-serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s;
  }
  .pi-btn-cart:hover:not(:disabled) {
    background: #2d3a38; color: #fff;
    box-shadow: 0 4px 14px rgba(45,58,56,0.18);
    transform: translateY(-1px);
  }
  .pi-btn-cart:disabled { opacity: 0.5; cursor: not-allowed; }
  .pi-btn-cart.done { background: #2d3a38; color: #fff; }

  .pi-btn-buy {
    flex: 1; height: 46px; border-radius: 11px; border: none;
    background: linear-gradient(135deg, #4a5856 0%, #2d3a38 100%);
    color: #fff; font-size: 13px; font-weight: 700; font-family: 'Bricolage Grotesque', sans-serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(45,58,56,0.18);
  }
  .pi-btn-buy:hover:not(:disabled) {
    background: linear-gradient(135deg, #2d3a38 0%, #4a5856 100%);
    box-shadow: 0 6px 18px rgba(45,58,56,0.28);
    transform: translateY(-1px);
  }
  .pi-btn-buy:disabled { background: #e2e8f0; color: #94a3b8; box-shadow: none; cursor: not-allowed; }

  .pi-secure {
    font-size: 11px; color: #94a3b8; text-align: center;
    margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;
    flex-wrap: wrap;
  }
  .pi-secure span { display: flex; align-items: center; gap: 3px; }
  .pi-divider { color: #e2e8f0; }
`;

const ProductInfo = ({
  product = {},
  selectedVariant = null,
  onVariantChange,
  onImageChange,
  addingToCart = false,
}) => {
  const navigate = useNavigate();
  const [loadingCart, setLoadingCart] = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addedWishlist, setAddedWishlist] = useState(false);

  const price = Number(selectedVariant?.price ?? product.price ?? 0);
  const mrp = Number(selectedVariant?.compareAtPrice ?? product.oldPrice ?? product.mrp ?? 0);
  const stock = Number(selectedVariant?.stock ?? selectedVariant?.stockQuantity ?? product.stock ?? -1);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isOutOfStock = stock === 0;
  const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";
  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.pageTitle || product.category.categoryKey || "Uncategorized"
      : "Uncategorized";

  const variants = product.variants || [];
  const attributeKeys = variants.length > 0
    ? [...new Set(variants.flatMap((v) => Object.keys(v.attributes || {})))]
    : [];

  const handleVariantSelect = (key, value) => {
    const currentAttrs = selectedVariant?.attributes || {};
    const newAttrs = { ...currentAttrs, [key]: value };
    const matched =
      variants.find((v) => Object.entries(newAttrs).every(([k, val]) => v.attributes?.[k] === val)) ||
      variants.find((v) => v.attributes?.[key] === value);
    if (matched) {
      if (onVariantChange) onVariantChange(matched);
      const variantImg = matched.image?.url || matched.image || matched.images?.[0]?.url || null;
      if (onImageChange) onImageChange(variantImg);
    }
  };

  const handleAddToCart = async () => {
    if (!product._id || !selectedVariant?.sku) return alert("Product/variant not found");
    setLoadingCart(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?._id) {
        await addItemToCart({ productId: product._id, sku: selectedVariant.sku, quantity: 1 });
        await getCartItems();
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const idx = guestCart.findIndex(i => i.productId === product._id && i.sku === selectedVariant.sku);
        if (idx > -1) guestCart[idx].quantity += 1;
        else guestCart.push({ productId: product._id, sku: selectedVariant.sku, quantity: 1, name: product.name || product.title, description: product.description || "", image: imageUrl, price, category: categoryName });
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }
      setAddedCart(true);
      setTimeout(() => navigate("/cart"), 500);
    } catch (err) { alert(err.message || "Failed to add to cart"); }
    finally { setLoadingCart(false); }
  };

  const handleBuyNow = async () => {
    if (!product._id || !selectedVariant?.sku) return alert("Product/variant not found");
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?._id) {
        await addItemToCart({ productId: product._id, sku: selectedVariant.sku, quantity: 1 });
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const idx = guestCart.findIndex(i => i.productId === product._id && i.sku === selectedVariant.sku);
        if (idx > -1) guestCart[idx].quantity += 1;
        else guestCart.push({ productId: product._id, sku: selectedVariant.sku, quantity: 1, name: product.name || product.title, description: product.description || "", image: imageUrl, price, category: categoryName });
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }
      navigate("/secendaddress");
    } catch (err) { alert(err.message || "Failed to proceed"); }
  };

  const handleAddToWishlist = async () => {
    if (!product._id || !price) return alert("Product not found");
    setLoadingWishlist(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?._id) {
        await addItemToWishlist({
          userId: user._id, productId: product._id,
          title: product.name || product.title,
          images: product.images?.map(img => ({ url: img.url, public_id: img.public_id || img.url, alt: img.alt || "" })),
          category: categoryName, priceSnapshot: price,
          variant: selectedVariant ? { sku: selectedVariant.sku } : undefined,
        });
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        if (!guestWishlist.some(i => i.productId === product._id)) {
          guestWishlist.push({ productId: product._id, name: product.name || product.title, description: product.description || "", image: imageUrl, price, category: categoryName, sku: selectedVariant?.sku || "" });
          localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
        }
      }
      setAddedWishlist(true);
    } catch (err) { alert(err.message || "Failed to add to wishlist"); }
    finally { setLoadingWishlist(false); }
  };

  const details = [
    product.brand        && { icon: "🏷️", label: "Brand",     value: product.brand },
    product.warranty     && { icon: "🛡️", label: "Warranty",  value: product.warranty },
    product.emi          && { icon: "💳", label: "EMI from",   value: `₹${Number(product.emi).toLocaleString("en-IN")}/mo` },
    product.deliveryInfo && { icon: "🚚", label: "Delivery",   value: product.deliveryInfo },
    product.returnPolicy && { icon: "↩️", label: "Returns",    value: product.returnPolicy },
  ].filter(Boolean);

  return (
    <>
      <style>{STYLE}</style>

      {/*
        ── ALIGNMENT FIX ──
        alignSelf: "flex-start"  → Gallery ke saath top pe rahe, stretch na ho
        paddingLeft match karo Gallery ke paddingRight se
        Koi sticky nahi — ProductInfo scroll honi chahiye normally
      */}
      <div
        className="col-12 col-lg-6 pi-root"
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
          alignSelf: "flex-start",  /* ← gallery ke saath top-align */
        }}
      >
        {/* Title */}
        <h1 className="pi-title">{product.title || product.name}</h1>

        {/* Description */}
        {product.description && (
          <p className="pi-desc">
            {product.description.length > 130
              ? product.description.slice(0, 130) + "…"
              : product.description}
          </p>
        )}

        {/* Price block */}
        <div className="pi-price-block">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div className="pi-price-main">₹{price.toLocaleString("en-IN")}</div>
              {mrp > price && <div className="pi-price-mrp">MRP ₹{mrp.toLocaleString("en-IN")}</div>}
              {mrp > price && <div className="pi-savings">You save ₹{(mrp - price).toLocaleString("en-IN")}</div>}
              <div className="pi-tax-note">Inclusive of all taxes</div>
            </div>
            {discount > 0 && <span className="pi-discount-badge">{discount}% OFF</span>}
          </div>
        </div>

        {/* Stock */}
        <div style={{ marginBottom: "16px" }}>
          {isOutOfStock ? (
            <span className="pi-stock-out"><span className="pi-dot-red" /> Out of Stock</span>
          ) : (
            <span className="pi-stock-in">
              <span className="pi-dot-green" />
              {stock > 0 && stock <= 5 ? `Only ${stock} left!` : "In Stock"}
            </span>
          )}
        </div>

        {/* Variant Selectors */}
        {attributeKeys.map((key) => {
          const uniqueValues = [...new Set(variants.map(v => v.attributes?.[key]).filter(Boolean))];
          if (!uniqueValues.length) return null;
          const selectedValue = selectedVariant?.attributes?.[key];
          const isColorKey = key.toLowerCase().includes("color") || key.toLowerCase().includes("colour");

          return (
            <div key={key} style={{ marginBottom: "18px" }}>
              <div className="pi-variant-key">
                {key}{selectedValue && <> : <span>{selectedValue}</span></>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {uniqueValues.map((val) => {
                  const isSelected = selectedValue === val;
                  const variantForVal = variants.find(v => v.attributes?.[key] === val);
                  const outOfStock = variantForVal?.stockQuantity === 0 || variantForVal?.stock === 0;
                  const colorHex = isColorKey ? getColorHex(val) : null;

                  return (
                    <button
                      key={val}
                      onClick={() => !outOfStock && handleVariantSelect(key, val)}
                      disabled={outOfStock}
                      className={`pi-var-btn${isSelected ? " active" : ""}`}
                    >
                      {colorHex && (
                        <span style={{
                          width: "12px", height: "12px", borderRadius: "50%", flexShrink: 0,
                          backgroundColor: colorHex,
                          border: colorHex === "#f5f5f5" ? "1px solid #d1d5db" : "1px solid rgba(0,0,0,0.12)",
                          boxShadow: isSelected ? "0 0 0 2px rgba(255,255,255,0.4)" : "none",
                        }} />
                      )}
                      {val}
                      {outOfStock && <span style={{ fontSize: "9.5px", color: "#94a3b8", fontWeight: 400 }}>N/A</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Detail Cards — premium horizontal list */}
        {details.length > 0 && (
          <div className="pi-detail-list">
            {details.map(({ icon, label, value }) => (
              <div key={label} className="pi-detail-row">
                <div className="pi-detail-icon-wrap">{icon}</div>
                <div className="pi-detail-texts">
                  <span className="pi-pill-label">{label}</span>
                  <span className="pi-pill-value">{value}</span>
                </div>
                <svg className="pi-detail-arrow" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
          {/* Wishlist */}
          <button
            className={`pi-btn-wish${addedWishlist ? " active" : ""}`}
            onClick={handleAddToWishlist}
            disabled={loadingWishlist || addedWishlist}
            title="Add to Wishlist"
          >
            <svg width="17" height="17" viewBox="0 0 24 24"
              fill={addedWishlist ? "#ef4444" : "none"}
              stroke={addedWishlist ? "#ef4444" : "#64748b"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Add to Cart */}
          <button
            className={`pi-btn-cart${addedCart ? " done" : ""}`}
            onClick={handleAddToCart}
            disabled={loadingCart || addedCart || isOutOfStock}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {loadingCart ? "Adding…" : addedCart ? "Added ✓" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Buy Now */}
          <button
            className="pi-btn-buy"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Buy Now
          </button>
        </div>

        {/* Secure note */}
        <div className="pi-secure">
          <span>🔒 Secure Payments</span>
          <span className="pi-divider">·</span>
          <span>📦 Easy Returns</span>
          <span className="pi-divider">·</span>
          <span>✅ Genuine Products</span>
        </div>

      </div>
    </>
  );
};

export default ProductInfo;