import './style.css';
import './react-datepicker.css';

import React from "react";
import App from './app.js'
import { createRoot } from 'react-dom/client';
console.log('index.js')
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);