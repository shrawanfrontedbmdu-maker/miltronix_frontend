// ================= CartPage.jsx =================
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  getCartItems,
  addItemToCart,
  removeCartItem,
  applyCouponApi,
  getApplicableCouponsApi,
} from "../../api/api";
import AuthModals from "../auth/AuthModals";
import Notifications from "../../pages/Notification/Notifications";
import "./CartPage.css";

// Assets
import logoBanner from "../../assets/MILTRONIX APP DESIGN 3.png";

const BACKEND_URL = "https://miltronix-backend-2.onrender.com";

/* ─── Icons ─── */
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CheckIconWhite = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─── Header ─── */
const CartHeader = () => (
  <div className="fixed-top">
    <section className="miltronix-banner d-flex justify-content-center align-items-center">
      <Link to="/">
        <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
      </Link>
    </section>
  </div>
);

/* ─── Step Indicator ─── */
const StepIndicator = ({ currentStep = 1 }) => {
  const steps = [
    { num: 1, label: "Shopping Cart" },
    { num: 2, label: "Shipping Detail" },
    { num: 3, label: "Preview your order" },
  ];
  return (
    <div className="step-indicator">
      <div className="step-indicator-inner">
        {steps.map((step, idx) => {
          const done = step.num < currentStep;
          const active = step.num === currentStep;
          return (
            <React.Fragment key={step.num}>
              <div className="step-item">
                <div className={`step-circle ${done ? "done" : active ? "active" : ""}`}>
                  {done ? <CheckIconWhite /> : <span className="step-circle-num">{step.num}</span>}
                </div>
                <span className={`step-label ${done ? "done" : active ? "active" : ""}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`step-connector ${done ? "done" : ""}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ─── CartPage ─── */
const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [applicableCoupons, setApplicableCoupons] = useState([]);
  const [modalToShow, setModalToShow] = useState(null);

  // ── Header badge refresh karne ka helper ──
  const refreshHeader = () => window.dispatchEvent(new Event("header:refresh"));

  const loadCart = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (user?._id) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        if (guestCart.length > 0) {
          await Promise.all(
            guestCart.map((item) =>
              addItemToCart({ productId: item.productId, sku: item.sku, quantity: item.quantity }).catch(() => {})
            )
          );
          localStorage.removeItem("guestCart");
        }
        const data = await getCartItems();
        setCart(data || { items: [], subtotal: 0 });
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const subtotal = guestCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setCart({
          items: guestCart.map((item) => ({
            product: {
              _id: item.productId,
              name: item.name,
              images: [{ url: item.image }],
              category: item.category,
            },
            variant: { sku: item.sku },
            quantity: item.quantity,
            priceSnapshot: item.price,
          })),
          subtotal,
        });
      }
    } catch {
      setCart({ items: [], subtotal: 0 });
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const loadApplicableCoupons = async (subtotal) => {
    if (subtotal <= 0) return setApplicableCoupons([]);
    try {
      const res = await getApplicableCouponsApi(subtotal);
      if (res?.success) setApplicableCoupons(res.applicableCoupons || []);
    } catch {
      setApplicableCoupons([]);
    }
  };

  useEffect(() => { loadCart(true); }, []);
  useEffect(() => { if (cart.subtotal > 0) loadApplicableCoupons(cart.subtotal); }, [cart.subtotal]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?._id && modalToShow === null) {
      loadCart(false);
    }
  }, [modalToShow]);

  // ── Quantity change — badge bhi refresh hoga ──
  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    const key = `${item.product?._id}-${item.variant?.sku || "default"}`;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    try {
      setUpdatingKey(key);
      if (user?._id) {
        const qtyDiff = newQty - (item.quantity || 0);
        if (qtyDiff === 0) return;
        await addItemToCart({ productId: item.product?._id, sku: item.variant?.sku, quantity: qtyDiff });
        await loadCart(false);
        refreshHeader(); // ✅ badge update
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const idx = guestCart.findIndex((i) => i.productId === item.product?._id && i.sku === item.variant?.sku);
        if (idx > -1) { guestCart[idx].quantity = newQty; localStorage.setItem("guestCart", JSON.stringify(guestCart)); }
        await loadCart(false);
        refreshHeader(); // ✅ badge update
      }
      setCouponApplied(null);
    } catch { alert("Failed to update cart item"); }
    finally { setUpdatingKey(null); }
  };

  // ── Remove item — badge bhi refresh hoga ──
  const handleRemove = async (item) => {
    const key = `${item.product?._id}-${item.variant?.sku || "default"}`;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    try {
      setUpdatingKey(key);
      if (user?._id) {
        await removeCartItem({ productId: item.product?._id, sku: item.variant?.sku });
        await loadCart(false);
        refreshHeader(); // ✅ badge update
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const updated = guestCart.filter((i) => !(i.productId === item.product?._id && i.sku === item.variant?.sku));
        localStorage.setItem("guestCart", JSON.stringify(updated));
        await loadCart(false);
        refreshHeader(); // ✅ badge update
      }
      setCouponApplied(null);
    } catch { alert("Failed to remove item"); }
    finally { setUpdatingKey(null); }
  };

  const handleApplyCoupon = async (code) => {
    const cCode = code || couponCode;
    if (!cCode) return setCouponError("Enter a coupon code");
    try {
      const response = await applyCouponApi(cart.subtotal || 0, cCode);
      if (response?.success && response?.appliedCoupon) {
        setCouponApplied(response.appliedCoupon);
        setCouponError("");
        setCouponCode(cCode);
      } else {
        setCouponError(response?.message || "Coupon not applicable");
        setCouponApplied(null);
      }
    } catch (err) {
      setCouponError(err.message || "Failed to apply coupon");
      setCouponApplied(null);
    }
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?._id) {
      setModalToShow("login");
      return;
    }
    await loadCart(false);
    if (!cart.items?.length) return alert("Your cart is empty!");
    navigate("/secendaddress", {
      state: {
        coupon: couponApplied?.code,
        discountAmount: couponApplied?.discountAmount || 0,
      },
    });
  };

  const getImageUrl = (item) => {
    const images = item.product?.images || item.images || [];
    if (!images.length) return "/images/placeholder.png";
    const img = images[0];
    if (img?.url && /^https?:\/\//.test(img.url)) return img.url;
    if (img?.url) return `${BACKEND_URL}/${img.url.replace(/^\/+/, "")}`;
    if (typeof img === "string") return `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
    return "/images/placeholder.png";
  };

  const getProductName = (item) =>
    item.product?.name || item.product?.title || item.name || item.title || "Unnamed Product";

  const getProductCategory = (item) =>
    item.product?.category?.name || item.product?.category || item.category || "Electronics";

  const finalTotal = couponApplied
    ? couponApplied.newTotalPrice || cart.subtotal - (couponApplied.discountAmount || 0)
    : cart.subtotal;

  if (loading) {
    return (
      <>
        <CartHeader />
        <div className="cart-page loading-wrap" style={{ paddingTop: "100px" }}>
          <div className="loading-inner">
            <div className="spinner" />
            <p className="loading-text">Loading your bag...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CartHeader />
      <AuthModals modalToShow={modalToShow} setModalToShow={setModalToShow} />

      <div className="cart-page" style={{ paddingTop: "100px" }}>
        <main className="cart-main">
          <StepIndicator currentStep={1} />

          {cart.items.length === 0 ? (
            <div className="empty-wrap">
              <div className="empty-emoji">🛍️</div>
              <div className="empty-title">Your bag is empty</div>
              <div className="empty-subtitle">Add items to it now</div>
              <button className="shop-btn" onClick={() => navigate("/")}>Shop Now</button>
            </div>
          ) : (
            <div className="cart-wrap">
              {/* ── LEFT ── */}
              <div>
                <div className="coupon-card">
                  <div className="coupon-card-title"><TagIcon /> Apply Coupon</div>
                  <div className="coupon-top">
                    <input
                      className="coupon-input"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                    />
                    <button className="apply-btn" onClick={() => handleApplyCoupon()}>APPLY</button>
                  </div>

                  {couponError && <div className="error-msg">{couponError}</div>}
                  {couponApplied && (
                    <div className="success-msg">
                      <CheckIcon />
                      <span>"{couponApplied.code}" applied — you save ₹{couponApplied.discountAmount}!</span>
                    </div>
                  )}

                  {applicableCoupons.length > 0 && (
                    <div className="coupon-pills-wrap">
                      <div className="available-title">
                        {applicableCoupons.length} coupon{applicableCoupons.length > 1 ? "s" : ""} available
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {applicableCoupons.map((c) => (
                          <button key={c._id} className="coupon-pill" onClick={() => handleApplyCoupon(c.code)}>
                            <TagIcon /> {c.code}
                            <span className="coupon-pill-discount">
                              &nbsp;·&nbsp;{c.discountType === "flat" ? `₹${c.discountValue} off` : `${c.discountValue}% off`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="section-head">
                  Order Summary ({cart.items.length} item{cart.items.length !== 1 ? "s" : ""})
                </div>

                {cart.items.map((item, idx) => {
                  const key = `${item.product?._id}-${item.variant?.sku || "default"}`;
                  const busy = updatingKey === key;
                  return (
                    <div key={key} className="cart-item" style={{ animationDelay: `${idx * 60}ms`, opacity: busy ? 0.5 : 1, transition: "opacity .2s" }}>
                      <img src={getImageUrl(item)} alt={getProductName(item)} className="item-img" />
                      <div className="item-info">
                        <div className="item-brand">{getProductName(item)}</div>
                        <div className="item-title">{getProductCategory(item)}</div>
                        {item.variant?.sku && <span className="item-sku">SKU: {item.variant.sku}</span>}
                        <div className="price-row">
                          <span className="item-price">
                            ₹{((item.quantity || 0) * (item.priceSnapshot || 0)).toLocaleString("en-IN")}
                          </span>
                          {item.quantity > 1 && (
                            <span className="item-price-unit">
                              ₹{item.priceSnapshot?.toLocaleString("en-IN")} × {item.quantity}
                            </span>
                          )}
                        </div>
                        <div className="qty-row">
                          <span className="qty-label">QTY</span>
                          <div className="qty-control">
                            <button className="qty-btn" disabled={item.quantity <= 1 || busy} onClick={() => handleQuantityChange(item, item.quantity - 1)}>−</button>
                            <span className="qty-num">{item.quantity || 0}</span>
                            <button className="qty-btn" disabled={busy} onClick={() => handleQuantityChange(item, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                      </div>
                      <button className="remove-btn" disabled={busy} onClick={() => handleRemove(item)}>
                        <TrashIcon /> Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* ── RIGHT — Price Summary ── */}
              <div>
                <div className="summary-card">
                  <div className="summary-title">Price Details</div>
                  <div className="summary-row">
                    <span className="summary-label">Price ({cart.items.length} item{cart.items.length !== 1 ? "s" : ""})</span>
                    <span className="summary-val">₹{(cart.subtotal || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Delivery Charges</span>
                    <span className="summary-val free">FREE</span>
                  </div>
                  {couponApplied && (
                    <div className="discount-row">
                      <span>Coupon Discount</span>
                      <span>− ₹{(couponApplied.discountAmount || 0).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <hr className="summary-divider" />
                  <div className="total-row">
                    <span>Total Amount</span>
                    <span>₹{(finalTotal || 0).toLocaleString("en-IN")}</span>
                  </div>
                  {couponApplied && (
                    <div className="savings-badge">
                      🎉 You save ₹{(couponApplied.discountAmount || 0).toLocaleString("en-IN")} on this order!
                    </div>
                  )}
                  <button className="checkout-btn" style={{ marginTop: couponApplied ? 12 : 0 }} onClick={handleCheckout}>
                    CHECKOUT
                  </button>
                  <p className="cart-secure-text">Safe &amp; Secure Payments. Easy returns.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default CartPage;