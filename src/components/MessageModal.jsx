import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectUser, getUserToken } from '../reducers/authSlice';
import { selectUserInfo } from '../reducers/userSlice';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { API_ENDPOINT } from '../utils/constants';

const stripePromise = loadStripe('pk_test_51MuE4RJIWkcGZUIabXuoFFrr5gMT5S9Ynq63FfkoZMVeEkq94UdXOKwK4t3msKIsQwnLwafv9JyvzIdKpbsFonwd00BWb4lWdj');

const MessageModal = ({ selectedOrderItem, setRevisions, setOrderStatus, setOrderItems, onClose }) => {
    const user = useSelector(selectUser);
    const [message, setMessage] = useState('');
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [error, setError] = useState('');

    const handleSend = async () => {
        if (Number(selectedOrderItem.max_revision) == 0) {
            setShowPaymentOptions(true);
            return;
        }

        if (!message.trim()) {
            setError('Please enter a message');
            return;
        }

        setIsProcessing(true);
        setError('');
        
        try {
            const response = await axios.post(`${API_ENDPOINT}revision`, {
                order_id: selectedOrderItem.order_id,
                service_id: selectedOrderItem.service_id,
                message: message
            }, {
                headers: {
                    'Authorization': `Bearer ${getUserToken(user)}`
                },
            });

            console.log('Revision API response:', response.data);
            
            // Handle different possible response structures
            const revisionData = response.data.revision || response.data.data?.revision || response.data;
            const orderStatus = response.data.Order_status || response.data.data?.Order_status || response.data.order_status;
            
            setRevisions(revisionData);
            setOrderStatus(orderStatus.toString());
            setOrderItems(prev => prev.map(item => {
                if (item.id == selectedOrderItem.id) {
                    return {
                        ...item,
                        max_revision: (Number(item.max_revision) - 1).toString(),
                    };
                }
                return item;
            }));

            setIsMessageSent(true);
            setMessage(''); // Clear the message after sending
            
            // Close modal after 2 seconds
            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error sending revision:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (Number(selectedOrderItem.max_revision) == 0 && !showPaymentOptions) {
        return (
            <div className="py-1">
                {Number(selectedOrderItem.max_revision) == 0 && <p className="text-red-500 font-Montserrat text-base leading-6 font-normal mb-3 rounded-md">Please pay $25 to request another one.</p>}
                {error && <p className="text-red-500 font-Montserrat text-base leading-6 font-normal mb-3 rounded-md">{error}</p>}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    className="w-full p-[15px] text-base leading-4 font-Roboto font-normal rounded-[10px] border-2 resize-none outline-4 outline-green-500"
                    rows="5"
                    disabled={isProcessing}
                    style={{ opacity: isProcessing ? 0.5 : 1 }}
                />
                <button
                    onClick={handleSend}
                    className="font-Montserrat text-base leading-6 font-normal py-3 px-4 rounded-md text-white w-full primary-gradient transition-all duration-300 ease-in-out active:scale-95 mt-5"
                    disabled={!message.trim() || isProcessing}
                    style={{ opacity: isProcessing ? 0.5 : 1 }}
                >
                    {isProcessing ? 'PAYING...' : 'PAY NOW'}
                </button>
            </div>
        );
    }

    if (showPaymentOptions) {
        return (
            <div className="py-1">
                <ReviewPurchaseModal
                    orderId={selectedOrderItem.order_id}
                    seletedOrderItems={selectedOrderItem}
                    amount={25}
                    setRevisions={setRevisions}
                    message={message}
                    setMessage={setMessage}
                    setOrderStatus={setOrderStatus}
                    onClose={onClose}
                />
            </div>
        );
    }

    return (
        <div className="py-1">
            {isMessageSent ? (
                <div className="text-center">
                    <CheckIcon className="text-green-500 h-10 w-10 mx-auto" />
                    <p className="mt-4 text-lg font-semibold">Message Sent</p>
                    <p className="mt-2 text-gray-500">Your message has been successfully sent.</p>
                </div>
            ) : (
                <>
                    {error && <p className="text-red-500 font-Montserrat text-base leading-6 font-normal mb-3 rounded-md">{error}</p>}
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message"
                        className="w-full p-[15px] text-base leading-4 font-Roboto font-normal rounded-[10px] border-2 resize-none outline-4 outline-green-500"
                        rows="5"
                        disabled={isProcessing}
                        style={{ opacity: isProcessing ? 0.5 : 1 }}
                    />
                    <button
                        onClick={handleSend}
                        className="font-Montserrat text-base leading-6 font-normal py-3 px-4 rounded-md text-white w-full primary-gradient transition-all duration-300 ease-in-out active:scale-95 mt-5"
                        disabled={!message.trim() || isProcessing}
                        style={{ opacity: isProcessing ? 0.5 : 1 }}
                    >
                        {isProcessing ? 'Sending...' : 'Send'}
                    </button>
                </>
            )}
        </div>
    );
};

MessageModal.propTypes = {
    selectedOrderItem: PropTypes.object.isRequired,
    setRevisions: PropTypes.func.isRequired,
    setOrderStatus: PropTypes.func.isRequired,
    setOrderItems: PropTypes.func.isRequired,
    onClose: PropTypes.func,
};

const ReviewPurchaseModal = ({ orderId, seletedOrderItems, amount, setRevisions, message, setMessage, setOrderStatus, onClose }) => {
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
    const [{ options }, paypalDispatch] = usePayPalScriptReducer();
    const [clientSecret, setClientSecret] = useState('');
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');

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

    const handleCancel = (data) => {
        setIsProcessing(false);
    };

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
                service_id: seletedOrderItems.service_id,
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
                        'Authorization': `Bearer ${getUserToken(user)}`,
                    },
                });

                // Run Send revision after payment complete
                const response = await axios.post(API_ENDPOINT + 'revision', {
                    order_id: orderId,
                    service_id: seletedOrderItems.service_id,
                    message: message,
                    transaction_id: transactionDetails.transaction_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${getUserToken(user)}`,
                    },
                });

                console.log('Payment revision API response:', response.data);
                
                // Handle different possible response structures
                const revisionData = response.data.revision || response.data.data?.revision || response.data;
                const orderStatus = response.data.Order_status || response.data.data?.Order_status || response.data.order_status;
                
                setRevisions(revisionData);
                setOrderStatus(orderStatus.toString());
                setMessage('');

                setIsPaymentComplete(true);
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    if (onClose) {
                        onClose();
                    }
                }, 3000);

            } catch (error) {
                console.error('Payment error:', error);
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

                    {isPaymentComplete ? (
                        <div className="text-center">
                            <CheckIcon className="text-green-500 h-10 w-10 mx-auto" />
                            <p className="mt-4 text-lg font-semibold">Payment Complete</p>
                            <p className="mt-2 text-gray-500">Your purchase has been successfully processed. Chat with us for more details.</p>
                        </div>
                    ) : (
                        <>
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

                            <div className='mt-6'>
                                {selectedPaymentMethod == 'paypal' && (
                                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onCancel={handleCancel} disabled={isProcessing} />
                                )}

                                {selectedPaymentMethod == 'stripe' && clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <StripePaymentForm
                                            finalTotal={parseFloat(Number(amount)).toFixed(2)}
                                            setIsPaymentComplete={setIsPaymentComplete}
                                            isProcessing={isProcessing}
                                            setIsProcessing={setIsProcessing}
                                            orderId={orderId}
                                            service_id={seletedOrderItems.service_id}
                                            setRevisions={setRevisions}
                                            message={message}
                                            setMessage={setMessage}
                                            setOrderStatus={setOrderStatus}
                                            onClose={onClose}
                                        />
                                    </Elements>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

ReviewPurchaseModal.propTypes = {
    seletedOrderItems: PropTypes.object,
    orderId: PropTypes.string,
    amount: PropTypes.number,
    setRevisions: PropTypes.func.isRequired,
    message: PropTypes.string,
    setMessage: PropTypes.func.isRequired,
    setOrderStatus: PropTypes.func.isRequired,
    onClose: PropTypes.func,
};

const StripePaymentForm = ({ finalTotal, setIsPaymentComplete, isProcessing, setIsProcessing, orderId, service_id, setRevisions, message, setMessage, setOrderStatus, onClose }) => {
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
                    'Authorization': `Bearer ${getUserToken(user)}`,
                }
            });

            // Run Send revision after payment complete
            const response = await axios.post(API_ENDPOINT + 'revision', {
                order_id: orderId,
                service_id: service_id,
                message: message,
                transaction_id: transactionId
            }, {
                headers: {
                    'Authorization': `Bearer ${getUserToken(user)}`,
                },
            });

            console.log('Stripe payment revision API response:', response.data);
            
            // Handle different possible response structures
            const revisionData = response.data.revision || response.data.data?.revision || response.data;
            const orderStatus = response.data.Order_status || response.data.data?.Order_status || response.data.order_status;
            
            setRevisions(revisionData);
            setOrderStatus(orderStatus.toString());
            setMessage('');

            setIsPaymentComplete(true);
            
            // Close modal after 3 seconds
            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 3000);
            
        } catch (apiError) {
            console.error('Payment error:', apiError);
            setError('Payment failed. Please try again.');
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

StripePaymentForm.propTypes = {
    finalTotal: PropTypes.string,
    setIsPaymentComplete: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    setIsProcessing: PropTypes.func.isRequired,
    orderId: PropTypes.string,
    service_id: PropTypes.string,
    setRevisions: PropTypes.func.isRequired,
    message: PropTypes.string,
    setMessage: PropTypes.func.isRequired,
    setOrderStatus: PropTypes.func.isRequired,
    onClose: PropTypes.func,
};

export default MessageModal;