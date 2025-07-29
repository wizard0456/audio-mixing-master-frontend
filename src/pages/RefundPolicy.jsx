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
                    </div>
                </div>
            </section>

            {/* Refund Policy Content */}
            <section className="relative text-white z-20 py-16 px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    <p className="font-DMSANS font-normal text-base mb-4">
                        At Audio Mixing Mastering, we are committed to providing you with high-quality services and ensuring that you are satisfied with the results of your audio mixing and mastering. However, since our services are electronic, non-tangible, and irrevocable, our refund policy has been established to maintain fairness for both our clients and our business.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Understanding Our Refund Policy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        We understand that sometimes, despite our best efforts, you might not be fully satisfied with the results. Our goal is to ensure that you are happy with the service you receive. Therefore, we offer the following terms to manage any concerns:
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">No Refunds on Completed Orders</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Once an order has been placed and payment is processed, we <strong>do not issue refunds</strong> for completed services. This is because our services are digital, non-tangible products, and we cannot retrieve or re-sell the audio files or work after the service has been completed.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Free Revisions for Small Adjustments</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        If you are not completely satisfied with the initial results, we are happy to make <strong>small adjustments free of charge</strong>. We are committed to ensuring that the final product meets your expectations, and we will work with you to make any reasonable changes needed to improve your project.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Larger Adjustments – Free Revisions or Add-ons</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        For larger revisions, you may use your <strong>free revision(s)</strong> (if included with your service package) or purchase an <strong>additional revision add-on</strong>. To find out which services include free revisions, please visit our <Link to="/select-services" className="underline text-[#4CC800]">store page</Link> for more details.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Credit Policy in Place of Refunds</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        In cases where a refund is requested, we <strong>do not issue direct refunds</strong>, but instead, we may issue <strong>credits</strong> for future services. The amount of credit issued is determined by us on a case-by-case basis and will be based on the nature of the request. These credits are valid for <strong>up to 5 days</strong> from the date they are offered. Once the 5-day period has passed, the credits will expire, and no further use of the credits will be allowed.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Responsibility of the Customer</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        As a customer, it is your responsibility to <strong>understand this policy before purchasing any service</strong> from us. By placing an order, you automatically agree to the terms and conditions outlined here, including the no-refund policy and the terms for revisions or credits.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Why We Have This Policy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        We understand that audio mixing and mastering are subjective services, and while we make every effort to deliver the highest quality work, opinions on final results may vary. Our policy helps maintain fairness and transparency, ensuring that both parties are aware of the expectations before and after the service is completed.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Contact Us for Any Questions</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        If you have any questions or concerns regarding this refund policy, revisions, or credits, we encourage you to <strong>contact us before placing an order</strong>. Our team is happy to address any issues or provide further clarification on our services, processes, and policies.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Final Agreement</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        By placing an order with Audio Mixing Mastering, you acknowledge that you have read, understood, and agreed to all terms and conditions outlined in this Refund Policy.
                    </p>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        We are dedicated to ensuring your satisfaction and look forward to delivering the best possible results for your project.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default RefundPolicy;