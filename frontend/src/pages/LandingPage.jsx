import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ServicesSection from '../components/sections/ServicesSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import PortfolioTeaser from '../components/sections/PortfolioTeaser'
import { useAuth } from '../context/AuthContext'
import useTypingEffect from '../hooks/useTypingEffect'
import useCounter from '../hooks/useCounter'
import useScrollReveal from '../hooks/useScrollReveal'

const TYPING_WORDS = [
  'stunning websites',
  'AI automations',
  'brand identities',
  'lead funnels',
  'magic prompts',
  'mobile apps',
  'digital products',
]

const STATS = [
  { label: 'Projects Delivered', value: 50, suffix: '+' },
  { label: 'Happy Clients', value: 30, suffix: '+' },
  { label: 'Tools Built', value: 12, suffix: '' },
  { label: 'Years Experience', value: 5, suffix: '+' },
]

function StatCounter({ label, value, suffix }) {
  const [ref, count] = useCounter(value, 2000)
  return (
    <div ref={ref} style={statStyles.item}>
      <span style={statStyles.number}>{count}{suffix}</span>
      <span style={statStyles.label}>{label}</span>
    </div>
  )
}

function RevealSection({ children, delay = 0, style = {} }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const typedText = useTypingEffect(TYPING_WORDS, 90, 50, 1800)

  return (
    <div style={styles.page}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <RevealSection>
          <p style={styles.eyebrow}>Premium Digital Agency</p>
        </RevealSection>
        <RevealSection delay={0.1}>
          <h1 style={styles.heading}>
            We craft<br />
            <span style={styles.typed}>{typedText}</span>
            <span style={styles.cursor}>|</span>
          </h1>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p style={styles.sub}>
            Full-stack development, AI automation, branding & real estate solutions.<br />
            Exclusive. Premium. Results-driven.
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
              {isAuthenticated ? 'View Portfolio' : 'Explore Our Work'}
            </button>
            <a
              href="#services"
              style={styles.secondaryBtn}
              onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.color = '#fff' }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = '#aaa' }}
            >
              Our Services
            </a>
          </div>
        </RevealSection>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────── */}
      <RevealSection>
        <section style={statStyles.bar}>
          {STATS.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </section>
      </RevealSection>

      {/* ── Trusted By ────────────────────────────────────── */}
      <RevealSection>
        <section style={styles.trustedSection}>
          <p style={styles.trustedLabel}>Trusted by businesses in</p>
          <div style={styles.trustedLogos}>
            {['Miami', 'New York', 'Los Angeles', 'Dubai', 'London'].map((city) => (
              <span key={city} style={styles.trustedItem}>{city}</span>
            ))}
          </div>
        </section>
      </RevealSection>

      <ServicesSection />
      <FeaturesSection />
      <PortfolioTeaser />

      {/* ── CTA Section ───────────────────────────────────── */}
      <RevealSection>
        <section style={styles.ctaSection}>
          <div style={styles.ctaGlow} />
          <h2 style={styles.ctaHeading}>Ready to elevate your brand?</h2>
          <p style={styles.ctaSub}>Let's build something extraordinary together.</p>
          <button
            style={styles.ctaBtn}
            onClick={() => navigate(isAuthenticated ? '/contact' : '/register')}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 8px 30px rgba(200,167,107,0.3)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none' }}
          >
            {isAuthenticated ? 'Get in Touch' : 'Start Your Project'}
          </button>
        </section>
      </RevealSection>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — All rights reserved</p>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    overflow: 'hidden',
  },
  hero: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '8rem 2rem 4rem',
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
    padding: '0.9rem 2.5rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#aaa',
    fontSize: '1rem',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  trustedSection: {
    textAlign: 'center',
    padding: '2rem 2rem 4rem',
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
    padding: '6rem 2rem',
    position: 'relative',
    margin: '2rem 0',
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
  item: {
    textAlign: 'center',
    minWidth: '120px',
  },
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
