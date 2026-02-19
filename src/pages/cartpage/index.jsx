import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AccountPageLayout from "../../components/layout/AccountPageLayout";
import { getCartItems, addItemToCart, removeCartItem } from "../../api/api";

const BACKEND_URL = "https://miltronix-backend-2.onrender.com";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);

  // ---------------- Load Cart ----------------
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

  useEffect(() => {
    loadCart();
  }, []);

  // ---------------- Quantity Change ----------------
  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;

    try {
      setUpdatingKey(`${item.product._id}-${item.variant.sku}`);
      const qtyDiff = newQty - item.quantity;
      if (qtyDiff === 0) return;

      await addItemToCart({
        productId: item.product._id,
        sku: item.variant.sku,
        quantity: qtyDiff,
      });

      await loadCart();
    } catch (err) {
      alert("Failed to update cart item");
      console.error(err);
    } finally {
      setUpdatingKey(null);
    }
  };

  // ---------------- Remove Item ----------------
  const handleRemove = async (item) => {
    try {
      setUpdatingKey(`${item.product._id}-${item.variant.sku}`);
      await removeCartItem({ productId: item.product._id });
      await loadCart();
    } catch (err) {
      alert("Failed to remove item");
      console.error(err);
    } finally {
      setUpdatingKey(null);
    }
  };

  // ---------------- Checkout ----------------
  const handleCheckout = async () => {
    await loadCart();

    if (cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/orderaddress");
  };

  if (loading) return <div className="text-center mt-5">Loading cart...</div>;

  return (
    <>
      <Header />
      <main style={{ paddingTop: "180px", backgroundColor: "#f2f2f2" }}>
        <AccountPageLayout
          pageTitle="Cart"
          breadcrumbPath={["Home Page", "My Account", "Cart"]}
        >
          <h5 className="mb-4 fw-bold">My Cart ({cart.items.length})</h5>

          {cart.items.length === 0 ? (
            <div className="alert alert-info">Your cart is empty.</div>
          ) : (
            <>
              {cart.items.map((item) => {
                const imgPath =
                  item.images && item.images.length > 0 ? item.images[0] : null;
                const imgUrl = imgPath
                  ? `${BACKEND_URL}/${
                      typeof imgPath === "string" ? imgPath : imgPath.url
                    }`
                  : "/images/placeholder.png";

                return (
                  <div
                    key={`${item.product._id}-${item.variant.sku}`}
                    className="card mb-3 shadow-sm"
                  >
                    <div className="card-body d-flex align-items-center justify-content-between">
                      {/* Product Info */}
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={imgUrl}
                          alt={item.title}
                          style={{ width: 90, height: 90, objectFit: "cover" }}
                          className="rounded"
                        />
                        <div>
                          <h6 className="mb-1">{item.title}</h6>
                          <small className="text-muted">
                            SKU: {item.variant?.sku}
                          </small>
                          <p className="mb-0 fw-bold">₹{item.priceSnapshot}</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          disabled={item.quantity <= 1 || updatingKey === `${item.product._id}-${item.variant.sku}`}
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={updatingKey === `${item.product._id}-${item.variant.sku}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Total */}
                      <div className="fw-bold">
                        ₹{item.quantity * item.priceSnapshot}
                      </div>

                      {/* Remove */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemove(item)}
                        disabled={updatingKey === `${item.product._id}-${item.variant.sku}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Subtotal */}
              <div className="card mt-4 shadow">
                <div className="card-body">
                  <h5 className="fw-bold">Subtotal: ₹{cart.subtotal}</h5>
                  <button
                    className="btn btn-dark w-100 mt-3"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </AccountPageLayout>
      </main>
      <Footer />
    </>
  );
};

export default CartPage;
