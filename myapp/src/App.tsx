import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header, Footer, ScrollToTop } from "./components/layout";
import { Toaster } from "./components/ui/toaster";
import WebSocketStatus from "./components/shared/WebSocketStatus";

import HomePage from "./pages/Home/page";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import SignupSuccessPage from "./pages/auth/signup-success";
import LogoutPage from "./pages/auth/logout";
import { NotFound } from "./components/shared";
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
import { ProfessionalProfileModal } from "./components/profile";
import BookingPage from "./pages/booking/page";
import BookingDetailsPage from "./pages/profile/booking";
import AdminDashboard from "./pages/admin/dashboard_simple";
import AdminFeedback from "./pages/admin/feedback";
import AdminReachUs from "./pages/admin/reachus";
import RatingStatsPage from "./pages/admin/RatingStatsPage";
import BookingRatingsPage from "./pages/admin/BookingRatingsPage";
import UserManagement from "./pages/admin/users";
import ServiceManagement from "./pages/admin/services";
import AboutUsAdminPage from "./pages/admin/aboutus";
import SettingsPage from "./pages/settings/page";
import ProfessionalsDashboard from "./professionals-dashboard/page";
import ProfessionalBookingDetailsPage from "./pages/professional/booking";
import ProfessionalDashboard from "./pages/professional/dashboard";
import DashboardOverview from "./pages/dashboard/overview";
// Legal pages
import PrivacyPolicyPage from "./pages/legal/privacy";
import TermsOfServicePage from "./pages/legal/terms";
import CookiePolicyPage from "./pages/legal/cookie";

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
          <Route
            path="/professionals/:id"
            element={<ProfessionalProfileModal />}
          />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/dashboard" element={<DashboardOverview />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/cookie" element={<CookiePolicyPage />} />

          {/* Auth Pages */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/signup-success" element={<SignupSuccessPage />} />
          {user && <Route path="/auth/logout" element={<LogoutPage />} />}
          <Route path="/auth/verification/email" element={<EmailVerify />} />

          {user && <Route path="/profile" element={<ProfilePage />} />}
          {user && (
            <Route
              path="/profile/booking/:id"
              element={<BookingDetailsPage />}
            />
          )}
          {user && <Route path="/settings" element={<SettingsPage />} />}
          {user && <Route path="/dashboard" element={<DashboardOverview />} />}

          {user && user.role === "admin" && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          {user && user.role === "admin" && (
            <Route path="/admin/users" element={<UserManagement />} />
          )}
          {user && user.role === "admin" && (
            <Route path="/admin/services" element={<ServiceManagement />} />
          )}
          {user && user.role === "admin" && (
            <Route path="/admin/feedback" element={<AdminFeedback />} />
          )}
          {user && user.role === "admin" && (
            <Route path="/admin/reachus" element={<AdminReachUs />} />
          )}
          {user && user.role === "admin" && (
            <Route path="/admin/rating-stats" element={<RatingStatsPage />} />
          )}
          {user && user.role === "admin" && (
            <Route
              path="/admin/booking-ratings"
              element={<BookingRatingsPage />}
            />
          )}
          {user && user.role === "admin" && (
            <Route path="/admin/aboutus" element={<AboutUsAdminPage />} />
          )}
          {user && user.role === "professional" && (
            <Route
              path="/professionals-dashboard"
              element={<ProfessionalsDashboard />}
            />
          )}
          {user && user.role === "professional" && (
            <Route
              path="/professional/dashboard"
              element={<ProfessionalDashboard />}
            />
          )}
          {user && user.role === "professional" && (
            <Route
              path="/professional/booking/:id"
              element={<ProfessionalBookingDetailsPage />}
            />
          )}

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
        <Toaster />
        <WebSocketStatus />
      </div>
    </Router>
  );
}

export default App;