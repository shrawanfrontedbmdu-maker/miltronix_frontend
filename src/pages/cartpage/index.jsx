import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AccountPageLayout from "../../components/layout/AccountPageLayout";
import ShopCard from "../../components/ui/ShopCard";
import { getCartItems } from "../../api/api";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from backend
  const loadCart = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data?.items || []);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <>
      <Header />

      <main style={{ paddingTop: "180px", backgroundColor: "#D5D4D3" }}>
        <AccountPageLayout
          pageTitle="Cart"
          breadcrumbPath={["Home Page", "My Account", "Cart"]}
        >
          <div>
            <h5 className="mb-3" style={{ color: "#4e5954", fontWeight: 600 }}>
              My Cart ({cartItems.length})
            </h5>

            <div className="row g-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <ShopCard
                    key={item._id}
                    product={item.product}
                  />
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
          </div>
        </AccountPageLayout>
      </main>

      <Footer />
    </>
  );
};

export default CartPage;
