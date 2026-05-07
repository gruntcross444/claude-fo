import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import PackagesSection from '../components/sections/PackagesSection'
import { useLang } from '../i18n/LanguageContext'
import useScrollReveal from '../hooks/useScrollReveal'

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function MiniCard({ title, price, desc, accent, ctaLabel, onClick }) {
  return (
    <div style={s.card}>
      <h3 style={s.cardTitle}>{title}</h3>
      <div style={{ ...s.cardPrice, color: accent }}>{price}</div>
      <p style={s.cardDesc}>{desc}</p>
      <button style={s.cardCta} onClick={onClick}>
        {ctaLabel} <ArrowRight size={14} />
      </button>
    </div>
  )
}

export default function PricingPage() {
  const { t } = useLang()
  const navigate = useNavigate()

  const goContact = () => navigate('/contact')
  const goStore = () => navigate('/store')

  return (
    <div>
      <Navbar />

      <section style={s.hero}>
        <Reveal>
          <p style={s.eyebrow}>{t('pricing.eyebrow')}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={s.heading}>{t('pricing.heading')}</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={s.sub}>{t('pricing.sub')}</p>
        </Reveal>
      </section>

      {/* Main offers reuse the same packages cards */}
      <PackagesSection showSeeAll={false} />

      {/* Add-ons */}
      <section style={s.block}>
        <Reveal>
          <h2 style={s.blockHeading}>{t('pricing.addonHeading')}</h2>
          <p style={s.blockSub}>{t('pricing.addonSub')}</p>
        </Reveal>
        <div style={s.grid}>
          <MiniCard
            title={t('pricing.landingPage.title')}
            price={t('pricing.landingPage.price')}
            desc={t('pricing.landingPage.desc')}
            accent="#a855f7"
            ctaLabel={t('servicesPage.cta')}
            onClick={goContact}
          />
          <MiniCard
            title={t('pricing.website.title')}
            price={t('pricing.website.price')}
            desc={t('pricing.website.desc')}
            accent="#6366f1"
            ctaLabel={t('servicesPage.cta')}
            onClick={goContact}
          />
        </div>
      </section>

      {/* Digital products */}
      <section style={s.block}>
        <Reveal>
          <h2 style={s.blockHeading}>{t('pricing.digitalHeading')}</h2>
          <p style={s.blockSub}>{t('pricing.digitalSub')}</p>
        </Reveal>
        <div style={s.grid}>
          <MiniCard
            title={t('pricing.digital.title')}
            price={t('pricing.digital.price')}
            desc={t('pricing.digital.desc')}
            accent="#10b981"
            ctaLabel={t('store.heading')}
            onClick={goStore}
          />
        </div>
      </section>

      <section style={s.finalCta}>
        <Reveal>
          <p style={s.finalSub}>{t('pricing.finalSub')}</p>
          <button style={s.ctaBtn} onClick={goContact}>
            {t('pricing.finalCta')} <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>
    </div>
  )
}

const s = {
  hero: {
    padding: 'clamp(4rem, 10vh, 7rem) 2rem 1rem',
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
  },
  eyebrow: {
    display: 'inline-block',
    padding: '0.35rem 1rem',
    borderRadius: '999px',
    border: '1px solid rgba(200,167,107,0.3)',
    background: 'rgba(200,167,107,0.06)',
    color: '#c8a76b',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: '1.2rem',
  },
  heading: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.1 },
  sub: { color: '#9ca3af', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto' },
  block: { padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' },
  blockHeading: { fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' },
  blockSub: { color: '#666', fontSize: '0.95rem', marginBottom: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.2rem',
  },
  card: {
    padding: '1.8rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f3f4f6' },
  cardPrice: { fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' },
  cardDesc: { color: '#888', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 },
  cardCta: {
    marginTop: '0.4rem',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.03)',
    color: '#e5e7eb',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
  },
  finalCta: {
    padding: '5rem 2rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: '2rem',
  },
  finalSub: { color: '#9ca3af', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.65 },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2.4rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    boxShadow: '0 4px 20px rgba(200,167,107,0.3)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
  },
}
