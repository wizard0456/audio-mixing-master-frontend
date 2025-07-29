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
                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Introduction</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">At Audio Mixing Mastering, we understand how important it is to safeguard the privacy and confidentiality of your personal and project data. As a provider of professional mixing and mastering services, we handle your information with the utmost respect and care. This Privacy Policy explains how we collect, use, store, and protect the personal and project-related data we receive from our clients. We are committed to maintaining the highest standards of privacy and security for your peace of mind.</p>
                    <p className="font-DMSANS font-normal text-base mb-4">By using our services, you agree to the terms outlined in this Privacy Policy. If you have any questions or concerns regarding this policy, please contact us directly.</p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Our Commitment to Your Privacy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">At Audio Mixing Mastering, protecting your privacy is a priority. We handle your personal data and project files in a secure and confidential manner. This Privacy Policy is designed to ensure transparency and give you confidence that your information is safe with us. Whether you are submitting a project for mixing, mastering, or requesting revisions, your data is treated with the highest level of confidentiality.</p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Information We Collect</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">To provide you with the best services and ensure smooth transactions, we collect the following types of information:</p>
                    
                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">1. Personal Information</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We may collect personal data such as:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Billing information (such as payment details)</li>
                        <li>Contact information</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">2. Project Files</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">As part of our mixing and mastering services, we receive files related to your projects. These files may include:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Audio files (stems, masters, etc.)</li>
                        <li>Project specifications and instructions</li>
                        <li>Any additional media or materials submitted for processing</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">3. Technical Data</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We may collect non-identifiable technical data including:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Device information</li>
                    </ul>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">4. Usage Data</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">Information on how you interact with our website, including:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Pages visited</li>
                        <li>Duration of visits</li>
                        <li>Links clicked</li>
                    </ul>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">How We Use Your Information</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">We collect and use your information for the following purposes:</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">1. To Provide and Improve Our Services</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We use the information you provide to deliver high-quality mixing and mastering services, as well as to enhance your overall experience with our website and services.</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">2. To Process Your Transactions</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We use personal information such as payment details to process your orders and transactions securely.</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">3. To Communicate with You</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We may contact you about your project, account updates, billing information, or service notifications, ensuring that you are always in the loop about your work and any important updates.</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">4. To Personalize Your Experience</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We may use your information to tailor our services and content to suit your needs, preferences, and interests.</p>

                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">5. For Customer Support</h3>
                    <p className="font-DMSANS font-normal text-base mb-4">We use your details to provide customer support, answer inquiries, and resolve any issues related to your services.</p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Our Commitment to Confidentiality</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">At Audio Mixing Mastering, we take confidentiality seriously. All files you submit to us for mixing and mastering are <strong>treated as high-level confidential information</strong>. Your project files, including audio stems, master files, and any associated data, will never be shared with any third parties without your explicit consent, except in the following rare circumstances:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li><strong>With Service Providers:</strong> We may need to share some information with trusted third-party service providers who assist us in delivering our services. These service providers are contractually obligated to maintain the confidentiality of your data.</li>
                        <li><strong>Legal Obligations:</strong> If required by law, such as to comply with a subpoena or other legal processes, we may disclose your data. However, this would be done only to the extent required by law.</li>
                        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our company or assets, your data may be transferred as part of the transaction, but we will notify you and ensure that your data remains protected.</li>
                    </ul>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Data Storage and Retention</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">We store your personal information and project files securely for the duration of the time it is necessary to fulfill the service requested. Once the project is completed, and after the final files have been delivered, your project files and associated data will be stored for up to <strong>6 months</strong> to allow for any necessary revisions or follow-up work.</p>
                    <p className="font-DMSANS font-normal text-base mb-4">After the 6-month period, all project-related files will be <strong>permanently deleted</strong> from our systems to ensure the security and confidentiality of your data.</p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Your Rights</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">You have the following rights regarding your personal data:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li><strong>Access:</strong> You may request a copy of the personal data we hold about you at any time.</li>
                        <li><strong>Correction:</strong> If you believe any of your personal information is incorrect or incomplete, you have the right to request a correction.</li>
                        <li><strong>Deletion:</strong> You may request the deletion of your personal data. However, please note that this may affect your ability to use certain services, such as tracking your orders or making further requests.</li>
                        <li><strong>Data Portability:</strong> You have the right to request that your personal data be transferred to another service provider, if applicable.</li>
                        <li><strong>Withdrawal of Consent:</strong> If we rely on your consent to process your personal data, you may withdraw that consent at any time, although this will not affect the legality of any processing done before the withdrawal.</li>
                    </ul>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Security of Your Information</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">We implement industry-standard security measures to protect your data from unauthorized access, loss, or alteration. While we make every effort to ensure the security of your information, please be aware that no method of data transmission over the internet or method of electronic storage is 100% secure.</p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Changes to This Privacy Policy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes to this Privacy Policy will be posted on this page, and the effective date will be updated accordingly.</p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Contact Us</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">If you have any questions or concerns regarding this Privacy Policy or how your data is handled, please feel free to contact us:</p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Email: support@audiomixingmastering.com</li>
                        <li><a href="tel:+31634038672">+31 (63) 403-8672</a></li>
                        <li>Address: Tesselschadestraat 27, Leeuwarden, Netherlands, 8913 HA</li>
                    </ul>
                    <p className="font-DMSANS font-normal text-base mb-4">By using our services, you agree to the terms outlined in this Privacy Policy. We are committed to respecting and protecting your privacy while delivering excellent mixing and mastering services.</p>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;