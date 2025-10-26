import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MagicCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "#6a5acd", // Primary color
      transition: { type: "spring", mass: 0.1, damping: 10, stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="magic-cursor"
      variants={variants}
      animate="default"
    />
  );
};

export default MagicCursor;
