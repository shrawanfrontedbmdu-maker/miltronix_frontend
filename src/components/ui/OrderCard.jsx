import React from "react";

const starIconFull = "/src/assets/icon 7.svg";
const starIconEmpty = "/src/assets/icon 8.svg";

const OrderCard = ({ order }) => {
  // Pehla item dikhaenge
  const firstItem = order.items[0]?.product || {};

  // Total price show karenge backend se
  const totalPrice = order.totalPrice || 0;

  return (
    <div className="order-card d-flex gap-3 p-3 border rounded mb-3">
      <div className="order-image">
        <img
          src={firstItem.image}
          alt={firstItem.title}
          className="img-fluid rounded custom-order-img"
        />
      </div>

      <div className="order-details flex-grow-1">
        <div className="order-title mb-2">{firstItem.title}</div>

        <div className="mb-2">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={i < (firstItem.rating || 0) ? starIconFull : starIconEmpty}
              className="star"
              alt="star"
            />
          ))}
        </div>

        <div className="order-price">₹{totalPrice}</div>
        <div className="order-tax">(Incl. all Taxes)</div>
        <div className="order-status mt-2">
          <strong>Status:</strong> {order.status}
        </div>
        <div className="order-date text-muted">
          <small>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</small>
        </div>
      </div>

      <div className="d-flex flex-column align-items-end">
        <button className="track-btn mt-auto">Track order</button>
      </div>
    </div>
  );
};

export default OrderCard;
