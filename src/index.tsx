import React from 'react';
import ReactDOM from 'react-dom/client';
import './index/index.css';
import App from './mainapp/App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
