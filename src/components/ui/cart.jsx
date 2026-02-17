import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "../../api/api";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await getCartItems();
      setCart(res || { items: [], subtotal: 0 });
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

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(itemId, quantity);
      await loadCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <div className="text-center my-5">Loading cart...</div>;

  if (!cart.items.length)
    return (
      <>
        <Header />
        <div className="container my-5 text-center">
          <h3>Your cart is empty 🛒</h3>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />

      <div className="container my-5">
        <h2 className="mb-4">My Cart</h2>

        {cart.items.map((item) => {
          const imgUrl =
            item.images?.length > 0
              ? item.images[0].url
              : "/images/placeholder.png";

          return (
            <div
              key={item._id}
              className="d-flex align-items-center justify-content-between border rounded p-3 mb-3"
            >
              {/* IMAGE */}
              <img
                src={imgUrl}
                alt={item.title}
                style={{ width: 80, height: 80, objectFit: "cover" }}
              />

              {/* DETAILS */}
              <div className="flex-grow-1 mx-3">
                <h6>{item.title}</h6>
                <p className="mb-1">SKU: {item.variant?.sku}</p>
                <p className="mb-1">Price: ₹{item.priceSnapshot}</p>
              </div>

              {/* QUANTITY */}
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
              <button
                className="btn btn-danger ms-3"
                onClick={() => handleRemove(item._id)}
              >
                Remove
              </button>
            </div>
          );
        })}

        {/* TOTAL */}
        <div className="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
          <h4>Total: ₹{cart.subtotal.toLocaleString()}</h4>
          <button className="btn btn-dark" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
