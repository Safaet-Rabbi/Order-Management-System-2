import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import OrderTable from '../components/OrderTable'; // Re-using for recent orders
import { MdShoppingCart, MdAttachMoney, MdPeople, MdInbox } from 'react-icons/md';
import axiosInstance from '../api/axiosInstance';
import { format } from 'date-fns'; // For date formatting
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentActivity: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard metrics from the backend
        const response = await axiosInstance.get('/orders/dashboard-metrics');
        setMetrics(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on component mount

  // Helper function for dynamic status badge classes based on your CSS
  const getStatusClassForActivity = (status) => {
    switch (status.toLowerCase()) {
      case 'shipped': return 'shipped';
      case 'processing': return 'processing';
      case 'delivered': return 'delivered';
      default: return ''; // Fallback for other statuses
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container">
      <Navbar title="Dashboard" subtitle="Overview of your business metrics" />

      {/* Grid for key metrics cards */}
      <motion.div
        className="dashboard-grid"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div className="dashboard-card total-orders" variants={cardVariants}>
          <h3>Total Orders</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="value">{metrics.totalOrders}</span>
            <MdShoppingCart className="icon" />
          </div>
        </motion.div>
        <motion.div className="dashboard-card total-revenue" variants={cardVariants}>
          <h3>Total Revenue</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="value">${metrics.totalRevenue.toFixed(2)}</span>
            <MdAttachMoney className="icon" />
          </div>
        </motion.div>
        <motion.div className="dashboard-card total-customers" variants={cardVariants}>
          <h3>Total Customers</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="value">{metrics.totalCustomers}</span>
            <MdPeople className="icon" />
          </div>
        </motion.div>
        <motion.div className="dashboard-card total-products" variants={cardVariants}>
          <h3>Total Products</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="value">{metrics.totalProducts}</span>
            <MdInbox className="icon" />
          </div>
        </motion.div>
      </motion.div>

      {/* All Orders section (using a simplified OrderTable) */}
      <div className="card">
        <div className="header">
          <h2>Recent Orders</h2>
          {/* A search input could be added here, but for simplicity, we'll keep it as-is for now */}
          {/* <input type="text" placeholder="Search orders..." className="search-input" /> */}
        </div>
        {metrics.recentActivity.length > 0 ? (
          <OrderTable orders={metrics.recentActivity} showActions={false} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--light-text-color)' }}>No recent orders to display.</p>
        )}
      </div>

      {/* Recent Activity and Low Stock Alert side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card recent-activity-card">
          <div className="header">
            <h2>Recent Activity</h2>
          </div>
          <motion.ul
            className="recent-activity-list"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {metrics.recentActivity.length > 0 ? (
              metrics.recentActivity.map((activity) => (
                <motion.li key={activity._id} variants={listItemVariants}>
                  <span className={`dot ${getStatusClassForActivity(activity.status)}`}></span>
                  <div className="content">
                    <span>Order ORD{activity._id.substring(0, 4).toUpperCase()} <strong style={{color: 'var(--primary-color)'}}>{activity.status.toLowerCase()}</strong></span>
                    <span className="date">{activity.customer?.name || 'Unknown Customer'} | {activity.orderDate ? format(new Date(activity.orderDate), 'M/d/yyyy') : 'N/A'}</span>
                  </div>
                </motion.li>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--light-text-color)' }}>No recent activity.</p>
            )}
          </motion.ul>
        </div>

        <div className="card low-stock-alert-card">
          <div className="header">
            <h2>Low Stock Alert</h2>
          </div>
          <div className="low-stock-list">
            {metrics.lowStockProducts.length > 0 ? (
              metrics.lowStockProducts.map(product => (
                <div key={product._id} className="alert-item">
                  <p>{product.name}</p>
                  <div className="icon">
                    <span style={{fontWeight: 'bold'}}>{product.countInStock}</span> left
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--light-text-color)' }}>No low stock alerts at the moment. Good job!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;