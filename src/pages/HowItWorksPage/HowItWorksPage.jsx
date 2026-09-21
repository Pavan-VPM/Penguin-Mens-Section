import Header from '../../components/layout/Header';
import Footer from '../../components/landing/Footer';
import Howitworks from '../../components/navi/Howitworks';
import CTA from '../../components/landing/CTA';

const HowItWorksPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-purple selection:text-white overflow-x-hidden">
            <Header bgClass="bg-white" loginBtnClass="bg-transparent" />
            <main className=""> {/* Removed pt-20 to reduce spacing */}
                <Howitworks />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorksPage;
