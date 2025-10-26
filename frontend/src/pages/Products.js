import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductTable from '../components/ProductTable';
import axiosInstance from '../api/axiosInstance';
import { MdAdd } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [currentProduct, setCurrentProduct] = useState(null); // Stores product being edited
  const [formData, setFormData] = useState({ // Form data for create/edit
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
  });

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please check your network or server.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler for opening the 'Create New Product' modal
  const handleCreateProduct = () => {
    setCurrentProduct(null); // No current product for creation
    setFormData({ name: '', description: '', price: 0, countInStock: 0 }); // Reset form
    setShowModal(true);
  };

  // Handler for opening the 'Edit Product' modal
  const handleEditProduct = (product) => {
    setCurrentProduct(product); // Set the product to be edited
    setFormData({ // Populate form with existing product data
      name: product.name,
      description: product.description,
      price: product.price,
      countInStock: product.countInStock,
    });
    setShowModal(true);
  };

  // Handler for deleting a product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        fetchProducts(); // Refresh the product list
      } catch (err) {
        setError('Failed to delete product.');
        console.error('Error deleting product:', err);
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  // Universal handler for form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for submitting the product form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        // Update existing product
        await axiosInstance.put(`/products/${currentProduct._id}`, formData);
      } else {
        // Create new product
        await axiosInstance.post('/products', formData);
      }
      setShowModal(false); // Close the modal
      fetchProducts(); // Refresh the product list
    } catch (err) {
      setError('Failed to save product.');
      console.error('Error saving product:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Error saving product. Please check your inputs.');
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading products...</div>;
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
      <Navbar title="Products" subtitle="Manage your product catalog" />

      <div className="card">
        <div className="header">
          <h2>All Products</h2>
          <button className="button" onClick={handleCreateProduct}>
            <MdAdd /> New Product
          </button>
        </div>
        {products.length > 0 ? (
          <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--light-text-color)' }}>No products found. Click "New Product" to add one.</p>
        )}
      </div>

      {/* Product Create/Edit Modal */}
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
              <h2>{currentProduct ? 'Edit Product' : 'Create New Product'}</h2>
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
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Optional description"
                  ></textarea>
                </div>
                <div className="input-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    step="0.01" // Allows decimal values for price
                    min="0"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Stock Quantity:</label>
                  <input
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleFormChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="button cancel">
                    Cancel
                  </button>
                  <button type="submit" className="button">
                    {currentProduct ? 'Update Product' : 'Create Product'}
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

export default Products;