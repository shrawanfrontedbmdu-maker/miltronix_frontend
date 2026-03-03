import React from 'react';
import { Link } from 'react-router-dom';
import './account-breadcrumb.css';

const linkMap = {
  'Home': '/',
  'Home Page': '/',
  'My Account': '/my-profile',
  'My Profile': '/my-profile',
  'My Orders': '/my-orders',
  'Wishlist': '/wishlist',
};

const Breadcrumb = ({ path = [] }) => {

  // ✅ ensure path is always array
  const safePath = Array.isArray(path) ? path : [path];

  return (
    <section className="profile-container1 py-0">
      <div className="container breadcrumb-bg">
        <nav className="breadcrumb-bar1 hv" aria-label="breadcrumb">
          <div className="breadcrumb-custom hv">
            {safePath.map((item, index) => (
              <span key={index} className="breadcrumb-segment">
                {index < safePath.length - 1 ? (
                  <>
                    <Link
                      to={linkMap[item] || '/'}
                      className="breadcrumb-link text-decoration-none"
                    >
                      {item}
                    </Link>
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
