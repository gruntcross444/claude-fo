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
        <Link to="/services" style={styles.link}>{t('nav.services')}</Link>
        <Link to="/pricing" style={styles.link}>{t('nav.pricing')}</Link>
        <Link to="/portfolio" style={styles.link}>{t('nav.portfolio')}</Link>
        <Link to="/store" style={styles.link}>{t('nav.store')}</Link>
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
          <Link to="/services" style={styles.mobileLink} onClick={closeMenu}>{t('nav.services')}</Link>
          <Link to="/pricing" style={styles.mobileLink} onClick={closeMenu}>{t('nav.pricing')}</Link>
          <Link to="/portfolio" style={styles.mobileLink} onClick={closeMenu}>{t('nav.portfolio')}</Link>
          <Link to="/store" style={styles.mobileLink} onClick={closeMenu}>{t('nav.store')}</Link>
          <Link to="/contact" style={styles.mobileLink} onClick={closeMenu}>{t('nav.contact')}</Link>
          <div style={styles.mobileDivider} />
          <button onClick={toggleLang} style={styles.mobileLangBtn}>
            {t('nav.switchLang')}
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

