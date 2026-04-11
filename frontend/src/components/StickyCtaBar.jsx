import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function StickyCtaBar() {
  const { t } = useLang()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const footerRef = useRef(null)

  useEffect(() => {
    if (sessionStorage.getItem('sticky-cta-dismissed')) {
      setDismissed(true)
      return
    }

    // Show after scrolling 500px
    function onScroll() {
      setVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Hide when footer is visible
    const footer = document.querySelector('footer')
    let observer
    if (footer) {
      observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisible(false) },
        { threshold: 0.1 }
      )
      observer.observe(footer)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  function dismiss() {
    setDismissed(true)
    sessionStorage.setItem('sticky-cta-dismissed', '1')
  }

  if (dismissed) return null

  return (
    <div
      style={{
        ...s.bar,
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Pulse dot + text */}
      <div style={s.left}>
        <span style={s.dot} />
        <span style={s.text}>{t('stickyCta.text')}</span>
      </div>

      {/* CTA button */}
      <button
        style={s.btn}
        onClick={() => navigate(isAuthenticated ? '/contact' : '/register')}
      >
        {isAuthenticated ? t('stickyCta.btnAuth') : t('stickyCta.btn')}
        <ArrowRight size={15} />
      </button>

      {/* Dismiss */}
      <button style={s.close} onClick={dismiss} aria-label="Dismiss">
        <X size={15} color="#555" />
      </button>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }
      `}</style>
    </div>
  )
}

const s = {
  bar: {
    position: 'fixed',
    bottom: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%) translateY(110%)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.85rem 1rem 0.85rem 1.4rem',
    borderRadius: '999px',
    background: 'rgba(10,10,20,0.92)',
    border: '1px solid rgba(99,102,241,0.25)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
    backdropFilter: 'blur(16px)',
    transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100vw - 2rem)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    flex: 1,
    minWidth: 0,
  },
  dot: {
    display: 'inline-block',
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: '#10b981',
    flexShrink: 0,
    animation: 'pulse-dot 2s ease-in-out infinite',
  },
  text: {
    fontSize: '0.82rem',
    color: '#ccc',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.55rem 1.2rem',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
  close: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    padding: 0,
  },
}
