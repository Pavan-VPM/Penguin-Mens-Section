import React from 'react';

const StatsCTA = () => {
    return (
        <section className="relative">
            {/* Top Background (Purple) */}
            <div className="bg-[#8B5CF6] pt-20 pb-48 px-4 text-center">
                <div className="max-w-7xl mx-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-white">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-bold mb-2">500+</span>
                            <span className="text-purple-200 text-sm">Brands Trust Pickyourinfluencer</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-bold mb-2">2,500+</span>
                            <span className="text-purple-200 text-sm">Verified Influencers</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-bold mb-2">₹2.5 Cr+</span>
                            <span className="text-purple-200 text-sm">Secured in Escrow</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-bold mb-2">92%</span>
                            <span className="text-purple-200 text-sm">Campaign Success Rate</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Background (Yellow) - Acts as placeholder or transition to next section */}
            <div className="bg-[#fde047] h-48 md:h-64"></div>

            {/* CTA Card (Overlapping) */}
            <div className="absolute top-2/3 md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[10%] w-[90%] max-w-6xl">
                <div className="bg-gradient-to-br from-[#a78bfa] via-[#d8b4fe] to-[#fde047] rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 max-w-3xl leading-tight">
                            Ready to Work with Real Influencers?
                        </h2>
                        <p className="text-gray-800 text-lg mb-10 max-w-xl">
                            Join 500+ brands who stopped overpaying middlemen.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="border-2 border-black text-black px-8 py-3 rounded-full font-medium hover:bg-black/5 transition-colors">
                                Browse Influencers First
                            </button>
                            <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors shadow-lg">
                                Create Free Account
                            </button>
                        </div>

                        <p className="text-xs text-gray-600 mt-6">
                            No credit card required. Set up in 2 minutes.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default StatsCTA;
