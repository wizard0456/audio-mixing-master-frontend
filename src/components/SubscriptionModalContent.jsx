import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser } from '../reducers/authSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { selectUserInfo } from '../reducers/userSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { API_ENDPOINT } from '../utils/constants';

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
    const [subscriptionId, setSubscriptionId] = useState("");

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
            const fetchClientSecret = async () => {
                try {
                    const response = await axios.post(API_ENDPOINT + 'stripe/subscribe', {
                        plan_id: product.stripe_plan_id,
                        user_email: userInfo.email,
                        user_name: userInfo.first_name + ' ' + userInfo.last_name
                    }, {
                        headers: {
                            'Authorization': `Bearer ${user}`,
                        }
                    });
                    setClientSecret(response.data.intent);
                    setSubscriptionId(response.data.subscription_id);
                } catch (error) {
                    console.error('Error fetching client secret:', error);
                }
            };

            fetchClientSecret();
        }
    }, [user, product, userInfo]);

    const handleCancel = (data) => {
        console.log('PayPal payment cancelled', data);
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
            console.error("Error creating subscription:", err);
            setIsProcessing(false);
        });
    };

    const onApproveSubscription = (data, actions) => {
        return actions.subscription.get().then(async (details) => {
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
                        stripe_plan_id: product.stripe_plan_id
                    }
                ],
                transaction_id: details.id,
                amount: details.billing_info.last_payment.amount.value,
                promoCode: "", // If you have a promo code logic, replace it accordingly
                payer_name: details.subscriber.name.given_name + " " + details.subscriber.name.surname,
                payer_email: details.subscriber.email_address,
                payment_method: "paypal",
                order_type: "subscription"
            };

            try {
                const response = await axios.post(API_ENDPOINT + 'success',
                    JSON.stringify(subscriptionDetails), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${user}`,
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
                console.error('Error creating order on backend:', error);
            } finally {
                setIsProcessing(false);
            }
        }).catch(err => {
            console.error("Error approving subscription:", err);
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
                            <Link to="/login" className='primary-gradient font-Montserrat text-base leading-4 font-semibold block mx-auto text-white py-4 px-6 rounded-full w-fit transition-all duration-300 ease-in-out active:scale-95'>Login to subscribe</Link>
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
    const user = useSelector(selectUser);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);

        if (!stripe || !elements) {
            setError('Stripe is not loaded yet.');
            setIsProcessing(false);
            return;
        }

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
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
                            'Authorization': `Bearer ${user}`,
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
                    console.error('Error creating order on backend:', error);
                }
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement className="bg-white p-3 rounded-md mb-4" disabled={isProcessing} />
            {error && <div className="text-red-500 mb-3">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="bg-[#0D6EFD] font-Montserrat text-white font-normal text-base py-3 rounded-md w-full leading-6"
            >
                {isProcessing ? 'Processing...' : `Subscribe Now`}
            </button>
        </form>
    );
};

SubscriptionModalContent.propTypes = {
    product: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

StripeSubscriptionForm.propTypes = {
    product: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    setIsProcessing: PropTypes.func.isRequired,
    subscriptionId: PropTypes.string,
};

export default SubscriptionModalContent;