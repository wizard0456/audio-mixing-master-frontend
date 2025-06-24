/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router-dom";

// Import Images
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";

function MFIT() {
    return (
        <main>
            <section className="mb-12 mt-24 relative top-0 z-20 text-white px-5 md:px-10 xl:px-0 overflow-x">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[400%] z-0 left-0 pointer-events-none" width={1000} alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[300%] z-0 right-0 pointer-events-none" width={1000} alt="Purple Shadow Background" />
                </picture>
                <div className="max-w-[1110px] mx-auto relative z-20 text-center">
                    <h1 className="font-semibold text-[40px] leading-[50px]">
                        What is <span className="text-[#4CC800]">Apple Digital Masters?</span>
                    </h1>
                </div>
            </section>


            {/* Information Section */}
            <section className="bg-[#0B1306] relative top-0 z-20 py-12 mb-24 text-white px-5 md:px-10 xl:px-0">
                <div className="max-w-[1110px] mx-auto">
                    <h2 className="text-4xl mb-8 font-semibold text-[#4CC800]">
                        Mastered for iTunes & Apple Digital Masters:
                    </h2>
                    <p className="text-base mb-8">
                        Having your song Mastered for iTunes gives you a product that has
                        been mastered and quality-tested for publication in iTunes. It lets
                        your listeners hear your music uncompressed and exactly the way it
                        sounds in the mastering studio before export, eliminating clipping
                        and inter-sample peaks. This means your listeners will be able to
                        stream and download your songs at the absolute highest quality
                        possible on iTunes. Not only will your songs sound great, but you
                        will also receive the &ldquo;Apple Digital Masters&rdquo; badge in iTunes which
                        makes your music stand out by letting the world know that they will
                        be purchasing the highest possible quality copy of your record.
                    </p>
                    <p className="text-base mb-8">
                        Audio Mixing Mastering LLC is a Certified Apple Digital Masters
                        Mastering House, approved by Apple Inc.
                    </p>

                    <h2 className="text-4xl font-semibold text-[#4CC800] mb-6">
                        Requirements:
                    </h2>
                    <p className="text-base mb-4">
                        Not just any song can be qualified for iTunes Mastering. Your
                        recordings must be in at least 24-bit uncompressed audio format,
                        such as 24-bit 96kHz sample rate *.wav format. You cannot upconvert
                        a lower bit rate and sample rate; if you do, iTunes will
                        automatically dismiss your submission. So if your song is already
                        completed and doesn&quot;t meet the requirements, you will have to go
                        with our industry-standard mastering, which will also give you a
                        great result. If you haven&quot;t started recording and want to have
                        your song(s) Mastered for iTunes, you will need to be using an audio
                        interface and DAW that supports at least 24-bit 96kHz sample rate.
                    </p>
                    <p className="text-base">
                        Note: Audio Mixing Mastering does not upload your Apple Digital
                        Masters to iTunes. You will need to use an approved encoding house
                        such as <Link to="https://cdbaby.com" target="_blank" rel="noopener noreferrer" className="text-green-500 underline">CDBaby</Link> and{" "}
                        <Link to="https://tunecore.com" target="_blank" rel="noopener noreferrer" className="text-green-500 underline">Tunecore</Link>.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default MFIT;