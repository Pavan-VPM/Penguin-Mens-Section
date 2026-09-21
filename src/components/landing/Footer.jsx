import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="bg-[#fde047] relative pt-32 md:pt-56 mt-0 pb-12 overflow-hidden flex flex-col">

            <div className="max-w-[1920px] mx-auto px-8 md:px-16 relative z-10 w-full">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pt-12">

                    {/* Brand Column */}
                    <div className="space-y-8">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Penguin" className="h-16 md:h-24 w-auto object-contain" />
                        </div>
                        <p className="text-[#090909] font-urbanist text-[22px] leading-relaxed max-w-sm">
                            Premium men's fashion. Delivered to your door.
                        </p>
                        <div className="flex items-center gap-2">
                            {/* Social Icons matching design circles */}
                            <div className="w-[45px] h-[45px] rounded-full border border-[#090909] flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                                <Twitter size={20} />
                            </div>
                            <div className="w-[45px] h-[45px] rounded-full border border-[#090909] flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                                <Facebook size={20} />
                            </div>
                            <div className="w-[45px] h-[45px] rounded-full border border-[#090909] flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                                <Instagram size={20} />
                            </div>
                            <div className="w-[45px] h-[45px] rounded-full border border-[#090909] flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                                <Github size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-6">
                        <h4 className="font-freeman text-[18px] uppercase tracking-widest text-black">Shop</h4>
                        <ul className="space-y-6 font-urbanist text-[16px] md:text-[20px] text-black">
                            <li><a href="#" className="hover:underline">New Arrivals</a></li>
                            <li><a href="#" className="hover:underline">Best Sellers</a></li>
                            <li><a href="#" className="hover:underline">Collections</a></li>
                            <li><Link to="/how-it-works" className="hover:underline">How It Works</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div className="space-y-6">
                        <h4 className="font-freeman text-[18px] uppercase tracking-widest text-black">Customer Care</h4>
                        <ul className="space-y-6 font-urbanist text-[16px] md:text-[20px] text-black">
                            <li><a href="#" className="hover:underline">Size Guide</a></li>
                            <li><a href="#" className="hover:underline">Track Order</a></li>
                            <li><a href="#" className="hover:underline">Returns & Exchanges</a></li>
                            <li><a href="#" className="hover:underline">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h4 className="font-freeman text-[18px] uppercase tracking-widest text-black">Company</h4>
                        <ul className="space-y-6 font-urbanist text-[16px] md:text-[20px] text-black">
                            <li><a href="#" className="hover:underline">About Penguin</a></li>
                            <li><a href="#" className="hover:underline">Contact</a></li>
                            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Large Background Text (Full Width) */}
            <div className="w-full overflow-hidden pointer-events-none select-none flex justify-center mb-0 mt-auto">
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundImage: 'linear-gradient(180deg, #8D3DF1 0%, #AF3A94 50%, rgba(210, 55, 55, 0) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    opacity: '0.4',
                    fontSize: '13vw',
                    fontFamily: 'Roboto',
                    fontWeight: '900', // Maximum standard CSS font-weight
                    lineHeight: '0.75',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    paddingLeft: '0',
                    paddingRight: '0'
                }}>
                    {['P', 'E', 'N', 'G', 'U', 'I', 'N'].map((char, index) => (
                        <span key={index}>{char}</span>
                    ))}
                </div>
            </div>

            {/* Bottom Bar Container */}
            <div className="max-w-[1920px] mx-auto px-8 md:px-16 w-full relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center text-[16px] md:text-[20px] font-urbanist text-black pt-4 gap-4 pb-8">
                    <div>Penguin Men's Section</div>
                    <div>© 2026 Penguin</div>
                    <div>Premium men's fashion. Always.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
