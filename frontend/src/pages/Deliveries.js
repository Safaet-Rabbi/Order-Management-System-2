import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DeliveryTable from '../components/DeliveryTable';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [currentDelivery, setCurrentDelivery] = useState(null); // Stores delivery (order) being updated
  const [formData, setFormData] = useState({ // Form data for updating delivery status
    deliveryStatus: '',
    deliveryDate: '',
  });

  // Fetch all deliveries (orders with relevant delivery info) on component mount
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/deliveries'); // This endpoint returns specific order fields for delivery tracking
      setDeliveries(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch deliveries. Please check your network or server.');
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler for opening the 'Update Delivery Status' modal
  const handleUpdateDeliveryStatus = (delivery) => {
    setCurrentDelivery(delivery); // Set the order whose delivery status is being updated
    setFormData({ // Populate form with existing delivery data
      deliveryStatus: delivery.deliveryStatus,
      // Format date for input type="date"
      deliveryDate: delivery.deliveryDate ? new Date(delivery.deliveryDate).toISOString().substring(0, 10) : '',
    });
    setShowModal(true);
  };

  // Universal handler for form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for submitting the delivery status update form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the dedicated delivery status update endpoint
      await axiosInstance.put(`/deliveries/${currentDelivery._id}/status`, formData);
      setShowModal(false); // Close the modal
      fetchDeliveries(); // Refresh the delivery list
    } catch (err) {
      setError('Failed to update delivery status.');
      console.error('Error updating delivery status:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Error updating delivery status. Please check your inputs.');
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading deliveries...</div>;
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
      <Navbar title="Deliveries" subtitle="Track and manage order shipments" />

      <div className="card">
        <div className="header">
          <h2>Delivery Tracking</h2>
          {/* No "Add New" button as deliveries are linked to existing orders */}
        </div>
        {deliveries.length > 0 ? (
          <DeliveryTable deliveries={deliveries} onUpdateDeliveryStatus={handleUpdateDeliveryStatus} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--light-text-color)' }}>No deliveries to track yet.</p>
        )}
      </div>

      {/* Delivery Status Update Modal */}
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
              <h2>Update Delivery for Order #{currentDelivery?._id.substring(0, 4).toUpperCase()}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>
                &times;
              </button>
              <form onSubmit={handleSubmit}>
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

                {/* Show Delivery Date input only if status is 'Delivered' */}
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
                    Update Status
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

export default Deliveries;