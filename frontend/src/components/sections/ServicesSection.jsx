import { Code2, Building2, Palette, Bot, Smartphone } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'

const services = [
  {
    Icon: Code2,
    title: 'Web Development',
    description: 'Full-stack applications built with modern technologies. Fast, scalable, and maintainable code.',
    accent: '#6366f1',
  },
  {
    Icon: Building2,
    title: 'Real Estate',
    description: 'Rental community platforms, property landing pages, and lead-generating tools for the real estate industry.',
    accent: '#c8a76b',
  },
  {
    Icon: Palette,
    title: 'Logo & Branding',
    description: 'Vector logos, animated logos, brand identity systems, and social media kits that make you stand out.',
    accent: '#a855f7',
  },
  {
    Icon: Bot,
    title: 'AI & Automation',
    description: 'Workflow automations, AI-powered funnels, lead magnets, email blasts, and SMS campaigns that run on autopilot.',
    accent: '#14b8a6',
  },
  {
    Icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Cross-platform mobile experiences that feel native. Reach your users wherever they are.',
    accent: '#f59e0b',
  },
]

function ServiceCard({ Icon, title, description, accent, delay }) {
  const [ref, visible] = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      style={{
        ...styles.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease ${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}44`
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 12px 40px ${accent}15`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ ...styles.iconWrap, background: `${accent}15`, border: `1px solid ${accent}30` }}>
        <Icon size={24} color={accent} strokeWidth={1.5} />
      </div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{description}</p>
      <div style={{ ...styles.cardLine, background: accent }} />
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section id="services" style={styles.section}>
      <h2 style={styles.heading}>Services</h2>
      <p style={styles.subheading}>What we bring to the table</p>
      <div style={styles.grid}>
        {services.map((s, i) => (
          <ServiceCard key={s.title} {...s} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: { padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' },
  heading: { fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' },
  subheading: { color: '#666', marginBottom: '3rem', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' },
  card: {
    padding: '2rem 1.5rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    textAlign: 'left',
    cursor: 'default',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  cardTitle: { fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem' },
  cardText: { color: '#777', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 },
  cardLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', opacity: 0.5 },
}
