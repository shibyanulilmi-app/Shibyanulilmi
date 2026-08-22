import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize dark mode from settings before render
try {
  const saved = localStorage.getItem('tpa_app_settings');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
} catch {
  // Ignore fallback
}

// Inisialisasi Root DOM Aplikasi
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
