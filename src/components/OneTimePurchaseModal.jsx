// OneTimePurchaseModal.jsx

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser } from '../reducers/authSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { selectUserInfo } from '../reducers/userSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { API_ENDPOINT } from '../utils/constants';
import { getUserToken } from '../reducers/authSlice';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51MuE4RJIWkcGZUIabXuoFFrr5gMT5S9Ynq63FfkoZMVeEkq94UdXOKwK4t3msKIsQwnLwafv9JyvzIdKpbsFonwd00BWb4lWdj');

const OneTimePurchaseModal = ({ product, onClose, quantity }) => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
    const [{ options }, paypalDispatch] = usePayPalScriptReducer();
    const [clientSecret, setClientSecret] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Guest checkout state
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        email: '',
        phone: ''
    });

    useEffect(() => {
        paypalDispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: "USD",
            },
        });
    }, [paypalDispatch, options.currency]);

    useEffect(() => {
        if (user && product) {
            const fetchClientSecret = async () => {
                try {
                    const response = await axios.post(API_ENDPOINT + 'stripe/intent', {
                        amount: ((Number(product.discounted_price) || Number(product.price)) * quantity).toFixed(2),
                        user_id: userInfo.id,
                        cart_items: [
                            {
                                service_id: product.id.toString(),
                                service_name: product.name,
                                qty: quantity,
                                price: Number(product.discounted_price) || Number(product.price),
                                total_price: (Number(product.discounted_price) || Number(product.price)) * quantity,
                                service_type: product.service_type,
                                paypal_plan_id: product.paypal_plan_id,
                                stripe_plan_id: product.stripe_plan_id,
                            },
                        ],
                    }, {
                        headers: {
                            'Authorization': `Bearer ${getUserToken(user)}`,
                        },
                    });

                    setClientSecret(response.data || response.data);
                } catch (error) {
                    // Handle error silently
                }
            };

            fetchClientSecret();
        }
    }, [user, product, userInfo, quantity]);

    const handleCancel = (data) => {
        setIsProcessing(false);
    };

    const createOrder = (data, actions) => {
        setIsProcessing(true);
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: ((Number(product.discounted_price) || Number(product.price)) * quantity).toFixed(2),
                },
            }],
        }).catch((err) => {
            setIsProcessing(false);
        });
    };

    const onApprove = async (data, actions) => {
        setIsProcessing(true);
        try {
            const order = await actions.order.capture();
            const paymentDetails = {
                id: order.id,
                amount: (Number(product.discounted_price) || Number(product.price)) * quantity,
                payer_name: user ? userInfo.first_name + " " + userInfo.last_name : guestInfo.email,
                payer_email: user ? userInfo.email : guestInfo.email,
                payer_phone: user ? (userInfo.phone || '') : guestInfo.phone,
            };
            
            await processOrder(paymentDetails, "paypal");
        } catch (error) {
            // Handle error silently
            setIsProcessing(false);
        }
    };

    const processOrder = async (paymentDetails, paymentMethod) => {
        const orderDetails = {
            user_id: user ? userInfo.id : 'guest',
            cartItems: [
                {
                    service_id: product.id.toString(),
                    service_name: product.name,
                    qty: quantity,
                    price: Number(product.discounted_price) || Number(product.price),
                    total_price: (Number(product.discounted_price) || Number(product.price)) * quantity,
                    service_type: product.service_type,
                    paypal_plan_id: product.paypal_plan_id,
                    stripe_plan_id: product.stripe_plan_id,
                },
            ],
            transaction_id: paymentDetails.id,
            amount: paymentDetails.amount,
            promoCode: "", // If you have a promo code logic, replace it accordingly
            payer_name: paymentDetails.payer_name,
            payer_email: paymentDetails.payer_email,
            payer_phone: paymentDetails.payer_phone || '',
            payment_method: paymentMethod,
            order_type: "one_time",
        };

        try {
            const response = await axios.post(API_ENDPOINT + 'success', orderDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(user && { Authorization: `Bearer ${getUserToken(user)}` }),
                },
            });

            navigate(`/order-confirmation/${response.data.order_id}`, {
                state: {
                    cartItems: orderDetails.cartItems,
                    isPromoCodeApplied: false,
                    total: orderDetails.amount,
                    discountAmount: 0, // Pass the calculated discount
                    isGiftCard: true,
                },
            });
            onClose(); // Close the modal
        } catch (error) {
            // Handle error silently
        }
    };

    return (
        <div className="purchase-modal">
            <section className="px-5 md:px-10 xl:px-0">
                <div className='flex flex-col'>
                    <div className='flex flex-col gap-7 py-5 rounded-[20px]'>
                        <div className='flex justify-between items-start'>
                            <p className='w-3/5 font-THICCCBOI-SemiBold text-xl leading-6 font-semibold'>Service Name :</p>
                            <p className='font-THICCCBOI-SemiBold text-xl'>{product.name}</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-7 py-5 rounded-[20px]'>
                        <div className='flex justify-between items-center'>
                            <p className='w-3/5 font-THICCCBOI-SemiBold text-xl leading-6 font-semibold'>Total cost :</p>
                            <p className='font-THICCCBOI-Bold text-xl leading-6 font-bold'>${((Number(product.discounted_price) || Number(product.price)) * quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    <hr className='border-[#4CC800] my-3' />
                    {(user || isGuestCheckout) &&
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => setSelectedPaymentMethod('paypal')}
                                className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'paypal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                disabled={isProcessing}
                            >
                                PayPal
                            </button>
                            <button
                                onClick={() => setSelectedPaymentMethod('stripe')}
                                className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'stripe' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                disabled={isProcessing}
                            >
                                Stripe
                            </button>
                        </div>
                    }
                    <div className='mt-6'>
                        {user ? (
                            <>
                                {selectedPaymentMethod == 'paypal' && (
                                    <PayPalButtons
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        onCancel={handleCancel}
                                        disabled={isProcessing}
                                    />
                                )}
                                {selectedPaymentMethod == 'stripe' && clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <StripePaymentForm
                                            product={product}
                                            userInfo={userInfo}
                                            onClose={onClose}
                                            navigate={navigate}
                                            isProcessing={isProcessing}
                                            setIsProcessing={setIsProcessing}
                                            quantity={quantity}
                                            isGuestCheckout={false}
                                            guestInfo={null}
                                        />
                                    </Elements>
                                )}
                            </>
                        ) : !isGuestCheckout ? (
                            <div className="text-center">
                                <p className="font-THICCCBOI-SemiBold text-lg mb-4">Choose your checkout option:</p>
                                <div className="flex flex-col gap-3">
                                    <Link to="/login" className='primary-gradient font-Montserrat text-base leading-4 font-semibold block mx-auto text-white py-4 px-6 rounded-full w-fit transition-all duration-300 ease-in-out active:scale-95'>Login to proceed</Link>
                                    <button
                                        onClick={() => setIsGuestCheckout(true)}
                                        className="bg-white text-black font-Montserrat text-base leading-4 font-medium py-4 px-6 rounded-full w-fit mx-auto transition-all duration-300 ease-in-out active:scale-95 border-2 border-gray-300"
                                    >
                                        Continue as Guest
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Guest Information Form */}
                                <div className="mb-6">
                                    <h3 className="font-THICCCBOI-SemiBold text-lg mb-4">Guest Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-THICCCBOI-SemiBold text-sm mb-2">Email *</label>
                                            <input
                                                type="email"
                                                value={guestInfo.email}
                                                onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                                                className="w-full p-3 bg-[#EDEDED] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-THICCCBOI-SemiBold text-sm mb-2">Phone Number *</label>
                                            <input
                                                type="tel"
                                                value={guestInfo.phone}
                                                onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                                                className="w-full p-3 bg-[#EDEDED] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsGuestCheckout(false)}
                                        className="text-green-500 font-THICCCBOI-SemiBold text-sm mt-2 underline"
                                    >
                                        ← Back to login options
                                    </button>
                                </div>

                                {/* Payment Methods for Guest */}
                                <>
                                    {selectedPaymentMethod == 'paypal' && (
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onCancel={handleCancel}
                                            disabled={isProcessing}
                                        />
                                    )}
                                    {selectedPaymentMethod == 'stripe' && clientSecret && (
                                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                                            <StripePaymentForm
                                                product={product}
                                                userInfo={null}
                                                onClose={onClose}
                                                navigate={navigate}
                                                isProcessing={isProcessing}
                                                setIsProcessing={setIsProcessing}
                                                quantity={quantity}
                                                isGuestCheckout={true}
                                                guestInfo={guestInfo}
                                            />
                                        </Elements>
                                    )}
                                </>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const StripePaymentForm = ({ product, userInfo, onClose, navigate, isProcessing, setIsProcessing, quantity, isGuestCheckout, guestInfo }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState(false);
    const user = useSelector(selectUser);

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                iconColor: '#6772e5',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: false,
    };

    const handleCardChange = (event) => {
        setCardComplete(event.complete);
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);
        setError(null);

        if (!stripe || !elements) {
            setError('Stripe is not loaded yet.');
            setIsProcessing(false);
            return;
        }

        if (!cardComplete) {
            setError('Please complete your card details.');
            setIsProcessing(false);
            return;
        }

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                    payment_method_data: {
                        billing_details: {
                            name: isGuestCheckout ? guestInfo.email : userInfo.first_name + ' ' + userInfo.last_name,
                            email: isGuestCheckout ? guestInfo.email : userInfo.email,
                            phone: isGuestCheckout ? guestInfo.phone : (userInfo.phone || ''),
                        },
                    },
                },
                redirect: 'if_required',
            });

            if (stripeError) {
                setError(stripeError.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status == 'succeeded') {
                // One-time payment succeeded
                await processOrder({
                    id: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    payer_name: isGuestCheckout ? guestInfo.email : userInfo.first_name + " " + userInfo.last_name,
                    payer_email: isGuestCheckout ? guestInfo.email : userInfo.email,
                    payer_phone: isGuestCheckout ? guestInfo.phone : (userInfo.phone || ''),
                }, "stripe");
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const processOrder = async (paymentDetails, paymentMethod) => {
        const orderDetails = {
            user_id: user ? userInfo.id : 'guest',
            cartItems: [
                {
                    service_id: product.id.toString(),
                    service_name: product.name,
                    qty: quantity,
                    price: Number(product.discounted_price) || Number(product.price),
                    total_price: (Number(product.discounted_price) || Number(product.price)) * quantity,
                    service_type: product.service_type,
                    paypal_plan_id: product.paypal_plan_id,
                    stripe_plan_id: product.stripe_plan_id,
                },
            ],
            transaction_id: paymentDetails.id,
            amount: paymentDetails.amount,
            promoCode: "", // If you have a promo code logic, replace it accordingly
            payer_name: paymentDetails.payer_name,
            payer_email: paymentDetails.payer_email,
            payer_phone: paymentDetails.payer_phone || '',
            payment_method: paymentMethod,
            order_type: "one_time",
        };

        try {
            const response = await axios.post(API_ENDPOINT + 'success', orderDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(user && { Authorization: `Bearer ${getUserToken(user)}` }),
                },
            });

            navigate(`/order-confirmation/${response.data.order_id}`, {
                state: {
                    cartItems: orderDetails.cartItems,
                    isPromoCodeApplied: false,
                    total: orderDetails.amount,
                    discountAmount: 0, // Pass the calculated discount
                    isGiftCard: true,
                },
            });
            onClose(); // Close the modal
        } catch (error) {
            // Handle error silently
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="font-THICCCBOI-SemiBold text-lg mb-2">Card Information</h3>
                <p className="text-gray-600 text-sm mb-4">Enter your card details to complete the payment</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-THICCCBOI-SemiBold text-sm mb-2 text-gray-700">
                        Card Details *
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 bg-white">
                        <CardElement 
                            options={cardElementOptions}
                            onChange={handleCardChange}
                            disabled={isProcessing}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex justify-between items-center">
                        <span className="font-THICCCBOI-SemiBold text-sm text-gray-700">Total Amount:</span>
                        <span className="font-THICCCBOI-Bold text-lg">${((Number(product.discounted_price) || Number(product.price)) * quantity).toFixed(2)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || !cardComplete || isProcessing}
                    className={`w-full py-3 px-4 rounded-md font-Montserrat text-base font-medium transition-all duration-200 ${
                        !stripe || !cardComplete || isProcessing
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#0D6EFD] text-white hover:bg-[#0b5ed7] active:scale-95'
                    }`}
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Payment...
                        </div>
                    ) : (
                        `Pay $${((Number(product.discounted_price) || Number(product.price)) * quantity).toFixed(2)}`
                    )}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Your payment is secured by Stripe. We never store your card details.
                    </p>
                </div>
            </form>
        </div>
    );
};

OneTimePurchaseModal.propTypes = {
    product: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    quantity: PropTypes.number.isRequired,
};

StripePaymentForm.propTypes = {
    product: PropTypes.object.isRequired,
    userInfo: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    setIsProcessing: PropTypes.func.isRequired,
    quantity: PropTypes.number.isRequired,
    isGuestCheckout: PropTypes.bool,
    guestInfo: PropTypes.object,
};

export default OneTimePurchaseModal;