import React, { useState, useEffect, useRef } from "react";
import AuthModals from "../auth/AuthModals";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import { Bell } from "lucide-react";
import axios from "axios";

// Assets
import logoBanner from "../../assets/MILTRONIX APP DESIGN 3.png";
import cartIcon from "../../assets/SVG.svg";
import userIcon from "../../assets/icon 6.svg";
import locationIcon from "../../assets/Icon 2.svg";
import searchIcon from "../../assets/Icon 3.svg";
import dropdownIcon from "../../assets/icon 4.svg";
import wishlistIcon from "../../assets/icon 5.svg";
import Notifications from "../../pages/Notification/Notifications";

function Header() {
  const [modalToShow, setModalToShow] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // 🔥 New states for search
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     🔥 Debounce Search Input
  ========================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* =========================
     🔥 Fetch Suggestions
  ========================== */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          `${baseUrl}/products/search-suggestions?q=${debouncedQuery}`
        );

        setSuggestions(res.data.products || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  /* =========================
     🔥 Close Dropdown on Outside Click
  ========================== */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     🔥 Handle Search Click
  ========================== */
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    let url = `/search?q=${encodeURIComponent(searchQuery)}`;

    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }

    navigate(url);
    setShowDropdown(false);
  };

  return (
    <>
      <div className="fixed-top">
        {/* Logo Section */}
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <Link to="/">
            <img
              src={logoBanner}
              alt="Miltronix Logo"
              className="img-fluid miltronix-logo"
            />
          </Link>
        </section>

        {/* Header Container */}
        <div className="header-container bg-transparent d-flex justify-content-between align-items-center px-4 py-2">
          
          {/* Cart */}
          <Link to="/cart" className="text-decoration-none see-more main">
            <div className="cart-box d-flex align-items-center justify-content-center">
              <img src={cartIcon} alt="Cart" width="16" height="16" />
              <span className="d-none d-lg-block ms-2">Cart</span>
            </div>
          </Link>

          {/* 🔥 Search Bar */}
          <div
            ref={dropdownRef}
            className="search-bar d-lg-flex d-none align-items-center px-3 py-1 position-relative"
            style={{
              flex: "0 1 45%",
              marginLeft: "auto",
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex align-items-center me-2">
              <img src={locationIcon} alt="Location" width="16" height="16" />
              <span className="text-nowrap text-muted ms-2">
                Set location
              </span>
            </div>

            <div className="vr mx-2"></div>

            <img src={searchIcon} alt="Search" width="16" height="16" />

            <input
              type="text"
              className="form-control border-0 shadow-none p-0 search-input ms-2"
              placeholder="Search for LED TV, CCTV, Video Wall...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            {/* <span className="ms-2 text-nowrap">
              <strong>All</strong>
              <img
                src={dropdownIcon}
                alt="Dropdown"
                className="ms-2"
                width="16"
                height="16"
              />
            </span> */}

            {/* 🔥 Dropdown Suggestions */}
            {showDropdown && suggestions.length > 0 && (
              <div
                className="position-absolute bg-white shadow rounded mt-2"
                style={{
                  top: "100%",
                  left: 0,
                  width: "100%",
                  zIndex: 999,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((product) => {
                  const firstVariant = product.variants?.[0];
                  const price = firstVariant?.price || 0;
                  const image =
                    firstVariant?.images?.[0]?.url ||
                    product.images?.[0]?.url ||
                    "";

                  return (
                    <div
                      key={product._id}
                      className="d-flex align-items-center p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        setShowDropdown(false);
                        setSearchQuery("");
                      }}
                    >
                      <img
                        src={image}
                        alt={product.name}
                        width="40"
                        height="40"
                        className="me-2 rounded"
                      />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "500" }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "#666" }}>
                          ₹{price}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* View All Results */}
                <div
                  className="text-center p-2 fw-bold text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={handleSearch}
                >
                  View all results
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="wishlist-box mx-2">
            <Link to="/wishlist">
              <img src={wishlistIcon} alt="Wishlist" />
            </Link>
          </div>

          {/* Notifications */}
          <div className="mx-2">
            <Bell onClick={() => setShowNotification(!showNotification)} />
            {showNotification && (
              <Notifications
                show={showNotification}
                onClose={() => setShowNotification(false)}
              />
            )}
          </div>

          {/* User / Signup */}
          {user ? (
            <Link
              to="/my-profile"
              className="signup-box d-flex align-items-center text-decoration-none"
            >
              <img src={userIcon} alt="My Account" width="16" height="16" />
              <span className="d-none d-lg-block ms-2">My Account</span>
            </Link>
          ) : (
            <div
              className="signup-box d-flex align-items-center"
              onClick={() => setModalToShow("signup")}
              style={{ cursor: "pointer" }}
            >
              <img src={userIcon} alt="Sign Up" width="16" height="16" />
              <span className="d-none d-lg-block ms-2">Sign/Signup</span>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modals */}
      <AuthModals modalToShow={modalToShow} setModalToShow={setModalToShow} />
    </>
  );
}

export default Header;
