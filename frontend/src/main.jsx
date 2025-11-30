/**
 * Main entry point for the ENSA Chatbot React application.
 * This file initializes the React root, wraps the main App component with
 * necessary context providers (like ThemeProvider), and renders it to the DOM.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)