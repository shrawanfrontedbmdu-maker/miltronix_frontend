// src/components/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { getCartItems, updateCartItem, removeCartItem } from "../../api/api";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch cart
  const fetchCart = async () => {
    try {
      const data = await getCartItems();
      // If backend returns items with price and quantity
      const subtotal = data.items.reduce(
        (sum, item) => sum + (item.priceSnapshot || item.price) * item.quantity,
        0
      );
      setCart({ items: data.items, subtotal });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      alert(err.response?.data?.message || "Failed to fetch cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const handleQtyChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setLoading(true);
    try {
      await updateCartItem(itemId, newQty); // Backend should handle itemId & quantity
      // Optimistically update cart locally
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQty } : item
        );
        const newSubtotal = updatedItems.reduce(
          (sum, item) => sum + (item.priceSnapshot || item.price) * item.quantity,
          0
        );
        return { items: updatedItems, subtotal: newSubtotal };
      });
    } catch (err) {
      console.error("Update quantity failed:", err);
      alert(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const handleRemove = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    setLoading(true);
    try {
      await removeCartItem(itemId);
      // Update cart locally without refetching
      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter((item) => item._id !== itemId);
        const newSubtotal = updatedItems.reduce(
          (sum, item) => sum + (item.priceSnapshot || item.price) * item.quantity,
          0
        );
        return { items: updatedItems, subtotal: newSubtotal };
      });
    } catch (err) {
      console.error("Remove item failed:", err);
      alert(err.response?.data?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">My Cart</h2>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items row g-3">
            {cart.items.map((item) => (
              <div key={item._id} className="col-12">
                <div className="d-flex align-items-center border p-3 rounded">
                  <img
                    src={item.image || "/images/placeholder.png"}
                    alt={item.title || "Product"}
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />

                  <div className="ms-3 flex-grow-1">
                    <h5>{item.title}</h5>
                    <p>₹{(item.priceSnapshot || item.price)?.toLocaleString() || 0}</p>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(item._id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="mt-4 d-flex justify-content-between align-items-center border-top pt-3">
            <h4>Subtotal: ₹{cart.subtotal?.toLocaleString()}</h4>
            <button className="btn btn-primary">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;