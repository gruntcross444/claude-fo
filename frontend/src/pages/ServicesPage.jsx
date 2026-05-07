import { useNavigate } from 'react-router-dom'
import { ArrowRight, Inbox, CalendarClock, Database, UserCheck, FileText, Globe, Layout, Box } from 'lucide-react'
import Navbar from '../components/Navbar'
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

function ServiceRow({ Icon, accent, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div style={s.row}>
        <div style={{ ...s.iconWrap, background: `${accent}12`, border: `1px solid ${accent}28` }}>
          <Icon size={22} color={accent} strokeWidth={1.5} />
        </div>
        <div>
          <h3 style={s.rowTitle}>{title}</h3>
          <p style={s.rowDesc}>{desc}</p>
        </div>
      </div>
    </Reveal>
  )
}

export default function ServicesPage() {
  const { t } = useLang()
  const navigate = useNavigate()

  const core = [
    { Icon: Inbox, accent: '#6366f1', title: t('services.leadCapture.title'), desc: t('services.leadCapture.desc') },
    { Icon: CalendarClock, accent: '#14b8a6', title: t('services.scheduling.title'), desc: t('services.scheduling.desc') },
    { Icon: Database, accent: '#a855f7', title: t('services.crm.title'), desc: t('services.crm.desc') },
    { Icon: UserCheck, accent: '#c8a76b', title: t('services.onboarding.title'), desc: t('services.onboarding.desc') },
    { Icon: FileText, accent: '#f59e0b', title: t('services.proposal.title'), desc: t('services.proposal.desc') },
  ]

  const addons = [
    { Icon: Layout, accent: '#a855f7', title: t('pricing.landingPage.title'), desc: t('pricing.landingPage.desc') },
    { Icon: Globe, accent: '#6366f1', title: t('pricing.website.title'), desc: t('pricing.website.desc') },
  ]

  const digital = [
    { Icon: Box, accent: '#10b981', title: t('pricing.digital.title'), desc: t('pricing.digital.desc') },
  ]

  return (
    <div>
      <Navbar />
      <section style={s.hero}>
        <Reveal>
          <p style={s.eyebrow}>{t('servicesPage.eyebrow')}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={s.heading}>{t('servicesPage.heading')}</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={s.sub}>{t('servicesPage.sub')}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <button style={s.cta} onClick={() => navigate('/contact')}>
            {t('servicesPage.cta')} <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      <section style={s.block}>
        <Reveal>
          <h2 style={s.blockHeading}>{t('servicesPage.coreHeading')}</h2>
          <p style={s.blockSub}>{t('servicesPage.coreSub')}</p>
        </Reveal>
        <div style={s.list}>
          {core.map((row, i) => <ServiceRow key={row.title} {...row} delay={i * 0.05} />)}
        </div>
      </section>

      <section style={s.block}>
        <Reveal>
          <h2 style={s.blockHeading}>{t('servicesPage.addonHeading')}</h2>
          <p style={s.blockSub}>{t('servicesPage.addonSub')}</p>
        </Reveal>
        <div style={s.list}>
          {addons.map((row, i) => <ServiceRow key={row.title} {...row} delay={i * 0.05} />)}
        </div>
      </section>

      <section style={s.block}>
        <Reveal>
          <h2 style={s.blockHeading}>{t('servicesPage.digitalHeading')}</h2>
          <p style={s.blockSub}>{t('servicesPage.digitalSub')}</p>
        </Reveal>
        <div style={s.list}>
          {digital.map((row, i) => <ServiceRow key={row.title} {...row} delay={i * 0.05} />)}
        </div>
      </section>

      <section style={s.finalCta}>
        <Reveal>
          <h2 style={s.ctaHeading}>{t('cta.heading')}</h2>
          <button style={s.ctaBtn} onClick={() => navigate('/contact')}>
            {t('servicesPage.cta')} <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>
    </div>
  )
}

const s = {
  hero: {
    padding: 'clamp(4rem, 10vh, 7rem) 2rem 3rem',
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
  sub: { color: '#9ca3af', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto 2rem' },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
  },
  block: { padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' },
  blockHeading: { fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' },
  blockSub: { color: '#666', fontSize: '0.95rem', marginBottom: '2rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: {
    display: 'flex',
    gap: '1.2rem',
    padding: '1.4rem 1.5rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    alignItems: 'flex-start',
  },
  iconWrap: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowTitle: { fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.3rem', color: '#f3f4f6' },
  rowDesc: { color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 },
  finalCta: {
    padding: '5rem 2rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: '2rem',
  },
  ctaHeading: { fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' },
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
