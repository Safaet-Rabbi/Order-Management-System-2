import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const OrderTable = ({ orders, onEdit, onDelete, showActions = true }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'shipped':
        return 'shipped';
      case 'processing':
        return 'processing';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
        return 'pending'; // Using pending for cancelled
      default:
        return '';
    }
  };

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>CUSTOMER</th>
            <th>ITEMS</th>
            <th>TOTAL</th>
            <th>STATUS</th>
            <th>DATE</th>
            {showActions && <th>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }} // Staggered animation
            >
              <td>ORD{order._id.substring(order._id.length - 6).toUpperCase()}</td>
              <td>{order.customer?.name || 'N/A'}</td>
              <td>{order.items.length} item(s)</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.orderDate ? format(new Date(order.orderDate), 'M/d/yyyy') : 'N/A'}</td>
              {showActions && (
                <td className="action-buttons">
                  <button onClick={() => onEdit(order)} className="edit-btn">
                    <MdEdit />
                  </button>
                  <button onClick={() => onDelete(order._id)} className="delete-btn">
                    <MdDelete />
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;