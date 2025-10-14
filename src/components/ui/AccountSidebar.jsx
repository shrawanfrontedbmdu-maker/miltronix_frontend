import React from 'react';
import { Link } from 'react-router-dom';

const sidebarLinks = [
  { name: 'My Profile', icon: 'bi-person', link: '/my-profile' },
  { name: 'My Order', icon: 'bi-box', link: '/my-orders' },
  { name: 'Wishlist', icon: 'bi-heart', link: '/wishlist' },
  { name: 'Saved Address', icon: 'bi-geo-alt', link: '/addresses' },
  { name: 'Payment', icon: 'bi-credit-card', link: '/payment' },
  { name: 'Contact us', icon: 'bi-telephone', link: '/contact' },
  { name: 'Log out', icon: 'bi-box-arrow-right', link: '#' },
];

// It receives the 'active' page name as a prop to highlight the correct link
const AccountSidebar = ({ activePage }) => {
  return (
    <div className="sidebar hv">
      <h5 className="hv">My Account</h5>
      <ul>
        {sidebarLinks.map(item => (
          <li key={item.name} className={activePage === item.name ? 'active hv' : 'hv'}>
            <Link to={item.link} className="text-decoration-none">
              <i className={`bi ${item.icon} me-2`}></i>{item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountSidebar;