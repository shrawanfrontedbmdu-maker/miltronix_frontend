import React, { useState } from "react";
import "./secendaddress.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate } from "react-router-dom";

function SecendAddress() {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate()
  const handleclick = () =>{
    navigate('/pay')
  }
  return (
    <>
    <Header/>
    <div className="has">

      {/* 🔹 Add Address Button TOP par */}
      <div className="add-address-wrapper top-btn">
        <button
          className="add-address-btn"
          onClick={() => setShowModal(true)}
        >
          Add To Address
        </button>
      </div>

      <div className="content-wrapper">
        {/* Address Card */}
        <div className="address-card">
          <h3>Nikhil Saini</h3>
          <p>
            B-5, B-41, B block, Sector 63,<br />
            Noida, Uttar Pradesh
          </p>
          <p>Mobile number: 8569876576</p>
        </div>

        {/* Payment Summary */}
        <div className="payment-card">
          <h3>Payment Summary</h3>
          <div className="row">
            <span>Total MRP</span>
            <span>₹4,999.00</span>
          </div>
          <div className="row discount">
            <span>Discount</span>
            <span>-₹1,000.00</span>
          </div>
          <div className="row">
            <span>Delivery Charges</span>
            <span>₹0.00</span>
          </div>
          <div className="row total">
            <span>Total Amount</span>
            <span>₹3,999.00</span>
          </div>
          <button className="checkout-btn" onClick={handleclick}>Checkout</button>
        </div>
      </div>

      {/* Modal */}
      <div className={`modal ${showModal ? "active" : ""}`}>
        <div className="modal-content">
          <button
            className="close-btn"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>

          <h2>Add New Address</h2>

          <form>
            <input type="text" placeholder="Full Name" />
            <input type="text" placeholder="Mobile Number" />
            <input type="text" placeholder="Address" />
            <input type="text" placeholder="City" />
            <input type="text" placeholder="State" />
            <input type="text" placeholder="Pincode" />

            <button type="submit" className="save-btn">
              Save Address
            </button>
          </form>
        </div>
      </div>
    </div>
     <div className="lock">

        <Footer/>
     </div>
    </>
  );
}

export default SecendAddress;
