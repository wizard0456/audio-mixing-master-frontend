import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, selectUser, getUserToken } from "../reducers/authSlice";
import { clearUser, selectUserInfo } from "../reducers/userSlice";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Import Images
import UserIcon from "../assets/images/user.png";
import TruckIcon from "../assets/images/truck.png";
import ChatIcon from "../assets/images/chat.png";
import BagIcon from "../assets/images/bag.png";
import GiftCardIcon from "../assets/images/gift-card.png";
import UserProfileIcon from "../assets/images/user-profile-icon.png";
import { getCartItems, saveCartItemsToLocalStorage } from "../reducers/cartSlice";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import { getFavorites } from "../reducers/userFavirotesSlice";
import axios from "axios";
import { API_ENDPOINT } from "../utils/constants";
import Loader from "../components/Loader";

const Account = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
    const cartItems = useSelector(getCartItems);
    const favorites = useSelector(getFavorites);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const handleSignOut = () => {
        dispatch(logout());
        dispatch(clearUser());
        dispatch(saveCartItemsToLocalStorage());
        navigate("/");
    };

    useLayoutEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (userInfo) {
            setLoading(false);
        }
    }, [userInfo]);

    useEffect(() => {
        // Fetch orders from the API
        const fetchOrders = async () => {
            try {
                const token = getUserToken(user);
                
                const response = await axios(API_ENDPOINT + "orders?page=1&per_page=1",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                // Ensure orders is always an array
                const ordersData = response.data?.data.orders || [];
                setOrders(Array.isArray(ordersData) ? ordersData : []);
            } catch (error) {
                // Handle error silently
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [user]);

    return (
        <main>
            <section className="text-white mt-24 relative z-20">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[300%] left-0 pointer-events-none" width={1000} alt="Green Shadow" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[200%] right-0 pointer-events-none" width={1000} alt="Purple Shadow" />
                </picture>
                <div className="relative z-20 pt-8 pb-24 bg-[#0B1306] px-5 md:px-10 xl:px-0">
                    <div className="max-w-[1110px] mx-auto">
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-7">
                            Account
                        </h1>
                        <p className="font-Roboto font-normal text-base leading-6">
                            <Link to="/select-services">Services</Link> /{" "}
                            <span className="text-[#4CC800] font-semibold">Account</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="-mt-12 mb-24 relative z-20  px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    <div className="grid grid-cols-1  sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
                        <Link to="/account" className="bg-white flex flex-col gap-2 py-8 px-10 rounded-[20px] items-center justify-center">
                            <div>
                                <img src={UserIcon} className="w-9 h-9" alt="User Icon" />
                            </div>
                            <p className="font-THICCCBOI-Regular font-normal text-base leading-4 capitalize text-black">
                                Account
                            </p>
                        </Link>
                        <div className="bg-white flex flex-col gap-5 p-8 rounded-[20px] items-center">
                            <div>
                                <img src={TruckIcon} className="w-9 h-9" alt="Truck Icon" />
                            </div>
                            <p className="font-THICCCBOI-Regular font-normal text-base leading-4 capitalize text-black">
                                Track Orders
                            </p>
                        </div>
                        <div className="bg-white flex flex-col gap-5 p-8 rounded-[20px] items-center">
                            <div>
                                <img src={ChatIcon} className="w-9 h-9" alt="Chat Icon" />
                            </div>
                            <p className="font-THICCCBOI-Regular font-normal text-base leading-4 capitalize text-black">
                                Chat
                            </p>
                        </div>
                        <Link to="/cart" className="bg-white flex flex-col gap-5 p-8 rounded-[20px] items-center">
                            <div>
                                <img src={BagIcon} className="w-9 h-9" alt="Cart Icon" />
                            </div>
                            <p className="font-THICCCBOI-Regular font-normal text-base leading-4 capitalize text-black">
                                Cart
                            </p>
                        </Link>
                        <Link to={"/user-gift-coupon"} className="bg-white flex flex-col gap-5 p-8 rounded-[20px] items-center">
                            <div>
                                <img src={GiftCardIcon} className="w-9 h-9" alt="Gift Card" />
                            </div>
                            <p className="font-THICCCBOI-Regular font-normal text-base leading-4 capitalize text-black">
                                Gift Cards
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="text-white relative z-30 mb-36 px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto flex flex-col md:flex-row items-stretch gap-10 md:gap-0">
                    <div className="md:w-1/2 flex flex-col items-stretch gap-8 bg-[#0B1306] p-4 md:p-6 rounded-[20px]">
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-stretch justify-between w-full">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={UserProfileIcon}
                                        className="w-10 h-10 rounded-full"
                                        alt="User Profile Icon"
                                    />
                                    <div className="flex flex-col gap-1">
                                        {loading ? (
                                            <>
                                                <Skeleton width={150} height={25} />
                                                <Skeleton width={200} height={20} />
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="font-THICCCBOI-Bold text-[22px] leading-6">
                                                    {userInfo.first_name + " " + userInfo?.last_name}
                                                </h4>
                                                <p className="font-Roboto font-normal text-base leading-5">
                                                    {userInfo?.email}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="font-Montserrat font-medium text-base leading-5 primary-gradient px-5 py-4 rounded-full transition-all duration-300 ease-in-out active:scale-95"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-stretch gap-6">
                            <Link to={"/cart"} className="flex flex-col items-start justify-center gap-4 p-6 bg-black rounded-[20px]">
                                <h4 className="font-THICCCBOI-Bold text-[22px] leading-6">
                                    Cart
                                </h4>
                                <p className="font-Roboto font-normal text-base leading-5">
                                    {cartItems.length == 0 ? "Your shopping cart is empty" : `You have ${cartItems.length} items in your cart`}
                                </p>
                            </Link>
                            <Link to="/favorites" className="flex flex-col items-start justify-center gap-4 p-6 bg-black rounded-[20px]">
                                <h4 className="font-THICCCBOI-Bold text-[22px] leading-6">
                                    Favorites
                                </h4>
                                <p className="font-Roboto font-normal text-base leading-5"
                                    dangerouslySetInnerHTML={{
                                        __html: favorites.length == 0
                                            ? "You haven&rsquo;t favorited anything yet"
                                            : `You have ${favorites.length} items in your favorites`
                                    }}>
                                </p>
                            </Link>
                            <Link to={"/terms-and-conditions"} className="flex flex-col items-start justify-center gap-4 p-6 bg-black rounded-[20px]">
                                <h4 className="font-THICCCBOI-Bold text-[22px] leading-6">
                                    Legal
                                </h4>
                                <p className="text-[#4CC800] font-Roboto font-normal text-base leading-5">
                                    Terms & Conditions
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex flex-col items-stretch justify-between gap-8 md:px-6 py-2 ">
                        <div className="flex flex-col items-stretch justify-center gap-7 flex-grow">
                            {loadingOrders ? (
                                <Loader />
                            ) : !Array.isArray(orders) || orders.length == 0 ? (
                                <h2 className="font-THICCCBOI-Bold text-[20px] py-4 leading-[50px] text-center flex items-center justify-center bg-black rounded-[20px] h-full">No Orders</h2>
                            ) : (
                                orders.map((order) => (
                                    <Link to={`/order/${order.id}`} key={order.id} className="flex flex-col items-start justify-between gap-4 p-6 bg-black rounded-[20px] flex-grow relative">
                                        {Number(order?.notify) == 1 ? <span className="absolute -top-2 -left-3 bg-[#4CC800] text-white font-THICCCBOI-Medium text-sm px-3 py-1 rounded-full">New Update</span> : null}
                                        <h2 className="font-THICCCBOI-Bold text-[30px] leading-[50px] text-center w-full">
                                            Most Recent Order
                                        </h2>
                                        <div className="flex flex-col items-start justify-evenly gap-5 flex-grow">
                                            <h4 className="font-THICCCBOI-Bold text-[22px] leading-6">
                                                Order ID: {order.id}
                                            </h4>
                                            <p className="font-Roboto font-normal text-base leading-5">
                                                Payer Name: {order.payer_name}
                                            </p>
                                            <p className="font-Roboto font-normal text-base leading-5">
                                                Payer Email: {order.payer_email}
                                            </p>
                                            <p className="font-Roboto font-normal text-base leading-5">
                                                Transaction ID: {order.transaction_id}
                                            </p>
                                            <p className="font-Roboto font-normal text-base leading-5">
                                                Amount: {order.amount} {order.currency}
                                            </p>
                                            <p className="font-Roboto font-normal text-base leading-5">
                                                Status: {order.payment_status}
                                            </p>
                                            <p className="font-Roboto font-normal text-base leading-5">
                                                Date: {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                        {Array.isArray(orders) && orders.length > 0 && (
                            <Link to="/orders" className="w-full font-Montserrat font-medium text-base leading-5 primary-gradient px-6 py-4 text-center rounded-[20px] transition-all duration-300 ease-in-out active:scale-95">
                                Clik Here To See All Orders
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Account;