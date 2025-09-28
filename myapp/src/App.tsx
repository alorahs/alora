import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "./components/header";
import Footer from "./components/footer";
import ScrollToTop from "./components/scroll_to_top";
import { Toaster } from "./components/ui/toaster";

import HomePage from "./pages/Home/page";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import SignupSuccessPage from "./pages/auth/signup-success";
import LogoutPage from "./pages/auth/logout";
import NotFound from "./components/not_found";
import ProfilePage from "./pages/profile/page";
import AboutPage from "./pages/about/page";
import FaqPage from "./pages/faq/page";
import ContactPage from "./pages/contact/page";
import HelpPage from "./pages/help/page";
import ServicePage from "./pages/services/page";
import FeedbackPage from "./pages/feedback/page";
import EmailVerify from "./pages/auth/email_verify";
import { useAuth } from "./context/auth_provider";
import { ProfessionalPage } from "./pages/professional/page";
import ProfessionalProfileModal from "./components/professional-profile-modal";

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <ScrollToTop />

        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/professionals" element={<ProfessionalPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/professionals" element={<ProfessionalPage />} />
          <Route
            path="/professionals/:id"
            element={<ProfessionalProfileModal />}
          />

          {/* Auth Pages */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/signup-success" element={<SignupSuccessPage />} />
          {user && <Route path="/auth/logout" element={<LogoutPage />} />}
          <Route path="/auth/verification/email" element={<EmailVerify />} />

          {user && <Route path="/profile" element={<ProfilePage />} />}

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
