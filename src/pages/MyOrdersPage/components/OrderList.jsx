import React, { useEffect, useState } from "react";
import OrderCard from "../../../components/ui/OrderCard";
import { getMyOrders } from "../../../api/api";

const OrderList = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data); // backend se jo array aayega
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active") return order.status === "Active";
    if (activeTab === "past") return order.status === "Delivered";
    if (activeTab === "pending") return order.status === "Pending" || order.status === "Failed";
    return true;
  });

  return (
    <div>
      <h5 className="mb-3" style={{ color: "#4e5954", fontWeight: 600 }}>
        My Orders
      </h5>

      <div className="tab-links mb-4">
        <a
          href="#"
          className={activeTab === "active" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("active");
          }}
        >
          Active Orders ({orders.filter(o => o.status === "Active").length})
        </a>

        <a
          href="#"
          className={activeTab === "past" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("past");
          }}
        >
          Past Orders
        </a>

        <a
          href="#"
          className={activeTab === "pending" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("pending");
          }}
        >
          Pending / Failed Orders
        </a>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))
      ) : (
        <p>You have no {activeTab} orders.</p>
      )}
    </div>
  );
};

export default OrderList;
