import { Inbox, CalendarClock, Database, UserCheck, FileText } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useLang } from '../../i18n/LanguageContext'

function BentoCard({ Icon, title, description, accent, delay, large }) {
  const [ref, visible] = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      style={{
        ...styles.card,
        ...(large ? styles.cardLarge : {}),
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(25px)',
        transition: `all 0.6s ease ${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}40`
        e.currentTarget.style.boxShadow = `0 16px 50px ${accent}10`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ ...styles.cardGlow, background: `radial-gradient(ellipse at top left, ${accent}08 0%, transparent 60%)` }} />
      <div style={{ ...styles.iconWrap, background: `${accent}12`, border: `1px solid ${accent}25` }}>
        <Icon size={large ? 28 : 22} color={accent} strokeWidth={1.5} />
      </div>
      <h3 style={{ ...styles.cardTitle, fontSize: large ? '1.3rem' : '1.05rem' }}>{title}</h3>
      <p style={styles.cardText}>{description}</p>
      <div style={{ ...styles.cardLine, background: accent }} />
    </div>
  )
}

export default function ServicesSection() {
  const { t } = useLang()

  const services = [
    { Icon: Inbox, title: t('services.leadCapture.title'), description: t('services.leadCapture.desc'), accent: '#6366f1', large: true },
    { Icon: CalendarClock, title: t('services.scheduling.title'), description: t('services.scheduling.desc'), accent: '#14b8a6', large: true },
    { Icon: Database, title: t('services.crm.title'), description: t('services.crm.desc'), accent: '#a855f7', large: false },
    { Icon: UserCheck, title: t('services.onboarding.title'), description: t('services.onboarding.desc'), accent: '#c8a76b', large: false },
    { Icon: FileText, title: t('services.proposal.title'), description: t('services.proposal.desc'), accent: '#f59e0b', large: false },
  ]

  return (
    <section id="services" style={styles.section}>
      <h2 style={styles.heading}>{t('services.heading')}</h2>
      <p style={styles.subheading}>{t('services.sub')}</p>
      <div style={styles.bentoGrid}>
        {services.map((s, i) => (
          <BentoCard key={s.title} {...s} delay={i * 0.08} />
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: { padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' },
  heading: { fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  subheading: { color: '#666', marginBottom: '3rem', fontSize: '1rem', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '1rem',
  },
  card: {
    gridColumn: 'span 2',
    padding: '2rem 1.5rem',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(4px)',
    textAlign: 'left',
    cursor: 'default',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  cardLarge: {
    gridColumn: 'span 3',
    padding: '2.5rem 2rem',
  },
  cardGlow: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  iconWrap: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', position: 'relative' },
  cardTitle: { fontWeight: 700, margin: '0 0 0.5rem', position: 'relative' },
  cardText: { color: '#888', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, position: 'relative' },
  cardLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', opacity: 0.4 },
}

// Responsive: collapse bento on mobile
if (typeof document !== 'undefined') {
  const id = 'services-responsive'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @media (max-width: 768px) {
        #services > div:last-child > div {
          grid-column: span 6 !important;
        }
      }
      @media (min-width: 769px) and (max-width: 1024px) {
        #services > div:last-child > div {
          grid-column: span 3 !important;
        }
      }
    `
    document.head.appendChild(style)
  }
}
