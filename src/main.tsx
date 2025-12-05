import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/theme.css'; // Import the theme CSS file
import { initializeDefaultTheme } from './utils/themeInitializer.ts';

// Initialize the default theme before rendering
initializeDefaultTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);