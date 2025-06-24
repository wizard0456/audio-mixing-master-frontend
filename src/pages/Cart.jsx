import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getCartItems,
    updateItem,
    removeItem,
    updateCart,
    removeFromCart,
    clearCart,
} from '../reducers/cartSlice';
import { selectUser } from '../reducers/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PurpleShadowBG from '../assets/images/purple-shadow-bg.webp';
import GreenShadowBG from '../assets/images/green-shadow-bg.webp';
import { selectUserInfo } from '../reducers/userSlice';
import { RxCross2 } from 'react-icons/rx';
import { API_ENDPOINT } from '../utils/constants';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51MuE4RJIWkcGZUIabXuoFFrr5gMT5S9Ynq63FfkoZMVeEkq94UdXOKwK4t3msKIsQwnLwafv9JyvzIdKpbsFonwd00BWb4lWdj');

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(getCartItems);
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
    const [isProcessing, setIsProcessing] = useState(false);

    // Discount State
    const [promoCode, setPromoCode] = useState('');
    const [promoCodeApplied, setPromoCodeApplied] = useState('');
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState('');
    const [matchedProductIds, setMatchedProductIds] = useState([]);
    const [isGeneralCoupon, setIsGeneralCoupon] = useState(false);
    const [couponType, setCouponType] = useState(''); // Added state for coupon type

    // PayPal Part Here
    const [{ options }, paypalDispatch] = usePayPalScriptReducer();

    useEffect(() => {
        paypalDispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency: options.currency,
            },
        });
    }, [cartItems, promoCodeApplied, paypalDispatch, options.currency]);

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await axios.post(
                    API_ENDPOINT + 'stripe/intent',
                    {
                        amount: calculateFinalCost(),
                        user_id: user.id,
                        cart_items: cartItems,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user}`,
                        },
                    }
                );
                setClientSecret(response.data);
            } catch (error) {
                console.error('Error fetching client secret:', error);
            }
        };

        if (user && cartItems.length > 0 && selectedPaymentMethod == 'stripe') {
            fetchClientSecret();
        }
    }, [cartItems, user, promoCodeApplied, selectedPaymentMethod]);

    const handleCancel = (data) => {
        console.log('PayPal payment cancelled', data);
        setIsProcessing(false);
    };

    const handleIncrement = (item) => {
        const newQuantity = item.qty + 1;
        const newTotalPrice = (newQuantity * parseFloat(item.price)).toFixed(2);
        if (user) {
            dispatch(updateCart({ ...item, qty: newQuantity, total_price: newTotalPrice }));
        } else {
            dispatch(updateItem({ ...item, qty: newQuantity, total_price: newTotalPrice }));
        }
    };

    const handleDecrement = (item) => {
        if (item.qty > 1) {
            const newQuantity = item.qty - 1;
            const newTotalPrice = (newQuantity * parseFloat(item.price)).toFixed(2);
            if (user) {
                dispatch(updateCart({ ...item, qty: newQuantity, total_price: newTotalPrice }));
            } else {
                dispatch(updateItem({ ...item, qty: newQuantity, total_price: newTotalPrice }));
            }
        }
    };

    const handleRemove = (itemId) => {
        const item = cartItems.find((item) => item.service_id == itemId);

        if (user) {
            dispatch(removeFromCart(itemId));
        } else {
            dispatch(removeItem(itemId));
        }

        if (
            promoCodeApplied &&
            item &&
            (isGeneralCoupon || matchedProductIds.includes(item.service_id.toString()))
        ) {
            setDiscount(0);
            setDiscountType('');
            setPromoCodeApplied('');
            setMatchedProductIds([]);
            setIsGeneralCoupon(false);
            setError('');
        }
    };

    const calculateTotalCost = () => {
        return cartItems
            .reduce((acc, item) => acc + parseFloat(item.price * item.qty), 0)
            .toFixed(2);
    };

    const calculateFinalCost = () => {
        const total = cartItems.reduce(
            (acc, item) => Number(acc) + parseFloat(item.price * item.qty),
            0
        );

        let discountAmount = 0;

        if (couponType == 'gift') {
            const giftCardAmount = discount; // discount holds the remaining amount on the gift card
            discountAmount = Math.min(total, giftCardAmount);
        } else if (isGeneralCoupon) {
            if (discountType == 'percentage') {
                discountAmount = total * (discount / 100); // Apply percentage discount to the total order
            } else if (discountType == 'fixed') {
                discountAmount = discount; // Apply fixed discount to the total order
            }
        } else {
            cartItems.forEach((item) => {
                if (matchedProductIds.includes(item.service_id.toString())) {
                    if (discountType == 'fixed') {
                        discountAmount += discount * item.qty; // Apply fixed discount per product
                    } else if (discountType == 'percentage') {
                        discountAmount += item.total_price * (discount / 100); // Apply percentage discount per product
                    }
                }
            });
        }

        const finalAmount = total - discountAmount;
        return finalAmount > 0 ? finalAmount.toFixed(2) : '0.00';
    };

    const createOrder = (data, actions) => {
        const finalTotal = calculateFinalCost();

        setIsProcessing(true);

        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: finalTotal,
                        },
                    },
                ],
            })
            .catch((err) => {
                console.error('Error creating order:', err);
                setIsProcessing(false);
            });
    };

    const onApprove = async (data, actions) => {
        return actions.order.capture().then(async (details) => {
            const transactionDetails = {
                user_id: userInfo.id.toString(),
                cartItems: cartItems,
                transaction_id: details.id,
                amount: details.purchase_units[0].amount.value,
                promoCode: promoCodeApplied,
                payer_name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                payer_email: details.payer.email_address,
                payment_type: 'one_time',
                payment_method: 'paypal',
                order_type: 'one_time',
            };

            try {
                const response = await axios.post(API_ENDPOINT + 'success', transactionDetails, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${user}`,
                    },
                });

                dispatch(clearCart());
                navigate(`/order-confirmation/${response.data.order_id}`, {
                    state: {
                        cartItems,
                        isPromoCodeApplied: promoCodeApplied ? true : false,
                        total: calculateFinalCost(),
                        discountAmount:
                            cartItems.reduce((acc, item) => acc + parseFloat(item.total_price), 0) -
                            calculateFinalCost(),
                        isGiftCard: false,
                    },
                });
                setIsProcessing(false);
            } catch (error) {
                console.error('Error creating order on backend:', error);
                setIsProcessing(false);
            }
        });
    };

    const handlePromoCodeApply = async () => {
        setIsLoading(true);
        setError('');

        // reset the coupon type and discount amount and gift card amount
        setCouponType('');
        setDiscount(0);
        setDiscountType('');
        setPromoCodeApplied('');
        setMatchedProductIds([]);
        setIsGeneralCoupon(false);

        try {
            const response = await axios.post(
                `${API_ENDPOINT}coupon/verify/${promoCode}`,
                {
                    product_ids: cartItems.map((item) => item.service_id),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${user}`,
                    },
                }
            );

            if (response.data && response.data.coupon) {
                const coupon = response.data.coupon;
                const type = response.data.type;

                setPromoCodeApplied(promoCode);
                setPromoCode('');
                setCouponType(type); // Set the coupon type

                if (type == 'gift') {
                    setDiscount(parseFloat(coupon.amount));
                } else {
                    setDiscount(parseFloat(coupon.discount_value));
                    setDiscountType(coupon.discount_type);

                    if (coupon.coupon_type == '0') {
                        setIsGeneralCoupon(true);
                    } else if (coupon.coupon_type == '1' && response.data.matched_product_ids) {
                        setIsGeneralCoupon(false);
                        setMatchedProductIds(response.data.matched_product_ids);
                    }
                }
            } else {
                setError('Invalid promo code');
            }
        } catch (error) {
            console.error('Error verifying promo code:', error);
            setError('Failed to verify promo code');
        } finally {
            setIsLoading(false);
        }
    };

    const isAnyProductUnavailable = cartItems.length == 0;

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        setClientSecret('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGiftCardCheckout = async () => {
        setIsProcessing(true);
        const transactionDetails = {
            user_id: userInfo.id.toString(),
            cartItems: cartItems,
            transaction_id: promoCodeApplied, // Use the gift code as transaction_id
            amount: '0.00',
            promoCode: promoCodeApplied,
            payer_name: userInfo.first_name + ' ' + userInfo.last_name,
            payer_email: userInfo.email,
            payment_type: 'one_time',
            payment_method: 'wallet', // Set payment method as 'wallet'
            order_type: 'one_time',
        };

        try {
            const response = await axios.post(API_ENDPOINT + 'success', transactionDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${user}`,
                },
            });

            dispatch(clearCart());
            navigate(`/order-confirmation/${response.data.order_id}`, {
                state: {
                    cartItems,
                    isPromoCodeApplied: promoCodeApplied ? true : false,
                    total: calculateFinalCost(),
                    discountAmount:
                        cartItems.reduce((acc, item) => acc + parseFloat(item.total_price), 0) -
                        calculateFinalCost(),
                    isGiftCard: false,
                },
            });
            setIsProcessing(false);
        } catch (error) {
            console.error('Error creating order on backend:', error);
            setIsProcessing(false);
        }
    };

    return (
        <main>
            <section className="text-white relative z-20 mt-24 mb-36 px-4 sm:px-6 md:px-10 xl:px-0">
                {cartItems.length > 0 ? (
                    <>
                        <picture>
                            <source srcSet={GreenShadowBG} type="image/webp" />
                            <img
                                src={GreenShadowBG}
                                className="absolute -top-3/4 left-0 pointer-events-none w-full max-w-[1000px]"
                                alt="Green Shadow"
                            />
                        </picture>
                        <picture>
                            <source srcSet={PurpleShadowBG} type="image/webp" />
                            <img
                                src={PurpleShadowBG}
                                className="absolute -top-2/3 right-0 pointer-events-none w-full max-w-[1000px]"
                                alt="Purple Shadow"
                            />
                        </picture>
                        <div className="max-w-[1110px] mx-auto relative z-20">
                            <h2 className="font-THICCCBOI-Medium font-medium text-[28px] sm:text-[32px] md:text-[40px] leading-[32px] sm:leading-[38px] md:leading-[50px] mb-8 capitalize text-center md:text-left">
                                Shopping cart <span className="text-[#4CC800]">items</span>
                            </h2>
                        </div>
                        <div className="max-w-[1110px] relative z-20 mx-auto flex flex-col md:flex-row items-stretch justify-center gap-8">
                            <div className="md:w-2/3">
                                <div className="space-y-4">
                                    {cartItems.map((item) => {
                                        let itemDiscount = 0;
                                        let discountedPrice = (item.price * item.qty).toFixed(2);

                                        if (
                                            promoCodeApplied &&
                                            (isGeneralCoupon || matchedProductIds.includes(item.service_id.toString()))
                                        ) {
                                            if (discountType == 'fixed') {
                                                itemDiscount = discount * item.qty;
                                            } else if (discountType == 'percentage') {
                                                itemDiscount = item.price * item.qty * (discount / 100);
                                            }
                                            discountedPrice = (item.price * item.qty - itemDiscount).toFixed(2);
                                        }

                                        return (
                                            <div
                                                key={item.service_id}
                                                className={`flex bg-[#0B1306] p-4 md:p-6 rounded-lg md:rounded-[20px] gap-3 ${matchedProductIds.includes(item.service_id.toString())
                                                    ? 'border border-green-500'
                                                    : ''
                                                    }`}
                                            >
                                                <p className="font-THICCCBOI-SemiBold font-semibold text:sm sm:text-lg md:text-xl w-6/12 sm:w-2/4">
                                                    {item.service_name} <br />
                                                    {matchedProductIds.includes(item.service_id.toString()) && (
                                                        <span className="text-green-500 ml-2">Promo Applied</span>
                                                    )}
                                                </p>

                                                <div className="flex items-center w-3/12 sm:w-1/4">
                                                    <button
                                                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#4CC800] flex items-center justify-center"
                                                        onClick={() => handleDecrement(item)}
                                                        disabled={isProcessing}
                                                    >
                                                        <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                    </button>
                                                    <span className="mx-3">{item.qty}</span>
                                                    <button
                                                        className="w-4 h-4 sm:w-6 sm:h-6  rounded-full bg-[#4CC800] flex items-center justify-center"
                                                        onClick={() => handleIncrement(item)}
                                                        disabled={isProcessing}
                                                    >
                                                        <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between w-3/12 sm:w-1/4 gap-3">
                                                    {promoCodeApplied &&
                                                        (isGeneralCoupon || matchedProductIds.includes(item.service_id.toString())) ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="line-through text-gray-500">
                                                                {item.qty} x ${parseFloat(item.price * item.qty).toFixed(2)}
                                                            </span>
                                                            <span className="font-THICCCBOI-SemiBold text-sm sm:text-lg md:text-xl text-green-500">
                                                                {item.qty} x ${discountedPrice}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="font-THICCCBOI-SemiBold text-sm sm:text-lg md:text-xl">
                                                            ${parseFloat(item.price * item.qty).toFixed(2)}
                                                        </p>
                                                    )}

                                                    <span
                                                        className="cursor-pointer text-red-500"
                                                        onClick={() => handleRemove(item.service_id)}
                                                    >
                                                        <RxCross2 />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="md:w-1/3">
                                <h5 className="font-THICCCBOI-Bold text-lg md:text-xl leading-5 font-bold mb-4 text-center md:text-left">
                                    Summary
                                </h5>
                                <div className="w-full flex flex-col gap-5 px-4 py-5 bg-black rounded-lg md:rounded-[20px]">
                                    <div className="flex justify-between items-center">
                                        <p className="font-THICCCBOI-SemiBold text-lg md:text-xl font-semibold">
                                            Total cost :
                                        </p>
                                        <p className="font-THICCCBOI-Bold text-lg md:text-xl font-bold">
                                            ${calculateTotalCost()}
                                        </p>
                                    </div>
                                    <div className="flex lg:flex-row flex-col gap-5 lg:gap-0 justify-center items-stretch bg-[#171717] p-2 rounded-lg">
                                        <input
                                            type="text"
                                            className="font-Roboto font-normal text-base leading-4 bg-transparent p-2 focus:outline-none"
                                            placeholder="Promo code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            disabled={isProcessing || isLoading}
                                        />
                                        <button
                                            className="primary-gradient font-Montserrat text-base leading-5 font-medium py-3 px-4 rounded-lg w-full transition-all duration-300 ease-in-out active:scale-95"
                                            onClick={handlePromoCodeApply}
                                            disabled={isLoading || isProcessing}
                                        >
                                            {isLoading ? 'Applying...' : 'Apply'}
                                        </button>
                                    </div>
                                    {error && <p className="text-red-500">{error}</p>}
                                    {promoCodeApplied && couponType == 'gift' && (
                                        <div className="flex justify-between items-center">
                                            <p className="font-THICCCBOI-SemiBold text-lg md:text-xl font-semibold">
                                                Gift Card Balance:
                                            </p>
                                            <p className="font-THICCCBOI-Bold text-lg md:text-xl font-bold">
                                                ${discount.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                    {promoCodeApplied && isGeneralCoupon && couponType !== 'gift' && (
                                        <div className="flex justify-between items-center">
                                            <p className="font-THICCCBOI-SemiBold text-lg md:text-xl font-semibold">
                                                Discount:
                                            </p>
                                            <p className="font-THICCCBOI-Bold text-lg md:text-xl font-bold">
                                                {discountType == 'percentage'
                                                    ? `${discount}%`
                                                    : `$${discount.toFixed(2)}`}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <p className="font-THICCCBOI-SemiBold text-lg md:text-xl font-semibold">
                                            Final Total :
                                        </p>
                                        <p className="font-THICCCBOI-Bold text-lg md:text-xl font-bold">
                                            ${calculateFinalCost()}
                                        </p>
                                    </div>
                                </div>
                                <hr className="border-[#4CC800] my-5" />

                                <div className="bg-[#0B1306] p-4 rounded-lg md:rounded-[20px] mt-4">
                                    {isAnyProductUnavailable ? (
                                        <p className="text-red-500 font-THICCCBOI-SemiBold text-lg md:text-xl leading-6 text-center">
                                            No products available
                                        </p>
                                    ) : user ? (
                                        <>
                                            {calculateFinalCost() == '0.00' && couponType == 'gift' ? (
                                                <button
                                                    onClick={handleGiftCardCheckout}
                                                    disabled={isProcessing}
                                                    className="primary-gradient font-Montserrat text-base leading-4 font-medium py-3 px-4 rounded-full w-full transition-all duration-300 ease-in-out active:scale-95"
                                                >
                                                    {isProcessing ? 'Processing...' : 'Checkout'}
                                                </button>
                                            ) : (
                                                <>
                                                    <div className="flex justify-center gap-4 mb-8">
                                                        <button
                                                            onClick={() => handlePaymentMethodChange('paypal')}
                                                            className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'paypal'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-200 text-black'
                                                                }`}
                                                            disabled={isProcessing}
                                                        >
                                                            PayPal
                                                        </button>
                                                        <button
                                                            onClick={() => handlePaymentMethodChange('stripe')}
                                                            className={`w-1/2 py-3 rounded-md ${selectedPaymentMethod == 'stripe'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-200 text-black'
                                                                }`}
                                                            disabled={isProcessing}
                                                        >
                                                            Stripe
                                                        </button>
                                                    </div>

                                                    {selectedPaymentMethod == 'paypal' && (
                                                        <PayPalButtons
                                                            createOrder={createOrder}
                                                            onApprove={onApprove}
                                                            onCancel={handleCancel}
                                                            disabled={isProcessing}
                                                        />
                                                    )}
                                                    {selectedPaymentMethod == 'stripe' && clientSecret && (
                                                        <Elements
                                                            stripe={stripePromise}
                                                            options={{ clientSecret }}
                                                            key={clientSecret}
                                                        >
                                                            <StripePaymentForm
                                                                cartItems={cartItems}
                                                                finalTotal={Number(calculateFinalCost())}
                                                                promoCodeApplied={promoCodeApplied}
                                                                calculateFinalCost={calculateFinalCost}
                                                                isProcessing={isProcessing}
                                                                setIsProcessing={setIsProcessing}
                                                            />
                                                        </Elements>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="primary-gradient font-Montserrat text-base leading-4 font-medium py-3 px-4 rounded-full w-full text-center block transition-all duration-300 ease-in-out active:scale-95"
                                        >
                                            Login to checkout
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <picture>
                            <source srcSet={GreenShadowBG} type="image/webp" />
                            <img
                                src={GreenShadowBG}
                                className="absolute -bottom-2/3 left-0 pointer-events-none w-full max-w-[1000px]"
                                alt="Green Shadow"
                            />
                        </picture>
                        <picture>
                            <source srcSet={PurpleShadowBG} type="image/webp" />
                            <img
                                src={PurpleShadowBG}
                                className="absolute -bottom-full right-0 pointer-events-none w-full max-w-[1000px]"
                                alt="Purple Shadow"
                            />
                        </picture>
                        <div className="max-w-[1110px] mx-auto relative z-20 text-center">
                            <h1 className="text-3xl font-bold mb-4">No items in the cart</h1>
                            <p className="text-xl">Start shopping to add items to your cart.</p>
                            <Link
                                to="/services"
                                className="primary-gradient font-Montserrat text-base leading-4 font-medium py-3 px-4 rounded-full w-fit mx-auto text-center block mt-8 transition-all duration-300 ease-in-out active:scale-95"
                            >
                                Go to Services
                            </Link>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

// Stripe Payment Form Component
const StripePaymentForm = ({
    cartItems,
    finalTotal,
    promoCodeApplied,
    calculateFinalCost,
    isProcessing,
    setIsProcessing,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);

    const handleSuccessPayment = async (transactionId) => {
        const transactionDetails = {
            user_id: userInfo.id.toString(),
            cartItems: cartItems,
            transaction_id: transactionId,
            amount: finalTotal,
            promoCode: promoCodeApplied,
            payer_name: userInfo.first_name + ' ' + userInfo.last_name,
            payer_email: userInfo.email,
            payment_type: 'one_time',
            payment_method: 'Stripe',
            order_type: 'one_time',
        };

        try {
            const successResponse = await axios.post(API_ENDPOINT + 'success', transactionDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${user}`,
                },
            });

            dispatch(clearCart());
            navigate(`/order-confirmation/${successResponse.data.order_id}`, {
                state: {
                    cartItems,
                    isPromoCodeApplied: promoCodeApplied ? true : false,
                    total: finalTotal,
                    discountAmount:
                        cartItems.reduce((acc, item) => acc + parseFloat(item.total_price), 0) -
                        calculateFinalCost(),
                    isGiftCard: false,
                },
            });
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
                <PaymentElement className="bg-white p-3 rounded-md mb-4" disabled={isProcessing} />
                {error && <div className="text-red-500 mb-3">{error}</div>}
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="bg-[#0D6EFD] font-Montserrat text-base leading-6 font-normal py-3 px-4 rounded-md w-full"
                >
                    {isProcessing ? 'Processing...' : `Pay $${finalTotal}`}
                </button>
            </form>
        </>
    );
};

StripePaymentForm.propTypes = {
    cartItems: PropTypes.array.isRequired,
    finalTotal: PropTypes.number.isRequired,
    promoCodeApplied: PropTypes.string,
    calculateFinalCost: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    setIsProcessing: PropTypes.func.isRequired,
};

export default Cart;