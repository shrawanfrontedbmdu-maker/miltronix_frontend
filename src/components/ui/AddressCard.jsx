import React from "react";

const AddressCard = ({ address, onEdit, onRemove }) => {
  if (!address) return null;

  return (
    <div className="address-card">
      {/* Header */}
      <div className="address-header-info d-flex justify-content-between align-items-center">
        <p className="name">
          <strong>
            {address.fullName}
            {address.isDefault && " (Default)"}
          </strong>
        </p>

        <button
          type="button"
          className="edit-link"
          onClick={() => onEdit(address)}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
          }}
        >
          Edit Address
        </button>
      </div>

      {/* Details */}
      <div className="address-details">
        <p>
          {address.houseFlatNo}
          {address.buildingApartment && `, ${address.buildingApartment}`}
          {address.streetLocality && `, ${address.streetLocality}`}
          {address.landmark && `, Near ${address.landmark}`}
          <br />
          {address.city}, {address.state} - {address.pinCode}
        </p>
      </div>

      {/* Actions */}
      <div className="address-actions">
        <button
          type="button"
          className="close-btn"
          onClick={() => onRemove(address._id)}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AddressCard;