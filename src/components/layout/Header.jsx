import React, { useState, useEffect, useRef, useCallback } from "react";
import AuthModals from "../auth/AuthModals";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, ShoppingCart, Heart, User, Search, X, MapPin } from "lucide-react";
import { getCartItems, getUserWishlist } from "../../api/api";
import axios from "axios";

import logo from "../../assets/logo.png";
import Notifications from "../../pages/Notification/Notifications";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://miltronix-backend-2.onrender.com";

// ─── Global cache — ek baar fetch, baad mein instant ─────────────────────────
let countsCache = null; // { cartCount, wishlistCount, notifCount, notifications }
let lastFetchTime = 0;
const CACHE_TTL = 30000; // 30 seconds

const headerStyles = `
  /* ── BANNER ── */
  .mil-banner {
    background-color: #616D6B;
    padding: 6px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mil-banner-text {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }
  .mil-banner-links {
    display: flex;
    gap: 18px;
  }
  .mil-banner-links a {
    font-size: 11px;
    color: rgba(255,255,255,0.75);
    text-decoration: none;
    transition: color 0.2s;
  }
  .mil-banner-links a:hover { color: #fff; }

  /* ── MAIN HEADER ── */
  .mil-header {
    background-color: #D5D4D3;
    border-bottom: 1px solid rgba(97,109,107,0.2);
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 80px;
    gap: 14px;
    box-shadow: 0 2px 10px rgba(97,109,107,0.1);
  }

  /* ── LOGO ── */
  .mil-logo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  .mil-logo img {
    height: 70px;
    width: auto;
    object-fit: contain;
  }

  /* ── SEARCH ── */
  .mil-search-wrap {
    flex: 1;
    max-width: 580px;
    margin: 0 auto;
    position: relative;
  }
  .mil-search-box {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 50px;
    padding: 0 14px;
    height: 44px;
    gap: 0;
    border: 1.5px solid transparent;
    box-shadow: 0 1px 4px rgba(97,109,107,0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }
  .mil-search-box:focus-within {
    border-color: #616D6B;
    box-shadow: 0 0 0 3px rgba(97,109,107,0.12);
  }
  .mil-loc-part {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    padding-right: 12px;
    border-right: 1.5px solid #E0DFDE;
    cursor: pointer;
    margin-right: 10px;
  }
  .mil-loc-part span {
    font-size: 11px;
    font-weight: 600;
    color: #616D6B;
    white-space: nowrap;
    font-family: "Bricolage Grotesque", sans-serif;
  }
  .mil-search-icon {
    color: #616D6B;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-right: 7px;
  }
  .mil-search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 13px;
    color: #333;
    background: transparent;
    font-family: "Bricolage Grotesque", sans-serif;
    min-width: 0;
  }
  .mil-search-input::placeholder { color: #9a9a9a; }
  .mil-clear-btn {
    background: none;
    border: none;
    padding: 0;
    color: #aaa;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    margin-left: 6px;
  }
  .mil-clear-btn:hover { color: #616D6B; }

  /* ── SUGGESTIONS DROPDOWN ── */
  .mil-suggestions {
    position: absolute;
    top: calc(100% + 8px);
    left: 0; right: 0;
    background: #fff;
    border: 1px solid rgba(97,109,107,0.12);
    border-radius: 16px;
    overflow: hidden;
    z-index: 1050;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 12px 40px rgba(97,109,107,0.15);
    animation: milDrop 0.15s ease;
  }
  @keyframes milDrop {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mil-sugg-header {
    padding: 9px 16px;
    font-size: 11px;
    color: #888;
    border-bottom: 1px solid #f0f0f0;
    background: #fafaf9;
  }
  .mil-sugg-header strong { color: #4e5954; }
  .mil-sugg-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f4;
    transition: background 0.15s;
  }
  .mil-sugg-item:hover { background: #f7f7f5; }
  .mil-sugg-thumb {
    width: 48px; height: 48px;
    border-radius: 8px;
    object-fit: contain;
    background: #f5f5f4;
    flex-shrink: 0;
  }
  .mil-sugg-name {
    font-size: 13px; font-weight: 600;
    color: #333; line-height: 1.3; margin: 0;
  }
  .mil-sugg-brand {
    font-size: 11px; color: #888; margin: 2px 0 0;
  }
  .mil-sugg-price {
    font-size: 13px; color: #616D6B;
    font-weight: 700; margin: 3px 0 0;
  }
  .mil-sugg-close {
    display: flex; align-items: center; justify-content: center;
    gap: 5px; padding: 9px;
    font-size: 12px; color: #888;
    cursor: pointer; background: #fafaf9;
    border-top: 1px solid #f0f0f0;
    transition: color 0.2s;
  }
  .mil-sugg-close:hover { color: #616D6B; }
  .mil-suggestions::-webkit-scrollbar { width: 4px; }
  .mil-suggestions::-webkit-scrollbar-thumb {
    background: rgba(97,109,107,0.2); border-radius: 2px;
  }

  /* ── RIGHT ACTIONS ── */
  .mil-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* ── ICON BUTTON ── */
  .mil-icon-btn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    width: 56px;
    height: 54px;
    border-radius: 12px;
    color: #4e5954;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
  }
  .mil-icon-btn:hover,
  .mil-icon-btn:focus {
    background: rgba(97,109,107,0.1);
    color: #2e3835;
    text-decoration: none;
  }
  .mil-icon-btn.is-active {
    background: rgba(97,109,107,0.13);
    color: #2e3835;
  }
  .mil-icon-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    line-height: 1;
    text-transform: uppercase;
    color: inherit;
  }

  /* ── BADGE ── */
  .mil-badge {
    position: absolute;
    top: 6px;
    right: 5px;
    min-width: 17px;
    height: 17px;
    border-radius: 50px;
    background: #4e5954;
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    border: 2px solid #D5D4D3;
    line-height: 1;
    pointer-events: none;
    animation: milPop 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes milPop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  /* ── DIVIDER ── */
  .mil-vdiv {
    width: 1px;
    height: 30px;
    background: rgba(97,109,107,0.22);
    margin: 0 6px;
    flex-shrink: 0;
  }

  /* ── SIGN IN BUTTON ── */
  .mil-signin-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 18px;
    height: 38px;
    background: #616D6B;
    border: none;
    border-radius: 50px;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    cursor: pointer;
    white-space: nowrap;
    font-family: "Bricolage Grotesque", sans-serif;
    box-shadow: 0 2px 10px rgba(97,109,107,0.3);
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .mil-signin-btn:hover {
    background: #4e5954;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(97,109,107,0.35);
  }
  .mil-signin-btn:active { transform: translateY(0); }

  /* ── NOTIFICATION PANEL ── */
  .mil-notif-wrap { position: relative; }
  .mil-notif-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 1050;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 991px) {
    .mil-search-wrap { display: none; }
    .mil-header { height: 70px; }
  }
  @media (max-width: 767px) {
    .mil-header { padding: 0 12px; gap: 4px; height: 60px; }
    .mil-banner { padding: 5px 12px; }
    .mil-banner-links { display: none; }
    .mil-icon-label { display: none; }
    .mil-icon-btn { width: 42px; height: 42px; }
    .mil-logo img { height: 50px; }
    .mil-signin-btn span { display: none; }
    .mil-signin-btn {
      width: 38px; height: 38px;
      padding: 0;
      border-radius: 50%;
      justify-content: center;
    }
  }
`;

function Header() {
  const [modalToShow, setModalToShow] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Cache se initialize karo — instant display
  const [cartCount, setCartCount] = useState(countsCache?.cartCount || 0);
  const [wishlistCount, setWishlistCount] = useState(countsCache?.wishlistCount || 0);
  const [notifCount, setNotifCount] = useState(countsCache?.notifCount || 0);
  const [notifications, setNotifications] = useState(countsCache?.notifications || []);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getToken = () => localStorage.getItem("token");
  const getUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      return u?._id || null;
    } catch { return null; }
  };
  const isLoggedIn = () => !!getToken();

  const fetchCounts = useCallback(async (force = false) => {
    const now = Date.now();

    // Cache valid hai aur force nahi — skip
    if (!force && countsCache && (now - lastFetchTime) < CACHE_TTL) {
      setCartCount(countsCache.cartCount);
      setWishlistCount(countsCache.wishlistCount);
      setNotifCount(countsCache.notifCount);
      setNotifications(countsCache.notifications);
      return;
    }

    if (!isLoggedIn()) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      const cc = guestCart.reduce((sum, i) => sum + (i.quantity || 1), 0);
      const wc = guestWishlist.length;
      setCartCount(cc);
      setWishlistCount(wc);
      setNotifCount(0);
      countsCache = { cartCount: cc, wishlistCount: wc, notifCount: 0, notifications: [] };
      lastFetchTime = now;
      return;
    }

    // Sab parallel fetch karo — ek baar mein
    const [cartRes, wishRes, notifRes] = await Promise.allSettled([
      getCartItems(),
      getUserId() ? getUserWishlist(getUserId()) : Promise.resolve(null),
      axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    ]);

    const cc = cartRes.status === "fulfilled"
      ? (cartRes.value?.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0)
      : 0;

    const wc = wishRes.status === "fulfilled"
      ? (wishRes.value?.wishlist?.items?.length || 0)
      : 0;

    const allNotifs = notifRes.status === "fulfilled"
      ? (notifRes.value?.data?.notifications || [])
      : [];

    const nc = allNotifs.filter((n) => !n.isRead).length;

    setCartCount(cc);
    setWishlistCount(wc);
    setNotifCount(nc);
    setNotifications(allNotifs);

    // Cache update
    countsCache = { cartCount: cc, wishlistCount: wc, notifCount: nc, notifications: allNotifs };
    lastFetchTime = now;
  }, []);

  // Sirf pehli baar fetch karo — route change pe nahi
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Force refresh sirf jab explicitly trigger ho (cart add, login, etc.)
  useEffect(() => {
    const handler = () => fetchCounts(true);
    window.addEventListener("header:refresh", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("header:refresh", handler);
      window.removeEventListener("storage", handler);
    };
  }, [fetchCounts]);

  // ── Debounce search ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── Fetch suggestions ──
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]); setShowDropdown(false); return;
    }
    axios.get(`${BASE_URL}/products/search?q=${debouncedQuery}`)
      .then((r) => { setSuggestions(r.data.products || []); setShowDropdown(true); })
      .catch(() => {});
  }, [debouncedQuery]);

  // ── Outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotification(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  return (
    <>
      <style>{headerStyles}</style>

      <div className="fixed-top">

        {/* ── TOP BANNER ── */}
        <div className="mil-banner">
          <span className="mil-banner-text">⚡ Free Delivery on orders above ₹999</span>
          <div className="mil-banner-links">
            <a href="#">Track Order</a>
            <a href="#">Store Locator</a>
            <a href="#">Support</a>
          </div>
        </div>

        {/* ── MAIN HEADER ── */}
        <div className="mil-header">

          {/* LOGO */}
          <Link to="/" className="mil-logo">
            <img src={logo} alt="Miltronix" />
          </Link>

          {/* SEARCH */}
          <div className="mil-search-wrap" ref={dropdownRef}>
            <div className="mil-search-box">
              <div className="mil-loc-part">
                <MapPin size={13} color="#616D6B" />
                <span>Set location</span>
              </div>
              <span className="mil-search-icon"><Search size={15} /></span>
              <input
                type="text"
                className="mil-search-input"
                placeholder="Search LED TV, CCTV, Video Wall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && searchQuery.trim() && setShowDropdown(true)
                }
              />
              {searchQuery && (
                <button className="mil-clear-btn" onClick={() => { setSearchQuery(""); setSuggestions([]); setShowDropdown(false); }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {showDropdown && suggestions.length > 0 && (
              <div className="mil-suggestions">
                <div className="mil-sugg-header">
                  <strong>{suggestions.length}</strong> results for "<strong>{searchQuery}</strong>"
                </div>
                {suggestions.map((product) => {
                  const firstVariant = product.variants?.[0];
                  const price = firstVariant?.price || 0;
                  const image = firstVariant?.images?.[0]?.url || product.images?.[0]?.url || "";
                  return (
                    <div
                      key={product._id}
                      className="mil-sugg-item"
                      onClick={() => {
                        navigate(`/product-details/${product._id}`);
                        setShowDropdown(false);
                        setSearchQuery("");
                      }}
                    >
                      <img src={image} alt={product.name} className="mil-sugg-thumb" />
                      <div>
                        <p className="mil-sugg-name">{product.name}</p>
                        {product.brand && <p className="mil-sugg-brand">{product.brand}</p>}
                        <p className="mil-sugg-price">₹{price.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
                <div className="mil-sugg-close" onClick={() => { setShowDropdown(false); setSearchQuery(""); }}>
                  <X size={11} /> Close
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ICONS ── */}
          <div className="mil-actions">

            {/* CART */}
            <Link to="/cart" className="mil-icon-btn">
              <ShoppingCart size={20} strokeWidth={1.8} />
              <span className="mil-icon-label">Cart</span>
              {cartCount > 0 && (
                <span className="mil-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </Link>

            {/* WISHLIST */}
            <Link to="/wishlist" className="mil-icon-btn">
              <Heart size={20} strokeWidth={1.8} />
              <span className="mil-icon-label">Saved</span>
              {wishlistCount > 0 && (
                <span className="mil-badge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>
              )}
            </Link>

            {/* NOTIFICATIONS */}
            <div className="mil-notif-wrap" ref={notifRef}>
              <button
                className={`mil-icon-btn ${showNotification ? "is-active" : ""}`}
                onClick={() => {
                  setShowNotification((prev) => !prev);
                  if (!showNotification) setNotifCount(0);
                }}
              >
                <Bell size={20} strokeWidth={1.8} />
                <span className="mil-icon-label">Alerts</span>
                {notifCount > 0 && (
                  <span className="mil-badge">{notifCount > 99 ? "99+" : notifCount}</span>
                )}
              </button>

              {showNotification && (
                <div className="mil-notif-panel">
                  <Notifications
                    show={showNotification}
                    onClose={() => setShowNotification(false)}
                    notifications={notifications}
                  />
                </div>
              )}
            </div>

            <div className="mil-vdiv" />

            {/* ACCOUNT */}
            {user ? (
              <Link to="/my-profile" className="mil-icon-btn">
                <User size={20} strokeWidth={1.8} />
                <span className="mil-icon-label">Account</span>
              </Link>
            ) : (
              <button className="mil-signin-btn" onClick={() => setModalToShow("signup")}>
                <User size={13} strokeWidth={2} />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>
      </div>

      <AuthModals modalToShow={modalToShow} setModalToShow={setModalToShow} />
    </>
  );
}

export default Header;