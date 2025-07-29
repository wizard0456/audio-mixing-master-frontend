import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import { clearCart } from '../reducers/cartSlice';
import { selectUser } from '../reducers/authSlice';
import { CheckIcon } from '@heroicons/react/24/outline';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const cartItems = location.state?.cartItems || []; // Retrieve cart items from location state
    const finalTotal = isNaN(parseFloat(location.state?.total)) ? 0 : parseFloat(location.state?.total); // Ensure finalTotal is a number
    const isPromoCodeApplied = location.state?.isPromoCodeApplied || false; // Check if promo code was applied
    const discountAmount = isNaN(parseFloat(location.state?.discountAmount)) ? 0 : parseFloat(location.state?.discountAmount); // Ensure discountAmount is a number
    const isGiftCard = location.isGiftCard;

    // Check if user is a guest (not logged in)
    const isGuestUser = !user;

    useEffect(() => {
        if (cartItems[0].service_type == "subscription" || !isGiftCard) return;
        dispatch(clearCart()); // Clear the cart items when this component mounts
    }, [dispatch]);

    const handleSignUpRedirect = () => {
        navigate('/signup', { 
            state: { 
                fromOrderConfirmation: true,
                orderId: orderId,
                guestInfo: location.state?.guestInfo || null
            } 
        });
    };

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
                    
                    {/* Show different content based on user type */}
                    {isGuestUser ? (
                        <div className="space-y-4">
                            <div className="bg-[#1a1a1a] rounded-[15px] p-6 border border-[#4CC800]">
                                <h3 className="font-THICCCBOI-SemiBold text-xl mb-3 text-[#4CC800]">
                                    🎯 Track Your Order
                                </h3>
                                <p className="font-Roboto font-normal text-base leading-6 mb-4 text-gray-300">
                                    Create an account to track your order progress, receive updates, and manage your future orders easily.
                                </p>
                                <div className="space-y-3 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#4CC800] rounded-full"></span>
                                        <span>Real-time order status updates</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#4CC800] rounded-full"></span>
                                        <span>Download your completed files</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#4CC800] rounded-full"></span>
                                        <span>Request revisions and communicate</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#4CC800] rounded-full"></span>
                                        <span>Access order history and invoices</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleSignUpRedirect}
                                className="font-Montserrat font-medium text-base leading-5 primary-gradient transition-all duration-300 ease-in-out active:scale-95 px-8 py-4 rounded-full w-full"
                            >
                                Create Account to Track Order
                            </button>
                            <p className="text-gray-400 text-sm">
                                Already have an account? <Link to="/login" className="text-[#4CC800] hover:underline">Sign in here</Link>
                            </p>
                        </div>
                    ) : (
                        <Link to="/account" className="font-Montserrat font-medium text-base leading-5 primary-gradient transition-all duration-300 ease-in-out active:scale-95 mt-3 block w-fit mx-auto px-6 py-4 rounded-full">
                            Go to My Account
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrderConfirmation;
