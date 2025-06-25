import { useState } from 'react';
import { useForm } from 'react-hook-form';
import LOGO from "../assets/images/logo.png";
import signupBg from "../assets/images/home-3.webp";
import purpleShadow from "../assets/images/purple-shadow-bg.webp" 
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importing eye icons for show/hide password
import { API_ENDPOINT } from '../utils/constants';
import { toast, Slide } from "react-toastify";
import axios from 'axios';

const Signup = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        mode: "onSubmit"
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);  // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (formData) => {
        setIsLoading(true);

        try {
            const { data, status } = await axios({
                method: "POST",
                url: `${API_ENDPOINT}auth/register`,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                data: formData,
            });

            if (status !== 200) {
                throw new Error(data.error);
            }

            toast.success(data.message, {
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

            reset();
        } catch (error) {
            toast.error(error.response?.data?.error || error.message, {
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
        <div className='w-full h-screen flex items-center justify-start text-black overflow-hidden'>
            <div className='absolute w-full h-full right-0 -z-10'>
                <picture className='relative'>
                    <source srcSet={signupBg} type="image/webp" />
                    <img src={signupBg} className='w-full h-full object-fill' alt="Login Background" />
                </picture>
                <img className='absolute -top-[50%] right-0 pointer-events-none' src={purpleShadow} alt="purpleShadow" />
            </div>

            <div className='w-full md:max-w-[600px] relative top-0 md:w-2/4 h-full bg-white flex flex-col justify-center gap-12 items-center p-5 sm:p-8 md:p-10'>
                <Link className='absolute top-5 md:top-10 left-5 md:left-10 w-8 h-8 rounded-full bg-black flex justify-center items-center' to={"/"}>
                    <ArrowLeftIcon className='w-4 h-4 cursor-pointer text-white' />
                </Link>

                <div className='flex flex-col gap-3'>
                    <img src={LOGO} alt="Logo Icon" />
                    <h6 className='font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-center uppercase tracking-[.6em]'>Signup</h6>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                    {/* First Name and Last Name */}
                    <div className="w-full flex gap-5">
                        <div className='w-full flex flex-col gap-2'>
                            <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="first-name">
                                First Name
                            </label>
                            <input
                                type="text"
                                id='first-name'
                                placeholder="Enter First Name"
                                {...register('first_name', { required: 'First name is required', maxLength: { value: 255, message: 'Maximum length is 255 characters' } })}
                                className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.first_name && <span className='text-red-500'>{errors.first_name.message}</span>}
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="last-name">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id='last-name'
                                placeholder="Enter Last Name"
                                {...register('last_name', { required: 'Last name is required', maxLength: { value: 255, message: 'Maximum length is 255 characters' } })}
                                className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.last_name && <span className='text-red-500'>{errors.last_name.message}</span>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className='w-full flex flex-col gap-2'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email Address"
                            {...register('email', {
                                required: 'Email is required',
                                maxLength: { value: 255, message: 'Maximum length is 255 characters' },
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
                    </div>

                    {/* Phone */}
                    <div className='w-full flex flex-col gap-2'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="phone">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            placeholder="Enter Phone Number"
                            {...register('phone_number', { required: 'Phone number is required' })}
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.phone_number && <span className='text-red-500'>{errors.phone_number.message}</span>}
                    </div>

                    {/* Password */}
                    <div className='w-full flex flex-col gap-2 relative'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="password">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}  // Toggle between text and password
                            id="password"
                            placeholder="Enter Password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Minimum length is 8 characters' },
                                maxLength: { value: 30, message: 'Maximum length is 30 characters' },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#+^(){}[\],.;:_-]{8,30}$/,
                                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and be 8 to 30 characters long'
                                }
                            })}
                            autoComplete="new-password"
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <span className="absolute right-4 top-12 cursor-pointer" onClick={togglePasswordVisibility}>
                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </span>
                        {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className='w-full flex flex-col gap-2 relative'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="confirm_password">
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}  // Toggle between text and password
                            id="confirm_password"
                            placeholder="Enter Confirm Password"
                            {...register('confirm_password', {
                                required: 'Confirm password is required',
                                validate: (value) => value == watch('password') || 'Passwords do not match'
                            })}
                            autoComplete="new-password"
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <span className="absolute right-4 top-12 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </span>
                        {errors.confirm_password && <span className='text-red-500'>{errors.confirm_password.message}</span>}
                    </div>

                    {/* Register Button */}
                    <button type='submit' className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-white p-3 md:py-5 px-12 flex items-center justify-center rounded-lg' disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className='mt-5'>
                    <p className='font-THICCCBOI-Regular font-normal text-base leading-4'>Already Have an Account? <Link to={"/login"} className='font-THICCCBOI-SemiBold font-semibold text-[#4BC500] underline'>Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;