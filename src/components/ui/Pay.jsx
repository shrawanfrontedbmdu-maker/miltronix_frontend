import React, { useState } from "react";
import "./Pay.css";

export default function Pay() {
  const [method, setMethod] = useState("card");

  return (
    <div className="payment-container">
      <div className="payment-left">
        <h2>Payment</h2>

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
                <button className="pay-btn">Proceed to Pay</button>
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
                <button className="pay-btn">Pay via UPI</button>
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
                <button className="pay-btn">Proceed to Net Banking</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="payment-right">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="product">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
              alt="Product"
            />
            <div>
              <p>MacBook Pro M3</p>
              <small>Space Grey, 16GB RAM</small>
            </div>
          </div>
        </div>

        <div className="price-summary">
          <h3>Payment Summary</h3>
          <div className="price-row">
            <span>Total MRP</span>
            <span>₹89,990</span>
          </div>
          <div className="price-row discount">
            <span>Discount</span>
            <span>-₹9,990</span>
          </div>
          <div className="price-row">
            <span>Delivery Charges</span>
            <span>₹0</span>
          </div>
          <hr />
          <div className="price-row total">
            <span>Total Amount</span>
            <span>₹80,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
