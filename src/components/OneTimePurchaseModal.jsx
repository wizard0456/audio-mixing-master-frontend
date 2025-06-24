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
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { API_ENDPOINT } from '../utils/constants';

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
                            'Authorization': `Bearer ${user}`,
                        },
                    });

                    setClientSecret(response.data || response.data);
                } catch (error) {
                    console.error('Error fetching client secret:', error);
                }
            };

            fetchClientSecret();
        }
    }, [user, product, userInfo, quantity]);

    const handleCancel = (data) => {
        console.log('PayPal payment cancelled', data);
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
            console.error('Error creating order:', err);
            setIsProcessing(false);
        });
    };

    const onApprove = async (data, actions) => {
        return actions.order.capture().then(async (details) => {
            await processOrder({
                id: details.id,
                amount: details.purchase_units[0].amount.value,
                payer_name: details.payer.name.given_name + " " + details.payer.name.surname,
                payer_email: details.payer.email_address,
            }, "paypal");
        }).catch(err => {
            console.error("Error approving order:", err);
            setIsProcessing(false);
        });
    };

    const processOrder = async (paymentDetails, paymentMethod) => {
        const orderDetails = {
            user_id: userInfo.id,
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
            payment_method: paymentMethod,
            order_type: "one_time",
        };

        try {
            const response = await axios.post(API_ENDPOINT + 'success', orderDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user}`,
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
            console.error('Error creating order on backend:', error);
        } finally {
            setIsProcessing(false);
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
                                        />
                                    </Elements>
                                )}
                            </>
                        ) : (
                            <Link to="/login" className='primary-gradient font-Montserrat text-base leading-4 font-semibold block mx-auto text-white py-4 px-6 rounded-full w-fit transition-all duration-300 ease-in-out active:scale-95'>Login to proceed</Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const StripePaymentForm = ({ product, userInfo, onClose, navigate, isProcessing, setIsProcessing, quantity }) => {
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
                // One-time payment succeeded
                await processOrder({
                    id: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    payer_name: userInfo.first_name + " " + userInfo.last_name,
                    payer_email: userInfo.email,
                }, "stripe");
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const processOrder = async (paymentDetails, paymentMethod) => {
        const orderDetails = {
            user_id: userInfo.id,
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
            payment_method: paymentMethod,
            order_type: "one_time",
        };

        try {
            const response = await axios.post(API_ENDPOINT + 'success', orderDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user}`,
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
            console.error('Error creating order on backend:', error);
            setError('Order confirmation failed. Please contact support.');
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
                {isProcessing ? 'Processing...' : `Pay $${((Number(product.discounted_price) || Number(product.price)) * quantity).toFixed(2)}`}
            </button>
        </form>
    );
};

OneTimePurchaseModal.propTypes = {
    product: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    quantity: PropTypes.number.isRequired,
};

StripePaymentForm.propTypes = {
    product: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    setIsProcessing: PropTypes.func.isRequired,
    quantity: PropTypes.number.isRequired,
};

export default OneTimePurchaseModal;