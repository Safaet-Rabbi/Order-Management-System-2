import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineLocalShipping } from 'react-icons/md';

const LoadingScreen = () => {
  const radius = 40;
  // Calculate circumference for stroke dash animation
  const circumference = 2 * Math.PI * radius;

  return (
    // Main container is centered using flex, justify-center, and min-h-screen
    <motion.div
      className="loading-screen flex flex-col items-center justify-center min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.5 }}
    >
      {/* 1. TOP TEXT: "Welcome to OrderPro" */}
      <motion.h1
        className="text-2xl font-semibold text-[#006eff] mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to OrderPro
      </motion.h1>

      {/* 2. Circle & Truck Container */}
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {/* Circle SVG (Background and Progress) */}
        <svg
          className="absolute top-0 left-0"
          width="120"
          height="120"
          viewBox="0 0 100 100"
        >
          {/* Background Circle */}
          <circle
            className="bg-circle"
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="5"
            fill="none"
            stroke="#53aacc91" /* Light Blue/Gray Background */
          />
          {/* Animated Progress Circle */}
          <motion.circle
            className="progress-circle"
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="5"
            stroke="#0099ffff" /* Bright Blue Progress */
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            // Animation for drawing the circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: 2,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </svg>

        {/* Truck Icon rotating perfectly around center */}
        <motion.div
          className="absolute"
          style={{ originX: '50%', originY: '50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <MdOutlineLocalShipping size={50} color="#1100ffff" />
        </motion.div>
      </div>

      {/* 3. BOTTOM TEXT: "Loading..." */}
      <motion.p
        className="mt-6 text-gray-900 text-lg font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Loading...
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;