import { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, addToCart, getCartItems } from '../reducers/cartSlice';
import { selectUser } from '../reducers/authSlice';
import { Slide, toast } from 'react-toastify';
import { addFavorite, deleteFavorite, getFavorites } from '../reducers/userFavirotesSlice';
import CustomModal from '../components/CustomModal';
import SubscriptionModalContent from '../components/SubscriptionModalContent'; // The modal content component

import { API_ENDPOINT } from '../utils/constants';

import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import MixingService from "../assets/images/mixing-services.png";
import MasteringService from "../assets/images/mastering-services.png";
import MixingMasteringService from "../assets/images/mixing-mastering-services.png";

export default function Services() {
    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('singleDeal');
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const cartItems = useSelector(getCartItems);
    const favorites = useSelector(getFavorites);

    const selectServiceContainer = useRef(null);
    const selectServicePackageContainer = useRef(null);
    // const sectionRef = useRef(null); // New ref for the section

    const handleNextClick = () => {
        selectServiceContainer.current.style.display = 'none';
        selectServicePackageContainer.current.style.display = 'block';
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios({
                method: "POST",
                url: `${API_ENDPOINT}contact/lead/generation`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });

            reset();

            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: `${API_ENDPOINT}categories`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (response.status !== 200) {
                    throw new Error(response.data.error);
                }

                setServices(mapApiData(response.data.filter(item => item.id !== 1)));
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
    }, []);

    const selectedServiceData = services.find(service => service.id == selectedService);

    const addToCartHandler = async (pkg) => {
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
                transition: Slide,
            });
            return;
        }

        const product = {
            service_id: pkg.id,
            service_name: pkg.name,
            price: Number(pkg.discounted_price) || Number(pkg.price),
            qty: 1,
            total_price: Number(pkg.discounted_price) || Number(pkg.price),
            service_type: pkg.type,
            paypal_plan_id: pkg.paypal_plan_id,
            stripe_plan_id: pkg.stripe_plan_id,
        };

        if (user) {
            let productAvailable = cartItems.filter(item => (item.service_id == product.service_id));

            if (productAvailable && productAvailable.length > 0) {
                dispatch(addToCart({
                    services: [{ ...productAvailable[0], qty: Number(productAvailable[0]?.qty) + 1, total_price: Number(productAvailable[0]?.total_price) + Number(product.price) }],
                    isIntialPageLoad: false
                }));
            } else {
                dispatch(addToCart({
                    services: [product],
                    isIntialPageLoad: false
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

    return (
        <main className='mt-24'>
            <section className="text-white relative z-20 mb-24 px-5 md:px-10 xl:px-0">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-full left-0 pointer-events-none" alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-3/4 right-0 pointer-events-none" alt="Purple Shadow Background" />
                </picture>
                {loading ?
                    (
                        <div className="max-w-[1110px] relative z-20 mx-auto">
                            <div className="flex justify-center mb-8">
                                <Skeleton height={50} width={300} baseColor="#0B1306" highlightColor="#171717" />
                            </div>
                            <div className='p-4 md:p-8 rounded-[30px] bg-[#0B1306]'>
                                <div className="grid md:grid-cols-3 gap-8 mb-8">
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="flex flex-col items-center gap-8 bg-black p-7 border rounded-[20px]">
                                            <Skeleton height={40} width={40} baseColor="#0B1306" highlightColor="#171717" /> { }
                                            <Skeleton height={30} width={`80%`} baseColor="#0B1306" highlightColor="#171717" />
                                            <Skeleton height={20} width={`60%`} baseColor="#0B1306" highlightColor="#171717" />
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <Skeleton width={150} height={40} baseColor="#000" highlightColor="#171717" borderRadius={20} />
                                    <Skeleton width={100} height={40} baseColor="#000" highlightColor="#171717" borderRadius={20} />
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        services.length > 0 ?
                            (
                                <div className="max-w-[1110px] relative z-20  mx-auto">
                                    <div ref={selectServiceContainer}>
                                        <h1 className="font-THICCCBOI-Medium font-medium text-[40px] leading-[50px] text-center mb-12">
                                            Choose The <span className="text-[#4CC800]">Service</span> That Fits Your Need!
                                        </h1>
                                        <div className="p-4 md:p-8 rounded-[30px] bg-[#0B1306]">
                                            <div>
                                                <div className="grid md:grid-cols-3 gap-8 mb-8">
                                                    {services.map(service => (
                                                        <label
                                                            key={service.id}
                                                            htmlFor={service.id}
                                                            className={`flex flex-col items-stretch gap-8 bg-black p-7 border rounded-[20px] cursor-pointer ${selectedService == service.id ? 'border-green-400 custom-shadow' : 'border-transparent shadow-none'}`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <img src={service.image} className="w-10 h-10" alt={service.name} />
                                                                <input
                                                                    type="radio"
                                                                    id={service.id}
                                                                    name="service"
                                                                    value={service.id}
                                                                    className="hidden"
                                                                    checked={selectedService == service.id}
                                                                    onChange={() => setSelectedService(service.id)}
                                                                />
                                                                <div className={`w-3 h-3 rounded-sm border ${selectedService == service.id ? 'border-white bg-green-400' : 'border-green-400 bg-transparent'}`}></div>
                                                            </div>
                                                            <h4 className="font-THICCCBOI-Regular text-2xl leading-9">{service.name}</h4>
                                                        </label>
                                                    ))}
                                                </div>

                                                <div className="w-full flex justify-between items-center">
                                                    <RouterLink to="/services-all" className="font-Montserrat font-medium text-sm md:text-base leading-4 rounded-full py-3 md:py-4 px-4 sm:px-6 border">
                                                        View All Services
                                                    </RouterLink>

                                                    <button
                                                        className={`font-Montserrat font-medium text-sm md:text-base leading-4 rounded-full py-3 md:py-4 px-4 sm:px-6 primary-gradient transition-all duration-300 ease-in-out active:scale-95 ${!selectedService ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={!selectedService}
                                                        onClick={handleNextClick}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div ref={selectServicePackageContainer} className="hidden">
                                        <div className="max-w-[1110px] mx-auto">
                                            <div className="grid grid-cols-3">
                                                {services.map(service => (
                                                    <button
                                                        key={service.id}
                                                        className={`p-4 border-b-4 ${selectedService == service.id ? 'border-green-400' : 'border-transparent'}`}
                                                        onClick={() => setSelectedService(service.id)}
                                                    >
                                                        {service.name}
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedServiceData && (
                                                <div className="p-4 md:p-8 rounded-[30px] bg-[#0B1306]" name="service-section">
                                                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-[30px]">
                                                        <h2 className="font-THICCCBOI-Medium font-medium text-[40px] leading-[50px] w-full text-center md:text-left">Select services below:</h2>
                                                        <div className=" flex flex-col items-center md:items-end">
                                                            <p className="font-Roboto font-normal text-base text-right mb-2">Get 30% OFF on Monthly Packages</p>
                                                            <div className="p-[10px] flex justify-center bg-black rounded-[20px]">
                                                                <button
                                                                    className={`font-Roboto text-sm md:text-base font-normal rounded-[10px] py-2 px-4 w-fit text-nowrap ${selectedPackage == 'singleDeal' ? 'bg-[#4DC801] text-white' : 'text-[#4CC800] bg-transparent'}`}
                                                                    onClick={() => {
                                                                        setSelectedPackage('singleDeal');
                                                                        // scrollToSection();
                                                                    }}
                                                                >
                                                                    Single Deals
                                                                </button>
                                                                <button
                                                                    className={`font-Roboto text-sm md:text-base font-normal rounded-[10px] py-2 px-4  w-fit text-nowrap ${selectedPackage == 'monthlyPackage' ? 'bg-[#4DC801] text-white' : 'text-[#4CC800] bg-transparent'}`}
                                                                    onClick={() => {
                                                                        setSelectedPackage('monthlyPackage');
                                                                        // scrollToSection();
                                                                    }}
                                                                >
                                                                    Monthly Pro Packages
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr className="bg-[#1D4B00] mb-[30px] mt-[30px]" />
                                                    {selectedPackage && (
                                                        <>
                                                            {selectedServiceData.packages[selectedPackage].length == 0 && <p className="text-center text-white text-lg">No Packages available</p>}
                                                            <div className="grid md:grid-cols-2 gap-[30px]">
                                                                {selectedServiceData.packages[selectedPackage].sort((a, b) => (Number(a.discounted_price) > 0) ? a.discounted_price - b.discounted_price : a.price - b.price).map((pkg) => (
                                                                    <div
                                                                        key={pkg.id}
                                                                        className={`rounded-[20px] overflow-hidden cursor-pointer relative p-4 md:py-4 md:px-[26px] bg-black`}
                                                                    >
                                                                        <div className="flex items-center justify-between w-2/3">
                                                                            <RouterLink
                                                                                to={"/services/" + pkg.name.toLowerCase().replace(/ /g, "-") + `-p${pkg.id}`}
                                                                                state={{ service_id: pkg.id }}
                                                                                className="flex flex-col items-start justify-between"
                                                                            >
                                                                                <h4 className="text-lg font-medium">{pkg.name}</h4>
                                                                                <p className="text-lg flex gap-3 items-end">
                                                                                    {(Number(pkg.discounted_price) > 0) && <span className={`line-through font-Roboto text-lg md:text-2xl`}>${pkg.price}</span>} {<span className='font-Roboto font-extrabold'>${Number(pkg.discounted_price) ? pkg.discounted_price : pkg.price}</span>}
                                                                                </p>
                                                                            </RouterLink>
                                                                        </div>
                                                                        <div className='flex items-center justify-center gap-3 absolute top-1/2 -translate-y-1/2 right-[26px] w-fit-content'>
                                                                            {
                                                                                user && (
                                                                                    <button
                                                                                        className='w-10 h-10 p-2 bg-white rounded-full flex items-center justify-center'
                                                                                        onClick={() => ((favorites.filter(fav => (fav.service_id == pkg.id)).length > 0) ? handleRemoveFromFavorites(pkg.id) : handleAddToFavorites(pkg.id))}
                                                                                    >
                                                                                        <HeartIcon
                                                                                            className='text-white' width={20} height={20}
                                                                                            fill={(favorites.filter(fav => (fav.service_id == pkg.id)).length > 0) ? "#4CC800" : ""}
                                                                                            stroke='#4CC800' />
                                                                                    </button>
                                                                                )
                                                                            }

                                                                            <button
                                                                                className={`flex items-center justify-center w-10 h-10 rounded-full border bg-[#4DC801]`}
                                                                                onClick={async (e) => {
                                                                                    e.stopPropagation();
                                                                                    if (pkg.type == "subscription") {
                                                                                        openSubscriptionModal(pkg);
                                                                                    } else {
                                                                                        await addToCartHandler(pkg);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <ShoppingCartIcon className='text-white' width={20} height={20} fill='white' />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="w-full flex justify-between items-center mt-8">
                                                        <RouterLink to="/services-all" className="font-Montserrat font-medium text-sm md:text-base leading-4 rounded-full py-3 md:py-4 px-4 sm:px-6 border">
                                                            View All Services
                                                        </RouterLink>
                                                        <RouterLink
                                                            to="/cart"
                                                            className={`font-Montserrat font-medium text-sm md:text-base leading-4 rounded-full py-3 md:py-4 px-4 sm:px-6 primary-gradient`}
                                                        >
                                                            See Cart
                                                        </RouterLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className="max-w-[1110px] relative z-20  mx-auto">
                                    <h2 className='font-THICCCBOI-Bold text-[40px] leading-[46px] font-bold text-center'>No Services Found</h2>
                                </div>
                            )
                    )
                }
            </section>

            <section className="text-white mb-36 px-5 md:px-10 xl:px-0">
                <div className="max-w-[540px] mx-auto">
                    <h2 className="text-center font-THICCCBOI-Regular font-normal text-2xl mb-5">Need Something Else?</h2>
                    <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Name"
                                autoComplete="off"
                                className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                {...register('name', { required: "Name is required" })}
                            />
                            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                        </div>
                        <div className="w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                {...register('email', { required: "Email is required" })}
                            />
                            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Subject"
                                autoComplete="off"
                                className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                {...register('subject', { required: "Subject is required" })}
                            />
                            {errors.subject && <span className="text-red-500">{errors.subject.message}</span>}
                        </div>
                        <div className="w-full">
                            <textarea
                                placeholder="Type your message here"
                                autoComplete="off"
                                className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                rows="5"
                                {...register('message', { required: "Message is required" })}
                            />
                            {errors.message && <span className="text-red-500">{errors.message.message}</span>}
                        </div>
                        <button type="submit" disabled={isSubmitting} className="primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-Montserrat font-medium text-base leading-4 text-white h-[48px] px-12 w-fit flex items-center justify-center rounded-full mx-auto">
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </section>

            {
                modalIsOpen && (
                    <CustomModal
                        isOpen={modalIsOpen}
                        onClose={closeSubscriptionModal}
                        isSubscription={true}
                    >
                        <SubscriptionModalContent
                            product={{ ...selectedProduct, service_type: "subscription" }}
                            onClose={closeSubscriptionModal}
                        />
                    </CustomModal>
                )
            }
        </main>
    );
}

function mapApiData(apiData) {
    const newData = apiData.map((data) => {
        if (data.name == "Mixing And Mastering" || data.name == "Mixing" || data.name == "Mastering") {
            let image;
            const packages = {
                singleDeal: [],
                monthlyPackage: [],
            };

            if (data.name == "Mixing") {
                image = MixingService;
            }

            if (data.name == "Mastering") {
                image = MasteringService;
            }

            if (data.name == "Mixing And Mastering") {
                image = MixingMasteringService;
            }

            data.services.forEach((service) => {
                if (service.service_type == "subscription") {
                    packages.monthlyPackage.push({ id: service.id, name: service.name, price: service.price, discounted_price: service.discounted_price, type: service.service_type, paypal_plan_id: service.paypal_plan_id, stripe_plan_id: service.stripe_plan_id });
                }
                if (service.service_type == "one_time") {
                    packages.singleDeal.push({ id: service.id, name: service.name, price: service.price, discounted_price: service.discounted_price, type: service.service_type, paypal_plan_id: service.paypal_plan_id, stripe_plan_id: service.stripe_plan_id });
                }
            });

            return {
                id: data.id,
                name: data.name,
                packages,
                image,
            };
        }
        else {
            return null;
        }
    }).filter((data) => data !== null);

    return newData;
}