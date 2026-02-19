import React, { useEffect, useState } from "react";
import "./orderaddress.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate } from "react-router-dom";
import { getCheckoutDetailsApi } from "../../api/api";

function OrderAddress() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const HandleClick = () => {
    navigate("/secendaddress");
  };

  const loadCheckoutDetails = async () => {
    try {
      setLoading(true);
      const res = await getCheckoutDetailsApi(couponCode);

      if (res?.success) {
        setProducts(res.items || []);
        setPricing(res.pricing || null);
        setCouponError(res.couponError || "");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckoutDetails();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container-3">Loading checkout...</div>
        <Footer />
      </>
    );
  }

  if (!pricing) {
    return (
      <>
        <Header />
        <div className="container-3">No checkout data found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container-3">
        {/* PRODUCTS */}
        <div className="product-section-3">
          {products.length === 0 && <p>No items in cart</p>}

          {products.map((product) => (
            <div className="card-all" key={product.cartId}>
              <img src={product.image} alt={product.productName} />

              <div className="card-content-3">
                <h3>{product.productName}</h3>

                <p className="desc">
                  {product.brand} | SKU: {product.variant.sku}
                </p>

                <p className="price">
                  ₹{product.totalPrice.toLocaleString()}
                  <span className="tax">(incl. of taxes)</span>
                </p>

                <p>Qty: {product.quantity}</p>

                <button>Add to Wish List</button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="summary-section">
          <div className="summary-card">
            <h3>Order Summary ({products.length} Items)</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{pricing.subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <span>- ₹{pricing.totalDiscount.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Coupon Discount</span>
              <span>- ₹{pricing.couponDiscount.toLocaleString()}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{pricing.finalAmount.toLocaleString()}</span>
            </div>

            {/* Coupon Input */}
            <div className="coupon-box">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={loadCheckoutDetails}>Apply</button>
            </div>

            {couponError && (
              <p style={{ color: "red", marginTop: "8px" }}>{couponError}</p>
            )}

            <button className="checkout-btn" onClick={HandleClick}>
              Checkout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OrderAddress;
