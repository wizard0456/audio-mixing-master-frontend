import React from 'react';
import PropTypes from 'prop-types';
import { RxCross2 } from 'react-icons/rx';

const ChoosePaymentMethodModal = ({ isOpen, onClose, onChoosePayPal, onChooseCard }) => {
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
        <div className="text-center mb-6">
          <div className="text-2xl font-bold mb-2">Choose a payment method</div>
        </div>
        <div className="flex flex-col gap-4">
          <button
            className="bg-[#FFDD00] hover:bg-[#ffe066] text-[#003087] font-bold text-lg py-3 rounded-md flex items-center justify-center gap-2 transition-all"
            onClick={onChoosePayPal}
          >
            PayPal
          </button>
          <button
            className="bg-[#6C47FF] hover:bg-[#5a38d6] text-white font-bold text-lg py-3 rounded-md flex items-center justify-center gap-2 transition-all"
            onClick={onChooseCard}
          >
            Credit Card
          </button>
        </div>
      </div>
    </div>
  );
};

ChoosePaymentMethodModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onChoosePayPal: PropTypes.func.isRequired,
  onChooseCard: PropTypes.func.isRequired,
};

export default ChoosePaymentMethodModal; 