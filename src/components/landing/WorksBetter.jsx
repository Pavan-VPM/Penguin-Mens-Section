import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import visualImage from '../../assets/images/4e763288ab8491d0d9615d78c5fe14d46787af87.png';
import neonManImage from '../../assets/images/neon-man.png';
import trustImage from '../../assets/images/827f8c4b2d0b5ed2415a8ccad168bd1153ba9e76.png';
import clearFeeImage from '../../assets/images/6210c864a0c8b47a04136e9d2045bf9040f1fa38.png';
import arrowIcon from '../../assets/icons/lets-icons_arrow-down.svg';
import verifiedIcon from '../../assets/icons/material-symbols-light_verified.svg';
import pulseIcon from '../../assets/icons/pulse-icon.png';
import tagIcon from '../../assets/icons/tag-icon.png';

const ArrowSvg = ({ className, color }) => (
    <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M25.4298 16.7492L26.3617 17.6811L27.2936 16.7492L26.3617 15.8173L25.4298 16.7492ZM5.65796 15.4311C5.30838 15.4311 4.97311 15.57 4.72591 15.8172C4.47872 16.0644 4.33984 16.3996 4.33984 16.7492C4.33984 17.0988 4.47872 17.4341 4.72591 17.6813C4.97311 17.9285 5.30838 18.0673 5.65796 18.0673V15.4311ZM18.453 25.5898L26.3617 17.6811L24.4979 15.8173L16.5891 23.726L18.453 25.5898ZM26.3617 15.8173L18.453 7.90857L16.5891 9.7724L24.4979 17.6811L26.3617 15.8173ZM25.4298 15.4311H5.65796V18.0673H25.4298V15.4311Z" fill={color} />
    </svg>
);

const slides = [
    {
        theme: "purple",
        badge: "Only Verified Influencers",
        icon: verifiedIcon,
        title: "How PickyYourInfluencer",
        title2: "Works Better",
        subtitle: "(No bots. No inflated engagement)",
        description: "Every creator is vetted for authenticity, audience quality, and consistency.",
        image: visualImage,
        colors: {
            bg: "#843ED2",
            accent: "#BBFF88",
            text: "#BBFF88",
            badgeBg: "#B8EA55",
            badgeText: "black",
            arrow: "#BBFF88"
        }
    },
    {
        theme: "white",
        badge: "Performance You Can Measure",
        icon: pulseIcon,
        title: "How PickyYourInfluencer",
        title2: "Works Better",
        subtitle: "(Track reach, clicks, and conversions in real time)",
        description: "Marketing decisions based on evidence — not optimism.",
        image: neonManImage, // Blue light man
        colors: {
            bg: "#FFFFFF",
            accent: "#F7815B",
            text: "#F7815B",
            badgeBg: "#F7815B",
            badgeText: "black",
            arrow: "#F7815B"
        }
    },
    {
        theme: "purple",
        badge: "Payments You Can Trust",
        icon: verifiedIcon,
        title: "How PickyYourInfluencer",
        title2: "Works Better",
        subtitle: "(No bots. No inflated engagement)",
        description: "Released only when the work is delivered and approved.",
        image: trustImage, // Updated image
        colors: {
            bg: "#843ED2",
            accent: "#BBFF88",
            text: "#BBFF88",
            badgeBg: "#B8EA55",
            badgeText: "black",
            arrow: "#BBFF88"
        }
    },
    {
        theme: "white",
        badge: "One Clear Fee",
        icon: tagIcon,
        title: "How PickyYourInfluencer",
        title2: "Works Better",
        subtitle: "(Track reach, clicks, and conversions in real time)",
        description: "Marketing decisions based on evidence — not optimism.",
        image: clearFeeImage, // Updated image
        colors: {
            bg: "#FFFFFF",
            accent: "#F7815B",
            text: "#F7815B",
            badgeBg: "#F7815B",
            badgeText: "black",
            arrow: "#F7815B"
        }
    }
];

const WorksBetter = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [prevSlide, setPrevSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animType, setAnimType] = useState('open'); // 'open' or 'close'

    const handleSlideChange = (newIndex) => {
        if (isAnimating) return; // Prevent spamming

        // RULE: Odd Index (1, 3) -> Open
        //       Even Index (0, 2) -> Close
        const type = (newIndex % 2 !== 0) ? 'open' : 'close';
        setAnimType(type);

        setPrevSlide(activeSlide);
        setIsAnimating(true);
        setActiveSlide(newIndex);
        setTimeout(() => setIsAnimating(false), 500); // 500ms duration
    };

    const nextSlide = () => {
        handleSlideChange((activeSlide + 1) % slides.length);
    };

    const prevSlideFn = () => {
        handleSlideChange(activeSlide === 0 ? slides.length - 1 : activeSlide - 1);
    };

    // Safe accessors to prevent crashes
    const currentSlide = slides[activeSlide] || slides[0];
    const previousSlideData = slides[prevSlide] || slides[0];
    const currentColors = currentSlide.colors;

    return (
        <section
            className="pt-40 pb-20 overflow-hidden relative min-h-[800px] flex items-center transition-colors duration-500 ease-in-out"
            style={{ backgroundColor: currentColors.bg }}
        >
            <style>{`
                @keyframes slitTopOut {
                    from { transform: translateY(0); }
                    to { transform: translateY(-100%); }
                }
                @keyframes slitBottomOut {
                    from { transform: translateY(0); }
                    to { transform: translateY(100%); }
                }
                @keyframes slitTopIn {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
                @keyframes slitBottomIn {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>

            {/* Navigation Arrows - Moved to Section Level */}
            <button
                onClick={prevSlideFn}
                className="absolute left-4 md:left-10 top-[40%] -translate-y-1/2 hover:scale-110 transition-all duration-300 z-20"
                style={{ color: currentColors.arrow }}
            >
                <ArrowSvg className="w-16 h-16 md:w-24 md:h-24 rotate-180" color={currentColors.arrow} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-140 top-[40%] -translate-y-1/2 hover:scale-110 transition-all duration-300 z-20"
                style={{ color: currentColors.arrow }}
            >
                <ArrowSvg className="w-16 h-16 md:w-24 md:h-24" color={currentColors.arrow} />
            </button>

            {/* Main Container */}
            <div className="max-w-[85rem] mx-auto px-4 md:px-8 w-full relative z-10 text-center">

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Content */}
                    <div className="flex-1 space-y-10 relative z-10 pt-10 lg:pt-0">

                        {/* Wrapper for content alignment */}
                        <div className="flex flex-col items-center space-y-8">

                            {/* Badge */}
                            {activeSlide === 3 || activeSlide === 2 ? (
                                <div className="w-96 p-2.5 outline outline-2 outline-offset-[-2px] outline-black inline-flex justify-center items-center gap-2.5 transition-colors duration-500"
                                    style={{ backgroundColor: currentColors.badgeBg }}>
                                    <div className="size-6 relative overflow-hidden flex-shrink-0">
                                        <img src={currentSlide.icon} alt="Icon" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="text-center justify-start text-black text-2xl font-normal font-urbanist leading-none pt-1">
                                        {currentSlide.badge}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="inline-flex items-center gap-3 outline outline-2 outline-black outline-offset-[-2px] px-4 py-2 w-fit transition-colors duration-500"
                                    style={{ backgroundColor: currentColors.badgeBg }}
                                >
                                    <img src={currentSlide.icon} alt="Icon" className="w-6 h-6" />
                                    <span className="font-urbanist text-[20px] md:text-[23px] text-black font-normal leading-none pt-1">
                                        {currentSlide.badge}
                                    </span>
                                </div>
                            )}

                            {/* Title */}
                            <div className="space-y-2">
                                <h2
                                    className="font-freeman text-[36px] md:text-[48px] leading-tight transition-colors duration-500"
                                    style={{ color: currentColors.text }}
                                >
                                    {currentSlide.title} <br />
                                    {currentSlide.title2}
                                </h2>
                            </div>

                            {/* Subtitle & Description */}
                            <div className="space-y-6 max-w-2xl">
                                <p
                                    className="font-urbanist text-[24px] md:text-[30.32px] font-bold break-words transition-colors duration-500"
                                    style={{ color: currentColors.text }}
                                >
                                    {currentSlide.subtitle}
                                </p>
                                <p
                                    className="font-urbanist text-[24px] md:text-[30.32px] font-bold leading-normal break-words transition-colors duration-500"
                                    style={{ color: currentColors.text }}
                                >
                                    {currentSlide.description}
                                </p>
                            </div>
                            {/* CTA Button */}
                            <div className="pt-6 relative inline-flex justify-center">
                                {/* Dashed Border Container */}
                                <div
                                    className="absolute inset-0 top-6 -m-3 border bg-transparent rounded-full pointer-events-none transition-colors duration-500"
                                    style={{ borderColor: 'black', borderStyle: 'dashed' }} // Using style for dashed since Tailwind might need configuration for specific dash patterns, but standard dashed works.
                                ></div>

                                <button className="bg-[#090909] text-[#F7F3EA] px-8 py-4 rounded-full font-urbanist text-[18px] font-medium break-words shadow-md flex items-center gap-4 hover:bg-black/80 transition-all relative z-10">
                                    Start Your Campaign
                                    <img src={arrowIcon} alt="arrow" className="w-6 h-6 -rotate-90" />
                                </button>
                            </div>

                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center justify-center gap-4 mt-48">
                            {slides.map((_, index) => (
                                <div
                                    key={index}
                                    className="h-1.5 transition-all duration-300"
                                    style={{
                                        width: '10rem', // Increased width
                                        backgroundColor: index === activeSlide ? currentColors.accent : 'transparent',
                                        border: index !== activeSlide ? `1px solid ${currentSlide.theme === 'white' ? '#ddd' : 'rgba(255,255,255,0.3)'}` : 'none'
                                    }}
                                ></div>
                            ))}
                        </div>

                    </div>

                    {/* Right Image Area */}
                    <div className="flex-1 relative w-full max-w-md lg:-mt-24">

                        {/* Image Container */}
                        <div className="relative aspect-[2/3] overflow-hidden bg-white border-[4px] border-white shadow-xl transition-all duration-500">
                            {/* Background Image */}
                            {/* If Open: Old splits to reveal New (BG=New) */}
                            {/* If Close: New converges to cover Old (BG=Old) */}
                            <img
                                src={isAnimating
                                    ? (animType === 'open' ? currentSlide.image : previousSlideData.image)
                                    : currentSlide.image}
                                alt="Visual"
                                className="w-full h-full object-cover absolute inset-0 z-0"
                            />

                            {/* Slit Animation Overlay (The Curtain) */}
                            {isAnimating && (
                                <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
                                    {/* Top Half */}
                                    <div
                                        className="w-full h-1/2 overflow-hidden relative"
                                        style={{
                                            animation: `${animType === 'open' ? 'slitTopOut' : 'slitTopIn'} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                                        }}
                                    >
                                        <img
                                            src={animType === 'open' ? previousSlideData.image : currentSlide.image}
                                            className="absolute w-full max-h-none h-[200%] object-cover top-0"
                                            alt=""
                                        />
                                    </div>
                                    {/* Bottom Half */}
                                    <div
                                        className="w-full h-1/2 overflow-hidden relative"
                                        style={{
                                            animation: `${animType === 'open' ? 'slitBottomOut' : 'slitBottomIn'} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                                        }}
                                    >
                                        <img
                                            src={animType === 'open' ? previousSlideData.image : currentSlide.image}
                                            className="absolute w-full max-h-none h-[200%] object-cover bottom-0"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </section >
    );
};

export default WorksBetter;