import React from 'react';
import AccountSidebar from '../ui/AccountSidebar';
// Assuming your Breadcrumb is in the Product Details folder
import Breadcrumb from '../../pages/ProductDetails/components/Breadcrumb';

// 👇 1. Add 'onSave' to the props
const AccountPageLayout = ({ children, pageTitle, breadcrumbPath, onSave }) => {
  return (
    <section className="profile-container main-content-padding">
      <div className="container">
        <div className="breadcrumb-bar hv">
          <Breadcrumb path={breadcrumbPath} />
          {/* 👇 2. Conditionally render the button if onSave exists */}
          {onSave && (
            <button type="button" className="save-btn" onClick={onSave}>
              Save Information
            </button>
          )}
        </div>
        <div className="row hv">
          <div className="col-md-3 mb-4">
            <AccountSidebar activePage={pageTitle} />
          </div>
          <div className="col-md-9">
            {children}
          </div>
        </div>
      </div>
      <hr />
    </section>
  );
};

export default AccountPageLayout;