import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo copy.png';

const Header = ({ bgClass = "bg-brand-yellow", loginBtnClass = "bg-[#FCE958]" }) => {
    const navLinks = [
        { name: 'New Arrivals', path: '/browse' },
        { name: 'Collections', path: '/top-categories' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Why Penguin', path: '/why-pick-your-influencer' },
    ];

    return (
        <header className={`grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center py-8 px-4 md:px-12 w-full max-w-[1920px] mx-auto z-50 relative ${bgClass}`}>
            {/* Left Logo */}
            <div className="flex justify-start">
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="Penguin" className="h-14 md:h-20 w-auto object-contain" />
                </Link>
            </div>

            {/* Center Navigation Pill */}
            <div className="hidden md:flex justify-center">
                <div className="flex items-center gap-8 border border-[#090909] rounded-2xl px-8 py-4 bg-transparent">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="font-urbanist font-bold text-[18px] text-[#090909] hover:text-gray-700 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center justify-end gap-2 md:gap-4">
                <Link to="/login" className={`px-3 py-2 md:px-8 md:py-3 rounded-full border border-[#090909] font-urbanist font-medium text-sm md:text-[18px] text-[#090909] hover:bg-black/5 transition-colors ${loginBtnClass}`}>
                    Log in
                </Link>
                <Link to="/signup/brand" className="px-3 py-2 md:px-8 md:py-3 rounded-full bg-[#090909] text-white font-urbanist font-medium text-sm md:text-[18px] hover:bg-gray-800 transition-colors">
                    Shop Now
                </Link>
            </div>
        </header>
    );
};

export default Header;
