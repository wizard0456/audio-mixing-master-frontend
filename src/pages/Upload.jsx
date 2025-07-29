import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FolderIcon, LinkIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { API_ENDPOINT } from "../utils/constants";
import LOGO from "../assets/images/logo.png";
import UnionIcon from "../assets/images/union.png";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import { Link, useNavigate } from "react-router-dom";

const Upload = () => {
    const [isFileUpload, setIsFileUpload] = useState(false);
    const { register, reset, handleSubmit, formState: { errors, isSubmitting }, clearErrors } = useForm();
    const [linkValue, setLinkValue] = useState("");
    const formRef = useRef(null);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("email", data.email);
        if (isFileUpload) {
            // Append each file to the formData
            for (let i = 0; i < data.audio.length; i++) {
                formData.append("image_file[]", data.audio[i]);
            }
        } else {
            formData.append("image_url", data.audio);
        }
        formData.append("name", data.name);
        formData.append("arlist_name", data.arlist_name);
        formData.append("tarck_title", data.tarck_title);
        formData.append("services", data.services);
        formData.append("reference", data.reference);

        // Send form data to server
        try {
            const response = await axios({
                method: "POST",
                url: `${API_ENDPOINT}upload/lead/gen`,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
            });

            reset();
            setLinkValue("");

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
            toast.error(error.response?.data?.error || "Upload failed", {
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

    const toggleInputMode = () => {
        setIsFileUpload(!isFileUpload);
        clearErrors("audio"); // Clear audio errors when toggling between modes
    };

    const validateAudioFile = (files) => {
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (!files[i].type.startsWith('audio/')) {
                    return 'All files must be audio files';
                }
            }
        }
        return true;
    };

    const validateAudioLink = (url) => {
        if (url) {
            const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
            if (!urlRegex.test(url)) {
                return 'Invalid URL';
            }
        }
        return true;
    };

    // Scroll to form handler
    const handleScrollToForm = (e) => {
        e.preventDefault();
        if (formRef.current) {
            const yOffset = -200; // Offset for fixed header or spacing
            const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <main>
            <section className="mt-24 relative z-20 text-white mb-24 px-5 md:px-10 xl:px-0">

                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-3/4 left-0 pointer-events-none" alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-3/4 right-0 pointer-events-none" alt="Purple Shadow Background" />
                </picture>

                <div className="max-w-[1110px] relative z-20 mx-auto">
                    <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center mb-10">Get Started Following 3 Easy Steps!</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-8 mb-16">
                        <div className="bg-white  flex flex-col gap-5 p-8 rounded-[20px] items-center">
                            <div className="w-16 h-16 flex items-center justify-center bg-[#4CC800] rounded-full text-3xl font-bold">
                                1
                            </div>
                            <p className="font-THICCCBOI-Medium font-medium text-base leading-6 text-center lg:text-left lg:text-xl lg:leading-7 capitalize text-black">
                                <a className="text-[#4CC800] font-bold" target="_blank" rel="noopener noreferrer" href="https://wetransfer.com/?to=icemusicmedia@gmail.com">Upload</a> your Files
                            </p>
                        </div>
                        <div className="bg-white  flex flex-col gap-5 p-8 rounded-[20px] items-center">
                            <div className="w-16 h-16 flex items-center justify-center bg-[#4CC800] rounded-full text-3xl font-bold">
                                2
                            </div>
                            <p className="font-THICCCBOI-Medium font-medium text-base leading-6 text-center lg:text-left lg:text-xl lg:leading-7 capitalize text-black">
                                <a className="text-[#4CC800] font-bold cursor-pointer" href="#form-section" onClick={handleScrollToForm}>Fill</a> out the form.
                            </p>
                        </div>
                        <div className="bg-white  flex flex-col gap-5 p-8 rounded-[20px] items-center">
                            <div className="w-16 h-16 flex items-center justify-center bg-[#4CC800] rounded-full text-3xl font-bold">
                                3
                            </div>
                            <p className="font-THICCCBOI-Medium font-medium text-base leading-6 text-center lg:text-left lg:text-xl lg:leading-7 capitalize text-black">
                                <Link to="/select-services" className="text-[#4CC800] font-bold">choose</Link> your required service.
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#060505] border flex-col-reverse lg:flex-row border-[#7E7E7E] rounded-[20px] p-4 md:p-8 flex items-center justify-center gap-8">
                        <div className='w-full lg:w-1/2 '>
                            <form ref={formRef} id="form-section" className="w-full flex flex-col items-center sm:items-start gap-5" onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col sm:flex-row gap-5 w-full">
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
                                </div>
                                <div className="flex flex-col sm:flex-row gap-5 w-full">
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            placeholder="Artist Name"
                                            autoComplete="off"
                                            className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                            {...register('arlist_name', { required: "Artist name is required" })}
                                        />
                                        {errors.arlist_name && <span className="text-red-500">{errors.arlist_name.message}</span>}
                                    </div>
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            placeholder="Track Title"
                                            autoComplete="off"
                                            className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                            {...register('tarck_title', { required: "Track title is required" })}
                                        />
                                        {errors.tarck_title && <span className="text-red-500">{errors.tarck_title.message}</span>}
                                    </div>
                                </div>
                                <div className="w-full flex items-stretch gap-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Paste your link to file here (e.g., WeTransfer, Google Drive, Dropbox)"
                                        className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                        {...register('audio', { required: "Google Drive link is required", validate: validateAudioLink })}
                                        value={linkValue}
                                        onChange={e => setLinkValue(e.target.value)}
                                    />
                                </div>
                                {errors.audio && <span className="text-red-500">{errors.audio.message}</span>}
                                <div className="w-full">
                                    <select
                                        className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                        {...register('services', { required: "Service is required" })}
                                    >
                                        <option value="">Select A Service</option>
                                        <option value="mixing">Mixing</option>
                                        <option value="mastering">Mastering</option>
                                        <option value="mixing-mastering">Mixing & Mastering</option>
                                    </select>
                                    {errors.services && <span className="text-red-500">{errors.services.message}</span>}
                                </div>
                                <div className="w-full">
                                    <textarea
                                        placeholder="Note // References"
                                        className="w-full p-[15px] bg-[#171717] text-white text-base leading-4 font-Roboto font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                        rows="5"
                                        {...register('reference')}
                                    />
                                </div>
                                <button type='submit' disabled={isSubmitting} className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-Montserrat font-medium text-base leading-4 text-white h-[48px] px-12 w-fit flex items-center justify-center rounded-full'>
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        </div>
                        <div className="w-full lg:w-1/2 flex flex-col gap-3">
                            <h4 className="font-THICCCBOI-Bold font-bold text-2xl leading-9 capitalize text-[#4CC800] text-center">Note</h4>
                            <p className="font-Roboto font-normal text-base leading-6 text-[#EBF3E5] text-center capitalize">
                                Important to please fill out the form below on this page. After completing the 3 easy steps, our engineers will get started on your project right away. Your project will be completed within 72-120 hours of time. If you are in a rush, no worries! We also offer rush orders within 24 hours of time. This service can be purchased on our services page as well. Once we have completed your project we will email you with your final radio ready to release WAV file. If you are not happy with the results you will have up to 3 FREE revisions to get your song perfected to your liking.
                            </p>
                            <img src={LOGO} className='w-24 mx-auto mt-4' alt="Logo" />
                        </div>
                    </div>
                </div>

            </section>

            <section className="text-white mb-36 relative z-20">
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute top-1/4 right-0 pointer-events-none" width={600} alt="Purple Shadow Background" />
                </picture>
                <div className="w-full bg-[#0B1306] relative z-20 py-24 px-5 md:px-10 xl:px-0">
                    <div className="max-w-[1110px] mx-auto flex flex-col justify-center items-center gap-12">
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium text-center mb-10 w-4/5">
                            To help us <span className="text-[#4CC800]">produce quality music</span>, please ensure the next few steps are completed before you submit your tracks:
                        </h1>
                        <div className="flex flex-wrap gap-5 items-center justify-center">
                            <div className="flex w-full sm:w-fit gap-2 p-4 rounded-[10px] bg-[#17260D]">
                                <img src={UnionIcon} className="w-6 h-6" alt="Union Icon" />
                                <p className="font-Roboto font-normal text-base leading-6">Ensure that the tracksout files are not clipping.</p>
                            </div>
                            <div className="flex w-full sm:w-fit gap-2 p-4 rounded-[10px] bg-[#17260D]">
                                <img src={UnionIcon} className="w-6 h-6" alt="Union Icon" />
                                <p className="font-Roboto font-normal text-base leading-6">Export all tracks to -6db on channel faders (not just master bus).</p>
                            </div>
                            <div className="flex w-full sm:w-fit gap-2 p-4 rounded-[10px] bg-[#17260D]">
                                <img src={UnionIcon} className="w-6 h-6" alt="Union Icon" />
                                <p className="font-Roboto font-normal text-base leading-6">Avoid using compression, normalization, EQ or any effects.</p>
                            </div>
                            <div className="flex w-full sm:w-fit gap-2 p-4 rounded-[10px] bg-[#17260D]">
                                <img src={UnionIcon} className="w-6 h-6" alt="Union Icon" />
                                <p className="font-Roboto font-normal text-base leading-6">Make sure no channel volume is in red.</p>
                            </div>
                            <div className="flex w-full sm:w-fit gap-2 p-4 rounded-[10px] bg-[#17260D]">
                                <img src={UnionIcon} className="w-6 h-6" alt="Union Icon" />
                                <p className="font-Roboto font-normal text-base leading-6">Submit 24 Bit WAV Files in 44.1 or 48 kHz.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default Upload;