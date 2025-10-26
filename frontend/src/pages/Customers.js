import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomerTable from '../components/CustomerTable';
import axiosInstance from '../api/axiosInstance';
import { MdAdd } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [currentCustomer, setCurrentCustomer] = useState(null); // Stores customer being edited
  const [formData, setFormData] = useState({ // Form data for create/edit
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Fetch all customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/customers');
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers. Please check your network or server.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler for opening the 'Create New Customer' modal
  const handleCreateCustomer = () => {
    setCurrentCustomer(null); // No current customer for creation
    setFormData({ name: '', email: '', phone: '', address: '' }); // Reset form
    setShowModal(true);
  };

  // Handler for opening the 'Edit Customer' modal
  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer); // Set the customer to be edited
    setFormData({ // Populate form with existing customer data
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setShowModal(true);
  };

  // Handler for deleting a customer
  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/customers/${id}`);
        fetchCustomers(); // Refresh the customer list
      } catch (err) {
        setError('Failed to delete customer.');
        console.error('Error deleting customer:', err);
        alert(err.response?.data?.message || 'Error deleting customer');
      }
    }
  };

  // Universal handler for form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for submitting the customer form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCustomer) {
        // Update existing customer
        await axiosInstance.put(`/customers/${currentCustomer._id}`, formData);
      } else {
        // Create new customer
        await axiosInstance.post('/customers', formData);
      }
      setShowModal(false); // Close the modal
      fetchCustomers(); // Refresh the customer list
    } catch (err) {
      setError('Failed to save customer.');
      console.error('Error saving customer:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Error saving customer. Please check your inputs.');
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading customers...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
  }

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContentVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, type: "spring", stiffness: 100 } },
    exit: { y: "100vh", opacity: 0 },
  };

  return (
    <div className="container">
      <Navbar title="Customers" subtitle="Manage your customer base" />

      <div className="card">
        <div className="header">
          <h2>All Customers</h2>
          <button className="button" onClick={handleCreateCustomer}>
            <MdAdd /> New Customer
          </button>
        </div>
        {customers.length > 0 ? (
          <CustomerTable customers={customers} onEdit={handleEditCustomer} onDelete={handleDeleteCustomer} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--light-text-color)' }}>No customers found. Click "New Customer" to add one.</p>
        )}
      </div>

      {/* Customer Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="modal-content"
              variants={modalContentVariants}
            >
              <h2>{currentCustomer ? 'Edit Customer' : 'Create New Customer'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>
                &times;
              </button>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Optional"
                  />
                </div>
                <div className="input-group">
                  <label>Address:</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Optional address details"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="button cancel">
                    Cancel
                  </button>
                  <button type="submit" className="button">
                    {currentCustomer ? 'Update Customer' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;