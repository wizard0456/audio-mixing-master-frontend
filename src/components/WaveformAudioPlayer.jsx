import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Audio from '../assets/audio/banner-music.mp3'; // Import your audio file
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';

const DummyWave = () => {
    const [bars, setBars] = useState([]);

    useEffect(() => {
        // Generate random heights for bars to simulate waveform
        const generateBars = () => {
            const newBars = [];
            const numBars = window.innerWidth <= 640 ? 100 : 200; // Responsive number of bars

            for (let i = 0; i < numBars; i++) {
                const height = Math.random() * 80 + 20; // Random height between 20% and 100%
                newBars.push({
                    id: i,
                    height: height
                });
            }
            return newBars;
        };

        setBars(generateBars());

        // Update bars periodically to simulate loading
        const interval = setInterval(() => {
            setBars(generateBars());
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center h-16 sm:h-24 md:h-32 w-full overflow-hidden px-2 absolute top-0 right-0">
            {bars.map((bar, index) => (
                <div
                    key={bar.id}
                    className="bg-gradient-to-t from-green-500 to-green-300 opacity-60 rounded-sm mx-[1px] transition-all duration-1000 ease-in-out"
                    style={{
                        width: '3px',
                        height: `${bar.height}%`,
                        animationDelay: `${index * 0.02}s`
                    }}
                />
            ))}
        </div>
    );
};

const WaveformAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const waveformRef = useRef(null);
    const waveSurfer = useRef(null);
    const buttonRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

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

        // Hide the dummy wave when the actual wave is ready
        waveSurfer.current.on('ready', () => {
            setIsLoading(false);
        });

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
                disabled={isLoading}
                className={`bg-custom-gradient text-white rounded-full p-4 sm:p-5 md:p-6 flex items-center focus:outline-none transition-all duration-300 ease-in-out active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                {isLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                    isPlaying ? <PauseIcon width={20} height={20} /> : <PlayIcon width={20} height={20} />
                )}
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
                    {/* Dummy wave */}
                    {isLoading && <DummyWave />}

                    {/* Waveform display */}
                    <div className="absolute inset-0"></div>
                </div>
            </div>
        </div>
    );
};

export default WaveformAudioPlayer;