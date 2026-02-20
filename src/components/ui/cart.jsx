import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { 
  getCartItems, 
  addItemToCart, 
  removeCartItem, 
  applyCouponApi,
  getApplicableCouponsApi
} from "../../api/api";

const BACKEND_URL = "https://miltronix-backend-2.onrender.com";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [applicableCoupons, setApplicableCoupons] = useState([]);

  // Load cart
  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCartItems();
      setCart(data || { items: [], subtotal: 0 });
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart({ items: [], subtotal: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Load applicable coupons based on subtotal
  const loadApplicableCoupons = async (subtotal) => {
    try {
      const res = await getApplicableCouponsApi(subtotal || 0);
      if (res && res.success) setApplicableCoupons(res.applicableCoupons || []);
    } catch (err) {
      console.error("Failed to load applicable coupons:", err);
      setApplicableCoupons([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadCart();
    };
    init();
  }, []);

  useEffect(() => {
    if (cart.subtotal > 0) loadApplicableCoupons(cart.subtotal);
  }, [cart.subtotal]);

  // Quantity change
  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    try {
      const key = `${item.product?._id}-${item.variant?.sku || "default"}`;
      setUpdatingKey(key);
      const qtyDiff = newQty - (item.quantity || 0);
      if (qtyDiff === 0) return;

      await addItemToCart({
        productId: item.product?._id,
        sku: item.variant?.sku,
        quantity: qtyDiff,
      });

      await loadCart();
      setCouponApplied(null);
      setCouponError("");
    } catch (err) {
      alert("Failed to update cart item");
      console.error(err);
    } finally {
      setUpdatingKey(null);
    }
  };

  // Remove item
  const handleRemove = async (item) => {
    try {
      const key = `${item.product?._id}-${item.variant?.sku || "default"}`;
      setUpdatingKey(key);
      await removeCartItem({ productId: item.product?._id });
      await loadCart();
      setCouponApplied(null);
      setCouponError("");
    } catch (err) {
      alert("Failed to remove item");
      console.error(err);
    } finally {
      setUpdatingKey(null);
    }
  };

  // Apply coupon by code
  const handleApplyCoupon = async (code) => {
    const cCode = code || couponCode;
    if (!cCode) return setCouponError("Enter a coupon code");

    try {
      const response = await applyCouponApi(cart.subtotal || 0, cCode);
      if (response && response.success && response.appliedCoupon) {
        setCouponApplied(response.appliedCoupon);
        setCouponError("");
        setCouponCode(cCode);
      } else {
        setCouponError(response?.message || "Coupon not applicable");
        setCouponApplied(null);
      }
    } catch (err) {
      console.error(err);
      setCouponError(err.message || "Failed to apply coupon");
      setCouponApplied(null);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    await loadCart();
    if (!cart.items || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/orderaddress", {
      state: {
        coupon: couponApplied?.code,
        discountAmount: couponApplied?.discountAmount || 0,
      },
    });
  };

  if (loading) return <div className="text-center mt-5">Loading cart...</div>;

  return (
    <>
      <Header />
      <main style={{ paddingTop: "180px", backgroundColor: "#f2f2f2" }}>
        <div className="container py-4">
          <h5 className="mb-4 fw-bold">My Cart ({cart.items.length || 0})</h5>

          {cart.items.length === 0 ? (
            <div className="alert alert-info">Your cart is empty.</div>
          ) : (
            <>
              {/* Coupon Input */}
              <div className="mb-4">
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={() => handleApplyCoupon()}>
                    Apply
                  </button>
                </div>
                {couponError && <small className="text-danger d-block mb-2">{couponError}</small>}
                {couponApplied && (
                  <small className="text-success d-block mb-2">
                    Coupon applied! You saved ₹{couponApplied.discountAmount}.
                  </small>
                )}

                {/* Applicable Coupons List */}
                {applicableCoupons.length > 0 && (
                  <div className="mb-2">
                    <strong>Available Coupons:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {applicableCoupons.map((c) => (
                        <button
                          key={c._id}
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleApplyCoupon(c.code)}
                        >
                          {c.code} ({c.discountType === "flat" ? `₹${c.discountValue}` : `${c.discountValue}%`})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items */}
              {cart.items.map((item) => {
                const key = `${item.product?._id}-${item.variant?.sku || "default"}`;
                const imgPath = item.images?.[0];
                const imgUrl = imgPath
                  ? `${BACKEND_URL}/${imgPath?.url || imgPath}`
                  : "/images/placeholder.png";

                return (
                  <div key={key} className="card mb-3 shadow-sm">
                    <div className="card-body d-flex align-items-center justify-content-between">
                      {/* Product Info */}
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={imgUrl}
                          alt={item.title || "Product"}
                          style={{ width: 90, height: 90, objectFit: "cover" }}
                          className="rounded"
                        />
                        <div>
                          <h6 className="mb-1">{item.title || "Unnamed Product"}</h6>
                          <small className="text-muted">SKU: {item.variant?.sku || "N/A"}</small>
                          <p className="mb-0 fw-bold">₹{item.priceSnapshot || 0}</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          disabled={item.quantity <= 1 || updatingKey === key}
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="fw-bold">{item.quantity || 0}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          disabled={updatingKey === key}
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Total */}
                      <div className="fw-bold">₹{(item.quantity || 0) * (item.priceSnapshot || 0)}</div>

                      {/* Remove */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={updatingKey === key}
                        onClick={() => handleRemove(item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Subtotal & Discount */}
              <div className="card mt-4 shadow">
                <div className="card-body">
                  <h5 className="fw-bold">Subtotal: ₹{cart.subtotal || 0}</h5>
                  {couponApplied && (
                    <h6 className="fw-bold text-success">
                      Discount: ₹{couponApplied.discountAmount || 0} → Total: ₹{couponApplied.newTotalPrice || cart.subtotal}
                    </h6>
                  )}
                  <button className="btn btn-dark w-100 mt-3" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CartPage;