import { useState } from "react";
import { useForm } from 'react-hook-form';
import LOGO from "../assets/images/logo.png";
import loginBg from "../assets/images/login-bg.webp";
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { API_ENDPOINT } from "../utils/constants";

const ForgetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onSubmit",
        defaultValues: {
            email: "",
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = async (userData) => {
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_ENDPOINT}auth/forgot-password`, userData);

            if (response.status !== 200) {
                throw new Error(response.data.error);
            }

            toast.success("Password reset email sent successfully", {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });

        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Something went wrong. Please try again.';
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full h-screen flex items-center justify-end text-black overflow-hidden'>
            <div className='absolute w-full h-full left-[-20%] -z-10'>
                <picture>
                    <source srcSet={loginBg} type="image/webp" />
                    <img src={loginBg} className='w-full h-full object-fill' alt="Background" />
                </picture>
            </div>

            <div className='w-full md:max-w-[600px] relative top-0 md:w-2/4 h-full bg-white flex flex-col justify-center gap-12 items-center p-5 sm:p-8 md:p-10'>
                <Link className='absolute top-5 md:top-10 left-5 md:left-10 w-8 h-8 rounded-full bg-black flex justify-center items-center' to={"/login"}>
                    <ArrowLeftIcon className='w-4 h-4 cursor-pointer text-white' />
                </Link>

                <div className='flex flex-col items-center gap-3'>
                    <picture>
                        <source srcSet={LOGO} type="image/png" />
                        <img src={LOGO} className='w-40' alt="Logo Icon" />
                    </picture>
                    <h6 className='font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-center uppercase tracking-[.6em]'>Forgot Password</h6>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                    <div className='w-full flex flex-col gap-2'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id='email'
                            placeholder="Enter Email Address"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Invalid email address'
                                }
                            })}
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
                    </div>
                    <button
                        type='submit'
                        className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-white p-3 md:py-5 px-12 flex items-center justify-center rounded-lg'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;