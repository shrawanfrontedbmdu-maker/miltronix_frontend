// ================= WishlistPage.jsx =================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountPageLayout from '../../components/layout/AccountPageLayout';
import ShopCard from '../../components/ui/ShopCard';
import { getUserWishlist, removeWishlistItem } from '../../api/api';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user") || "null")?._id || "";

  // ---------------- Fetch Wishlist ----------------
  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getUserWishlist(userId);
      setWishlistItems(data?.wishlist?.items || []);
    } catch (err) {
      setWishlistItems([]);
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  // ---------------- Remove Item ----------------
  const handleRemoveItem = async (itemId) => {
    if (!userId) return;
    try {
      await removeWishlistItem(userId, itemId);
      setWishlistItems((items) =>
        items.filter((item) => item._id !== itemId)
      );
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // ---------------- Build product ----------------
  const buildProduct = (item) => {
    const base = item.product && typeof item.product === "object" ? item.product : {};
    return {
      ...base,
      _id: base._id || item.product,
      name: item.title || base.name || "Product",
      images: item.images?.length > 0 ? item.images : base.images || [],
      category: item.category || base.category || "Uncategorized",
      variants: base.variants || [
        {
          price: item.priceSnapshot || 0,
          sku: item.variant?.sku || "",
          hasStock: true,
          stockQuantity: 1,
        },
      ],
    };
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: "180px", backgroundColor: "#D5D4D3" }}>
        <AccountPageLayout
          pageTitle="Wishlist"
          breadcrumbPath={['Home Page', 'My Account', 'Wishlist']}
        >
          <h5 className="mb-3" style={{ color: '#4e5954', fontWeight: 600 }}>
            My Wishlist ({wishlistItems.length})
          </h5>

          {/* ---- Not logged in ---- */}
          {!userId ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              Please{" "}
              <span
                style={{ color: '#4e5954', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate("/login")}
              >
                login
              </span>{" "}
              to view your wishlist.
            </p>

          ) : loading ? (
            <p>Loading wishlist...</p>

          ) : wishlistItems.length > 0 ? (
            <div className="row g-4">
              {wishlistItems.map((item) => (
                <ShopCard
                  key={item._id}
                  product={buildProduct(item)}
                  variant={item.variant}
                  userId={userId}
                  onRemove={() => handleRemoveItem(item._id)}
                />
              ))}
            </div>

          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              Your wishlist is empty.
            </p>
          )}

        </AccountPageLayout>
      </main>
      <Footer />
    </>
  );
};

export default WishlistPage;
