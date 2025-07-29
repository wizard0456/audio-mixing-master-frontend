import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import PropTypes from 'prop-types';
import axios from 'axios';
import { selectUser } from '../reducers/authSlice';
import { selectUserInfo } from '../reducers/userSlice';
import { API_ENDPOINT } from '../utils/constants';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import ReactStripeCheckout from 'react-stripe-checkout';
import { getUserToken } from '../reducers/authSlice';

const ReviewPurchaseModal = ({ orderId, seletedOrderItems, amount }) => {
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
    const [{ options }, paypalDispatch] = usePayPalScriptReducer();
    const [clientSecret, setClientSecret] = useState('');
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // State to track payment processing
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal'); // State to track selected payment method
    
    // Guest checkout state
    const [isGuestCheckout, setIsGuestCheckout] = useState(!user);
    const [guestInfo, setGuestInfo] = useState({
        email: '',
        phone: ''
    });
    const [guestErrors, setGuestErrors] = useState({ email: '', phone: '' });

    const handleCancel = (data) => {
        setIsProcessing(false);
    };

    useEffect(() => {
        paypalDispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency: 'USD',
            },
        });
    }, [paypalDispatch, options.currency]);

    useEffect(() => {
        if (user) {
            const fetchClientSecret = async () => {
                try {
                    const response = await axios.post(API_ENDPOINT + 'stripe/intent', {
                        amount: Math.round(Number(amount)),
                        user_id: user.id,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${getUserToken(user)}`,
                        },
                    });
                    setClientSecret(response.data);
                } catch (error) {
                    // Handle error silently
                }
            };

            fetchClientSecret();
        }
    }, [user, amount]);

    const createOrder = (data, actions) => {
        setIsProcessing(true);
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: (Number(amount)).toFixed(2),
                },
            }],
        }).finally(() => setIsProcessing(false));
    };

    const onApprove = (data, actions) => {
        setIsProcessing(true);
        return actions.order.capture().then(async (details) => {
            const transactionDetails = {
                user_id: user ? userInfo.id.toString() : 'guest',
                service_id: seletedOrderItems,
                transaction_id: details.id,
                amount: parseFloat(Number(amount)).toFixed(2),
                payer_name: user ? userInfo.first_name + ' ' + userInfo.last_name : guestInfo.email,
                payer_email: user ? userInfo.email : guestInfo.email,
                payer_phone: user ? (userInfo.phone || '') : guestInfo.phone,
                payment_method: "PayPal",
                order_id: orderId,
            };

            try {
                await axios.post(API_ENDPOINT + 'buy-revision', transactionDetails, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...(user && { Authorization: `Bearer ${getUserToken(user)}` }),
                    }
                });

                setIsPaymentComplete(true);
            } catch (error) {
                // Handle error silently
            }
            setIsProcessing(false);
        });
    };

    if (!amount) return null;

    return (
        <div className="subscription-modal">
            <section className="px-5 md:px-10 xl:px-0">
                <div className='flex flex-col'>
                    <div className='flex flex-col gap-7 py-5 rounded-[20px]'>
                        <div className='flex justify-between items-start'>
                            <p className='w-3/5 font-THICCCBOI-SemiBold text-xl leading-6 font-semibold'>Service Name :</p>
                            <p className='font-THICCCBOI-SemiBold text-xl'>Revision</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-7 py-5 rounded-[20px]'>
                        <div className='flex justify-between items-center'>
                            <p className='w-3/5 font-THICCCBOI-SemiBold text-xl leading-6 font-semibold'>Total cost :</p>
                            <p className='font-THICCCBOI-Bold text-xl leading-6 font-bold'>${parseFloat(Number(amount)).toFixed(2)}</p>
                        </div>
                    </div>

                    <hr className='border-[#4CC800] my-3' />


                    {
                        isPaymentComplete
                            ?
                            null
                            :
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={() => setSelectedPaymentMethod('paypal')}
                                    className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'paypal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    disabled={isProcessing}
                                    style={{ opacity: isProcessing ? 0.5 : 1 }}
                                >
                                    PayPal
                                </button>
                                <button
                                    onClick={() => setSelectedPaymentMethod('stripe')}
                                    className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'stripe' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    disabled={isProcessing}
                                    style={{ opacity: isProcessing ? 0.5 : 1 }}
                                >
                                    Stripe
                                </button>
                            </div>
                    }


                    <div className='mt-6'>
                        {isPaymentComplete ? (
                            <div className="text-center">
                                <CheckIcon className="text-green-500 h-10 w-10 mx-auto" />
                                <p className="mt-4 text-lg font-semibold">Payment Complete</p>
                                <p className="mt-2 text-gray-500">Your purchase has been successfully processed. Chat with us for more details.</p>
                            </div>
                        ) : (user || isGuestCheckout) ? (
                            <>
                                {!isGuestCheckout ? (
                                    <>
                                        {selectedPaymentMethod == 'paypal' && (
                                            <PayPalButtons createOrder={createOrder} onApprove={onApprove} disabled={isProcessing} onCancel={handleCancel} style={{ opacity: isProcessing ? 0.5 : 1 }} />
                                        )}

                                        {selectedPaymentMethod == 'stripe' && clientSecret && (
                                            <StripePaymentForm
                                                finalTotal={parseFloat(Number(amount)).toFixed(2)}
                                                calculateFinalCost={parseFloat(Number(amount)).toFixed(2)}
                                                setIsPaymentComplete={setIsPaymentComplete}
                                                isProcessing={isProcessing}
                                                setIsProcessing={setIsProcessing}
                                                orderId={orderId}
                                                service_id={seletedOrderItems}
                                                isGuestCheckout={false}
                                                guestInfo={null}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Payment Methods for Guest */}
                                        <div className="flex justify-center gap-4 mb-6">
                                            <button
                                                onClick={() => setSelectedPaymentMethod('paypal')}
                                                className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'paypal' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                                disabled={isProcessing}
                                            >
                                                PayPal
                                            </button>
                                            <button
                                                onClick={() => setSelectedPaymentMethod('stripe')}
                                                className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'stripe' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                                disabled={isProcessing}
                                            >
                                                Stripe
                                            </button>
                                        </div>
                                        {/* Guest Information Form */}
                                        <div className="mb-6">
                                            <h3 className="font-THICCCBOI-SemiBold text-lg mb-4">Guest Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block font-THICCCBOI-SemiBold text-sm mb-2">Email *</label>
                                                    <input
                                                        type="email"
                                                        value={guestInfo.email}
                                                        onChange={(e) => {
                                                            setGuestInfo({ ...guestInfo, email: e.target.value });
                                                            setGuestErrors((prev) => ({ ...prev, email: '' }));
                                                        }}
                                                        onBlur={() => {
                                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                            setGuestErrors((prev) => ({
                                                                ...prev,
                                                                email: !emailRegex.test(guestInfo.email) ? 'Please enter a valid email address.' : ''
                                                            }));
                                                        }}
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
                                                        onChange={(e) => {
                                                            setGuestInfo({ ...guestInfo, phone: e.target.value });
                                                            setGuestErrors((prev) => ({ ...prev, phone: '' }));
                                                        }}
                                                        onBlur={() => {
                                                            const phoneRegex = /^\+?\d{10,15}$/;
                                                            setGuestErrors((prev) => ({
                                                                ...prev,
                                                                phone: !phoneRegex.test(guestInfo.phone) ? 'Please enter a valid phone number.' : ''
                                                            }));
                                                        }}
                                                        className="w-full p-3 bg-[#EDEDED] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        required
                                                    />
                                                    {guestErrors.phone && <p className="text-red-500 text-xs mt-1">{guestErrors.phone}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Payment Buttons for Guest */}
                                        {selectedPaymentMethod == 'paypal' && (
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onCancel={handleCancel}
                                                disabled={isProcessing || !guestInfo.email || !guestInfo.phone || guestErrors.email || guestErrors.phone}
                                            />
                                        )}
                                        {selectedPaymentMethod == 'stripe' && clientSecret && (
                                            <StripePaymentForm
                                                finalTotal={parseFloat(Number(amount)).toFixed(2)}
                                                calculateFinalCost={parseFloat(Number(amount)).toFixed(2)}
                                                setIsPaymentComplete={setIsPaymentComplete}
                                                isProcessing={isProcessing}
                                                setIsProcessing={setIsProcessing}
                                                orderId={orderId}
                                                service_id={seletedOrderItems}
                                                isGuestCheckout={true}
                                                guestInfo={guestInfo}
                                                guestInfoRequired={!guestInfo.email || !guestInfo.phone || guestErrors.email || guestErrors.phone}
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="text-center">
                                <p className="font-THICCCBOI-SemiBold text-lg mb-4">Choose your checkout option:</p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setIsGuestCheckout(true)}
                                        className="bg-white text-black font-Montserrat text-base leading-4 font-medium py-4 px-6 rounded-full w-fit mx-auto border-2 border-gray-300"
                                    >
                                        Continue as Guest
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const StripePaymentForm = ({ finalTotal, setIsPaymentComplete, isProcessing, setIsProcessing, orderId, service_id, isGuestCheckout, guestInfo, guestInfoRequired }) => {
    const userInfo = useSelector(selectUserInfo);
    const user = useSelector(selectUser);

    const handleStripeToken = async (token) => {
        setIsProcessing(true);
        
        try {
            // Create payment intent with the token
            const response = await axios.post(API_ENDPOINT + 'stripe/confirm-revision-payment', {
                token: token.id,
                amount: finalTotal,
                currency: 'usd',
                description: 'Payment for revision service',
                user_id: isGuestCheckout ? 'guest' : userInfo.id.toString(),
                service_id: service_id,
                order_id: orderId,
                payer_name: isGuestCheckout ? guestInfo.email : userInfo.first_name + ' ' + userInfo.last_name,
                payer_email: isGuestCheckout ? guestInfo.email : userInfo.email,
                payer_phone: isGuestCheckout ? guestInfo.phone : (userInfo.phone || ''),
                payment_method: 'Stripe',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(user && { Authorization: `Bearer ${getUserToken(user)}` }),
                }
            });

            if (response.data.success) {
                setIsPaymentComplete(true);
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            // Handle error silently
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-6">
                <h3 className="font-THICCCBOI-SemiBold text-xl mb-2 text-gray-800">Card Information</h3>
                <p className="text-gray-600 text-sm">Click the button below to securely enter your payment details</p>
            </div>
            
            {/* Security Notice */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-gray-600">
                        Your payment is secured by Stripe. We never store your card details on our servers.
                    </p>
                </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-THICCCBOI-SemiBold text-sm text-gray-700 mb-2">Order Summary</h4>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Service:</span>
                        <span className="text-sm font-medium">Revision</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2">
                        <div className="flex justify-between items-center">
                            <span className="font-THICCCBOI-SemiBold text-sm text-gray-700">Total Amount:</span>
                            <span className="font-THICCCBOI-Bold text-lg text-gray-800">${finalTotal}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <ReactStripeCheckout
                    token={handleStripeToken}
                    stripeKey="pk_test_51MuE4RJIWkcGZUIabXuoFFrr5gMT5S9Ynq63FfkoZMVeEkq94UdXOKwK4t3msKIsQwnLwafv9JyvzIdKpbsFonwd00BWb4lWdj"
                    amount={Math.round(parseFloat(finalTotal) * 100)} // Convert to cents
                    name="Audio Mixing Services"
                    description="Payment for revision service"
                    image="https://your-logo-url.com/logo.png" // Replace with your logo
                    currency="USD"
                    locale="auto"
                    email={isGuestCheckout ? guestInfo.email : userInfo.email}
                    disabled={isProcessing || guestInfoRequired}
                    style={{
                        background: '#0D6EFD',
                        color: '#fff',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: isProcessing || guestInfoRequired ? 'not-allowed' : 'pointer',
                        opacity: isProcessing || guestInfoRequired ? 0.6 : 1,
                    }}
                    label={isProcessing ? "Processing..." : `Pay $${finalTotal}`}
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Payment...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Pay ${finalTotal}
                        </div>
                    )}
                </ReactStripeCheckout>
            </div>

            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                    By clicking "Pay", you agree to our terms of service and privacy policy.
                </p>
            </div>
        </div>
    );
};

ReviewPurchaseModal.propTypes = {
    seletedOrderItems: PropTypes.string,
    orderId: PropTypes.string,
    amount: PropTypes.number,
};

StripePaymentForm.propTypes = {
    finalTotal: PropTypes.string,
    setIsPaymentComplete: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    setIsProcessing: PropTypes.func.isRequired,
    orderId: PropTypes.string,
    service_id: PropTypes.string,
    isGuestCheckout: PropTypes.bool,
    guestInfo: PropTypes.object,
    guestInfoRequired: PropTypes.bool,
};

export default ReviewPurchaseModal;