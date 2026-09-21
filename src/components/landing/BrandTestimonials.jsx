import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import priyaImage from '../../assets/testimonials/priya.png';
import kritikaImage from '../../assets/testimonials/kritika.png';

const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Digital Marketing Lead",
        content: "We cut our influencer marketing costs by 35% and doubled our reach. The escrow system eliminated all payment headaches.",
        image: priyaImage,
    },
    {
        id: 3,
        name: "Kritika Khurana",
        role: "Growth Manager",
        content: "I used to wait 90 days for payments. With Syncly? Money hits my account the day brands approve. Game changer.",
        image: kritikaImage
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "Founder",
        content: "Finally, an ROI dashboard that actually shows what's working. No more shooting in the dark with influencer budgets.",
        image: priyaImage,
    }
];

// Define specific styles for each blob based on index (0, 1, 2)
const blobStyles = [
    // Card 1 (Left): Stronger Left Rotation
    "rotate-[74deg] translate-y-2 -translate-x-2 rounded-[2.5rem]",

    // Card 2 (Center): Stronger Right Rotation
    "rotate-[76deg] translate-y-2 translate-x-2 rounded-[2.5rem]",

    // Card 3 (Right): Already correct
    "rotate-[76deg] translate-y-2 translate-x-2 rounded-[3rem]"
];

const BrandTestimonials = () => {
    return (
        <section className="bg-[#FFF55F] py-20 px-4 md:px-8 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-sans headline-text">
                        What Brands Say
                    </h2>
                    <p className="text-lg text-gray-800">
                        We reduced influencer spend by 35% and gained full control.
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 pt-10"
                    initial="collapsed"
                    whileHover="expanded"
                    whileInView="collapsed" // Starts collapsed
                    viewport={{ once: true }}
                >
                    {testimonials.map((testimonial, index) => {
                        // Animation Logic: HOVER Spread "Opening" Effect
                        // Index 1 (Kritika) is the anchor.
                        let variants = {};
                        if (index === 0) {
                            // Left Card: Hidden behind center initially
                            variants = {
                                collapsed: { x: "50%", opacity: 0, scale: 0.9, zIndex: 0 },
                                expanded: { x: 0, opacity: 1, scale: 1, zIndex: 1 }
                            };
                        } else if (index === 1) {
                            // Center Card (Kritika): Always visible
                            variants = {
                                collapsed: { opacity: 1, scale: 1, zIndex: 10 },
                                expanded: { opacity: 1, scale: 1.05, zIndex: 10 }
                            };
                        } else {
                            // Right Card: Hidden behind center initially
                            variants = {
                                collapsed: { x: "-50%", opacity: 0, scale: 0.9, zIndex: 0 },
                                expanded: { x: 0, opacity: 1, scale: 1, zIndex: 1 }
                            };
                        }

                        return (
                            <motion.div
                                key={testimonial.id}
                                className="relative group"
                                variants={variants}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                            >
                                {/* Purple Blob Backdrop */}
                                <div
                                    className={`absolute -inset-1 bg-[#6200EA] w-full h-full z-0 transform transition-transform duration-300 ${blobStyles[index]}`}
                                ></div>

                                {/* Card */}
                                <div className="relative z-10 bg-white rounded-[2rem] p-6 pt-14 text-center shadow-sm h-full flex flex-col items-center">

                                    {/* Avatar floating top */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-200">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Stars */}
                                    <div className="flex justify-center gap-1 mb-6 text-[#FF8A00]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 fill-current border-none" strokeWidth={0} />
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <p className="w-full text-center text-black font-urbanist font-normal break-words mb-8 flex-grow" style={{ fontSize: '20.21px', lineHeight: '28.12px' }}>
                                        "{testimonial.content}"
                                    </p>

                                    {/* Author */}
                                    <div className="mt-auto">
                                        <h4 className="text-xl font-normal text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default BrandTestimonials;