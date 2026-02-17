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
  const userId = localStorage.getItem("userId") || "";

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getUserWishlist(userId);
      setWishlistItems(data?.wishlist?.items || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const handleRemoveItem = async (itemId) => {
    if (!userId) return;
    try {
      await removeWishlistItem(userId, itemId);
      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item._id !== itemId)
      );
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
    }
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

          {loading ? (
            <p>Loading wishlist...</p>
          ) : wishlistItems.length > 0 ? (
            <div className="row g-4">
              {wishlistItems.map((item) => (
                <ShopCard
                  key={item._id}
                  product={{
                    ...item.product,
                    images: item.images || item.product.images,
                    name: item.title || item.product.name,
                    category: item.category || item.product.category,
                  }}
                  variant={item.variant}
                  userId={userId}
                  wishlistItems={wishlistItems} // pass full wishlist for toggle check
                  onWishlistUpdate={fetchWishlist} // refresh wishlist dynamically
                />
              ))}
            </div>
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </AccountPageLayout>
      </main>
      <Footer />
    </>
  );
};

export default WishlistPage;
