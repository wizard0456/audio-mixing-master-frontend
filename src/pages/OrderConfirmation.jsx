import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import { clearCart } from '../reducers/cartSlice';
import { CheckIcon } from '@heroicons/react/24/outline';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();

    const cartItems = location.state?.cartItems || []; // Retrieve cart items from location state
    const finalTotal = isNaN(parseFloat(location.state?.total)) ? 0 : parseFloat(location.state?.total); // Ensure finalTotal is a number
    const isPromoCodeApplied = location.state?.isPromoCodeApplied || false; // Check if promo code was applied
    const discountAmount = isNaN(parseFloat(location.state?.discountAmount)) ? 0 : parseFloat(location.state?.discountAmount); // Ensure discountAmount is a number
    const isGiftCard = location.isGiftCard;

    console.log(cartItems)

    useEffect(() => {
        if (cartItems[0].service_type == "subscription" || !isGiftCard) return;
        dispatch(clearCart()); // Clear the cart items when this component mounts
    }, [dispatch]);

    return (
        <section className="text-white relative z-30 mt-24 mb-36 px-5 md:px-10 xl:px-0">
            <picture>
                <source srcSet={GreenShadowBG} type="image/webp" />
                <img src={GreenShadowBG} className="absolute -top-[300%] left-0 pointer-events-none" width={1000} alt="Green Shadow Background" />
            </picture>
            <picture>
                <source srcSet={PurpleShadowBG} type="image/webp" />
                <img src={PurpleShadowBG} className="absolute -top-[200%] right-0 pointer-events-none" width={1000} alt="Purple Shadow Background" />
            </picture>
            <div className="max-w-[1110px] relative z-30 mx-auto flex flex-col items-center justify-center">
                <div className="bg-[#0B1306] p-8 rounded-[20px] w-full max-w-[600px] text-center">
                    <span><CheckIcon className="mx-auto mb-6 w-20 h-20" /></span>
                    <h2 className="font-THICCCBOI-Bold text-[32px] leading-[40px] mb-4">Thank You!</h2>
                    <p className="font-Roboto font-normal text-base leading-6 mb-6">
                        Your order #{orderId} has been placed successfully.
                    </p>
                    <div className="bg-black rounded-[20px] p-6 mb-6">
                        <h4 className="font-THICCCBOI-Bold text-[22px] leading-6 mb-4">Order Summary</h4>
                        {cartItems.length ? (
                            <>
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex justify-between mb-4">
                                        <span className="font-Roboto font-normal text-base text-left leading-5 w-2/3">{item.service_name}</span>
                                        <span className="font-Roboto font-normal text-base leading-5 w-10">x {item.qty}</span>
                                        <span className="font-Roboto font-normal text-base leading-5 flex-1 text-right">${(Number(item.price) * Number(item.qty)).toFixed(2)}</span>
                                    </div>
                                ))}
                                {isPromoCodeApplied && (
                                    <div className="flex justify-between font-THICCCBOI-Bold text-[22px] leading-6 mt-4 pt-4 border-t border-gray-700">
                                        <span>Discount Applied</span>
                                        <span>- ${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-THICCCBOI-Bold text-[22px] leading-6 mt-4 pt-4 border-t border-gray-700">
                                    <span>Total</span>
                                    <span>${finalTotal.toFixed(2)}</span>
                                </div>
                            </>
                        ) : (
                            <p>Loading order details...</p>
                        )}
                    </div>
                    <Link to="/account" className="font-Montserrat font-medium text-base leading-5 primary-gradient transition-all duration-300 ease-in-out active:scale-95 mt-3 block w-fit mx-auto px-6 py-4 rounded-full">
                        Go to My Account
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OrderConfirmation;
