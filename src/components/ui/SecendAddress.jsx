import React, { useEffect, useState } from "react";
import "./secendaddress.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate } from "react-router-dom";
import {
  getAddressesApi,
  addAddressApi,
  getCheckoutDetailsApi,
} from "../../api/api";

const EMPTY_FORM = {
  fullName: "",
  houseFlatNo: "",
  buildingApartment: "",
  streetLocality: "",
  landmark: "",
  pinCode: "",
  city: "",
  state: "",
  isDefault: false,
};

function SecendAddress() {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const data = await getAddressesApi();
      const list = data || [];
      setAddresses(list);
      // Auto-select default address, otherwise first one
      const def = list.find((a) => a.isDefault) || list[0] || null;
      setSelectedAddress(def);
    } catch (error) {
      alert(error.message || "Failed to load addresses");
    }
  };

  const fetchCheckoutDetails = async () => {
    try {
      setCheckoutLoading(true);
      const data = await getCheckoutDetailsApi();
      setCheckoutData(data);
    } catch (error) {
      alert(error.message || "Failed to load checkout details");
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchCheckoutDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // NOTE: userId NOT sent — backend controller uses req.user.id from JWT token
      const newAddress = await addAddressApi(formData);
      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddress(newAddress);
      setShowModal(false);
      setFormData(EMPTY_FORM);
    } catch (error) {
      alert(error.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    navigate("/pay", { state: { selectedAddress, checkoutData } });
  };

  const pricing = checkoutData?.pricing;

  return (
    <>
      <Header />

      <div className="has">
        <div className="add-address-wrapper top-btn">
          <button
            className="add-address-btn"
            onClick={() => setShowModal(true)}
          >
            + Add New Address
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            padding: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* ── LEFT: Address List ──────────────────────────────────────── */}
          <div style={{ flex: "1 1 55%", minWidth: "280px" }}>
            {addresses.length === 0 ? (
              <p style={{ color: "#888" }}>
                No saved addresses. Add one above.
              </p>
            ) : (
              addresses.map((address) => {
                const isSelected = selectedAddress?._id === address._id;
                return (
                  <div
                    key={address._id}
                    onClick={() => setSelectedAddress(address)}
                    style={{
                      border: isSelected ? "2px solid green" : "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      marginBottom: "12px",
                      cursor: "pointer",
                      background: isSelected ? "#f6fff6" : "#fff",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3 style={{ margin: "0 0 4px", fontSize: "15px" }}>
                        {address.fullName}
                        {address.isDefault && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 11,
                              color: "green",
                              fontWeight: "normal",
                            }}
                          >
                            (Default)
                          </span>
                        )}
                      </h3>
                      {isSelected && (
                        <span style={{ color: "green", fontSize: 18 }}>✓</span>
                      )}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#555",
                        lineHeight: 1.6,
                      }}
                    >
                      {address.houseFlatNo}
                      {address.buildingApartment
                        ? `, ${address.buildingApartment}`
                        : ""}
                      {", "}
                      {address.streetLocality}
                      {address.landmark ? `, Near ${address.landmark}` : ""}
                      <br />
                      {address.city}, {address.state} — {address.pinCode}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* ── RIGHT: Payment Summary ──────────────────────────────────── */}
          <div
            className="payment-card"
            style={{
              flex: "1 1 30%",
              minWidth: "260px",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "20px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              position: "sticky",
              top: "20px",
            }}
          >
            <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>
              Payment Summary
            </h3>

            {checkoutLoading ? (
              <p>Loading...</p>
            ) : pricing ? (
              <>
                <PriceRow
                  label="Total MRP"
                  value={`₹${pricing.totalCutPrice.toLocaleString("en-IN")}`}
                />
                <PriceRow
                  label="Discount"
                  value={`-₹${pricing.totalDiscount.toLocaleString("en-IN")}`}
                  green
                />
                {pricing.couponDiscount > 0 && (
                  <PriceRow
                    label="Coupon Discount"
                    value={`-₹${pricing.couponDiscount.toLocaleString("en-IN")}`}
                    green
                  />
                )}
                <PriceRow label="Delivery" value="FREE" green />
                <hr style={{ margin: "12px 0" }} />
                <PriceRow
                  label="Total Amount"
                  value={`₹${pricing.finalAmount.toLocaleString("en-IN")}`}
                  bold
                />
              </>
            ) : (
              <p style={{ color: "#888", fontSize: 14 }}>
                Could not load pricing
              </p>
            )}

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              style={{ width: "100%", marginTop: 16 }}
            >
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* ── MODAL ───────────────────────────────────────────────────────── */}
        {showModal && (
          <div className="modal active">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
              <h2>Add New Address</h2>

              <form onSubmit={handleSubmit}>
                <input
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="houseFlatNo"
                  placeholder="House / Flat No. *"
                  value={formData.houseFlatNo}
                  onChange={handleChange}
                  required
                />
                <input
                  name="buildingApartment"
                  placeholder="Building / Apartment (Optional)"
                  value={formData.buildingApartment}
                  onChange={handleChange}
                />
                <input
                  name="streetLocality"
                  placeholder="Street / Locality *"
                  value={formData.streetLocality}
                  onChange={handleChange}
                  required
                />
                <input
                  name="landmark"
                  placeholder="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={handleChange}
                />
                <input
                  name="pinCode"
                  placeholder="Pin Code *"
                  value={formData.pinCode}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />
                <input
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <input
                  name="state"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    margin: "10px 0",
                  }}
                >
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                  />
                  Set as Default Address
                </label>

                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Address"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

const PriceRow = ({ label, value, green = false, bold = false }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
  >
    <span style={{ color: "#555", fontWeight: bold ? 700 : 400 }}>{label}</span>
    <span
      style={{ color: green ? "green" : "#222", fontWeight: bold ? 700 : 400 }}
    >
      {value}
    </span>
  </div>
);

export default SecendAddress;
