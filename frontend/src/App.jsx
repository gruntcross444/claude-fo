import { Routes, Route, Navigate } from 'react-router-dom'
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
import DealsPage from './pages/DealsPage'
import MonetizationGuidePage from './pages/MonetizationGuidePage'
import ProtectedRoute from './components/ProtectedRoute'
import ExitIntentPopup from './components/ExitIntentPopup'
import StickyCTA from './components/StickyCTA'
import SpinWheel from './components/SpinWheel'

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
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/monetization-guide" element={<MonetizationGuidePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SpinWheel />
      <ExitIntentPopup />
      <StickyCTA />
    </>
  )
}
