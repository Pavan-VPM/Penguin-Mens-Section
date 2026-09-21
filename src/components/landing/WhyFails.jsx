import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import verifiedCheck01 from '../../assets/icons/verified-check-01.png';
import verifiedCheck02 from '../../assets/icons/verified-check-02.png';

import videoSrc from '../../assets/images/why_it_fails.mp4';

const WhyFails = () => {
    return (
        <section className="relative w-full">
            {/* Top Purple Section */}
            <div className="bg-[#6600FF] pt-20 pb-48 px-4 relative z-0">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 md:px-12">
                    {/* Left Content */}
                    <div className="text-left text-white space-y-6 md:space-y-10 z-10 relative">
                        <h2 className="text-[32px] md:text-[50px] leading-[1.1] md:leading-[60px] font-freeman font-normal break-words">
                            Why Most Men's Fashion<br />
                            Brands Let You Down!
                        </h2>
                        <p className="text-[20px] md:text-[19.72px] font-roboto font-normal leading-normal text-white max-w-3xl">
                            Men deserve better than fast fashion that falls apart. <br />Poor fits, mediocre fabric, and overpriced basics — <br />there's a sharper, more honest way to dress.
                        </p>

                        <div className="pt-2">
                            <button className="inline-flex items-center gap-3 bg-white text-[#6600FF] px-8 py-4 rounded-full font-urbanist font-medium text-lg hover:bg-white/90 transition-colors shadow-lg">
                                <span>Browse Collections</span>
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[500px] md:max-w-[700px] lg:max-w-[900px] max-h-[250vh]">
                            {/* CSS Photo Frame for Video */}
                            <div className="relative rounded-[40px] overflow-hidden border-[12px] border-white shadow-2xl bg-black h-full">
                                <video
                                    src={videoSrc}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover aspect-[10/11]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlapping White Card Section */}
            <div className="relative w-full px-4 -mt-12 md:-mt-32 z-10 mb-10">
                <div className="max-w-[1300px] mx-auto bg-white rounded-[60px] py-12 px-4 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
                    <h3 className="text-[30px] md:text-[40px] font-freeman text-black mb-10 max-w-4xl mx-auto leading-tight">
                        There is a better way. Premium quality,<br />
                        at prices that make sense.
                    </h3>

                    {/* Cards Grid */}
                    <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-12">
                        {/* Card 1 */}
                        <div className="bg-[#6600FF] rounded-[40px] p-8 md:p-12 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                            <div className="bg-white rounded-full p-4 mb-6 w-20 h-20 flex items-center justify-center">
                                <img src={verifiedCheck01} alt="Icon" className="w-[60%] h-[60%] object-contain" />
                            </div>
                            <h4 className="text-[24px] md:text-[28px] font-freeman text-white mb-4 leading-tight">
                                Poor Fabric<br />Quality
                            </h4>
                            <p className="text-white/90 font-urbanist text-lg leading-relaxed">
                                Cheap materials that shrink, fade, or fall apart after a few washes.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#6600FF] rounded-[40px] p-8 md:p-12 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                            <div className="bg-white rounded-full p-4 mb-6 w-20 h-20 flex items-center justify-center">
                                <Clock className="w-10 h-10 text-[#6600FF]" />
                            </div>
                            <h4 className="text-[24px] md:text-[28px] font-freeman text-white mb-4 leading-tight">
                                Wrong Fit &<br />Sizing Chaos
                            </h4>
                            <p className="text-white/90 font-urbanist text-lg leading-relaxed">
                                Inconsistent sizing that leaves you guessing every single time.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#6600FF] rounded-[40px] p-8 md:p-12 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                            <div className="bg-white rounded-full p-4 mb-6 w-20 h-20 flex items-center justify-center">
                                <img src={verifiedCheck02} alt="Icon" className="w-[60%] h-[60%] object-contain" />
                            </div>
                            <h4 className="text-[24px] md:text-[28px] font-freeman text-white mb-4 leading-tight">
                                Overpriced.<br />Underdelivered.
                            </h4>
                            <p className="text-white/90 font-urbanist text-lg leading-relaxed">
                                Paying premium prices for average quality and zero style.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-[28px] md:text-[36px] font-freeman text-black text-center relative z-10">
                        Penguin does it better. And it costs less than you think.
                    </h3>

                    {/* Floating Action Button Removed */}
                </div>
            </div>
        </section>
    );
};

export default WhyFails;
