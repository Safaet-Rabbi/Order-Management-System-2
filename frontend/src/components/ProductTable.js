import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { motion } from 'framer-motion';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>STOCK</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <motion.tr
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }} // Staggered animation
            >
              <td>PROD{product._id.substring(product._id.length - 6).toUpperCase()}</td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.countInStock}</td>
              <td className="action-buttons">
                <button onClick={() => onEdit(product)} className="edit-btn">
                  <MdEdit />
                </button>
                <button onClick={() => onDelete(product._id)} className="delete-btn">
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

export default ProductTable;