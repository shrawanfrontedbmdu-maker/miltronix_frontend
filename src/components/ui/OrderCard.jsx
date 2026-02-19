import React from "react";

// ─── Status badge color ─────────────────────────────────────────────
const statusStyle = (status) => {
  switch (status) {
    case "Active":
      return { background: "#e8f4fd", color: "#1a73e8" };
    case "Delivered":
      return { background: "#e6f4ea", color: "#2e7d32" };
    case "Cancelled":
      return { background: "#fdecea", color: "#c62828" };
    case "Pending":
    default:
      return { background: "#fff8e1", color: "#f57f17" };
  }
};

const OrderCard = ({ order }) => {
  const firstItem = order.items?.[0];
  const totalItems = order.items?.length || 0;
  const extraItems = totalItems - 1;

  const itemName = firstItem?.name || "Product";
  const itemQty = firstItem?.quantity || 1;

  // ✅ FIXED: backend image object -> use .url
  const itemImage = firstItem?.image?.url || "/placeholder.png";

  const totalAmount = order.totalAmount || 0;
  const orderNumber = order._id?.slice(-6)?.toUpperCase() || "—";
  const orderStatus = order.status || "Pending";
  const trackingNo = order.trackingnumber || null;

  const orderDate = order.createdAt
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
      style={{ background: "#f9f9f9", borderRadius: "12px", border: "1px solid #e8e8e8" }}
    >
      {/* Top row */}
      <div className="d-flex justify-content-between mb-2">
        <div style={{ fontSize: "13px", color: "#888" }}>
          Order <b>#{orderNumber}</b>
        </div>

        <span style={{ ...sStyle, fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>
          {orderStatus}
        </span>
      </div>

      {/* Item row */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3 align-items-center">
          <img
            src={itemImage}
            alt={itemName}
            onError={(e) => (e.target.src = "/placeholder.png")}
            style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
          />

          <div>
            <div style={{ fontWeight: 600 }}>{itemName}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Qty: {itemQty}
              {extraItems > 0 && (
                <span style={{ marginLeft: "6px", color: "#1a73e8" }}>
                  +{extraItems} more
                </span>
              )}
            </div>

            <div style={{ fontWeight: 700 }}>
              ₹{totalAmount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <button style={{ border: "1px solid #999", padding: "6px 14px", borderRadius: "8px" }}>
          Track Order
        </button>
      </div>

      {/* Bottom */}
      <div style={{ fontSize: "11px", color: "#aaa", marginTop: "8px" }}>
        Placed on {orderDate}
        {trackingNo && <span> | Tracking: {trackingNo}</span>}
      </div>
    </div>
  );
};

export default OrderCard;
