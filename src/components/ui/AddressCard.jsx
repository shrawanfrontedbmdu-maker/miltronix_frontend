import React from 'react';

const AddressCard = ({ address, onEdit, onRemove }) => {
  return (
    <div className="address-card">
      <div className="address-header-info d-flex justify-content-between align-items-center">
        <p className="name"><strong>{address.name}</strong></p>
        <a href="#" className="edit-link" onClick={() => onEdit(address.id)}>Edit Address</a>
      </div>
      <div className="address-details">
        <p>{address.addressLine1} <br /> {address.addressLine2}</p>
        <p>Mobile number: {address.mobile}</p>
      </div>
      <div className="address-actions">
        <button className="close-btn" onClick={() => onRemove(address.id)}>&times;</button>
      </div>
    </div>
  );
};

export default AddressCard;