// Import dependencies
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { PaperAirplaneIcon, PhoneIcon, MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Slide, toast } from 'react-toastify';

// Import Components
import WaveformAudioPlayer from '../components/WaveformAudioPlayer';
import SEO from '../components/SEO';

// Import utils
import { API_ENDPOINT } from "../utils/constants";

// Import assets
import BenefitsVideoImage from "../assets/images/home-1.webp";
import LineImage from "../assets/images/home-banner-lines-bg.png";
import BannerBGShadow from "../assets/images/home-banner-shadows-bg.webp";
import quote1 from "../assets/images/quote1.png";
import quote2 from "../assets/images/quote2.png";
import LOGO from "../assets/images/logo.png"
import GetStartedImage from "../assets/images/home-3.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import Artist1 from "../assets/images/artist-1.webp";
import Artist2 from "../assets/images/artist-2.webp";
import Artist3 from "../assets/images/artist-3.webp";
import Artist4 from "../assets/images/artist-4.webp";
import Artist5 from "../assets/images/artist-5.webp";
import Artist6 from "../assets/images/artist-6.webp";
import Artist7 from "../assets/images/artist-7.webp";
import Artist8 from "../assets/images/artist-8.webp";
import Artist9 from "../assets/images/artist-9.webp";
import Artist10 from "../assets/images/artist-10.webp";
import SampleBanner from "../assets/images/home-2.webp";
import MixingMasterigService from "../assets/images/mixing-mastering-service.webp";
import Home1 from "../assets/images/home1.webp";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios({
        method: "POST",
        url: `${API_ENDPOINT}lead/generation`,
        data: { email },
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

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

      setEmail(""); // Reset email field
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed", {
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Structured data for the homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AudioMixingMastering",
    "url": "https://www.audiomixingmastering.com",
    "description": "Professional audio mixing and mastering services with over 25 years of experience. Fast turnaround, best offers, and expert sound engineering.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.audiomixingmastering.com/services?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "offers": {
      "@type": "Offer",
      "description": "Professional audio mixing and mastering services",
      "price": "25",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <SEO 
        title="Professional Audio Mixing and Mastering Services"
        description="Elevate your music with top-notch Mixing and Mastering Services. Audio Mixing Mastering. ✔️ Fast Turnaround ✔️ 25+ Years ✔️ Best Offers. Professional sound engineering for artists worldwide."
        keywords="mastering music, mixing audio, online mastering services, what is mixing in music, audio mixer online, online audio mixer, online mastering, online audio mastering, mixing in music, mastering vs mixing, mastering audio, mix master studio, music mastering service, mixing music online, mixed audio, what is mixing music, what is mastering and mixing, online music mastering, music mastering"
        image="https://static.wixstatic.com/media/cf9233_f1627fce660a4d8c84b587e744a9bc79~mv2.jpg/v1/fill/w_1919,h_1080,al_c/cf9233_f1627fce660a4d8c84b587e744a9bc79~mv2.jpg"
        url="/"
        structuredData={homepageStructuredData}
      />
      <main className="text-white mt-5">
        <picture>
          <source srcSet={BannerBGShadow} type="image/webp" />
          <img
            src={BannerBGShadow}
            className="banner-bg-shadow w-full block absolute top-0 md:-top-3 pointer-events-none h-[900px] md:h-auto"
            alt="Header Shadow"
          />
        </picture>
        <section className="home-banner relative top-0 mt-6 mb-20 md:mb-10 md:py-24 px-5 md:px-10 xl:px-0">
          <img src={LineImage} className="w-[100%] h-[566px] block absolute top-0 right-0 pointer-events-none" alt="Line" />
          <div className="max-w-[1110px] mx-auto flex flex-col gap-8 relative z-10">
            <h1 className="text-white font-THICCCBOI-ExtraBold text-[40px] sm:text-[50px] font-bold lg:text-[60px] leading-tight xl:font-extrabold xl:text-[70px] xl:leading-[80px] text-center">Professional Online <br className="hidden xl:block" /> Mixing and Mastering Services At <br className="hidden xl:block" /> A Very Affordable Price!</h1>
            <WaveformAudioPlayer />
            <Link to={"/samples"} className="text-base leading-none text-center font-Montserrat font-medium primary-gradient transition-all duration-300 ease-in-out active:scale-95 block mx-auto py-4 px-12 text-white rounded-full mt-8">More Samples</Link>
          </div>
        </section>

        <section className="banefits-video mb-10 px-5 md:px-10 xl:px-0 relative z-20">
          <div className="max-w-[1110px] mx-auto relative top-0">
            <picture>
              <source srcSet={BenefitsVideoImage} type="image/webp" />
              <img src={BenefitsVideoImage} className="w-full object-contain rounded-3xl" alt="Benefits Video Image" />
            </picture>
          </div>
        </section>

        <section className="banefits-content relative mb-24 bg-[#0B1306] sm:rounded-[30px] px-5 md:px-10 xl:px-0">
          <div className="max-w-[1110px] relative z-20 mx-auto py-9">
            <h2 className="font-THICCCBOI-Medium font-medium text-[40px] leading-[50px] mb-7">What Are the Benefits of Using Online Mixing and Mastering Services?</h2>
            <div className='flex flex-col-reverse lg:flex-row items-stretch gap-8'>
              <div className="w-full lg:w-1/2 flex flex-col gap-5">
                <picture>
                  <source srcSet={Home1} type="image/webp" />
                  <img src={Home1} className="w-full rounded-xl h-full object-fill" alt="Benefits Video Image" />
                </picture>
              </div>
              <div className='w-full lg:w-1/2 pr-5 flex flex-col gap-3'>
                <div className="flex items-center justify-start gap-3 ">
                  <p className="font-DMSANS font-normal text-base leading-6">The biggest benefit of using online mixing and mastering services is that you can save a lot of money and use the rest for things like marketing, video shoots, and promotion, all of which are expensive to begin.</p>
                </div>

                <div className="flex items-center justify-start gap-3 ">
                  <p className="font-DMSANS font-normal text-base leading-6">Mixing is essentially the process before mastering, and it entails integrating and modifying separate recordings to make a professional stereo mix. Next, the stereo file is mastered to ensure the music has been cleaned and framed into a powerful, radio-ready release smash hit.</p>
                </div>

                <div className="flex items-center justify-start gap-3 ">
                  <p className="font-DMSANS font-normal text-base leading-6">Musicians nowadays have easy access to recording software and gear. What is great about this rise in self-recording is that it allows independent musicians in the seclusion of their own homes to make multi-track recordings at their leisure.</p>
                </div>

                <div className="flex items-center justify-start gap-3 ">
                  <p className="font-DMSANS font-normal text-base leading-6">You may save money by hiring a mixing and mastering firm and putting the spare time and money to good use. Additionally, we offer Customer Service 24 hours a day, 7 days a week, right here on our website. Using our online chat technology, we can communicate swiftly and easily as we genuinely care about the end product’s quality.</p>
                </div>

                <div className="flex items-center justify-start gap-3 ">
                  <p className="font-DMSANS font-normal text-base leading-6">Before sending us your project, please examine our upload page and send the split tracks so that we can work on each one separately. Remember, we embrace all genres, so prepare your files and let us take your music to the next level!</p>
                </div>
              </div>
            </div>
          </div>
          <picture>
            <source srcSet={PurpleShadowBG} type="image/webp" />
            <img src={PurpleShadowBG} className='absolute -bottom-1/3 right-0 pointer-events-none' alt="Purple Shadow Background" />
          </picture>
        </section>

        <section className="home-sample-music relative z-10 mb-24 px-5 md:px-10 xl:px-0">
          <picture>
            <source srcSet={GreenShadowBG} type="image/webp" />
            <img src={GreenShadowBG} className='absolute left-0 -bottom-[200%] pointer-events-none' alt="Green Shadow Background" />
          </picture>
          <div className="max-w-[1110px] mx-auto">
            <h2 className="font-THICCCBOI-Medium font-medium text-[40px] leading-[50px] mb-7">What Are the Risks of Not Using Professional Online Mixing and Mastering Services?</h2>
            <div className='flex flex-col-reverse lg:flex-row items-stretch gap-8'>
              <div className="w-full lg:w-1/2 flex flex-col justify-between items-stretch gap-5 lg:gap-0">
                <div className="flex flex-col justify-between items-stretch gap-8">
                  <p className="font-Roboto text-base md:text-base font-normal leading-6 text-center lg:text-left">
                    Professional mixing and mastering services are an essential component of any musician’s career, whether they are just starting out in a garage or selling multimillion-dollar albums. Without expert mixing services and complete control over the listener’s experience, you risk appearing unprofessional and jeopardizing the integrity of your music. However, you have options if you want to know how to acquire the finest potential outcomes for your music. It is entirely up to you whether you want to take the chance that your music will not sound as it should or hire Online music mastering service professional. Seriously, while determining where you want to save money, keep your future in mind. We would strongly recommend hiring us to do your job if you desire high-quality sound. You can hear why we are the best in the world by listening to our before and after samples below.
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-5">
                <picture>
                  <source srcSet={SampleBanner} type="image/webp" />
                  <img src={SampleBanner} className="w-full rounded-xl h-full object-fill" alt="Sample Banner" />
                </picture>
              </div>
            </div>
          </div>
        </section >

        <section className="about-sevice relative z-20 bg-[#0B1306] py-12 mb-24 px-5 md:px-10 xl:px-0">
          <div className="max-w-[1110px] mx-auto">
            <h2 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-8 text-center md:text-left">Mixing and Mastering Services</h2>
            <div className="flex flex-col md:flex-row items-stretch gap-10 relative z-20 overflow-hidden">
              <div className="w-full md:w-1/2 lg:w-2/5">
                <picture>
                  <source srcSet={MixingMasterigService} type="image/webp" />
                  <img src={MixingMasterigService} className='w-full h-full object-cover rounded-xl' alt="About Service Photo" />
                </picture>
              </div>
              <div className="w-full md:w-1/2 lg:w-3/5">
                <div className="flex items-center justify-start gap-3 py-3">
                  <p className="font-DMSANS font-normal text-base leading-6">The music industry is one of the most competitive in the world. Mixing and mastering services are essential for any artist or recording team that is looking to achieve success in their career. From vocal to instrumental, mixing and mastering services are needed to ensure that the final product sounds professional and polished. With accurate mixing and mastering, artists can plan their releases and submit their songs to record labels much easier.</p>
                </div>

                <div className="flex items-center justify-start gap-3 py-3">
                  <p className="font-DMSANS font-normal text-base leading-6">What is Mixing and Mastering Service? Mixing is the term commonly used to refer to the process of taking an audio track and cleaning it solidly using advance techniques.</p>
                </div>

                <div className="flex items-center justify-start gap-3 py-3">
                  <p className="font-DMSANS font-normal text-base leading-6">Mastering is the final polish in audio production, which involves enhancing the overall sound, creating consistency, making the song sound professional and radio ready.</p>
                </div>
                <Link to={"/about"} className="text-base leading-none text-center font-Montserrat w-fit font-medium primary-gradient transition-all duration-300 ease-in-out active:scale-95 block py-4 px-12 text-white rounded-full mt-4 ms-auto md:ms-0 me-auto">Learn More</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="artist-slider relative z-20 mb-24 px-5 md:px-10 xl:px-0">
          <picture>
            <source srcSet={PurpleShadowBG} type="image/webp" />
            <img src={PurpleShadowBG} className="absolute -bottom-1/2 right-0 pointer-events-none z-0" alt='Purple Shadow' />
          </picture>
          <div className="max-w-[1110px] mx-auto relative z-20">
            <div className='mb-16'>
              <h5 className="font-THICCCBOI-Medium text-base text-[#17A84E] text-center font-medium">Just A Few Of Many</h5>
              <h2 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-8 text-center">Name Credits</h2>
            </div>
            <CreditsSlider />
          </div>
        </section>

        <section className="testimonials py-12 mb-24 px-5 md:px-10 xl:px-0">
          <div className="max-w-[1110px] mx-auto flex flex-col gap-[60px]">
            <div className="flex flex-col gap-3 w-4/5 mx-auto">
              <h5 className="font-THICCCBOI-Medium text-base text-[#17A84E] text-center font-medium">Testimonials</h5>
              <h2 className="font-THICCCBOI-Medium text-center text-[40px] leading-[50px] font-medium">2000+ Happy User</h2>
              <p className="font-Roboto text-base md:text-base lg:text-lg font-normal text-center">Whether you&rsquo;re tackling complex projects or managing daily tasks, our solution adapts to your unique challenges to help you.</p>
            </div>
            <ReviewSlider />
            <Link to={"/reviews"} className="text-base leading-none text-center font-Montserrat font-medium primary-gradient transition-all duration-300 ease-in-out active:scale-95 block w-fit mx-auto py-4 px-12 text-white rounded-full">View All Reviews</Link>
          </div>
        </section>

        <section className="get-in-touch mb-24 relative z-20 px-5 md:px-10 xl:px-0">
          <div className="max-w-[1110px] mx-auto bg-[#0B1306] p-8 flex flex-col md:flex-row gap-5 md:gap-0 rounded-lg md:rounded-[30px]">
            <div className="w-full md:w-1/2 flex flex-col justify-between gap-5 md:gap-0">
              <div>
                <h2 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center md:text-left">Get In Touch</h2>
                <h3 className="font-Roboto font-normal text-2xl text-[#17A84E] text-center md:text-left mt-5 md:mt-0">We&rsquo;d love to hear from you</h3>
              </div>
              <img src={LOGO} className="w-24 md:ms-0 ms-auto me-auto" alt="Logo" />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-end gap-6">
              <div className="w-full lg:w-96 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5">
                <div className="bg-white h-[66px] w-[66px] rounded-[5px] flex items-center justify-center">
                  <PaperAirplaneIcon color="#17A84E" className="-rotate-45 w-10" />
                </div>
                <div className="w-full sm:w-60 text-center md:flex-grow-1">
                  <a href="mailto:support@audiomixingmastering.com" className="block font-Roboto font-normal text-base leading-6">support@audiomixingmastering.com</a>
                  <a href="" className="block">www.audiomixingmastering.com</a>
                </div>
              </div>
              <div className="w-full lg:w-96 flex flex-col sm:flex-row  items-center justify-center md:justify-start gap-5">
                <div className="bg-white h-[66px] w-[66px] rounded-[5px] flex items-center justify-center">
                  <PhoneIcon color="#17A84E" className="w-10" />
                </div>
                <div className="w-full sm:w-60 text-center md:flex-grow-1">
                  <a href="https://wa.link/rvvpjm" target='_blank' rel="noreferrer" className="block font-Roboto font-normal text-base leading-6">Whatsapp: +31634038672</a>
                  <a href="" className="block">www.audiomixingmastering.com</a>
                </div>
              </div>
              <div className="w-full lg:w-96 flex flex-col sm:flex-row  items-center justify-center md:justify-start gap-5">
                <div className="bg-white h-[66px] w-[66px] rounded-[5px] flex items-center justify-center">
                  <MapPinIcon color="#17A84E" className="w-10" />
                </div>
                <div className="w-full sm:w-60 text-center md:flex-grow-1">
                  <a href='https://maps.app.goo.gl/ovDJJ63eU7v7Az6E9' target='_blank' rel="noreferrer" className="block font-Roboto font-normal text-base leading-6">Audio Mixing Mastering <br /> Tesselschadestraat 27,<br /> Leeuwarden, Netherlands</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="get-started relative z-40 mb-24 px-5 md:px-10 xl:px-0">
          <picture>
            <source srcSet={GreenShadowBG} type="image/webp" />
            <img src={GreenShadowBG} className='absolute left-0 bottom-1/2 pointer-events-none' alt="Green Shadow" />
          </picture>
          <div className="max-w-[1110px] relative z-20 mx-auto flex flex-col gap-10 rounded-[30px]">
            <div className="flex flex-col gap-4">
              <h2 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center md:text-start">Ready to get started?</h2>
              <p className="font-Roboto font-normal text-base md:text-base leading-6 text-center md:text-start">If you are struggling to find the best mixing and mastering services for your next music release, then we &rsquo;ve got you covered. Give a head start to your music career and let us help you get studio-quality mastered tracks. Our team of real hands-on engineers will fine-tune your songs to a radio-ready quality, so you can impress your listeners and boost your career like never before. Below you can listen to our before and after, mixing and mastering examples. This should give you a decent understanding of what mixing and mastering are and how they may assist you in creating a great song.</p>
            </div>

            <div className="flex flex-col gap-4 relative z-20">
              <picture>
                <source srcSet={GetStartedImage} type="image/webp" />
                <img src={GetStartedImage} className='rounded-lg md:rounded-[30px] relative z-20' alt="Get Started Image" />
              </picture>
              <Link to={"/select-services"} className="text-base leading-none text-center font-Montserrat font-medium primary-gradient transition-all duration-300 ease-in-out active:scale-95 block mx-auto py-4 px-12 text-white rounded-full mt-3  relative z-20">Get Started</Link>
            </div>
          </div>
        </section>

        <section className="news-letter relative z-20 mb-24 px-5 md:px-10 xl:px-0">
          <picture>
            <source srcSet={PurpleShadowBG} type="image/webp" />
            <img src={PurpleShadowBG} className="absolute -bottom-1/2 right-0 pointer-events-none z-0" alt='Purple Shadow' />
          </picture>
          <div className="max-w-[1110px] relative z-20 mx-auto flex flex-col items-center justify-center gap-16 rounded-[30px]">
            <div className="flex flex-col items-center justify-center gap-3">
              <h4 className="font-Roboto font-normal text-[18px] leading-7 text-center text-[#17A84E]">Enter Email to Receive 10% Voucher</h4>
              <h1 className="font-THICCCBOI text-[30px] sm:text-[40px] leading-tight lg:text-[50px] lg:leading-[70px] font-medium text-center">Join our mailing list & <span className="font-black">Receive a 10%</span> Off coupon code!</h1>
            </div>

            <form onSubmit={handleEmailSubmit} className="w-full max-w-[534px] h-[70px] relative top-0 rounded-[38px]">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={`w-full h-full rounded-[38px] py-3 ps-16 text-base font-Poppins text-[#57656C] border-none outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Email"
                disabled={loading} // Disable input during loading
              />
              <div className="absolute top-2/4 translate-y-[-50%] left-4 h-[40px] w-[40px] flex items-center justify-center bg-[#17A84E] rounded-full">
                <EnvelopeIcon width={20} height={20} />
              </div>
              <button
                type="submit"
                className={`bg-[#17A84E] text-white absolute top-2/4 translate-y-[-50%] right-4 h-[40px] px-8 w-fit flex items-center justify-center rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading} // Disable button during loading
              >
                {loading ? 'Submitting...' : 'Submit'} {/* Change button text during loading */}
              </button>
            </form>
          </div>
        </section>
      </main >
    </>
  );
}

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Fetch reviews from an API
    async function fetchReviews() {
      try {
        const response = await axios.get(API_ENDPOINT + "testimonial-list");
        setReviews(response.data);
      } catch (error) {
        // Handle error silently
      }
    }

    fetchReviews();
  }, []);

  const settings = {
    dots: true,
    fade: true,
    nextArrow: null, // Hide the next arrow
    prevArrow: null, // Hide the previous arrow
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: true,
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="slider-container mb-[50px] review-slider">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            key={index}
          >
            <div className="flex flex-col items-center justify-center gap-7" style={{ cursor: isDragging ? "grabbing" : "grab" }}>
              <p className="font-Roboto text-lg lg:text-2xl font-normal text-center">
                <span>
                  <img src={quote1} className="float-left top-0" alt="quote icon" />
                </span>
                {review.text}
                <span>
                  <img src={quote2} className="float-right" alt="quote icon" />
                </span>
              </p>
              <div className="flex flex-col items-center justify-center gap-7">
                <div className="flex items-center justify-center clear-both">
                  {[...Array(parseInt(review.ratings))].map((_, index) => (
                    <svg
                      key={index.toString()}
                      className="w-5 h-5 text-[#FAD97F]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-label={`${index + 1} star rating`}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.184c.969 0 1.372 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.176 0l-3.39 2.46c-.784.57-1.839-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118l-3.39-2.46c-.784-.57-.381-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
                <Link to={review.site_url} target="_blank" rel="noopener noreferrer">
                  <img src={review.img_url} alt="Site Logo" width={'200px'} />
                </Link>
                <div>
                  <h3 className="font-Roboto text-lg font-bold text-center mb-3">{review.user_name}</h3>
                  <p className="font-Roboto text-lg font-medium text-center">{review.user_designation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

function CreditsSlider() {
  const [isDragging, setIsDragging] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    arrows: true, // Remove the previous and next buttons
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const slidesData = [
    { id: 1, title: "Sean Paul", imgSrc: Artist1, link: "https://www.youtube.com/watch?v=W7FpQtEdFe4" },
    { id: 2, title: "Flo Rida", imgSrc: Artist2, link: "https://soundcloud.com/immgrecords/flo-rida-goin-down-for-real-remix-by-sherman-de-vries-x-kaizer" },
    { id: 3, title: "Ne-Yo", imgSrc: Artist3, link: "https://www.youtube.com/watch?v=o-yhTTey1ac" },
    { id: 4, title: "Florida Georgia Line", imgSrc: Artist4, link: "https://www.youtube.com/watch?v=yz0gD7733ng" },
    { id: 5, title: "Craig David", imgSrc: Artist5, link: "https://www.youtube.com/watch?v=nJnggjBLFRY" },
    { id: 6, title: "Hollywood Undead", imgSrc: Artist6, link: "https://www.youtube.com/watch?v=LOM0R6gvMac" },
    { id: 7, title: "Shaggy", imgSrc: Artist7, link: "https://soundcloud.com/immgrecords/shaggy-ft-mohombi-faydee-costi-i-need-your-love-remix-by-sherman-de-vries-icefromsxm" },
    { id: 8, title: "Gyptian", imgSrc: Artist8, link: "https://www.youtube.com/watch?v=MKM7YFhQHNA" },
    { id: 9, title: "BET Awards", imgSrc: Artist9, link: "https://www.youtube.com/watch?v=zGfoZJqZylk" },
    { id: 10, title: "MTV", imgSrc: Artist10, link: "https://www.youtube.com/watch?v=TrfenKvk3bY" },
  ];

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="w-full mx-auto credits-slider px-5 sm:px-0"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Slider {...settings}>
        {slidesData.map((slide) => (
          <div key={slide.id} className={`p-2`}>
            <div
              className={`text-white rounded-[20px] bg-black shadow-xl hover:shadow-2xl hover:bg-[#0B1306] overflow-hidden`}
            >
              <a
                href={slide.link}
                target="_blank"
                rel="noreferrer noopener"
                className="block"
                style={{ cursor: isDragging ? "grabbing" : "grab" }} // Set the default cursor
              >
                <div className="p-4">
                  <img
                    src={slide.imgSrc}
                    alt={slide.title}
                    className="w-full scale-100 transition-all duration-300"
                  />
                </div>
                <div className="pb-4 text-center">
                  <h3 className="text-lg font-medium">{slide.title}</h3>
                </div>
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}