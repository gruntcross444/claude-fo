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
