import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Sort orders by createdAt in descending order and add a 5-digit orderNumber
        const sortedOrders = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order, index) => ({
            ...order,
            orderNumber: (10000 + index).toString().padStart(5, '0'), // 5-digit order number
          }));

        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Filter orders based on search query matching either name or orderNumber
  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderNumber.includes(searchQuery)
  );

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="orderHistory">
      <h2>Order History</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Name or Order Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="orders-table">
        <div className="orders-header">
          <span>Order Number</span>
          <span>Name</span>
          <span>Date of Purchase</span>
        </div>
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div className="order-row" key={order._id}>
              <div className="order-summary" onClick={() => toggleDetails(order._id)}>
                <span>{order.orderNumber}</span> {/* Display 5-digit order number */}
                <span>{order.name}</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              {expandedOrder === order._id && (
                <div className="order-details">
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Mobile:</strong> {order.mobile}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Pincode:</strong> {order.pincode}</p>
                  <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                  <h4>Items Purchased:</h4>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.name} (x{item.quantity}) - ${item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
