import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './store/store';
import { Chart } from 'chart.js/auto'

Chart.defaults.plugins.legend.display = true;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

const originalCreateCanvas = Chart.prototype.createCanvas;
Chart.prototype.createCanvas = function() {
  const canvas = originalCreateCanvas.call(this);
  canvas.id = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return canvas;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
