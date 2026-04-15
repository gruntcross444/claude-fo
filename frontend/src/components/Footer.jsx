import { Link, useLocation } from 'react-router-dom'
import { Mail, Home } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

// Inline Instagram glyph — some lucide-react builds omit the export.
function InstagramIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

/**
 * Canonical site footer. Mounted globally in App.jsx.
 * Skips routes where a footer is unnecessary (auth flows, OAuth callback).
 */
const HIDE_ON = new Set([
  '/login',
  '/register',
  '/auth/google/callback',
  '/auth/discord/callback',
])

export default function Footer() {
  const { t } = useLang()
  const { pathname } = useLocation()

  if (HIDE_ON.has(pathname) || pathname.startsWith('/auth/')) return null

  const year = new Date().getFullYear()

  return (
    <footer style={s.footer} role="contentinfo">
      <div style={s.inner}>
        <div style={s.brandCol}>
          <div style={s.logo}>
            <span style={s.logoAccent}>Claude</span>.FO
          </div>
          <p style={s.tagline}>{t('footer.tagline')}</p>
          <div style={s.fairRow}>
            <Home size={12} color="#c8a76b" />
            <span>{t('footer.fairHousing')}</span>
          </div>
        </div>

        <div style={s.col}>
          <h4 style={s.colHead}>{t('footer.explore')}</h4>
          <Link to="/store" style={s.link}>{t('nav.store')}</Link>
          <Link to="/tools" style={s.link}>{t('nav.tools')}</Link>
          <Link to="/prompts" style={s.link}>{t('nav.prompts')}</Link>
          <Link to="/brickell" style={s.link}>Brickell</Link>
          <Link to="/contact" style={s.link}>{t('nav.contact')}</Link>
        </div>

        <div style={s.col}>
          <h4 style={s.colHead}>{t('footer.legal')}</h4>
          <Link to="/privacy" style={s.link}>{t('footer.privacy')}</Link>
          <Link to="/terms" style={s.link}>{t('footer.terms')}</Link>
          <span style={s.licenseLine}>{t('footer.license')}</span>
        </div>

        <div style={s.col}>
          <h4 style={s.colHead}>{t('footer.connect')}</h4>
          <a
            href="https://instagram.com/eliaskaramrealtor"
            target="_blank"
            rel="noopener noreferrer"
            style={s.link}
          >
            <InstagramIcon size={13} /> @eliaskaramrealtor
          </a>
          <a href="mailto:elias@claudefo.com" style={s.link}>
            <Mail size={13} /> elias@claudefo.com
          </a>
        </div>
      </div>

      <div style={s.bottom}>
        <p style={s.copy}>
          &copy; {year} Claude.FO — {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}

const s = {
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '3rem 2rem 1.5rem',
    marginTop: '2rem',
    background: 'rgba(0,0,0,0.2)',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '2rem 2.5rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    minWidth: '220px',
  },
  logo: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#f3f4f6',
    letterSpacing: '-0.02em',
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  tagline: {
    fontSize: '0.82rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: '280px',
  },
  fairRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.72rem',
    color: '#9ca3af',
    marginTop: '0.4rem',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.55rem',
  },
  colHead: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#c8a76b',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    margin: '0 0 0.4rem',
  },
  link: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.85rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'color 0.2s',
  },
  licenseLine: {
    color: '#6b7280',
    fontSize: '0.75rem',
    lineHeight: 1.5,
    marginTop: '0.3rem',
  },
  bottom: {
    maxWidth: '1100px',
    margin: '0 auto',
    paddingTop: '1.2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  copy: {
    color: '#4b5563',
    fontSize: '0.78rem',
    margin: 0,
  },
}
