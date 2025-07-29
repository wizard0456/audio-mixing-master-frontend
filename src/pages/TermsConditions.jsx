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
                    <p className="font-DMSANS font-normal text-base mb-4">
                        These Terms and Conditions ("Terms") govern your use of the website located at www.AudioMixingMastering.com ("Website") and the services offered by Audio Mixing Mastering LLC ("we," "our," "us"), including the provision of professional mixing and mastering services ("Services"). By accessing or using our Website and Services, you ("the Client" or "you") agree to comply with and be bound by these Terms. If you do not agree to these Terms, you must refrain from using our Website or Services.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">1. Introduction</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Audio Mixing Mastering provides professional audio mixing and mastering services to musicians, producers, and artists worldwide. By purchasing our Services or using our Website, you confirm that you have read, understood, and agreed to these Terms and Conditions. These Terms serve as a binding agreement between you and Audio Mixing Mastering.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">2. Service Overview</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Our Services allow you to have your songs professionally mixed and/or mastered by an experienced engineer. Once your project is completed, you will receive the final versions of your tracks via email, Dropbox, or a downloadable link on our Website. These Services are customized to meet the specific needs and preferences of each client.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">3. Information Protection and Privacy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        At Audio Mixing Mastering, we value your privacy and take necessary precautions to protect your personal and project information. We ensure that all sensitive data submitted to us, such as audio files, personal details (name, email, phone number, etc.), and other materials, are securely handled both online and offline. This includes encryption and firewalls to prevent unauthorized access.
                    </p>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        We do not use tracking cookies on our Website, and your personal data is safeguarded through physical, technical, and administrative security measures.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">4. Intellectual Property Rights</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        All content on our Website, including but not limited to the design, layout, audio files, graphics, and text, is either owned by Audio Mixing Mastering, licensed to us, or used with consent. Reproduction, distribution, or unauthorized use of any material from our Website is strictly prohibited and may result in legal action. Any violation may lead to claims for damages or criminal prosecution.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">5. Payment Terms</h2>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li><strong>Full Payment Required:</strong> Payment must be made in full before any work is initiated on your project.</li>
                        <li><strong>Accepted Payment Methods:</strong> We accept various forms of payment, including bank transfers, PayPal, iDeal, cryptocurrency, and credit/debit cards. <strong>Please note that we do not accept payments via Western Union</strong>.</li>
                        <li><strong>Payment Confirmation:</strong> Once payment is received and processed, work will commence on your project, and you will receive confirmation of your order.</li>
                    </ul>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">6. Audio Samples</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        We provide a selection of audio samples showcasing the quality of our mixing and mastering services. These samples reflect the customization made for previous clients and may differ from the final output of your project. Please be aware that while the samples provide a general overview of our work, the sound of your project will be based on your specific preferences and instructions.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">7. Uploading Materials</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Before submitting your project files for mixing or mastering, you are responsible for ensuring they meet our preparation guidelines. The quality of the materials you provide directly impacts the final results. As a client, you are responsible for the following:
                    </p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Ensuring the quality of recorded material.</li>
                        <li>Providing high-quality instrumental tracks (one-track or two-track).</li>
                        <li>Correctly preparing all materials for mastering.</li>
                        <li>Proper arrangement of vocals, instruments, and other elements.</li>
                        <li>Including all necessary audio files for the ordered service.</li>
                        <li>Submitting clear documentation with any notes and requests.</li>
                        <li>Ensuring accurate spelling for song titles, artist names, and credits.</li>
                        <li>Including your contact information and any additional requested data.</li>
                        <li>Providing cover art and ISRC codes (if applicable).</li>
                        <li>Confirming ownership and copyright for all uploaded material.</li>
                    </ul>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Failure to properly prepare or submit the required materials may result in delays or the inability to process your project as intended.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">8. Turnaround Time</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Turnaround times for our Services are estimates and may vary depending on the complexity of the project and the number of revisions required. All orders are processed on a <strong>first-come, first-served</strong> basis.
                    </p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li><strong>Mixing & Mastering:</strong> 72 to 120 hours</li>
                        <li><strong>Mastering Only:</strong> 24 to 72 hours</li>
                        <li><strong>Revisions:</strong> Typically 72 hours</li>
                        <li><strong>Radio Edits:</strong> 72 hours</li>
                    </ul>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Please note that turnaround times may be extended based on the project's needs. Rush delivery may be available upon request.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">9. Revisions Policy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Each mixing package includes a certain number of revisions, which are designed to address minor adjustments based on the initial mixing form. Revisions must be requested within <strong>5 business days</strong> after receiving the initial mix. After each revision, you will have <strong>2 additional days</strong> to request another revision. Once the 5-day revision period has passed, the project will be considered complete, and further changes will require a new revision order.
                    </p>
                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">What is Covered in Revisions:</h3>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Adjustments to instrument/vocal levels.</li>
                        <li>Minor changes to effects, such as reverb, delay, etc.</li>
                        <li>Adjustments to the original instructions from the mixing form.</li>
                    </ul>
                    <h3 className="font-THICCCBOI-Medium text-[24px] leading-[32px] font-medium mb-4">What is Not Covered in Revisions:</h3>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Adding new instructions or elements not mentioned in the original mixing form.</li>
                        <li>Major arrangement changes or structural modifications (e.g., creating new sections, adding drops).</li>
                        <li>New file submissions, such as new vocals or instrumental files.</li>
                    </ul>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">10. Mix & Master Approval</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Once you approve your final mix and master, no further changes will be made unless you incur additional fees. Approval signifies that you are satisfied with the work, and any additional requests will require new orders and payment.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">11. Radio Edits</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Radio edits are available with some of our packages, where explicit content is either muted or reversed. You can specify your preferred method for radio edits when submitting your project. If no preference is stated, our engineer will determine the most appropriate approach. Some words may need to be muted if reversing does not effectively remove the explicit content.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">12. Storage and Data Retention</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        After the completion of your project, all files will be deleted from our systems <strong>6 months</strong> after delivery. After this period, any further revisions, exports, or edits will require resubmission of your project files. We will not be able to provide revisions, radio edits, or new exports after this period unless you resubmit your materials.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">13. Sales and Discounts</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        From time to time, Audio Mixing Mastering may offer sales and discounts for our services. Please note that:
                    </p>
                    <ul className="font-DMSANS font-normal text-base list-disc ml-5 mb-4">
                        <li>Sales are <strong>final</strong>, and <strong>no refunds</strong> or credits will be issued for orders placed during a sale, even if the work is not completed.</li>
                        <li>Orders placed during a sale are processed on a <strong>first-come, first-served</strong> basis, and turnaround times may vary.</li>
                        <li>Rush delivery will not be discounted during a sale.</li>
                    </ul>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">14. Refund Policy</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Due to the nature of our services as digital, non-tangible products, <strong>we do not offer refunds</strong> once an order has been placed. However, we may issue <strong>credits</strong> for future services at our discretion. These credits must be redeemed within <strong>5 days</strong> from the time they are offered.
                    </p>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        If you are not satisfied with the results, we offer free revisions for minor adjustments based on your original instructions. If further revisions are required beyond the free revisions, you may purchase additional revisions at the prices listed on our Services & Pricing page.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">15. Client Responsibility</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        As a client, it is your responsibility to ensure that you have read and fully understood these Terms and Conditions and our Refund Policy before placing an order. We recommend reviewing our FAQ page to address any questions or concerns before submitting your project.
                    </p>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        By placing an order, you confirm that you have read and agreed to these Terms and Conditions and Refund Policy.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">16. Amendments to Terms</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Audio Mixing Mastering LLC reserves the right to amend or modify these Terms and Conditions at any time, without prior notice. The most current version of these Terms will always be available on our Website. It is your responsibility to review these Terms periodically to stay informed of any updates.
                    </p>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        For any questions or concerns, please contact us at <strong>support@audiomixingmastering.com</strong> or visit our website at <strong>www.AudioMixingMastering.com</strong>.
                    </p>

                    <h2 className="font-THICCCBOI-Medium text-[30px] leading-[40px] font-medium mb-4">Disclaimer</h2>
                    <p className="font-DMSANS font-normal text-base mb-4">
                        Some images on the website were taken during recording sessions at Wisseloord Studios. For recording services at Wisseloord or to book a session with one of our engineers, please contact us at <strong>info@audiomixingmastering.com</strong>.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default TermsConditions;
