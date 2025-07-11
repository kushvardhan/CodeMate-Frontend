import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from "./context/ThemeContext";
import App from './App';
import { store } from './store/store';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
  </StrictMode>
);
