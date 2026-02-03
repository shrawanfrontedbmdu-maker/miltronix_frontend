import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import facebookIcon from '../../assets/icon 18.svg';
import twitterIcon from '../../assets/icon 19.svg';
import instagramIcon from '../../assets/icon 20.svg';
import linkedInIcon from '../../assets/icon 21.svg';

const Footer = () => {
  return (
    <>
      {/* Main Footer Section */}
      <footer className="footer-section py-5">
        <div className="container">
          <div className="row gy-4">

            {/* Column 1: Logo, Description & Contact */}
            <div className="col-lg-4 col-md-12">
              <div>
                <Link to="/"><img src={logo} alt="Miltronix Logo" className="img-fluid footer-logo" /></Link>
              </div>
              <p className="footer-desc hv">
                Your trusted partner for premium electronics and cutting-edge technology. 
                Serving customers worldwide with quality products and exceptional service.
              </p>
              <ul className="list-unstyled mt-3">
                <li className="mb-2">
                  <i className="bi bi-telephone me-2"></i>
                  <strong>1-800-ELECTRO (353-2876)</strong>
                </li>
                <li className="mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  <strong>support@mitronix.com</strong>
                </li>
                <li>
                  <i className="bi bi-geo-alt me-2"></i>
                  <strong>123 Tech Street, Silicon Valley, CA 94000</strong>
                </li>
              </ul>
            </div>

            {/* Column 2: Products */}
            <div className="col-lg-2 col-md-6 col-6">
              <h5 className="footer-heading">Products</h5>
              <ul className="list-unstyled hv">
                <li className="custom-margin"><Link to="/products/laptops">Laptops & Computers</Link></li>
                <li className="custom-margin"><Link to="/products/smartphones">Smartphones & Tablets</Link></li>
                <li className="custom-margin"><Link to="/products/audio">Audio & Headphones</Link></li>
                <li className="custom-margin"><Link to="/products/gaming">Gaming & Accessories</Link></li>
                <li className="custom-margin"><Link to="/products/smart-home">Smart Home</Link></li>
                <li className="custom-margin"><Link to="/products/wearable">Wearable Tech</Link></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="col-lg-2 col-md-6 col-6">
              <h5 className="footer-heading">Support</h5>
              <ul className="list-unstyled hv">
                <li className="custom-margin"><Link to="help-support">Help Center</Link></li>
                <li className="custom-margin"><Link to="contact-us">Contact Us</Link></li>
                <li className="custom-margin"><Link to="/support/warranty-claims">Warranty Claims</Link></li>
                <li className="custom-margin"><Link to="/support/return-policy">Return Policy</Link></li>
                <li className="custom-margin"><Link to="/support/shipping-info">Shipping Info</Link></li>
                <li className="custom-margin"><Link to="/support/track-order">Track Order</Link></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="col-lg-2 col-md-6 col-6">
              <h5 className="footer-heading">Company</h5>
              <ul className="list-unstyled hv">
                <li className="custom-margin"><Link to="/about-us">About Us</Link></li>
                <li className="custom-margin"><Link to="/careers">Careers</Link></li>
                <li className="custom-margin"><Link to="/press">Press</Link></li>
                <li className="custom-margin"><Link to="/partners">Partners</Link></li>
                <li className="custom-margin"><Link to="/investor-relations">Investor Relations</Link></li>
                <li className="custom-margin"><Link to="/corporate-sales">Corporate Sales</Link></li>
              </ul>
            </div>

            {/* Column 5: Account */}
            <div className="col-lg-2 col-md-6 col-6">
              <h5 className="footer-heading">Account</h5>
              <ul className="list-unstyled hv">
                <li className="custom-margin"><Link to="/my-profile">My Account</Link></li>
                <li className="custom-margin"><Link to="/my-orders">Order History</Link></li>
                <li className="custom-margin"><Link to="/wishlist">Wishlist</Link></li>
                <li className="custom-margin"><Link to="/rewards-program">Rewards Program</Link></li>
                <li className="custom-margin"><Link to="/gift-cards">Gift Cards</Link></li>
                <li className="custom-margin"><Link to="/newsletter">Newsletter</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Stay Updated Section */}
      <section className="stay-updated-section text-center py-5">
        <div className="container">
          <h2 className="stay-title mb-0 ff2">Stay <em>Updated</em></h2>
          <p className="stay-subtitle mb-2">
            Get the latest tech news, exclusive deals, and product updates delivered to your inbox.
          </p>
          <form className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
            <input type="email" className="form-control stay-input w-auto" placeholder="Enter your email" />
            <button type="submit" className="btn stay-btn">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Bottom Copyright & Socials Section */}
      <section className="bottom-section py-3">
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center">
          <p className="mb-2 mb-sm-0 bottom-text text-sm-start text-center">
            © 2025 Miltronix. All rights reserved.
            <span className="d-none d-sm-inline"> | </span>
            <Link to="/privacy-policy" className="bottom-link">Privacy Policy</Link>
            <span className="d-none d-sm-inline"> | </span>
            <Link to="/terms-of-service" className="bottom-link">Terms of Service</Link>
          </p>
          <div className="d-flex align-items-center gap-2">
            <span className="small">Follow us:</span>
            <div className="d-flex gap-2">
              <a href="#" className="social-icon"><img src={facebookIcon} alt="Facebook" /></a>
              <a href="#" className="social-icon"><img src={twitterIcon} alt="Twitter" /></a>
              <a href="#" className="social-icon"><img src={instagramIcon} alt="Instagram" /></a>
              <a href="#" className="social-icon"><img src={linkedInIcon} alt="LinkedIn" /></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
