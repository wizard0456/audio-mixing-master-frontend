import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_ENDPOINT } from '../utils/constants';
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

export default function EmailVerification() {
    const { userId, token } = useParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        const verifyEmail = async () => {
            // Cancel any existing request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            
            // Create new abort controller
            abortControllerRef.current = new AbortController();
            
            try {
                setLoading(true);
                setVerificationStatus('verifying');
                
                const response = await axios.get(`${API_ENDPOINT}auth/verify-email/${userId}/${token}`, {
                    signal: abortControllerRef.current.signal
                });
                
                if (response.data.success) {
                    setVerificationStatus('success');
                    setMessage(response.data.message || 'Email verified successfully! You can now log in to your account.');
                    
                    // Redirect to login page after 3 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setVerificationStatus('error');
                    setMessage(response.data.message || 'Email verification failed. Please try again.');
                }
            } catch (error) {
                // Don't handle errors if request was aborted
                if (error.name === 'AbortError') {
                    return;
                }
                
                console.error('Email verification error:', error);
                setVerificationStatus('error');
                
                if (error.response) {
                    // Server responded with error status
                    setMessage(error.response.data.message || 'Email verification failed. The link may be invalid or expired.');
                } else if (error.request) {
                    // Network error
                    setMessage('Network error. Please check your internet connection and try again.');
                } else {
                    // Other error
                    setMessage('An unexpected error occurred. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            verifyEmail();
        } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link. Please check your email for the correct link.');
            setLoading(false);
        }

        // Cleanup function to abort any pending request
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [userId, token, navigate]);

    const getStatusIcon = () => {
        switch (verificationStatus) {
            case 'success':
                return <CheckCircleIcon className="w-16 h-16 text-green-500" />;
            case 'error':
                return <XCircleIcon className="w-16 h-16 text-red-500" />;
            default:
                return <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 animate-pulse" />;
        }
    };

    const getStatusTitle = () => {
        switch (verificationStatus) {
            case 'success':
                return 'Email Verified Successfully!';
            case 'error':
                return 'Verification Failed';
            default:
                return 'Verifying Your Email...';
        }
    };

    const getStatusColor = () => {
        switch (verificationStatus) {
            case 'success':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-yellow-500';
        }
    };

    return (
        <main className='mt-24'>
            <section className="text-white relative z-20 mb-24 px-5 md:px-10 xl:px-0">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-full left-0 pointer-events-none" alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-3/4 right-0 pointer-events-none" alt="Purple Shadow Background" />
                </picture>
                
                <div className="max-w-[600px] relative z-20 mx-auto">
                    <div className="bg-[#0B1306] rounded-[30px] p-8 md:p-12 text-center">
                        {/* Status Icon */}
                        <div className="flex justify-center mb-6">
                            {getStatusIcon()}
                        </div>

                        {/* Status Title */}
                        <h1 className={`font-THICCCBOI-Medium text-2xl md:text-3xl mb-6 ${getStatusColor()}`}>
                            {getStatusTitle()}
                        </h1>

                        {/* Loading Animation */}
                        {loading && (
                            <div className="mb-6">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CC800]"></div>
                                <p className="text-gray-300 mt-2">Verifying your email address...</p>
                            </div>
                        )}

                        {/* Message */}
                        {message && (
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                {message}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {verificationStatus === 'success' && (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-8 py-3 bg-[#4DC801] text-white rounded-full font-Montserrat font-medium hover:bg-[#3ba001] transition-colors duration-300"
                                    >
                                        Go to Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="px-8 py-3 bg-transparent border border-[#4DC801] text-[#4DC801] rounded-full font-Montserrat font-medium hover:bg-[#4DC801] hover:text-white transition-colors duration-300"
                                    >
                                        Go to Home
                                    </button>
                                </>
                            )}

                            {verificationStatus === 'error' && (
                                <>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="px-8 py-3 bg-[#4DC801] text-white rounded-full font-Montserrat font-medium hover:bg-[#3ba001] transition-colors duration-300"
                                    >
                                        Sign Up Again
                                    </button>
                                    <button
                                        onClick={() => navigate('/contact')}
                                        className="px-8 py-3 bg-transparent border border-[#4DC801] text-[#4DC801] rounded-full font-Montserrat font-medium hover:bg-[#4DC801] hover:text-white transition-colors duration-300"
                                    >
                                        Contact Support
                                    </button>
                                </>
                            )}

                            {verificationStatus === 'verifying' && !loading && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-3 bg-[#4DC801] text-white rounded-full font-Montserrat font-medium hover:bg-[#3ba001] transition-colors duration-300"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>

                        {/* Additional Help */}
                        {verificationStatus === 'error' && (
                            <div className="mt-8 p-4 bg-black bg-opacity-50 rounded-[15px]">
                                <h3 className="font-THICCCBOI-Medium text-lg mb-3">Need Help?</h3>
                                <ul className="text-sm text-gray-300 space-y-2 text-left">
                                    <li>• Check if the verification link is complete and not broken</li>
                                    <li>• Make sure you're using the link from your email</li>
                                    <li>• Try signing up again if the link has expired</li>
                                    <li>• Contact our support team for assistance</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
} 