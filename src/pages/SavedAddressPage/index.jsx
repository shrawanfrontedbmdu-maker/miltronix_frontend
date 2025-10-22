import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountPageLayout from '../../components/layout/AccountPageLayout';
import SavedAddressList from './components/SavedAddressList';

const SavedAddressPage = () => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "180px", backgroundColor: "#D5D4D3" }}>
        <AccountPageLayout
          pageTitle="Saved Address"
          breadcrumbPath={['Home Page', 'My Account', 'Saved Address']}
        >
          <SavedAddressList />
        </AccountPageLayout>
      </main>
      <Footer />
    </>
  );
};

export default SavedAddressPage;
