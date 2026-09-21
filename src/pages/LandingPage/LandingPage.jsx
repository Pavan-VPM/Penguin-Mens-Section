import Header from '../../components/layout/Header';
import Hero from '../../components/landing/Hero';
import WhyFails from '../../components/landing/WhyFails';
import WorksBetter from '../../components/landing/WorksBetter';
import FourSteps from '../../components/landing/FourSteps';
import BrandTestimonials from '../../components/landing/BrandTestimonials';
import Pricing from '../../components/landing/Pricing';
import CTA from '../../components/landing/CTA';
import Footer from '../../components/landing/Footer';
import WhyPickYourInfluencer from '../../components/navi/why_pick_ur_influencer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-purple selection:text-white overflow-x-hidden">
            <Header />
            <main>
                <Hero />
                <WhyFails />
                <WorksBetter />
                <FourSteps />
                <BrandTestimonials />
                <Pricing />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
