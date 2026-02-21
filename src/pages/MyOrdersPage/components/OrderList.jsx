import React, { useEffect, useState } from "react";
import OrderCard from "../../../components/ui/OrderCard";
import { getOrdersByUserApi } from "../../../api/api";
import { useNavigate } from "react-router-dom";

// ─── Status mapper (backend compatible) ─────────────────────────────
const getStatus = (order) => {
  const os = order?.fulfillment?.orderStatus || "";

  if (["Confirmed", "Shipped"].includes(os)) return "Active";
  if (["Delivered", "Completed"].includes(os)) return "Delivered";
  if (os === "Cancelled") return "Cancelled";
  return "Pending";
};

const OrderList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersByUserApi();
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

  // ─── Tab counts ───────────────────────────────────────────────────
  const counts = {
    active: orders.filter((o) => o.status === "Active").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    pending: orders.filter(
      (o) => o.status === "Pending" || o.status === "Cancelled"
    ).length,
  };

  // ─── Filter by tab ────────────────────────────────────────────────
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active") return order.status === "Active";
    if (activeTab === "delivered") return order.status === "Delivered";
    if (activeTab === "pending")
      return order.status === "Pending" || order.status === "Cancelled";
    return true;
  });

  const tabLabel = {
    active: "active",
    delivered: "delivered",
    pending: "pending or cancelled",
  };

  // ─── Navigate to Review Form ──────────────────────────────────────
  // productId aur product info order se extract karke review page pe bhejo
  const handleWriteReview = (order) => {
    // Order mein product info — API structure ke hisaab se adjust karo
    const product =
      order?.items?.[0]?.product ||
      order?.orderItems?.[0]?.product ||
      order?.product ||
      null;

    const productId =
      product?._id ||
      order?.items?.[0]?.productId ||
      order?.orderItems?.[0]?.productId ||
      null;

    if (!productId) {
      alert("Product not found for this order.");
      return;
    }

    navigate(`/review/${productId}`, {
      state: { product, order },
    });
  };

  return (
    <div>
      <h5 className="mb-3" style={{ color: "#4e5954", fontWeight: 600 }}>
        My Orders
      </h5>

      {/* ── Tabs ── */}
      <div className="tab-links mb-4">
        <a
          href="#"
          className={activeTab === "active" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); setActiveTab("active"); }}
        >
          Active Orders ({counts.active})
        </a>

        <a
          href="#"
          className={activeTab === "delivered" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); setActiveTab("delivered"); }}
        >
          Past Orders ({counts.delivered})
        </a>

        <a
          href="#"
          className={activeTab === "pending" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); setActiveTab("pending"); }}
        >
          Pending / Cancelled ({counts.pending})
        </a>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <div key={order._id} style={{ marginBottom: "16px" }}>
            <OrderCard order={order} />

            {/* "Write a Review" button — sirf Delivered orders pe dikhega */}
            {order.status === "Delivered" && (
              <div style={{ marginTop: "8px", paddingLeft: "4px" }}>
                <button
                  onClick={() => handleWriteReview(order)}
                  style={{
                    padding: "8px 20px",
                    background: "#fff",
                    color: "#e63946",
                    border: "2px solid #e63946",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e63946";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#e63946";
                  }}
                >
                  ✍️ Write a Review
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        // Empty state — tab ke hisaab se message
        <div style={{
          textAlign: "center", padding: "40px 20px",
          background: "#f9f9f9", borderRadius: "12px",
          border: "1px dashed #ddd", color: "#aaa",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>
            {activeTab === "active" ? "📦" : activeTab === "delivered" ? "✅" : "🕐"}
          </div>
          <p style={{ fontSize: "15px", margin: 0 }}>
            You have no {tabLabel[activeTab]} orders.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderList;