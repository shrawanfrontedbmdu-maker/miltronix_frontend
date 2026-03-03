import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './account-breadcrumb.css';

const sidebarLinks = [
  { name: 'My Profile', icon: 'bi-person', link: '/my-profile' },
  { name: 'My Order', icon: 'bi-box', link: '/my-orders' },
  { name: 'Wishlist', icon: 'bi-heart', link: '/wishlist' },
  { name: 'Saved Address', icon: 'bi-geo-alt', link: '/addresses' },
  { name: 'Payment', icon: 'bi-credit-card', link: '/payment' },
  { name: 'Contact us', icon: 'bi-telephone', link: '/contact-us' },
  { name: 'Log out', icon: 'bi-box-arrow-right', link: '#' },
];

const AccountSidebar = ({ activePage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <aside className="sidebar account-sidebar hv" aria-label="Account navigation">
      <h5 className="account-sidebar-title hv">My Account</h5>
      <ul className="account-sidebar-list">
        {sidebarLinks.map(item => {
          const isActive = activePage === item.name;
          return (
            <li
              key={item.name}
              className={`account-nav-item ${isActive ? 'active' : ''} hv`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.name === "Log out" ? (
                <button
                  onClick={handleLogout}
                  className="account-nav-link logout-btn"
                  style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
                >
                  <span className="icon-box">
                    <i className={`bi ${item.icon}`}></i>
                  </span>
                  <span className="account-nav-label">{item.name}</span>
                </button>
              ) : (
                <Link to={item.link} className="account-nav-link">
                  <span className="icon-box">
                    <i className={`bi ${item.icon}`}></i>
                  </span>
                  <span className="account-nav-label">{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AccountSidebar;