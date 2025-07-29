import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCartItems, updateItem, removeItem, updateCart, removeFromCart } from '../reducers/cartSlice';
import { selectUser } from '../reducers/authSlice';
import { Link } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

// Import Images
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";


const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(getCartItems);
    const user = useSelector(selectUser);
    const [promoCode, setPromoCode] = useState('');
    const [promoCodeApplied, setPromoCodeApplied] = useState('');

    const [{ options }, paypalDispatch] = usePayPalScriptReducer();

    useEffect(() => {
        paypalDispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: options.currency,
            },
        });
    }, [cartItems, paypalDispatch, options.currency]);

    const handleIncrement = (item) => {
        const newQuantity = +(item.qty) + 1;
        const newTotalPrice = Number((newQuantity * parseFloat(item.price)).toFixed(2));
        if (user) {
            dispatch(updateCart({ ...item, qty: newQuantity, total_price: newTotalPrice }));
        } else {
            dispatch(updateItem({ ...item, qty: newQuantity, total_price: newTotalPrice }));
        }
    };

    const handleDecrement = (item) => {
        if (item.qty > 1) {
            const newQuantity = +(item.qty) - 1;
            const newTotalPrice = Number((newQuantity * parseFloat(item.price)).toFixed(2));
            if (user) {
                dispatch(updateCart({ ...item, qty: newQuantity, total_price: newTotalPrice }));
            } else {
                dispatch(updateItem({ ...item, qty: newQuantity, total_price: newTotalPrice }));
            }
        }
    };

    const handleRemove = (itemId) => {
        if (user) {
            dispatch(removeFromCart(itemId));
        } else {
            dispatch(removeItem(itemId));
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + parseFloat(item.total_price), 0).toFixed(2);
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: calculateTotal(),
                },
            }],
        });
    };

    const onApprove = async (data, actions) => {
        return actions.order.capture().then((details) => {
            alert('Transaction completed by ' + details.payer.name.given_name);

            // Gather necessary transaction details
            const transactionDetails = {
                id: order.id,
                amount: order.amount,
                payer_name: user ? userInfo.first_name + " " + userInfo.last_name : guestInfo.email,
                payer_email: user ? userInfo.email : guestInfo.email,
                payer_phone: user ? (userInfo.phone || '') : guestInfo.phone,
            };

            // Handle transaction details (send to server, update UI, etc.)

            // Clear the cart or redirect the user as needed
            // dispatch(clearCart()); // Example action to clear the cart
            // history.push('/thank-you'); // Example redirect to thank you page
        });
    };

    const handlePromoCodeApply = () => {
        // Apply promo code logic here
        setPromoCodeApplied(promoCode);
        setPromoCode('');
    };

    return (
        <main>
            <section className="text-white relative z-20 mt-24 mb-36 px-5 md:px-10 xl:px-0">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-3/4 left-0 pointer-events-none" width={1000} alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-2/3 right-0 pointer-events-none" width={1000} alt="Purple Shadow Background" />
                </picture>
                <div className="max-w-[1110px] mx-auto relative z-20">
                    <h2 className="font-THICCCBOI-Medium font-medium text-[40px] leading-[50px] mb-14 capitalize">Shopping cart <span className="text-[#4CC800]">items</span></h2>
                </div>
                <div className="max-w-[1110px] relative z-20 mx-auto flex items-stretch justify-center gap-8">
                    <div className='flex-1'>
                        {cartItems.length > 0 ?
                            (
                                <table className='w-full border-0' style={{ borderSpacing: "0" }}>
                                    <thead>
                                        <tr>
                                            <th className='font-THICCCBOI-Bold text-base leading-4 font-bold text-left px-6 pb-5'>Product</th>
                                            <th className='font-THICCCBOI-Bold text-base leading-4 font-bold text-left px-6 pb-5'>Quantity</th>
                                            <th className='font-THICCCBOI-Bold text-base leading-4 font-bold text-left px-6 pb-5'>Price</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item.service_id}>
                                                <td className="font-THICCCBOI-SemiBold font-semibold text-xl leading-6 pb-5">
                                                    <div className='p-6 rounded-tl-[20px] rounded-bl-[20px] bg-[#0B1306]'>
                                                        {item.service_name}
                                                    </div>
                                                </td>
                                                <td className="font-THICCCBOI-SemiBold font-semibold text-xl leading-6 pb-5">
                                                    <div className='flex justify-start items-center gap-2 p-6 bg-[#0B1306] w-full'>
                                                        <button
                                                            className={`w-6 h-6 rounded-full bg-[#4CC800] flex items-center justify-center ${item.service_type == "subscription" ? "opacity-70" : ""}`}
                                                            onClick={() => handleDecrement(item)}
                                                            disabled={item.service_type == "subscription" ? true : false}
                                                        >
                                                            <MinusIcon className="w-4 h-4 text-white" />
                                                        </button>
                                                        <span className='w-6 text-center'>{item.qty}</span>
                                                        <button
                                                            className={`w-6 h-6 rounded-full bg-[#4CC800] flex items-center justify-center ${item.service_type == "subscription" ? "opacity-70" : ""}`}
                                                            onClick={() => handleIncrement(item)}
                                                            disabled={item.service_type == "subscription" ? true : false}
                                                        >
                                                            <PlusIcon className="w-4 h-4 text-white" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="font-THICCCBOI-SemiBold font-semibold text-xl leading-6 pb-5">
                                                    <div className='p-6 bg-[#0B1306]'>
                                                        ${parseFloat(item.price).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="font-THICCCBOI-SemiBold font-semibold text-base leading-6 pb-5">
                                                    <div className='p-6 bg-[#0B1306] rounded-tr-[20px] rounded-br-[20px]'>
                                                        <span className='cursor-pointer' onClick={() => handleRemove(item.service_id)}>x</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                            :
                            (<p className='text-center font-THICCCBOI-SemiBold font-semibold text-xl leading-6 pb-5'>No items in cart</p>)
                        }
                    </div>

                    <div className='flex flex-col gap-5'>
                        <h5 className='font-THICCCBOI-Bold text-base leading-4 font-bold'>Summary</h5>

                        <div className='w-96 flex flex-col gap-7 px-6 py-5 bg-black rounded-[20px]'>
                            <div className='flex justify-between items-center'>
                                <p className='font-THICCCBOI-SemiBold text-xl leading-6 font-semibold'>Total cost :</p>
                                <p className='font-THICCCBOI-Bold text-xl leading-6 font-bold'>${calculateTotal()}</p>
                            </div>
                            <div className="flex justify-center items-stretch bg-[#171717] p-1 rounded-[10px]">
                                <input
                                    type="text"
                                    className='font-Roboto font-normal text-base leading-4 bg-transparent flex-1 p-4 focus:outline-none'
                                    placeholder='Promo code'
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button
                                    className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-Montserrat text-base leading-5 font-medium py-3 px-6 rounded-[10px]'
                                    onClick={handlePromoCodeApply}
                                >
                                    Apply
                                </button>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='font-THICCCBOI-SemiBold text-xl leading-6 font-semibold'>Total cost :</p>
                                <p className='font-THICCCBOI-Bold text-xl leading-6 font-bold'>${calculateTotal()}</p>
                            </div>
                            <hr className='border-[#4CC800] my-5' />

                            {user ?
                                <PayPalButtons
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                />
                                :
                                <Link to="/login" className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-Montserrat text-base leading-4 font-medium py-4 px-6 rounded-full w-fit'>Login to checkout</Link>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Cart;