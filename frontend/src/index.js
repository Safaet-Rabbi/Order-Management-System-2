import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import your global CSS for styling
import App from './App'; // Your main App component
import reportWebVitals from './reportWebVitals'; // For performance monitoring (optional)

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();