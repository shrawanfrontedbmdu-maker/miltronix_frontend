import React, { useState } from 'react';
import AddressCard from '../../../components/ui/AddressCard';
import { savedAddressesData } from '../../../data/mockData';

const SavedAddressList = () => {
  // Manage addresses in state
  const [addresses, setAddresses] = useState(savedAddressesData);

  const handleRemoveAddress = (addressId) => {
    setAddresses(currentAddresses => currentAddresses.filter(addr => addr.id !== addressId));
    // In a real app, you would also call an API to delete it from the backend
  };

  const handleEditAddress = (addressId) => {
    // Placeholder: In a real app, this would open a modal or form to edit
    alert(`Editing address ID: ${addressId}`);
  };

  const handleAddNewAddress = () => {
    // Placeholder: In a real app, this would open a modal or form to add
    alert('Adding new address...');
  };

  return (
    <div>
      <div className="address-header d-flex justify-content-between align-items-center">
        <h5 className="saved-address-title">Saved Address</h5>
        <a href="#" className="add-new-address" onClick={handleAddNewAddress}>+ Add New Address</a>
      </div>

      {addresses.length > 0 ? (
        addresses.map(address => (
          <AddressCard 
            key={address.id} 
            address={address} 
            onEdit={handleEditAddress} 
            onRemove={handleRemoveAddress} 
          />
        ))
      ) : (
        <p>You have no saved addresses.</p>
      )}
    </div>
  );
};

export default SavedAddressList;