import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

// Import Utils
import { API_ENDPOINT, DOMAIN } from "../utils/constants";

// Import Images
import AboutService from "../assets/images/about-1.webp";
import Trustp from "../assets/images/trustp.jpg";
import Gog from "../assets/images/gog.jpg";
import Reviewsio from "../assets/images/reviewsio.jpg";
import Siteja from "../assets/images/siteja.jpg";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

const About = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        (async function () {
            try {
                const response = await axios({
                    method: "GET",
                    url: `${API_ENDPOINT}gallary`,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                });

                setGalleryImages(response.data);
                setLoading(false);

            } catch (error) {
                console.log(error.response.data);
                setLoading(false);
            }
        })()
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            const handleKeyDown = (e) => {
                if (e.key == "ArrowLeft") {
                    handlePrev();
                } else if (e.key == "ArrowRight") {
                    handleNext();
                } else if (e.key == "Escape") {
                    closeModal();
                }
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isModalOpen]);

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex == 0 ? galleryImages.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex == galleryImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <main>
            <section className="mb-12 mt-24 relative top-0 z-20 text-white px-5 md:px-10 xl:px-0 overflow-x">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[400%] z-0 left-0 pointer-events-none" width={1000} alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[300%] z-0 right-0 pointer-events-none" width={1000} alt="Purple Shadow Background" />
                </picture>
                <div className='max-w-[1110px] mx-auto relative z-20'>
                    <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center'>It&rsquo;s <span className='text-[#4CC800]'>Not</span> About Us</h1>
                    <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center'>It&rsquo;s All About <span className='text-[#4CC800]'>You</span></h1>
                </div>
            </section>

            <section className=" bg-[#0B1306] relative top-0 z-20 py-12 mb-24 text-white px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    <h2 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-8">We help artists accomplish their dreams.</h2>
                    <div className="flex flex-col md:flex-row items-stretch gap-10">
                        <div className="w-full md:w-1/2 lg:w-2/5">
                            <picture>
                                <source srcSet={AboutService} type="image/webp" />
                                <img src={AboutService} className="w-full h-full rounded-xl object-cover" alt="About Service Photo" />
                            </picture>
                        </div>
                        <div className="w-full md:w-1/2 lg:w-3/5">
                            <p className="font-DMSANS font-normal text-base">We help artists accomplish their dreams. At Audio Mixing Mastering
                                we can take your song from an idea to a complete mastered work of art for the fraction of the cost of other mastering studios. Recording studio time is costly and time-consuming. We offer you all the same services and talented staff for less! All our producers, mixing and mastering engineers have major label experience. We use a variety of tools not only to adjust levels but also in some cases to change the space, structure and positioning of the track components. What we call it is: &ldquo;Dimensional Definition&rdquo;. We add effects and tweak with each component, either based on custom demands, or we&apos;ll just do what sounds good. Before you send us your audio track, be sure to separate each component (such as kicks, snares, synths.) and then send us the separated tracks so that we can work on each instrument individually.  Also, with vocals, send us each vocal separately such as lead vocal, background vocal etc. Try us and see why we are #1 Today!</p>
                            <p className="font-DMSANS font-normal text-base">Check out some of our testimonials <Link to={"/reviews"} className="text-[#4CC800] underline hover:no-underline">Here</Link></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='recommondation text-white mb-24 px-5 md:px-10 xl:px-0'>
                <div className="max-w-[1110px] mx-auto flex flex-col gap-8">
                    <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center">We are Highly Recommended on</h1>
                    <div className="max-w-[550px] w-full mx-auto bg-white rounded-full flex items-center justify-center py-1 overflow-hidden" >
                        <Link to={"https://www.trustpilot.com/review/www.audiomixingmastering.com"} target="_blank" rel="noopener noreferrer" className="flex-grow"><img className="w-full" src={Trustp} alt="Trustpilot" /></Link>
                        <Link to={"https://search.google.com/local/writereview?placeid=ChIJrba_lq3_yEcRotUOZDb8odM"} target="_blank" rel="noopener noreferrer" className="flex-grow"><img className="w-full" src={Gog} alt="Google Reviews" /></Link>
                        <Link to={"https://www.reviews.io/company-reviews/store/audiomixingmastering-com"} target="_blank" rel="noopener noreferrer" className="flex-grow"><img className="w-full" src={Reviewsio} alt="Reviews.io" /></Link>
                        <Link to={"https://www.sitejabber.com/reviews/audiomixingmastering.com"} target="_blank" rel="noopener noreferrer" className="flex-grow"><img className="w-full" src={Siteja} alt="Sitejabber" /></Link>
                    </div>
                </div>
            </section>

            <section className='gallery text-white mb-24 py-5 px-5 md:px-10 xl:px-0 relative z-30  overflow-x-hidden'>
                <div className="max-w-[1110px] mx-auto flex flex-col gap-8">
                    <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center mb-5">Studio Gallery</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch gap-6'>
                        {loading ? (
                            [...Array(8)].map((_, index) => (
                                <div key={index} className='w-full'>
                                    <Skeleton height={250} baseColor="#171717" highlightColor="#2C2C2C" />
                                </div>
                            ))
                        ) : (
                            galleryImages.map((image, index) => (
                                <div key={image.id} className='w-full'>
                                    <img
                                        src={DOMAIN + image.image}
                                        className='w-full h-full object-cover rounded-[20px] hover:scale-105 transition-transform duration-500 ease-in-out cursor-pointer'
                                        alt="Gallery Image"
                                        onClick={() => openModal(index)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <div className="fixed top-0 z-[9000] w-full h-full flex items-center justify-center">
                    <div className="w-full h-full fixed top-0 left-0 z-0 bg-black bg-opacity-75" onClick={closeModal}></div>
                    <button
                        className="fixed top-5 right-5 z-[1000] text-white text-xl rounded-full bg-gray-700 w-10 h-10 leading-4 flex items-center justify-center hover:bg-gray-600 transition"
                        onClick={closeModal}
                    >
                        <RxCross2 />
                    </button>
                    <button
                        onClick={handlePrev}
                        className="fixed left-3 top-1/2 z-[1000] transform -translate-y-1/2 w-10 h-10 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition"
                        aria-label="Previous Image"
                    >
                        &#10094;
                    </button>
                    <div className="flex items-center relative top-0 z-[9000] justify-center w-11/12">
                        <img
                            src={DOMAIN + galleryImages[currentIndex].image}
                            className="w-5/6 h-5/6 object-cover rounded-[20px]"
                            alt="Gallery Image"
                        />
                    </div>
                    <button
                        onClick={handleNext}
                        className="fixed right-3 top-1/2 z-[1000] transform -translate-y-1/2 w-10 h-10 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition"
                        aria-label="Next Image"
                    >
                        &#10095;
                    </button>
                </div>
            )}
        </main>
    );
}

export default About;