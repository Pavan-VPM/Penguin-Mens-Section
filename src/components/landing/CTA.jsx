import React from 'react';

const CTA = () => {
    return (
        <section className="px-4 w-full flex justify-center relative z-20 -mb-12 md:-mb-32">
            <div className="pointer-events-auto w-full max-w-[1240px]">
                <div
                    className="w-full max-w-[1240px] px-6 py-16 md:px-20 md:py-20 text-center relative overflow-hidden flex flex-col items-center justify-center"
                    style={{
                        background: 'linear-gradient(90deg, #8A38F5 0%, #FCE958 100%)',
                        borderRadius: '24.03px',
                        boxShadow: '0px 4px 113px 0px #8A38F5'
                    }}
                >
                    <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                        <h2 className="font-freeman text-[40px] md:text-[56px] leading-[1.1] text-black mb-6">
                            Ready to Dress Like a Penguin?
                        </h2>

                        <p className="font-urbanist text-[18px] md:text-[20px] text-[#1E1E1E] mb-10 max-w-lg">
                            Join 10,000+ men who upgraded their wardrobe with Penguin.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="font-urbanist font-semibold text-[16px] md:text-[18px] border-2 border-black text-black px-8 py-4 rounded-full hover:bg-black/5 transition-colors min-w-[240px] bg-transparent">
                                Browse Collections First
                            </button>
                            <button className="font-urbanist font-semibold text-[16px] md:text-[18px] bg-black text-white px-8 py-4 rounded-full hover:bg-gray-900 transition-colors shadow-lg min-w-[240px]">
                                Shop Now — It's Free to Join
                            </button>
                        </div>

                        <p className="font-urbanist text-[14px] md:text-[16px] text-[#404040] mt-6">
                            Free returns. Fast delivery. No questions asked.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
