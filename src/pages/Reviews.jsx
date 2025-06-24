import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from "react-router-dom"

// Import Images
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import quote1 from "../assets/images/quote1.png";
import quote2 from "../assets/images/quote2.png";
import { API_ENDPOINT } from '../utils/constants';
import Loader from '../components/Loader';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(API_ENDPOINT + 'testimonial-list');
                setReviews(response.data);
            } catch (err) {
                setError('Failed to load testimonials');
                console.error('Error fetching testimonials:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <main>
            <section className="relative top-0 mt-24">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[250%] left-0 pointer-events-none" width={1000} alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[150%] right-0 pointer-events-none" width={1000} alt="Purple Shadow Background" />
                </picture>
                <div className="relative z-20 top-0 text-white bg-[#0B1306] px-5 md:px-10 xl:px-0">
                    <div className='max-w-[1110px] mx-auto py-8'>
                        <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium'>What people think about us</h1>
                        <div className='w-full'>
                            <p className='font-Roboto font-normal text-base md:text-base leading-6'>Every day, Clients are writing positive Testimonials and Reviews about our services. We just love receiving positive testimonials. One of the great joys of our jobs is helping artists realize their full potential. Audio Mixing Mastering will always be going the extra mile for our clients worldwide. For this is just another reason why we continue to be the #1 Online Mixing and Mastering Company for over 10 years!</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-20 py-16 mb-24 px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

const ReviewCard = ({ review }) => {
    return (
        <div className="bg-black text-white p-5 rounded-[20px] shadow-md flex flex-col items-stretch justify-between gap-3">
            <div className='flex flex-col items-stretch justify-between gap-3'>
                <div><img src={quote1} className='w-4 h-4' alt="Quote Icon" /></div>
                <p className="text-base md:text-base leading-5 font-normal font-Roboto">{review.text}</p>
                <div className='flex items-center justify-end'><img src={quote2} className='w-4 h-4' alt="Quote Icon" /></div>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                    <p className="font-bold font-THICCCBOI-Bold text-base leading-4">{review.user_name}</p>
                    <p className="text-gray-400 font-THICCCBOI-Medium font-medium text-[12px] leading-3">User</p>
                </div>

                <div className="flex items-center">
                    {Array.from({ length: review.ratings }).map((_, index) => (
                        <svg key={index} className="w-5 h-5 text-[#FAD97F]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.184c.969 0 1.372 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.176 0l-3.39 2.46c-.784.57-1.839-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118l-3.39-2.46c-.784-.57-.381-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                    ))}
                </div>

                <div className='w-36'>
                    <Link to={`${review.site_url}`} target="_blank" rel="noopener noreferrer"><img src={review?.img_url} className='w-full object-fill' alt="Review Image" /></Link>
                </div>
            </div>
        </div>
    );
};

ReviewCard.propTypes = {
    review: PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        user_name: PropTypes.string.isRequired,
        ratings: PropTypes.string.isRequired,
        img_url: PropTypes.string.isRequired,
        site_url: PropTypes.string.isRequired,
    }).isRequired,
};