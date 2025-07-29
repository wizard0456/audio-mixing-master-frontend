import { useEffect, useState } from "react";
import { HeartIcon, ShoppingCartIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import ReactPaginate from "react-paginate";
import { API_ENDPOINT, DOMAIN, itemsPerPage } from "../utils/constants";
import Loader from '../components/Loader';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItem, addToCart, getCartItems } from "../reducers/cartSlice";
import { selectUser } from "../reducers/authSlice";
import { Slide, toast } from "react-toastify";
import { addFavorite, deleteFavorite, getFavorites, fetchFavorites } from "../reducers/userFavirotesSlice";
import CustomModal from '../components/CustomModal';
import SubscriptionModalContent from '../components/SubscriptionModalContent';

// Import Images
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

const Products = () => {
    const cartItems = useSelector(getCartItems);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [tags, setTags] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTag, setActiveTag] = useState('all');
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false); // Loading state
    const favorites = useSelector(getFavorites);
    
    // Initialize favorites when user is logged in
    useEffect(() => {
        if (user && (!favorites || !Array.isArray(favorites))) {
            // The favorites will be loaded by the Redux slice when needed
        }
    }, [user, favorites]);

    // Fetch favorites when component mounts and user is logged in
    useEffect(() => {
        if (user) {
            dispatch(fetchFavorites());
        }
    }, [user, dispatch]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const getTags = async () => {
            try {
                const tagsData = await axios.get(`${API_ENDPOINT}tags`);
                setTags(tagsData.data);
            } catch (error) {
                // Handle error silently
            }
        };

        getTags();
    }, []);

    useEffect(() => {
        getProducts(currentPage);
    }, [activeTag, currentPage]);

    const getProducts = async (page = 1) => {
        setLoading(true); // Start loading
        try {
            const url = activeTag == 'all' ?
                `${API_ENDPOINT}services?per_page=${itemsPerPage}&page=${page}` :
                `${API_ENDPOINT}services/${activeTag}?per_page=${itemsPerPage}&page=${page}`;
            const productsData = await axios.get(url);
            setProducts(productsData.data.data);
            setPageCount(productsData.data.last_page);
            setCurrentPage(productsData.data.current_page);
        } catch (error) {
            // Handle error silently
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);

        // Scroll to the top of the page when the page changes
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // This gives a smooth scrolling effect
        });
    };

    const addToCartHandler = (pkg) => {
        const item = cartItems.filter(item => (item.service_id == pkg.id && item.service_type == "subscription"));

        if (item.length > 0) {
            toast.error('One Subscription is already added', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide
            });
            return;
        }

        const product = {
            service_id: pkg.id,
            service_name: pkg.name,
            price: Number(pkg.discounted_price) || Number(pkg.price),
            qty: 1,
            total_price: Number(pkg.discounted_price) || Number(pkg.price),
            service_type: pkg.service_type,
            paypal_plan_id: pkg?.paypal_plan_id,
            stripe_plan_id: pkg?.stripe_plan_id
        };

        if (user) {
            let productAvailable = cartItems.filter(item => (item.service_id == product.service_id));

            if (productAvailable && productAvailable.length > 0) {
                dispatch(addToCart({
                    services: [{ ...productAvailable[0], qty: productAvailable[0]?.qty + 1, total_price: productAvailable[0]?.total_price + Number(product.price) }],
                    isIntialPageLoad: false,
                }));
            } else {
                dispatch(addToCart({
                    services: [product],
                    isIntialPageLoad: false,
                }));
            }
        } else {
            dispatch(addItem(product));
        }
    };

    const openSubscriptionModal = (product) => {
        setSelectedProduct(product);
        setModalIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeSubscriptionModal = () => {
        setSelectedProduct(null);
        setModalIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    function handleRemoveFromFavorites(id) {
        dispatch(deleteFavorite(id));
    }

    function handleAddToFavorites(id) {
        dispatch(addFavorite(id));
    }

    // Helper function to check if a product is in favorites
    const isProductInFavorites = (productId) => {
        if (!Array.isArray(favorites)) {
            return false;
        }
        // Check if the product is in favorites by comparing service_id
        // Convert both to strings for comparison to handle different data types
        return favorites.some(fav => String(fav.service_id) === String(productId));
    };

    return (
        <main>
            <section className="text-white mt-24 mb-24 relative z-20">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[350%] left-0 pointer-events-none" width={1000} alt="Green Shadow" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[150%] right-0 pointer-events-none" width={1000} alt="Purple Shadow" />
                </picture>
                <div className='relative z-20 p-8 bg-[#0B1306] px-5 md:px-10 xl:px-0'>
                    <div className='max-w-[1110px] mx-auto'>
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-7">All Services</h1>
                        <p className='font-Roboto font-normal text-base leading-6'><Link to={'/services'}>Services</Link> / <span className='text-[#4CC800] font-semibold'>All Services</span></p>
                    </div>
                </div>
            </section>

            <section className="relative z-20 mb-24 px-5 md:px-10 xl:px-0">
                <div className='max-w-[1110px] mx-auto'>
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {tags.map(tag => (
                            <button
                                key={tag.slug}
                                className={`font-Roboto text-base md:text-base leading-6 text-center px-4 md:px-8 py-2 md:py-[14px] rounded-full text-white ${activeTag == tag.slug ? 'primary-gradient' : 'bg-black'}`}
                                onClick={() => {
                                    setActiveTag(tag.slug);
                                    setCurrentPage(1); // Reset to first page when tag changes
                                }}
                            >
                                {tag.tag} ({tag.count})
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className='relative z-20 text-white mb-36 px-5 md:px-10 xl:px-0'>
                <div className='max-w-[1110px] mx-auto'>
                    {loading ? (
                        <Loader /> // Show loader while loading
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                                {products.map(product => (
                                    <div key={product.id} className='flex flex-col items-center justify-center gap-5'>
                                        <div className='relative top-0 w-full group bg-black rounded-[20px]'>
                                            {
                                                <span className='bg-[#0B1306] text-[#4CC800] py-2 px-5 shadow-[0px 4px 24px 0px #4CC80033] rounded-full font-THICCCBOI-Medium font-medium text-[12px] leading-4 absolute -top-4 z-20 left-[10%]'>{product.label_name}</span>
                                            }
                                            <Link to={"/service-details/" + `${product.id}`} state={{ service_id: product.id }} prefetch={"intent"} className='block w-full overflow-hidden rounded-[20px]'>
                                                <img
                                                    src={`${Number(product.is_url) ? product.image : DOMAIN + product.image}`}
                                                    className='w-full relative top-0 z-10 transition-transform transform group-hover:scale-125 h-72 object-cover object-center'
                                                    alt={product.name}
                                                />
                                            </Link>
                                            {
                                                user &&
                                                (
                                                    <button
                                                        className='absolute -bottom-4 right-[10%] z-20 p-2 bg-white rounded-full'
                                                        onClick={() => {
                                                            if (isProductInFavorites(product.id)) {
                                                                handleRemoveFromFavorites(product.id);
                                                            } else {
                                                                handleAddToFavorites(product.id);
                                                            }
                                                        }}
                                                    >
                                                        <HeartIcon
                                                            className="w-4 h-4"
                                                            fill={isProductInFavorites(product.id) ? "#4CC800" : ""}
                                                            stroke='#4CC800' />
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <Link to={"/services/" + product.name.toLowerCase().replace(/ /g, "-") + `-p${product.id}`} state={{ service_id: product.id }} prefetch={"intent"} className='block w-full'>
                                            <div className='w-full'>
                                                <h4 className='font-THICCCBOI-Bold font-bold text-lg leading-9 line-clamp-1'>{product.name}</h4>
                                                <div className='flex justify-between items-center'>
                                                    <p className='text-base font-normal font-THICCCBOI flex gap-1 items-end'>
                                                        {(Number(product.discounted_price) > 0) && <span className='text-[#8D8D8D] line-through'>${Number(product.price)}</span>}
                                                        <span className='text-base text-white font-semibold'>${(Number(product.discounted_price) > 0) ? Number(product.discounted_price) : Number(product.price)}</span>
                                                    </p>
                                                    {Number(product.discounted_price) > 0 && <p className='font-THICCCBOI py-1 px-2 text-base font-semibold text-[#4CC800] bg-[#0B1306] rounded-md'>Save <span>{((1 - Number(product.discounted_price) / Number(product.price)) * 100).toFixed(0)}%</span></p>}
                                                </div>
                                            </div>
                                        </Link>
                                        {
                                            product.service_type == "subscription" ? (
                                                <button
                                                    className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit mt-2'
                                                    onClick={() => openSubscriptionModal(product)}
                                                >
                                                    Subscribe Now <ShoppingCartIcon className="h-5 w-5" stroke='#fff' />
                                                </button>
                                            ) : (
                                                <button
                                                    className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit mt-2'
                                                    onClick={() => addToCartHandler(product)}
                                                >
                                                    Add to cart <ShoppingCartIcon className="h-5 w-5" stroke='#fff' />
                                                </button>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

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
                </div>
            </section >

            <CustomModal
                isOpen={modalIsOpen}
                onClose={closeSubscriptionModal}
                isSubscription={true}
            >
                <SubscriptionModalContent
                    product={selectedProduct}
                    onClose={closeSubscriptionModal}
                />
            </CustomModal>
        </main >
    );
};

export default Products;