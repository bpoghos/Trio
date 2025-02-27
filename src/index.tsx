import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/index.global.scss"
import App from './App';
import 'react-loading-skeleton/dist/skeleton.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // Temporarily disabling StrictMode for testing
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
