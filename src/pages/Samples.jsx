import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

// Import Components
import AudioPlayer from '../components/AudioPlayer';

// Import Utils
import { API_ENDPOINT, DOMAIN, itemsPerPage } from '../utils/constants';

// Import Images
import SampleBanner from "../assets/images/sample-banner.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Samples = () => {
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`${API_ENDPOINT}sample-audios?per_page=${itemsPerPage}&page=${currentPage}`);

            setAudios(response.data.data);
            setCurrentPage(response.data.current_page);
            setPageCount(response.data.last_page);
            setLoading(false);

        }
        fetchData();
    }, [currentPage]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
        setLoading(true);

        // Scroll to the top of the page when the page changes
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // This gives a smooth scrolling effect
        });
    };


    return (
        <main>
            <section className="sample-banner mt-24 relative text-white ">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[180%] left-0 pointer-events-none" alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[120%] right-0 pointer-events-none" alt="Purple Shadow Background" />
                </picture>
                <div className='w-full bg-[#0B1306] relative z-20 px-5 md:px-10 xl:px-0'>
                    <div className='max-w-[1110px] mx-auto py-8 flex flex-col items-stretch justify-center gap-8'>
                        <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium'>
                            Before & After Samples
                        </h1>
                        <div className='flex md:flex-row flex-col items-center justify-center gap-7'>
                            <div className='w-full md:w-1/2'>
                                <img src={SampleBanner} className='w-full rounded-2xl' alt="Sample Banner" />
                            </div>
                            <div className='w-full md:w-1/2'>
                                <p className='font-Roboto font-normal text-base leading-6'>
                                    Below are some examples of how mixing and mastering works before and after the audio mixing and mastering process. They are saved as lossy 128kb/s mp3 files to keep download and playback times to a minimum. This should provide a fantastic experience of how mixing and mastering contribute to the creation of great music. Keep in mind that the sample volumes are turned up to ensure the listener has a great experience at all times. As a result, we strongly advise that you listen with decent headphones to hear the adjustments that have been made.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sample-music mb-24 py-24 text-white px-5 md:px-10 xl:px-0">
                <div className='max-w-[1110px] mx-auto'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {loading ? (
                            [...Array(4)].map((_, index) => (
                                <div key={index} className='w-full'>
                                    <Skeleton height={200} baseColor="#171717" highlightColor="#2C2C2C" />
                                </div>
                            ))
                        ) : (
                            audios.map((audio) => (
                                <div key={audio.id} className='w-full'>
                                    <AudioPlayer
                                        beforeAudioSrc={audio?.before_audio ? `${DOMAIN}${audio?.before_audio}` : ""}
                                        afterAudioSrc={audio?.after_audio ? `${DOMAIN}${audio?.after_audio}` : ""}
                                        beforeAudioName={audio?.name ? audio?.name : "Hip Hop Sample"}
                                        afterAudioName={audio?.name ? audio?.name : "Hip Hop Sample"}
                                        id={audio?.id.toString()}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    {!loading && pageCount > 0 && (
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

                    {!loading && (
                        <div className='mt-20'>
                            <p className='w-4/5 font-Roboto text-base leading-6 text-center font-normal mx-auto'>
                                Thank you for taking the time to listen to our before and after samples. If you are happy with what you hear, you may go ahead and <Link to="/select-services" className='text-[#4CC800] underline font-semibold'>Click here</Link> to get started right away on your songs today. Our team is ready and full of excitement to make your music sound warm, punchy and radio-ready quality!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Samples;