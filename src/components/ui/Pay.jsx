import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./pay.css";
import { createOrderApi } from "../../api/api";
import logoBanner from "../../assets/MILTRONIX APP DESIGN 3.png";

const BACKEND_URL = "https://miltronix-backend-2.onrender.com";

/* ─── Icons ─── */
const CheckIconWhite = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const LocationPinIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CardIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const UpiIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const BankIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </svg>
);
const CodIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const GiftIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const PayHeader = () => (
  <div className="fixed-top">
    <section className="miltronix-banner d-flex justify-content-center align-items-center">
      <Link to="/">
        <img
          src={logoBanner}
          alt="Miltronix Logo"
          className="img-fluid miltronix-logo"
        />
      </Link>
    </section>
  </div>
);

const StepIndicator = ({ currentStep = 3 }) => {
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
                <div
                  className={`step-circle ${done ? "done" : active ? "active" : ""}`}
                >
                  {done ? (
                    <CheckIconWhite />
                  ) : (
                    <span className="step-circle-num">{step.num}</span>
                  )}
                </div>
                <span
                  className={`step-label ${done ? "done" : active ? "active" : ""}`}
                >
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

export default function Pay() {
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardApplied, setGiftCardApplied] = useState(null);
  const [giftCardError, setGiftCardError] = useState("");
  const [giftCardLoading, setGiftCardLoading] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedAddress = state?.selectedAddress || null;
  const checkoutData = state?.checkoutData || null;
  const couponDiscount = Number(state?.discountAmount || 0);
  const cartItems = state?.cartItems || [];
  const pricing = checkoutData?.pricing || null;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getImageUrl = (item) => {
    const images = item?.product?.images || item?.images || [];
    if (!images.length) return "/images/placeholder.png";
    const img = images[0];
    if (img?.url && /^https?:\/\//.test(img.url)) return img.url;
    if (img?.url) return `${BACKEND_URL}/${img.url.replace(/^\/+/, "")}`;
    if (typeof img === "string" && /^https?:\/\//.test(img)) return img;
    if (typeof img === "string")
      return `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
    return "/images/placeholder.png";
  };

  const getProductName = (item) =>
    item?.product?.name ||
    item?.product?.title ||
    item?.title ||
    item?.name ||
    "Unnamed Product";

  const getProductCategory = (item) =>
    item?.product?.category?.name ||
    item?.product?.category ||
    item?.category ||
    "";

  const deliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  const addressLine = (a) => {
    if (!a) return "";
    return [
      a.houseFlatNo || a.addressLine1,
      a.buildingApartment || a.addressLine2,
      a.streetLocality,
      a.landmark ? `Near ${a.landmark}` : "",
      a.city,
      a.state,
      a.pinCode || a.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) {
      setGiftCardError("Please enter a gift card code");
      return;
    }
    setGiftCardLoading(true);
    setGiftCardError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/gift-cards/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ code: giftCardCode.trim() }),
      });
      const data = await res.json();
      if (data?.success && data?.balance > 0) {
        setGiftCardApplied({
          code: giftCardCode.trim().toUpperCase(),
          discount: data.balance,
        });
        setGiftCardError("");
      } else {
        setGiftCardError(data?.message || "Invalid or expired gift card");
        setGiftCardApplied(null);
      }
    } catch {
      setGiftCardError("Could not validate gift card. Try again.");
      setGiftCardApplied(null);
    } finally {
      setGiftCardLoading(false);
    }
  };

  const handleRemoveGiftCard = () => {
    setGiftCardApplied(null);
    setGiftCardCode("");
    setGiftCardError("");
  };

  const giftDiscount = giftCardApplied?.discount || 0;
  const finalTotal = pricing
    ? Math.max(0, pricing.finalAmount - couponDiscount - giftDiscount)
    : null;

  /* ── Order place — cartItems bhi pass karo navigate mein ── */
  async function handlePlaceOrder() {
    if (!user?._id) {
      setError("Please login to place order.");
      return;
    }
    if (!selectedAddress) {
      setError("No address selected. Please go back.");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const addr = {
        fullName: selectedAddress.fullName || "",
        houseFlatNo:
          selectedAddress.houseFlatNo || selectedAddress.addressLine1 || "",
        buildingApartment:
          selectedAddress.buildingApartment ||
          selectedAddress.addressLine2 ||
          "",
        streetLocality:
          selectedAddress.streetLocality || selectedAddress.addressLine1 || "",
        landmark: selectedAddress.landmark || "",
        pinCode: selectedAddress.pinCode || selectedAddress.pincode || "",
        city: selectedAddress.city || "",
        state: selectedAddress.state || "",
      };
      const payload = {
        user: user._id,
        paymentMethod:
          { card: "CARD", upi: "UPI", netbanking: "NETBANKING", cod: "COD" }[
            method
          ] || "COD",
        shippingCost: 0,
        currency: "INR",
        shippingAddress: addr,
        billingAddress: addr,
        ...(giftCardApplied && {
          giftCardCode: giftCardApplied.code,
          giftCardDiscount: giftCardApplied.discount,
        }),
      };
      const response = await createOrderApi(payload);

      // ✅ FIX: cartItems bhi pass karo — OrderConfirmPage image ke liye
      navigate("/order-confirm", {
        state: {
          order: response.data,
          cartItems: cartItems, // ← YAHI THA MISSING
        },
      });
    } catch (err) {
      setError(err.message || "Order placement failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  const payMethods = [
    { id: "card", label: "Credit / Debit Cards", icon: <CardIcon /> },
    { id: "upi", label: "UPI", icon: <UpiIcon /> },
    { id: "netbanking", label: "Net Banking", icon: <BankIcon /> },
    { id: "giftcard", label: "Gift Card", icon: <GiftIcon /> },
    { id: "cod", label: "Cash on Delivery", icon: <CodIcon /> },
  ];

  return (
    <>
      <PayHeader />
      <div className="pay-page">
        <main className="pay-main">
          <StepIndicator currentStep={3} />
          <div className="pay-wrap">
            {/* LEFT */}
            <div className="pay-left">
              <div className="pay-left-title">Payment</div>
              {error && <div className="pay-error">{error}</div>}

              {selectedAddress && (
                <div className="pay-address-strip">
                  <div className="pay-address-strip-icon">
                    <LocationPinIcon />
                  </div>
                  <div>
                    <div className="pay-address-strip-label">Delivering to</div>
                    <div className="pay-address-strip-name">
                      {selectedAddress.fullName}
                    </div>
                    <div className="pay-address-strip-text">
                      {addressLine(selectedAddress)}
                    </div>
                  </div>
                </div>
              )}

              <div className="pay-content">
                <div className="pay-methods">
                  {payMethods.map((m) => (
                    <div
                      key={m.id}
                      className={`pay-method-item ${method === m.id ? "active" : ""}`}
                      onClick={() => setMethod(m.id)}
                    >
                      {m.icon}
                      {m.label}
                    </div>
                  ))}
                </div>

                <div className="pay-form-area">
                  {method === "card" && (
                    <>
                      <div className="pay-form-title">
                        Enter Credit / Debit Card Details
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            marginBottom: 6,
                          }}
                        >
                          Card Number
                        </div>
                        <input
                          className="pay-input"
                          type="text"
                          placeholder="Enter card number here"
                          maxLength={19}
                        />
                      </div>
                      <div
                        className="pay-input-row"
                        style={{ marginBottom: 14 }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--muted)",
                              marginBottom: 6,
                            }}
                          >
                            Expiry
                          </div>
                          <input
                            className="pay-input"
                            style={{ marginBottom: 0 }}
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--muted)",
                              marginBottom: 6,
                            }}
                          >
                            CVV
                          </div>
                          <input
                            className="pay-input"
                            style={{ marginBottom: 0 }}
                            type="password"
                            placeholder="CVV"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <button
                        className="pay-btn"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                      >
                        {placing ? "Placing Order..." : "Place order & Pay"}
                      </button>
                    </>
                  )}

                  {method === "upi" && (
                    <>
                      <div className="pay-form-title">
                        Scan QR or Enter UPI ID
                      </div>
                      <img
                        className="pay-qr"
                        src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=200"
                        alt="UPI QR"
                      />
                      <input
                        className="pay-input"
                        type="text"
                        placeholder="Enter UPI ID (e.g. name@upi)"
                      />
                      <button
                        className="pay-btn"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                      >
                        {placing ? "Placing Order..." : "Pay via UPI"}
                      </button>
                    </>
                  )}

                  {method === "netbanking" && (
                    <>
                      <div className="pay-form-title">Select Your Bank</div>
                      <select className="pay-select">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                      <button
                        className="pay-btn"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                      >
                        {placing
                          ? "Placing Order..."
                          : "Proceed to Net Banking"}
                      </button>
                    </>
                  )}

                  {method === "giftcard" && (
                    <>
                      <div className="pay-form-title">Redeem Gift Card</div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginBottom: 14,
                        }}
                      >
                        Enter your gift card code to redeem its balance towards
                        this order.
                      </p>
                      {giftCardApplied ? (
                        <div
                          style={{
                            background: "#f0fdf4",
                            border: "1px solid #86efac",
                            borderRadius: 10,
                            padding: "12px 14px",
                            marginBottom: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#15803d",
                              }}
                            >
                              🎁 Gift Card Applied!
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#166534",
                                marginTop: 3,
                              }}
                            >
                              Code: <strong>{giftCardApplied.code}</strong> — ₹
                              {giftCardApplied.discount.toLocaleString("en-IN")}{" "}
                              will be deducted
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveGiftCard}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              fontSize: 12,
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div
                            style={{ display: "flex", gap: 8, marginBottom: 8 }}
                          >
                            <input
                              className="pay-input"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                textTransform: "uppercase",
                                letterSpacing: 2,
                              }}
                              type="text"
                              placeholder="Enter gift card code"
                              value={giftCardCode}
                              onChange={(e) => {
                                setGiftCardCode(e.target.value.toUpperCase());
                                setGiftCardError("");
                              }}
                            />
                            <button
                              onClick={handleApplyGiftCard}
                              disabled={giftCardLoading}
                              style={{
                                padding: "0 18px",
                                background: "var(--primary, #1a1a2e)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {giftCardLoading ? "..." : "Apply"}
                            </button>
                          </div>
                          {giftCardError && (
                            <div
                              style={{
                                fontSize: 12,
                                color: "#dc2626",
                                marginBottom: 10,
                              }}
                            >
                              ⚠️ {giftCardError}
                            </div>
                          )}
                        </>
                      )}
                      <button
                        className="pay-btn"
                        onClick={handlePlaceOrder}
                        disabled={placing || !giftCardApplied}
                        style={{ marginTop: 6 }}
                      >
                        {placing
                          ? "Placing Order..."
                          : giftCardApplied
                            ? "Place Order with Gift Card"
                            : "Apply Gift Card First"}
                      </button>
                    </>
                  )}

                  {method === "cod" && (
                    <>
                      <div className="pay-form-title">Cash on Delivery</div>
                      <div className="pay-cod-note">
                        Pay when your order arrives at your doorstep. No extra
                        charges for COD.
                      </div>
                      <button
                        className="pay-btn"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                      >
                        {placing ? "Placing Order..." : "Place Order"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="pay-right">
              <div className="pay-order-card">
                <div className="pay-card-title">
                  Order Summary ({cartItems.length} item
                  {cartItems.length !== 1 ? "s" : ""})
                </div>
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map((item, idx) => (
                      <div
                        key={`${item.product?._id || idx}-${item.variant?.sku || idx}`}
                        className="pay-product-row"
                        style={
                          idx > 0
                            ? {
                                marginTop: 14,
                                paddingTop: 14,
                                borderTop: "1px solid var(--border)",
                              }
                            : {}
                        }
                      >
                        <img
                          className="pay-product-img"
                          src={getImageUrl(item)}
                          alt={getProductName(item)}
                          onError={(e) => {
                            e.target.src = "/images/placeholder.png";
                          }}
                        />
                        <div className="pay-product-info">
                          <div className="pay-product-name">
                            {getProductName(item)}
                          </div>
                          {getProductCategory(item) && (
                            <div
                              className="pay-product-sku"
                              style={{ color: "var(--muted)" }}
                            >
                              {getProductCategory(item)}
                            </div>
                          )}
                          {(item.variant?.sku || item.sku) && (
                            <div className="pay-product-sku">
                              SKU: {item.variant?.sku || item.sku}
                            </div>
                          )}
                          <div className="pay-product-qty">
                            Qty: {item.quantity || 1}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "var(--primary)",
                              marginTop: 4,
                            }}
                          >
                            ₹
                            {(
                              (item.quantity || 1) * (item.priceSnapshot || 0)
                            ).toLocaleString("en-IN")}
                            {item.quantity > 1 && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 400,
                                  color: "var(--muted)",
                                  marginLeft: 6,
                                }}
                              >
                                ₹
                                {(item.priceSnapshot || 0).toLocaleString(
                                  "en-IN",
                                )}{" "}
                                × {item.quantity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      className="pay-delivery-info"
                      style={{ marginTop: 14 }}
                    >
                      🚚 Delivery by {deliveryDate()}
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>
                    No items found.
                  </p>
                )}
              </div>

              <div className="pay-price-card">
                <div className="pay-card-title">Payment Summary</div>
                {pricing ? (
                  <>
                    <div className="pay-price-row">
                      <span className="pay-price-label">Total MRP</span>
                      <span className="pay-price-val">
                        ₹{Number(pricing.totalCutPrice).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="pay-price-row">
                      <span className="pay-price-label">Discount</span>
                      <span className="pay-price-val green">
                        −₹
                        {Number(pricing.totalDiscount).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {giftCardApplied && giftDiscount > 0 && (
                      <div className="pay-price-row">
                        <span className="pay-price-label">
                          🎁 Gift Card ({giftCardApplied.code})
                        </span>
                        <span className="pay-price-val green">
                          −₹{Number(giftDiscount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    <div className="pay-price-row">
                      <span className="pay-price-label">Delivery Charges</span>
                      <span className="pay-price-val green">FREE</span>
                    </div>
                    <hr className="pay-divider" />
                    <div className="pay-total-row">
                      <span>Total Amount</span>
                      <span>
                        ₹
                        {(finalTotal ?? pricing.finalAmount).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                    {giftDiscount > 0 && (
                      <div className="pay-savings-badge">
                        🎁 ₹{Number(giftDiscount).toLocaleString("en-IN")}{" "}
                        redeemed via Gift Card!
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>
                    Pricing unavailable
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
