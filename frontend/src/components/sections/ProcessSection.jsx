import useScrollReveal from '../../hooks/useScrollReveal'
import { useLang } from '../../i18n/LanguageContext'
import { FileSearch, Hammer, Rocket } from 'lucide-react'

const ICONS = [FileSearch, Hammer, Rocket]
const COLORS = ['#6366f1', '#c8a76b', '#10b981']

function StepCard({ icon: Icon, num, title, desc, color, delay, last }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        ...s.step,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `all 0.6s ease ${delay}s`,
      }}
    >
      <div style={{ ...s.iconWrap, background: `${color}12`, border: `1px solid ${color}28` }}>
        <Icon size={22} color={color} strokeWidth={1.5} />
      </div>
      <div style={{ ...s.numBadge, color, borderColor: `${color}30`, background: `${color}08` }}>
        {num}
      </div>
      <h3 style={s.stepTitle}>{title}</h3>
      <p style={s.stepDesc}>{desc}</p>
      {!last && <div style={{ ...s.connector, background: `linear-gradient(90deg, ${color}40, transparent)` }} />}
    </div>
  )
}

export default function ProcessSection() {
  const { t } = useLang()
  const steps = [
    t('process.step1'),
    t('process.step2'),
    t('process.step3'),
  ]

  return (
    <section style={s.section}>
      <div style={s.glow} />
      <div style={s.inner}>
        <div style={s.header}>
          <div style={s.eyebrow}>{t('process.eyebrow')}</div>
          <h2 style={s.heading}>{t('process.heading')}</h2>
          <p style={s.sub}>{t('process.sub')}</p>
        </div>
        <div style={s.grid}>
          {steps.map((step, i) => (
            <StepCard
              key={step.num}
              icon={ICONS[i]}
              num={step.num}
              title={step.title}
              desc={step.desc}
              color={COLORS[i]}
              delay={i * 0.15}
              last={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const s = {
  section: {
    padding: '6rem 2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  inner: {
    maxWidth: '1000px',
    margin: '0 auto',
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3.5rem',
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
  heading: {
    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: '0.6rem',
  },
  sub: {
    color: '#666',
    fontSize: '1rem',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    position: 'relative',
  },
  step: {
    padding: '2rem 1.8rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrap: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  numBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
  },
  stepTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    margin: '0 0 0.6rem',
    color: '#f3f4f6',
  },
  stepDesc: {
    color: '#888',
    fontSize: '0.88rem',
    lineHeight: 1.7,
    margin: 0,
  },
  connector: {
    position: 'absolute',
    top: '2.5rem',
    right: '-1.5rem',
    width: '1.5rem',
    height: '1px',
    pointerEvents: 'none',
  },
}

// Responsive
if (typeof document !== 'undefined') {
  const id = 'process-responsive'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @media (max-width: 768px) {
        #process-grid { grid-template-columns: 1fr !important; }
      }
    `
    document.head.appendChild(style)
  }
}
