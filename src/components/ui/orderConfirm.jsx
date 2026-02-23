import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logoBanner from "../../assets/MILTRONIX APP DESIGN 3.png";

const BACKEND_URL = "https://miltronix-backend-2.onrender.com";

// ── Colors (Miltronix palette) ──────────────────────────────
const C = {
  pageBg: "#D5D4D3",
  banner: "#616D6B",
  bannerDark: "#495654",
  cardBg: "rgb(255 255 255 / 24%)",
  secondary: "#dddddc",
  border: "#908a8a",
  text: "#2d2a2a",
  muted: "#6c757d",
  discount: "#3d7a65",
  white: "#ffffff",
};

const ConfirmHeader = () => (
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

const getImageUrl = (item) => {
  if (!item.images?.length) return "/images/placeholder.png";
  const img = item.images[0];
  if (img.url && /^https?:\/\//.test(img.url)) return img.url;
  if (img.url) return `${BACKEND_URL}/${img.url.replace(/^\/+/, "")}`;
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

const Row = ({ label, value, bold = false, valueStyle = {} }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 7,
      fontSize: 13,
    }}
  >
    <span style={{ color: C.muted }}>{label} :</span>
    <span
      style={{ fontWeight: bold ? 700 : 500, color: C.text, ...valueStyle }}
    >
      {value}
    </span>
  </div>
);

const OrderConfirmPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order || null;
  const cartItems = state?.cartItems || [];

  if (!order) {
    return (
      <>
        <ConfirmHeader />
        <div style={{ textAlign: "center", marginTop: 120, color: C.text }}>
          <p>No order data found.</p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: 12,
              background: C.banner,
              color: C.white,
              border: "none",
              borderRadius: 9,
              padding: "10px 28px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Go Home
          </button>
        </div>
      </>
    );
  }

  const orderItems = order.items || [];
  const extraItems = orderItems.length - 1;
  const shipping = order.shippingAddress || {};
  const firstCartItem = cartItems[0] || null;
  const firstOrderItem = orderItems[0] || {};
  const imgSrc = firstCartItem
    ? getImageUrl(firstCartItem)
    : "/images/placeholder.png";
  const productName = firstCartItem
    ? getProductName(firstCartItem)
    : getProductName(firstOrderItem);
  const itemQty = firstCartItem?.quantity || firstOrderItem?.quantity || 1;
  const itemPrice =
    firstCartItem?.priceSnapshot ||
    firstOrderItem?.unitPrice ||
    firstOrderItem?.priceSnapshot ||
    0;
  const itemSku =
    firstCartItem?.variant?.sku ||
    firstOrderItem?.variant?.sku ||
    firstOrderItem?.sku ||
    "—";

  const couponDiscount = Number(order.couponDiscount || 0);
  const subtotal = Number(order.subtotal || 0);
  const shippingCost = Number(order.shippingCost || 0);
  const taxAmount = Number(order.taxAmount || 0);
  const totalAmount = Number(order.totalAmount || 0);
  const fmt = (n) => Number(n).toLocaleString("en-IN");

  const estimatedDelivery = () => {
    const d = new Date(order.createdAt || Date.now());
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <ConfirmHeader />
      <div
        style={{
          minHeight: "100vh",
          background: C.pageBg, // updated: #D5D4D3
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "90px 16px 30px", // updated: reduced top/bottom padding
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        {/* ── Success badge ── */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 48, // updated: smaller circle
              height: 48,
              borderRadius: "50%",
              border: `2.5px solid ${C.banner}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: 22,
              color: C.banner, // updated: #616D6B
            }}
          >
            ✓
          </div>
          <h2
            style={{
              color: C.banner,
              fontWeight: 800,
              margin: "0 0 6px",
              fontSize: 20,
            }}
          >
            Order Confirmed!
          </h2>
          <p style={{ color: C.muted, margin: "0 0 2px", fontSize: 13 }}>
            Thank you. Your order has been placed successfully.
          </p>
          <p style={{ color: C.muted, margin: 0, fontSize: 13 }}>
            You'll receive tracking information once your order ships.
          </p>
        </div>

        {/* ── Main card ── */}
        <div
          style={{
            background: C.cardBg, // updated: frosted glass
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "20px 22px", // updated: reduced padding
            width: "100%",
            maxWidth: 620,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          {/* Product Row */}
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <img
              src={imgSrc}
              alt={productName}
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
              style={{
                width: 90, // updated: smaller image
                height: 72,
                objectFit: "contain",
                borderRadius: 8,
                background: C.secondary, // updated: #dddddc
                border: `1px solid ${C.border}`,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 3,
                  color: C.text,
                }}
              >
                {productName}
              </div>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>
                SKU: {itemSku}
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, color: C.banner }}>
                ₹{fmt(itemPrice)}
              </div>
            </div>
            <div style={{ color: C.muted, fontSize: 13, whiteSpace: "nowrap" }}>
              Qty: {itemQty}
            </div>
          </div>

          {extraItems > 0 && (
            <div
              style={{
                color: C.banner,
                fontSize: 12,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              +{extraItems} more item{extraItems > 1 ? "s" : ""}
            </div>
          )}

          <hr style={{ margin: "6px 0 16px", borderColor: C.border }} />

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {/* Delivery Info */}
            <div style={{ flex: 1, minWidth: 190 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 8,
                  color: C.banner,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Delivery Information
              </div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 3,
                  fontSize: 13,
                  color: C.text,
                }}
              >
                {shipping.fullName || "—"}
              </div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>
                {shipping.houseFlatNo}
                {shipping.buildingApartment
                  ? ", " + shipping.buildingApartment
                  : ""}
              </div>
              <div style={{ color: C.muted, fontSize: 12 }}>
                {shipping.streetLocality}
              </div>
              {shipping.landmark && (
                <div style={{ color: C.muted, fontSize: 12 }}>
                  Near: {shipping.landmark}
                </div>
              )}
              <div style={{ color: C.muted, fontSize: 12 }}>
                {shipping.city}, {shipping.state} – {shipping.pinCode}
              </div>
              {shipping.mobile && (
                <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
                  📞 {shipping.mobile}
                </div>
              )}
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  background: C.secondary, // updated: #dddddc
                  borderRadius: 6,
                  padding: "6px 10px",
                  color: C.text,
                }}
              >
                <strong style={{ color: C.banner }}>Est. Delivery</strong>{" "}
                <span style={{ color: C.muted }}>– {estimatedDelivery()}</span>
              </div>
              {order.trackingnumber && (
                <div style={{ marginTop: 5, fontSize: 12, color: C.muted }}>
                  Tracking: {order.trackingnumber}
                </div>
              )}
            </div>

            {/* Order Details */}
            <div style={{ flex: 1, minWidth: 190 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 8,
                  color: C.banner,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Order Details
              </div>
              <Row
                label="Order ID"
                value={`#${order.orderNumber || order._id}`}
              />
              <Row
                label="Payment"
                value={order.payment?.method || order.paymentMethod || "COD"}
              />
              <hr style={{ margin: "8px 0", borderColor: C.border }} />
              <Row label="Subtotal" value={`₹${fmt(subtotal)}`} />
              {couponDiscount > 0 && (
                <Row
                  label={`Coupon (${order.couponCode || ""})`}
                  value={`−₹${fmt(couponDiscount)}`}
                  valueStyle={{ color: C.discount }}
                />
              )}
              {taxAmount > 0 && (
                <Row label="Tax" value={`₹${fmt(taxAmount)}`} />
              )}
              <Row
                label="Shipping"
                value={shippingCost === 0 ? "Free" : `₹${fmt(shippingCost)}`}
                valueStyle={shippingCost === 0 ? { color: C.discount } : {}}
              />
              <hr style={{ margin: "8px 0", borderColor: C.border }} />
              <Row
                label="Total"
                value={`₹${fmt(totalAmount)}`}
                bold
                valueStyle={{ color: C.banner }}
              />
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: C.banner, // updated: #616D6B
                color: C.white,
                border: "none",
                borderRadius: 9, // updated: matched site .custom-btn
                padding: "10px 32px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = C.bannerDark)}
              onMouseLeave={(e) => (e.target.style.background = C.banner)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmPage;
