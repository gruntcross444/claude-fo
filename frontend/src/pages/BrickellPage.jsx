import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Building2, Utensils, Music, ShoppingBag, Train, MapPin, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLang } from '../i18n/LanguageContext'
import useScrollReveal from '../hooks/useScrollReveal'
import api from '../api'

// ── Building data ──────────────────────────────────────────────

// Promotional buildings — easy approval
const PROMO_BUILDINGS = [
  { id: 'flaglerRiver', name: 'Flagler on the River', address: '40 NW South River Dr, Miami, FL 33130', price: '$2,200 - $3,800', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'rooftop', 'petFriendly'], color: '#10b981', promo: true },
  { id: 'downtown5th', name: 'Downtown 5th', address: '500 NE 5th Terrace, Miami, FL 33132', price: '$2,000 - $3,500', image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'coworking'], color: '#10b981', promo: true },
  { id: 'downtown1st', name: 'Downtown 1st', address: '234 NE 1st St, Miami, FL 33132', price: '$1,900 - $3,200', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'petFriendly'], color: '#10b981', promo: true },
]

// Standard buildings
const STANDARD_BUILDINGS = [
  { id: 'brickellHeights', name: 'Brickell Heights', address: '45 SW 9th St, Miami, FL 33130', price: '$2,500 - $5,500', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'rooftop', 'concierge'], color: '#c8a76b' },
  { id: 'riseBrickell', name: 'Rise Brickell', address: '88 SW 7th St, Miami, FL 33130', price: '$2,800 - $6,000', image: 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'spa', 'valet'], color: '#6366f1' },
  { id: 'slsLux', name: 'SLS Lux Brickell', address: '801 S Miami Ave, Miami, FL 33130', price: '$3,200 - $8,000', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop', amenities: ['pool', 'spa', 'concierge', 'valet', 'rooftop'], color: '#a855f7' },
  { id: 'echoBrickell', name: 'Echo Brickell', address: '1451 Brickell Ave, Miami, FL 33131', price: '$3,500 - $9,000', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'concierge', 'marina'], color: '#14b8a6' },
  { id: 'reachBcc', name: 'Reach at Brickell City Centre', address: '68 SE 6th St, Miami, FL 33131', price: '$2,900 - $7,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'coworking', 'valet'], color: '#f59e0b' },
  { id: 'flatiron', name: 'Flatiron Brickell', address: '1000 Brickell Plaza, Miami, FL 33131', price: '$2,600 - $5,800', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'rooftop', 'petFriendly'], color: '#ec4899' },
  { id: 'ninaMiami', name: 'Nina at Miami Worldcenter', address: '1800 NE 1st Ave, Miami, FL 33132', price: '$2,400 - $5,200', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'theater', 'coworking'], color: '#6366f1' },
  { id: 'thePlaza', name: 'The Plaza on Brickell', address: '950 Brickell Bay Dr, Miami, FL 33131', price: '$2,200 - $4,800', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'concierge', 'valet'], color: '#c8a76b' },
  { id: 'miamiRiverWalk', name: 'Miami River Walk', address: '45 SW North River Dr, Miami, FL 33130', price: '$2,300 - $4,500', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'marina', 'petFriendly'], color: '#f59e0b' },
  { id: 'brickellTen', name: 'Brickell Ten', address: '1010 Brickell Ave, Miami, FL 33131', price: '$2,700 - $5,500', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop', amenities: ['pool', 'gym', 'concierge', 'rooftop'], color: '#a855f7' },
]

const HIGHLIGHTS = [
  { key: 'dining', Icon: Utensils, color: '#c8a76b' },
  { key: 'nightlife', Icon: Music, color: '#a855f7' },
  { key: 'shopping', Icon: ShoppingBag, color: '#6366f1' },
  { key: 'transit', Icon: Train, color: '#10b981' },
]

// ── Helpers ────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(25px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  )
}

function BuildingCard({ building, delay, onInquire, onApply, t }) {
  const [ref, visible] = useScrollReveal(0.05)

  return (
    <div
      ref={ref}
      style={{
        ...s.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease ${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${building.color}40`
        e.currentTarget.style.boxShadow = `0 16px 50px ${building.color}10`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={s.cardImageWrap}>
        <img src={building.image} alt={building.name} style={s.cardImage} loading="lazy" />
        <div style={s.cardImageOverlay} />
        <span style={{ ...s.cardPrice, color: building.color }}>{building.price}{t('brickell.perMonth')}</span>
        {building.promo && <span style={s.promoBadge}>{t('brickell.promoDetails.noPaystubs')}</span>}
      </div>
      <div style={s.cardBody}>
        <h3 style={s.cardTitle}>{building.name}</h3>
        <p style={s.cardAddress}><MapPin size={12} /> {building.address}</p>
        <div style={s.amenities}>
          {building.amenities.map((a) => (
            <span key={a} style={s.amenityTag}>{t(`brickell.amenities.${a}`)}</span>
          ))}
        </div>
        <div style={s.cardActions}>
          <button
            style={{ ...s.inquireBtn, background: building.color }}
            onClick={() => onInquire(building.name)}
          >
            {t('brickell.inquire')}
          </button>
          <button
            style={s.applyBtn}
            onClick={() => onApply(building.id, building.name)}
          >
            <FileText size={14} /> {t('application.applyNow')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────

export default function BrickellPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', budget: '', timeline: '', message: '', building: '' })
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    const { name: field, value } = e.target
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleInquire(buildingName) {
    setForm((prev) => ({ ...prev, building: buildingName }))
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleApply(buildingId, buildingName) {
    navigate(`/apply?building=${buildingId}&name=${encodeURIComponent(buildingName)}`)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    const constructedMessage = `[Brickell Inquiry] Budget: ${form.budget}, Timeline: ${form.timeline}, Phone: ${form.phone}, Building: ${form.building || 'General'}, Notes: ${form.message}`
    try {
      await Promise.all([
        api.post('/leads', { email: form.email, source: 'brickell' }),
        api.post('/contact', { name: form.name, email: form.email, message: constructedMessage }),
      ])
      setStatus('success')
      setForm({ name: '', email: '', phone: '', budget: '', timeline: '', message: '', building: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={s.page}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroGlow2} />
        <div style={s.heroContent}>
          <Reveal>
            <p style={s.eyebrow}>{t('brickell.eyebrow')}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={s.heading}>{t('brickell.heading')}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={s.sub}>{t('brickell.sub')}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={s.heroActions}>
              <button style={s.primaryBtn} onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                {t('brickell.cta')} <ArrowRight size={16} />
              </button>
              <a href="https://brickell-rentals.netlify.app" target="_blank" rel="noopener noreferrer" style={s.ghostBtn}>
                {t('brickell.ctaExternal')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Promo Buildings ──────────────────────────────── */}
      <section style={s.section}>
        <Reveal>
          <div style={s.promoBanner}>
            <span style={s.promoIcon}>&#9889;</span>
            <div>
              <h2 style={s.promoHeading}>{t('brickell.promoHeading')}</h2>
              <p style={s.promoSub}>{t('brickell.promoSub')}</p>
            </div>
          </div>
        </Reveal>
        <div style={s.promoDetails}>
          <span style={s.promoTag}>{t('brickell.promoDetails.deposit')}</span>
          <span style={s.promoTag}>{t('brickell.promoDetails.appFee')}</span>
          <span style={s.promoTag}>{t('brickell.promoDetails.noPaystubs')}</span>
          <span style={s.promoTag}>{t('brickell.promoDetails.idOnly')}</span>
        </div>
        <div style={s.grid} data-brickell-grid>
          {PROMO_BUILDINGS.map((b, i) => (
            <BuildingCard key={b.id} building={b} delay={i * 0.1} onInquire={handleInquire} onApply={handleApply} t={t} />
          ))}
        </div>
      </section>

      {/* ── All Buildings ─────────────────────────────────── */}
      <section style={s.section}>
        <Reveal>
          <h2 style={s.sectionHeading}>{t('brickell.propertiesHeading')}</h2>
          <p style={s.sectionSub}>{t('brickell.propertiesSub')}</p>
        </Reveal>
        <div style={s.grid} data-brickell-grid>
          {STANDARD_BUILDINGS.map((b, i) => (
            <BuildingCard key={b.id} building={b} delay={(i % 3) * 0.1} onInquire={handleInquire} onApply={handleApply} t={t} />
          ))}
        </div>
      </section>

      {/* ── Google Maps ───────────────────────────────────── */}
      <section style={s.section}>
        <Reveal>
          <h2 style={s.sectionHeading}>{t('brickell.mapHeading')}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={s.mapWrap}>
            <iframe
              title="Brickell Map"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Brickell,Miami,FL&zoom=14&maptype=roadmap"
              style={s.mapIframe}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>

      {/* ── Neighborhood Highlights ───────────────────────── */}
      <section style={s.section}>
        <Reveal>
          <h2 style={s.sectionHeading}>{t('brickell.highlights.heading')}</h2>
          <p style={s.sectionSub}>{t('brickell.highlights.sub')}</p>
        </Reveal>
        <div style={s.highlightsGrid} data-brickell-highlights>
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.key} delay={i * 0.1}>
              <div style={s.highlightCard}>
                <div style={{ ...s.highlightIcon, background: `${h.color}12`, border: `1px solid ${h.color}25` }}>
                  <h.Icon size={22} color={h.color} strokeWidth={1.5} />
                </div>
                <h3 style={s.highlightTitle}>{t(`brickell.highlights.${h.key}.title`)}</h3>
                <p style={s.highlightDesc}>{t(`brickell.highlights.${h.key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Lead Capture Form ─────────────────────────────── */}
      <section style={s.section} ref={formRef} id="inquiry-form">
        <div style={s.formGlow} />
        <Reveal>
          <div style={s.formContainer}>
            <h2 style={s.formHeading}>{t('brickell.formHeading')}</h2>
            <p style={s.formSub}>{t('brickell.formSub')}</p>

            {status === 'success' && <div style={s.successBanner}>{t('brickell.success')}</div>}
            {status === 'error' && <div style={s.errorBanner}>{t('brickell.error')}</div>}

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formRow} data-brickell-form-row>
                <label style={s.label}>
                  {t('brickell.name')}
                  <input name="name" type="text" value={form.name} onChange={handleChange} required maxLength={100} style={s.input} placeholder={t('brickell.namePlaceholder')} />
                </label>
                <label style={s.label}>
                  {t('brickell.email')}
                  <input name="email" type="email" value={form.email} onChange={handleChange} required style={s.input} placeholder={t('brickell.emailPlaceholder')} />
                </label>
              </div>
              <div style={s.formRow} data-brickell-form-row>
                <label style={s.label}>
                  {t('brickell.phone')}
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} style={s.input} placeholder={t('brickell.phonePlaceholder')} />
                </label>
                <label style={s.label}>
                  {t('brickell.budget')}
                  <select name="budget" value={form.budget} onChange={handleChange} required style={s.select}>
                    <option value="">{t('brickell.budgetOptions.select')}</option>
                    <option value="$2,000-$3,000">{t('brickell.budgetOptions.low')}</option>
                    <option value="$3,000-$5,000">{t('brickell.budgetOptions.mid')}</option>
                    <option value="$5,000-$8,000">{t('brickell.budgetOptions.high')}</option>
                    <option value="$8,000+">{t('brickell.budgetOptions.ultra')}</option>
                  </select>
                </label>
              </div>
              <label style={s.label}>
                {t('brickell.timeline')}
                <select name="timeline" value={form.timeline} onChange={handleChange} required style={s.select}>
                  <option value="">{t('brickell.timelineOptions.select')}</option>
                  <option value="Immediately">{t('brickell.timelineOptions.asap')}</option>
                  <option value="1-2 months">{t('brickell.timelineOptions.soon')}</option>
                  <option value="3-6 months">{t('brickell.timelineOptions.later')}</option>
                  <option value="6+ months">{t('brickell.timelineOptions.flexible')}</option>
                </select>
              </label>
              {form.building && (
                <div style={s.buildingBadge}>
                  <Building2 size={14} /> {t('brickell.inquiringAbout')} <strong>{form.building}</strong>
                </div>
              )}
              <label style={s.label}>
                {t('brickell.message')}
                <textarea name="message" value={form.message} onChange={handleChange} maxLength={2000} style={{ ...s.input, minHeight: '100px', resize: 'vertical' }} placeholder={t('brickell.messagePlaceholder')} />
              </label>
              <button type="submit" disabled={status === 'submitting'} style={s.submitBtn}>
                {status === 'submitting' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {t('brickell.submitting')}</> : <>{t('brickell.submit')} <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </Reveal>
      </section>

      {/* ── External CTA ──────────────────────────────────── */}
      <section style={s.ctaSection}>
        <div style={s.ctaGlow} />
        <Reveal>
          <h2 style={s.ctaHeading}>{t('brickell.externalHeading')}</h2>
          <p style={s.ctaSub}>{t('brickell.externalSub')}</p>
          <a href="https://brickell-rentals.netlify.app" target="_blank" rel="noopener noreferrer" style={s.ctaBtn}>
            {t('brickell.externalBtn')} <ArrowRight size={16} />
          </a>
        </Reveal>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={s.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────

const s = {
  page: { minHeight: '100vh' },

  // Hero
  hero: { position: 'relative', overflow: 'hidden', padding: 'clamp(4rem, 10vh, 7rem) 2rem clamp(3rem, 8vh, 5rem)', textAlign: 'center' },
  heroGlow: { position: 'absolute', top: '-10%', left: '20%', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' },
  heroGlow2: { position: 'absolute', bottom: '-10%', right: '15%', width: '400px', height: '350px', background: 'radial-gradient(ellipse, rgba(200,167,107,0.1) 0%, transparent 70%)', pointerEvents: 'none', animation: 'float 10s ease-in-out infinite reverse' },
  heroContent: { maxWidth: '700px', margin: '0 auto', position: 'relative' },
  eyebrow: { display: 'inline-block', padding: '0.4rem 1.2rem', borderRadius: '999px', border: '1px solid rgba(200,167,107,0.3)', background: 'rgba(200,167,107,0.05)', color: '#c8a76b', fontSize: '0.82rem', marginBottom: '1.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 },
  heading: { fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em' },
  sub: { color: '#888', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '560px', margin: '0 auto 2rem' },
  heroActions: { display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.2rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(200,167,107,0.3)' },
  ghostBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#aaa', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s ease', textDecoration: 'none' },

  // Sections
  section: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', position: 'relative' },
  sectionHeading: { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', textAlign: 'center' },
  sectionSub: { color: '#888', fontSize: '1rem', textAlign: 'center', marginBottom: '2.5rem' },

  // Promo section
  promoBanner: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 2rem', borderRadius: '18px', border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)', backdropFilter: 'blur(4px)', marginBottom: '1.5rem' },
  promoIcon: { fontSize: '2rem', flexShrink: 0 },
  promoHeading: { fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.2rem', color: '#6ee7b7' },
  promoSub: { fontSize: '0.88rem', color: '#888', margin: 0, lineHeight: 1.5 },
  promoDetails: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' },
  promoTag: { fontSize: '0.78rem', padding: '0.3rem 0.8rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.08)', color: '#6ee7b7', fontWeight: 600 },

  // Property grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' },
  card: { borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)', overflow: 'hidden', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
  cardImageWrap: { position: 'relative', height: '200px', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardImageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,11,15,0.7) 0%, transparent 50%)' },
  cardPrice: { position: 'absolute', bottom: '12px', left: '16px', fontSize: '1.1rem', fontWeight: 800 },
  promoBadge: { position: 'absolute', top: '12px', right: '12px', fontSize: '0.68rem', padding: '0.25rem 0.6rem', borderRadius: '999px', background: 'rgba(16,185,129,0.9)', color: '#fff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  cardBody: { padding: '1.3rem 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.3rem' },
  cardAddress: { fontSize: '0.78rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' },
  amenityTag: { fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(200,167,107,0.2)', background: 'rgba(200,167,107,0.05)', color: '#c8a76b' },
  cardActions: { marginTop: 'auto', display: 'flex', gap: '0.5rem' },
  inquireBtn: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.6rem', borderRadius: '10px', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  applyBtn: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(200,167,107,0.3)', background: 'rgba(200,167,107,0.08)', color: '#c8a76b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.3s ease' },

  // Map
  mapWrap: { borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' },
  mapIframe: { width: '100%', height: '400px', border: 'none', display: 'block' },

  // Highlights
  highlightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '1rem' },
  highlightCard: { padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)' },
  highlightIcon: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  highlightTitle: { fontSize: '1rem', fontWeight: 700, margin: '0 0 0.4rem' },
  highlightDesc: { color: '#888', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 },

  // Form
  formGlow: { position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(200,167,107,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  formContainer: { maxWidth: '700px', margin: '0 auto', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(200,167,107,0.15)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', position: 'relative' },
  formHeading: { fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', fontWeight: 800, marginBottom: '0.4rem', textAlign: 'center', letterSpacing: '-0.02em' },
  formSub: { color: '#888', fontSize: '0.95rem', textAlign: 'center', marginBottom: '2rem' },
  successBanner: { padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' },
  errorBanner: { padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: '#ccc' },
  input: { padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  select: { padding: '0.75rem 1rem', paddingRight: '2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: "rgba(255,255,255,0.04) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\") no-repeat right 0.75rem center / 1em 1em", color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' },
  buildingBadge: { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(200,167,107,0.08)', border: '1px solid rgba(200,167,107,0.2)', color: '#c8a76b', fontSize: '0.85rem' },
  submitBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(200,167,107,0.3)', transition: 'all 0.3s ease', marginTop: '0.5rem' },

  // External CTA
  ctaSection: { textAlign: 'center', padding: '5rem 2rem', position: 'relative' },
  ctaGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(200,167,107,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  ctaHeading: { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '0.5rem', position: 'relative', letterSpacing: '-0.02em' },
  ctaSub: { color: '#888', fontSize: '1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem', position: 'relative' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.3)', transition: 'all 0.3s ease', textDecoration: 'none', position: 'relative' },

  // Footer
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}

// ── Responsive CSS ─────────────────────────────────────────────

if (typeof document !== 'undefined') {
  const id = 'brickell-responsive'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @media (max-width: 768px) {
        [data-brickell-grid] { grid-template-columns: 1fr !important; }
        [data-brickell-highlights] { grid-template-columns: 1fr 1fr !important; }
        [data-brickell-form-row] { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 480px) {
        [data-brickell-highlights] { grid-template-columns: 1fr !important; }
      }
    `
    document.head.appendChild(style)
  }
}
