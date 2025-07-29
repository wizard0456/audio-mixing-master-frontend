import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { Slide, toast } from "react-toastify";
import axios from "axios";

// Import utils
import { API_ENDPOINT } from "../utils/constants";

// Import Images
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

const Contact = () => {
    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        // Add form submission logic here
        try {
            const response = await axios({
                method: "POST",
                url: `${API_ENDPOINT}contact/lead/generation`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })

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
            })
        } catch (error) {
            toast.error(error.response?.data?.message || "Message failed to send", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide
            });
        } finally {
            // setIsLoading(false); // This line was not in the new_code, so it's removed.
        }
    };

    return (
        <main>
            <section className="relative top-0 mt-24 text-white ">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[400%] left-0 pointer-events-none" alt="Green Shadow" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                </picture>
                <img src={PurpleShadowBG} className="absolute -top-[300%] right-0 pointer-events-none" alt="Purple Shadow" />
                <div className="bg-[#0B1306] relative top-0 z-20 px-5 md:px-10 xl:px-0 w-full">
                    <div className='max-w-[1110px] mx-auto py-8 flex flex-col items-stretch justify-center gap-8'>
                        <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium'>Contact Us</h1>
                        <div className='w-full'>
                            <p className='font-Roboto font-normal text-base sm:text-base leading-6'>Before contacting us, please check the <Link to={"/faq"} className='text-[#4CC800] font-bold underline'>FAQ</Link> page to make sure your questions aren&rsquo;t already answered.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='contact-form bg-[#0B1306] relative top-0 z-20 md:pt-10 pb-5 mb-24 px-5 md:px-10 xl:px-0'>
                <div className='max-w-[1110px] mx-auto py-8 flex flex-col md:flex-row items-stretch justify-center gap-7'>
                    <div className='w-full md:w-1/2 h-96 md:h-auto'>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2390.0534396248854!2d5.7811753!3d53.198957799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c8ffad96bfb6ad%3A0xd3a1fc36640ed5a2!2sAudio%20Mixing%20Mastering!5e0!3m2!1sen!2s!4v1724076653872!5m2!1sen!2s" width="100%" height="100%" className='rounded-[20px]' allowFullScreen="" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>

                    <div className='w-full md:w-1/2'>
                        <form className="w-full flex flex-col items-center md:items-start gap-5" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                            <button type='submit' disabled={isSubmitting} className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-Montserrat font-medium text-base leading-4 text-white h-[48px] px-12 w-fit flex items-center justify-center rounded-full'>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Contact;