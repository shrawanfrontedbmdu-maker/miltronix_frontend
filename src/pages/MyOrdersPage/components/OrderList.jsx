import React, { useEffect, useState } from "react";
import OrderCard from "../../../components/ui/OrderCard";
import { getOrdersByUserApi } from "../../../api/api";
import { useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Arapey:ital@0;1&display=swap');

  .ol-root {
    font-family: 'Bricolage Grotesque', sans-serif;
    color: #2d2a2a;
  }

  .ol-title {
    font-family: 'Arapey', serif;
    font-style: italic;
    font-size: 1.5rem;
    font-weight: 400;
    color: #616D6B;
    margin-bottom: 18px;
    letter-spacing: -0.3px;
  }

  /* ── Tabs ── */
  .ol-tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #b8bcbb;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .ol-tab {
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    padding: 9px 18px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: #7a8280;
    cursor: pointer;
    transition: color 0.18s, border-color 0.18s;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .ol-tab:hover { color: #616D6B; }

  .ol-tab.active {
    color: #616D6B;
    border-bottom-color: #616D6B;
  }

  .ol-tab .ol-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(97,109,107,0.12);
    color: #4e5954;
    font-size: 0.68rem;
    font-weight: 700;
    border-radius: 20px;
    padding: 1px 7px;
    margin-left: 6px;
    min-width: 20px;
  }

  .ol-tab.active .ol-count {
    background: #616D6B;
    color: #fff;
  }

  /* ── Order item wrapper ── */
  .ol-item {
    margin-bottom: 14px;
    animation: ol-fade 0.3s ease both;
  }
  @keyframes ol-fade {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Loading ── */
  .ol-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #7a8280;
    font-size: 0.85rem;
    padding: 30px 0;
  }
  .ol-spinner {
    width: 18px; height: 18px;
    border: 2px solid #b8bcbb;
    border-top-color: #616D6B;
    border-radius: 50%;
    animation: ol-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes ol-spin { to { transform: rotate(360deg); } }

  /* ── Error ── */
  .ol-error {
    background: #f9ecec;
    border: 1px solid rgba(179,64,64,0.2);
    color: #b34040;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 0.82rem;
  }

  /* ── Empty state ── */
  .ol-empty {
    text-align: center;
    padding: 40px 20px;
    background: #dddddc;
    border-radius: 12px;
    border: 1px dashed #b8bcbb;
    color: #7a8280;
  }

  .ol-empty-icon {
    font-size: 38px;
    margin-bottom: 10px;
    display: block;
    opacity: 0.6;
  }

  .ol-empty p {
    font-size: 0.88rem;
    margin: 0;
    font-weight: 500;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("ol-miltronix-styles")) {
  const t = document.createElement("style");
  t.id = "ol-miltronix-styles";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

// ─── Status mapper ───────────────────────────────────────────────────
const getStatus = (order) => {
  const os = order?.fulfillment?.orderStatus || "";
  if (["Pending"].includes(os)) return "Active";           // new order → Active
  if (["Confirmed", "Shipped"].includes(os)) return "Active";
  if (["Delivered", "Completed"].includes(os)) return "Delivered";
  if (os === "Cancelled") return "Cancelled";
  return "Active"; // default fallback → Active
};

const TABS = [
  { key: "active",    label: "Active Orders" },
  { key: "delivered", label: "Past Orders"   },
  { key: "cancelled", label: "Cancelled"     },
];

const TAB_EMPTY = {
  active:    { icon: "📦", text: "You have no active orders." },
  delivered: { icon: "✅", text: "You have no completed orders." },
  cancelled: { icon: "🚫", text: "You have no cancelled orders." },
};

const OrderList = () => {
  const navigate   = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res  = await getOrdersByUserApi();
        const list = res?.orders || [];
        const normalized = list.map((order) => ({
          ...order,
          status: getStatus(order),
        }));
        setOrders(normalized);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const counts = {
    active:    orders.filter((o) => o.status === "Active").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active")    return order.status === "Active";
    if (activeTab === "delivered") return order.status === "Delivered";
    if (activeTab === "cancelled") return order.status === "Cancelled";
    return true;
  });

  return (
    <div className="ol-root">
      <h5 className="ol-title">My Orders</h5>

      {/* ── Tabs ── */}
      <div className="ol-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`ol-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="ol-count">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="ol-loading">
          <span className="ol-spinner" />
          Loading orders…
        </div>
      ) : error ? (
        <div className="ol-error">⚠ {error}</div>
      ) : filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <div key={order._id} className="ol-item">
            <OrderCard order={order} />
          </div>
        ))
      ) : (
        <div className="ol-empty">
          <span className="ol-empty-icon">{TAB_EMPTY[activeTab].icon}</span>
          <p>{TAB_EMPTY[activeTab].text}</p>
        </div>
      )}
    </div>
  );
};

export default OrderList;