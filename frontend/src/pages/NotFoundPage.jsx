import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main style={s.page}>
        <div style={s.glow} aria-hidden="true" />
        <section style={s.inner}>
          <span style={s.eyebrow}>404 — Page not found</span>
          <h1 style={s.heading}>
            Looks like <span style={s.gradient}>this door</span>
            <br />
            doesn't open.
          </h1>
          <p style={s.sub}>
            The page you're after moved, got renamed, or was never here.
            No big deal — below is the way back.
          </p>

          <div style={s.ctaRow}>
            <Link to="/" style={s.ctaPrimary}>
              <Home size={16} /> Back to home
            </Link>
            <Link to="/contact" style={s.ctaSecondary}>
              <Mail size={16} /> Contact Elias
            </Link>
          </div>

          <div style={s.linksGrid}>
            <Link to="/brickell" style={s.link}>Brickell rentals <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} /></Link>
            <Link to="/store" style={s.link}>Prompt store <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} /></Link>
            <Link to="/tools" style={s.link}>Free tools <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} /></Link>
            <Link to="/prompts" style={s.link}>AI prompts <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} /></Link>
          </div>
        </section>
      </main>
    </>
  )
}

const s = {
  page: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    height: '500px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 40%, transparent 75%)',
    pointerEvents: 'none',
  },
  inner: {
    maxWidth: '640px',
    textAlign: 'center',
    position: 'relative',
  },
  eyebrow: {
    display: 'inline-block',
    padding: '0.35rem 0.9rem',
    borderRadius: '999px',
    border: '1px solid rgba(200,167,107,0.3)',
    background: 'rgba(200,167,107,0.06)',
    color: '#c8a76b',
    fontSize: '0.72rem',
    letterSpacing: '0.14em',
    fontWeight: 700,
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    marginBottom: '1.2rem',
    color: '#f3f4f6',
  },
  gradient: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sub: {
    color: '#9ca3af',
    fontSize: '1rem',
    lineHeight: 1.6,
    margin: '0 auto 2rem',
    maxWidth: '480px',
  },
  ctaRow: {
    display: 'flex',
    gap: '0.8rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2.5rem',
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 1.6rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.92rem',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(99,102,241,0.25)',
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 1.6rem',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    color: '#f3f4f6',
    fontWeight: 600,
    fontSize: '0.92rem',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '0.6rem',
    maxWidth: '520px',
    margin: '0 auto',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: '#9ca3af',
    fontSize: '0.85rem',
    textDecoration: 'none',
    fontWeight: 500,
  },
}
