import React from 'react';
import { MdEdit } from 'react-icons/md';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const DeliveryTable = ({ deliveries, onUpdateDeliveryStatus }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'shipped':
        return 'shipped';
      case 'processing':
        return 'processing';
      case 'delivered':
        return 'delivered';
      case 'in transit':
        return 'in-transit';
      case 'pending':
        return 'pending';
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
            <th>ORDER STATUS</th>
            <th>SHIPPING METHOD</th>
            <th>DELIVERY STATUS</th>
            <th>DELIVERY DATE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery, index) => (
            <motion.tr
              key={delivery._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }} // Staggered animation
            >
              <td>ORD{delivery._id.substring(0, 4).toUpperCase()}</td>
              <td>{delivery.customer?.name || 'N/A'}</td>
              <td>
                <span className={`status-badge ${getStatusClass(delivery.status)}`}>
                  {delivery.status}
                </span>
              </td>
              <td>{delivery.shippingMethod}</td>
              <td>
                <span className={`status-badge ${getStatusClass(delivery.deliveryStatus)}`}>
                  {delivery.deliveryStatus}
                </span>
              </td>
              <td>
                {delivery.deliveryDate
                  ? format(new Date(delivery.deliveryDate), 'M/d/yyyy')
                  : 'Pending'}
              </td>
              <td className="action-buttons">
                <button onClick={() => onUpdateDeliveryStatus(delivery)} className="edit-btn">
                  <MdEdit />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;