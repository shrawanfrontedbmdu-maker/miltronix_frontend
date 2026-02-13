import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCartItems, updateCartItem, removeCartItem } from "../../api/api";

const BACKEND_URL = "https://miltronix-backend-1.onrender.com";

const Cart = () => {
  const navigate = useNavigate(); // ✅ INIT
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
      await updateCartItem(itemId, { quantity });
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



  if (loading) return <div>Loading cart...</div>;
  if (!cart.items.length) return <div>Your cart is empty</div>;

  return (
    <>
      <Header />
      <div className="container my-5">
        <h2>My Cart</h2>

        {cart.items.map((item) => {
          const imgUrl = item.product?.image
            ? `${BACKEND_URL}${item.product.image}`
            : "/images/placeholder.png";

          return (
            <div
              key={item._id}
              className="d-flex align-items-center justify-content-between border p-3 mb-3"
            >
              <img src={imgUrl} alt={item.product?.title} style={{ width: 80, height: 80 }} />

              <div>
                <h6>{item.product?.title}</h6>
                <p>₹{item.priceSnapshot}</p>
              </div>

              <div>
                <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
              </div>

              <button onClick={() => handleRemove(item._id)}>Remove</button>
            </div>
          );
        })}

        <h4>Total: ₹{cart.subtotal}</h4>

        <button className="btn btn-dark mt-3" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
