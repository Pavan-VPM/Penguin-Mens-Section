import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage';
import WhyPickYourInfluencerPage from './pages/WhyPickYourInfluencerPage/WhyPickYourInfluencerPage';
import TopCategories from './components/navi/top_categories';
import Browse from './components/navi/browse';
// import SignUpInfluencer from './components/auth/SignUpInfluencer/SignUpInfluencer';
// import SignUpBrand from './components/auth/SignUpBrand/SignUpBrand';
// import Login from './components/auth/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/why-pick-your-influencer" element={<WhyPickYourInfluencerPage />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/top-categories" element={<TopCategories />} />
        {/* <Route path="/signup/influencer" element={<SignUpInfluencer />} />
        <Route path="/signup/brand" element={<SignUpBrand />} />
        <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

