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

const SubscriptionModalContent = ({ product, onClose }) => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
    const [{ options }, paypalDispatch] = usePayPalScriptReducer();
    const [clientSecret, setClientSecret] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
    const [isProcessing, setIsProcessing] = useState(false);
    const [subscriptionId, setSubscriptionId] = useState('');
    


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
        if (user && product?.stripe_plan_id) {
            console.log(product);
            const fetchClientSecret = async () => {
                try {
                    const response = await axios.post(API_ENDPOINT + 'stripe/subscribe', {
                        service_id: product.id,
                        priceId: product.stripe_plan_id,
                        customerEmail: userInfo.email,
                        customerName: userInfo.first_name + ' ' + userInfo.last_name

                    }, {
                        headers: {
                            'Authorization': `Bearer ${getUserToken(user)}`,
                        }
                    });
                    setClientSecret(response.data.intent);
                    setSubscriptionId(response.data.subscription_id);
                } catch (error) {
                    // Handle error silently
                    console.log(error);
                }
            };

            fetchClientSecret();
        }
    }, [user, product, userInfo]);

    const handleCancel = (data) => {
        setIsProcessing(false);
    };

    if (!product) {
        return null; // Or a loading spinner, or any fallback UI
    }

    const createSubscription = (data, actions) => {
        setIsProcessing(true);
        return actions.subscription.create({
            plan_id: product.paypal_plan_id,
        }).catch(err => {
            setIsProcessing(false);
        });
    };

    const onApproveSubscription = (data, actions) => {
        setIsProcessing(true);
        return actions.subscription.get().then(async (details) => {
            setSubscriptionId(details.id);
            const subscriptionDetails = {
                user_id: userInfo.id,
                cartItems: [
                    {
                        service_id: product.id.toString(),
                        service_name: product.name,
                        qty: 1,
                        price: Number(product.discounted_price) || Number(product.price),
                        total_price: Number(product.discounted_price) || Number(product.price),
                        service_type: product.service_type,
                        paypal_plan_id: product.paypal_plan_id,
                        stripe_plan_id: product.stripe_plan_id,
                    }
                ],
                transaction_id: details.id,
                amount: Number(product.discounted_price) || Number(product.price),
                promoCode: "", // If you have a promo code logic, replace it accordingly
                payer_name: userInfo.first_name + " " + userInfo.last_name,
                payer_email: userInfo.email,
                payer_phone: userInfo.phone || '',
                payment_method: "paypal",
                order_type: "subscription"
            };

            try {
                const response = await axios.post(API_ENDPOINT + 'success',
                    JSON.stringify(subscriptionDetails), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...(user && { Authorization: `Bearer ${getUserToken(user)}` }),
                    }
                });

                navigate(`/order-confirmation/${response.data.order_id}`, {
                    state: {
                        cartItems: subscriptionDetails.cartItems,
                        isPromoCodeApplied: false,
                        total: subscriptionDetails.amount,
                        discountAmount: 0, // Pass the calculated discount
                        isGiftCard: false,
                    }
                });
                onClose(); // Close the modal
            } catch (error) {
                setIsProcessing(false);
            }
        }).catch(err => {
            setIsProcessing(false);
        });
    };

    return (
        <div className="subscription-modal">
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
                            <p className='font-THICCCBOI-Bold text-xl leading-6 font-bold'>${(Number(product.discounted_price) || Number(product.price)).toFixed(2)}</p>
                        </div>
                    </div>
                    <hr className='border-[#4CC800] my-3' />

                    {user &&
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
                                        style={{ layout: 'vertical' }}
                                        createSubscription={createSubscription}
                                        onApprove={onApproveSubscription}
                                        disabled={isProcessing}
                                        onCancel={handleCancel}
                                    />
                                )}

                                {selectedPaymentMethod == 'stripe' && clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <StripeSubscriptionForm
                                            product={product}
                                            userInfo={userInfo}
                                            clientSecret={clientSecret}
                                            onClose={onClose}
                                            navigate={navigate}
                                            isProcessing={isProcessing}
                                            setIsProcessing={setIsProcessing}
                                            subscriptionId={subscriptionId}
                                        />
                                    </Elements>
                                )}
                            </>
                        ) : (
                            <div className="text-center">
                                <p className="font-THICCCBOI-SemiBold text-lg mb-4">Login required for subscription:</p>
                                <div className="flex flex-col gap-3">
                                    <Link to="/login" className='primary-gradient font-Montserrat text-base leading-4 font-semibold block mx-auto text-white py-4 px-6 rounded-full w-fit transition-all duration-300 ease-in-out active:scale-95'>Login to subscribe</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const StripeSubscriptionForm = ({ product, userInfo, onClose, navigate, isProcessing, setIsProcessing, subscriptionId }) => {
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
                            name: userInfo.first_name + ' ' + userInfo.last_name,
                            email: userInfo.email,
                            phone: userInfo.phone || '',
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
                const subscriptionDetails = {
                    user_id: userInfo.id,
                    cartItems: [
                        {
                            service_id: product.id.toString(),
                            service_name: product.name,
                            qty: 1,
                            price: Number(product.discounted_price) || Number(product.price),
                            total_price: Number(product.discounted_price) || Number(product.price),
                            service_type: product.service_type,
                            paypal_plan_id: product.paypal_plan_id,
                            stripe_plan_id: product.stripe_plan_id,
                        }
                    ],
                    transaction_id: subscriptionId,
                    amount: paymentIntent.amount / 100,
                    promoCode: "", // If you have a promo code logic, replace it accordingly
                    payer_name: userInfo.first_name + " " + userInfo.last_name,
                    payer_email: userInfo.email,
                    payment_method: "stripe",
                    order_type: "subscription"
                };

                try {
                    const response = await axios.post(API_ENDPOINT + 'success',
                        JSON.stringify(subscriptionDetails), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${getUserToken(user)}`,
                        }
                    });

                    navigate(`/order-confirmation/${response.data.order_id}`, {
                        state: {
                            cartItems: subscriptionDetails.cartItems,
                            isPromoCodeApplied: false,
                            total: subscriptionDetails.amount,
                            discountAmount: 0, // Pass the calculated discount
                            isGiftCard: false,
                        }
                    });
                    onClose(); // Close the modal
                } catch (error) {
                    // Handle error silently
                }
            }
        } catch (err) {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="font-THICCCBOI-SemiBold text-lg mb-2">Card Information</h3>
                <p className="text-gray-600 text-sm mb-4">Enter your card details to complete the subscription</p>
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
                        <span className="font-THICCCBOI-SemiBold text-sm text-gray-700">Subscription Amount:</span>
                        <span className="font-THICCCBOI-Bold text-lg">${(Number(product.discounted_price) || Number(product.price)).toFixed(2)}</span>
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
                            Processing Subscription...
                        </div>
                    ) : (
                        `Subscribe Now`
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

SubscriptionModalContent.propTypes = {
    product: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

StripeSubscriptionForm.propTypes = {
    product: PropTypes.object.isRequired,
    userInfo: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    setIsProcessing: PropTypes.func.isRequired,
    subscriptionId: PropTypes.string,
    isGuestCheckout: PropTypes.bool,
    guestInfo: PropTypes.object,
};

export default SubscriptionModalContent;