import React from 'react';
import PropTypes from 'prop-types';
import { RxCross2 } from 'react-icons/rx';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// const cardIcons = [
//   { src: '/src/assets/images/apple-pay.png', alt: 'Apple Pay' },
//   { src: '/src/assets/images/google-pay.png', alt: 'Google Pay' },
//   { src: '/src/assets/images/credit-logo.png', alt: 'CreditCard' },
//   { src: '/src/assets/images/debit-logo.png', alt: 'DebitCard' },
//   { src: '/src/assets/images/visa-logo.png', alt: 'Visa' },
//   { src: '/src/assets/images/amex-logo.png', alt: 'Amex' },
// ];

const PAYPAL_CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your actual client ID

const PaypalCheckoutModal = ({
  isOpen,
  onClose,
  price,
  onPayPalApprove,
  isProcessing,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative p-6">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 />
        </button>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">${price}</div>
          <div className="text-lg font-medium mb-6 text-gray-700">Select a payment method</div>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID }}>
            <PayPalButtons
              style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal'}}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: price } }]
                });
              }}
              onApprove={onPayPalApprove}
              disabled={isProcessing}
            />
          </PayPalScriptProvider>
        </div>
        {/* <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-400 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}
        {/* <div className="flex justify-center gap-2 mt-2">
          {cardIcons.map((icon) => (
            <img
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              className="h-7 w-auto"
              style={{ filter: 'grayscale(0.2)' }}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

PaypalCheckoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
  onPayPalApprove: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};

export default PaypalCheckoutModal; 