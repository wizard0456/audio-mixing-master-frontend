import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GuestCheckoutForm = ({ 
    guestInfo, 
    setGuestInfo, 
    guestErrors, 
    setGuestErrors, 
    onBackToLogin,
    children 
}) => {
    const handleGuestInfoChange = (field, value) => {
        setGuestInfo(prev => ({ ...prev, [field]: value }));
        if (guestErrors[field]) {
            setGuestErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateGuestInfo = () => {
        const errors = {};
        
        if (!guestInfo.first_name.trim()) {
            errors.first_name = 'First name is required';
        }
        
        if (!guestInfo.last_name.trim()) {
            errors.last_name = 'Last name is required';
        }
        
        if (!guestInfo.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!guestInfo.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(guestInfo.phone.replace(/\s/g, ''))) {
            errors.phone = 'Please enter a valid phone number';
        }
        
        setGuestErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div className="mb-6">
            <h3 className="font-THICCCBOI-SemiBold text-lg mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-THICCCBOI-SemiBold text-sm mb-2">First Name *</label>
                    <input
                        type="text"
                        value={guestInfo.first_name}
                        onChange={(e) => handleGuestInfoChange('first_name', e.target.value)}
                        className="w-full p-3 bg-[#EDEDED] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    {guestErrors.first_name && <p className="text-red-500 text-xs mt-1">{guestErrors.first_name}</p>}
                </div>
                <div>
                    <label className="block font-THICCCBOI-SemiBold text-sm mb-2">Last Name *</label>
                    <input
                        type="text"
                        value={guestInfo.last_name}
                        onChange={(e) => handleGuestInfoChange('last_name', e.target.value)}
                        className="w-full p-3 bg-[#EDEDED] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    {guestErrors.last_name && <p className="text-red-500 text-xs mt-1">{guestErrors.last_name}</p>}
                </div>
                <div>
                    <label className="block font-THICCCBOI-SemiBold text-sm mb-2">Email *</label>
                    <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                        className="w-full p-3 bg-[#EDEDED] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    {guestErrors.email && <p className="text-red-500 text-xs mt-1">{guestErrors.email}</p>}
                </div>
                <div>
                    <label className="block font-THICCCBOI-SemiBold text-sm mb-2">Phone Number *</label>
                    <input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                        className="w-full p-3 bg-[#EDEDED] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    {guestErrors.phone && <p className="text-red-500 text-xs mt-1">{guestErrors.phone}</p>}
                </div>
            </div>
            {onBackToLogin && (
                <button
                    onClick={onBackToLogin}
                    className="text-green-500 font-THICCCBOI-SemiBold text-sm mt-2 underline"
                >
                    ← Back to login options
                </button>
            )}
            {children}
        </div>
    );
};

GuestCheckoutForm.propTypes = {
    guestInfo: PropTypes.object.isRequired,
    setGuestInfo: PropTypes.func.isRequired,
    guestErrors: PropTypes.object.isRequired,
    setGuestErrors: PropTypes.func.isRequired,
    onBackToLogin: PropTypes.func,
    children: PropTypes.node
};

export default GuestCheckoutForm; 