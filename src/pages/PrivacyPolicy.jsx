import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";

const PrivacyPolicy = () => {
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
                        <h1 className='font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium'>Privacy Policy</h1>
                        <p className='font-Roboto font-normal text-base md:text-base leading-6'>Learn how we handle your personal data.</p>
                    </div>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="relative text-white z-20 py-16 px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Our Commitment to Your Privacy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">At Audio Mixing Mastering, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you how we handle your personal information, including how we collect, use, and store it.</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Information We Collect</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We may collect the following types of information from you:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li><strong>Personal Information:</strong> Such as your name, email address, and payment information.</li>
                        <li><strong>Technical Data:</strong> This includes your IP address, browser type, and operating system.</li>
                        <li><strong>Usage Data:</strong> Information on how you use our website and services.</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">How We Use Your Information</h3>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>To provide and improve our services, ensuring you get the best experience.</li>
                        <li>To process your transactions and manage your orders.</li>
                        <li>To communicate with you about your account, transactions, or services.</li>
                        <li>To personalize your experience and to deliver content and product offerings relevant to your interests.</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Sharing Your Information</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We do not share your personal data with third parties except in the following circumstances:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>With service providers who assist us in operating our website and providing our services, so long as those parties agree to keep this information confidential.</li>
                        <li>To comply with legal obligations, such as responding to a subpoena or other legal process.</li>
                        <li>In the event of a merger, acquisition, or sale of all or a portion of our assets.</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">Your Rights</h3>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li><strong>Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
                        <li><strong>Correction:</strong> You can ask us to correct any inaccuracies in your personal data.</li>
                        <li><strong>Deletion:</strong> You can request that we delete your personal data, though this may affect your ability to use our services.</li>
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;