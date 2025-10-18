import React from 'react';

const starIconFull = '/src/assets/icon 7.svg';
const starIconEmpty = '/src/assets/icon 8.svg';

const OrderCard = ({ order }) => {
  return (
    <div className="order-card d-flex gap-3">
      <div className="order-image">
        <img src={order.image} alt={order.title} className="img-fluid rounded custom-order-img" />
      </div>

      <div className="order-details flex-grow-1">
        <div className="order-title mb-2">{order.title}</div>
        <div className="mb-2">
          {[...Array(5)].map((_, i) => (
            <img key={i} src={i < order.rating ? starIconFull : starIconEmpty} className="star" alt="star" />
          ))}
        </div>
        <div className="order-price">₹{order.price}</div>
        <div className="order-tax">(Incl. all Taxes)</div>
      </div>

      <div className="d-flex flex-column align-items-end">
        <button className="track-btn mt-auto">Track order</button>
      </div>
    </div>
  );
};

export default OrderCard;