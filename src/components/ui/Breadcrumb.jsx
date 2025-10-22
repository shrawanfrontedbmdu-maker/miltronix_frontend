import React from 'react';
import { Link } from 'react-router-dom';
import './account-breadcrumb.css';

// Simple map to convert breadcrumb labels to routes where appropriate
const linkMap = {
  'Home Page': '/',
  'My Account': '/my-profile',
  'My Profile': '/my-profile',
  'My Orders': '/my-orders',
  'Wishlist': '/wishlist',
};

const Breadcrumb = ({ path = [] }) => {
  return (
    <section className="profile-container1 py-0">
      <div className="container breadcrumb-bg">
        <nav className="breadcrumb-bar1 hv" aria-label="breadcrumb">
          <div className="breadcrumb-custom hv">
            {path.map((item, index) => (
              <span key={index} className="breadcrumb-segment">
                {index < path.length - 1 ? (
                  <>
                    <Link to={linkMap[item] || '/'} className="breadcrumb-link text-decoration-none">{item}</Link>
                    <span className="breadcrumb-sep">&nbsp;&gt;&nbsp;</span>
                  </>
                ) : (
                  <span className="breadcrumb-current hv">{item}</span>
                )}
              </span>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
};

export default Breadcrumb;
