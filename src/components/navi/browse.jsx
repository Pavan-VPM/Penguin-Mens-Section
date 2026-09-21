import React from 'react';
import Header from '../layout/Header';
import Footer from '../landing/Footer';
import CTA from '../landing/CTA';
import { Search, ChevronDown, Tag, Star, ShoppingBag, Heart } from 'lucide-react';

const ProductCard = ({ name, category, fabric, price, rating, reviews, image, description }) => {
    return (
        <div className="bg-white rounded-[20px] shadow-[0px_6px_24px_rgba(0,0,0,0.12)] overflow-hidden border border-[#E5E7EB] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col h-full group">
            <div className="p-6 pb-0 relative overflow-hidden">
                <div className="w-full aspect-square bg-[#F3F4F6] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow cursor-pointer hover:bg-black hover:text-white transition-colors">
                        <Heart size={16} />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black text-white text-xs font-urbanist font-bold px-3 py-1 rounded-full">
                        {category}
                    </div>
                </div>
            </div>

            <div className="p-6 pt-4 flex flex-col gap-3 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-black text-lg font-urbanist font-bold leading-snug group-hover:text-[#7C3AED] transition-colors">{name}</h3>
                        <div className="flex items-center gap-1 text-[#6B7280]">
                            <Tag size={12} />
                            <span className="text-xs font-medium font-urbanist">{fabric}</span>
                        </div>
                    </div>
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-200">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold font-urbanist text-gray-800">{rating}</span>
                        <span className="text-[10px] text-gray-500">({reviews})</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-bold font-urbanist text-black">{price}</span>
                    </div>
                </div>

                <div className="text-[#6B7280] text-sm font-urbanist leading-relaxed line-clamp-2">
                    {description}
                </div>

                {/* Action Button */}
                <button className="w-full mt-auto py-3 bg-[#090909] text-white rounded-xl font-urbanist font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#7C3AED] transition-colors">
                    <ShoppingBag size={16} /> Add to Bag
                </button>
            </div>
        </div>
    );
};

const Browse = () => {
    const products = [
        {
            name: "Royal Navy Milanese Blazer",
            category: "Formal",
            fabric: "100% Super 130s Italian Wool",
            price: "₹14,999",
            rating: "4.9",
            reviews: "128",
            description: "Hand-finished tailored blazer with notch lapels, horn buttons, and breathable cupro lining.",
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Oxford Crisp White Shirt",
            category: "Formal / Casual",
            fabric: "100% Giza Egyptian Cotton",
            price: "₹3,499",
            rating: "4.8",
            reviews: "342",
            description: "Classic cutaway collar shirt with mother-of-pearl buttons and wrinkle-resistant finish.",
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Riviera Linen Resort Shirt",
            category: "Casual",
            fabric: "Pure Normandy French Linen",
            price: "₹2,999",
            rating: "4.9",
            reviews: "89",
            description: "Relaxed fit breathable linen shirt tailored for tropical warmth, seaside escapes, and weekends.",
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Charcoal Savile Wool Trousers",
            category: "Formal",
            fabric: "Australian Merino Wool",
            price: "₹5,499",
            rating: "4.7",
            reviews: "215",
            description: "Double-pleated dress trousers with adjustable side tabs and a natural drape.",
            image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Vintage Cognac Leather Jacket",
            category: "Outerwear",
            fabric: "Full-Grain Lambskin Leather",
            price: "₹21,999",
            rating: "5.0",
            reviews: "64",
            description: "Artisanal biker-cut jacket with antique brass zippers and satin quilted interior.",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Cashmere Turtleneck Knit",
            category: "Winter",
            fabric: "100% Mongolian Cashmere",
            price: "₹8,999",
            rating: "4.9",
            reviews: "112",
            description: "Featherlight warmth and unmatched softness with ribbed neck and cuffs.",
            image: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Handmade Suede Penny Loafers",
            category: "Footwear",
            fabric: "Italian Calf Suede",
            price: "₹9,499",
            rating: "4.8",
            reviews: "174",
            description: "Goodyear welted construction with cushioned leather insoles for all-day comfort.",
            image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Raw Indigo Selvedge Denim",
            category: "Casual",
            fabric: "14oz Japanese Kurabo Denim",
            price: "₹6,999",
            rating: "4.9",
            reviews: "208",
            description: "Straight tapered raw denim with distinctive red-line selvedge ID and chain-stitched hems.",
            image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-urbanist">
            <Header bgClass="bg-white" loginBtnClass="bg-transparent" />

            <main className="pt-8 w-full max-w-[1920px] mx-auto flex flex-col items-center px-4 md:px-12">
                {/* Page Title */}
                <div className="text-center mb-16">
                    <h1 className="text-[40px] md:text-[67px] font-freeman font-normal text-black mb-4 leading-tight">
                        New Arrivals & Menswear Collection.
                    </h1>
                    <p className="text-[18px] font-urbanist font-normal text-black max-w-2xl mx-auto">
                        Handcrafted tailoring, premium organic fabrics, and modern gentleman essentials. Free doorstep try-on & returns.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-16 max-w-[1600px] hidden md:flex">
                    {/* Search Bar */}
                    <div className="flex-grow max-w-[600px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.10)] outline outline-1 outline-[#DCDCDC] flex items-center px-8 relative">
                        <input
                            type="text"
                            placeholder="Search by suit, shirt, fabric, or color..."
                            className="text-black text-lg font-medium font-urbanist w-full bg-transparent focus:outline-none placeholder:text-gray-400"
                        />
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center absolute right-4 cursor-pointer">
                            <Search className="text-white w-5 h-5" />
                        </div>
                    </div>

                    {/* Categories Dropdown */}
                    <div className="w-[260px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.10)] outline outline-1 outline-[#DCDCDC] flex items-center justify-between px-6 cursor-pointer">
                        <span className="text-black text-lg font-bold font-urbanist">All Categories</span>
                        <ChevronDown className="w-5 h-5 text-black" />
                    </div>

                    {/* Size Dropdown */}
                    <div className="w-[180px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.10)] outline outline-1 outline-[#DCDCDC] flex items-center justify-between px-6 cursor-pointer">
                        <span className="text-black text-lg font-medium font-urbanist">Size (S - 3XL)</span>
                        <ChevronDown className="w-5 h-5 text-black" />
                    </div>

                    {/* Price Filter */}
                    <div className="w-[180px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.10)] outline outline-1 outline-[#DCDCDC] flex items-center justify-between px-6 cursor-pointer">
                        <span className="text-black text-lg font-medium font-urbanist">Price Range</span>
                        <ChevronDown className="w-5 h-5 text-black" />
                    </div>
                </div>

                {/* Mobile Filter */}
                <div className="md:hidden w-full mb-8">
                    <div className="w-full h-[60px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.10)] outline outline-1 outline-[#DCDCDC] flex items-center px-6 relative">
                        <input
                            type="text"
                            placeholder="Search clothing..."
                            className="text-black text-base font-medium font-urbanist w-full bg-transparent focus:outline-none"
                        />
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center absolute right-2">
                            <Search className="text-white w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-[1600px] mb-24">
                    {products.map((product, index) => (
                        <div key={index} className="w-full">
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                <div className="mb-24">
                    <button className="bg-black text-white px-8 py-4 rounded-full flex items-center gap-3 hover:bg-[#7C3AED] transition-colors shadow-lg">
                        <span className="text-base font-bold font-urbanist">View More Collections</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Footer CTA Section */}
                <CTA />

            </main>

            <Footer />

        </div>
    );
};

export default Browse;
