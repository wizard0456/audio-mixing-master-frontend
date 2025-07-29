import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { deleteFavorite, fetchFavorites, getFavorites, getFavoritesStatus, getFavoritesError } from "../reducers/userFavirotesSlice";
import { DOMAIN } from "../utils/constants";
import Loader from '../components/Loader';
import { addItem, addToCart, getCartItems } from "../reducers/cartSlice";
import { Slide, toast } from "react-toastify";
import { selectUser } from "../reducers/authSlice";
import { Link } from "react-router-dom";
import CustomModal from '../components/CustomModal';
import SubscriptionModalContent from '../components/SubscriptionModalContent';

// Import Images
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

const Favorites = () => {
    const dispatch = useDispatch();
    const favorites = useSelector(getFavorites);
    const status = useSelector(getFavoritesStatus);
    const error = useSelector(getFavoritesError);
    const user = useSelector(selectUser);
    const cartItems = useSelector(getCartItems);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        // Always fetch favorites when component mounts
        dispatch(fetchFavorites());
    }, [dispatch]);

    function handleRemoveFromFavorites(id) {
        dispatch(deleteFavorite(id));
    }

    const addToCartHandler = (pkg) => {
        const item = cartItems.filter(item => (item.service_id == pkg.service_id && item.service_type == "subscription"));

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
            service_id: pkg.service_id,
            service_name: pkg.name,
            price: Number(pkg.discounted_price) || Number(pkg.price),
            qty: 1,
            total_price: Number(pkg.discounted_price) || Number(pkg.price),
            service_type: pkg.service_type,
            paypal_plan_id: pkg.paypal_plan_id,
            stripe_plan_id: pkg.stripe_plan_id
        };

        if (user) {
            let productAvailable = cartItems.filter(item => (item.service_id == product.service_id));

            if (productAvailable && productAvailable.length > 0) {
                // Send only the new quantity to add, not the total
                dispatch(addToCart({
                    services: [{ 
                        ...product, 
                        qty: 1, 
                        total_price: Number(product.price) 
                    }],
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
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-7">My Favorites</h1>
                        <p className='font-Roboto font-normal text-base leading-6'><Link to={'/account'}>Account</Link> / <span className='text-[#4CC800] font-semibold'>Favorites</span></p>
                    </div>
                </div>
            </section>

            <section className='relative z-20 text-white mb-36 px-5 md:px-10 xl:px-0'>
                <div className='max-w-[1110px] mx-auto'>
                    {status == 'loading' ? (
                        <Loader />
                    ) : status == 'failed' ? (
                        <p className='text-red-500'>Error: {error}</p>
                    ) : !Array.isArray(favorites) ? (
                        <p className='text-center text-red-500'>Error: Invalid favorites data format</p>
                    ) : favorites.length == 0 ? (
                        <p className='text-center'>No favorite items found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {favorites.map((favorite) => {
                                // Ensure we have the required data
                                if (!favorite || !favorite.service_id) {
                                    return null;
                                }

                                const favoriteName = favorite.name || 'Unknown Service';
                                const favoriteImage = favorite.image || '';
                                const favoritePrice = favorite.price || 0;
                                const favoriteDiscountedPrice = favorite.discounted_price || 0;
                                const favoriteServiceType = favorite.service_type || 'one_time';
                                const favoriteLabelName = favorite.label_name || '';

                                return (
                                    <div key={favorite.id || favorite.service_id} className='flex flex-col items-center justify-center gap-5'>
                                        <div className='relative top-0 w-full group bg-black rounded-[20px]'>
                                            {favoriteLabelName && (
                                                <span className='bg-[#0B1306] text-[#4CC800] py-2 px-5 shadow-[0px 4px 24px 0px #4CC80033] rounded-full font-THICCCBOI-Medium font-medium text-[12px] leading-4 absolute -top-4 z-20 left-[10%]'>
                                                    {favoriteLabelName}
                                                </span>
                                            )}
                                            <Link to={`/service-details/${favorite.service_id}`} state={{ service_id: favorite.service_id }} className='block w-full overflow-hidden rounded-[20px]'>
                                                <img src={`${Number(favorite.is_url) ? favoriteImage : DOMAIN + favoriteImage}`} className='w-full relative top-0 z-10 transition-transform transform group-hover:scale-125 h-72 object-cover object-center' alt={favoriteName} />
                                            </Link>
                                            {user && (
                                                <button className='absolute -bottom-4 right-[10%] z-20 p-2 bg-white rounded-full' onClick={() => handleRemoveFromFavorites(favorite.service_id)}>
                                                    <HeartIcon className="w-4 h-4" fill={"#4CC800"} stroke='#4CC800' />
                                                </button>
                                            )}
                                        </div>

                                        <Link to={`/select-services/${favoriteName.toLowerCase().replace(/ /g, "-")}-p${favorite.service_id}`} state={{ service_id: favorite.service_id }} className='block w-full'>
                                            <div className='w-full'>
                                                <h4 className='font-THICCCBOI-Bold font-bold text-lg leading-9 line-clamp-1'>{favoriteName}</h4>
                                                <div className='flex justify-between items-center'>
                                                    <p className='text-base font-normal font-THICCCBOI flex gap-1 items-end'>
                                                        {(Number(favoriteDiscountedPrice) > 0) && (
                                                            <span className='text-[#8D8D8D] line-through'>${favoritePrice}</span>
                                                        )}
                                                        <span className='text-base text-white font-semibold'>${(Number(favoriteDiscountedPrice) > 0) ? Number(favoriteDiscountedPrice) : Number(favoritePrice)}</span>
                                                    </p>
                                                    {Number(favoriteDiscountedPrice) > 0 && (
                                                        <p className='font-THICCCBOI py-1 px-2 text-base font-semibold text-[#4CC800] bg-[#0B1306] rounded-md'>
                                                            Save <span>{Math.round(((Number(favoritePrice) - Number(favoriteDiscountedPrice)) / Number(favoritePrice)) * 100)}%</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>

                                        {favoriteServiceType == "subscription" ? (
                                            <button
                                                className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit mt-2'
                                                onClick={() => openSubscriptionModal(favorite)}
                                            >
                                                Subscribe Now <ShoppingCartIcon className="h-5 w-5" stroke='#fff' />
                                            </button>
                                        ) : (
                                            <button className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit mt-2' onClick={() => addToCartHandler(favorite)}>
                                                Add to cart <ShoppingCartIcon className="h-5 w-5" stroke='#fff' />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

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
        </main>
    );
};

export default Favorites;