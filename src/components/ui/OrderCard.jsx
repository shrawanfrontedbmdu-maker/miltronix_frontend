import React from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');

  .oc-card {
    background: #dddddc;
    border-radius: 12px;
    border: 1px solid #c8cac9;
    padding: 14px 16px;
    margin-bottom: 12px;
    font-family: 'Bricolage Grotesque', sans-serif;
    transition: box-shadow 0.18s;
  }
  .oc-card:hover {
    box-shadow: 0 4px 16px rgba(97,109,107,0.12);
  }

  /* Top row */
  .oc-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .oc-order-no {
    font-size: 12px;
    color: #7a8280;
  }
  .oc-order-no b {
    color: #2d2a2a;
    font-weight: 700;
  }

  /* Status badge */
  .oc-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .oc-badge-active    { background: rgba(97,109,107,0.13); color: #4e5954; }
  .oc-badge-delivered { background: rgba(61,107,79,0.12);  color: #2e6b44; }
  .oc-badge-cancelled { background: rgba(179,64,64,0.10);  color: #b34040; }
  .oc-badge-pending   { background: rgba(196,150,58,0.12); color: #8a6320; }

  /* Item row */
  .oc-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .oc-item-left {
    display: flex;
    gap: 12px;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .oc-img {
    width: 72px;
    height: 56px;
    object-fit: contain;
    border-radius: 8px;
    background: #D5D4D3;
    border: 1px solid #b8bcbb;
    flex-shrink: 0;
  }

  .oc-item-info { flex: 1; min-width: 0; }

  .oc-item-name {
    font-weight: 700;
    font-size: 0.88rem;
    color: #2d2a2a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }

  .oc-item-meta {
    font-size: 11px;
    color: #7a8280;
    margin-bottom: 4px;
  }

  .oc-more {
    color: #616D6B;
    font-weight: 600;
    margin-left: 5px;
  }

  .oc-price {
    font-weight: 800;
    font-size: 1rem;
    color: #616D6B;
  }

  /* Track button */
  .oc-track-btn {
    background: none;
    border: 1.5px solid #616D6B;
    color: #616D6B;
    border-radius: 8px;
    padding: 6px 14px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.18s, color 0.18s;
    flex-shrink: 0;
  }
  .oc-track-btn:hover {
    background: #616D6B;
    color: #fff;
  }

  /* Footer */
  .oc-footer {
    font-size: 11px;
    color: #9a9e9d;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid #c8cac9;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("oc-miltronix-styles")) {
  const t = document.createElement("style");
  t.id = "oc-miltronix-styles";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

// ─── Badge class per status ──────────────────────────────────────────
const badgeClass = (status) => {
  switch (status) {
    case "Active":    return "oc-badge oc-badge-active";
    case "Delivered": return "oc-badge oc-badge-delivered";
    case "Cancelled": return "oc-badge oc-badge-cancelled";
    default:          return "oc-badge oc-badge-pending";
  }
};

const OrderCard = ({ order }) => {
  const firstItem  = order.items?.[0];
  const totalItems = order.items?.length || 0;
  const extraItems = totalItems - 1;

  const itemName   = firstItem?.name || "Product";
  const itemQty    = firstItem?.quantity || 1;
  const itemImage  = firstItem?.image?.url || firstItem?.image || "/placeholder.png";

  const totalAmount = order.totalAmount || 0;
  const orderNumber = order._id?.slice(-6)?.toUpperCase() || "—";
  const orderStatus = order.status || "Pending";
  const trackingNo  = order.trackingnumber || null;

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

  // Track button only for Active orders (admin will decide for others)
  const showTrack = orderStatus === "Active";

  return (
    <div className="oc-card">

      {/* Top row */}
      <div className="oc-top">
        <div className="oc-order-no">
          Order <b>#{orderNumber}</b>
        </div>
        <span className={badgeClass(orderStatus)}>{orderStatus}</span>
      </div>

      {/* Item row */}
      <div className="oc-item-row">
        <div className="oc-item-left">
          <img
            src={itemImage}
            alt={itemName}
            className="oc-img"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />
          <div className="oc-item-info">
            <div className="oc-item-name">{itemName}</div>
            <div className="oc-item-meta">
              Qty: {itemQty}
              {extraItems > 0 && (
                <span className="oc-more">+{extraItems} more</span>
              )}
            </div>
            <div className="oc-price">₹{totalAmount.toLocaleString("en-IN")}</div>
          </div>
        </div>

        {/* Track button — only Active */}
        {showTrack && (
          <button className="oc-track-btn">Track Order</button>
        )}
      </div>

      {/* Footer */}
      <div className="oc-footer">
        Placed on {orderDate}
        {trackingNo && <span> · Tracking: {trackingNo}</span>}
      </div>
    </div>
  );
};

export default OrderCard;