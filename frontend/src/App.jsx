import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import ExitIntentPopup from './components/ExitIntentPopup'
import SpinWheel from './components/SpinWheel'
import Footer from './components/Footer'
import CookieNotice from './components/CookieNotice'

// Landing is eager-loaded (home page, first paint matters).
// Every other route is code-split so the main bundle stays lean.
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const ToolsPage = lazy(() => import('./pages/ToolsPage'))
const PromptsPage = lazy(() => import('./pages/PromptsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'))
const DownloadPage = lazy(() => import('./pages/DownloadPage'))
const BrickellPage = lazy(() => import('./pages/BrickellPage'))
const RentalApplicationPage = lazy(() => import('./pages/RentalApplicationPage'))
const ApplicationConfirmationPage = lazy(() => import('./pages/ApplicationConfirmationPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Loading"
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.08)',
          borderTopColor: '#a855f7',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
      <Footer />
      <SpinWheel />
      <ExitIntentPopup />
      <CookieNotice />
    </>
  )
}
