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
    try {
      setLoading(true);

      if (userId) {
        // Logged in: pehle guestWishlist merge karo, phir API se lo
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        if (guestWishlist.length > 0) {
          // guest items API mein add karo (best effort)
          await Promise.all(
            guestWishlist.map((item) =>
              import('../../api/api').then(({ addItemToWishlist }) =>
                addItemToWishlist({
                  userId,
                  productId: item.productId,
                  title: item.name,
                  images: [{ url: item.image, public_id: item.image, alt: item.name }],
                  category: item.category,
                  priceSnapshot: item.price,
                  variant: item.sku ? { sku: item.sku } : undefined,
                }).catch(() => {})
              )
            )
          );
          localStorage.removeItem("guestWishlist");
        }
        const data = await getUserWishlist(userId);
        setWishlistItems(data?.wishlist?.items || []);
      } else {
        // Guest: localStorage se dikhao
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        setWishlistItems(guestWishlist);
      }
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
    if (userId) {
      // Logged in: API call
      try {
        await removeWishlistItem(userId, itemId);
        setWishlistItems((items) => items.filter((item) => item._id !== itemId));
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
    } else {
      // Guest: localStorage se remove
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      const updated = guestWishlist.filter((item) => item.productId !== itemId);
      localStorage.setItem("guestWishlist", JSON.stringify(updated));
      setWishlistItems(updated);
    }
  };

  // ---------------- Build product (logged in items) ----------------
  const buildProduct = (item) => {
    // Guest item already flat format mein hota hai
    if (!item._id && item.productId) {
      return {
        _id: item.productId,
        name: item.name || "Product",
        images: [{ url: item.image }],
        category: item.category || "Uncategorized",
        variants: [
          {
            price: item.price || 0,
            sku: item.sku || "",
            hasStock: true,
            stockQuantity: 1,
          },
        ],
      };
    }

    // Logged in item
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

  // Guest item ka remove id — productId hoga
  const getRemoveId = (item) => item._id || item.productId;

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
              {wishlistItems.map((item, idx) => (
                <ShopCard
                  key={item._id || item.productId || idx}
                  product={buildProduct(item)}
                  variant={item.variant}
                  userId={userId}
                  onRemove={() => handleRemoveItem(getRemoveId(item))}
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