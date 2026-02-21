import React, { useEffect, useState } from "react";
import "./secendaddress.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  getAddressesApi,
  addAddressApi,
  getCheckoutDetailsApi,
  getCartItems,
} from "../../api/api";
import logoBanner from "../../assets/MILTRONIX APP DESIGN 3.png";

/* ─── Icons ─── */
const CheckIconWhite = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const LocationIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ─── Header ─── */
const ShippingHeader = () => (
  <div className="fixed-top">
    <section className="miltronix-banner d-flex justify-content-center align-items-center">
      <Link to="/">
        <img
          src={logoBanner}
          alt="Miltronix Logo"
          className="img-fluid miltronix-logo"
        />
      </Link>
    </section>
  </div>
);

/* ─── Step Indicator ─── */
const StepIndicator = ({ currentStep = 2 }) => {
  const steps = [
    { num: 1, label: "Shopping Cart" },
    { num: 2, label: "Shipping Detail" },
    { num: 3, label: "Preview your order" },
  ];
  return (
    <div className="step-indicator">
      <div className="step-indicator-inner">
        {steps.map((step, idx) => {
          const done = step.num < currentStep;
          const active = step.num === currentStep;
          return (
            <React.Fragment key={step.num}>
              <div className="step-item">
                <div
                  className={`step-circle ${done ? "done" : active ? "active" : ""}`}
                >
                  {done ? (
                    <CheckIconWhite />
                  ) : (
                    <span className="step-circle-num">{step.num}</span>
                  )}
                </div>
                <span
                  className={`step-label ${done ? "done" : active ? "active" : ""}`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`step-connector ${done ? "done" : ""}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Price Row helper ─── */
const PriceRow = ({ label, value, green = false, bold = false }) => (
  <div className="sa-price-row">
    <span className="sa-price-label" style={{ fontWeight: bold ? 800 : 400 }}>
      {label}
    </span>
    <span
      className={`sa-price-val ${green ? "green" : ""} ${bold ? "bold" : ""}`}
    >
      {value}
    </span>
  </div>
);

/* ─── Empty Form ─── */
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

/* ─── Main Component ─── */
function SecendAddress() {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  // ─── NEW: Cart items store karo ───
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Coupon passed from CartPage
  const couponCode = location.state?.coupon || null;
  const couponDiscount = Number(location.state?.discountAmount || 0);

  const fetchAddresses = async () => {
    try {
      const data = await getAddressesApi();
      const list = data || [];
      setAddresses(list);
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

  // ─── NEW: CartPage se same cart items fetch karo ───
  const fetchCartItems = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data?.items || []);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchCheckoutDetails();
    fetchCartItems(); // ← cart items bhi load karo
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
    navigate("/pay", {
      state: {
        selectedAddress,
        checkoutData,
        cartItems, // ← CartPage ke items Pass karo
        coupon: couponCode, // ← Coupon code pass karo
        discountAmount: couponDiscount, // ← Discount pass karo
      },
    });
  };

  const pricing = checkoutData?.pricing;

  return (
    <>
      <ShippingHeader />

      <div className="sa-page">
        <main className="sa-main">
          <StepIndicator currentStep={2} />

          <div className="sa-wrap">
            {/* ── LEFT — Addresses ── */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div className="sa-section-head" style={{ marginBottom: 0 }}>
                  Select Delivery Address
                </div>
                <button
                  className="sa-add-btn"
                  onClick={() => setShowModal(true)}
                >
                  <PlusIcon />
                  Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="sa-empty">
                  <LocationIcon />
                  <p style={{ marginTop: 10 }}>No saved addresses yet.</p>
                  <p>Add one to continue.</p>
                </div>
              ) : (
                addresses.map((address, idx) => {
                  const isSelected = selectedAddress?._id === address._id;
                  return (
                    <div
                      key={address._id}
                      className={`sa-address-card ${isSelected ? "selected" : ""}`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="sa-address-top">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="sa-address-name">
                            {address.fullName}
                          </span>
                          {address.isDefault && (
                            <span className="sa-default-badge">DEFAULT</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="sa-selected-check">
                            <CheckIconWhite />
                          </div>
                        )}
                      </div>
                      <p className="sa-address-text">
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

            {/* ── RIGHT — Payment Summary ── */}
            <div>
              <div className="sa-summary-card">
                <div className="sa-summary-title">Payment Summary</div>

                {checkoutLoading ? (
                  <div className="sa-loading">
                    <div className="sa-spinner" />
                  </div>
                ) : pricing ? (
                  <>
                    <PriceRow
                      label="Total MRP"
                      value={`₹${pricing.totalCutPrice.toLocaleString("en-IN")}`}
                    />
                    <PriceRow
                      label="Discount"
                      value={`− ₹${pricing.totalDiscount.toLocaleString("en-IN")}`}
                      green
                    />
                    {couponDiscount > 0 && (
                      <PriceRow
                        label={`Coupon${couponCode ? ` (${couponCode})` : ""}`}
                        value={`− ₹${couponDiscount.toLocaleString("en-IN")}`}
                        green
                      />
                    )}
                    <PriceRow label="Delivery" value="FREE" green />
                    <hr className="sa-divider" />
                    <div className="sa-total-row">
                      <span>Total Amount</span>
                      <span>
                        ₹
                        {Math.max(
                          0,
                          pricing.finalAmount - couponDiscount,
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="sa-savings-badge">
                        🎉 You save ₹{couponDiscount.toLocaleString("en-IN")}{" "}
                        with coupon!
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>
                    Could not load pricing
                  </p>
                )}

                <button
                  className="sa-proceed-btn"
                  onClick={handleCheckout}
                  disabled={!selectedAddress}
                >
                  Proceed to Payment
                </button>
                <p className="sa-secure-text">
                  Safe &amp; Secure Payments. Easy returns.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL — Add New Address ── */}
      {showModal && (
        <div
          className="sa-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="sa-modal">
            <button
              className="sa-modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <div className="sa-modal-title">Add New Address</div>

            <form className="sa-form" onSubmit={handleSubmit}>
              <input
                className="sa-input"
                name="fullName"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <div className="sa-form-row">
                <input
                  className="sa-input"
                  name="houseFlatNo"
                  placeholder="House / Flat No. *"
                  value={formData.houseFlatNo}
                  onChange={handleChange}
                  required
                />
                <input
                  className="sa-input"
                  name="buildingApartment"
                  placeholder="Building / Apartment"
                  value={formData.buildingApartment}
                  onChange={handleChange}
                />
              </div>
              <input
                className="sa-input"
                name="streetLocality"
                placeholder="Street / Locality *"
                value={formData.streetLocality}
                onChange={handleChange}
                required
              />
              <input
                className="sa-input"
                name="landmark"
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChange={handleChange}
              />
              <div className="sa-form-row">
                <input
                  className="sa-input"
                  name="pinCode"
                  placeholder="Pin Code *"
                  value={formData.pinCode}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />
                <input
                  className="sa-input"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                className="sa-input"
                name="state"
                placeholder="State *"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <label className="sa-checkbox-label">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
                Set as Default Address
              </label>
              <button type="submit" className="sa-save-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SecendAddress;
