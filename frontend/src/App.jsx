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
        <Route path="/auth/:provider/callback" element={<OAuthCallback />} />
      <Route path="/download" element={<DownloadPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SpinWheel />
      <ExitIntentPopup />
      <StickyCTA />
    </>
  )
}
