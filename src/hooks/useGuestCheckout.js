import { useState } from 'react';

export const useGuestCheckout = () => {
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });
    const [guestErrors, setGuestErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });

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

    const handleGuestInfoChange = (field, value) => {
        setGuestInfo(prev => ({ ...prev, [field]: value }));
        if (guestErrors[field]) {
            setGuestErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const resetGuestCheckout = () => {
        setIsGuestCheckout(false);
        setGuestInfo({
            first_name: '',
            last_name: '',
            email: '',
            phone: ''
        });
        setGuestErrors({
            first_name: '',
            last_name: '',
            email: '',
            phone: ''
        });
    };

    return {
        isGuestCheckout,
        setIsGuestCheckout,
        guestInfo,
        setGuestInfo,
        guestErrors,
        setGuestErrors,
        validateGuestInfo,
        handleGuestInfoChange,
        resetGuestCheckout
    };
}; 