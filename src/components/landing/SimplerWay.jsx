import React from 'react';
import { Euro, Clock, MessageCircleQuestion } from 'lucide-react';

const SimplerWay = () => {
    return (
        <section className="relative z-20 px-4 -mt-20 pb-20">
            <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-xl p-8 md:p-16 text-center">

                {/* Header */}
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 max-w-4xl mx-auto leading-tight">
                    There is a simpler, smarter way to dress. <br className="hidden md:block" />
                    And it costs significantly less.
                </h2>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Card 1 */}
                    <div className="bg-[#7c3aed] text-white p-10 rounded-3xl flex flex-col items-center text-center hover:transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="bg-white text-[#7c3aed] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                            <Euro size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 leading-tight">
                            Absurd Retail Markups
                        </h3>
                        <p className="text-purple-100 text-sm md:text-base leading-relaxed">
                            Traditional luxury brands mark up garments by 800% simply for a logo badge.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#7c3aed] text-white p-10 rounded-3xl flex flex-col items-center text-center hover:transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="bg-white text-[#7c3aed] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                            <Clock size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 leading-tight">
                            Ill-Fitting Off-The-Rack
                        </h3>
                        <p className="text-purple-100 text-sm md:text-base leading-relaxed">
                            Standardized S/M/L cuts that sag at the shoulders or bunch unflatteringly at the waist.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#7c3aed] text-white p-10 rounded-3xl flex flex-col items-center text-center hover:transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="bg-white text-[#7c3aed] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                            <MessageCircleQuestion size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 leading-tight">
                            Fast Fashion Fading
                        </h3>
                        <p className="text-purple-100 text-sm md:text-base leading-relaxed">
                            Cheap synthetic blends that pill, tear, and lose shape after just two washes.
                        </p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">
                        Artisanal Tailoring. Premium Italian Fabrics. 50% Less Than Luxury Retail.
                    </h2>

                    {/* Decorative 'A' Badge */}
                    <div className="absolute left-1/2 -bottom-24 transform -translate-x-1/2">
                        <div className="w-16 h-16 bg-[#ea580c] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                            <span className="text-white text-2xl font-bold">A</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SimplerWay;
