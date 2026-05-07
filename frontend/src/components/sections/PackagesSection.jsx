import { ArrowRight, Search, Workflow, Layers, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useLang } from '../../i18n/LanguageContext'

function Card({ icon: Icon, accent, tag, title, price, priceNote, desc, ctaLabel, onClick, featured, delay }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        ...s.card,
        ...(featured ? s.cardFeatured : {}),
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.55s ease ${delay}s`,
      }}
    >
      <div style={{ ...s.tag, color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>{tag}</div>
      <div style={{ ...s.iconWrap, background: `${accent}12`, border: `1px solid ${accent}28` }}>
        <Icon size={22} color={accent} strokeWidth={1.5} />
      </div>
      <h3 style={s.title}>{title}</h3>
      <div style={s.priceRow}>
        <span style={{ ...s.price, color: accent }}>{price}</span>
        <span style={s.priceNote}>{priceNote}</span>
      </div>
      <p style={s.desc}>{desc}</p>
      <button
        style={{ ...s.cta, ...(featured ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none' } : {}) }}
        onClick={onClick}
      >
        {ctaLabel} <ArrowRight size={14} />
      </button>
    </div>
  )
}

export default function PackagesSection({ showSeeAll = true }) {
  const { t } = useLang()
  const navigate = useNavigate()

  const goContact = () => navigate('/contact')
  const goPricing = () => navigate('/pricing')

  const cards = [
    { icon: Search, accent: '#c8a76b', tag: t('packages.audit.tag'), title: t('packages.audit.title'), price: t('packages.audit.price'), priceNote: t('packages.audit.priceNote'), desc: t('packages.audit.desc'), ctaLabel: t('packages.audit.cta'), onClick: goContact },
    { icon: Workflow, accent: '#a855f7', tag: t('packages.sprint.tag'), title: t('packages.sprint.title'), price: t('packages.sprint.price'), priceNote: t('packages.sprint.priceNote'), desc: t('packages.sprint.desc'), ctaLabel: t('packages.sprint.cta'), onClick: goContact, featured: true },
    { icon: Layers, accent: '#6366f1', tag: t('packages.system.tag'), title: t('packages.system.title'), price: t('packages.system.price'), priceNote: t('packages.system.priceNote'), desc: t('packages.system.desc'), ctaLabel: t('packages.system.cta'), onClick: goContact },
    { icon: Wrench, accent: '#10b981', tag: t('packages.retainer.tag'), title: t('packages.retainer.title'), price: t('packages.retainer.price'), priceNote: t('packages.retainer.priceNote'), desc: t('packages.retainer.desc'), ctaLabel: t('packages.retainer.cta'), onClick: goContact },
  ]

  return (
    <section id="packages" style={s.section}>
      <div style={s.eyebrow}>{t('packages.eyebrow')}</div>
      <h2 style={s.heading}>{t('packages.heading')}</h2>
      <p style={s.sub}>{t('packages.sub')}</p>
      <div style={s.grid}>
        {cards.map((c, i) => <Card key={c.title} {...c} delay={i * 0.08} />)}
      </div>
      {showSeeAll && (
        <button style={s.seeAll} onClick={goPricing}>
          {t('packages.seeAll')} <ArrowRight size={14} />
        </button>
      )}
    </section>
  )
}

const s = {
  section: { padding: '6rem 2rem', maxWidth: '1180px', margin: '0 auto', textAlign: 'center' },
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
  heading: { fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#666', marginBottom: '3rem', fontSize: '1rem', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.2rem',
    textAlign: 'left',
  },
  card: {
    padding: '1.8rem 1.6rem',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
    position: 'relative',
  },
  cardFeatured: {
    border: '1px solid rgba(168,85,247,0.35)',
    boxShadow: '0 12px 40px rgba(168,85,247,0.08)',
  },
  tag: {
    alignSelf: 'flex-start',
    padding: '0.25rem 0.7rem',
    borderRadius: '999px',
    border: '1px solid',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  iconWrap: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.4rem' },
  title: { fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f3f4f6', letterSpacing: '-0.01em' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '0.5rem' },
  price: { fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' },
  priceNote: { fontSize: '0.78rem', color: '#666' },
  desc: { color: '#888', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 },
  cta: {
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
    transition: 'all 0.2s',
  },
  seeAll: {
    marginTop: '2.5rem',
    padding: '0.8rem 1.6rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: '#c8a76b',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
}
