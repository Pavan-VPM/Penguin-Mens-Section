import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, BarChart3, MessageCircleMore, Rocket, ArrowDown, Zap } from 'lucide-react';
import verifiedImg from '../../assets/images/why_pick/verified.png';
import analyticsImg from '../../assets/images/why_pick/analytics.png';
import contactImg from '../../assets/images/why_pick/contact.png';
import successImg from '../../assets/images/why_pick/success.png';

const WhyPickYourInfluencer = () => {
    // --- Cards State ---
    const [activeCard, setActiveCard] = useState(0);

    // --- Pricing State ---
    const [audience, setAudience] = useState('influencers'); // 'influencers' or 'brands'
    const [centeredCardIndex, setCenteredCardIndex] = useState(1);

    // Reset to "Growth" (index 1) when audience changes to ensure "Popular" plan is centered
    React.useEffect(() => {
        setCenteredCardIndex(1);
    }, [audience]);

    const cards = [
        {
            id: 0,
            title: "Pure Italian Fabrics",
            description: "Pure Italian Fabrics. Sourced from the finest mills worldwide. 100% Egyptian cotton, mulberry silk, and breathable linen.",
            image: verifiedImg,
            icon: Check
        },
        {
            id: 1,
            title: "Precision Tailoring",
            description: "Precision Tailoring. Engineered for an immaculate silhouette. Every cut and seam is crafted to flatter your build perfectly.",
            image: analyticsImg,
            icon: BarChart3
        },
        {
            id: 2,
            title: "Personal Stylist",
            description: "Personal Stylist. Dedicated fashion consultants to curate your wardrobe for weddings, business summits, or weekend getaways.",
            image: contactImg,
            icon: MessageCircleMore
        },
        {
            id: 3,
            title: "Hassle-Free Delivery",
            description: "Hassle-Free Delivery. Express doorstep delivery with luxury garment packaging, free size alterations, and 30-day effortless returns.",
            image: successImg,
            icon: Rocket
        }
    ];

    const plans = {
        influencers: [
            {
                name: "Wardrobe Basic",
                price: "₹0",
                features: [
                    "Full catalog access",
                    "Standard 3-5 day delivery",
                    "Complimentary seasonal style guide",
                    "30-day return policy",
                    "Standard customer care",
                    "Online sizing recommendation"
                ],
                button: "Shop Now",
                primary: false
            },
            {
                name: "Style Pro",
                price: "₹499",
                features: [
                    "Everything in Basic",
                    "15% off all new collections",
                    "Free express 24-hr delivery",
                    "Early access to limited drops",
                    "Dedicated personal stylist chat",
                    "Free custom alterations (2/month)",
                    "Priority concierge support"
                ],
                button: "Join Style Pro",
                primary: false
            },
            {
                name: "Gentleman Elite",
                price: "₹999",
                features: [
                    "Everything in Style Pro",
                    "25% off all collections",
                    "Complimentary bespoke tailoring",
                    "Exclusive VIP private showroom access",
                    "Quarterly curated stylist lookbook",
                    "Unlimited free doorstep alterations",
                    "Dedicated personal wardrobe manager",
                    "Invites to luxury runway showcases"
                ],
                button: "Join Gentleman Elite",
                primary: false
            }
        ],
        brands: [
            {
                name: "Corporate Executive",
                price: "₹1,499",
                features: [
                    "Curated weekly business outfits",
                    "2 tailored dress shirts / month",
                    "Free doorstep fitting session",
                    "Complimentary steam & dry-cleaning perks",
                    "Priority corporate event styling",
                    "Express 24-hour turnaround",
                    "Executive wardrobe consultation"
                ],
                button: "Select Executive",
                primary: false
            },
            {
                name: "Bespoke Black Label",
                price: "₹3,999",
                features: [
                    "Full bespoke suit tailoring quarterly",
                    "4 premium Italian fabric shirts",
                    "Private fitting at home or office",
                    "Exclusive Italian & British wool swatches",
                    "Personal master tailor visits",
                    "Priority international express shipping",
                    "Unlimited alterations & repairs",
                    "24/7 VIP Concierge line"
                ],
                button: "Join Black Label",
                primary: true,
                badge: "Most Popular"
            },
            {
                name: "Wedding & Gala Club",
                price: "₹7,999",
                features: [
                    "Complete groomsmen / gala wardrobe",
                    "Custom handcrafted tuxedo / sherwani",
                    "Silk accessories & cufflinks set included",
                    "Dedicated master stylist for the event",
                    "Pre-event trial & emergency adjustments",
                    "Luxury gift packaging & garment bags",
                    "Private showroom fitting for family",
                    "Lifetime wardrobe preservation"
                ],
                button: "Book Gala Styling",
                primary: false
            },
            {
                name: "Sovereign Bespoke",
                price: "Custom",
                customPrice: true,
                features: [
                    "Handmade savile-row style craftsmanship",
                    "Ultra-rare vicuña, cashmere, & silk fabrics",
                    "Private stylist flying to your city",
                    "Custom monogramming & gold-plated buttons",
                    "Direct line to Head Designer",
                    "Private jet luggage packing service",
                    "Lifetime alterations & maintenance",
                    "Bespoke leather accessories package"
                ],
                button: "Inquire Concierge",
                primary: false
            }
        ]
    };

    return (
        <div className="flex flex-col w-full">
            {/* --- Hero Section --- */}
            <section className="w-full flex flex-col items-center justify-center pt-20 pb-16 text-center px-4 bg-white">
                <h1 className="font-freeman text-[50px] md:text-[80px] leading-[1.1] md:leading-[1.2] text-black mb-6 max-w-5xl">
                    Crafted for Distinction. Tailored for Men.
                </h1>
                <p className="font-urbanist text-[18px] md:text-[20px] text-black mb-10 max-w-2xl">
                    Experience handcrafted bespoke suits, luxury casuals, and timeless shirts curated for the modern gentleman.
                </p>

                {/* Pill Button */}
                <button className="flex items-center gap-2 pl-5 pr-3 py-3 bg-[#090909] rounded-full shadow-[3px_2px_7px_rgba(102,0,255,0.10)] hover:bg-black/90 transition-colors group">
                    <span className="text-white font-roboto font-medium text-[18px]">Explore Collections</span>
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-colors">
                        <ArrowDown className="w-4 h-4 text-white" />
                    </div>
                </button>
            </section>

            {/* --- Cards Section --- */}
            <section className="w-full py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col xl:flex-row justify-center items-center xl:items-stretch gap-6 h-auto min-h-[600px]">
                        {cards.map((card, index) => {
                            const isActive = activeCard === index;
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.id}
                                    className={`
                                        relative rounded-[43px] overflow-hidden cursor-pointer transition-[flex-grow,height] duration-700 ease-in-out will-change-[flex-grow,height]
                                        ${isActive
                                            ? 'w-full max-w-[640px] h-[500px] xl:h-auto xl:flex-[3]'
                                            : 'w-full max-w-[640px] xl:w-auto h-[100px] xl:h-[700px] xl:flex-1'
                                        }
                                        group
                                    `}
                                    onMouseEnter={() => setActiveCard(index)}
                                    onClick={() => setActiveCard(index)}
                                >
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-black via-transparent to-transparent' : 'xl:bg-gradient-to-l xl:from-black/80 xl:via-transparent'} opacity-90 transition-opacity duration-700`} />

                                    {/* Desktop Inactive State (Center Bottom Aligned Vertical Text) */}
                                    <div className={`
                                        absolute bottom-10 left-1/2 pointer-events-none z-10 transition-opacity duration-700
                                        ${isActive ? 'opacity-0' : 'opacity-100 delay-100'}
                                    `}>
                                        <div className="relative -rotate-90 origin-left">
                                            {/* Text Accent Block */}
                                            <div className="w-[300px] h-[85px] bg-[#8A38F5] absolute -top-[16px] -left-6 -z-10" />
                                            <h3 className="text-white text-[48px] font-roboto font-bold leading-none tracking-wide whitespace-nowrap">
                                                {card.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Active State Content Wrapper (Bottom Aligned) */}
                                    <div className={`absolute inset-0 p-8 flex flex-col justify-end transition-[padding] duration-700 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}>

                                        {/* Title & Description & Icon Combined active state */}
                                        <div className={`transition-[transform,opacity] duration-700 relative pointer-events-auto`}>

                                            {/* Active State (Horizontal Text) */}
                                            <div className={`transition-[transform,opacity] duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-100' : 'opacity-0 translate-x-12'}`}>

                                                <div className="flex flex-row items-start gap-6">
                                                    {/* Icon Circle */}
                                                    <div className="w-16 h-16 bg-[#8A38F5] rounded-full flex shrink-0 items-center justify-center mt-1">
                                                        <div className="w-9 h-9 border-[3px] border-white rounded-full flex items-center justify-center">
                                                            <Icon className="text-white w-5 h-5" strokeWidth={4} />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <h3 className={`text-white font-roboto font-bold leading-tight text-[40px] md:text-[50px] transition-[transform,opacity] duration-700 ease-out origin-left ${isActive ? 'rotate-0 opacity-100 delay-200' : '-rotate-12 opacity-0'}`}>
                                                            {card.title}
                                                        </h3>

                                                        <p className={`text-white text-base md:text-[18px] font-lato font-normal leading-relaxed max-w-lg transition-[transform,opacity,filter] duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 blur-0 delay-300' : 'opacity-0 translate-x-8 blur-sm'}`}>
                                                            {card.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- Pricing Section --- */}
            <section className="bg-white py-24 px-4 w-full">
                <div className="max-w-[1400px] mx-auto flex flex-col items-center">

                    {/* Header */}
                    <h2 className="text-4xl md:text-6xl font-normal font-freeman mb-4 text-[#8A38F5] text-center">
                        Membership & Styling Plans
                    </h2>
                    <p className="text-black text-lg mb-10 text-center font-urbanist">
                        Choose your style tier. Enjoy exclusive discounts, tailoring concierge, and seasonal drops.
                    </p>

                    {/* Toggle */}
                    <div className="w-[513px] h-20 px-[4.81px] py-1 bg-white rounded-[31.64px] shadow-[inset_0px_1.601873517036438px_5.606557369232178px_0px_rgba(138,56,245,0.50)] inline-flex justify-start items-center mb-8">
                        <button
                            onClick={() => setAudience('influencers')}
                            className={`w-64 h-20 px-8 py-6 rounded-[31.64px] flex justify-center items-center gap-1 transition-all duration-300 ${audience === 'influencers' ? 'bg-[#8A38F5]' : ''}`}
                        >
                            <div className={`text-center justify-center text-3xl font-normal font-freeman ${audience === 'influencers' ? 'text-white' : 'text-[#8A38F5]'}`}>Casual Wear</div>
                        </button>
                        <button
                            onClick={() => setAudience('brands')}
                            className={`w-64 h-20 px-8 py-6 rounded-[31.64px] flex justify-center items-center gap-1 transition-all duration-300 ${audience === 'brands' ? 'bg-[#8A38F5]' : ''}`}
                        >
                            <div className={`text-center justify-center text-3xl font-normal font-freeman ${audience === 'brands' ? 'text-white' : 'text-[#8A38F5]'}`}>Executive Label</div>
                        </button>
                    </div>

                    {/* Platform Fee Banner */}
                    {audience === 'brands' && (
                        <div className="w-full max-w-2xl bg-gradient-to-r from-[#9C5CFF] to-[#7C3AED] rounded-[20px] p-4 text-center mb-16 shadow-lg">
                            <h3 className="text-white text-xl font-bold font-urbanist mb-1">VIP Tailoring Concierge Included</h3>
                            <p className="text-white/90 text-sm font-urbanist">
                                Complimentary home fittings, custom fabric swatches, and lifetime alterations with every Executive membership.
                            </p>
                        </div>
                    )}

                    {/* Pricing Carousel Container */}
                    <div className="relative w-full h-[800px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode='popLayout'>
                            {plans[audience].map((plan, index) => {
                                // Determine position relative to centered card
                                const isCentered = index === centeredCardIndex;
                                const offset = index - centeredCardIndex;

                                // Carousel Logic
                                // If centered: x=0, scale=1, z=50
                                // If left (-1): x=-100%, scale=0.85, z=40
                                // If right (+1): x=100%, scale=0.85, z=40
                                // Further out: x= +/- 200%, scale=0.7, z=30 (faded)

                                // Calculate transform values
                                let xVal = '0%';
                                let scaleVal = 1;
                                let zVal = 50;
                                let opacityVal = 1;
                                let rotateVal = 0;

                                if (offset === 0) {
                                    xVal = '0%';
                                    scaleVal = 1;
                                    zVal = 50;
                                    opacityVal = 1;
                                    rotateVal = 0;
                                } else if (offset < 0) {
                                    // Left side
                                    xVal = `${offset * 60 - 20}%`; // e.g. -80%, -140%
                                    scaleVal = 1 - (Math.abs(offset) * 0.1);
                                    zVal = 50 - Math.abs(offset);
                                    opacityVal = 1 - (Math.abs(offset) * 0.2);
                                    rotateVal = -5 * Math.abs(offset);
                                } else {
                                    // Right side
                                    xVal = `${offset * 60 + 20}%`;
                                    scaleVal = 1 - (Math.abs(offset) * 0.1);
                                    zVal = 50 - Math.abs(offset);
                                    opacityVal = 1 - (Math.abs(offset) * 0.2);
                                    rotateVal = 5 * Math.abs(offset);
                                }

                                // Mobile Override (Stack vertical or simple scroll? For now keeping carousel logic but tighter on mobile)
                                // Actually simple carousel works well on mobile if widths are handled.

                                return (
                                    <motion.div
                                        key={`${audience}-${index}`}
                                        className={`
                                            absolute w-full md:w-[450px] p-8 md:p-10 rounded-[32px] flex flex-col h-[700px]
                                            cursor-pointer transition-shadow duration-300
                                            ${plan.primary
                                                ? 'bg-[#8A38F5] text-white shadow-2xl'
                                                : 'bg-white border-[1px] border-gray-200 text-black'}
                                        `}
                                        initial={false}
                                        animate={{
                                            x: xVal,
                                            scale: scaleVal,
                                            zIndex: zVal,
                                            opacity: opacityVal,
                                            rotateY: rotateVal,
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.22, 1, 0.36, 1]
                                        }}
                                        onClick={() => setCenteredCardIndex(index)}
                                        whileHover={{
                                            scale: isCentered ? 1.02 : scaleVal,
                                            // brightness: isCentered ? 1 : 1.1
                                        }}
                                    >
                                        {/* Overlay for non-centered cards to indicating clickability */}
                                        {!isCentered && (
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] rounded-[32px] z-50 hover:bg-transparent transition-colors" />
                                        )}

                                        {/* Popular Badge */}
                                        {plan.badge && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1 border border-gray-100">
                                                <Zap size={12} fill="black" /> {plan.badge}
                                            </div>
                                        )}

                                        <h3 className={`text-3xl font-bold mb-2 font-urbanist ${plan.primary ? 'text-white' : 'text-[#8A38F5]'}`}>
                                            {plan.name}
                                        </h3>

                                        <div className="flex items-baseline gap-1 mb-6">
                                            {plan.customPrice ? (
                                                <span className={`text-5xl font-bold font-urbanist ${plan.primary ? 'text-white' : 'text-[#8A38F5]'}`}>
                                                    {plan.price}
                                                </span>
                                            ) : (
                                                <>
                                                    <span className={`text-5xl font-bold font-urbanist ${plan.primary ? 'text-white' : 'text-[#8A38F5]'}`}>
                                                        {plan.price}
                                                    </span>
                                                    <span className={`text-sm font-urbanist ${plan.primary ? 'text-white/80' : 'text-gray-400'}`}>
                                                        / month
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <div className={`h-px w-full mb-8 ${plan.primary ? 'bg-white/20' : 'bg-gray-100'}`}></div>

                                        <ul className="space-y-4 mb-10 flex-grow overflow-y-auto custom-scrollbar">
                                            {plan.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-start gap-3">
                                                    <div className={`rounded-full p-1 mt-0.5 shrink-0 ${plan.primary ? 'bg-[#d4ff00]' : 'bg-[#d4ff00]'}`}>
                                                        <Check size={10} strokeWidth={4} className="text-black" />
                                                    </div>
                                                    <span className={`text-sm leading-relaxed font-urbanist font-medium ${plan.primary ? 'text-white/90' : 'text-gray-600'}`}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button className={`
                                            w-full py-4 rounded-full font-bold transition-colors shadow-lg font-urbanist mt-auto
                                            ${plan.primary
                                                ? 'bg-black text-white hover:bg-gray-900 border border-transparent'
                                                : 'bg-black text-white hover:bg-[#8A38F5]'}
                                        `}>
                                            {plan.button}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default WhyPickYourInfluencer;
