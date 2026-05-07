import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import ServicesSection from '../components/sections/ServicesSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import PortfolioTeaser from '../components/sections/PortfolioTeaser'
import ProcessSection from '../components/sections/ProcessSection'
import PackagesSection from '../components/sections/PackagesSection'
import { useLang } from '../i18n/LanguageContext'
import StickyCtaBar from '../components/StickyCtaBar'
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

function StatStatic({ label, value }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        ...statStyles.item,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      <span style={statStyles.number}>{value}</span>
      <span style={statStyles.label}>{label}</span>
    </div>
  )
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  )
}

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{ ...faqStyles.item, borderColor: open ? 'rgba(200,167,107,0.25)' : 'rgba(255,255,255,0.06)' }}
      onClick={() => setOpen(!open)}
    >
      <div style={faqStyles.question}>
        <span style={faqStyles.qText}>{item.q}</span>
        <ChevronDown size={18} color="#666" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }} />
      </div>
      {open && <p style={faqStyles.answer}>{item.a}</p>}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const typedText = useTypingEffect(t('typingWords'), 70, 40, 1800)

  return (
    <div style={styles.page}>
      <Navbar />
      <StickyCtaBar />

      {/* ── 1. Hero ──────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroGlow2} />
        <div style={styles.heroContent}>
          <div style={styles.heroInner}>
            <Reveal>
              <p style={styles.eyebrow}>{t('hero.eyebrow')}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 style={styles.heading}>
                {t('hero.heading')}{' '}
                <span style={styles.typed}>{typedText}</span>
                <span style={styles.cursor}>|</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={styles.sub}>{t('hero.sub')}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div style={styles.heroActions}>
                <button
                  style={styles.primaryBtn}
                  onClick={() => navigate('/contact')}
                >
                  {t('hero.cta')} <ArrowRight size={16} />
                </button>
                <button style={styles.ghostBtn} onClick={() => navigate('/pricing')}>
                  {t('hero.secondary')}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────── */}
      <section style={styles.statsStrip}>
        <Reveal>
          <div style={statStyles.bar}>
            <StatCounter label={t('stats.projects')} value={50} suffix="+" />
            <StatCounter label={t('stats.clients')} value={30} suffix="+" />
            <StatStatic label={t('stats.tools')} value="EN/ES" />
            <StatCounter label={t('stats.experience')} value={5} suffix="+" />
          </div>
        </Reveal>
      </section>

      {/* ── 2. What we automate ─────────────────────────── */}
      <ServicesSection />

      {/* ── 3. How it works ─────────────────────────────── */}
      <ProcessSection />

      {/* ── 4. Packages ─────────────────────────────────── */}
      <PackagesSection />

      {/* ── 5. Why Claude.FO ────────────────────────────── */}
      <FeaturesSection />

      {/* ── 6. Portfolio highlights ─────────────────────── */}
      <PortfolioTeaser />

      {/* ── 7. FAQ ──────────────────────────────────────── */}
      <section style={styles.faqSection}>
        <Reveal>
          <h2 style={styles.sectionHeading}>{t('faq.heading')}</h2>
          <p style={styles.faqSub}>{t('faq.sub')}</p>
        </Reveal>
        <div style={styles.faqList}>
          {t('faq.items').map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <FAQItem item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 8. Final CTA ────────────────────────────────── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaGlow} />
        <Reveal>
          <h2 style={styles.ctaHeading}>{t('cta.heading')}</h2>
          <p style={styles.ctaSub}>{t('cta.sub')}</p>
          <div style={styles.ctaActions}>
            <button
              style={styles.ctaBtn}
              onClick={() => navigate('/contact')}
            >
              {t('cta.btn')} <ArrowRight size={16} />
            </button>
            <button style={styles.ghostBtn} onClick={() => navigate('/pricing')}>
              {t('cta.prompts')}
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh' },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: 'clamp(4rem, 10vh, 8rem) 2rem clamp(3rem, 8vh, 6rem)',
  },
  heroGlow: {
    position: 'absolute',
    top: '-20%',
    left: '20%',
    width: '600px',
    height: '500px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'float 8s ease-in-out infinite',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: '-10%',
    right: '10%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(200,167,107,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    textAlign: 'center',
  },
  heroInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  eyebrow: {
    display: 'inline-block',
    padding: '0.4rem 1.2rem',
    borderRadius: '999px',
    border: '1px solid rgba(200,167,107,0.3)',
    background: 'rgba(200,167,107,0.05)',
    color: '#c8a76b',
    fontSize: '0.78rem',
    marginBottom: '1.5rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  heading: {
    fontSize: 'clamp(2rem, 5vw, 3.4rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: '1.2rem',
    letterSpacing: '-0.03em',
    maxWidth: '880px',
  },
  typed: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7, #c8a76b, #6366f1)',
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'gradientShift 6s ease infinite',
  },
  cursor: {
    color: '#c8a76b',
    fontWeight: 300,
    animation: 'blink 1s step-end infinite',
  },
  sub: {
    color: '#9ca3af',
    fontSize: '1.05rem',
    maxWidth: '680px',
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  heroActions: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.9rem 2.2rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
  },
  ghostBtn: {
    padding: '0.9rem 2.2rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.02)',
    color: '#aaa',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  statsStrip: {
    padding: '0 2rem 4rem',
    maxWidth: '900px',
    margin: '0 auto',
  },

  sectionHeading: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 800,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },

  faqSection: {
    padding: '5rem 2rem',
    maxWidth: '720px',
    margin: '0 auto',
  },
  faqSub: {
    color: '#666',
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },

  ctaSection: {
    textAlign: 'center',
    padding: '5rem 2rem',
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
    marginBottom: '0.8rem',
    letterSpacing: '-0.02em',
    position: 'relative',
  },
  ctaSub: {
    color: '#9ca3af',
    fontSize: '1.05rem',
    marginBottom: '2rem',
    position: 'relative',
    maxWidth: '640px',
    margin: '0 auto 2rem',
  },
  ctaActions: {
    display: 'flex',
    gap: '0.8rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    position: 'relative',
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 3rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    boxShadow: '0 4px 20px rgba(200,167,107,0.3)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
}

const faqStyles = {
  item: {
    padding: '1.2rem 1.5rem',
    borderRadius: '14px',
    border: '1px solid',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
  },
  question: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  qText: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#e0e0e0',
  },
  answer: {
    color: '#9ca3af',
    fontSize: '0.88rem',
    lineHeight: 1.7,
    margin: '0.8rem 0 0',
    paddingTop: '0.8rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
}

const statStyles = {
  bar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(2rem, 5vw, 3.5rem)',
    flexWrap: 'wrap',
    padding: '2.5rem 2rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    backdropFilter: 'blur(8px)',
  },
  item: { textAlign: 'center', minWidth: '100px' },
  number: {
    display: 'block',
    fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #c8a76b, #f0d89c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.2,
  },
  label: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
}
