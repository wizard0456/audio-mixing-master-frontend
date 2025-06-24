import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAudio } from '../reducers/audioSlice';
import WhiteCircleBg from '../assets/images/audio-card-white-bg.png';
import GreenCircleBg from '../assets/images/audio-card-green-bg.png';

const PlayIcon = ({ width, height, fill }) => (
    <svg width={width} height={height} viewBox="0 0 24 24">
        <path fill={fill} d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = ({ width, height, fill }) => (
    <svg width={width} height={height} viewBox="0 0 24 24">
        <path fill={fill} d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

export default function AudioPlayer({ beforeAudioSrc, beforeAudioName, afterAudioSrc, afterAudioName, id }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('before');
    const audioBeforeRef = useRef(null);
    const audioAfterRef = useRef(null);
    const progressBarRef = useRef(null);
    const loadedBarRef = useRef(null);
    const playerRef = useRef(null);
    const dispatch = useDispatch();
    const currentAudioId = useSelector((state) => state.audio.currentAudioId);

    const togglePlayPause = () => {
        if (isLoading) return;

        if (currentAudioId !== id) {
            dispatch(setCurrentAudio(id));
        }

        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        const audio = activeTab == 'before' ? audioBeforeRef.current : audioAfterRef.current;
        if (!prevValue) {
            audio.play();
        } else {
            audio.pause();
        }
    };

    useEffect(() => {
        if (currentAudioId !== id) {
            audioBeforeRef.current.pause();
            audioAfterRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentAudioId, id]);

    useEffect(() => {
        const audioBefore = audioBeforeRef.current;
        const audioAfter = audioAfterRef.current;

        const updateTime = (audio) => {
            setCurrentTime(audio.currentTime);
            if (progressBarRef.current) {
                progressBarRef.current.style.width = `${Math.min((audio.currentTime / duration) * 98, 98)}%`;
            }
        };

        const updateDuration = (audio) => {
            setDuration(audio.duration);
            setIsLoading(false);
        };

        const updateBuffer = (audio) => {
            const buffered = audio.buffered;
            if (buffered.length) {
                const bufferedEnd = buffered.end(buffered.length - 1);
                if (loadedBarRef.current) {
                    loadedBarRef.current.style.width = `${Math.min((bufferedEnd / duration) * 98, 98)}%`;
                }
            }
        };

        const handleAudioEnded = () => {
            setIsPlaying(false);
        };

        const setEventListeners = (audio) => {
            audio.addEventListener('timeupdate', () => updateTime(audio));
            audio.addEventListener('loadedmetadata', () => updateDuration(audio));
            audio.addEventListener('progress', () => updateBuffer(audio));
            audio.addEventListener('ended', handleAudioEnded);
        };

        setEventListeners(audioBefore);
        setEventListeners(audioAfter);

        return () => {
            audioBefore.removeEventListener('timeupdate', () => updateTime(audioBefore));
            audioBefore.removeEventListener('loadedmetadata', () => updateDuration(audioBefore));
            audioBefore.removeEventListener('progress', () => updateBuffer(audioBefore));
            audioBefore.removeEventListener('ended', handleAudioEnded);
            audioAfter.removeEventListener('timeupdate', () => updateTime(audioAfter));
            audioAfter.removeEventListener('loadedmetadata', () => updateDuration(audioAfter));
            audioAfter.removeEventListener('progress', () => updateBuffer(audioAfter));
            audioAfter.removeEventListener('ended', handleAudioEnded);
        };
    }, [duration]);

    const handleProgressClick = (e) => {
        const width = progressBarRef.current.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const newTime = (clickX / width) * duration;
        const audio = activeTab == 'before' ? audioBeforeRef.current : audioAfterRef.current;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleTabClick = (tab) => {
        if (tab !== activeTab) {
            const currentAudio = activeTab == 'before' ? audioBeforeRef.current : audioAfterRef.current;
            const newAudio = tab == 'before' ? audioBeforeRef.current : audioAfterRef.current;
            const currentTime = currentAudio.currentTime;

            setActiveTab(tab);
            if (isPlaying) {
                currentAudio.pause();
                newAudio.currentTime = currentTime;
                newAudio.play();
            } else {
                newAudio.currentTime = currentTime;
            }

            setCurrentTime(currentTime);
            setIsLoading(false);
        }
    };

    return (
        <div ref={playerRef} className="rounded-lg p-5 w-full text-white secondary-gradient relative overflow-hidden">
            <picture>
                <source srcSet={WhiteCircleBg} type="image/png" />
                <img src={WhiteCircleBg} className='absolute top-[-5px] right-0 z-0' alt="White CircleBg" />
            </picture>
            <picture>
                <source srcSet={GreenCircleBg} type="image/png" />
                <img src={GreenCircleBg} className='absolute top-[-5px] left-0 z-0' alt="Green CircleBg" />
            </picture>

            <div className="flex justify-between items-center mb-4 relative z-10 gap-3">
                <h2 className="text-sm sm:text-base md:text-xl font-bold font-DMSans leading-8">{activeTab == 'before' ? beforeAudioName : afterAudioName}</h2>
                <div className="flex gap-4 rounded-[20px] bg-[#0A0A0A] border border-[#535353] p-2 md:p-[10px]">
                    <button
                        className={`px-3 md:px-5 py-2 md:py-3 rounded-xl font-bold font-DMSans text-sm md:text-base leading-5 ${activeTab == 'before' ? 'bg-[#4DC801] text-white' : 'bg-transparent text-white'}`}
                        onClick={() => handleTabClick('before')}
                    >
                        Before
                    </button>
                    <button
                        className={`px-3 md:px-5 py-2 md:py-3 rounded-xl font-bold font-DMSans text-sm md:text-base leading-5 ${activeTab == 'after' ? 'bg-[#4DC801] text-white' : 'bg-transparent text-white'}`}
                        onClick={() => handleTabClick('after')}
                    >
                        After
                    </button>
                </div>
            </div>
            <div className="flex items-center bg-[#202020] p-[10px] pr-4 rounded-[30px] relative z-10">
                <button
                    onClick={togglePlayPause}
                    className="bg-[#4DC801] w-7 h-7 rounded-full text-white mr-4 flex items-center justify-center"
                >
                    {isLoading ? <div className="loader"></div> : isPlaying ? <PauseIcon width={20} height={20} fill="white" /> : <PlayIcon width={20} height={20} fill="white" />}
                </button>
                <div
                    className="relative flex-1 h-[3px] bg-gray-700 rounded cursor-pointer"
                    onClick={handleProgressClick}
                    ref={progressBarRef}
                >
                    <div
                        ref={loadedBarRef}
                        className="absolute h-full bg-gray-500 rounded"
                        style={{ width: '0%' }}
                    ></div>
                    <div
                        className="absolute h-full bg-green-100 rounded"
                        style={{ width: `${Math.min((currentTime / duration) * 98, 98)}%` }}
                    ></div>
                    <div
                        className="absolute h-3 w-3 bg-green-100 rounded-full top-1/2 transform -translate-y-1/2 cursor-pointer"
                        style={{ left: `${Math.min((currentTime / duration) * 98, 98)}%` }}
                    ></div>
                </div>
                <audio ref={audioBeforeRef} src={beforeAudioSrc} />
                <audio ref={audioAfterRef} src={afterAudioSrc} />
            </div>
        </div>
    );
}

PlayIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    fill: PropTypes.string,
};

PauseIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    fill: PropTypes.string,
};

AudioPlayer.propTypes = {
    beforeAudioSrc: PropTypes.string,
    afterAudioSrc: PropTypes.string,
    beforeAudioName: PropTypes.string,
    afterAudioName: PropTypes.string,
    id: PropTypes.string.isRequired, // Add id prop type
};