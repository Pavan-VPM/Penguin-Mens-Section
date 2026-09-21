import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const Pricing = () => {
    const [audience, setAudience] = useState('casual'); // 'casual' or 'premium'

    const plans = {
        casual: [
            {
                name: "Basic",
                price: "Free",
                customPrice: true,
                features: [
                    "Access to new arrivals",
                    "Standard delivery (5-7 days)",
                    "Free returns on full price items",
                    "Email order updates",
                    "Basic size guide",
                    "Standard support"
                ],
                button: "Start Free",
                primary: false
            },
            {
                name: "Club",
                price: "₹299",
                features: [
                    "Everything in Basic",
                    "Priority access to sales",
                    "Free express delivery",
                    "Member-only discounts (10%)",
                    "Early access to new collections",
                    "Priority customer support",
                    "Style newsletter"
                ],
                button: "Join Club",
                primary: false
            },
            {
                name: "Elite",
                price: "₹599",
                features: [
                    "Everything in Club",
                    "Exclusive member collections",
                    "20% discount all year",
                    "Free alterations",
                    "Personal style consultation",
                    "VIP customer support",
                    "Birthday rewards",
                    "Invite-only events"
                ],
                button: "Go Elite",
                primary: false
            }
        ],
        premium: [
            {
                name: "Starter",
                price: "₹999",
                features: [
                    "5 premium pieces/month",
                    "Curated style box",
                    "Free delivery & returns",
                    "Basic styling tips",
                    "Standard support",
                    "Easy size swaps",
                    "Cancel anytime"
                ],
                button: "Get Started",
                primary: false
            },
            {
                name: "Wardrobe",
                price: "₹1,999",
                features: [
                    "10 premium pieces/month",
                    "Everything in Starter",
                    "Personal stylist access",
                    "Priority new drops",
                    "Unlimited size exchanges",
                    "Exclusive collab pieces",
                    "Priority support",
                    "Monthly style report"
                ],
                button: "Build Wardrobe",
                primary: true,
                badge: "Most Popular"
            },
            {
                name: "Signature",
                price: "₹3,999",
                features: [
                    "Unlimited premium pieces",
                    "Everything in Wardrobe",
                    "Dedicated personal stylist",
                    "Custom tailoring options",
                    "Exclusive brand collabs",
                    "Quarterly wardrobe audit",
                    "Concierge support",
                    "VIP event invites"
                ],
                button: "Go Signature",
                primary: false
            },
            {
                name: "Corporate",
                price: "Custom",
                customPrice: true,
                features: [
                    "Everything in Signature",
                    "Team uniform solutions",
                    "Bulk order discounts",
                    "Branded packaging",
                    "API integrations",
                    "Dedicated account manager",
                    "Custom branding",
                    "Quarterly strategy review"
                ],
                button: "Contact Us",
                primary: false
            }
        ]
    };

    return (
        <section className="bg-white py-24 px-4">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center">

                {/* Header */}
                <h2 className="text-4xl md:text-6xl font-normal font-['Freeman'] mb-4 text-[#8A38F5] text-center">
                    Choose Your Style Plan
                </h2>
                <p className="text-black text-lg mb-10 text-center font-['Urbanist']">
                    Pick what works for your wardrobe. No hidden fees, ever.
                </p>

                {/* Toggle */}
                <div className="w-[513px] h-20 px-[4.81px] py-1 bg-white rounded-[31.64px] shadow-[inset_0px_1.601873517036438px_5.606557369232178px_0px_rgba(138,56,245,0.50)] inline-flex justify-start items-center mb-8">
                    <button
                        onClick={() => setAudience('casual')}
                        className={`w-64 h-20 px-8 py-6 rounded-[31.64px] flex justify-center items-center gap-1 transition-all duration-300 ${audience === 'casual' ? 'bg-[#8A38F5]' : ''}`}
                    >
                        <div className={`text-center justify-center text-3xl font-normal font-['Freeman'] ${audience === 'casual' ? 'text-white' : 'text-[#8A38F5]'}`}>Casual Wear</div>
                    </button>
                    <button
                        onClick={() => setAudience('premium')}
                        className={`w-64 h-20 px-8 py-6 rounded-[31.64px] flex justify-center items-center gap-1 transition-all duration-300 ${audience === 'premium' ? 'bg-[#8A38F5]' : ''}`}
                    >
                        <div className={`text-center justify-center text-3xl font-normal font-['Freeman'] ${audience === 'premium' ? 'text-white' : 'text-[#8A38F5]'}`}>Premium Plan</div>
                    </button>
                </div>

                {/* Premium Plan Banner */}
                {audience === 'premium' && (
                    <div className="w-full max-w-2xl bg-gradient-to-r from-[#9C5CFF] to-[#7C3AED] rounded-[20px] p-4 text-center mb-16 shadow-lg">
                        <h3 className="text-white text-xl font-bold font-['Urbanist'] mb-1">Premium Concierge</h3>
                        <p className="text-white/90 text-sm font-['Urbanist']">
                            Our premium plan includes a dedicated personal stylist and unlimited style consultations.
                        </p>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${audience === 'premium' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 w-full`}>
                    <AnimatePresence mode='wait'>
                        {plans[audience].map((plan, index) => (
                            <motion.div
                                key={`${audience}-${index}`}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.12,
                                    ease: [0.22, 1, 0.36, 1], // smooth premium easing
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                className={`
                                    relative rounded-[32px] p-10 flex flex-col h-full min-h-[650px]
                                    transition-all duration-300
                                    ${plan.primary
                                        ? 'bg-[#8A38F5] text-white shadow-2xl transform scale-105 z-10'
                                        : 'bg-white border-[1px] border-gray-200 hover:border-[#8A38F5] hover:shadow-xl text-black'}
                                `}
                            >

                                {/* Popular Badge */}
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1 border border-gray-100">
                                        <Zap size={12} fill="black" /> {plan.badge}
                                    </div>
                                )}

                                <h3 className={`text-3xl font-bold mb-2 font-['Urbanist'] ${plan.primary ? 'text-white' : 'text-[#8A38F5]'}`}>
                                    {plan.name}
                                </h3>

                                <div className="flex items-baseline gap-1 mb-6">
                                    {plan.customPrice ? (
                                        <span className={`text-5xl font-bold font-['Urbanist'] ${plan.primary ? 'text-white' : 'text-[#8A38F5]'}`}>
                                            {plan.price}
                                        </span>
                                    ) : (
                                        <>
                                            <span className={`text-5xl font-bold font-['Urbanist'] ${plan.primary ? 'text-white' : 'text-[#8A38F5]'}`}>
                                                {plan.price}
                                            </span>
                                            <span className={`text-sm font-['Urbanist'] ${plan.primary ? 'text-white/80' : 'text-gray-400'}`}>
                                                / month
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className={`h-px w-full mb-8 ${plan.primary ? 'bg-white/20' : 'bg-gray-100'}`}></div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-3">
                                            <div className={`rounded-full p-1 mt-0.5 shrink-0 ${plan.primary ? 'bg-[#d4ff00]' : 'bg-[#d4ff00]'}`}>
                                                <Check size={10} strokeWidth={4} className="text-black" />
                                            </div>
                                            <span className={`text-sm leading-relaxed font-['Urbanist'] font-medium ${plan.primary ? 'text-white/90' : 'text-gray-600'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`
                                    w-full py-4 rounded-full font-bold transition-colors shadow-lg font-['Urbanist']
                                    ${plan.primary
                                        ? 'bg-black text-white hover:bg-gray-900 border border-transparent'
                                        : 'bg-black text-white hover:bg-[#8A38F5]'}
                                `}>
                                    {plan.button}
                                </button>

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};

export default Pricing;