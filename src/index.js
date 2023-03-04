import React from 'react';
import ReactDOM from 'react-dom';
import cRender from './cRender.js'
import './index.css';
import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const root = document.getElementById('root') 
 cRender(<React.StrictMode>
    <App />
    </React.StrictMode>, root)
