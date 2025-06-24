import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT, itemsPerPage } from '../utils/constants';
import ReactPaginate from 'react-paginate';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';

const GiftCard = () => {
    const [giftCards, setGiftCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(selectUser);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        const fetchGiftCards = async (page) => {
            setLoading(true); // Start loading
            try {
                const response = await axios(`${API_ENDPOINT}my-gifts?page=${page}&per_page=${itemsPerPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${user}`,
                    },
                });
                setGiftCards(response.data.data);
                setCurrentPage(response.data.current_page);
                setPageCount(response.data.last_page);
                setLoading(false); // Stop loading
            } catch (error) {
                console.error('Failed to fetch gift cards:', error);
                setLoading(false); // Stop loading
            }
        };

        fetchGiftCards(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };

    return (
        <main>
            <section className="text-white mt-24 relative z-20">
                <div className="relative z-20 p-8 bg-[#0B1306] px-5 md:px-10 xl:px-0">
                    <div className="max-w-[1110px] mx-auto">
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-7">
                            Gift Cards
                        </h1>
                        <p className="font-Roboto font-normal text-base leading-6">
                            <Link to="/account">Account</Link> /{" "}
                            <span className="text-[#4CC800] font-semibold">Gift Cards</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="text-white mt-24 mb-36 relative z-20">
                <div className="max-w-[1110px] mx-auto">
                    {loading ? (
                        <Loader />
                    ) : (


                        (giftCards && giftCards.length == 0) ? (
                            <div className="text-center">
                                <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium">
                                    You have no gift cards
                                </h1>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Hidden on mobile, visible on desktop */}
                                    <div className="hidden md:flex items-center gap-5 p-4 bg-black text-white rounded-[20px] shadow-md">
                                        <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Gift ID</h4>
                                        <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Promo Code</h4>
                                        <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Amount Left</h4>
                                        <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Used Amount</h4>
                                        <h4 className="font-THICCCBOI-Bold font-bold text-lg w-1/6 text-center">Purchase At</h4>
                                    </div>

                                    {giftCards.map((giftCard) => (
                                        <div key={giftCard.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 p-5 bg-black text-white rounded-[20px] shadow-md">
                                            {/* Mobile labels */}
                                            <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                                <p className="md:hidden text-base font-semibold">Gift ID</p>
                                                <p className="font-THICCCBOI-Medium font-medium text-lg text-center truncate">{giftCard.id}</p>
                                            </div>
                                            <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                                <p className="md:hidden text-base font-semibold">Promo Code</p>
                                                <p className="font-THICCCBOI-Medium font-medium text-lg text-center truncate">{giftCard.promocode}</p>
                                            </div>
                                            <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                                <p className="md:hidden text-base font-semibold">Amount</p>
                                                <p className="font-THICCCBOI-Medium font-medium text-lg text-center">${giftCard.amount}</p>
                                            </div>
                                            <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                                <p className="md:hidden text-base font-semibold">Used Amount</p>
                                                <p className="font-THICCCBOI-Medium font-medium text-lg text-center">${giftCard.use_amount}</p>
                                            </div>
                                            <div className="w-full md:w-1/6 flex justify-between md:justify-center">
                                                <p className="md:hidden text-base font-semibold">Created At</p>
                                                <p className="font-THICCCBOI-Medium font-medium text-lg text-center truncate">{new Date(giftCard.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
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
                        )
                    )}
                </div>
            </section>
        </main>
    );
};

export default GiftCard;