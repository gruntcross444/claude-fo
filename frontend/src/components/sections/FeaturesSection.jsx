import { Zap, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'

const features = [
  { Icon: Zap, title: 'Fast Delivery', description: 'Agile workflow means you get working software quickly, with regular updates along the way.', color: '#f59e0b' },
  { Icon: ShieldCheck, title: 'Secure by Default', description: 'Security is built in from day one — not bolted on after the fact.', color: '#10b981' },
  { Icon: Sparkles, title: 'Clean Code', description: 'Readable, maintainable code that your team can build on for years to come.', color: '#a855f7' },
  { Icon: MessageCircle, title: 'Clear Communication', description: 'Transparent updates and no surprises. You always know where your project stands.', color: '#6366f1' },
]

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
  return (
    <section id="features" style={styles.section}>
      <h2 style={styles.heading}>Why work with us</h2>
      <p style={styles.subheading}>The values that drive every project</p>
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
  item: {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    alignItems: 'flex-start',
    cursor: 'default',
    transition: 'all 0.3s ease',
  },
  iconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: { fontSize: '1rem', fontWeight: 600, margin: '0 0 0.4rem 0' },
  text: { color: '#777', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 },
}
