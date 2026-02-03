import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountPageLayout from '../../components/layout/AccountPageLayout';
import SavedPaymentsList from './components/SavedPaymentsList';

const PaymentPage = () => {
  return (
    <>
      <Header />
      <main style={{paddingTop: '180px', backgroundColor: '#D5D4D3'}}>
      <AccountPageLayout
        pageTitle="Payment"
        breadcrumbPath={['Home Page', 'My Account', 'Payment']}
      >
        <SavedPaymentsList />
      </AccountPageLayout>
      </main>
      <Footer />
    </>
  );
};

export default PaymentPage;