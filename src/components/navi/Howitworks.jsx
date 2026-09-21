import React from 'react';
import { Search, UserCheck, MessageSquare, LineChart } from 'lucide-react';
import step1Img from '../../assets/images/how-it-works/step1.png';
import step2Img from '../../assets/images/how-it-works/step2.png';
import step3Img from '../../assets/images/how-it-works/step3.png';
import step4Img from '../../assets/images/how-it-works/step4.jpg';

const Howitworks = () => {
    const steps = [
        {
            id: 1,
            number: '1',
            title: 'Browse & Discover',
            description: 'Explore our curated collections of sharp suits, tailored shirts, luxury casuals, and premium menswear essentials.',
            image: step1Img,
            gradient: 'bg-gradient-to-b from-[#A159FF] to-[#8A38F5]', // Purple gradient
            textColor: 'text-white',
            numberColor: 'text-[#5814CD]',
            iconColor: 'bg-[#EACF5A]',
            icon: <Search className="w-6 h-6 text-white" />,
            layout: 'right' // Image on right
        },
        {
            id: 2,
            number: '2',
            title: 'Select Fit & Fabrics',
            description: 'Choose from 100% Egyptian cotton, pure Italian wool, and linen. Customize your fit with easy online sizing or book a tailor visit.',
            image: step2Img,
            gradient: 'bg-[#FBE957]', // Yellow solid
            textColor: 'text-black',
            numberColor: 'text-[#5814CD]',
            iconColor: 'bg-[#A260F7]',
            icon: <UserCheck className="w-6 h-6 text-white" />,
            layout: 'left' // Image on left
        },
        {
            id: 3,
            number: '3',
            title: 'Artisanal Crafting',
            description: 'Master tailors precision-cut and stitch your garments with reinforced seams, luxury linings, and premium horn buttons.',
            image: step3Img,
            gradient: 'bg-[#E75454CC]',
            containerStyle: { backgroundColor: 'rgba(231, 84, 84, 0.80)' },
            textColor: 'text-white',
            numberColor: 'text-[#5814CD]',
            iconColor: 'bg-[#EACF5A]',
            icon: <MessageSquare className="w-6 h-6 text-white" />,
            layout: 'right'
        },
        {
            id: 4,
            number: '4',
            title: 'Doorstep Try-On & Fit Guarantee',
            description: 'Delivered in luxury garment bags. Try it at home with our 100% Perfect Fit Guarantee—free alterations and effortless 30-day returns.',
            image: step4Img,
            gradient: 'bg-[#FBE957]', // Yellow solid
            textColor: 'text-black',
            numberColor: 'text-[#5814CD]',
            iconColor: 'bg-[#EC7676]',
            icon: <LineChart className="w-6 h-6 text-white" />,
            layout: 'left'
        }
    ];

    return (
        <section className="bg-[#FEFEFE] pt-28 pb-32 px-4 w-full relative overflow-hidden">

            {/* Header */}
            <div className="text-center mb-10 md:mb-14 relative z-10">
                <h2 className="text-[36px] md:text-[72px] font-freeman text-black mb-4 md:mb-6 leading-tight">
                    How Penguin Men's Section Works.
                </h2>
                <p className="font-urbanist text-[20px] text-black">
                    Four simple steps to elevate your wardrobe with handcrafted perfection.
                </p>
            </div>

            <div className="max-w-[1336px] mx-auto space-y-7 relative z-10">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`w-full rounded-[20px] overflow-hidden shadow-lg border-2 border-[#D9D9D9] relative min-h-[500px] md:h-[542px] flex flex-col md:flex-row items-center ${step.gradient.startsWith('bg-') ? step.gradient : ''}`}
                        style={step.containerStyle}
                    >
                        {/* Number Background */}
                        <div className={`absolute top-10 ${step.layout === 'right' ? 'left-8' : 'right-8 md:left-auto md:right-8'} w-[92px] h-[143px] z-0 opacity-100 hidden md:block`}>
                            <div className="inset-0 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] absolute rounded-lg pointer-events-none"></div>
                            <span className="font-roboto font-bold text-[160px] leading-none bg-gradient-to-b from-[#A96BFA] to-[#5814CD] text-transparent bg-clip-text absolute -top-8 left-0">{step.number}</span>
                        </div>

                        {/* Mobile Number (simplified) */}
                        <div className="md:hidden absolute top-4 right-4 z-20 font-roboto font-bold text-[60px] text-white/50">{step.number}</div>

                        {/* Content Container */}
                        <div className={`w-full md:w-7/12 p-6 md:p-12 lg:p-[48px] flex flex-row items-start justify-start relative z-10 order-2 ${step.layout === 'right' ? 'md:order-1' : 'md:order-2'} gap-4 md:gap-8`}>

                            {/* Icon Badge */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.iconColor} shadow-md flex items-center justify-center mt-2`}>
                                {step.icon}
                            </div>

                            <div className="flex flex-col">
                                <h3 className={`font-freeman text-[36px] md:text-[48px] leading-tight mb-4 ${step.textColor}`}>
                                    {step.title}
                                </h3>
                                <p className={`font-urbanist text-[18px] md:text-[20px] leading-relaxed max-w-lg ${step.textColor === 'text-white' ? 'text-white/90' : 'text-[#404040]'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>

                        {/* Image Container */}
                        <div className={`w-full md:w-5/12 p-4 md:p-6 lg:p-8 flex items-center justify-center order-1 ${step.layout === 'right' ? 'md:order-2' : 'md:order-1'}`}>
                            <div className="w-full h-[250px] md:h-[480px] rounded-xl overflow-hidden relative shadow-sm">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
};

export default Howitworks;
