import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import OrderTable from '../components/OrderTable';
import axiosInstance from '../api/axiosInstance';
import { MdAdd } from 'react-icons/md';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]); // To populate customer dropdown in form
  const [products, setProducts] = useState([]); // To populate product dropdown in form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [currentOrder, setCurrentOrder] = useState(null); // Stores order being edited
  const [formData, setFormData] = useState({
    customer: '', // Customer ID
    items: [{ product: '', quantity: 1 }], // Array of products in the order
    shippingMethod: 'Standard',
    status: 'Processing',
    deliveryStatus: 'Pending',
    deliveryDate: '',
  });

  // Fetch all orders, customers, and products on component mount
  useEffect(() => {
    fetchOrders();
    fetchCustomersAndProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders. Please check your network or server.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersAndProducts = async () => {
    try {
      const customersResponse = await axiosInstance.get('/customers');
      setCustomers(customersResponse.data);
      const productsResponse = await axiosInstance.get('/products');
      setProducts(productsResponse.data);
    } catch (err) {
      console.error('Failed to fetch customers or products for form:', err);
      // You might want to set an error state specific to form data
    }
  };

  // Handler for opening the 'Create New Order' modal
  const handleCreateOrder = () => {
    setCurrentOrder(null); // No current order for creation
    setFormData({ // Reset form to default values
      customer: '',
      items: [{ product: '', quantity: 1 }],
      shippingMethod: 'Standard',
      status: 'Processing',
      deliveryStatus: 'Pending',
      deliveryDate: '',
    });
    setShowModal(true);
  };

  // Handler for opening the 'Edit Order' modal
  const handleEditOrder = (order) => {
    setCurrentOrder(order); // Set the order to be edited
    setFormData({ // Populate form with existing order data
      customer: order.customer?._id || '', // Use optional chaining in case customer is null/undefined
      items: order.items.map(item => ({ product: item.product?._id || '', quantity: item.quantity })),
      shippingMethod: order.shippingMethod,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      // Format date for input type="date"
      deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().substring(0, 10) : '',
    });
    setShowModal(true);
  };

  // Handler for deleting an order
  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/orders/${id}`);
        fetchOrders(); // Refresh the order list
      } catch (err) {
        setError('Failed to delete order.');
        console.error('Error deleting order:', err);
        alert(err.response?.data?.message || 'Error deleting order');
      }
    }
  };

  // Universal handler for form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for changes within the 'items' array
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // Handler for adding a new product item row to the form
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1 }],
    }));
  };

  // Handler for removing a product item row from the form
  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // Handler for submitting the order form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for items
    if (!formData.items.every(item => item.product && item.quantity > 0)) {
        alert('Please ensure all order items have a product selected and a quantity greater than 0.');
        return;
    }

    try {
      if (currentOrder) {
        // Update existing order
        await axiosInstance.put(`/orders/${currentOrder._id}`, formData);
      } else {
        // Create new order
        await axiosInstance.post('/orders', formData);
      }
      setShowModal(false); // Close the modal
      fetchOrders(); // Refresh the order list
    } catch (err) {
      setError('Failed to save order.');
      console.error('Error saving order:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Error saving order. Please check your inputs.');
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading orders...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
  }

  return (
    <div className="container">
      <Navbar title="Orders" subtitle="Manage your customer orders" />

      <div className="card">
        <div className="header">
          <h2>All Orders</h2>
          <button className="button" onClick={handleCreateOrder}>
            <MdAdd /> New Order
          </button>
        </div>
        {orders.length > 0 ? (
          <OrderTable orders={orders} onEdit={handleEditOrder} onDelete={handleDeleteOrder} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--light-text-color)' }}>No orders found. Click "New Order" to add one.</p>
        )}
      </div>

      {/* Order Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentOrder ? 'Edit Order' : 'Create New Order'}</h2>
            <button className="close-button" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Customer:</label>
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((cust) => (
                    <option key={cust._id} value={cust._id}>
                      {cust.name} ({cust.email})
                    </option>
                  ))}
                </select>
              </div>

              <label style={{marginTop: '10px', display: 'block'}}>Items:</label>
              {formData.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <select
                    name="product"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                    style={{ width: '60%' }}
                  >
                    <option value="">Select Product</option>
                    {products.map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name} (${prod.price.toFixed(2)}) - Stock: {prod.countInStock}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    min="1"
                    required
                    style={{ width: '20%' }}
                    placeholder="Qty"
                  />
                  {formData.items.length > 1 && (
                    <button type="button" onClick={() => handleRemoveItem(index)} className="button cancel" style={{ width: '20%', padding: '8px 12px' }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddItem} className="button" style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
                Add Item
              </button>

              <div className="input-group">
                <label>Shipping Method:</label>
                <select
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                </select>
              </div>

              <div className="input-group">
                <label>Order Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="input-group">
                <label>Delivery Status:</label>
                <select
                  name="deliveryStatus"
                  value={formData.deliveryStatus}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {formData.deliveryStatus === 'Delivered' && (
                <div className="input-group">
                  <label>Delivery Date:</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleFormChange}
                    required={formData.deliveryStatus === 'Delivered'}
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="button cancel">
                  Cancel
                </button>
                <button type="submit" className="button">
                  {currentOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;