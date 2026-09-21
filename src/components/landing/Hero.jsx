import React from 'react';
import { ArrowRight } from 'lucide-react';
import trustBadge from '../../assets/images/trust-badge.png';

import vid1 from '../../assets/videos/PYI-video 1.mp4';
import vid1Poster from '../../assets/videos/PYI-video 1.jpg';
import vid7 from '../../assets/videos/PYI-video 7.mp4';
import vid7Poster from '../../assets/videos/PYI-video 7.jpg';
import vid8 from '../../assets/videos/PYI-video 8.mp4';
import vid8Poster from '../../assets/videos/PYI-video 8.jpg';
import vid10 from '../../assets/videos/PYI-video 10.mp4';
import vid10Poster from '../../assets/videos/PYI-video 10.jpg';
import vid11 from '../../assets/videos/PYI-video 11.mp4';
import vid11Poster from '../../assets/videos/PYI-video 11.jpg';
import vid12 from '../../assets/videos/PYI-video 12.mp4';
import vid12Poster from '../../assets/videos/PYI-video 12.jpg';
import vid9 from '../../assets/videos/PYI-video 9.mp4';
import vid9Poster from '../../assets/videos/PYI-video 9.jpg';

const Hero = () => {
    // Video Assets with instant-load thumbnail posters
    const videoAssets = [
        { src: vid1, poster: vid1Poster },
        { src: vid7, poster: vid7Poster },
        { src: vid8, poster: vid8Poster },
        { src: vid10, poster: vid10Poster },
        { src: vid11, poster: vid11Poster },
        { src: vid12, poster: vid12Poster },
        { src: vid9, poster: vid9Poster }
    ];

    // 2x duplication is mathematically sufficient for smooth infinite marquee without memory overload
    const videos = [...videoAssets, ...videoAssets];

    return (
        <section className="relative flex flex-col items-center min-h-[calc(100vh-120px)] pt-0 px-4 text-center bg-brand-yellow overflow-hidden">
            {/* ... other code ... */}

            {/* Animation Styles */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 16s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>


            {/* Trusted Badge */}
            <div className="flex flex-col items-center gap-6 mb-2 mt-0 relative z-20">
                <div className="inline-flex items-center gap-2">
                    <img src={trustBadge} alt="Trusted" className="w-6 h-6 object-contain" />
                    <div className="text-[15px] font-urbanist text-[#090909]">
                        <span className="font-bold">10,000+ Happy Customers | </span>
                        <span className="font-normal">Premium Men's Fashion Since 2018</span>
                    </div>
                </div>
            </div>

            {/* Main Headline */}
            <h1 className="relative z-20 text-[40px] leading-[48px] md:text-[50px] md:leading-[60px] font-freeman font-normal text-black break-words max-w-5xl mb-2">
                Dress Sharp. Live Bold.<br />
                Penguin Men's Section
            </h1>

            {/* Subheadline */}
            <p className="relative z-20 text-[15px] font-urbanist font-normal text-black max-w-3xl mb-4">
                Curated men's fashion — from casual fits to power suits.<br />Style that speaks before you do.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 relative z-20 mt-8 md:mt-12 translate-y-[50px] md:translate-y-[300px]">
                {/* Shop Now */}
                <div className="relative group cursor-pointer">
                    {/* Dashed Outline */}
                    <div className="absolute -inset-2 border border-dashed border-black/50 rounded-full pointer-events-none" />


                    <div className="relative flex items-center justify-between gap-4 px-6 py-3 bg-[#090909] rounded-full text-[#F7F3EA] font-urbanist font-medium text-base min-w-[170px] shadow-[3px_2px_7px_rgba(102,0,255,0.10)] translate-y-0">
                        <span>Shop New Arrivals</span>
                        <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* View Collections */}
                <div className="relative group cursor-pointer">
                    {/* Dashed Outline */}
                    <div className="absolute -inset-2 border border-dashed border-black/50 rounded-full pointer-events-none" />


                    <div className="relative flex items-center justify-between gap-4 px-6 py-3 bg-transparent border border-black rounded-full text-black font-urbanist font-medium text-base min-w-[170px] hover:bg-black/5 transition-colors translate-y-0">
                        <span>View Collections</span>
                        <ArrowRight className="w-5 h-5 text-black" />
                    </div>
                </div>
            </div>

            {/* Floating Elements - Adjusted positions for responsiveness */}

            {/* Free Delivery - Left side */}
            <div className="absolute left-[5%] xl:left-[10%] top-[15%] hidden lg:block animate-float-delayed z-20">
                <div className="relative">
                    <div className="bg-brand-purple text-white px-6 py-3 rounded-full font-inter font-normal text-lg relative z-10 shadow-lg rotate-[-0deg]">
                        Free Delivery
                    </div>
                    {/* Purple Cursor SVG */}
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-7 -right-4 w-8 h-8 rotate-180 z-20 text-brand-purple fill-current">
                        <path d="M5.5 3.5L10.5 21.5L13.5 13.5L21.5 10.5L5.5 3.5Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Easy Returns - Right side */}
            <div className="absolute right-[5%] xl:right-[12%] top-[75%] hidden lg:block animate-float z-20">
                <div className="relative">
                    <div className="bg-brand-red text-white px-6 py-3 rounded-full font-poppins font-normal text-lg relative z-10 shadow-lg rotate-[0deg] origin-left">
                        Easy Returns
                    </div>
                    {/* Red Cursor SVG */}
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-5 -left-6 w-8 h-8 -rotate-12 z-20 text-brand-red fill-current">
                        <path d="M5.5 3.5L10.5 21.5L13.5 13.5L21.5 10.5L5.5 3.5Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* New Image Cards Layout Container - User's Specific Curve Logic */}
            <div className="absolute top-[10%] left-0 w-full h-[500px] pointer-events-none z-0">

                {/* Yellow Background Strips - Fake curved background */}
                <div style={{ width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 242, display: 'inline-flex', position: 'absolute', top: '10%', left: 0, zIndex: 30 }}>
                    <div style={{ alignSelf: 'stretch', height: 96, background: '#fce958', borderRadius: '0 0 50% 50%' }} />
                </div>

                {/* Horizontal Image Strip - Specific Curved Attributes */}
                {/* Horizontal Image Strip - Straight Line Layout */}
                <div className="relative w-full h-full z-10 flex justify-center items-end pb-12 overflow-hidden">
                    {/* Cards Container - Marquee */}
                    <div className="relative z-20 flex animate-scroll w-max">
                        {videos.map((item, i) => {
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: 350,
                                        height: 350,
                                        flexShrink: 0,
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        marginRight: '16px', // Explicit margin instead of gap for consistency
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    }}
                                    className="hover:scale-105 transition-transform duration-300 cursor-pointer bg-black"
                                >
                                    <video
                                        src={item.src}
                                        poster={item.poster}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Decorative Pill */}
                    <div className="absolute bottom-0 left-0 right-0 mx-auto z-30 translate-y-[5%]"
                        style={{
                            width: '100%',
                            height: 100,
                            background: '#fce958',
                            borderRadius: '50% 50% 0 0',
                            maxWidth: '100%'
                        }}
                    />
                </div>
            </div>

        </section >
    );
};

export default Hero;