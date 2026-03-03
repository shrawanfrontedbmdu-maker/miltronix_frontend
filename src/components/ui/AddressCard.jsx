import React from "react";

const AddressCard = ({ address, onEdit, onRemove }) => {
  if (!address) return null;

  return (
    <div className="address-card h-100 shadow-sm border-0 position-relative">
      {/* Top Right Close Button - Sits perfectly in corner as per your CSS */}
      <button
        type="button"
        className="close-btn border-0 bg-transparent"
        onClick={() => onRemove(address._id)}
        title="Remove Address"
      >
        &times;
      </button>

      {/* Header Info */}
      <div className="address-header-info d-flex justify-content-between align-items-start pe-4">
        <div>
          <h6 className="name text-uppercase fw-bold mb-1" style={{ color: "#616D6B" }}>
            {address.fullName}
          </h6>
          {address.isDefault && (
            <span 
              className="badge rounded-pill fw-normal px-2 py-1" 
              style={{ backgroundColor: "#616D6B", fontSize: "10px", letterSpacing: "1px" }}
            >
              DEFAULT
            </span>
          )}
        </div>
        
        <button
          type="button"
          className="edit-link p-0 bg-transparent border-0 fw-bold text-uppercase"
          onClick={() => onEdit(address)}
          style={{ fontSize: "12px", letterSpacing: "0.5px" }}
        >
          Edit Address
        </button>
      </div>

      {/* Address Details Body */}
      <div className="address-details mt-3">
        <p className="mb-1" style={{ fontSize: "14px", lineHeight: "1.6", color: "#4A5753" }}>
          <span className="fw-bold">{address.houseFlatNo}</span>
          {address.buildingApartment && `, ${address.buildingApartment}`}
          <br />
          {address.streetLocality}
          {address.landmark && <span className="text-muted italic"> (Near {address.landmark})</span>}
          <br />
          <span className="text-uppercase">
            {address.city}, {address.state} — <strong>{address.pinCode}</strong>
          </span>
        </p>
      </div>

      {/* Optional: Add a subtle hover effect line or icon if you want */}
      <div className="address-actions mt-2 d-flex justify-content-end">
         {/* Actions logic can go here if needed later */}
      </div>
    </div>
  );
};

export default AddressCard;
