import React from 'react';
import Header from '../layout/Header';
import Footer from '../landing/Footer';
import CTA from '../landing/CTA';
import beautyInfluencerImg from '../../assets/images/beauty_influencer.png';
import businessInfluencerImg from '../../assets/images/business_influencer.png';
import businessIcon from '../../assets/images/business_icon.png';
import entertainmentIcon from '../../assets/images/entertainment_icon.png';
import entertainmentAvatarsGroup from '../../assets/images/entertainment_avatars_group.png';
import fashionIcon from '../../assets/images/fashion_icon.png';
import fashionTextGraphic from '../../assets/images/fashion_text_graphic.png';
import fitnessIcon from '../../assets/images/fitness_icon.png';
import foodIcon from '../../assets/images/food_icon.png';
import foodImage from '../../assets/images/food_image.png';
import gamingIcon from '../../assets/images/gaming_icon.png';
import gamingImage from '../../assets/images/gaming_image.png';
import lifestyleFb from '../../assets/images/lifestyle_fb.png';
import lifestyleInsta from '../../assets/images/lifestyle_insta.png';
import lifestyleWhatsapp from '../../assets/images/lifestyle_whatsapp.png';
import lifestyleTwitter from '../../assets/images/lifestyle_twitter.png';
import lifestyleHeart from '../../assets/images/lifestyle_heart.png';
import lifestyleIcon from '../../assets/images/lifestyle_icon.png';
import techIcon from '../../assets/images/tech_icon.png';
import travelIcon from '../../assets/images/travel_icon.png';
import travelImage from '../../assets/images/travel_image.png';

const TopCategories = () => {
    const categories = [
        {
            name: "Beauty",
            description: "Makeup, skincare, cosmetics, and wellness.",
            bgColor: "bg-[#895AF6]",
            textColor: "text-white",
            image: beautyInfluencerImg,
            special: "beauty-card",
            buttonStyle: "bg-[#090909] text-white"
        },
        {
            name: "Business",
            description: "Finance, marketing, entrepreneurship, and careers.",
            bgColor: "bg-[#E8EFD6]",
            textColor: "text-black",
            image: businessInfluencerImg,
            icon: businessIcon,
            special: "business-card",
            buttonStyle: "bg-[#090909] text-white"
        },
        {
            name: "Entertainment",
            description: "Movies, music, pop culture, and celebrity news.",
            bgColor: "bg-[#171717]",
            textColor: "text-white",
            icon: entertainmentIcon,
            avatarsGroup: entertainmentAvatarsGroup,
            special: "bubbles"
        },
        {
            name: "Fashion",
            description: "Style, apparel, trends, and haute couture.",
            bgColor: "bg-[#5814CD]",
            textColor: "text-white",
            icon: fashionIcon,
            textGraphic: fashionTextGraphic,
            special: "fashion-card"
        },
        {
            name: "Fitness",
            description: "Workouts, nutrition, health, and athletic performance.",
            bgColor: "bg-[#B8EA55]",
            textColor: "text-[#171717]",
            icon: fitnessIcon,
            special: "fitness-icon"
        },
        {
            name: "Food",
            description: "Cuisine, recipes, restaurants, and culinary arts.",
            bgColor: "bg-[#E9E9E9]",
            textColor: "text-[#171717]",
            icon: foodIcon,
            image: foodImage,
            special: "food-arch"
        },
        {
            name: "Gaming",
            description: "Esports, streaming, consoles, and PC gaming.",
            bgColor: "bg-[#FF8500]",
            textColor: "text-white",
            image: gamingImage,
            icon: gamingIcon,
            special: "gaming-mask"
        },
        {
            name: "Lifestyle",
            description: "Daily life, vlogging, home decor, and hobbies.",
            bgColor: "bg-[#F0EEE1]",
            textColor: "text-[#171717]",
            icon: lifestyleIcon,
            special: "lifestyle-arc"
        },
        {
            name: "Tech",
            description: "Gadgets, software, startups, and innovations.",
            bgColor: "bg-[#F7FD91]",
            textColor: "text-[#171717]",
            icon: techIcon,
            special: "tech-icon"
        },
        {
            name: "Travel",
            description: "Gadgets, software, startups, and innovations.",
            bgColor: "bg-[#2563EB]",
            textColor: "text-white",
            icon: travelIcon,
            image: travelImage,
            special: "travel-mask"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden w-full">
            {/* Header */}
            <Header bgClass="bg-white" loginBtnClass="bg-transparent" />

            {/* Hero Section */}
            <div className="w-full text-center mt-12 md:mt-24 px-4 mb-16">
                <h1 className="font-freeman text-[50px] md:text-[80px] leading-tight text-black mb-4">
                    Explore by category.
                </h1>
                <p className="font-urbanist text-[18px] md:text-[20px] text-black">
                    Find influencers in the niches that matter most to your brand.
                </p>
            </div>

            {/* Grid Section */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className={`relative rounded-[24px] overflow-hidden h-[600px] hover:shadow-xl transition-shadow duration-300 ${cat.bgColor} flex flex-col items-center pt-24 px-8 group ${cat.name === 'Travel' ? 'lg:col-start-2' : ''}`}
                        >
                            {/* Special: Beauty Card Background Curve & Image Masked */}
                            {cat.special === 'beauty-card' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[340px] bg-white rounded-t-[100%] overflow-hidden z-10 pointer-events-none">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover object-[center_50%] scale-100 translate-y-4"
                                    />
                                </div>
                            )}

                            {/* Special: Business Card Oval Image Mask */}
                            {cat.special === 'business-card' && (
                                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-[220px] rounded-[100px] overflow-hidden z-10 shadow-lg pointer-events-none">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover object-[center_60%]"
                                    />
                                </div>
                            )}

                            {/* Special: Gaming Card Horizontal Oval Mask */}
                            {cat.special === 'gaming-mask' && (
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] h-[240px] rounded-[50%] overflow-hidden z-10 shadow-lg pointer-events-none">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                            )}

                            {/* Special: Food Card Arch Mask */}
                            {cat.special === 'food-arch' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[280px] bg-white rounded-t-[100%] overflow-hidden z-10 pointer-events-none">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-[80%] h-auto absolute bottom-0 left-1/2 -translate-x-1/2 object-contain"
                                    />
                                </div>
                            )}

                            {/* Special: Travel Card Arch Mask */}
                            {cat.special === 'travel-mask' && (
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-[260px] bg-white rounded-t-[100%] overflow-hidden z-10 pointer-events-none">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover object-center scale-110"
                                    />
                                </div>
                            )}


                            {/* Special: Top Icon (Generic) */}
                            {cat.icon && (
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-[100px] h-[100px]">
                                    <img src={cat.icon} alt="icon" className="w-full h-full object-contain" />
                                </div>
                            )}


                            {/* Special Icons/Decorations (Asterisk) */}
                            {(cat.special === 'asterisk' || cat.special === 'beauty-card') && (
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 font-inter font-normal text-[150px] leading-none text-white select-none opacity-100 z-10">*</div>
                            )}

                            {/* Content */}
                            <div className={`relative z-20 text-center flex flex-col items-center mt-12 ${cat.special === 'business-card' || cat.special === 'bubbles' || cat.special === 'fashion-card' ? 'mt-20' : ''}`}>
                                <h3 className={`font-freeman text-[42px] leading-none mb-4 ${cat.textColor}`}>
                                    {cat.name}
                                </h3>
                                <p className={`font-roboto text-[19px] max-w-[280px] leading-snug opacity-90 ${cat.textColor} mb-8`}>
                                    {cat.description}
                                </p>
                            </div>

                            {/* CTA Pill */}
                            <button
                                className={`z-30 px-8 py-4 rounded-full font-roboto font-medium text-[20px] shadow-lg hover:scale-105 transition-transform whitespace-nowrap
                                ${cat.special === 'business-card' || cat.special === 'bubbles' || cat.special === 'fashion-card' ? 'absolute bottom-10 left-1/2 -translate-x-1/2' : 'relative'}
                                ${cat.buttonStyle ? cat.buttonStyle : (cat.textColor === 'text-white' ? 'bg-white text-black' : 'bg-[#090909] text-white')}`}
                            >
                                {['Food', 'Gaming', 'Lifestyle'].includes(cat.name) ? 'Start your campaign' : 'Browse Influencer'}
                            </button>

                            {/* Other Cards Images (Generic Fallback - e.g. Travel) */}
                            {cat.image && !['beauty-card', 'business-card', 'gaming-mask', 'food-arch', 'travel-mask'].includes(cat.special) && (
                                <img src={cat.image} alt={cat.name} className={`${cat.imageClass}`} />
                            )}

                            {/* Special: Bubbles (Entertainment) */}
                            {cat.special === 'bubbles' && cat.avatarsGroup && (
                                <div className="absolute bottom-40 left-1/2 -translate-x-1/2 flex items-center justify-center">
                                    <img src={cat.avatarsGroup} alt="Avatars Sequence" className="h-16 w-auto object-contain" />
                                </div>
                            )}

                            {/* Special: Fashion Text Graphic */}
                            {cat.special === 'fashion-card' && cat.textGraphic && (
                                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full px-4">
                                    <img src={cat.textGraphic} alt="Influencers Graphic" className="w-full h-auto object-contain opacity-90" />
                                </div>
                            )}

                            {/* Special: Lifestyle Arc Icons */}
                            {cat.special === 'lifestyle-arc' && (
                                <div className="absolute bottom-10 w-full h-[180px] pointer-events-none">
                                    {/* Center Heart */}
                                    <img src={lifestyleHeart} className="absolute bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 object-contain shadow-sm" alt="Heart" />

                                    {/* Instagram (Left Mid) */}
                                    <img src={lifestyleInsta} className="absolute bottom-12 left-[30%] w-12 h-12 object-contain shadow-sm" alt="Instagram" />

                                    {/* WhatsApp (Right Mid) */}
                                    <img src={lifestyleWhatsapp} className="absolute bottom-12 right-[30%] w-12 h-12 object-contain shadow-sm" alt="WhatsApp" />

                                    {/* Facebook (Far Left) */}
                                    <img src={lifestyleFb} className="absolute bottom-4 left-[15%] w-10 h-10 object-contain shadow-sm" alt="Facebook" />

                                    {/* Twitter (Far Right) */}
                                    <img src={lifestyleTwitter} className="absolute bottom-4 right-[15%] w-10 h-10 object-contain shadow-sm" alt="Twitter" />
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            <CTA />
            <Footer />
        </div>
    );
};

export default TopCategories;
