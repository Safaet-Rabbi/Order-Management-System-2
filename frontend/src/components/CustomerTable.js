import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { motion } from 'framer-motion';

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>CUSTOMER ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>PHONE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <motion.tr
              key={customer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }} // Staggered animation
            >
              <td>CUST{customer._id.substring(customer._id.length - 6).toUpperCase()}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone || 'N/A'}</td>
              <td className="action-buttons">
                <button onClick={() => onEdit(customer)} className="edit-btn">
                  <MdEdit />
                </button>
                <button onClick={() => onDelete(customer._id)} className="delete-btn">
                  <MdDelete />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;