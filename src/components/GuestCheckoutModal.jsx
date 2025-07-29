import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import GuestCheckoutForm from './GuestCheckoutForm';

const GuestCheckoutModal = ({ 
    isOpen, 
    onClose, 
    guestInfo, 
    setGuestInfo, 
    guestErrors, 
    setGuestErrors,
    onGuestCheckout,
    children 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-THICCCBOI-SemiBold text-xl">Guest Checkout</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                
                <GuestCheckoutForm
                    guestInfo={guestInfo}
                    setGuestInfo={setGuestInfo}
                    guestErrors={guestErrors}
                    setGuestErrors={setGuestErrors}
                    onBackToLogin={onClose}
                >
                    {children}
                </GuestCheckoutForm>
            </div>
        </div>
    );
};

GuestCheckoutModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    guestInfo: PropTypes.object.isRequired,
    setGuestInfo: PropTypes.func.isRequired,
    guestErrors: PropTypes.object.isRequired,
    setGuestErrors: PropTypes.func.isRequired,
    onGuestCheckout: PropTypes.func,
    children: PropTypes.node
};

export default GuestCheckoutModal; 