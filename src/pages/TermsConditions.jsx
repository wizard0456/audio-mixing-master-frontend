import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";

const TermsConditions = () => {
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
                        <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium'>Terms & Conditions</h1>
                        <p className='font-Roboto font-normal text-base md:text-base leading-6'>Review our terms and conditions before using our services.</p>
                    </div>
                </div>
            </section>

            {/* Terms & Conditions Content */}
            <section className="relative text-white z-20 py-16 px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Our Terms & Conditions</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">By using our services, you agree to the following terms and conditions:</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Service Agreement</h3>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>All services are provided as &ldquo;as is&rdquo;, without any guarantees or warranty.</li>
                        <li>Our services are intended solely for the person or entity that has registered or paid for them.</li>
                        <li>Unauthorized use of our website may give rise to a claim for damages and/or be a criminal offense.</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">User Obligations</h3>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>You agree to provide accurate and current information about yourself as requested.</li>
                        <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                        <li>You agree not to use our services for any unlawful or prohibited activities.</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Intellectual Property</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">All content, including text, graphics, logos, images, and software, is the property of Audio Mixing Mastering or its content suppliers and is protected by copyright laws. You may not use, reproduce, or distribute any content without prior written permission.</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Limitation of Liability</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">In no event shall Audio Mixing Mastering be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services or the inability to use our services, even if we have been advised of the possibility of such damages.</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Governing Law</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of [Your Jurisdiction].</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Changes to Terms</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We reserve the right to make changes to these terms and conditions at any time. Any changes will be posted on this page, and it is your responsibility to review these terms regularly.</p>
                </div>
            </section>
        </main>
    );
};

export default TermsConditions;
