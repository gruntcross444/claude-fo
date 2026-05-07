import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './i18n/LanguageContext'
import App from './App.jsx'
import './index.css'

// When the build is opened directly via `.../index.html` (preview hosts,
// static deploys under a sub-path) the pathname is `/foo/index.html`, which
// otherwise falls through every <Route> and lands on NotFoundPage. Only in
// that case do we know the prefix is a subdirectory: strip `index.html`, use
// the remainder as the router basename, and rewrite history so subsequent
// navigation stays clean. Normal deep links (`/services`) are untouched.
function resolveRouterBase() {
  if (typeof window === 'undefined') return '/'
  const { pathname } = window.location
  if (!/\/index\.html$/i.test(pathname)) return '/'
  const dir = pathname.replace(/\/index\.html$/i, '/')
  const search = window.location.search || ''
  const hash = window.location.hash || ''
  window.history.replaceState(null, '', dir + search + hash)
  const base = dir.endsWith('/') ? dir.slice(0, -1) : dir
  return base || '/'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={resolveRouterBase()}>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
