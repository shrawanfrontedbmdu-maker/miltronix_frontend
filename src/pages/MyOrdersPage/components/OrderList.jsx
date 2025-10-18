import React, { useState } from 'react';
import OrderCard from '../../../components/ui/OrderCard';
import { myOrdersData } from '../../../data/mockData';

const OrderList = () => {
  const [activeTab, setActiveTab] = useState('active');

  const ordersToDisplay = myOrdersData[activeTab] || [];

  return (
    <div>
      <h5 className="mb-3" style={{ color: '#4e5954', fontWeight: 600 }}>My Orders</h5>

      <div className="tab-links mb-4">
        <a href="#" className={activeTab === 'active' ? 'active' : ''} onClick={() => setActiveTab('active')}>
          Active Orders ({myOrdersData.active.length})
        </a>
        <a href="#" className={activeTab === 'past' ? 'active' : ''} onClick={() => setActiveTab('past')}>
          Past Orders
        </a>
        <a href="#" className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>
          Pending/ Failed Orders
        </a>
      </div>

      {ordersToDisplay.length > 0 ? (
        ordersToDisplay.map(order => <OrderCard key={order.id} order={order} />)
      ) : (
        <p>You have no {activeTab} orders.</p>
      )}
    </div>
  );
};

export default OrderList;