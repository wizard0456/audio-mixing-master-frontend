import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import axios from 'axios';
import { selectUser } from '../reducers/authSlice';
import { selectUserInfo } from '../reducers/userSlice';
import { API_ENDPOINT } from '../utils/constants';
import { CheckIcon } from '@heroicons/react/24/outline';

const stripePromise = loadStripe('pk_test_51MuE4RJIWkcGZUIabXuoFFrr5gMT5S9Ynq63FfkoZMVeEkq94UdXOKwK4t3msKIsQwnLwafv9JyvzIdKpbsFonwd00BWb4lWdj');

const ReviewPurchaseModal = ({ orderId, seletedOrderItems, amount }) => {
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
    const [{ options }, paypalDispatch] = usePayPalScriptReducer();
    const [clientSecret, setClientSecret] = useState('');
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // State to track payment processing
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal'); // State to track selected payment method

    const handleCancel = (data) => {
        console.log('PayPal payment cancelled', data);
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
                            'Authorization': `Bearer ${user}`,
                        },
                    });
                    setClientSecret(response.data);
                } catch (error) {
                    console.error('Error fetching client secret:', error);
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
                user_id: userInfo.id,
                service_id: seletedOrderItems,
                transaction_id: details.id,
                amount: details.purchase_units[0].amount.value,
                payer_name: details.payer.name.given_name + " " + details.payer.name.surname,
                payer_email: details.payer.email_address,
                payment_method: "paypal",
                order_id: orderId,
            };

            try {
                await axios.post(API_ENDPOINT + 'buy-revision', transactionDetails, {
                    headers: {
                        'Authorization': `Bearer ${user}`,
                    },
                });

                setIsPaymentComplete(true);
            } catch (error) {
                console.error('Error creating order on backend:', error);
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
                        ) : (
                            user ? (
                                <>
                                    {selectedPaymentMethod == 'paypal' && (
                                        <PayPalButtons createOrder={createOrder} onApprove={onApprove} disabled={isProcessing} onCancel={handleCancel} style={{ opacity: isProcessing ? 0.5 : 1 }} />
                                    )}

                                    {selectedPaymentMethod == 'stripe' && clientSecret && (
                                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                                            <StripePaymentForm
                                                finalTotal={parseFloat(Number(amount)).toFixed(2)}
                                                calculateFinalCost={parseFloat(Number(amount)).toFixed(2)}
                                                setIsPaymentComplete={setIsPaymentComplete}
                                                isProcessing={isProcessing}
                                                setIsProcessing={setIsProcessing}
                                                orderId={orderId}
                                                service_id={seletedOrderItems}
                                            />
                                        </Elements>
                                    )}
                                </>
                            ) : (
                                <p className='primary-gradient font-Montserrat text-base leading-4 font-semibold block mx-auto text-white py-4 px-6 rounded-full w-fit'>Login to proceed</p>
                            )
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const StripePaymentForm = ({ finalTotal, setIsPaymentComplete, isProcessing, setIsProcessing, orderId, service_id }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const userInfo = useSelector(selectUserInfo);
    const user = useSelector(selectUser);

    const handleSuccessPayment = async (transactionId) => {
        const transactionDetails = {
            user_id: userInfo.id.toString(),
            service_id: service_id,
            transaction_id: transactionId,
            amount: finalTotal,
            payer_name: userInfo.first_name + ' ' + userInfo.last_name,
            payer_email: userInfo.email,
            payment_method: "Stripe",
            order_id: orderId,
        };

        try {
            await axios.post(API_ENDPOINT + 'buy-revision', transactionDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user}`,
                }
            });

            setIsPaymentComplete(true);
        } catch (apiError) {
            console.error('Error creating order on backend:', apiError);
            setError('Order confirmation failed. Please contact support.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);

        if (!stripe || !elements) {
            setError('Stripe is not loaded yet.');
            setIsProcessing(false);
            return;
        }

        try {
            const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
                redirect: 'if_required',
            });

            if (paymentError) {
                setError(paymentError.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status == 'succeeded') {
                handleSuccessPayment(paymentIntent.id);
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <PaymentElement className="bg-white p-3 rounded-md mb-4" disabled={isProcessing} style={{ opacity: isProcessing ? 0.5 : 1 }} />
                {error && <div className="text-red-500 mb-3">{error}</div>}
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="bg-[#0D6EFD] font-Montserrat text-base leading-6 font-normal py-3 px-4 rounded-md text-white w-full"
                    style={{ opacity: isProcessing ? 0.5 : 1 }}
                >
                    {isProcessing ? 'Processing...' : `Pay $${finalTotal}`}
                </button>
            </form>
        </>
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
};

export default ReviewPurchaseModal;