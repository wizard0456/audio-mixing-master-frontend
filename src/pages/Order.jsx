import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectUser } from "../reducers/authSlice";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from "axios";
import { API_ENDPOINT } from "../utils/constants";

// Import Images
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import OrderIcon from "../assets/images/order-icon.png";

const Orders = () => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            fetchOrders();
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINT}orders`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setLoading(false);
        }
    };

    return (
        <main>
            <section className="text-white mt-24 relative z-20">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[300%] left-0 pointer-events-none" width={1000} alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[200%] right-0 pointer-events-none" width={1000} alt="Purple Shadow Background" />
                </picture>
                <div className="relative z-20 pt-8 pb-24 bg-[#0B1306] px-5 md:px-10 xl:px-0">
                    <div className="max-w-[1110px] mx-auto">
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-7">
                            Orders
                        </h1>
                        <p className="font-Roboto font-normal text-base leading-6">
                            Services /{" "}
                            <span className="text-[#4CC800] font-semibold">Orders</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="-mt-12 mb-24 relative z-20  px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="bg-white flex flex-col gap-5 p-8 rounded-[20px] items-center">
                                    <Skeleton width={50} height={50} circle={true} />
                                    <Skeleton width={150} height={25} />
                                    <Skeleton width={200} height={20} />
                                </div>
                            ))
                        ) : orders.length == 0 ? (
                            <div className="bg-white flex flex-col gap-5 p-8 rounded-[20px] items-center">
                                <img src={OrderIcon} className="w-16 h-16" alt="No Orders" />
                                <p className="font-THICCCBOI-Regular font-normal text-base leading-4 capitalize text-black">
                                    No Orders
                                </p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white flex flex-col gap-5 p-8 rounded-[20px] items-center">
                                    <img src={OrderIcon} className="w-16 h-16" alt="Order" />
                                    <h4 className="font-THICCCBOI-Bold text-[22px] leading-6">
                                        Order #{order.id}
                                    </h4>
                                    <p className="font-Roboto font-normal text-base leading-5">
                                        {order.items.length} items - ${order.total}
                                    </p>
                                    <Link to={`/order/${order.id}`} className="font-Montserrat font-medium text-base leading-5 primary-gradient transition-all duration-300 ease-in-out active:scale-95 px-5 py-4 rounded-full">
                                        View Order
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Orders;