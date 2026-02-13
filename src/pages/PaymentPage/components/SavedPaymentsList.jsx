import React, { useState } from 'react';
import PaymentCard from '../../../components/ui/PaymentCard';
import { savedPaymentsData } from '../../../data/mockData';

const SavedPaymentsList = () => {
  const [payments, setPayments] = useState(savedPaymentsData);

  const handleRemovePayment = (paymentId) => {
    setPayments(currentPayments => currentPayments.filter(p => p.id !== paymentId));
    // API call to delete from backend would go here
  };

  const handleEditPayment = (paymentId) => {
    alert(`Editing payment ID: ${paymentId}`);
    // Open edit modal/form
  };

  const handleAddNewCard = () => {
    alert('Adding new card...');
    // Open add card modal/form
  };

  return (
    <div className="col-md-8">
      <h5 className="saved-address-title mb-2">Payment</h5>
      <div className="address-header d-flex justify-content-between align-items-center mb-3">
        <p className="card-section-subtitle mb-0">Credit/ Debit Cards</p>
        <a href="#" className="add-new-address" onClick={handleAddNewCard}>+ Add New Card</a>
      </div>

      {payments.length > 0 ? (
        payments.map(card => (
          <PaymentCard
            key={card.id}
            card={card}
            onEdit={handleEditPayment}
            onRemove={handleRemovePayment}
          />
        ))
      ) : (
        <p>You have no saved cards.</p>
      )}
    </div>
  );
};

export default SavedPaymentsList;