import React from 'react';

const SuspenseFallback = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: 'var(--primary-color)'
    }}>
      Loading...
    </div>
  );
};

export default SuspenseFallback;
