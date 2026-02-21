import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logoBanner from "../../assets/MILTRONIX APP DESIGN 3.png";

const BACKEND_URL = "https://miltronix-backend-2.onrender.com";

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

// CartPage ka EXACT SAME getImageUrl
const getImageUrl = (item) => {
  if (!item.images?.length) return "/images/placeholder.png";
  const img = item.images[0];
  if (img.url && /^https?:\/\//.test(img.url)) return img.url;
  if (img.url) return `${BACKEND_URL}/${img.url.replace(/^\/+/, "")}`;
  if (typeof img === "string")
    return `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  return "/images/placeholder.png";
};

// CartPage ka EXACT SAME getProductName
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
      marginBottom: 8,
      fontSize: 14,
    }}
  >
    <span style={{ color: "#555" }}>{label} :</span>
    <span style={{ fontWeight: bold ? 700 : 500, ...valueStyle }}>{value}</span>
  </div>
);

const OrderConfirmPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order || null;
  // ✅ Pay.jsx se ab cartItems aata hai — real images wala
  const cartItems = state?.cartItems || [];

  if (!order) {
    return (
      <>
        <ConfirmHeader />
        <div style={{ textAlign: "center", marginTop: 120 }}>
          <p>No order data found.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </>
    );
  }

  const orderItems = order.items || [];
  const extraItems = orderItems.length - 1;
  const shipping = order.shippingAddress || {};

  // ✅ Image + Name: cartItems[0] se lo (CartPage jaisa real data)
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
          background: "#e0e0e0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 16px 40px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "3px solid #555",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 26,
              color: "#555",
            }}
          >
            ✓
          </div>
          <h2 style={{ color: "#4a6741", fontWeight: 700, margin: "0 0 8px" }}>
            Order Confirmed!
          </h2>
          <p style={{ color: "#555", margin: "0 0 4px" }}>
            Thank you. Your order has been placed successfully.
          </p>
          <p style={{ color: "#555", margin: 0 }}>
            You'll receive tracking information once your order ships.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "28px",
            width: "100%",
            maxWidth: 620,
            boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
          }}
        >
          {/* Product Row */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            {/* ✅ Image: cartItems[0] se — CartPage jaisa same getImageUrl */}
            <img
              src={imgSrc}
              alt={productName}
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
              style={{
                width: 120,
                height: 90,
                objectFit: "contain",
                borderRadius: 8,
                background: "#f5f5f5",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                {productName}
              </div>
              <div style={{ color: "#777", fontSize: 13, marginBottom: 8 }}>
                SKU: {itemSku}
              </div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>
                ₹{fmt(itemPrice)}
              </div>
            </div>
            <div style={{ color: "#555", fontSize: 14, whiteSpace: "nowrap" }}>
              Qty: {itemQty}
            </div>
          </div>

          {extraItems > 0 && (
            <div style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>
              +{extraItems} more item{extraItems > 1 ? "s" : ""}
            </div>
          )}

          <hr style={{ margin: "8px 0 20px" }} />

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {/* Delivery Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                Delivery Information
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {shipping.fullName || "—"}
              </div>
              <div style={{ color: "#555", fontSize: 14, lineHeight: 1.7 }}>
                {shipping.houseFlatNo}
                {shipping.buildingApartment
                  ? ", " + shipping.buildingApartment
                  : ""}
              </div>
              <div style={{ color: "#555", fontSize: 14 }}>
                {shipping.streetLocality}
              </div>
              {shipping.landmark && (
                <div style={{ color: "#555", fontSize: 14 }}>
                  Near: {shipping.landmark}
                </div>
              )}
              <div style={{ color: "#555", fontSize: 14 }}>
                {shipping.city}, {shipping.state} – {shipping.pinCode}
              </div>
              {shipping.mobile && (
                <div style={{ color: "#555", fontSize: 14, marginTop: 4 }}>
                  📞 {shipping.mobile}
                </div>
              )}
              <div style={{ marginTop: 12, fontSize: 14 }}>
                <strong>Estimated Delivery</strong> –{" "}
                <span style={{ color: "#555" }}>{estimatedDelivery()}</span>
              </div>
              {order.trackingnumber && (
                <div style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
                  Tracking: {order.trackingnumber}
                </div>
              )}
            </div>

            {/* Order Details */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
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
              <hr style={{ margin: "10px 0" }} />
              <Row label="Subtotal" value={`₹${fmt(subtotal)}`} />
              {couponDiscount > 0 && (
                <Row
                  label={`Coupon (${order.couponCode || ""})`}
                  value={`−₹${fmt(couponDiscount)}`}
                  valueStyle={{ color: "green" }}
                />
              )}
              {taxAmount > 0 && (
                <Row label="Tax" value={`₹${fmt(taxAmount)}`} />
              )}
              <Row
                label="Shipping"
                value={shippingCost === 0 ? "Free" : `₹${fmt(shippingCost)}`}
              />
              <hr style={{ margin: "10px 0" }} />
              <Row label="Total" value={`₹${fmt(totalAmount)}`} bold />
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "#4a5568",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 36px",
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: 0.3,
              }}
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
