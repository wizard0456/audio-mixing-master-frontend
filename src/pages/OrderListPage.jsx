import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT, itemsPerPage } from '../utils/constants';
import ReactPaginate from 'react-paginate';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Loader from '../components/Loader'; // Assuming you have a Loader component
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(selectUser);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        const fetchOrders = async (page) => {
            setLoading(true); // Start loading
            try {
                const response = await axios(`${API_ENDPOINT}orders?page=${page}&per_page=${itemsPerPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${user}`,
                    },
                });
                setOrders(response.data.data);
                setCurrentPage(response.data.current_page);
                setPageCount(response.data.last_page);
                setLoading(false); // Stop loading
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setLoading(false); // Stop loading
            }
        };

        fetchOrders(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
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
                <div className="relative z-20 p-8 bg-[#0B1306] px-5 md:px-10 xl:px-0">
                    <div className="max-w-[1110px] mx-auto">
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-7">
                            Order List
                        </h1>
                        <p className="font-Roboto font-normal text-base leading-6">
                            <Link to="/account">Account</Link> /{" "}
                            <span className="text-[#4CC800] font-semibold">Order List</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="text-white mt-24 mb-36 relative z-20">
                <div className="max-w-[1110px] mx-auto">
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Hidden on mobile, visible on desktop */}
                                <div className="hidden md:flex items-center gap-5 p-4 bg-black text-white rounded-[20px] shadow-md">
                                    <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Order ID</h4>
                                    <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Transaction ID</h4>
                                    <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Amount</h4>
                                    <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Order Type</h4>
                                    <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Status</h4>
                                    <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Date</h4>
                                </div>

                                {orders.map((order) => (
                                    <Link to={`/order/${order.id}`} key={order.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 p-5 bg-black text-white rounded-[20px] shadow-md relative">
                                        {/* Mobile labels */}
                                        {Number(order?.notify) == 1 ? <span className="absolute -top-2 -left-3 bg-[#4CC800] text-white font-THICCCBOI-Medium text-sm px-3 py-1 rounded-full">New Update</span> : null}
                                        <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                            <p className="md:hidden text-base font-semibold">Order ID</p>
                                            <p className="font-THICCCBOI-Medium font-medium text-lg text-center truncate">{order.id}</p>
                                        </div>
                                        <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                            <p className="md:hidden text-base font-semibold">Transaction ID</p>
                                            <p className="font-THICCCBOI-Medium font-medium text-lg text-center truncate">{order.transaction_id}</p>
                                        </div>
                                        <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                            <p className="md:hidden text-base font-semibold">Amount</p>
                                            <p className="font-THICCCBOI-Medium font-medium text-lg text-center">{order.amount} {order.currency}</p>
                                        </div>
                                        <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                            <p className="md:hidden text-base font-semibold">Order Type</p>
                                            <p className="font-THICCCBOI-Medium font-medium text-lg text-center">{order.order_type}</p>
                                        </div>
                                        <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                            <p className="md:hidden text-base font-semibold">Status</p>
                                            <p className="font-THICCCBOI-Medium font-medium text-lg text-center truncate">{order.payment_status}</p>
                                        </div>
                                        <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                            <p className="md:hidden text-base font-semibold">Date</p>
                                            <p className="font-THICCCBOI-Medium font-medium text-lg text-center truncate">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {pageCount > 0 && (
                                <div className='flex justify-center mt-24'>
                                    <ReactPaginate
                                        previousLabel={<ArrowLeftIcon className="md:w-6 md:h-6 h-5 w-5" stroke="#fff" />}
                                        nextLabel={<ArrowRightIcon className="md:w-6 md:h-6 h-5 w-5" stroke="#fff" />}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClick}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                        forcePage={currentPage - 1}
                                    />
                                </div>
                            )}
                        </>
                    )}

                </div>
            </section>
        </main >
    );
};

export default OrderListPage;