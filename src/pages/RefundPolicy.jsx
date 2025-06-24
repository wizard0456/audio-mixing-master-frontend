import { Link } from "react-router-dom";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";

const RefundPolicy = () => {
    return (
        <main>
            {/* Header Section */}
            <section className="relative top-0 mt-24">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[250%] left-0 pointer-events-none" width={1000} alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[150%] right-0 pointer-events-none" width={1000} alt="Purple Shadow Background" />
                </picture>
                <div className="relative z-20 top-0 text-white bg-[#0B1306] px-5 md:px-10 xl:px-0">
                    <div className='max-w-[1110px] mx-auto py-8'>
                        <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium'>Refund Policy</h1>
                        <p className='font-Roboto font-normal text-base md:text-base leading-6'>Understand our refund terms and conditions.</p>

                        <p className="font-DMSANS font-normal text-base mb-4">
                            Audiomixingmastering.com services are electronic non-tangible irrevocable goods.
                        </p>
                        <p className="font-DMSANS font-normal text-base mb-4">
                            We believe in keeping our customers happy. If you are unsatisfied with your results we are willing to make any small changes and adjustments free of charge. For bigger adjustments you will be able to use your Free Revision(s) or order a revision add-on (To find out which services include free revisions visit <Link to="/services" className="underline text-[#4CC800]">www.audiomixingmastering.com/store</Link>).
                        </p>
                        <p className="font-DMSANS font-normal text-base mb-4">
                            Unfortunately, we do not issue refunds once an order has been placed at <Link to="/" className="underline text-[#4CC800]">www.audiomixingmastering.com</Link>. However, we may issue credits for our services in the amount determined by us if a refund is requested. These credits can only be redeemed up to 5 days after being offered. As a customer, you are responsible for understanding this upon purchasing any service from us. By processing an order at <Link to="/" className="underline text-[#4CC800]">www.audiomixingmastering.com</Link>, you automatically agree to all of these terms listed. If you have any questions, please contact us and we will be happy to answer them for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Refund Policy Content */}
            <section className="relative text-white z-20 py-16 px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">

                </div>
            </section>
        </main>
    );
};

export default RefundPolicy;