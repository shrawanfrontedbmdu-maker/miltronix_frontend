import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetails'
import ProductListingPage from './pages/ProductListingPage'
import AboutUsPage from './pages/AboutUsPage';
import MyProfilePage from './pages/MyProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import WishlistPage from './pages/WishlistPage';
import SavedAddressPage from './pages/SavedAddressPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product-details" element={<ProductDetailPage />} />
          <Route path="/category/:categoryName" element={<ProductListingPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/addresses" element={<SavedAddressPage />} />
          <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  )
}

export default App