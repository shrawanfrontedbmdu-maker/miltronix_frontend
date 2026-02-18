import React from "react";

// ─── Status badge color ───────────────────────────────────────────────────────
const statusStyle = (status) => {
  switch (status) {
    case "Active":
    case "Processing":
    case "Packaging":
    case "Shipped":
      return { background: "#e8f4fd", color: "#1a73e8" };
    case "Delivered":
    case "Completed":
      return { background: "#e6f4ea", color: "#2e7d32" };
    case "Cancelled":
      return { background: "#fdecea", color: "#c62828" };
    case "Pending":
    default:
      return { background: "#fff8e1", color: "#f57f17" };
  }
};

const OrderCard = ({ order }) => {
  const firstItem   = order.items?.[0];
  const totalItems  = order.items?.length || 0;
  const extraItems  = totalItems - 1;

  const itemName    = firstItem?.name || "Product";
  const itemQty     = firstItem?.quantity || 1;
  const itemPrice   = firstItem?.unitPrice || firstItem?.mrp || 0;

  const totalAmount = order.totalAmount || 0;
  const orderNumber = order.orderNumber || order._id?.slice(-6)?.toUpperCase() || "—";
  const orderStatus = order.fulfillment?.orderStatus || order.status || "Pending";
  const trackingNo  = order.trackingnumber || null;

  const orderDate   = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const sStyle = statusStyle(orderStatus);

  return (
    <div
      className="order-card p-3 mb-3"
      style={{
        background: "#f9f9f9",
        borderRadius: "12px",
        border: "1px solid #e8e8e8",
      }}
    >
      {/* ── Top row: order number + status ─────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div style={{ fontSize: "13px", color: "#888" }}>
          Order{" "}
          <span style={{ fontWeight: 600, color: "#333" }}>#{orderNumber}</span>
        </div>

        <span
          style={{
            ...sStyle,
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "20px",
          }}
        >
          {orderStatus}
        </span>
      </div>

      {/* ── Item info + action ──────────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <img
            src="/src/assets/placeholder.png"
            alt={itemName}
            style={{
              width: "80px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "8px",
              background: "#eee",
            }}
          />

          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#222" }}>
              {itemName}
            </div>

            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              Qty: {itemQty}
              {extraItems > 0 && (
                <span style={{ marginLeft: "6px", color: "#1a73e8" }}>
                  +{extraItems} more item{extraItems > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div style={{ fontWeight: 700, fontSize: "14px", marginTop: "4px", color: "#333" }}>
              ₹{totalAmount.toLocaleString("en-IN")}
              <span style={{ fontSize: "11px", fontWeight: 400, color: "#888", marginLeft: "4px" }}>
                (Incl. taxes)
              </span>
            </div>
          </div>
        </div>

        {/* ── Track button ─────────────────────────────────────────────── */}
        <button
          className="track-btn"
          style={{
            border: "1px solid #999",
            background: "transparent",
            padding: "6px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          Track Order
        </button>
      </div>

      {/* ── Bottom row: date + tracking number ─────────────────────────── */}
      <div
        className="d-flex align-items-center justify-content-between mt-2"
        style={{ fontSize: "11px", color: "#aaa", borderTop: "1px solid #eee", paddingTop: "8px" }}
      >
        <span>Placed on {orderDate}</span>
        {trackingNo && <span>Tracking: {trackingNo}</span>}
      </div>
    </div>
  );
};

export default OrderCard;