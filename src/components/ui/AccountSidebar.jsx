import React from 'react';
import { Link } from 'react-router-dom';
import './account-breadcrumb.css'; // Make sure this CSS file is being loaded

const sidebarLinks = [
  { name: 'My Profile', icon: 'bi-person', link: '/my-profile' },
  { name: 'My Order', icon: 'bi-box', link: '/my-orders' },
  { name: 'Wishlist', icon: 'bi-heart', link: '/wishlist' },
  { name: 'Saved Address', icon: 'bi-geo-alt', link: '/addresses' },
  { name: 'Payment', icon: 'bi-credit-card', link: '/payment' },
  { name: 'Contact us', icon: 'bi-telephone', link: '/contact' },
  { name: 'Log out', icon: 'bi-box-arrow-right', link: '#' },
];

const AccountSidebar = ({ activePage }) => {
  return (
    <aside className="sidebar account-sidebar hv" aria-label="Account navigation">
      <h5 className="account-sidebar-title hv">My Account</h5>
      <ul className="account-sidebar-list ">
        {sidebarLinks.map(item => {
          const isActive = activePage === item.name;
          return (
            // This line correctly assigns 'account-nav-item' to every list item
            <li
              key={item.name}
              className={`account-nav-item ${isActive ? 'active' : ''} hv`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Link to={item.link} className="account-nav-link">
                <span className="icon-box">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <span className="account-nav-label">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AccountSidebar;