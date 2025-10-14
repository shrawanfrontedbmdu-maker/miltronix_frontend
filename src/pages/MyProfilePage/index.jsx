import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountPageLayout from '../../components/layout/AccountPageLayout';
import ProfileForm from './components/ProfileForm';

const MyProfilePage = () => {
    const handleSaveProfile = () => {
    alert('Profile information saved!');
  };
  return (
    <>
      <Header />
      <main style={{paddingTop: '13%', backgroundColor: '#D5D4D3'}}>
        <AccountPageLayout style={{marginLeft: '-50px'}}
          pageTitle="My Profile" 
          breadcrumbPath={['Home Page', 'My Account', 'My Profile']}
          onSave={handleSaveProfile}
        >
          <ProfileForm />
        </AccountPageLayout>
      </main>
      <Footer />
    </>
  );
};

export default MyProfilePage;