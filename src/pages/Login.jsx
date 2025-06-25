import { useEffect, useLayoutEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import LOGO from "../assets/images/logo.png";
import loginBg from "../assets/images/login-bg.webp";
import purpleShadow from "../assets/images/purple-shadow-bg.webp";
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { API_ENDPOINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../reducers/authSlice";

const Login = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previousPage, setPreviousPage] = useState("");
    const [searchParams] = useSearchParams();

    useLayoutEffect(() => {
        const verify = searchParams.get("verified");
        if (verify == "1") {
            toast.success("Account verified successfully", {
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
        }
    }, [searchParams]);

    const onSubmit = async (userData) => {
        setIsLoading(true);

        try {
            const data = await axios.post(`${API_ENDPOINT}auth/login`, {
                email: userData.email,
                password: userData.password,
                role: "user"
            });

            if (!data.status == 200) {
                throw new Error(data.data.error);
            }

            toast.success("Login successful", {
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

            dispatch(addUser(data.data.token));
            reset();

            const redirectPath = sessionStorage.getItem('previousPage') || '/account';
            navigate(redirectPath, { replace: true });

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

    useEffect(() => {
        const currentPage = location.pathname;
        const lastStoredPage = sessionStorage.getItem('currentPage');

        if (lastStoredPage && lastStoredPage !== currentPage) {
            sessionStorage.setItem('previousPage', lastStoredPage);
        }

        setPreviousPage(sessionStorage.getItem('previousPage') || '/');
    }, []);

    return (
        <div className='w-full h-screen flex items-center justify-start text-black overflow-hidden'>
            <div className='absolute w-full h-full left-15 -z-10'>
                <picture className='relative'>
                    <source srcSet={loginBg} type="image/webp" />
                    <img src={loginBg} className='w-full h-full object-fill' alt="Login Background" />
                </picture>
                <img className='absolute -top-[50%] right-0 pointer-events-none' src={purpleShadow} alt="purpleShadow" />
            </div>

            <div className='w-full md:max-w-[600px] relative top-0 md:w-2/4 h-full bg-white flex flex-col justify-center gap-12 items-center p-5 sm:p-8 md:p-10'>
                <Link className='absolute top-5 md:top-10 left-5 md:left-10 w-8 h-8 rounded-full bg-black flex justify-center items-center' to={previousPage}>
                    <ArrowLeftIcon className='w-4 h-4 cursor-pointer text-white' />
                </Link>

                <div className='flex flex-col gap-3'>
                    <img src={LOGO} className='w-40' alt="Logo Icon" />
                    <h6 className='font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-center uppercase tracking-[.6em]'>Login</h6>
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
                            {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Invalid email address' } })}
                            className="w-full p-[15px] bg-[#EDEDED] text-black text-base leading-4 font-THICCCBOI-Regular font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
                    </div>
                    <div className='w-full flex flex-col gap-2 relative'>
                        <label className='font-THICCCBOI-SemiBold font-semibold text-base' htmlFor="password">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}  // Toggle between "password" and "text"
                            id="password"
                            placeholder="Enter Password"
                            {...register('password', { required: 'Password is required' })}
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
                    <Link to={"/forgot-password"} className='font-THICCCBOI-SemiBold font-semibold text-base text-right text-[#4BC500] underline'>Forgot Password?</Link>
                    <button type='submit' className='primary-gradient transition-all duration-300 ease-in-out active:scale-95 font-THICCCBOI-SemiBold font-semibold text-base leading-4 text-white p-3 md:py-5 px-12 flex items-center justify-center rounded-lg' disabled={isLoading}>{isLoading ? 'Loading...' : 'Login'}</button>
                </form>

                <div className='mt-5'>
                    <p className='font-THICCCBOI-Regular font-normal text-base leading-4'>Don&rsquo;t have an account? <Link to={`/signup`} className='font-THICCCBOI-SemiBold font-semibold text-[#4BC500] underline'>Register</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;