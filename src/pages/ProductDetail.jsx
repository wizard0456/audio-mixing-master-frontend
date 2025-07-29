import { useEffect, useState } from 'react';
import axios from 'axios';
import { HeartIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import { API_ENDPOINT, DOMAIN } from '../utils/constants';
import { Link, useParams } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, addToCart, getCartItems } from '../reducers/cartSlice';
import { selectUser } from '../reducers/authSlice';
import { addFavorite, deleteFavorite, getFavorites, fetchFavorites } from '../reducers/userFavirotesSlice';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import CustomModal from '../components/CustomModal';
import SubscriptionModalContent from '../components/SubscriptionModalContent';
import OneTimePurchaseModal from '../components/OneTimePurchaseModal'; // Import the OneTimePurchaseModal component

// Import Images
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

const TABS = ['Details', 'Includes', 'Description', 'Requirements', 'Notes'];

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedTab, setSelectedTab] = useState(TABS[0]);
    const [quantity, setQuantity] = useState(1);
    const service_id = useParams()['productName'];

    const cartItems = useSelector(getCartItems);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const favorites = useSelector(getFavorites);

    // State to manage modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'subscription' or 'one_time'

    const [selectedVariationId, setSelectedVariationId] = useState(null);
    const [variations, setVariations] = useState([]);

    useEffect(() => {
        if (service_id) {
            axios({
                method: 'get',
                url: `${API_ENDPOINT}service-details/${service_id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => {
                    let data;
                    if (response.data && response.data.success && response.data.data) {
                        // New API structure with success wrapper
                        data = response.data.data;
                    } else if (response.data) {
                        // Fallback for old API structure
                        data = response.data;
                    } else {
                        return;
                    }
                    
                    setProduct(data);
                    setSelectedProduct(data); // Set parent product as default

                    if (data.variation && data.variation.length > 0) {
                        setVariations(data.variation);
                    }
                })
                .catch(error => {
                    // Handle error silently
                });
        }
    }, [service_id]);

    // Reset quantity when selectedProduct changes
    useEffect(() => {
        if (selectedProduct) {
            if (
                selectedProduct.service_type == "subscription" ||
                (selectedProduct.category && selectedProduct.category.name.toLowerCase() == "gift card")
            ) {
                setQuantity(1);
            }
        }
    }, [selectedProduct]);

    const handleIncrement = () => {
        if (isQuantityAdjustable()) {
            setQuantity(prevQuantity => prevQuantity + 1);
        }
    };

    const handleDecrement = () => {
        if (isQuantityAdjustable()) {
            setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
        }
    };

    // Helper function to determine if quantity can be adjusted
    const isQuantityAdjustable = () => {
        return (
            selectedProduct &&
            selectedProduct.service_type !== "subscription" &&
            (!selectedProduct.category || selectedProduct.category.name.toLowerCase() !== "gift card")
        );
    };

    function handleRemoveFromFavorites(id) {
        dispatch(deleteFavorite(id));
    }

    function handleAddToFavorites(id) {
        dispatch(addFavorite(id));
    }

    // Helper function to check if a product is in favorites
    const isProductInFavorites = (productId) => {
        return favorites.some(fav => String(fav.service_id) === String(productId));
    };

    // Fetch favorites if user is authenticated but favorites haven't been loaded
    useEffect(() => {
        if (user && favorites.length === 0) {
            dispatch(fetchFavorites());
        }
    }, [user, favorites.length, dispatch]);

    const addToCartHandler = () => {
        const pkg = selectedProduct;

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

        const productToAdd = {
            service_id: pkg.id,
            service_name: pkg.name,
            price: Number(pkg.discounted_price) || Number(pkg.price),
            qty: quantity,
            total_price: (Number(pkg.discounted_price) || Number(pkg.price)) * quantity,
            service_type: pkg.service_type,
            paypal_plan_id: pkg.paypal_plan_id,
            stripe_plan_id: pkg.stripe_plan_id
        };

        if (user) {
            let productAvailable = cartItems.filter(item => (item.service_id == productToAdd.service_id));

            if (productAvailable && productAvailable.length > 0) {
                dispatch(addToCart({
                    services: [{ ...productAvailable[0], qty: Number(productAvailable[0]?.qty) + Number(quantity), total_price: (Number(productAvailable[0]?.qty) + Number(quantity)) * Number(productToAdd.price) }],
                    isIntialPageLoad: false,
                }));
            } else {
                dispatch(addToCart({
                    services: [productToAdd],
                    isIntialPageLoad: false,
                }));
            }
        } else {
            dispatch(addItem(productToAdd));
        }
    };

    const openSubscriptionModal = () => {
        setModalType('subscription');
        setModalIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const openGiftCardModal = () => {
        setModalType('one_time');
        setModalIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closePurchaseModal = () => {
        setModalIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleVariationChange = (e) => {
        const variationId = e.target.value;
        setSelectedVariationId(variationId);


        if (variationId) {
            const selectedVar = variations.find(variation => variation.id == parseInt(variationId));
            if (selectedVar) {
                // Merge parent properties into the selected variant
                const mergedProduct = { ...product, ...selectedVar };
                setSelectedProduct(mergedProduct);
            }
        } else {
            // Revert to parent product if no variation is selected
            setSelectedProduct(product);
        }
    };

    return (
        <main>
            <section className='relative z-20 text-white mb-24 mt-24'>
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[450%] left-0 pointer-events-none" width={1000} alt="Green Shadow" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[400%] right-0 pointer-events-none" width={1000} alt="Purple Shadow" />
                </picture>
                <div className='relative z-20 bg-[#0B1306] p-8 px-5 md:px-10 xl:px-0'>
                    <div className='max-w-[1110px] mx-auto'>
                        <p className='font-Roboto font-normal text-base leading-6'><Link to={'/services'}>Services</Link> / <span className='text-[#4CC800] font-semibold'>Services Details</span></p>
                    </div>
                </div>
            </section>

            {!product ? (
                <section className='relative z-20 text-white mb-36 px-5 md:px-10 xl:px-0'>
                    {/* Skeleton loading components */}
                    <Skeleton height={400} baseColor="#171717" highlightColor="#2C2C2C" />
                </section>
            ) : (
                <section className='relative z-20 text-white mb-36 px-5 md:px-10 xl:px-0'>
                    <div className='max-w-[1110px] mx-auto'>
                        <div className='grid grid-cols-1 md:grid-cols-2 items-stretch gap-8 mb-10'>
                            <div>
                                <Zoom
                                    zoomImage={{
                                        src: Number(selectedProduct.is_url) == 1 ? selectedProduct.image : DOMAIN + selectedProduct.image,
                                        alt: 'Product Detail Image',
                                        style: { width: '500%', height: '200%' }
                                    }}
                                >
                                    <img src={`${Number(selectedProduct.is_url) == 1 ? selectedProduct.image : DOMAIN + selectedProduct.image}`} className='w-full max-h-[600px] rounded-[20px]' alt={selectedProduct.name} />
                                </Zoom>
                            </div>

                            <div className='flex flex-col items-stretch justify-between'>
                                <div>
                                    <div className='flex flex-col items-stretch gap-4 mb-8'>
                                        <h2 className='font-THICCCBOI-Bold text-[40px] leading-[46px] font-bold'>{selectedProduct.name}</h2>

                                        {/* Variation Select List */}
                                        {variations.length > 0 && (
                                            <>
                                                <span className='text-lg font-THICCCBOI-Bold font-normal leading-7'>Select Variant:</span>
                                                <select
                                                    className='w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500'
                                                    value={selectedVariationId || ''}
                                                    onChange={handleVariationChange}
                                                >
                                                    <option value=''>Select an option</option>
                                                    {variations.map(variation => (
                                                        <option key={variation.id} value={variation.id}>
                                                            {variation.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        )}
                                        {
                                            (Number(selectedProduct.discounted_price) > Number(selectedProduct.price)) ? (
                                                <h2 className='font-THICCCBOI-ExtraBold text-[40px] leading-[46px] font-extrabold'>
                                                    ${Number(selectedProduct.discounted_price)}
                                                </h2>
                                            ) :
                                                (
                                                    <>
                                                        {(Number(selectedProduct.discounted_price) && Number(selectedProduct.discounted_price) > 0) ? (
                                                            <h2 className='font-THICCCBOI-ExtraBold text-[40px] leading-[46px] font-extrabold'>
                                                                <span className='text-[#8D8D8D] line-through text-2xl font-THICCCBOI-Regular font-normal leading-7'>${Number(selectedProduct.price)}</span> ${Number(selectedProduct.discounted_price)}
                                                            </h2>
                                                        ) : (
                                                            <h2 className='font-THICCCBOI-ExtraBold text-[40px] leading-[46px] font-extrabold'>${Number(selectedProduct.price)}</h2>
                                                        )}
                                                        {Number(selectedProduct.discounted_price) > 0 && (
                                                            <div className='text-[#4CC800] font-THICCCBOI-SemiBold font-semibold text-xl leading-6 bg-[#0B1306] py-2 px-3 rounded-[10px] w-fit'>
                                                                Save {Math.round((1 - Number(selectedProduct.discounted_price) / Number(selectedProduct.price)) * 100)}%
                                                            </div>
                                                        )}
                                                    </>
                                                )
                                        }

                                    </div>
                                    <div className='flex flex-col items-stretch gap-5 mb-8'>
                                        <h4 className='font-THICCCBOI-Bold text-xl leading-[30px] font-bold'>Service Details</h4>
                                        <p className='font-Roboto font-normal text-base leading-6'>
                                            {selectedProduct.detail}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex justify-between items-center mb-8'>
                                        <div className='flex justify-between items-center gap-5'>
                                            {/* Quantity controls */}
                                            {isQuantityAdjustable() && (
                                                <div className='flex justify-start items-center gap-2 w-fit'>
                                                    <button
                                                        className='w-6 h-6 rounded-full bg-[#4CC800] flex items-center justify-center'
                                                        onClick={handleDecrement}
                                                    >
                                                        <MinusIcon className="w-4 h-4 text-white" />
                                                    </button>
                                                    <span className='font-THICCCBOI-SemiBold font-semibold text-xl leading-6'> {quantity} </span>
                                                    <button
                                                        className='w-6 h-6 rounded-full bg-[#4CC800] flex items-center justify-center'
                                                        onClick={handleIncrement}
                                                    >
                                                        <PlusIcon className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Buttons */}
                                            <div className='flex gap-2'>
                                                {/* Subscription button */}
                                                {selectedProduct.service_type == "subscription" && (
                                                    <button
                                                        className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit'
                                                        onClick={openSubscriptionModal}
                                                    >
                                                        Subscribe Now <ShoppingCartIcon className="h-5 w-5" stroke='#fff' />
                                                    </button>
                                                )}

                                                {/* Gift Card button */}
                                                {selectedProduct.category && selectedProduct.category.name.toLowerCase() == "gift card" && (
                                                    <button
                                                        className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit'
                                                        onClick={openGiftCardModal}
                                                    >
                                                        Buy Gift Card <ShoppingCartIcon className="h-5 w-5" stroke='#fff' />
                                                    </button>
                                                )}

                                                {/* Add to Cart button */}
                                                {isQuantityAdjustable() && (
                                                    <button
                                                        className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit'
                                                        onClick={addToCartHandler}
                                                    >
                                                        Add to cart <ShoppingCartIcon className="h-5 w-5" stroke='#fff' />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {user && selectedProduct.category.name.toLowerCase() !== "gift card" && (
                                            <button className='p-3 bg-white rounded-full'
                                                                                                        onClick={() => (isProductInFavorites(selectedProduct.id) ? handleRemoveFromFavorites(selectedProduct.id) : handleAddToFavorites(selectedProduct.id))}
                                            >
                                                <HeartIcon
                                                    className="w-6 h-6"
                                                    fill={isProductInFavorites(selectedProduct.id) ? "#4CC800" : ""}
                                                    stroke='#4CC800' />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Tabs and Content */}
                        <div className='flex flex-wrap justify-center items-center gap-5 mb-10'>
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    className={`${selectedTab == tab ? 'primary-gradient' : 'bg-black'} transition-all duration-300 ease-in-out active:scale-95 text-base text-center px-4 md:px-6 py-[10px] rounded-full font-Montserrat font-medium leading-4 flex gap-2 justify-center items-center w-fit mt-2`}
                                    onClick={() => setSelectedTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div>
                            {selectedTab == 'Details' && (
                                <div>
                                    <h4 className='font-THICCCBOI-Bold text-xl leading-[30px] font-bold text-[#4CC800] mb-2'>Service Details:</h4>
                                    <div className='font-Roboto font-normal text-base leading-6'>
                                        {selectedProduct.brief_detail && (selectedProduct.brief_detail !== '' && selectedProduct.brief_detail !== '<p><br></p>' && selectedProduct.brief_detail !== 'null') ? (
                                            <div className='text-white bg-transparent' dangerouslySetInnerHTML={{ __html: selectedProduct.brief_detail }} />
                                        ) : (
                                            'Details information is not available.'
                                        )}
                                    </div>
                                </div>
                            )}
                            {selectedTab == 'Includes' && (
                                <div>
                                    <h4 className='font-THICCCBOI-Bold text-xl leading-[30px] font-bold text-[#4CC800] mb-2'>Includes:</h4>
                                    <div className='font-Roboto font-normal text-base leading-6'>
                                        {selectedProduct.includes && (selectedProduct.includes !== '' && selectedProduct.includes !== '<p><br></p>' && selectedProduct.includes !== 'null') ? (
                                            <div className='text-white bg-transparent' dangerouslySetInnerHTML={{ __html: selectedProduct.includes }} />
                                        ) : (
                                            'Includes information is not available.'
                                        )}
                                    </div>
                                </div>
                            )}
                            {selectedTab == 'Description' && (
                                <div>
                                    <h4 className='font-THICCCBOI-Bold text-xl leading-[30px] font-bold text-[#4CC800] mb-2'>Description:</h4>
                                    <div className='font-Roboto font-normal text-base leading-6'>
                                        {selectedProduct.description && (selectedProduct.description !== '' && selectedProduct.description !== '<p><br></p>' && selectedProduct.description !== 'null') ? (
                                            <div className='text-white bg-transparent' dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                                        ) : (
                                            'Description is not available.'
                                        )}
                                    </div>
                                </div>
                            )}
                            {selectedTab == 'Requirements' && (
                                <div>
                                    <h4 className='font-THICCCBOI-Bold text-xl leading-[30px] font-bold text-[#4CC800] mb-2'>Requirements:</h4>
                                    <div className='font-Roboto font-normal text-base leading-6'>
                                        {selectedProduct.requirements && (selectedProduct.requirements !== '' && selectedProduct.requirements !== '<p><br></p>' && selectedProduct.requirements !== 'null') ? (
                                            <div className='text-white bg-transparent' dangerouslySetInnerHTML={{ __html: selectedProduct.requirements }} />
                                        ) : (
                                            'Requirements information is not available.'
                                        )}
                                    </div>
                                </div>
                            )}
                            {selectedTab == 'Notes' && (
                                <div>
                                    <h4 className='font-THICCCBOI-Bold text-xl leading-[30px] font-bold text-[#4CC800] mb-2'>Notes:</h4>
                                    <div className='font-Roboto font-normal text-base leading-6'>
                                        {selectedProduct.notes && (selectedProduct.notes !== '' && selectedProduct.notes !== '<p><br></p>' && selectedProduct.notes !== 'null') ? (
                                            <div className='text-white bg-transparent' dangerouslySetInnerHTML={{ __html: selectedProduct.notes }} />
                                        ) : (
                                            'Notes information is not available.'
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <CustomModal
                isOpen={modalIsOpen}
                onClose={closePurchaseModal}
                isSubscription={modalType == 'subscription'}
            >
                {modalType == 'subscription' && (
                    <SubscriptionModalContent
                        product={selectedProduct}
                        onClose={closePurchaseModal}
                    />
                )}
                {modalType == 'one_time' && (
                    <OneTimePurchaseModal
                        product={selectedProduct}
                        onClose={closePurchaseModal}
                        quantity={quantity}
                        message="Buy Gift Card"
                    />
                )}
            </CustomModal>
        </main>
    );
};

export default ProductDetail;