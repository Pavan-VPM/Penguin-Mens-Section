import React from 'react';
import starImage from '../../assets/star.png';

const FourSteps = () => {
    return (
        <section className="bg-white py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 relative">
                    {/* Left Side: Star + Description */}
                    <div className="flex flex-col gap-8">
                        <img
                            src={starImage}
                            className="size-28 object-contain"
                            alt="Decorative Star"
                        />
                        <div className="w-full lg:w-[660.05px] justify-start text-zinc-700 text-xl font-normal font-['Urbanist'] leading-7">
                            A focused design approach that removes noise and highlights what matters most. Clean layouts, clear hierarchy, and intentional spacing create a calm, confident experience. Every element serves a purpose, resulting in an interface that feels effortless, professional, and impactful.
                        </div>
                    </div>

                    {/* Right Side: Title */}
                    <div className="flex lg:justify-end">
                        <div className="w-full lg:w-[582px] lg:pt-28 text-black text-5xl md:text-4xl font-normal font-['Freeman'] leading-tight md:leading-[93.25px] lg:text-left">
                            From Browse to Wardrobe — In Four Steps
                        </div>
                    </div>
                </div>

                {/* Steps Section */}
                {/* Steps Section - Horizontal Scroll */}
                <div className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:-mx-8 md:px-8 lg:mx-0 lg:px-0">
                    {/* Card 1: Browse */}
                    <div className="w-[400px] h-[280px] relative bg-purple-500 rounded-[32px] snap-center shrink-0">
                        <div className="absolute left-[30px] top-0 justify-start text-black text-7xl font-normal font-['Sofia'] leading-[120px]">1</div>
                        <div className="px-3 py-2 left-[30px] top-[130px] absolute rounded-full outline outline-[1px] outline-white inline-flex justify-center items-center gap-2">
                            <div className="justify-start text-white text-lg font-bold font-['Urbanist']">Browse</div>
                        </div>
                        <div className="w-[280px] left-[30px] top-[190px] absolute justify-start text-white text-lg font-semibold font-['Urbanist'] leading-snug">
                            Explore curated collections by style, occasion & season
                        </div>
                        <div className="absolute left-[180px] top-[20px] w-[200px] h-[160px] overflow-hidden">
                            <svg width="200" height="160" viewBox="0 0 279 219" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 139.293V36.7421C0 16.45 16.45 0 36.7421 0H242.104C262.396 0 278.846 16.45 278.846 36.7421V181.332C278.846 204.586 257.517 221.991 234.736 217.328L29.3736 175.289C12.2763 171.789 0 156.745 0 139.293Z" fill="url(#pattern0_1577_2098_small)" />
                                <defs>
                                    <pattern id="pattern0_1577_2098_small" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_1577_2098_small" transform="matrix(0.0013587 0 0 0.00167376 0 -0.42992)" />
                                    </pattern>
                                    <image id="image0_1577_2098_small" width="736" height="1288" preserveAspectRatio="none" href="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1080&auto=format&fit=crop" />
                                </defs>
                            </svg>
                        </div>
                    </div>

                    {/* Card 2: Pick Your Size */}
                    <div data-layer="Frame 1000002616" className="w-[400px] h-[280px] relative bg-yellow-300 rounded-[32px] snap-center shrink-0">
                        <div data-layer="2" className="absolute left-[30px] top-[130px] justify-start text-black text-7xl font-normal font-['Sofia'] leading-[120px]">2</div>
                        <div data-layer="Frame 1000002614" className="px-3 py-2 left-[30px] top-[30px] absolute rounded-full outline outline-[1px] outline-black inline-flex justify-center items-center gap-2">
                            <div data-layer="Pick Your Size" className="justify-start text-black text-lg font-bold font-['Urbanist']">Pick Your Size</div>
                        </div>
                        <div data-layer="Find your fit" className="w-[260px] left-[30px] top-[90px] absolute justify-start text-black text-lg font-semibold font-['Urbanist'] leading-snug">
                            Use our smart size guide. Get the perfect fit every time.
                        </div>
                        <div data-svg-wrapper data-layer="Vector 9" className="absolute left-[160px] top-[50px] w-[215px] h-[172px]">
                            <svg width="215" height="172" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 202.269V150.136C0 136.242 7.83696 123.536 20.2529 117.301L245.955 3.95552C270.388 -8.31485 299.186 9.44825 299.186 36.7898V202.269C299.186 222.561 282.736 239.011 262.444 239.011H36.7421C16.45 239.011 0 222.561 0 202.269Z" fill="url(#pattern0_1577_2104_small)" />
                                <defs>
                                    <pattern id="pattern0_1577_2104_small" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_1577_2104_small" transform="matrix(0.000976399 0 0 0.00111588 0.000863617 0.0773554)" />
                                    </pattern>
                                    <image id="image0_1577_2104_small" width="1080" height="1349" preserveAspectRatio="none" href="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1080&auto=format&fit=crop" />
                                </defs>
                            </svg>
                        </div>
                    </div>

                    {/* Card 3: Checkout Safely */}
                    <div data-layer="Frame 1000002622" className="w-[400px] h-[280px] relative bg-red-500 rounded-[32px] snap-center shrink-0">
                        <div data-layer="3" className="absolute left-[30px] top-0 justify-start text-black text-7xl font-normal font-['Sofia'] leading-[120px]">3</div>
                        <div data-layer="Frame 1000002614" className="px-3 py-2 left-[30px] top-[130px] absolute rounded-full outline outline-[1px] outline-white inline-flex justify-center items-center gap-2">
                            <div data-layer="Checkout" className="justify-start text-white text-lg font-bold font-['Urbanist']">Checkout Safely</div>
                        </div>
                        <div data-layer="Secure payment" className="w-[280px] left-[30px] top-[190px] absolute justify-start text-white text-lg font-semibold font-['Urbanist'] leading-snug">
                            Secure payment. Instant order confirmation. Done.
                        </div>
                        <div data-svg-wrapper data-layer="Vector 8" className="absolute left-[180px] top-[20px] w-[200px] h-[185px]">
                            <svg width="200" height="185" viewBox="0 0 279 257" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 143.68V36.7421C0 16.45 16.45 0 36.7421 0H242.104C262.396 0 278.846 16.45 278.846 36.7421V219.543C278.846 245.12 253.365 262.872 229.372 254.009L24.0101 178.146C9.58138 172.816 0 159.062 0 143.68Z" fill="url(#pattern0_839_6441_small)" />
                                <defs>
                                    <pattern id="pattern0_839_6441_small" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_839_6441_small" transform="matrix(0.0013587 0 0 0.00139144 0 -0.278275)" />
                                    </pattern>
                                    <image id="image0_839_6441_small" width="736" height="1308" preserveAspectRatio="none" href="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1080&auto=format&fit=crop" />
                                </defs>
                            </svg>
                        </div>
                    </div>

                    {/* Card 4: Wear & Love */}
                    <div data-layer="Frame 1000002621" className="w-[400px] h-[280px] relative bg-yellow-300 rounded-[32px] snap-center shrink-0">
                        <div data-layer="4" className="absolute left-[30px] top-[130px] justify-start text-black text-7xl font-normal font-['Sofia'] leading-[120px]">4</div>
                        <div data-layer="Frame 1000002614" className="px-3 py-2 left-[30px] top-[30px] absolute rounded-full outline outline-[1px] outline-black inline-flex justify-center items-center gap-2">
                            <div data-layer="Wear & Love" className="justify-start text-black text-lg font-bold font-['Urbanist']">Wear & Love</div>
                        </div>
                        <div data-layer="Delivered fast" className="w-[260px] left-[30px] top-[90px] absolute justify-start text-black text-lg font-semibold font-['Urbanist'] leading-snug">
                            Delivered fast. Love it or return it. No questions asked.
                        </div>
                        <div data-svg-wrapper data-layer="Vector 9" className="absolute left-[160px] top-[50px] w-[215px] h-[150px]">
                            <svg width="215" height="150" viewBox="0 0 300 205" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 168.008V118.938C0 103.492 9.65983 89.6955 24.1736 84.4119L249.875 2.24866C273.84 -6.47533 299.186 11.2711 299.186 36.7743V168.008C299.186 188.301 282.736 204.751 262.444 204.751H36.7421C16.45 204.751 0 188.301 0 168.008Z" fill="url(#pattern0_839_6447_small)" />
                                <defs>
                                    <pattern id="pattern0_839_6447_small" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_839_6447_small" transform="matrix(0.0013587 0 0 0.00184394 0 0.0285749)" />
                                    </pattern>
                                    <image id="image0_839_6447_small" width="736" height="1051" preserveAspectRatio="none" href="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1080&auto=format&fit=crop" />
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FourSteps;