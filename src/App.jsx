import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetails";
import ProductListingPage from "./pages/ProductListingPage";
import AboutUsPage from "./pages/AboutUsPage";
import MyProfilePage from "./pages/MyProfilePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import WishlistPage from "./pages/WishlistPage";
import SavedAddressPage from "./pages/SavedAddressPage";
import PaymentPage from "./pages/PaymentPage";
import CareerPage from "./pages/careerpage";
import PressPage from "./pages/presspage";
import PartnersPage from "./pages/patnerspage";
import InvestorRelationsPage from "./pages/InvestorRelationsPage";
import CorporateSalesPage from "./pages/CorporateSalesPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import ContactUsPage from "./pages/ContactUsPage";
import CartPage from "./pages/cartpage";
import Checkout from "./components/ui/Checkout";
import OrderAddress from "./components/ui/OrderAddress";
import SecendAddress from "./components/ui/SecendAddress";
import Pay from "./components/ui/Pay";
import SearchPage from './pages/search/SearchPage';
import OrderConfirmPage from "./components/ui/orderConfirm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-details" element={<ProductDetailPage />} />
        <Route
          path="/category/:categoryName"
          element={<ProductListingPage />}
        />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/addresses" element={<SavedAddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/careers" element={<CareerPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/investor-relations" element={<InvestorRelationsPage />} />
        <Route path="/corporate-sales" element={<CorporateSalesPage />} />
        <Route path="/help-support" element={<HelpSupportPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderaddress" element={<OrderAddress />} />
        <Route path="/secendaddress" element={<SecendAddress />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/pay" element={<Pay />} />
      
        <Route path="/order-confirm" element={<OrderConfirmPage />} />
      </Routes>
    </Router>
  );
}

export default App;
