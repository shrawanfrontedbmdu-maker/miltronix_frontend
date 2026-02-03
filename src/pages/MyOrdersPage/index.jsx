import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Breadcrumb from "../../components/ui/Breadcrumb";
import AccountPageLayout from "../../components/layout/AccountPageLayout";
import OrderList from "./components/OrderList";

const MyOrdersPage = () => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "180px", backgroundColor: "#D5D4D3" }}>
        <AccountPageLayout
          pageTitle="My Orders"
          breadcrumbPath={['Home Page', 'My Account', 'My Orders']}
        >
          <OrderList />
        </AccountPageLayout>
        <Footer />
      </main>
    </>
  );
};

export default MyOrdersPage;
