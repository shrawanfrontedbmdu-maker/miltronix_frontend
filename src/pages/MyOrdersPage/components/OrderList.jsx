import React, { useEffect, useState } from "react";
import OrderCard from "../../../components/ui/OrderCard";
import { getOrdersByUserApi } from "../../../api/api";

// ─── Status mapper ────────────────────────────────────────────────────────────
const getStatus = (order) => {
  const os = order?.fulfillment?.orderStatus || "";
  if (["Processing", "Packaging", "Shipped"].includes(os)) return "Active";
  if (["Delivered", "Completed"].includes(os)) return "Delivered";
  if (os === "Cancelled") return "Cancelled";
  return "Pending";
};

// ─── Get logged-in userId from localStorage ───────────────────────────────────
const getUserId = () => {
  try {
    const user = localStorage.getItem("user");
    if (user) return JSON.parse(user)?._id || JSON.parse(user)?.id || null;
    return null;
  } catch {
    return null;
  }
};

const OrderList = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = getUserId();

      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await getOrdersByUserApi(userId);
        const list = res?.data || [];
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

  // ─── Tab counts ─────────────────────────────────────────────────────────────
  const counts = {
    active:    orders.filter((o) => o.status === "Active").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    pending:   orders.filter((o) => o.status === "Pending" || o.status === "Cancelled").length,
  };

  // ─── Filter by tab ───────────────────────────────────────────────────────────
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active")    return order.status === "Active";
    if (activeTab === "delivered") return order.status === "Delivered";
    if (activeTab === "pending")   return order.status === "Pending" || order.status === "Cancelled";
    return true;
  });

  const tabLabel = {
    active:    "active",
    delivered: "delivered",
    pending:   "pending or cancelled",
  };

  return (
    <div>
      <h5 className="mb-3" style={{ color: "#4e5954", fontWeight: 600 }}>
        My Orders
      </h5>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
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

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))
      ) : (
        <p>You have no {tabLabel[activeTab]} orders.</p>
      )}
    </div>
  );
};

export default OrderList;