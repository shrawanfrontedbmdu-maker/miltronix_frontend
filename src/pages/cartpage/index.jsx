// src/pages/cart/CartPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AccountPageLayout from "../../components/layout/AccountPageLayout";
import { getCartItems, updateCartItem, removeCartItem } from "../../api/api";

const BACKEND_URL = "http://localhost:3000";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);

  // Load cart from backend
  const loadCart = async () => {
    setLoading(true);
    try {
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

  // Update quantity
  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return; // Prevent invalid quantity
    try {
      await updateCartItem(itemId, { quantity });
      await loadCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <>
      <Header />

      <main style={{ paddingTop: "180px", backgroundColor: "#D5D4D3" }}>
        <AccountPageLayout
          pageTitle="Cart"
          breadcrumbPath={["Home Page", "My Account", "Cart"]}
        >
          <div className="container">
            <h5 className="mb-3" style={{ color: "#4e5954", fontWeight: 600 }}>
              My Cart ({cart.items.length})
            </h5>

            {cart.items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <div className="row g-4">
                  {cart.items.map((item) => {
                    const product = item.product || {};
                    const imgUrl = product.images?.[0]?.url || "/images/placeholder.png";

                    return (
                      <div
                        key={item._id}
                        className="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center border p-3"
                      >
                        <img
                          src={imgUrl}
                          alt={product.title}
                          style={{ width: 150, height: 150, objectFit: "cover" }}
                        />
                        <h6 className="mt-2">{product.title}</h6>
                        <p>₹{item.priceSnapshot.toLocaleString()}</p>

                        {/* Quantity controls */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          className="btn btn-sm btn-danger mt-2"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & Checkout */}
                <div className="mt-4 text-end">
                  <h4>Total: ₹{cart.subtotal.toLocaleString()}</h4>
                  <button className="btn btn-primary">Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </AccountPageLayout>
      </main>

      <Footer />
    </>
  );
};

export default CartPage;
