// index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React components
import App from './App'; // Import the main App component
import './styles/index.css'; // Import global styles

// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

