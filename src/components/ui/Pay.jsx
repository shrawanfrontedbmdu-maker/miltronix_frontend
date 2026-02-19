import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Pay.css";
import { createOrderApi } from "../../api/api";

export default function Pay() {
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedAddress = state && state.selectedAddress ? state.selectedAddress : null;
  const checkoutData = state && state.checkoutData ? state.checkoutData : null;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const pricing = checkoutData ? checkoutData.pricing : null;
  const firstItem =
    checkoutData && checkoutData.items && checkoutData.items[0]
      ? checkoutData.items[0]
      : null;

  async function handlePlaceOrder() {
    if (!user || !user._id) {
      setError("Please login to place order.");
      return;
    }
    if (!selectedAddress) {
      setError("No address selected. Please go back and select an address.");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      var formattedAddress = {
        fullName: selectedAddress.fullName || "",
        houseFlatNo: selectedAddress.houseFlatNo || selectedAddress.addressLine1 || "",
        buildingApartment: selectedAddress.buildingApartment || selectedAddress.addressLine2 || "",
        streetLocality: selectedAddress.streetLocality || selectedAddress.addressLine1 || "",
        landmark: selectedAddress.landmark || "",
        pinCode: selectedAddress.pinCode || selectedAddress.pincode || "",
        city: selectedAddress.city || "",
        state: selectedAddress.state || "",
      };

      var payload = {
        user: user._id,
        paymentMethod:
          method === "card"
            ? "CARD"
            : method === "upi"
            ? "UPI"
            : method === "netbanking"
            ? "NETBANKING"
            : "COD",
        paymentStatus: "Pending",
        shippingCost: 0,
        currency: "INR",
        orderStatus: "Processing",
        priority: "Normal",
        shippingAddress: formattedAddress,
        billingAddress: formattedAddress,
      };

      console.log("Order payload:", payload);
      var response = await createOrderApi(payload);
      navigate("/order-confirm", { state: { order: response.data } });
    } catch (err) {
      setError(err.message || "Order placement failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-left">
        <h2>Payment</h2>

        {error && (
          <div
            style={{
              color: "red",
              background: "#fff0f0",
              border: "1px solid #ffcccc",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 14,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {selectedAddress && (
          <div
            style={{
              background: "#f9f9f9",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            <strong>Delivering to:</strong>
            <div style={{ color: "#555", marginTop: 4 }}>
              {selectedAddress.fullName} —{" "}
              {selectedAddress.houseFlatNo || selectedAddress.addressLine1},{" "}
              {selectedAddress.streetLocality},{" "}
              {selectedAddress.city}, {selectedAddress.state} —{" "}
              {selectedAddress.pinCode || selectedAddress.pincode}
            </div>
          </div>
        )}

        <div className="payment-content">
          <div className="payment-methods">
            <div
              className={method === "card" ? "active" : ""}
              onClick={() => setMethod("card")}
            >
              💳 Credit/Debit Cards
            </div>
            <div
              className={method === "upi" ? "active" : ""}
              onClick={() => setMethod("upi")}
            >
              📲 UPI
            </div>
            <div
              className={method === "netbanking" ? "active" : ""}
              onClick={() => setMethod("netbanking")}
            >
              🏦 Net Banking
            </div>
            <div
              className={method === "cod" ? "active" : ""}
              onClick={() => setMethod("cod")}
            >
              💵 Cash on Delivery
            </div>
          </div>

          <div className="payment-form">
            {method === "card" && (
              <>
                <h3>Enter Credit/Debit Card Details</h3>
                <input type="text" placeholder="Card Number" />
                <div className="row">
                  <input type="text" placeholder="Expiry MM/YY" />
                  <input type="text" placeholder="CVV" />
                </div>
                <button
                  className="pay-btn"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? "Placing Order..." : "Proceed to Pay"}
                </button>
              </>
            )}

            {method === "upi" && (
              <>
                <h3>Scan QR Code to Pay</h3>
                <img
                  className="upi-qr"
                  src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf"
                  alt="UPI Scanner"
                />
                <input type="text" placeholder="Enter UPI ID" />
                <button
                  className="pay-btn"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? "Placing Order..." : "Pay via UPI"}
                </button>
              </>
            )}

            {method === "netbanking" && (
              <>
                <h3>Select Your Bank</h3>
                <select>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
                <button
                  className="pay-btn"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? "Placing Order..." : "Proceed to Net Banking"}
                </button>
              </>
            )}

            {method === "cod" && (
              <>
                <h3>Cash on Delivery</h3>
                <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
                  Pay when your order arrives at your doorstep.
                </p>
                <button
                  className="pay-btn"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? "Placing Order..." : "Place Order"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="payment-right">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {firstItem ? (
            <div className="product">
              <img
                src={
                  firstItem.images && firstItem.images[0]
                    ? firstItem.images[0]
                    : "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
                }
                alt={firstItem.title || firstItem.name || "Product"}
                onError={function (e) {
                  e.target.src =
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";
                }}
              />
              <div>
                <p>{firstItem.title || firstItem.name || "Product"}</p>
                <small>{firstItem.sku || ""}</small>
                {checkoutData && checkoutData.totalQuantity > 1 && (
                  <small style={{ display: "block", color: "#888", marginTop: 4 }}>
                    +{checkoutData.totalQuantity - (firstItem.quantity || 1)} more item(s)
                  </small>
                )}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: "#888" }}>No items found.</p>
          )}
        </div>

        <div className="price-summary">
          <h3>Payment Summary</h3>
          <div className="price-row">
            <span>Total MRP</span>
            <span>
              {pricing
                ? "₹" + Number(pricing.totalCutPrice).toLocaleString("en-IN")
                : "—"}
            </span>
          </div>
          <div className="price-row discount">
            <span>Discount</span>
            <span>
              {pricing
                ? "-₹" + Number(pricing.totalDiscount).toLocaleString("en-IN")
                : "—"}
            </span>
          </div>
          {pricing && pricing.couponDiscount > 0 && (
            <div className="price-row discount">
              <span>Coupon Discount</span>
              <span>
                -₹{Number(pricing.couponDiscount).toLocaleString("en-IN")}
              </span>
            </div>
          )}
          <div className="price-row">
            <span>Delivery Charges</span>
            <span style={{ color: "green" }}>FREE</span>
          </div>
          <hr />
          <div className="price-row total">
            <span>Total Amount</span>
            <span>
              {pricing
                ? "₹" + Number(pricing.finalAmount).toLocaleString("en-IN")
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}