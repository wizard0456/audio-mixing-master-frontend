import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

// Import Images
import UnionIcon from "../assets/images/union.png";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import Loader from '../components/Loader';
import { API_ENDPOINT } from '../utils/constants';

export default function Faq() {
    const [faqs, setFaqs] = useState({});
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFaqId, setOpenFaqId] = useState(null); // State to track currently open FAQ

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get(API_ENDPOINT + 'faq-list');
                const data = response.data;

                // Group FAQs by category
                const groupedFaqs = data.reduce((acc, faq) => {
                    const category = faq.category || 'General';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push({
                        id: faq.id,
                        title: faq.question,
                        content: faq.answer,
                    });
                    return acc;
                }, {});

                const categoryList = Object.keys(groupedFaqs);

                setFaqs(groupedFaqs);
                setCategories(categoryList);
                setActiveCategory(categoryList[0]);
            } catch (err) {
                // Handle error silently
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setOpenFaqId(null); // Close any open FAQ when switching categories
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main>
            <section className="mb-24 mt-24 relative z-20 text-white px-5 md:px-10 xl:px-0">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute bottom-1/4 left-0 pointer-events-none" alt="Green Shadow" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                </picture>
                <img src={PurpleShadowBG} className="absolute -top-2/4 right-0 pointer-events-none" alt="Purple Shadow" />

                <div className='max-w-[1110px] relative z-20 mx-auto'>
                    <h1 className="font-THICCCBOI-Medium font-medium text-[40px] leading-[50px] mb-10 text-center">Frequently Asked Questions</h1>
                </div>

                {
                    loading ? (
                        <div className='max-w-[1110px] relative z-20 mx-auto pb-24'>
                            <Loader />
                        </div>
                    ) : (
                        <div className='max-w-[1110px] relative z-20 mx-auto pb-24'>
                            <div className="flex flex-wrap justify-center gap-3 mb-10">
                                {error ? (
                                    <div className="text-center text-red-500">{error}</div>
                                ) : (
                                    categories.map((category) => (
                                        <button
                                            key={category}
                                            className={`font-Roboto text-base md:text-base leading-6 text-center px-4 md:px-8 py-2 md:py-[14px] rounded-full text-white ${activeCategory == category ? 'primary-gradient' : 'bg-black'}`}
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            {category}
                                        </button>
                                    ))
                                )}
                            </div>
                            <div className="w-full mx-auto text-white flex flex-col gap-7">
                                {error ? (
                                    <div className="text-center text-red-500">{error}</div>
                                ) : (
                                    faqs[activeCategory] && faqs[activeCategory].map((item) => (
                                        <AccordionItem
                                            key={item.id}
                                            title={item.title}
                                            content={item.content}
                                            isOpen={openFaqId == item.id} // Check if this FAQ is open
                                            onToggle={() => setOpenFaqId(openFaqId == item.id ? null : item.id)} // Toggle FAQ open/close
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )
                }
            </section>
        </main>
    );
}

const AccordionItem = ({ title, content, isOpen, onToggle }) => {
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleToggle = () => {
        if (isOpen) {
            // Close without animation
            setIsTransitioning(false);
        } else {
            // Open with animation
            setIsTransitioning(true);
        }
        onToggle();
    };

    return (
        <div className="bg-[#0B1306] rounded-[20px] md:rounded-[30px] overflow-hidden">
            <button className="w-full p-6 lg:p-8 text-left focus:outline-none" onClick={handleToggle}>
                <div className="flex justify-between items-center gap-3">
                    <span><img src={UnionIcon} alt="Union Icon" /></span>
                    <span className="font-THICCCBOI-SemiBold text-lg sm:text-xl lg:text-2xl leading-6 font-semibold flex-grow">{title}</span>
                    <span className={`text-green-500 transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                        <PlusIcon className="w-5 h-5" />
                    </span>
                </div>
            </button>
            <div className={`transition-all ${isTransitioning && isOpen ? 'duration-500' : 'duration-0'} ease-in-out ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
                <div className={`px-8 pb-8 font-Roboto font-light text-base md:text-base leading-6 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {content}
                </div>
            </div>
        </div>
    );
};

AccordionItem.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired, // Prop to check if this item is open
    onToggle: PropTypes.func.isRequired, // Prop to toggle the accordion
};