import React from 'react';

// Assume you have pencil and trash icons
const editIcon = 'bi-pencil';
const deleteIcon = 'bi-trash';

const PaymentCard = ({ card, onEdit, onRemove }) => {
  return (
    <div className="address-card1 d-flex justify-content-between align-items-center card-item">
      <div className="d-flex align-items-start">
        <img src={card.icon} className="credit-card mt-2 me-3" alt={`${card.type} Card`} />
        <div>
          <p className="card-title mb-1">{card.type} ending in {card.last4}</p>
          <p className="card-subtitle">Expires {card.expiry}</p>
        </div>
      </div>
      <div className="card-actions d-flex gap-3">
        <i className={`bi ${editIcon} edit-icon`} onClick={() => onEdit(card.id)} style={{ cursor: 'pointer' }}></i>
        <i className={`bi ${deleteIcon} delete-icon`} onClick={() => onRemove(card.id)} style={{ cursor: 'pointer' }}></i>
      </div>
    </div>
  );
};

export default PaymentCard;