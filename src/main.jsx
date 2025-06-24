import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store.js'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId: "AWkL8nHi5ZJawZ4rbyBM6t_JiZGKXup_LUqaHwmNRgarpr_rZUHIYafsIwLYKA-MqI-5vyt1KJmiHilx",
  currency: "USD",
  // intent: "capture",
  vault: true, // Add this line
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true} options={initialOptions}>
        <App />
      </PayPalScriptProvider>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition="Slide"
      />
    </Provider>
  </React.StrictMode>,
)
