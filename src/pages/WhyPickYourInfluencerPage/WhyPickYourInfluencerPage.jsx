import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/landing/Footer';
import WhyPickYourInfluencer from '../../components/navi/why_pick_ur_influencer';
import CTA from '../../components/landing/CTA';

const WhyPickYourInfluencerPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-purple selection:text-white overflow-x-hidden">
            <Header bgClass="bg-white" />
            <main>
                <WhyPickYourInfluencer />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default WhyPickYourInfluencerPage;
