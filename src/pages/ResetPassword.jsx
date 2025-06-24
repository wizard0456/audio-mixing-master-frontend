import { useState } from "react";
import { useForm } from 'react-hook-form';
import LOGO from "../assets/images/logo.png";
import loginBg from "../assets/images/login-bg.webp";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { API_ENDPOINT } from "../utils/constants";

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        mode: "onSubmit",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const { email, token } = useParams();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // State to toggle confirm password visibility

    const validatePasswordsMatch = (value) => {
        return value == watch('password') || "Passwords do not match";
    };

    const onSubmit = async (userData) => {
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_ENDPOINT}auth/reset-password/${email}/${token}`, {
                password: userData.password,
                confirm_password: userData.confirmPassword,
            });

            if (response.status !== 200) {
                throw new Error(response.data.error);
            }

            toast.success("Password reset successfully", {
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

            navigate("/login", { replace: true });
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

                <div className='flex flex-col gap-3'>
                    <img src={LOGO} className='w-40' alt="Logo Icon" />
                    <h6 className='font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-center uppercase tracking-[.6em]'>Reset Password</h6>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                    <div className='w-full flex flex-col gap-2 relative'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="password">
                            New Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}  // Toggle between "password" and "text"
                            id="password"
                            placeholder="Enter New Password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Minimum length is 8 characters' },
                                maxLength: { value: 30, message: 'Maximum length is 30 characters' },
                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#+^(){}[\],.;:_-]{8,30}$/, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
                            })}
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.password && <span className='text-red-500'>{errors.password.message}</span>}

                        {/* Eye icon for toggling password visibility */}
                        <button
                            type="button"
                            className="absolute top-12 right-4"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeSlashIcon className="w-6 h-6 text-gray-500" /> : <EyeIcon className="w-6 h-6 text-gray-500" />}
                        </button>
                    </div>

                    <div className='w-full flex flex-col gap-2 relative'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}  // Toggle between "password" and "text"
                            id="confirmPassword"
                            placeholder="Confirm New Password"
                            {...register('confirmPassword', {
                                required: 'Confirmation is required',
                                validate: validatePasswordsMatch
                            })}
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.confirmPassword && <span className='text-red-500'>{errors.confirmPassword.message}</span>}

                        {/* Eye icon for toggling confirm password visibility */}
                        <button
                            type="button"
                            className="absolute top-12 right-4"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeSlashIcon className="w-6 h-6 text-gray-500" /> : <EyeIcon className="w-6 h-6 text-gray-500" />}
                        </button>
                    </div>

                    <button type='submit' className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-white p-3 md:py-5 px-12 flex items-center justify-center rounded-lg' disabled={isLoading}>{isLoading ? 'Loading...' : 'Reset Password'}</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;