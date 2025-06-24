// import { useState, useEffect, useRef } from 'react';
// import WaveSurfer from 'wavesurfer.js';
// import { LiaItunesNote } from "react-icons/lia";
// import Audio from '../assets/audio/banner-music.mp3'; // Import your audio file

// const WaveformAudioPlayer = () => {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const waveformRef = useRef(null);
//     const waveSurfer = useRef(null);
//     const buttonRef = useRef(null);

//     useEffect(() => {
//         // Initialize WaveSurfer
//         waveSurfer.current = WaveSurfer.create({
//             container: waveformRef.current,
//             waveColor: 'rgba(74, 222, 128, 0.6)', // Light green waveform for the unplayed part
//             progressColor: '#34D399', // Green progress color for the played part
//             cursorColor: '#fff', // Cursor color
//             barWidth: 3, // Width of the bars in the waveform
//             barRadius: 2, // Rounded edges for bars
//             barGap: 2, // Spacing between bars
//             responsive: true, // Make the waveform responsive
//             height: window.innerWidth <= 640 ? 60 : 120, // Adjust height based on screen size
//             backend: 'MediaElement', // Use MediaElement for better compatibility
//         });

//         // Load the audio file
//         waveSurfer.current.load(Audio);

//         // Set initial overlay width when the waveform is ready
//         waveSurfer.current.on('ready', () => {
//             updateButtonPosition(0, waveSurfer.current.getDuration());
//         });

//         // Update overlay width and button position as audio progresses
//         waveSurfer.current.on('audioprocess', () => {
//             const currentTime = waveSurfer.current.getCurrentTime();
//             const duration = waveSurfer.current.getDuration();
//             updateButtonPosition(currentTime, duration);
//         });

//         // Update button position on seek
//         waveSurfer.current.on('seek', () => {
//             const currentTime = waveSurfer.current.getCurrentTime();
//             const duration = waveSurfer.current.getDuration();
//             updateButtonPosition(currentTime, duration);
//         });

//         // Cleanup on component unmount
//         return () => {
//             waveSurfer.current.destroy();
//         };
//     }, []);

//     const togglePlayPause = () => {
//         if (waveSurfer.current.isPlaying()) {
//             waveSurfer.current.pause();
//             setIsPlaying(false);
//         } else {
//             waveSurfer.current.play();
//             setIsPlaying(true);
//         }
//     };

//     const updateButtonPosition = (currentTime, duration) => {
//         const waveformWidth = waveformRef.current.clientWidth;
//         const progress = currentTime / duration;
//         const buttonWidth = buttonRef.current.clientWidth; // Get button's width

//         // Adjust positioning logic based on screen size
//         const offset = window.innerWidth <= 640 ? 20 : 25; // Smaller offset for mobile
//         const newPosition = waveformWidth * progress + offset - (buttonWidth / 2); // Center the button on the progress point

//         if (buttonRef.current) {
//             buttonRef.current.style.transform = `translateX(${newPosition}px)`;
//         }
//     };

//     return (
//         <div className="relative mt-4 sm:mt-8 flex flex-col items-center justify-center px-4 w-full lg:mx-10 xl:mx-0">
//             <div className='text-white font-Roboto italic text-base  absolute -top-10 left-0'>Before</div>
//             <div className='text-white font-Roboto italic text-base  absolute -top-10 right-0'>After</div>
//             <div className='center-wave-curser h-full w-[4px] bg-white absolute rounded-full right-1/2 translate-x-1/2'></div>
//             {/* Waveform container */}
//             <div
//                 className="relative w-full h-full"
//                 ref={waveformRef}
//             >
//                 {/* Waveform display */}
//                 <div className="absolute inset-0"></div>
//             </div>

//             {/* Play/Pause Button */}
//             <div
//                 ref={buttonRef}
//                 onClick={togglePlayPause}
//                 className='audio-wave-player-btn absolute -bottom-14 sm:bottom-[-60px] z-10 mt-4 bg-custom-gradient text-white rounded-full p-4 xl:px-6 lg:py-2 flex items-center space-x-2 focus:outline-none cursor-pointer transition-transform'
//                 style={{ left: '0px' }} // Initial position will be updated dynamically
//             >
//                 <LiaItunesNote />
//                 <span className="hidden lg:block">{isPlaying ? 'Pause Music' : 'Play Music'}</span>
//             </div>
//         </div>
//     );
// };

// export default WaveformAudioPlayer;


import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Audio from '../assets/audio/banner-music.mp3'; // Import your audio file
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';

const WaveformAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const waveformRef = useRef(null);
    const waveSurfer = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        // Initialize WaveSurfer
        waveSurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: 'rgba(74, 222, 128, 0.6)', // Light green waveform for the unplayed part
            progressColor: '#34D399', // Green progress color for the played part
            cursorColor: '#fff', // Cursor color
            barWidth: 3, // Width of the bars in the waveform
            barRadius: 2, // Rounded edges for bars
            barGap: 2, // Spacing between bars
            responsive: true, // Make the waveform responsive
            height: window.innerWidth <= 640 ? 60 : 120, // Adjust height based on screen size
            backend: 'MediaElement', // Use MediaElement for better compatibility
        });

        // Load the audio file
        waveSurfer.current.load(Audio);

        // Handle audio ending
        waveSurfer.current.on('finish', () => {
            setIsPlaying(false);
            waveSurfer.current.seekTo(0); // Reset to the beginning
        });

        // Cleanup on component unmount
        return () => {
            waveSurfer.current.destroy();
        };
    }, []);

    const togglePlayPause = () => {
        if (waveSurfer.current.isPlaying()) {
            waveSurfer.current.pause();
            setIsPlaying(false);
        } else {
            waveSurfer.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className='relative mt-8 flex items-center justify-center gap-3 px-4 w-full lg:mx-10 xl:mx-0'>
            {/* Play/Pause Button */}
            <button
                ref={buttonRef}
                onClick={togglePlayPause}
                className='bg-custom-gradient text-white rounded-full p-4 sm:p-5 md:p-6 flex items-center focus:outline-none cursor-pointer transition-transform  transition-all duration-300 ease-in-out active:scale-95'
            >
                {isPlaying ? <PauseIcon width={20} height={20} /> : <PlayIcon width={20} height={20} />}
            </button>
            <div className="relative w-full">
                <div className='text-white font-Roboto italic text-base absolute -top-10 left-5 sm:left-9 font-bold'>Before</div>
                <div className='text-white font-Roboto italic text-base absolute -top-10 right-5 sm:right-9 font-bold'>After</div>
                <div className='center-wave-curser h-[120%] w-[4px] bg-white absolute rounded-full right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 pointer-events-none'></div>

                {/* Waveform container */}
                <div
                    className="relative w-full h-full"
                    ref={waveformRef}
                >
                    {/* Waveform display */}
                    <div className="absolute inset-0"></div>
                </div>
            </div>
        </div>
    );
};

export default WaveformAudioPlayer;