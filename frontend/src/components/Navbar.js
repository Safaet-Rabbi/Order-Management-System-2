import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar = React.memo(({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <motion.div
      className="navbar"
      initial={{ y: -50, opacity: 0 }} // Initial position: slightly above and invisible
      animate={{ y: 0, opacity: 1 }}    // Animate to y: 0 and fully visible
      transition={{ type: "spring", stiffness: 100, duration: 0.3, delay: 0.2 }} // Smooth spring animation with a slight delay
    >
      <div className="title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="user-controls">
        {/* Notification bell icon removed */}
        <div className="user-profile">
          <MdAccountCircle style={{ fontSize: '2rem', color: '#6a5acd' }} />
          <span>{user ? user.name : 'Guest'}</span>
        </div>
      </div>
    </motion.div>
  );
});

export default Navbar;