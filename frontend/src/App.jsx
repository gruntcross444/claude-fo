import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PortfolioPage from './pages/PortfolioPage'
import StorePage from './pages/StorePage'
import ToolsPage from './pages/ToolsPage'
import PromptsPage from './pages/PromptsPage'
import ContactPage from './pages/ContactPage'
import OAuthCallback from './pages/OAuthCallback'
import DownloadPage from './pages/DownloadPage'
import BrickellPage from './pages/BrickellPage'
import RentalApplicationPage from './pages/RentalApplicationPage'
import ApplicationConfirmationPage from './pages/ApplicationConfirmationPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import ProtectedRoute from './components/ProtectedRoute'
import ExitIntentPopup from './components/ExitIntentPopup'
import SpinWheel from './components/SpinWheel'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/prompts" element={<PromptsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth/:provider/callback" element={<OAuthCallback />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/brickell" element={<BrickellPage />} />
        <Route path="/apply" element={<RentalApplicationPage />} />
        <Route path="/application-confirmation" element={<ApplicationConfirmationPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <SpinWheel />
      <ExitIntentPopup />
    </>
  )
}
