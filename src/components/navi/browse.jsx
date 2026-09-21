import React from 'react';
import Header from '../layout/Header';
import Footer from '../landing/Footer';
import CTA from '../landing/CTA';
import { Search, ChevronDown, MapPin, Film, Heart, Users, ExternalLink } from 'lucide-react';

const InfluencerCard = ({ name, location, tags, stats, image, bio }) => {
    return (
        <div className="bg-white rounded-[20px] shadow-[0px_6px_24px_rgba(0,0,0,0.24)] overflow-hidden outline outline-2 outline-[rgba(175,175,175,0.30)] -outline-offset-2 flex flex-col h-full">
            <div className="p-6 pb-0 relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full aspect-square object-cover rounded-[14px] bg-gray-200"
                />
            </div>

            <div className="p-6 pt-4 flex flex-col gap-4 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-black text-base font-urbanist font-semibold">{name}</h3>
                        <div className="flex items-center gap-1.5 text-[#818181]">
                            <MapPin size={10} className="stroke-[1.5]" />
                            <span className="text-[10px] font-lato">{location}</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => {
                        let bgClass = 'bg-gray-100';
                        if (tag === 'Food') bgClass = 'bg-[rgba(160.87,88.92,254.75,0.60)]';
                        else if (tag === 'Travel') bgClass = 'bg-[rgba(251.97,233.44,87.58,0.60)]';
                        else if (tag === 'Life Style' || tag === 'Lifestyle') bgClass = 'bg-[rgba(231,84,84,0.60)]';
                        else if (tag === 'Tech') bgClass = 'bg-[rgba(93,202,160,0.60)]';
                        else if (tag === 'Business') bgClass = 'bg-[rgba(184,234,85,0.60)]';

                        return (
                            <div key={index} className={`px-3 py-1 ${bgClass} rounded-full flex items-center justify-center`}>
                                <span className="text-black text-sm font-roboto font-medium">{tag}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between gap-1 w-full">
                    {/* Stat 1 */}
                    <div className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded">
                        <Users size={14} className="text-black" />
                        <span className="text-black text-sm font-roboto font-medium">{stats.followers}</span>
                    </div>
                    {/* Stat 2 */}
                    <div className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded">
                        <Film size={14} className="text-black" />
                        <span className="text-black text-sm font-roboto font-medium">{stats.posts}</span>
                    </div>
                    {/* Stat 3 */}
                    <div className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded">
                        <Heart size={14} className="text-black" />
                        <span className="text-black text-sm font-roboto font-medium">{stats.likes}</span>
                    </div>
                    {/* Stat 4 */}
                    <div className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded">
                        <ExternalLink size={14} className="text-black" />
                        <span className="text-black text-sm font-roboto font-medium">{stats.reach}</span>
                    </div>
                </div>

                <div className="text-[#676D75] text-[13px] font-urbanist leading-[18px]">
                    {bio}
                </div>
            </div>
        </div>
    );
};

const Browse = () => {
    const influencers = [
        {
            name: "Abinash Tandi",
            location: "Bangalore, India",
            tags: ["Food", "Travel", "Life Style"],
            stats: { followers: "12k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Food, travel, Lifestyle",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Alex Chen",
            location: "Bangalore, India",
            tags: ["Tech"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Tech reviewer and gadget enthusiast. I test the latest tech so you don't have to. Partner with me for product launches and reviews.",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Anandh",
            location: "Bangalore, India",
            tags: ["Business"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Business & entrepreneurship mentor. Sharing startup insights and growth strategies. Partner for B2B campaigns.",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Anushasravan",
            location: "Bangalore, India",
            tags: ["Food", "Travel", "Life Style"],
            stats: { followers: "104k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Food, travel, Lifestyle",
            image: "https://placehold.co/272x271"
        },
        {
            name: "bangalore malayalis",
            location: "Bangalore, India",
            tags: ["Tech"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Food, travel, Lifestyle",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Bangalore Nexa",
            location: "Bangalore, India",
            tags: ["Business"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Food, travel, Lifestyle",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Bangalore IG",
            location: "Bangalore, India",
            tags: ["Food", "Travel", "Life Style"],
            stats: { followers: "12k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Food, travel, Lifestyle",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Atif Beerwala",
            location: "Bangalore, India",
            tags: ["Tech"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Food, travel, Lifestyle",
            image: "https://placehold.co/272x271"
        },
        {
            name: "bangalore bro",
            location: "Bangalore, India",
            tags: ["Life Style"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Exploring lifestyle, daily routines, and little joys of life. Let’s collaborate to create meaningful and relatable content.",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Anandh",
            location: "Bangalore, India",
            tags: ["Life Style"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Exploring lifestyle, daily routines, and little joys of life. Let’s collaborate to create meaningful and relatable content.",
            image: "https://placehold.co/272x271"
        },
        {
            name: "bangalore explore",
            location: "Bangalore, India",
            tags: ["Life Style"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Exploring lifestyle, daily routines, and little joys of life. Let’s collaborate to create meaningful and relatable content.",
            image: "https://placehold.co/272x271"
        },
        {
            name: "Bangalore premium",
            location: "Bangalore, India",
            tags: ["Life Style"],
            stats: { followers: "520k", posts: "136", likes: "1.6k", reach: "900" },
            bio: "Food, travel, Lifestyle",
            image: "https://placehold.co/272x271"
        }

    ];

    return (
        <div className="min-h-screen bg-white font-urbanist">
            <Header bgClass="bg-white" loginBtnClass="bg-transparent" />

            <main className="pt-8 w-full max-w-[1920px] mx-auto flex flex-col items-center px-4 md:px-12">
                {/* Page Title */}
                <div className="text-center mb-16">
                    <h1 className="text-[40px] md:text-[67px] font-freeman font-normal text-black mb-4 leading-tight">
                        Find influencers who fit your brand.
                    </h1>
                    <p className="text-[18px] font-urbanist font-normal text-black">
                        Verified profiles. Secure payments. Transparent pricing at 15%
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="w-full flexflex-wrap items-center justify-between gap-4 mb-16 max-w-[1600px] hidden md:flex">
                    {/* Search Bar */}
                    <div className="flex-grow max-w-[710px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.16)] outline outline-1 outline-[#DCDCDC] -outline-offset-1 flex items-center px-8 relative">
                        <span className="text-[#AAAAAA] text-xl font-medium font-urbanist w-full">Search by name or Bio</span>
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center absolute right-4 cursor-pointer shadow-[-1px_1px_2px_rgba(0,0,0,0.14)]">
                            <Search className="text-white w-5 h-5" />
                        </div>
                    </div>

                    {/* Categories Dropdown */}
                    <div className="w-[350px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.16)] outline outline-1 outline-[#DCDCDC] -outline-offset-1 flex items-center justify-between px-6 cursor-pointer">
                        <span className="text-black text-xl font-normal font-urbanist">All Categories</span>
                        <ChevronDown className="w-6 h-6 text-black" />
                    </div>

                    {/* Follower Dropdown */}
                    <div className="w-[189px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.16)] outline outline-1 outline-[#DCDCDC] -outline-offset-1 flex items-center justify-between px-6 cursor-pointer">
                        <span className="text-black text-xl font-normal font-roboto">Follower</span>
                        <ChevronDown className="w-6 h-6 text-black" />
                    </div>

                    {/* Any Dropdown */}
                    <div className="w-[175px] h-[72px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.16)] outline outline-1 outline-[#DCDCDC] -outline-offset-1 flex items-center justify-between px-6 cursor-pointer">
                        <span className="text-black text-xl font-normal font-roboto">Any</span>
                        <ChevronDown className="w-6 h-6 text-black" />
                    </div>
                </div>

                {/* Mobile Filter Placeholder (Simplified) */}
                <div className="md:hidden w-full mb-8">
                    <div className="w-full h-[60px] bg-[#FEFEFE] rounded-full shadow-[0px_6px_24px_rgba(0,0,0,0.16)] outline outline-1 outline-[#DCDCDC] flex items-center px-6 relative">
                        <span className="text-[#AAAAAA] text-lg font-medium font-urbanist">Search...</span>
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center absolute right-2">
                            <Search className="text-white w-4 h-4" />
                        </div>
                    </div>
                </div>


                {/* Influencer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 w-full max-w-[1600px] mb-24 place-items-center">
                    {influencers.map((influencer, index) => (
                        <div key={index} className="w-full max-w-[320px]">
                            <InfluencerCard {...influencer} />
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                <div className="mb-24">
                    <button className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-800 transition">
                        <span className="text-base font-medium font-roboto">See more</span>
                        <ChevronDown className="w-4 h-4 bg-white text-black rounded-full p-0.5" />
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
