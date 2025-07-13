import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Configure Chart.js to prevent canvas reuse
import { Chart } from 'chart.js/auto'

// Disable canvas reuse globally
Chart.defaults.plugins.legend.display = true;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Override the canvas creation to ensure unique IDs
const originalCreateCanvas = Chart.prototype.createCanvas;
Chart.prototype.createCanvas = function() {
  const canvas = originalCreateCanvas.call(this);
  canvas.id = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return canvas;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
