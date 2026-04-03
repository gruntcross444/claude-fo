# ARCHIVE_FRONTEND_VIEWS.md

Complete archive of all frontend components and pages for the Claude.FO project.

---

## COMPONENTS

---

### `frontend/src/components/Navbar.jsx`

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { t, lang, switchLang } = useLang()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function toggleLang() {
    switchLang(lang === 'en' ? 'es' : 'en')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo} onClick={closeMenu}>
        <span style={styles.logoAccent}>Claude</span>.FO
      </Link>

      {/* Desktop links */}
      <div style={styles.links}>
        <a href="/#services" style={styles.link}>{t('nav.services')}</a>
        <a href="/#features" style={styles.link}>{t('nav.features')}</a>
        <Link to="/portfolio" style={styles.link}>{t('nav.portfolio')}</Link>
        <Link to="/store" style={styles.link}>{t('nav.store')}</Link>
        <Link to="/tools" style={styles.link}>{t('nav.tools')}</Link>
        <Link to="/prompts" style={styles.link}>{t('nav.prompts')}</Link>
        <Link to="/contact" style={styles.link}>{t('nav.contact')}</Link>
      </div>

      <div style={styles.right}>
        <button onClick={toggleLang} style={styles.langToggle} title="Switch language">
          {lang === 'en' ? 'ES' : 'EN'}
        </button>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={styles.btn}>{t('nav.logout')}</button>
        ) : (
          <Link to="/login" style={styles.btnPrimary}>{t('nav.login')}</Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <span style={{ ...styles.hamburgerLine, opacity: menuOpen ? 0 : 1 }} />
        <span style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <a href="/#services" style={styles.mobileLink} onClick={closeMenu}>{t('nav.services')}</a>
          <a href="/#features" style={styles.mobileLink} onClick={closeMenu}>{t('nav.features')}</a>
          <Link to="/portfolio" style={styles.mobileLink} onClick={closeMenu}>{t('nav.portfolio')}</Link>
          <Link to="/store" style={styles.mobileLink} onClick={closeMenu}>{t('nav.store')}</Link>
          <Link to="/tools" style={styles.mobileLink} onClick={closeMenu}>{t('nav.tools')}</Link>
          <Link to="/prompts" style={styles.mobileLink} onClick={closeMenu}>{t('nav.prompts')}</Link>
          <Link to="/contact" style={styles.mobileLink} onClick={closeMenu}>{t('nav.contact')}</Link>
          <div style={styles.mobileDivider} />
          <button onClick={toggleLang} style={styles.mobileLangBtn}>
            {lang === 'en' ? 'Cambiar a Espanol' : 'Switch to English'}
          </button>
          {isAuthenticated ? (
            <button onClick={handleLogout} style={styles.mobileBtn}>{t('nav.logout')}</button>
          ) : (
            <Link to="/register" style={styles.mobileBtnPrimary} onClick={closeMenu}>{t('nav.getStarted')}</Link>
          )}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    background: 'rgba(10,11,15,0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 100,
  },
  logo: {
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#fff',
    textDecoration: 'none',
    letterSpacing: '-0.03em',
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #6366f1, #c8a76b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  links: {
    display: 'flex',
    gap: '1.8rem',
  },
  link: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
    fontWeight: 400,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  langToggle: {
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    border: '1px solid rgba(200,167,107,0.3)',
    background: 'transparent',
    color: '#c8a76b',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'all 0.2s',
  },
  btn: {
    padding: '0.45rem 1.1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  btnPrimary: {
    padding: '0.45rem 1.1rem',
    borderRadius: '8px',
    border: '1px solid rgba(99,102,241,0.4)',
    background: 'rgba(99,102,241,0.1)',
    color: '#a5b4fc',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  hamburgerLine: {
    width: '22px',
    height: '2px',
    background: '#fff',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(10,11,15,0.97)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '1.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  mobileLink: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  mobileDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
    margin: '0.5rem 0',
  },
  mobileLangBtn: {
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid rgba(200,167,107,0.3)',
    background: 'transparent',
    color: '#c8a76b',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  mobileBtn: {
    padding: '0.7rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  mobileBtnPrimary: {
    padding: '0.7rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    textAlign: 'center',
  },
}

// Inject responsive CSS for hamburger visibility
if (typeof document !== 'undefined') {
  const id = 'navbar-responsive'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @media (max-width: 768px) {
        nav > div:nth-child(2) { display: none !important; }
        nav > div:nth-child(3) { display: none !important; }
        nav > button[aria-label="Toggle menu"] { display: flex !important; }
      }
    `
    document.head.appendChild(style)
  }
}
```

---

### `frontend/src/components/ProtectedRoute.jsx`

```jsx
import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function ProtectedRoute() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) return
    api.get('/auth/me').catch(() => {
      logout()
      navigate('/register', { replace: true })
    })
  }, [isAuthenticated, logout, navigate])

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />
  }

  return <Outlet />
}
```

---

### `frontend/src/components/SocialAuth.jsx`

```jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

// ── OAuth URL builders ─────────────────────────────────────────

function discordUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
    redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI || 'http://localhost:5173/auth/discord/callback',
    response_type: 'code',
    scope: 'identify email',
  })
  return `https://discord.com/api/oauth2/authorize?${params}`
}

function googleUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

function facebookUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_FACEBOOK_APP_ID || '',
    redirect_uri: import.meta.env.VITE_FACEBOOK_REDIRECT_URI || 'http://localhost:5173/auth/facebook/callback',
    response_type: 'code',
    scope: 'email public_profile',
  })
  return `https://www.facebook.com/v19.0/dialog/oauth?${params}`
}

function appleUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_APPLE_CLIENT_ID || '',
    redirect_uri: import.meta.env.VITE_APPLE_REDIRECT_URI || 'http://localhost:5173/auth/apple/callback',
    response_type: 'code',
    scope: 'name email',
    response_mode: 'query',
  })
  return `https://appleid.apple.com/auth/authorize?${params}`
}

// ── SVG icons ──────────────────────────────────────────────────

function DiscordIcon() {
  return (
    <svg width="20" height="15" viewBox="0 0 71 55" fill="none">
      <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A26.4 26.4 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 5 .2.2 0 0010.4 5C1.5 18.3-.9 31.2.3 43.9v.1a58.7 58.7 0 0017.7 9 .2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.3 44v-.1c1.4-14.7-2.3-27.5-9.9-38.8a.2.2 0 00-.1-.1zM23.7 36c-3.4 0-6.1-3.1-6.1-6.9s2.7-6.9 6.1-6.9 6.2 3.1 6.1 6.9c0 3.8-2.7 6.9-6.1 6.9zm22.6 0c-3.4 0-6.1-3.1-6.1-6.9s2.7-6.9 6.1-6.9 6.2 3.1 6.1 6.9c0 3.8-2.7 6.9-6.1 6.9z" fill="white"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0 12 12 0 0011.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

// ── Telegram popup handler ─────────────────────────────────────

function handleTelegramLogin(login, navigate, setError) {
  const botName = import.meta.env.VITE_TELEGRAM_BOT_NAME
  if (!botName) {
    setError('Telegram bot not configured')
    return
  }
  const width = 550, height = 470
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2
  const popup = window.open(
    `https://oauth.telegram.org/auth?bot_id=${botName}&origin=${window.location.origin}&request_access=write`,
    'telegram_login',
    `width=${width},height=${height},left=${left},top=${top}`
  )

  function onMessage(e) {
    if (e.origin !== 'https://oauth.telegram.org') return
    window.removeEventListener('message', onMessage)
    if (popup) popup.close()

    const data = JSON.parse(e.data)
    if (data.event === 'auth_result' && data.result) {
      api.post('/auth/telegram', data.result)
        .then((res) => {
          login(res.data.access_token)
          navigate('/portfolio')
        })
        .catch((err) => setError(err.response?.data?.detail || 'Telegram login failed'))
    }
  }
  window.addEventListener('message', onMessage)
}

// ── Shared component ───────────────────────────────────────────

export default function SocialAuth({ setError }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()

  const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID
  const hasFacebook = !!import.meta.env.VITE_FACEBOOK_APP_ID
  const hasApple = !!import.meta.env.VITE_APPLE_CLIENT_ID
  const hasDiscord = !!import.meta.env.VITE_DISCORD_CLIENT_ID
  const hasTelegram = !!import.meta.env.VITE_TELEGRAM_BOT_NAME

  const hasAny = hasGoogle || hasFacebook || hasApple || hasDiscord || hasTelegram
  if (!hasAny) return null

  return (
    <>
      <div style={styles.divider}>
        <span style={styles.dividerLine} />
        <span style={styles.dividerText}>{t('auth.orContinue')}</span>
        <span style={styles.dividerLine} />
      </div>

      <div style={styles.socialGrid}>
        {hasDiscord && (
          <a href={discordUrl()} style={{ ...styles.socialBtn, background: '#5865F2', gridColumn: hasGoogle || hasFacebook || hasApple ? undefined : '1 / -1' }}>
            <DiscordIcon /> Discord
          </a>
        )}
        {hasGoogle && (
          <a href={googleUrl()} style={{ ...styles.socialBtn, background: '#444' }}>
            <GoogleIcon /> Google
          </a>
        )}
        {hasFacebook && (
          <a href={facebookUrl()} style={{ ...styles.socialBtn, background: '#1877F2' }}>
            <FacebookIcon /> Facebook
          </a>
        )}
        {hasApple && (
          <a href={appleUrl()} style={{ ...styles.socialBtn, background: '#000' }}>
            <AppleIcon /> iCloud
          </a>
        )}
        {hasTelegram && (
          <button
            type="button"
            onClick={() => handleTelegramLogin(login, navigate, setError)}
            style={{ ...styles.socialBtn, background: '#2AABEE', border: 'none', gridColumn: '1 / -1' }}
          >
            <TelegramIcon /> Telegram
          </button>
        )}
      </div>
    </>
  )
}

const styles = {
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '1.5rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: '#666',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem',
    marginBottom: '1.5rem',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0.65rem 0.8rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontWeight: 500,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },
}
```

---

### `frontend/src/components/EmailGate.jsx`

```jsx
import { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'
import api from '../api'
import { useLang } from '../i18n/LanguageContext'

export default function EmailGate({ source, children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('email_unlocked') === 'true')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useLang()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !email.includes('@')) {
      setError(t('emailGate.error'))
      return
    }
    setLoading(true)
    // Fire the lead capture but don't wait forever — unlock after 3s max
    const unlock = () => {
      sessionStorage.setItem('email_unlocked', 'true')
      setUnlocked(true)
      setLoading(false)
    }
    const timeout = setTimeout(unlock, 3000)
    try {
      await api.post('/leads', { email, source: source || 'tool' })
    } catch {
      // Still unlock — the lead might already exist or network hiccup
    }
    clearTimeout(timeout)
    unlock()
  }

  if (unlocked) return children

  return (
    <div style={styles.gate}>
      <div style={styles.blurContent}>{children}</div>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>
            <Mail size={28} color="#c8a76b" strokeWidth={1.5} />
          </div>
          <h3 style={styles.heading}>{t('emailGate.heading')}</h3>
          <p style={styles.sub}>{t('emailGate.sub')}</p>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? t('emailGate.unlocking') : t('emailGate.btn')} {!loading && <ArrowRight size={14} />}
            </button>
          </form>
          <p style={styles.privacy}>{t('emailGate.privacy')}</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  gate: { position: 'relative' },
  blurContent: { filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' },
  overlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(4px)', borderRadius: '12px' },
  card: { textAlign: 'center', padding: '2.5rem', maxWidth: '380px' },
  iconWrap: { width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  heading: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' },
  sub: { color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 },
  error: { color: '#f87171', fontSize: '0.85rem', marginBottom: '0.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none', textAlign: 'center' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.7rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
  privacy: { fontSize: '0.75rem', color: '#555', marginTop: '1rem' },
}
```

---

### `frontend/src/components/ExitIntentPopup.jsx`

```jsx
import { useState, useEffect } from 'react'
import { Gift, X, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { useLang } from '../i18n/LanguageContext'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  useEffect(() => {
    if (isAuthenticated) return
    if (sessionStorage.getItem('exit_popup_shown')) return

    function handleMouseLeave(e) {
      if (e.clientY < 5) {
        setShow(true)
        sessionStorage.setItem('exit_popup_shown', 'true')
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isAuthenticated])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/leads', { email, source: 'exit_popup' })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div style={styles.backdrop} onClick={() => setShow(false)}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} style={styles.closeBtn}><X size={18} /></button>

        {!submitted ? (
          <>
            <div style={styles.iconWrap}>
              <Gift size={32} color="#c8a76b" strokeWidth={1.5} />
            </div>
            <h2 style={styles.heading}>{t('exitPopup.heading')}</h2>
            <p style={styles.sub} dangerouslySetInnerHTML={{ __html: t('exitPopup.sub') }} />
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={styles.input}
              />
              <button type="submit" disabled={loading} style={styles.btn}>
                {loading ? t('exitPopup.sending') : t('exitPopup.btn')} {!loading && <ArrowRight size={14} />}
              </button>
            </form>
            <p style={styles.privacy}>{t('exitPopup.privacy')}</p>
          </>
        ) : (
          <>
            <div style={styles.iconWrap}>
              <Gift size={32} color="#10b981" strokeWidth={1.5} />
            </div>
            <h2 style={styles.heading}>{t('exitPopup.successHeading')}</h2>
            <p style={styles.sub}>{t('exitPopup.successSub')}</p>
            <button onClick={() => setShow(false)} style={styles.btn}>{t('exitPopup.continue')}</button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' },
  modal: { background: '#13141a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', maxWidth: '420px', width: '100%', textAlign: 'center', position: 'relative' },
  closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' },
  iconWrap: { width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' },
  heading: { fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.8rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  privacy: { fontSize: '0.75rem', color: '#555', marginTop: '1rem' },
}
```

---

### `frontend/src/components/StickyCTA.jsx`

```jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'

const HIDDEN_PATHS = ['/login', '/register', '/contact', '/auth']

export default function StickyCTA() {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('cta_dismissed') === 'true')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLang()

  if (dismissed) return null
  if (HIDDEN_PATHS.some((p) => location.pathname.startsWith(p))) return null

  function handleDismiss() {
    sessionStorage.setItem('cta_dismissed', 'true')
    setDismissed(true)
  }

  return (
    <div style={styles.bar}>
      <div style={styles.inner}>
        <p style={styles.text}>
          {t('stickyCta.text')}
        </p>
        <button
          style={styles.btn}
          onClick={() => navigate(isAuthenticated ? '/contact' : '/register')}
        >
          {isAuthenticated ? t('stickyCta.btnAuth') : t('stickyCta.btn')} <ArrowRight size={14} />
        </button>
        <button onClick={handleDismiss} style={styles.close} aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

const styles = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(10,11,15,0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(200,167,107,0.2)',
    zIndex: 900,
    padding: '0.7rem 1rem',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  text: {
    color: '#aaa',
    fontSize: '0.9rem',
    margin: 0,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  close: {
    background: 'none',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    padding: '4px',
  },
}
```

---

### `frontend/src/components/SpinWheel.jsx`

```jsx
import { useState, useRef } from 'react'
import { Gift, X, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { useLang } from '../i18n/LanguageContext'

const PRIZES = [
  { label: '50% OFF', color: '#c8a76b', weight: 1 },
  { label: '5% OFF', color: '#6366f1', weight: 15 },
  { label: 'Free Tool', color: '#10b981', weight: 10 },
  { label: '15% OFF', color: '#a855f7', weight: 8 },
  { label: '10% OFF', color: '#f59e0b', weight: 12 },
  { label: 'Try Again', color: '#444', weight: 20 },
  { label: '25% OFF', color: '#ec4899', weight: 3 },
  { label: '5% OFF', color: '#6366f1', weight: 15 },
  { label: 'Free Guide', color: '#14b8a6', weight: 8 },
  { label: '20% OFF', color: '#8b5cf6', weight: 5 },
  { label: '10% OFF', color: '#f59e0b', weight: 12 },
  { label: 'Free Prompt Pack', color: '#f43f5e', weight: 6 },
]

function getWeightedIndex() {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0)
  let random = Math.random() * totalWeight
  for (let i = 0; i < PRIZES.length; i++) {
    random -= PRIZES[i].weight
    if (random <= 0) return i
  }
  return 0
}

export default function SpinWheel() {
  const [show, setShow] = useState(() => {
    if (sessionStorage.getItem('wheel_shown')) return false
    sessionStorage.setItem('wheel_shown', 'true')
    return true
  })
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('email') // email → spinning → result
  const [rotation, setRotation] = useState(0)
  const [prize, setPrize] = useState(null)
  const [loading, setLoading] = useState(false)
  const wheelRef = useRef(null)
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  if (!show || isAuthenticated) return null

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/leads', { email, source: 'spin_wheel' })
    } catch { /* already captured */ }
    setLoading(false)

    const winIndex = getWeightedIndex()
    const segmentAngle = 360 / PRIZES.length
    const targetAngle = 360 - (winIndex * segmentAngle + segmentAngle / 2)
    const fullSpins = 360 * 8
    const finalRotation = fullSpins + targetAngle

    setPrize(PRIZES[winIndex])
    setRotation(0)
    setPhase('spinning')

    // Delay rotation by 1 frame so the browser registers the transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRotation(finalRotation)
      })
    })

    setTimeout(() => {
      setPhase('result')
    }, 5500)
  }

  const segAngle = 360 / PRIZES.length

  return (
    <div style={s.backdrop}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} style={s.closeBtn}><X size={18} /></button>

        {phase === 'email' && (
          <div style={s.emailPhase}>
            <div style={s.giftIcon}><Gift size={36} color="#c8a76b" strokeWidth={1.5} /></div>
            <h2 style={s.heading}>{t('spinWheel.heading')}</h2>
            <p style={s.sub} dangerouslySetInnerHTML={{ __html: t('spinWheel.sub') }} />
            <form onSubmit={handleEmailSubmit} style={s.form}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={s.input} />
              <button type="submit" disabled={loading} style={s.spinStartBtn}>
                {loading ? t('spinWheel.loading') : t('spinWheel.btn')} {!loading && <ArrowRight size={14} />}
              </button>
            </form>
          </div>
        )}

        {(phase === 'spinning' || phase === 'result') && (
          <div style={s.wheelPhase}>
            <div style={s.wheelContainer}>
              {/* Pointer */}
              <div style={{ ...s.pointer, animation: phase === 'spinning' && rotation > 0 ? 'pointerPulse 0.15s infinite alternate' : 'none' }}>&#9660;</div>
              {/* Wheel */}
              <svg
                ref={wheelRef}
                width="300"
                height="300"
                viewBox="0 0 300 300"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: phase === 'spinning' && rotation > 0 ? 'transform 5s cubic-bezier(0.15, 0.60, 0.08, 1.00)' : 'none',
                  filter: phase === 'spinning' && rotation > 0 ? 'drop-shadow(0 0 20px rgba(200,167,107,0.3))' : 'none',
                }}
              >
                {PRIZES.map((p, i) => {
                  const startAngle = (i * segAngle * Math.PI) / 180
                  const endAngle = ((i + 1) * segAngle * Math.PI) / 180
                  const x1 = 150 + 140 * Math.cos(startAngle)
                  const y1 = 150 + 140 * Math.sin(startAngle)
                  const x2 = 150 + 140 * Math.cos(endAngle)
                  const y2 = 150 + 140 * Math.sin(endAngle)
                  const midAngle = ((i + 0.5) * segAngle * Math.PI) / 180
                  const tx = 150 + 90 * Math.cos(midAngle)
                  const ty = 150 + 90 * Math.sin(midAngle)
                  const textRotation = (i + 0.5) * segAngle

                  return (
                    <g key={i}>
                      <path
                        d={`M150,150 L${x1},${y1} A140,140 0 0,1 ${x2},${y2} Z`}
                        fill={p.color}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1"
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="white"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                      >
                        {p.label}
                      </text>
                    </g>
                  )
                })}
                <circle cx="150" cy="150" r="20" fill="#13141a" stroke="rgba(200,167,107,0.5)" strokeWidth="2" />
              </svg>
            </div>

            {phase === 'result' && prize && (
              <div style={s.resultSection}>
                <h2 style={s.resultHeading}>
                  {prize.label === 'Try Again' ? t('spinWheel.lostHeading') : t('spinWheel.wonHeading')}
                </h2>
                <div style={{ ...s.prizeDisplay, borderColor: prize.color }}>
                  <span style={{ ...s.prizeText, color: prize.color }}>{prize.label}</span>
                </div>
                <p style={s.resultSub}>
                  {prize.label === 'Try Again'
                    ? t('spinWheel.lostSub')
                    : t('spinWheel.wonSub')
                  }
                </p>
                <button onClick={() => setShow(false)} style={s.doneBtn}>
                  {prize.label === 'Try Again' ? t('spinWheel.lostBtn') : t('spinWheel.wonBtn')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' },
  modal: { background: '#13141a', border: '1px solid rgba(200,167,107,0.2)', borderRadius: '24px', padding: '2rem', maxWidth: '440px', width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', zIndex: 10 },

  emailPhase: { padding: '1rem 0' },
  giftIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
  heading: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center' },
  spinStartBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },

  wheelPhase: { padding: '0.5rem 0' },
  wheelContainer: { position: 'relative', width: '300px', height: '300px', margin: '0 auto 1.5rem' },
  pointer: { position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '24px', color: '#c8a76b', zIndex: 5, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' },

  resultSection: { padding: '0.5rem 0', animation: 'fadeInUp 0.5s ease' },
  resultHeading: { fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem' },
  prizeDisplay: { display: 'inline-block', padding: '0.6rem 2rem', borderRadius: '12px', border: '2px solid', background: 'rgba(255,255,255,0.03)', marginBottom: '1rem' },
  prizeText: { fontSize: '1.5rem', fontWeight: 800 },
  resultSub: { color: '#888', fontSize: '0.9rem', marginBottom: '1.2rem' },
  doneBtn: { padding: '0.7rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
}
```

---

## SECTIONS

---

### `frontend/src/components/sections/ServicesSection.jsx`

```jsx
import { Code2, Building2, Palette, Bot, Smartphone } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useLang } from '../../i18n/LanguageContext'

function ServiceCard({ Icon, title, description, accent, delay }) {
  const [ref, visible] = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      style={{
        ...styles.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease ${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}44`
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 12px 40px ${accent}15`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ ...styles.iconWrap, background: `${accent}15`, border: `1px solid ${accent}30` }}>
        <Icon size={24} color={accent} strokeWidth={1.5} />
      </div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{description}</p>
      <div style={{ ...styles.cardLine, background: accent }} />
    </div>
  )
}

export default function ServicesSection() {
  const { t } = useLang()

  const services = [
    { Icon: Code2, title: t('services.webDev.title'), description: t('services.webDev.desc'), accent: '#6366f1' },
    { Icon: Building2, title: t('services.realEstate.title'), description: t('services.realEstate.desc'), accent: '#c8a76b' },
    { Icon: Palette, title: t('services.branding.title'), description: t('services.branding.desc'), accent: '#a855f7' },
    { Icon: Bot, title: t('services.ai.title'), description: t('services.ai.desc'), accent: '#14b8a6' },
    { Icon: Smartphone, title: t('services.mobile.title'), description: t('services.mobile.desc'), accent: '#f59e0b' },
  ]

  return (
    <section id="services" style={styles.section}>
      <h2 style={styles.heading}>{t('services.heading')}</h2>
      <p style={styles.subheading}>{t('services.sub')}</p>
      <div style={styles.grid}>
        {services.map((s, i) => (
          <ServiceCard key={s.title} {...s} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: { padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' },
  heading: { fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' },
  subheading: { color: '#666', marginBottom: '3rem', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' },
  card: { padding: '2rem 1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'left', cursor: 'default', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' },
  iconWrap: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem' },
  cardText: { color: '#777', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 },
  cardLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', opacity: 0.5 },
}
```

---

### `frontend/src/components/sections/FeaturesSection.jsx`

```jsx
import { Zap, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useLang } from '../../i18n/LanguageContext'

function FeatureItem({ Icon, title, description, color, delay }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        ...styles.item,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `all 0.6s ease ${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
      }}
    >
      <div style={{ ...styles.iconWrap, background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={20} color={color} strokeWidth={1.5} />
      </div>
      <div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.text}>{description}</p>
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  const { t } = useLang()

  const features = [
    { Icon: Zap, title: t('features.fast.title'), description: t('features.fast.desc'), color: '#f59e0b' },
    { Icon: ShieldCheck, title: t('features.secure.title'), description: t('features.secure.desc'), color: '#10b981' },
    { Icon: Sparkles, title: t('features.clean.title'), description: t('features.clean.desc'), color: '#a855f7' },
    { Icon: MessageCircle, title: t('features.comms.title'), description: t('features.comms.desc'), color: '#6366f1' },
  ]

  return (
    <section id="features" style={styles.section}>
      <h2 style={styles.heading}>{t('features.heading')}</h2>
      <p style={styles.subheading}>{t('features.sub')}</p>
      <div style={styles.grid}>
        {features.map((f, i) => (
          <FeatureItem key={f.title} {...f} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: { padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' },
  heading: { fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' },
  subheading: { color: '#666', marginBottom: '3rem', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', textAlign: 'left' },
  item: { display: 'flex', gap: '1rem', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', alignItems: 'flex-start', cursor: 'default', transition: 'all 0.3s ease' },
  iconWrap: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { fontSize: '1rem', fontWeight: 600, margin: '0 0 0.4rem 0' },
  text: { color: '#777', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 },
}
```

---

### `frontend/src/components/sections/PortfolioTeaser.jsx`

```jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../i18n/LanguageContext'

const teaserProjects = [
  { title: 'Project Alpha', category: 'Web App', color: '#6366f1' },
  { title: 'Project Beta', category: 'Mobile', color: '#8b5cf6' },
  { title: 'Project Gamma', category: 'Design', color: '#a855f7' },
]

export default function PortfolioTeaser() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  return (
    <section id="portfolio" style={styles.section}>
      <h2 style={styles.heading}>{t('portfolioTeaser.heading')}</h2>
      <p style={styles.subheading}>{t('portfolioTeaser.sub')}</p>

      <div style={styles.grid}>
        {teaserProjects.map((p) => (
          <div key={p.title} style={styles.card}>
            <div style={{ ...styles.cardBg, background: p.color }} />
            <div style={styles.blur} />
            <div style={styles.cardContent}>
              <span style={styles.category}>{p.category}</span>
              <h3 style={styles.cardTitle}>{p.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.cta}>
        <p style={styles.ctaText}>{t('portfolioTeaser.ctaText')}</p>
        <button
          style={styles.ctaBtn}
          onClick={() => navigate(isAuthenticated ? '/portfolio' : '/register')}
        >
          {isAuthenticated ? t('portfolioTeaser.ctaAuth') : t('portfolioTeaser.cta')}
        </button>
      </div>
    </section>
  )
}

const styles = {
  section: {
    padding: '5rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  subheading: {
    color: '#888',
    marginBottom: '3rem',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
    position: 'relative',
  },
  card: {
    position: 'relative',
    height: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  cardBg: {
    position: 'absolute',
    inset: 0,
    opacity: 0.3,
  },
  blur: {
    position: 'absolute',
    inset: 0,
    backdropFilter: 'blur(12px)',
    background: 'rgba(0,0,0,0.4)',
  },
  cardContent: {
    position: 'relative',
    padding: '1.5rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    filter: 'blur(4px)',
    userSelect: 'none',
  },
  category: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#aaa',
    marginBottom: '0.3rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    margin: 0,
  },
  cta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  ctaText: {
    color: '#888',
    margin: 0,
  },
  ctaBtn: {
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
}
```

---

## TOOLS

---

### `frontend/src/components/tools/MortgageCalculator.jsx`

```jsx
import { useState } from 'react'

export default function MortgageCalculator() {
  const [price, setPrice] = useState(350000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)

  const loanAmount = price * (1 - down / 100)
  const monthlyRate = rate / 100 / 12
  const numPayments = term * 12
  const monthly = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments
  const totalPaid = monthly * numPayments
  const totalInterest = totalPaid - loanAmount

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Mortgage Calculator</h3>
      <p style={styles.desc}>Estimate your monthly payment</p>

      <div style={styles.fields}>
        <label style={styles.label}>
          Home Price
          <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          Down Payment (%)
          <input type="number" value={down} onChange={(e) => setDown(+e.target.value)} style={styles.input} min={0} max={100} />
        </label>
        <label style={styles.label}>
          Interest Rate (%)
          <input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} style={styles.input} step={0.1} />
        </label>
        <label style={styles.label}>
          Loan Term (years)
          <input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} style={styles.input} />
        </label>
      </div>

      <div style={styles.results}>
        <div style={styles.resultMain}>
          <span style={styles.resultLabel}>Monthly Payment</span>
          <span style={styles.resultValue}>${monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={styles.resultRow}>
          <div><span style={styles.small}>Loan Amount</span><br />${loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div><span style={styles.small}>Total Interest</span><br />${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div><span style={styles.small}>Total Paid</span><br />${totalPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  fields: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#aaa' },
  input: { padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '1rem', outline: 'none' },
  results: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.5rem' },
  resultMain: { textAlign: 'center', marginBottom: '1rem' },
  resultLabel: { fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.3rem' },
  resultValue: { fontSize: '2.2rem', fontWeight: 800, color: '#a5b4fc' },
  resultRow: { display: 'flex', justifyContent: 'space-around', textAlign: 'center', fontSize: '0.9rem' },
  small: { fontSize: '0.75rem', color: '#666' },
}
```

---

### `frontend/src/components/tools/RecastCalculator.jsx`

```jsx
import { useState } from 'react'

export default function RecastCalculator() {
  const [balance, setBalance] = useState(280000)
  const [rate, setRate] = useState(6.5)
  const [remaining, setRemaining] = useState(25)
  const [lumpSum, setLumpSum] = useState(50000)

  const monthlyRate = rate / 100 / 12
  const numPayments = remaining * 12

  const currentMonthly = monthlyRate > 0
    ? (balance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : balance / numPayments

  const newBalance = Math.max(0, balance - lumpSum)
  const newMonthly = monthlyRate > 0 && newBalance > 0
    ? (newBalance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0

  const savings = Math.max(0, currentMonthly - newMonthly)

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Recast Calculator</h3>
      <p style={styles.desc}>See your new payment after a lump-sum principal reduction</p>

      <div style={styles.fields}>
        <label style={styles.label}>
          Current Balance
          <input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          Interest Rate (%)
          <input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} style={styles.input} step={0.1} />
        </label>
        <label style={styles.label}>
          Years Remaining
          <input type="number" value={remaining} onChange={(e) => setRemaining(+e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          Lump Sum Payment
          <input type="number" value={lumpSum} onChange={(e) => setLumpSum(+e.target.value)} style={styles.input} />
        </label>
      </div>

      <div style={styles.results}>
        <div style={styles.row}>
          <div style={styles.col}>
            <span style={styles.small}>Current Payment</span>
            <span style={styles.val}>${currentMonthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
          <div style={styles.arrow}>→</div>
          <div style={styles.col}>
            <span style={styles.small}>New Payment</span>
            <span style={{ ...styles.val, color: '#6ee7b7' }}>${Math.max(0, newMonthly).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
        <div style={styles.savingsRow}>
          You save <strong>${savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo</strong> — that&apos;s <strong>${(savings * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}/year</strong>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  fields: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#aaa' },
  input: { padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '1rem', outline: 'none' },
  results: { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1.5rem' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' },
  col: { textAlign: 'center' },
  arrow: { fontSize: '1.5rem', color: '#666' },
  small: { fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' },
  val: { fontSize: '1.8rem', fontWeight: 800 },
  savingsRow: { textAlign: 'center', fontSize: '0.9rem', color: '#999', background: 'rgba(16,185,129,0.1)', padding: '0.7rem', borderRadius: '8px' },
}
```

---

### `frontend/src/components/tools/FirstHomeChecklist.jsx`

```jsx
import { useState } from 'react'

const ITEMS = [
  { id: 1, text: 'Check your credit score (aim for 620+, ideally 740+)', tip: 'Free at annualcreditreport.com' },
  { id: 2, text: 'Save for a down payment (3–20% of home price)', tip: 'FHA loans require as little as 3.5%' },
  { id: 3, text: 'Get pre-approved for a mortgage', tip: 'Shows sellers you are a serious buyer' },
  { id: 4, text: 'Calculate your debt-to-income ratio (below 43%)', tip: 'Monthly debts / gross monthly income' },
  { id: 5, text: 'Budget for closing costs (2–5% of loan amount)', tip: 'Includes appraisal, title, and lender fees' },
  { id: 6, text: 'Build an emergency fund (3–6 months of expenses)', tip: 'Separate from your down payment savings' },
  { id: 7, text: 'Research first-time buyer programs in your state', tip: 'Many offer down payment assistance or lower rates' },
  { id: 8, text: 'Gather documents (W-2s, tax returns, bank statements)', tip: 'Lenders typically need the last 2 years' },
  { id: 9, text: 'Hire a real estate agent', tip: 'Buyer agents are usually free — the seller pays' },
  { id: 10, text: 'Get a home inspection before closing', tip: 'Can save you from costly surprises' },
]

export default function FirstHomeChecklist() {
  const [checked, setChecked] = useState({})

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round((done / ITEMS.length) * 100)

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>First Home Checklist</h3>
      <p style={styles.desc}>10 steps to buying your first home</p>

      <div style={styles.progressWrap}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${pct}%` }} />
        </div>
        <span style={styles.progressText}>{done}/{ITEMS.length} complete</span>
      </div>

      <div style={styles.list}>
        {ITEMS.map((item) => (
          <div
            key={item.id}
            role="checkbox"
            aria-checked={!!checked[item.id]}
            tabIndex={0}
            style={{ ...styles.item, opacity: checked[item.id] ? 0.6 : 1 }}
            onClick={() => toggle(item.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(item.id) } }}
          >
            <span style={{ ...styles.checkbox, ...(checked[item.id] ? styles.checked : {}) }}>
              {checked[item.id] ? '✓' : ''}
            </span>
            <div>
              <span style={{ textDecoration: checked[item.id] ? 'line-through' : 'none' }}>{item.text}</span>
              <span style={styles.tip}>{item.tip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  progressBar: { flex: 1, height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.3s' },
  progressText: { fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item: { display: 'flex', gap: '0.8rem', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', alignItems: 'flex-start', transition: 'opacity 0.2s', fontSize: '0.9rem' },
  checkbox: { width: '22px', height: '22px', borderRadius: '6px', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', marginTop: '1px' },
  checked: { background: '#6366f1', borderColor: '#6366f1', color: '#fff' },
  tip: { display: 'block', fontSize: '0.78rem', color: '#666', marginTop: '0.2rem' },
}
```

---

### `frontend/src/components/tools/RentVsBuy.jsx`

```jsx
import { useState } from 'react'

export default function RentVsBuy() {
  const [rent, setRent] = useState(2200)
  const [homePrice, setHomePrice] = useState(350000)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(5)
  const [rentIncrease, setRentIncrease] = useState(3)

  const down = homePrice * (downPct / 100)
  const loan = homePrice - down
  const monthlyRate = rate / 100 / 12
  const n = 30 * 12
  const mortgage = monthlyRate > 0
    ? (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    : loan / n
  const monthlyOwn = mortgage + homePrice * 0.012 / 12 + 150 // tax + insurance estimate

  let totalRent = 0
  let monthlyRent = rent
  for (let y = 0; y < years; y++) {
    totalRent += monthlyRent * 12
    monthlyRent *= 1 + rentIncrease / 100
  }

  const totalOwn = monthlyOwn * years * 12
  // Calculate actual principal paid via amortization
  let remainingLoan = loan
  let principalPaid = 0
  for (let i = 0; i < years * 12; i++) {
    const interestPayment = remainingLoan * monthlyRate
    const principalPayment = mortgage - interestPayment
    principalPaid += principalPayment
    remainingLoan -= principalPayment
  }
  const equity = principalPaid + down
  const netOwn = totalOwn - equity
  const better = netOwn < totalRent ? 'buy' : 'rent'
  const diff = Math.abs(totalRent - netOwn)

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Rent vs Buy Comparison</h3>
      <p style={styles.desc}>Compare total costs over time</p>

      <div style={styles.fields}>
        <label style={styles.label}>Monthly Rent<input type="number" value={rent} onChange={(e) => setRent(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Home Price<input type="number" value={homePrice} onChange={(e) => setHomePrice(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Down Payment (%)<input type="number" value={downPct} onChange={(e) => setDownPct(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Interest Rate (%)<input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} style={styles.input} step={0.1} /></label>
        <label style={styles.label}>Compare Over (years)<input type="number" value={years} onChange={(e) => setYears(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Annual Rent Increase (%)<input type="number" value={rentIncrease} onChange={(e) => setRentIncrease(+e.target.value)} style={styles.input} /></label>
      </div>

      <div style={styles.comparison}>
        <div style={{ ...styles.colCard, borderColor: better === 'rent' ? '#6366f1' : 'rgba(255,255,255,0.1)' }}>
          <span style={styles.colTitle}>Renting</span>
          <span style={styles.colValue}>${totalRent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          <span style={styles.colSub}>total over {years} years</span>
          <span style={styles.colDetail}>Equity built: $0</span>
        </div>
        <div style={styles.vs}>VS</div>
        <div style={{ ...styles.colCard, borderColor: better === 'buy' ? '#10b981' : 'rgba(255,255,255,0.1)' }}>
          <span style={styles.colTitle}>Buying</span>
          <span style={styles.colValue}>${totalOwn.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          <span style={styles.colSub}>total over {years} years</span>
          <span style={styles.colDetail}>Est. equity: ${equity.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      <div style={styles.verdict}>
        {better === 'buy'
          ? `Buying saves you ~$${diff.toLocaleString('en-US', { maximumFractionDigits: 0 })} over ${years} years (net of equity)`
          : `Renting saves you ~$${diff.toLocaleString('en-US', { maximumFractionDigits: 0 })} over ${years} years`
        }
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  fields: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#aaa' },
  input: { padding: '0.55rem 0.7rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '0.95rem', outline: 'none' },
  comparison: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  colCard: { flex: 1, textAlign: 'center', padding: '1.2rem', borderRadius: '12px', border: '2px solid', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  colTitle: { fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' },
  colValue: { fontSize: '1.5rem', fontWeight: 800 },
  colSub: { fontSize: '0.75rem', color: '#666' },
  colDetail: { fontSize: '0.78rem', color: '#999', marginTop: '0.3rem' },
  vs: { fontSize: '0.9rem', fontWeight: 700, color: '#555' },
  verdict: { textAlign: 'center', fontSize: '0.9rem', color: '#6ee7b7', background: 'rgba(16,185,129,0.08)', padding: '0.8rem', borderRadius: '10px', fontWeight: 500 },
}
```

---

### `frontend/src/components/tools/PreQualQuiz.jsx`

```jsx
import { useState } from 'react'

const QUESTIONS = [
  {
    q: 'What is your annual household income?',
    options: ['Under $40,000', '$40,000 – $75,000', '$75,000 – $120,000', '$120,000+'],
    scores: [1, 2, 3, 4],
  },
  {
    q: 'How much do you have saved for a down payment?',
    options: ['Under $5,000', '$5,000 – $20,000', '$20,000 – $50,000', '$50,000+'],
    scores: [1, 2, 3, 4],
  },
  {
    q: 'What is your credit score range?',
    options: ['Below 580', '580 – 619', '620 – 739', '740+'],
    scores: [1, 2, 3, 4],
  },
  {
    q: 'What is your current debt-to-income ratio?',
    options: ['Over 50%', '43% – 50%', '36% – 43%', 'Under 36%'],
    scores: [1, 2, 3, 4],
  },
  {
    q: 'How long have you been at your current job?',
    options: ['Less than 6 months', '6 months – 1 year', '1 – 2 years', '2+ years'],
    scores: [1, 2, 3, 4],
  },
]

function getResult(score) {
  const max = QUESTIONS.length * 4
  const pct = (score / max) * 100
  if (pct >= 80) return { label: 'Strong Candidate', color: '#10b981', text: 'You are in a great position to buy. Talk to a lender and get pre-approved!' }
  if (pct >= 60) return { label: 'Good Candidate', color: '#6366f1', text: 'You are on the right track. A few improvements could strengthen your application.' }
  if (pct >= 40) return { label: 'Getting There', color: '#f59e0b', text: 'Focus on building savings and improving your credit score before applying.' }
  return { label: 'Needs Preparation', color: '#f43f5e', text: 'Consider working on your finances for 6–12 months before starting the home buying process.' }
}

export default function PreQualQuiz() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const done = current >= QUESTIONS.length
  const score = answers.reduce((a, b) => a + b, 0)
  const result = done ? getResult(score) : null

  function next() {
    if (selected === null) return
    setAnswers([...answers, QUESTIONS[current].scores[selected]])
    setSelected(null)
    setCurrent(current + 1)
  }

  function reset() {
    setCurrent(0)
    setAnswers([])
    setSelected(null)
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Pre-Qualification Self Assessment</h3>
      <p style={styles.desc}>Find out if you are ready to buy a home</p>

      {!done ? (
        <>
          <div style={styles.progress}>
            <span style={styles.step}>Question {current + 1} of {QUESTIONS.length}</span>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${(current / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>

          <p style={styles.question}>{QUESTIONS[current].q}</p>

          <div style={styles.options}>
            {QUESTIONS[current].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{ ...styles.option, ...(selected === i ? styles.optionSelected : {}) }}
              >
                {opt}
              </button>
            ))}
          </div>

          <button onClick={next} disabled={selected === null} style={{ ...styles.nextBtn, opacity: selected === null ? 0.4 : 1 }}>
            {current === QUESTIONS.length - 1 ? 'See Results' : 'Next'}
          </button>
        </>
      ) : (
        <div style={styles.resultCard}>
          <div style={{ ...styles.resultBadge, background: result.color }}>{result.label}</div>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNumber}>{score}</span>
            <span style={styles.scoreMax}>/{QUESTIONS.length * 4}</span>
          </div>
          <p style={styles.resultText}>{result.text}</p>
          <button onClick={reset} style={styles.retakeBtn}>Retake Quiz</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  progress: { marginBottom: '1.5rem' },
  step: { fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.5rem' },
  progressBar: { height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.3s' },
  question: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem' },
  options: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' },
  option: { padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'inherit', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
  optionSelected: { borderColor: '#6366f1', background: 'rgba(99,102,241,0.15)' },
  nextBtn: { padding: '0.7rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', width: '100%' },
  resultCard: { textAlign: 'center', padding: '1rem 0' },
  resultBadge: { display: 'inline-block', padding: '0.4rem 1.2rem', borderRadius: '999px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' },
  scoreCircle: { marginBottom: '1rem' },
  scoreNumber: { fontSize: '3rem', fontWeight: 800 },
  scoreMax: { fontSize: '1.2rem', color: '#666' },
  resultText: { color: '#999', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' },
  retakeBtn: { padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '0.9rem' },
}
```

---

## PAGES

---

### `frontend/src/pages/LandingPage.jsx`

```jsx
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowRight, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import ServicesSection from '../components/sections/ServicesSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import PortfolioTeaser from '../components/sections/PortfolioTeaser'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import useTypingEffect from '../hooks/useTypingEffect'
import useCounter from '../hooks/useCounter'
import useScrollReveal from '../hooks/useScrollReveal'

function StatCounter({ label, value, suffix }) {
  const [ref, count] = useCounter(value, 2000)
  return (
    <div ref={ref} style={statStyles.item}>
      <span style={statStyles.number}>{count}{suffix}</span>
      <span style={statStyles.label}>{label}</span>
    </div>
  )
}

function RevealSection({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function ScrollHint() {
  return (
    <div style={styles.scrollHint}>
      <ChevronDown size={20} color="#555" style={{ animation: 'bounce 2s infinite' }} />
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  const typingWords = t('typingWords')
  const typedText = useTypingEffect(typingWords, 90, 50, 1800)

  const STATS = [
    { label: t('stats.projects'), value: 50, suffix: '+' },
    { label: t('stats.clients'), value: 30, suffix: '+' },
    { label: t('stats.tools'), value: 12, suffix: '' },
    { label: t('stats.experience'), value: 5, suffix: '+' },
  ]

  return (
    <div style={styles.snapContainer}>
      <Navbar />

      {/* ── Section 1: Hero ──────────────────────────────── */}
      <section style={styles.snapSection}>
        <div style={styles.hero}>
          <div style={styles.heroGlow} />
          <RevealSection>
            <p style={styles.eyebrow}>{t('hero.eyebrow')}</p>
          </RevealSection>
          <RevealSection delay={0.1}>
            <h1 style={styles.heading}>
              {t('hero.heading')}<br />
              <span style={styles.typed}>{typedText}</span>
              <span style={styles.cursor}>|</span>
            </h1>
          </RevealSection>
          <RevealSection delay={0.2}>
            <p style={styles.sub}>
              {t('hero.sub')}<br />
              {t('hero.sub2')}
            </p>
          </RevealSection>
          <RevealSection delay={0.3}>
            <div style={styles.actions}>
              <button
                style={styles.primaryBtn}
                onClick={() => navigate(isAuthenticated ? '/portfolio' : '/register')}
                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)' }}
                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}
              >
                {isAuthenticated ? t('hero.ctaAuth') : t('hero.cta')}
              </button>
              <a
                href="#stats"
                style={styles.secondaryBtn}
                onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.color = '#fff' }}
                onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = '#aaa' }}
              >
                {t('hero.secondary')} <ArrowDown size={16} />
              </a>
            </div>
          </RevealSection>
          <ScrollHint />
        </div>
      </section>

      {/* ── Section 2: Stats + Trust ─────────────────────── */}
      <section id="stats" style={styles.snapSection}>
        <div style={styles.statsPage}>
          <RevealSection>
            <section style={statStyles.bar}>
              {STATS.map((s) => (
                <StatCounter key={s.label} {...s} />
              ))}
            </section>
          </RevealSection>
          <RevealSection delay={0.2}>
            <div style={styles.trustedSection}>
              <p style={styles.trustedLabel}>{t('trust.label')}</p>
              <div style={styles.trustedLogos}>
                {['Miami', 'New York', 'Los Angeles', 'Dubai', 'London'].map((city) => (
                  <span key={city} style={styles.trustedItem}>{city}</span>
                ))}
              </div>
            </div>
          </RevealSection>
          <RevealSection delay={0.4}>
            <div style={styles.statsActions}>
              <button
                style={styles.primaryBtn}
                onClick={() => navigate('/store')}
                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)' }}
                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}
              >
                {t('statsCta.store')} <ArrowRight size={16} />
              </button>
              <button
                style={styles.ghostBtn}
                onClick={() => navigate('/tools')}
              >
                {t('statsCta.tools')}
              </button>
            </div>
          </RevealSection>
          <ScrollHint />
        </div>
      </section>

      {/* ── Section 3: Services ──────────────────────────── */}
      <section style={styles.snapSection}>
        <ServicesSection />
        <ScrollHint />
      </section>

      {/* ── Section 4: Features ──────────────────────────── */}
      <section style={styles.snapSection}>
        <FeaturesSection />
        <ScrollHint />
      </section>

      {/* ── Section 5: Portfolio Teaser ──────────────────── */}
      <section style={styles.snapSection}>
        <PortfolioTeaser />
        <ScrollHint />
      </section>

      {/* ── Section 6: Final CTA ─────────────────────────── */}
      <section style={styles.snapSection}>
        <RevealSection>
          <div style={styles.ctaSection}>
            <div style={styles.ctaGlow} />
            <h2 style={styles.ctaHeading}>{t('cta.heading')}</h2>
            <p style={styles.ctaSub}>{t('cta.sub')}</p>
            <div style={styles.ctaActions}>
              <button
                style={styles.ctaBtn}
                onClick={() => navigate(isAuthenticated ? '/contact' : '/register')}
                onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 8px 30px rgba(200,167,107,0.3)' }}
                onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none' }}
              >
                {isAuthenticated ? t('cta.btnAuth') : t('cta.btn')}
              </button>
              <button style={styles.ghostBtn} onClick={() => navigate('/prompts')}>
                {t('cta.prompts')}
              </button>
            </div>
          </div>
        </RevealSection>
        <footer style={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
        </footer>
      </section>
    </div>
  )
}

const styles = {
  snapContainer: {
    height: '100vh',
    overflowY: 'auto',
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth',
  },
  snapSection: {
    scrollSnapAlign: 'start',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  },
  scrollHint: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  hero: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: '-100px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)',
    pointerEvents: 'none',
  },
  eyebrow: {
    display: 'inline-block',
    padding: '0.4rem 1.2rem',
    borderRadius: '999px',
    border: '1px solid rgba(200,167,107,0.3)',
    color: '#c8a76b',
    fontSize: '0.85rem',
    marginBottom: '2rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  heading: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '1.5rem',
    letterSpacing: '-0.03em',
  },
  typed: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7, #c8a76b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  cursor: {
    color: '#c8a76b',
    fontWeight: 300,
    animation: 'blink 1s step-end infinite',
  },
  sub: {
    color: '#777',
    fontSize: '1.15rem',
    maxWidth: '540px',
    margin: '0 auto 3rem',
    lineHeight: 1.7,
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.9rem 2.5rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.9rem 2.5rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#aaa',
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  ghostBtn: {
    padding: '0.8rem 2rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: '#aaa',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  statsPage: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
  },
  statsActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '3rem',
  },
  trustedSection: {
    textAlign: 'center',
    padding: '3rem 2rem',
  },
  trustedLabel: {
    fontSize: '0.8rem',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '1rem',
  },
  trustedLogos: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    flexWrap: 'wrap',
  },
  trustedItem: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#444',
    letterSpacing: '0.02em',
  },
  ctaSection: {
    textAlign: 'center',
    padding: '4rem 2rem',
    position: 'relative',
  },
  ctaGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '300px',
    background: 'radial-gradient(ellipse, rgba(200,167,107,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  ctaHeading: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 800,
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
  },
  ctaSub: {
    color: '#777',
    fontSize: '1.1rem',
    marginBottom: '2.5rem',
  },
  ctaActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaBtn: {
    padding: '1rem 3rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.05rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    color: '#444',
    fontSize: '0.85rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: 'auto',
  },
}

const statStyles = {
  bar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    flexWrap: 'wrap',
    padding: '3rem 2rem',
    maxWidth: '800px',
    margin: '0 auto',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  item: { textAlign: 'center', minWidth: '120px' },
  number: {
    display: 'block',
    fontSize: '2.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #c8a76b, #f0d89c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.2,
  },
  label: {
    fontSize: '0.8rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
}
```

---

### `frontend/src/pages/LoginPage.jsx`

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'
import SocialAuth from '../components/SocialAuth'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token)
      navigate('/portfolio')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>Claude.FO</Link>
        <h1 style={styles.heading}>{t('auth.loginHeading')}</h1>
        <p style={styles.sub}>{t('auth.loginSub')}</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            {t('auth.email')}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="you@example.com"
            />
          </label>
          <label style={styles.label}>
            {t('auth.password')}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
          </button>
        </form>

        <SocialAuth setError={setError} />

        <p style={styles.footer}>
          {t('auth.noAccount')}{' '}
          <Link to="/register" style={styles.footerLink}>{t('auth.signUp')}</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '2.5rem',
    textAlign: 'center',
  },
  logo: {
    display: 'block',
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'inherit',
    textDecoration: 'none',
    marginBottom: '1.5rem',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: '0.4rem',
  },
  sub: {
    color: '#888',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    background: 'rgba(248,113,113,0.1)',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  input: {
    padding: '0.65rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  footer: {
    fontSize: '0.9rem',
    color: '#888',
  },
  footerLink: {
    color: '#a5b4fc',
    textDecoration: 'none',
  },
}
```

---

### `frontend/src/pages/RegisterPage.jsx`

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'
import SocialAuth from '../components/SocialAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.access_token)
      navigate('/portfolio')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>Claude.FO</Link>
        <h1 style={styles.heading}>{t('auth.registerHeading')}</h1>
        <p style={styles.sub}>{t('auth.registerSub')}</p>

        {error && <p style={styles.error}>{error}</p>}

        <SocialAuth setError={setError} />

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            {t('auth.name')}
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder={t('contact.namePlaceholder')}
            />
          </label>
          <label style={styles.label}>
            {t('auth.email')}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder={t('contact.emailPlaceholder')}
            />
          </label>
          <label style={styles.label}>
            {t('auth.password')}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? t('auth.creating') : t('auth.registerBtn')}
          </button>
        </form>

        <p style={styles.footer}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" style={styles.footerLink}>{t('auth.logIn')}</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '2.5rem',
    textAlign: 'center',
  },
  logo: {
    display: 'block',
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'inherit',
    textDecoration: 'none',
    marginBottom: '1.5rem',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: '0.4rem',
  },
  sub: {
    color: '#888',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    background: 'rgba(248,113,113,0.1)',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  input: {
    padding: '0.65rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#888',
  },
  footerLink: {
    color: '#a5b4fc',
    textDecoration: 'none',
  },
}
```

---

### `frontend/src/pages/PortfolioPage.jsx`

```jsx
import { useState } from 'react'
import { Building2, Code2, Bot, Smartphone, Palette, ShoppingCart, BarChart3, Kanban, Dumbbell, MapPin, PenTool, Video, FileText, Wand2, Mail, MessageSquare, Send, Megaphone, ArrowUpRight, ShoppingBag, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'
import useScrollReveal from '../hooks/useScrollReveal'

const CATEGORIES = ['All', 'Real Estate', 'Web Development', 'AI & Automation', 'Mobile Apps', 'Logo & Branding']

const CATEGORY_ICONS = {
  'Real Estate': Building2,
  'Web Development': Code2,
  'AI & Automation': Bot,
  'Mobile Apps': Smartphone,
  'Logo & Branding': Palette,
}

const projects = [
  // ── Real Estate
  { title: 'Brickell Rental Communities', category: 'Real Estate', description: 'Luxury furnished apartment rental platform for Brickell, Miami. Featuring pricing tiers, amenity showcases, and WhatsApp-integrated lead flow.', color: '#c8a76b', Icon: Building2, tags: ['HTML/CSS', 'Netlify', 'WhatsApp API', 'Bilingual'], link: 'https://brickell-rentals.netlify.app', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=300&fit=crop' },
  { title: 'Doral Living Hub', category: 'Real Estate', description: 'Community portal for lease rentals in Doral with neighborhood guides, virtual tours, and resident onboarding.', color: '#0a1428', Icon: MapPin, tags: ['React', 'Maps API', 'CMS'], image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=300&fit=crop' },
  // ── Web Development
  { title: 'E-Commerce Platform', category: 'Web Development', description: 'Full-stack online store with cart, payments, and admin dashboard.', color: '#6366f1', Icon: ShoppingCart, tags: ['React', 'FastAPI', 'Stripe'], image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop' },
  { title: 'SaaS Analytics Dashboard', category: 'Web Development', description: 'Real-time data visualization dashboard with role-based access and custom reporting.', color: '#14b8a6', Icon: BarChart3, tags: ['React', 'D3.js', 'FastAPI'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop' },
  { title: 'Task Management App', category: 'Web Development', description: 'Drag-and-drop Kanban board with real-time collaboration and team workspaces.', color: '#8b5cf6', Icon: Kanban, tags: ['React', 'WebSockets', 'PostgreSQL'], image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop' },
  // ── AI & Automation
  { title: 'Real Estate Prompt Library', category: 'AI & Automation', description: '50+ ready-to-use prompts for property listings, tenant communications, market analysis, and investor reports.', color: '#f59e0b', Icon: Wand2, tags: ['ChatGPT', 'Real Estate', '50+ Prompts'], storeLink: true, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop' },
  { title: 'Marketing & Sales Prompts', category: 'AI & Automation', description: 'Ad copy, email campaigns, cold outreach scripts, social media posts, and sales funnel content.', color: '#f43f5e', Icon: Megaphone, tags: ['ChatGPT', 'Marketing', '75+ Prompts'], storeLink: true, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop' },
  { title: 'Business Productivity Pack', category: 'AI & Automation', description: 'SOPs, meeting agendas, proposals, financial reports, and workflow automation prompts.', color: '#10b981', Icon: FileText, tags: ['ChatGPT', 'Business', '60+ Prompts'], storeLink: true, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop' },
  { title: 'Content Creator Toolkit', category: 'AI & Automation', description: 'Blog posts, video scripts, newsletters, SEO content, and social media captions.', color: '#8b5cf6', Icon: PenTool, tags: ['ChatGPT', 'Content', '80+ Prompts'], storeLink: true, image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=300&fit=crop' },
  { title: 'Real Estate Lead Funnel', category: 'AI & Automation', description: 'End-to-end lead generation funnel — landing page, lead magnet, email sequence, and CRM integration.', color: '#8b5cf6', Icon: Send, tags: ['Make.com', 'Mailchimp', 'CRM', 'Funnel'], image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=300&fit=crop' },
  { title: 'AI-Powered Email Campaigns', category: 'AI & Automation', description: 'Automated email blast system with AI-generated copy, audience segmentation, and performance tracking.', color: '#6366f1', Icon: Mail, tags: ['OpenAI', 'Mailchimp', 'Zapier', 'Analytics'], image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=300&fit=crop' },
  { title: 'SMS Marketing Automation', category: 'AI & Automation', description: 'Bulk SMS campaigns with personalized messages, scheduling, opt-in/out management, and delivery reports.', color: '#14b8a6', Icon: MessageSquare, tags: ['Twilio', 'Make.com', 'Automation'], image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop' },
  // ── Mobile Apps
  { title: 'Mobile Fitness Tracker', category: 'Mobile Apps', description: 'Cross-platform workout tracker with progress analytics and personalized plans.', color: '#ec4899', Icon: Dumbbell, tags: ['React Native', 'Node.js', 'Charts'], image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=600&h=300&fit=crop' },
  { title: 'Property Finder App', category: 'Mobile Apps', description: 'Mobile app for browsing rental listings with map view, filters, and saved searches.', color: '#f59e0b', Icon: MapPin, tags: ['React Native', 'Maps', 'Push Notifications'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop' },
  // ── Logo & Branding
  { title: 'Full Vector Logo Suite', category: 'Logo & Branding', description: 'Custom vector logos with full brand guidelines — scalable from favicon to billboard.', color: '#a855f7', Icon: PenTool, tags: ['Illustrator', 'SVG', 'Vector', 'Brand Book'], image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=300&fit=crop' },
  { title: 'Animated Logo Package', category: 'Logo & Branding', description: 'Motion logo animations for intros, socials, and loading screens — delivered in Lottie, GIF, and MP4.', color: '#f472b6', Icon: Video, tags: ['After Effects', 'Lottie', 'Motion Design'], image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=300&fit=crop' },
  { title: 'Real Estate Brand Identity', category: 'Logo & Branding', description: 'Complete visual identity for luxury rental communities — logo, color palette, typography, and collateral.', color: '#c8a76b', Icon: Palette, tags: ['Figma', 'Illustrator', 'Print', 'Digital'], image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=300&fit=crop' },
  // ── Digital Products
  { title: 'Monthly Finance Tracker', category: 'Web Development', description: 'Spreadsheet template for personal and business budgeting — income, expenses, goals, and visual dashboards.', color: '#10b981', Icon: BarChart3, tags: ['Google Sheets', 'Excel', 'Notion'], storeLink: true, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop' },
  { title: 'Social Media Kit', category: 'Logo & Branding', description: '50+ editable templates for Instagram, TikTok, and LinkedIn — stories, posts, reels covers, and carousels.', color: '#f43f5e', Icon: ShoppingBag, tags: ['Canva', 'Figma', 'Templates'], storeLink: true, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=300&fit=crop' },
  { title: 'Website Templates Pack', category: 'Web Development', description: 'Ready-to-deploy landing page and portfolio templates built with React — clean, fast, responsive.', color: '#6366f1', Icon: Code2, tags: ['React', 'Tailwind', 'Vite'], storeLink: true, image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=300&fit=crop' },
]

function ProjectCard({ project, delay }) {
  const [ref, visible] = useScrollReveal(0.05)
  const { Icon } = project

  return (
    <div
      ref={ref}
      style={{
        ...s.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease ${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${project.color}40`
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 16px 40px ${project.color}12`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={s.cardHeader}>
        <img src={project.image} alt={project.title} style={s.cardImage} loading="lazy" />
        <div style={s.cardImageOverlay} />
        <div style={{ ...s.iconBadge, background: `${project.color}dd` }}>
          <Icon size={16} color="#fff" strokeWidth={2} />
        </div>
      </div>
      <div style={s.cardBody}>
        <span style={{ ...s.category, color: project.color }}>{project.category}</span>
        <h3 style={s.title}>{project.title}</h3>
        <p style={s.description}>{project.description}</p>
        <div style={s.tags}>
          {project.tags.map((tag) => (
            <span key={tag} style={s.tag}>{tag}</span>
          ))}
        </div>
        <div style={s.links}>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ ...s.linkBtn, borderColor: `${project.color}40`, color: project.color }}>
              <ExternalLink size={13} /> Visit site
            </a>
          )}
          {project.storeLink && (
            <a href="/store" style={{ ...s.linkBtn, borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}>
              <ShoppingBag size={13} /> View in store
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.header}>
          <span style={s.eyebrow}>Our Work</span>
          <h1 style={s.heading}>Portfolio</h1>
          <p style={s.sub}>Selected work across real estate, web, mobile, and design</p>
        </div>

        <div style={s.tabs}>
          {CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat]
            const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{ ...s.tab, ...(active === cat ? s.tabActive : {}) }}
              >
                {CatIcon && <CatIcon size={14} />} {cat}
                {active !== cat && <span style={s.tabCount}>{count}</span>}
              </button>
            )
          })}
        </div>

        <div style={s.grid}>
          {filtered.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={(i % 3) * 0.1} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={s.empty}>No projects in this category yet. Stay tuned!</p>
        )}
      </div>
      <footer style={s.footer}><p>&copy; {new Date().getFullYear()} Claude.FO — All rights reserved</p></footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  header: { marginBottom: '2rem', textAlign: 'center' },
  eyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  heading: { fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '1rem', margin: 0 },
  tabs: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', marginBottom: '2.5rem' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#888', fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: '1px solid transparent' },
  tabCount: { fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '999px', color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' },
  card: { borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
  cardHeader: { height: '160px', position: 'relative', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardImageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,11,15,0.8) 0%, transparent 60%)' },
  iconBadge: { position: 'absolute', bottom: '12px', left: '16px', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' },
  category: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.3rem', fontWeight: 600 },
  title: { fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' },
  description: { color: '#777', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' },
  tag: { fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#999' },
  links: { marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  linkBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid', fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' },
  empty: { textAlign: 'center', color: '#555', padding: '3rem', fontSize: '1rem' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
```

---

### `frontend/src/pages/StorePage.jsx`

```jsx
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Building2, Code2, Bot, Smartphone, Palette, Calculator, FileText, BarChart3, Home, Scale, ClipboardCheck, Wrench, Check, ArrowRight, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

const STORE_CATEGORIES = ['All', 'Real Estate', 'Web Development', 'AI & Automation', 'Mobile Apps', 'Logo & Branding']

const CATEGORY_ICONS = {
  'Real Estate': Building2,
  'Web Development': Code2,
  'AI & Automation': Bot,
  'Mobile Apps': Smartphone,
  'Logo & Branding': Palette,
}

const paidProducts = [
  { id: 'real-estate-template', title: 'Real Estate Landing Template', subtitle: 'Rental Community Page', description: 'High-converting landing page template designed for rental communities. Pricing tiers, amenity sections, WhatsApp integration, and bilingual support.', price: 24, originalPrice: 39, category: 'Real Estate', color: '#c8a76b', features: ['Luxury design', 'Pricing section', 'WhatsApp CTA', 'Bilingual ready', 'Mobile-first', 'Netlify deploy'], badge: 'New' },
  { id: 'finance-tracker', title: 'Monthly Finance Tracker', subtitle: 'Personal & Business Budgeting', description: 'Track income, expenses, savings goals, and investments with automated dashboards. Includes 12-month overview, category breakdowns, and visual charts.', price: 19, originalPrice: 29, category: 'Web Development', color: '#10b981', features: ['Google Sheets + Excel', 'Auto-calculated dashboards', '12-month annual view', 'Expense categories', 'Savings goal tracker', 'Dark & light themes'], badge: 'Best Seller' },
  { id: 'website-templates', title: 'Website Templates Pack', subtitle: 'React + Vite Ready-to-Deploy', description: 'Collection of 5 professionally designed landing pages and portfolio templates. Clean code, responsive, fast — just add your content and deploy.', price: 39, originalPrice: 69, category: 'Web Development', color: '#6366f1', features: ['5 unique designs', 'React + Vite', 'Fully responsive', 'Dark & light mode', 'SEO optimized', 'Deploy in minutes'], badge: null },
  { id: 'prompts-real-estate', title: 'Real Estate Prompt Pack', subtitle: '50+ Ready-to-Use Prompts', description: 'Property listings, tenant emails, market analysis, investor reports, social posts for agents — just fill in your details and go.', price: 14, originalPrice: 29, category: 'AI & Automation', color: '#f59e0b', features: ['50+ prompts', 'Listing descriptions', 'Tenant comms', 'Market reports', 'Social captions', 'Fill-in-the-blank'], badge: 'Best Seller' },
  { id: 'prompts-marketing', title: 'Marketing & Sales Prompts', subtitle: '75+ Plug-and-Play Prompts', description: 'Ad copy, email sequences, cold outreach, social media campaigns, and sales scripts — for any industry.', price: 19, originalPrice: 39, category: 'AI & Automation', color: '#f43f5e', features: ['75+ prompts', 'Ad copy generators', 'Email sequences', 'Cold DM scripts', 'Launch campaigns', 'A/B test variants'], badge: 'Popular' },
  { id: 'prompts-business', title: 'Business & Productivity Pack', subtitle: '60+ Professional Prompts', description: 'SOPs, meeting agendas, project proposals, financial summaries, hiring templates, and workflow automations.', price: 14, originalPrice: 29, category: 'AI & Automation', color: '#10b981', features: ['60+ prompts', 'SOP generators', 'Proposal templates', 'Report writers', 'Hiring scripts', 'Process automations'], badge: null },
  { id: 'prompts-content', title: 'Content Creator Toolkit', subtitle: '80+ Creative Prompts', description: 'Blog posts, YouTube scripts, newsletter intros, SEO articles, podcast outlines, and social media carousels.', price: 19, originalPrice: 34, category: 'AI & Automation', color: '#8b5cf6', features: ['80+ prompts', 'Blog post outlines', 'Video scripts', 'Newsletter hooks', 'SEO frameworks', 'Carousel templates'], badge: 'New' },
  { id: 'lead-funnel-template', title: 'Lead Funnel Blueprint', subtitle: 'Complete Funnel Setup Guide', description: 'Step-by-step guide to building a high-converting lead funnel — landing page, lead magnet, email sequence, and CRM setup.', price: 34, originalPrice: 59, category: 'AI & Automation', color: '#8b5cf6', features: ['Funnel architecture', 'Email sequence templates', 'Lead magnet ideas', 'CRM setup guide', 'A/B testing tips', 'Conversion tracking'], badge: null },
  { id: 'email-sms-playbook', title: 'Email & SMS Playbook', subtitle: 'Campaign Templates + Strategy', description: 'Ready-to-use email blast and SMS campaign templates with audience segmentation strategies and AI prompt templates for copy generation.', price: 24, originalPrice: 44, category: 'AI & Automation', color: '#6366f1', features: ['20+ email templates', '10+ SMS templates', 'AI copy prompts', 'Segmentation guide', 'Scheduling strategy', 'Compliance checklist'], badge: 'Popular' },
  { id: 'automation-starter-kit', title: 'Automation Starter Kit', subtitle: 'Make.com + Zapier Workflows', description: 'Pre-built workflow automations for lead capture, follow-ups, social posting, and CRM updates. Just import and customize.', price: 19, originalPrice: 39, category: 'AI & Automation', color: '#14b8a6', features: ['15+ workflows', 'Make.com blueprints', 'Zapier templates', 'Lead nurture flows', 'Social auto-post', 'Setup video guide'], badge: null },
  { id: 'social-media-kit', title: 'Social Media Kit', subtitle: '50+ Editable Templates', description: 'Professional templates for Instagram posts, stories, reels covers, carousels, and LinkedIn banners.', price: 29, originalPrice: 49, category: 'Logo & Branding', color: '#f43f5e', features: ['50+ templates', 'Instagram, TikTok, LinkedIn', 'Canva & Figma formats', 'Stories, posts, carousels', 'Brand color customization', 'Commercial license'], badge: 'Popular' },
  { id: 'content-calendar', title: 'Content Calendar Planner', subtitle: '90-Day Social Strategy', description: 'Plan, schedule, and track your social media content across all platforms.', price: 14, originalPrice: 24, category: 'Logo & Branding', color: '#8b5cf6', features: ['90-day planner', 'Multi-platform', 'Content pillars', 'Post ideas bank', 'Analytics tracker', 'Notion + Sheets'], badge: null },
]

const freeTools = [
  { id: 'mortgage-calc', title: 'Mortgage Calculator', description: 'Calculate your monthly mortgage payment instantly.', Icon: Calculator, toolLink: '/tools' },
  { id: 'recast-calc', title: 'Recast Calculator', description: 'See your new payment after a lump-sum principal reduction.', Icon: BarChart3, toolLink: '/tools' },
  { id: 'first-home', title: 'First Home Checklist', description: '10 steps to buying your first home.', Icon: ClipboardCheck, toolLink: '/tools' },
  { id: 'rent-vs-buy', title: 'Rent vs Buy Comparison', description: 'Compare renting vs buying costs over time.', Icon: Scale, toolLink: '/tools' },
  { id: 'pq-quiz', title: 'Pre-Qualification Assessment', description: 'Find out if you are ready to buy a home.', Icon: FileText, toolLink: '/tools' },
]

export default function StorePage() {
  const { t } = useLang()
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(null)
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const filteredPaid = active === 'All' ? paidProducts : paidProducts.filter((p) => p.category === active)
  const showFreeTools = active === 'All' || active === 'Real Estate'

  async function handleBuy(productId) {
    if (!isAuthenticated) { navigate('/register'); return }
    setLoading(productId)
    try {
      const res = await api.post('/checkout', { product_id: productId })
      window.location.href = res.data.url
    } catch {
      alert('Checkout failed. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>

        {/* ── Header ──────────────────────────────────── */}
        <div style={s.header}>
          <div style={s.eyebrow}><Sparkles size={14} /> {t('store.eyebrow')}</div>
          <h1 style={s.heading}>{t('store.heading')}</h1>
          <p style={s.sub}>{t('store.sub')}</p>
        </div>

        {success && <div style={s.successBanner}>{t('store.successBanner')}</div>}
        {canceled && <div style={s.cancelBanner}>{t('store.cancelBanner')}</div>}

        {/* ── Category Tabs ───────────────────────────── */}
        <div style={s.tabs}>
          {STORE_CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat]
            return (
              <button key={cat} onClick={() => setActive(cat)} style={{ ...s.tab, ...(active === cat ? s.tabActive : {}) }}>
                {CatIcon && <CatIcon size={14} />} {cat}
              </button>
            )
          })}
        </div>

        {/* ── Paid Products ──────────────────────────── */}
        {filteredPaid.length > 0 && (
          <>
            <h2 style={s.sectionTitle}>{t('store.premiumProducts')}</h2>
            <div style={s.paidGrid}>
              {filteredPaid.map((p) => {
                const CatIcon = CATEGORY_ICONS[p.category] || Code2
                return (
                  <div
                    key={p.id}
                    style={s.paidCard}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${p.color}40`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${p.color}12` }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={s.paidCardTop}>
                      <div style={{ ...s.paidIcon, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                        <CatIcon size={22} color={p.color} strokeWidth={1.5} />
                      </div>
                      {p.badge && <span style={{ ...s.badge, background: p.color }}>{p.badge}</span>}
                    </div>
                    <span style={s.paidCategory}>{p.category}</span>
                    <h3 style={s.paidTitle}>{p.title}</h3>
                    <p style={s.paidSubtitle}>{p.subtitle}</p>
                    <p style={s.paidDesc}>{p.description}</p>
                    <ul style={s.features}>
                      {p.features.map((f) => (
                        <li key={f} style={s.feature}><Check size={13} color="#10b981" strokeWidth={2.5} /> {f}</li>
                      ))}
                    </ul>
                    <div style={s.paidBottom}>
                      <div style={s.priceRow}>
                        <span style={s.price}>${p.price}</span>
                        <span style={s.originalPrice}>${p.originalPrice}</span>
                        <span style={s.discount}>{Math.round((1 - p.price / p.originalPrice) * 100)}% {t('store.off')}</span>
                      </div>
                      <button
                        onClick={() => handleBuy(p.id)}
                        disabled={loading === p.id}
                        style={{ ...s.buyBtn, background: p.color, opacity: loading === p.id ? 0.6 : 1 }}
                        onMouseEnter={(e) => { e.target.style.boxShadow = `0 6px 20px ${p.color}40` }}
                        onMouseLeave={(e) => { e.target.style.boxShadow = 'none' }}
                      >
                        {loading === p.id ? t('store.redirecting') : t('store.buyNow')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ── Free Tools ─────────────────────────────── */}
        {showFreeTools && (
          <>
            <div style={s.freeHeader}>
              <h2 style={s.sectionTitle}>{t('store.freeTools')}</h2>
              <span style={s.freeBadge}>{t('store.free')}</span>
            </div>
            <div style={s.freeGrid}>
              {freeTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.toolLink}
                  style={s.freeCard}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,167,107,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <div style={s.freeIcon}>
                    <tool.Icon size={20} color="#c8a76b" strokeWidth={1.5} />
                  </div>
                  <div style={s.freeText}>
                    <strong style={s.freeTitle}>{tool.title}</strong>
                    <span style={s.freeDesc}>{tool.description}</span>
                  </div>
                  <ArrowRight size={16} color="#666" />
                </a>
              ))}
            </div>
          </>
        )}

        {/* ── Bottom CTA ─────────────────────────────── */}
        <div style={s.cta}>
          <h2 style={s.ctaHeading}>{t('store.customCta')}</h2>
          <p style={s.ctaSub}>{t('store.customSub')}</p>
          <button
            style={s.ctaBtn}
            onClick={() => navigate(isAuthenticated ? '/contact' : '/register')}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 8px 30px rgba(200,167,107,0.3)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none' }}
          >
            {t('store.customBtn')} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <footer style={s.footer}><p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p></footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', fontSize: '0.8rem', marginBottom: '1rem' },
  heading: { fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '1rem', margin: 0 },
  successBanner: { padding: '1rem', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' },
  cancelBanner: { padding: '1rem', borderRadius: '12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' },
  tabs: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.5rem' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#888', fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid transparent' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', margin: '0 0 1.2rem' },
  paidGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem', marginBottom: '3rem' },
  paidCard: { borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
  paidCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  paidIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { padding: '0.2rem 0.7rem', borderRadius: '999px', color: '#fff', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  paidCategory: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '0.3rem', display: 'block' },
  paidTitle: { fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.2rem' },
  paidSubtitle: { fontSize: '0.85rem', color: '#888', margin: '0 0 0.8rem' },
  paidDesc: { color: '#666', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' },
  features: { listStyle: 'none', padding: 0, margin: '0 0 1.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' },
  feature: { fontSize: '0.78rem', color: '#999', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  paidBottom: { marginTop: 'auto' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.8rem' },
  price: { fontSize: '1.5rem', fontWeight: 800 },
  originalPrice: { fontSize: '0.9rem', color: '#555', textDecoration: 'line-through' },
  discount: { fontSize: '0.72rem', color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px' },
  buyBtn: { width: '100%', padding: '0.7rem', borderRadius: '10px', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  freeHeader: { display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2.5rem' },
  freeBadge: { fontSize: '0.7rem', padding: '0.2rem 0.7rem', borderRadius: '999px', background: 'rgba(200,167,107,0.15)', color: '#c8a76b', fontWeight: 600, textTransform: 'uppercase' },
  freeGrid: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '3rem' },
  freeCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' },
  freeIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  freeText: { flex: 1 },
  freeTitle: { display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' },
  freeDesc: { fontSize: '0.82rem', color: '#666' },
  cta: { textAlign: 'center', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
  ctaHeading: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' },
  ctaSub: { color: '#777', marginBottom: '2rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
```

---

### `frontend/src/pages/ToolsPage.jsx`

```jsx
import { useState } from 'react'
import { Calculator, BarChart3, ClipboardCheck, Scale, FileText, ChevronRight, Wrench } from 'lucide-react'
import Navbar from '../components/Navbar'
import EmailGate from '../components/EmailGate'
import MortgageCalculator from '../components/tools/MortgageCalculator'
import RecastCalculator from '../components/tools/RecastCalculator'
import FirstHomeChecklist from '../components/tools/FirstHomeChecklist'
import RentVsBuy from '../components/tools/RentVsBuy'
import PreQualQuiz from '../components/tools/PreQualQuiz'
import { useLang } from '../i18n/LanguageContext'

const TOOLS = [
  { id: 'mortgage', label: 'Mortgage Calculator', desc: 'Estimate your monthly payment', Icon: Calculator, component: MortgageCalculator, color: '#6366f1' },
  { id: 'recast', label: 'Recast Calculator', desc: 'Payment after lump-sum reduction', Icon: BarChart3, component: RecastCalculator, color: '#10b981' },
  { id: 'checklist', label: 'First Home Checklist', desc: '10 steps to buying your first home', Icon: ClipboardCheck, component: FirstHomeChecklist, color: '#f59e0b' },
  { id: 'rentvsbuy', label: 'Rent vs Buy', desc: 'Compare costs over time', Icon: Scale, component: RentVsBuy, color: '#a855f7' },
  { id: 'quiz', label: 'PQ Assessment', desc: 'Are you ready to buy?', Icon: FileText, component: PreQualQuiz, color: '#ec4899' },
]

export default function ToolsPage() {
  const { t } = useLang()
  const [active, setActive] = useState('mortgage')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeTool = TOOLS.find((tool) => tool.id === active)
  const ActiveComponent = activeTool.component

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.layout}>

        {/* ── Mobile toggle ─────────────────────────── */}
        <button style={s.mobileToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Wrench size={16} /> Tools Menu <ChevronRight size={14} style={{ transform: sidebarOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {/* ── Left Sidebar ──────────────────────────── */}
        <aside style={{ ...s.sidebar, ...(sidebarOpen ? s.sidebarOpen : {}) }}>
          <div style={s.sidebarHeader}>
            <Wrench size={18} color="#c8a76b" />
            <span style={s.sidebarTitle}>{t('tools.eyebrow')}</span>
          </div>
          <div style={s.toolList}>
            {TOOLS.map((tool) => {
              const isActive = active === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => { setActive(tool.id); setSidebarOpen(false) }}
                  style={{ ...s.toolBtn, ...(isActive ? { ...s.toolBtnActive, borderLeftColor: tool.color, background: `${tool.color}10` } : {}) }}
                >
                  <div style={{ ...s.toolIcon, background: isActive ? `${tool.color}20` : 'rgba(255,255,255,0.04)', borderColor: isActive ? `${tool.color}40` : 'rgba(255,255,255,0.08)' }}>
                    <tool.Icon size={18} color={isActive ? tool.color : '#666'} strokeWidth={1.5} />
                  </div>
                  <div style={s.toolInfo}>
                    <span style={{ ...s.toolLabel, color: isActive ? '#fff' : '#aaa' }}>{tool.label}</span>
                    <span style={s.toolDesc}>{tool.desc}</span>
                  </div>
                  {isActive && <ChevronRight size={14} color={tool.color} />}
                </button>
              )
            })}
          </div>
          <div style={s.sidebarFooter}>
            <p style={s.sidebarNote}>All tools are 100% free.<br />No credit card required.</p>
          </div>
        </aside>

        {/* ── Right Content Area ────────────────────── */}
        <main style={s.main}>
          <div style={s.toolHeader}>
            <div style={{ ...s.activeIcon, background: `${activeTool.color}15`, border: `1px solid ${activeTool.color}30` }}>
              <activeTool.Icon size={24} color={activeTool.color} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={s.heading}>{activeTool.label}</h1>
              <p style={s.sub}>{activeTool.desc}</p>
            </div>
          </div>

          <EmailGate source={`tool_${active}`}>
            <ActiveComponent />
          </EmailGate>
        </main>
      </div>

      <footer style={s.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  layout: { display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', gap: '1.5rem', position: 'relative' },

  // Mobile toggle
  mobileToggle: { display: 'none', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', margin: '1rem 0', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#aaa', fontSize: '0.9rem', cursor: 'pointer', width: '100%' },

  // Sidebar
  sidebar: { width: '280px', flexShrink: 0, padding: '2rem 0', position: 'sticky', top: '70px', height: 'fit-content', maxHeight: 'calc(100vh - 90px)', overflowY: 'auto' },
  sidebarOpen: {},
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 0.5rem', marginBottom: '1.5rem' },
  sidebarTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#c8a76b', textTransform: 'uppercase', letterSpacing: '0.08em' },
  toolList: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  toolBtn: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', borderRadius: '12px', border: 'none', borderLeft: '3px solid transparent', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' },
  toolBtnActive: { borderLeft: '3px solid' },
  toolIcon: { width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid', transition: 'all 0.2s' },
  toolInfo: { flex: 1, minWidth: 0 },
  toolLabel: { display: 'block', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' },
  toolDesc: { display: 'block', fontSize: '0.75rem', color: '#555', marginTop: '0.15rem' },
  sidebarFooter: { marginTop: '2rem', padding: '1rem', borderRadius: '10px', background: 'rgba(200,167,107,0.05)', border: '1px solid rgba(200,167,107,0.15)' },
  sidebarNote: { fontSize: '0.78rem', color: '#888', lineHeight: 1.5, margin: 0, textAlign: 'center' },

  // Main content
  main: { flex: 1, padding: '2rem 0', minWidth: 0 },
  toolHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  activeIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  heading: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '0.9rem', margin: 0 },

  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}

// Responsive CSS for mobile
if (typeof document !== 'undefined') {
  const id = 'tools-responsive'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @media (max-width: 768px) {
        [data-tools-layout] { flex-direction: column !important; }
        [data-tools-sidebar] { width: 100% !important; position: static !important; display: none !important; }
        [data-tools-sidebar].open { display: flex !important; }
        [data-tools-toggle] { display: flex !important; }
      }
    `
    document.head.appendChild(style)
  }
}
```

---

### `frontend/src/pages/PromptsPage.jsx`

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n/LanguageContext'

const CATEGORIES = ['All', 'Slash Commands', 'AI Agents', 'Hooks & Automation', 'Code Review', 'Marketing', 'Business', 'Content Creation']

const PROMPTS = [
  // ── Free Samples (visible to all) ────────────────────────────
  { id: 1, title: 'Smart Commit Message', category: 'Slash Commands', description: 'Auto-generate context-aware git commit messages following conventional format.', free: true,
    content: `Analyze the current git diff and create a commit message following conventional commits:\n- feat: for new features\n- fix: for bug fixes\n- docs: for documentation\n- refactor: for refactoring\n- test: for adding tests\n\nInclude a brief body explaining WHY, not just what changed.` },
  { id: 2, title: 'Code Optimizer', category: 'Slash Commands', description: 'Review code for performance bottlenecks and suggest priority-ordered fixes.', free: true,
    content: `Review the provided code for issues in order of priority:\n1. Performance bottlenecks - identify O(n²) operations, inefficient loops\n2. Memory leaks - find unreleased resources, circular references\n3. Redundant operations - duplicate computations, unnecessary re-renders\n4. Type safety gaps - any/unknown types, missing null checks\n\nFor each issue found, provide:\n- Location and severity (critical/warning/info)\n- Current vs suggested implementation\n- Expected performance improvement` },
  { id: 3, title: 'PR Description Generator', category: 'Slash Commands', description: 'Create comprehensive pull request descriptions from your branch diff.', free: true,
    content: `Analyze the diff between current branch and main. Generate a PR description:\n\n## Summary\n[2-3 sentence overview of changes]\n\n## Changes Made\n- [Bullet list of specific changes]\n\n## Testing\n- [How to verify these changes]\n\n## Screenshots\n[If UI changes, note where screenshots should go]` },
  { id: 4, title: 'Unit Test Generator', category: 'Code Review', description: 'Generate comprehensive unit tests for any function or module.', free: true,
    content: `For the selected code, generate unit tests covering:\n1. Happy path - expected inputs and outputs\n2. Edge cases - empty inputs, max values, null/undefined\n3. Error cases - invalid inputs, network failures\n4. Boundary conditions - off-by-one, type coercion\n\nUse describe/it blocks. Mock external dependencies. Aim for >90% coverage.` },
  { id: 5, title: 'Security Audit Prompt', category: 'Code Review', description: 'Scan code for OWASP top 10 vulnerabilities and security issues.', free: true,
    content: `Perform a security audit checking for:\n- SQL injection vectors\n- XSS vulnerabilities\n- CSRF exposure\n- Authentication bypass\n- Sensitive data exposure\n- Missing input validation\n- Insecure dependencies\n\nFor each finding: severity, location, exploit scenario, and fix.` },
  { id: 6, title: 'Auto-Format Hook', category: 'Hooks & Automation', description: 'Pre-commit hook that auto-formats code before every commit.', free: true,
    content: `#!/bin/bash\n# Pre-commit format hook\n# Runs Prettier on staged files before commit\n\nSTAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.(js|jsx|ts|tsx|css|json)$')\n\nif [ -n "$STAGED" ]; then\n  echo "$STAGED" | xargs npx prettier --write\n  echo "$STAGED" | xargs git add\nfi` },
  { id: 7, title: 'Documentation Writer Agent', category: 'AI Agents', description: 'AI agent that generates comprehensive docs for your codebase.', free: true,
    content: `You are a technical documentation specialist. For the given codebase:\n\n1. Identify all public APIs, components, and utilities\n2. Generate JSDoc/docstring for each\n3. Create a README with: overview, installation, usage examples, API reference\n4. Add inline comments only where logic is non-obvious\n5. Generate a CHANGELOG from recent git commits\n\nWrite for a developer who is new to this codebase.` },
  { id: 8, title: 'Cold Email Sequence', category: 'Marketing', description: 'Generate a 5-email cold outreach sequence for any product or service.', free: true,
    content: `Create a 5-email cold outreach sequence for [YOUR PRODUCT/SERVICE]:\n\nEmail 1 - The Hook: Subject line + 3 sentences. Reference their specific pain point.\nEmail 2 - The Value: Share a relevant case study or stat.\nEmail 3 - The Proof: Social proof, testimonial, or results.\nEmail 4 - The Offer: Clear CTA with urgency.\nEmail 5 - The Breakup: Last chance, no pressure.\n\nRules: Under 100 words each. No fluff. Personalization tokens: [NAME], [COMPANY], [PAIN POINT].` },
  { id: 9, title: 'Meeting Summary Bot', category: 'Business', description: 'Transform meeting notes into actionable summaries with owners and deadlines.', free: true,
    content: `Transform these meeting notes into:\n\n## Key Decisions\n- [Decision] — made by [who]\n\n## Action Items\n| Task | Owner | Deadline |\n|------|-------|----------|\n| ... | ... | ... |\n\n## Open Questions\n- [Question] — needs answer from [who] by [when]\n\n## Next Meeting\n- Date: [suggest]\n- Agenda: [based on open items]` },
  { id: 10, title: 'Blog Post Framework', category: 'Content Creation', description: 'Generate a full blog post outline with SEO-optimized structure.', free: true,
    content: `Create a blog post about [TOPIC]:\n\nTitle: [SEO-optimized, under 60 chars]\nMeta description: [Under 155 chars]\n\n## Outline\nH1: [Main title]\nH2: [Section 1 - Hook/Problem]\nH2: [Section 2 - Solution overview]\nH2: [Section 3 - Step-by-step]\nH2: [Section 4 - Examples/proof]\nH2: [Section 5 - CTA]\n\nKeywords: [primary], [secondary x3]\nInternal links: [suggest 2-3]\nWord count target: 1,500-2,000` },

  // ── Premium (locked) ─────────────────────────────────────────
  { id: 11, title: 'Full CI/CD Pipeline Setup', category: 'Slash Commands', description: 'Generate complete GitHub Actions workflow with testing, linting, and deploy stages.', free: false, content: '' },
  { id: 12, title: 'API Documentation Generator', category: 'Slash Commands', description: 'Auto-generate OpenAPI/Swagger docs from your codebase routes.', free: false, content: '' },
  { id: 13, title: 'Database Schema Designer', category: 'AI Agents', description: 'Design normalized database schemas from business requirements.', free: false, content: '' },
  { id: 14, title: 'Refactoring Agent', category: 'AI Agents', description: 'Identify code smells and refactor with SOLID principles.', free: false, content: '' },
  { id: 15, title: 'Bug Debugger Agent', category: 'AI Agents', description: 'Systematic debugging agent that traces errors to root cause.', free: false, content: '' },
  { id: 16, title: 'Data Analysis Agent', category: 'AI Agents', description: 'Analyze datasets, find patterns, generate visualizations and reports.', free: false, content: '' },
  { id: 17, title: 'Pre-Push Validation Hook', category: 'Hooks & Automation', description: 'Run tests, lint, and type-check before allowing git push.', free: false, content: '' },
  { id: 18, title: 'Auto Security Scanner', category: 'Hooks & Automation', description: 'Scan for secrets, vulnerabilities, and license issues on every commit.', free: false, content: '' },
  { id: 19, title: 'Dependency Audit Hook', category: 'Hooks & Automation', description: 'Check for outdated or vulnerable dependencies before deploy.', free: false, content: '' },
  { id: 20, title: 'Clean Code Reviewer', category: 'Code Review', description: 'Review code against clean code principles with actionable feedback.', free: false, content: '' },
  { id: 21, title: 'Performance Profiler', category: 'Code Review', description: 'Profile React components for unnecessary re-renders and memory leaks.', free: false, content: '' },
  { id: 22, title: 'Accessibility Audit', category: 'Code Review', description: 'Check components against WCAG 2.1 AA standards with fix suggestions.', free: false, content: '' },
  { id: 23, title: 'Facebook Ad Copy Generator', category: 'Marketing', description: '10 ad variations with headlines, body copy, and CTA for any product.', free: false, content: '' },
  { id: 24, title: 'SEO Content Optimizer', category: 'Marketing', description: 'Optimize existing content for target keywords with on-page SEO.', free: false, content: '' },
  { id: 25, title: 'Sales Script Builder', category: 'Marketing', description: 'Build objection-handling sales scripts for phone, email, or DM.', free: false, content: '' },
  { id: 26, title: 'Lead Magnet Creator', category: 'Marketing', description: 'Design a lead magnet strategy with landing page copy and email sequence.', free: false, content: '' },
  { id: 27, title: 'SMS Campaign Templates', category: 'Marketing', description: '20 SMS templates for promos, reminders, follow-ups, and re-engagement.', free: false, content: '' },
  { id: 28, title: 'Business Proposal Generator', category: 'Business', description: 'Professional proposals with scope, timeline, pricing, and terms.', free: false, content: '' },
  { id: 29, title: 'SOP Writer', category: 'Business', description: 'Create step-by-step standard operating procedures for any process.', free: false, content: '' },
  { id: 30, title: 'Financial Report Prompt', category: 'Business', description: 'Generate monthly/quarterly financial summaries with insights.', free: false, content: '' },
  { id: 31, title: 'Hiring Interview Kit', category: 'Business', description: 'Role-specific interview questions, scoring rubrics, and evaluation templates.', free: false, content: '' },
  { id: 32, title: 'YouTube Script Framework', category: 'Content Creation', description: 'Hook-story-offer video scripts optimized for retention.', free: false, content: '' },
  { id: 33, title: 'Newsletter Builder', category: 'Content Creation', description: 'Weekly newsletter templates with subject lines, sections, and CTAs.', free: false, content: '' },
  { id: 34, title: 'Social Media Carousel', category: 'Content Creation', description: 'Generate 10-slide carousel content for LinkedIn or Instagram.', free: false, content: '' },
  { id: 35, title: 'Podcast Show Notes', category: 'Content Creation', description: 'Transform podcast transcripts into show notes, highlights, and quotes.', free: false, content: '' },
]

function PromptCard({ prompt, onCopy, onUnlock, t }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    if (onCopy) onCopy()
  }

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={styles.cardTop}>
        <span style={styles.cardCategory}>{prompt.category}</span>
        {prompt.free ? (
          <span style={styles.freeBadge}>{t('prompts.free')}</span>
        ) : (
          <span style={styles.proBadge}>{t('prompts.premium')}</span>
        )}
      </div>
      <h3 style={styles.cardTitle}>{prompt.title}</h3>
      <p style={styles.cardDesc}>{prompt.description}</p>

      {prompt.free ? (
        <>
          <pre style={styles.codeBlock}>{prompt.content}</pre>
          <button
            onClick={handleCopy}
            style={{ ...styles.copyBtn, background: copied ? '#10b981' : 'rgba(99,102,241,0.15)' }}
          >
            {copied ? t('prompts.copied') : t('prompts.copy')}
          </button>
        </>
      ) : (
        <>
          <div style={styles.lockedBlock}>
            <span style={styles.lockIcon}>🔒</span>
            <span>{t('prompts.unlock')}</span>
          </div>
          <button onClick={onUnlock} style={styles.unlockBtn}>
            {t('prompts.unlock')}
          </button>
        </>
      )}
    </div>
  )
}

export default function PromptsPage() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [ref, visible] = useScrollReveal(0.05)
  const { t } = useLang()

  const filtered = PROMPTS
    .filter((p) => active === 'All' || p.category === active)
    .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))

  const freeCount = PROMPTS.filter((p) => p.free).length
  const totalCount = PROMPTS.length

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.eyebrow}>{t('prompts.eyebrow')}</span>
          <h1 style={styles.heading}>{t('prompts.heading')}</h1>
          <p style={styles.sub}>
            {totalCount} ready-to-use prompts for AI, marketing, business & code.
            {' '}<span style={{ color: '#6ee7b7' }}>{freeCount} {t('prompts.free')}</span> — copy & use instantly.
          </p>
        </div>

        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{ ...styles.tab, ...(active === cat ? styles.tabActive : {}) }}
            >
              {cat}
              <span style={styles.tabCount}>
                {cat === 'All' ? totalCount : PROMPTS.filter((p) => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        <div
          ref={ref}
          style={{
            ...styles.grid,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease',
          }}
        >
          {filtered.map((p) => (
            <PromptCard
              key={p.id}
              prompt={p}
              t={t}
              onUnlock={() => navigate(isAuthenticated ? '/store' : '/register')}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={styles.empty}>No prompts match your search.</p>
        )}

        <div style={styles.ctaSection}>
          <h2 style={styles.ctaHeading}>{t('prompts.ctaHeading')}</h2>
          <p style={styles.ctaSub}>{t('prompts.ctaSub')}</p>
          <button
            style={styles.ctaBtn}
            onClick={() => navigate(isAuthenticated ? '/store' : '/register')}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)' }}
          >
            {t('prompts.ctaBtn')}
          </button>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  eyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  heading: { fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#888', fontSize: '1rem', margin: 0 },
  searchWrap: { maxWidth: '500px', margin: '0 auto 2rem' },
  searchInput: { width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  tabs: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', marginBottom: '2rem' },
  tab: { padding: '0.4rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#888', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  tabActive: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid transparent' },
  tabCount: { fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '999px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' },
  card: { borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  cardCategory: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' },
  freeBadge: { fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '999px', background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontWeight: 600 },
  proBadge: { fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '999px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 600 },
  cardTitle: { fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem' },
  cardDesc: { fontSize: '0.85rem', color: '#777', lineHeight: 1.5, margin: '0 0 1rem' },
  codeBlock: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', fontSize: '0.78rem', color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '0 0 1rem', flex: 1, fontFamily: 'ui-monospace, Consolas, monospace', maxHeight: '200px', overflow: 'auto' },
  copyBtn: { padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%' },
  lockedBlock: { background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', padding: '2rem', textAlign: 'center', color: '#555', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center', marginBottom: '1rem' },
  lockIcon: { fontSize: '1.5rem' },
  unlockBtn: { padding: '0.6rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%' },
  empty: { textAlign: 'center', color: '#555', padding: '3rem', fontSize: '1rem' },
  ctaSection: { textAlign: 'center', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '3rem' },
  ctaHeading: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' },
  ctaSub: { color: '#777', marginBottom: '2rem' },
  ctaBtn: { padding: '0.9rem 2.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
```

---

### `frontend/src/pages/OAuthCallback.jsx`

```jsx
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const PROVIDER_LABELS = {
  discord: 'Discord',
  google: 'Google',
  facebook: 'Facebook',
  apple: 'iCloud',
  telegram: 'Telegram',
}

export default function OAuthCallback() {
  const { provider } = useParams()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setError(`No authorization code received from ${PROVIDER_LABELS[provider] || provider}`)
      return
    }

    api.post(`/auth/${provider}`, { code })
      .then((res) => {
        login(res.data.access_token)
        navigate('/portfolio', { replace: true })
      })
      .catch((err) => {
        setError(err.response?.data?.detail || `${PROVIDER_LABELS[provider] || provider} login failed`)
      })
  }, [provider, searchParams, login, navigate])

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.error}>{error}</p>
          <a href="/login" style={styles.link}>Back to login</a>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <p style={styles.text}>Logging in with {PROVIDER_LABELS[provider] || provider}...</p>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    textAlign: 'center',
  },
  text: {
    color: '#888',
    fontSize: '1rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.95rem',
    marginBottom: '1rem',
  },
  link: {
    color: '#a5b4fc',
    textDecoration: 'none',
  },
}
```

---

### `frontend/src/pages/ContactPage.jsx`

```jsx
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

export default function ContactPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'sent' | 'error'

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.post('/contact', form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.eyebrow}>{t('contact.eyebrow')}</span>
          <h1 style={styles.heading}>{t('contact.heading')}</h1>
          <p style={styles.sub}>{t('contact.sub')}</p>
        </div>

        <div style={styles.grid}>
          {/* ── Quick Contact Cards ─────────────────────── */}
          <div style={styles.sidebar}>
            <a
              href="https://wa.me/13057999003?text=Hi%2C%20I'm%20interested%20in%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.contactCard}
            >
              <div style={{ ...styles.iconWrap, background: 'rgba(37,211,102,0.1)', borderColor: 'rgba(37,211,102,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <strong style={styles.cardTitle}>{t('contact.whatsapp')}</strong>
                <span style={styles.cardSub}>{t('contact.whatsappSub')}</span>
              </div>
              <span style={styles.arrow}>&rarr;</span>
            </a>

            <div style={styles.contactCard}>
              <div style={{ ...styles.iconWrap, background: 'rgba(0,107,255,0.1)', borderColor: 'rgba(0,107,255,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#006BFF">
                  <path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm0 2l-7 4.5L5 6h14zm0 12H5a1 1 0 01-1-1V8.37l7.43 4.78a1 1 0 001.14 0L20 8.37V17a1 1 0 01-1 1z"/>
                </svg>
              </div>
              <div>
                <strong style={styles.cardTitle}>{t('contact.calendly')}</strong>
                <span style={styles.cardSub}>{t('contact.calendlySub')}</span>
              </div>
            </div>

            <div style={styles.socialSection}>
              <p style={styles.socialTitle}>{t('contact.follow')}</p>
              <div style={styles.socialLinks}>
                <a href="#" style={styles.socialBtn} title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" style={styles.socialBtn} title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" style={styles.socialBtn} title="X / Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* ── Contact Form ───────────────────────────── */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>{t('contact.formTitle')}</h2>

            {status === 'sent' && (
              <div style={styles.success}>{t('contact.sent')}</div>
            )}
            {status === 'error' && (
              <div style={styles.errorMsg}>{t('contact.error')}</div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>
                {t('contact.name')}
                <input name="name" type="text" value={form.name} onChange={handleChange} required style={styles.input} placeholder={t('contact.namePlaceholder')} />
              </label>
              <label style={styles.label}>
                {t('contact.email')}
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={styles.input} placeholder={t('contact.emailPlaceholder')} />
              </label>
              <label style={styles.label}>
                {t('contact.message')}
                <textarea name="message" value={form.message} onChange={handleChange} required style={{ ...styles.input, minHeight: '140px', resize: 'vertical' }} placeholder={t('contact.messagePlaceholder')} />
              </label>
              <button type="submit" disabled={status === 'sending'} style={styles.submitBtn}>
                {status === 'sending' ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  eyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: '0.8rem', marginBottom: '1rem' },
  heading: { fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#888', fontSize: '1rem', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  contactCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' },
  iconWrap: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', flexShrink: 0 },
  cardTitle: { display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' },
  cardSub: { fontSize: '0.8rem', color: '#888' },
  arrow: { marginLeft: 'auto', color: '#666', fontSize: '1.1rem' },
  socialSection: { padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' },
  socialTitle: { fontSize: '0.85rem', color: '#888', margin: '0 0 0.8rem' },
  socialLinks: { display: 'flex', gap: '0.6rem' },
  socialBtn: { width: '40px', height: '40px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', textDecoration: 'none', transition: 'border-color 0.2s' },
  formCard: { padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' },
  formTitle: { fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem' },
  success: { padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: '1rem' },
  errorMsg: { padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.9rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#ccc' },
  input: { padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  footer: { textAlign: 'center', padding: '2rem', color: '#555', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
```

---

### `frontend/src/pages/DownloadPage.jsx`

```jsx
import { useSearchParams } from 'react-router-dom'
import { Download, CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLang } from '../i18n/LanguageContext'

const PRODUCT_FILES = {
  'prompts-real-estate': { name: 'Real Estate Prompt Pack', file: '/downloads/Real-Estate-Prompt-Pack-ClaudeFO.pdf' },
  'prompts-marketing': { name: 'Marketing & Sales Prompts', file: null },
  'prompts-business': { name: 'Business & Productivity Pack', file: null },
  'prompts-content': { name: 'Content Creator Toolkit', file: null },
  'finance-tracker': { name: 'Monthly Finance Tracker', file: null },
  'website-templates': { name: 'Website Templates Pack', file: null },
  'real-estate-template': { name: 'Real Estate Landing Template', file: null },
  'social-media-kit': { name: 'Social Media Kit', file: null },
  'content-calendar': { name: 'Content Calendar Planner', file: null },
  'lead-funnel-template': { name: 'Lead Funnel Blueprint', file: null },
  'email-sms-playbook': { name: 'Email & SMS Playbook', file: null },
  'automation-starter-kit': { name: 'Automation Starter Kit', file: null },
}

export default function DownloadPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('product')
  const product = PRODUCT_FILES[productId]
  const { t } = useLang()

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.iconWrap}>
          <CheckCircle size={48} color="#10b981" strokeWidth={1.5} />
        </div>
        <h1 style={s.heading}>{t('download.heading')}</h1>
        <p style={s.sub}>{t('download.sub')}</p>

        {product ? (
          <div style={s.card}>
            <h2 style={s.productName}>{product.name}</h2>
            {product.file ? (
              <a href={product.file} download style={s.downloadBtn}>
                <Download size={18} /> {t('download.btn')}
              </a>
            ) : (
              <div style={s.pendingMsg}>
                <p>{t('download.pending')}</p>
                <p style={s.small}>{t('download.pendingSub')}</p>
              </div>
            )}
          </div>
        ) : (
          <div style={s.card}>
            <p>{t('download.pending')}</p>
          </div>
        )}

        <a href="/store" style={s.backLink}>
          {t('download.back')} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '500px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' },
  iconWrap: { marginBottom: '1.5rem' },
  heading: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', marginBottom: '2rem' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' },
  productName: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' },
  downloadBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s' },
  pendingMsg: { color: '#888', lineHeight: 1.6 },
  small: { fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', textDecoration: 'none', fontSize: '0.95rem' },
}
```
