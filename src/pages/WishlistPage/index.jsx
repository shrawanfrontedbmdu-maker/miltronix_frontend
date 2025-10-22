import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountPageLayout from '../../components/layout/AccountPageLayout';
import ShopCard from '../../components/ui/ShopCard';
import { wishlistData } from '../../data/mockData';

const WishlistPage = () => {
  // Manage the list of wishlist items in state
  const [wishlistItems, setWishlistItems] = useState(wishlistData);

  // Function to remove an item from the wishlist
  const handleRemoveItem = (productId) => {
    setWishlistItems(currentItems => currentItems.filter(item => item.id !== productId));
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: "180px", backgroundColor: "#D5D4D3" }}>
        <AccountPageLayout 
        pageTitle="Wishlist"
        breadcrumbPath={['Home Page', 'My Account', 'Wishlist']}
      >
        <div>
          {/* Title with dynamic item count */}
          <h5 className="mb-3" style={{ color: '#4e5954', fontWeight: 600 }}>
            My Wishlist ({wishlistItems.length})
          </h5>
          <div className="row g-4">
            {wishlistItems.length > 0 ? (
              wishlistItems.map(item => (
                <ShopCard 
                  key={item.id} 
                  product={item} 
                  onRemove={handleRemoveItem} // Pass the remove function to the card
                />
              ))
            ) : (
              <p>Your wishlist is empty.</p>
            )}
          </div>
        </div>
      </AccountPageLayout>
      </main>
      <Footer />
    </>
  );
};

export default WishlistPage;