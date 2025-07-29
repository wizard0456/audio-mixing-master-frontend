import { useEffect } from "react";
import { Link } from "react-router-dom";
import LOGO from "../assets/images/logo.png";
import AppleDigitalMediaLogo from "../assets/images/apple-digital-media-logo.webp";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiSoundcloudLine } from "react-icons/ri";
import PaymentMethods from "../assets/images/payment-methods.webp";
import GreenShadowBG from "../assets/images/footer-bg-shadow.webp";

const Footer = () => {
    useEffect(() => {
        // Load the Facebook SDK
        if (!window.FB) {
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&&version=v11.0&appId=125801301406602&autoLogAppEvents=1";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        } else {
            window.FB.XFBML.parse();
        }
    }, []);

    return (
        <footer className="px-5 relative z-20 pb-12 md:px-10 xl:px-0">
            <picture>
                <source srcSet={GreenShadowBG} type="image/webp" />
                <img src={GreenShadowBG} className="absolute bottom-0 left-0 pointer-events-none" width={`100%`} alt="Green Shadow" />
            </picture>
            <div className="max-w-[1110px] mx-auto text-white flex items-stretch flex-col gap-10">
                <Link to="/">
                    <img src={LOGO} className="w-24 mx-auto" alt="Logo" />
                </Link>

                <h2 className="font-THICCCBOI-Bold text-4xl font-bold text-[#17A84E] text-center">AUDIO MIXING MASTERING</h2>

                <p className="text-center mx-auto font-Roboto font-normal text-base w-full sm:w-4/5 lg:w-2/5">
                    #1 Online Mixing and Mastering Services. Get high-end professional, speedy Online Mixing and Mastering Services
                </p>

                <div className="w-64 mx-auto flex flex-row items-center justify-between">
                    <Link to={"/mfit"}><img src={AppleDigitalMediaLogo} className="w-44" alt="Apple Digital Media Logo" /></Link>
                    <div className="flex flex-col items-stretch gap-2">
                        {/* Facebook Like and Share Button */}
                        <div id="fb-root"></div>
                        <div className="fb-like"
                            data-href="https://facebook.com/audiomixingmastering"
                            data-width=""
                            data-layout="box_count"
                            data-action="like"
                            data-size="small"
                            data-share="true">
                        </div>
                    </div>
                </div>

                <div className="max-w-[666px] mx-auto">
                    <ul className="flex items-center justify-center gap-y-5 gap-x-10 md:gap-10 flex-wrap md:flex-nowrap">
                        <li><Link to={`/upload`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">Upload</Link></li>
                        <li><Link to={`/select-services`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">Services</Link></li>
                        <li><Link to={`/samples`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">Samples</Link></li>
                        <li><Link to={`/about`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">About</Link></li>
                        <li><Link to={`/faq`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">FAQ</Link></li>
                        <li><Link to={`/reviews`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">Reviews</Link></li>
                        <li><Link to={`/contact`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">Contact</Link></li>
                        <li><Link to={`/blog`} className="font-Roboto font-normal text-base hover:text-[#4CC800]">Blog</Link></li>
                    </ul>
                </div>

                <div className="max-w-[333px] mx-auto">
                    <ul className="flex items-center justify-center gap-y-5 gap-x-10 md:gap-10 flex-wrap md:flex-nowrap">
                        <li><a href={`https://www.facebook.com/audiomixingmastering`} target="_blank" rel="noopener noreferrer" className="font-Roboto font-normal text-base"><FaFacebookF className="text-xl hover:text-green-500" /></a></li>
                        <li><a href={`https://twitter.com/ammsupport`} target="_blank" rel="noopener noreferrer" className="font-Roboto font-normal text-base"><FaXTwitter className="text-xl hover:text-green-500" /></a></li>
                        <li><a href={`https://www.instagram.com/audiomixingmastering`} target="_blank" rel="noopener noreferrer" className="font-Roboto font-normal text-base"><FaInstagram className="text-xl hover:text-green-500" /></a></li>
                        <li><a href={`https://www.linkedin.com/company/audiomixingmastering/`} target="_blank" rel="noopener noreferrer" className="font-Roboto font-normal text-base"><FaLinkedinIn className="text-xl hover:text-green-500" /></a></li>
                        <li><a href={`https://www.youtube.com/c/AudioMixingMastering`} target="_blank" rel="noopener noreferrer" className="font-Roboto font-normal text-base"><FaYoutube className="text-xl hover:text-green-500" /></a></li>
                        <li><a href={`https://soundcloud.com/mixingmastering`} target="_blank" rel="noopener noreferrer" className="font-Roboto font-normal text-base"><RiSoundcloudLine className="text-xl hover:text-green-500" /></a></li>
                    </ul>
                </div>

                <div className="max-w-[498px] mx-auto mb-5">
                    <Link to={`/`}><img src={PaymentMethods} className="w-full" alt="Payment Methods" /></Link>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center justify-between mb-5 gap-5 md:gap-0">
                    <a href="https://maps.app.goo.gl/ovDJJ63eU7v7Az6E9" target="_blank" rel="noopener noreferrer" className="font-Roboto font-normal text-base text-center md:text-left">Tesselschadestraat 27, Leeuwarden, Netherlands</a>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div className="font-Roboto font-normal text-base">E-Mail: <a href="mailto:support@audiomixingmastering.com">support@audiomixingmastering.com</a></div>
                        <div className="w-2 h-2 bg-white rounded-full hidden sm:block"></div>
                        <div className="font-Roboto font-normal text-base">Cell: <a href="tel:+31634038672">+31 (63) 403-8672</a></div>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-5 md:gap-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div><Link to={"/privacy-policy"} className="font-Roboto font-normal text-base">Privacy Policy</Link></div>
                        <div className="w-2 h-2 bg-white rounded-full hidden sm:block"></div>
                        <div><Link to={"/refund-policy"} className="font-Roboto font-normal text-base">Refund Policy</Link></div>
                        <div className="w-2 h-2 bg-white rounded-full hidden sm:block"></div>
                        <div><Link to={"/terms-and-conditions"} className="font-Roboto font-normal text-base">Terms & Conditions</Link></div>
                    </div>

                    <div><p className="font-Roboto font-normal text-base text-center sm:text-left">Audio Mixing Mastering LLC - ©2024 All Rights Reserved</p></div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;