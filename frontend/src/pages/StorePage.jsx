import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Bot, Calculator, BarChart3, Scale, ClipboardCheck, FileText, Check, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

const paidProducts = [
  { id: 'prompts-real-estate', title: 'Real Estate Prompt Pack', subtitle: '50+ Ready-to-Use Prompts', description: 'Property listings, tenant emails, market analysis, investor reports, social posts for agents — just fill in your details and go.', price: 14, originalPrice: 29, category: 'AI & Automation', color: '#c8a76b', features: ['50+ prompts', 'Listing descriptions', 'Tenant comms', 'Market reports', 'Social captions', 'Fill-in-the-blank'], badge: 'Best Seller' },
  { id: 'prompts-marketing', title: 'Marketing & Sales Prompts', subtitle: '75+ Plug-and-Play Prompts', description: 'Ad copy, email sequences, cold outreach, social media campaigns, and sales scripts — for any industry.', price: 19, originalPrice: 39, category: 'AI & Automation', color: '#f43f5e', features: ['75+ prompts', 'Ad copy generators', 'Email sequences', 'Cold DM scripts', 'Launch campaigns', 'A/B test variants'], badge: 'Popular' },
  { id: 'prompts-business', title: 'Business & Productivity Pack', subtitle: '60+ Professional Prompts', description: 'SOPs, meeting agendas, project proposals, financial summaries, hiring templates, and workflow automations.', price: 14, originalPrice: 29, category: 'AI & Automation', color: '#6366f1', features: ['60+ prompts', 'SOP generators', 'Proposal templates', 'Report writers', 'Hiring scripts', 'Process automations'], badge: null },
  { id: 'prompts-content', title: 'Content Creator Toolkit', subtitle: '80+ Creative Prompts', description: 'Blog posts, YouTube scripts, newsletter intros, SEO articles, podcast outlines, and social media carousels.', price: 19, originalPrice: 34, category: 'AI & Automation', color: '#a855f7', features: ['80+ prompts', 'Blog post outlines', 'Video scripts', 'Newsletter hooks', 'SEO frameworks', 'Carousel templates'], badge: 'New' },
]

const freeTools = [
  { id: 'mortgage-calc', title: 'Mortgage Calculator', description: 'Calculate your monthly mortgage payment instantly.', Icon: Calculator, toolLink: '/tools' },
  { id: 'recast-calc', title: 'Recast Calculator', description: 'See your new payment after a lump-sum principal reduction.', Icon: BarChart3, toolLink: '/tools' },
  { id: 'first-home', title: 'First Home Checklist', description: '10 steps to buying your first home.', Icon: ClipboardCheck, toolLink: '/tools' },
  { id: 'rent-vs-buy', title: 'Rent vs Buy Comparison', description: 'Compare renting vs buying costs over time.', Icon: Scale, toolLink: '/tools' },
  { id: 'pq-quiz', title: 'Pre-Qualification Assessment', description: 'Find out if you are ready to buy a home.', Icon: FileText, toolLink: '/tools' },
]

export default function StorePage() {
  const { t } = useLang()
  const [loading, setLoading] = useState(null)
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const filteredPaid = paidProducts
  const showFreeTools = true

  async function handleBuy(productId) {
    setLoading(productId)
    try {
      const res = await api.post('/checkout', { product_id: productId })
      window.location.href = res.data.url
    } catch {
      alert('Checkout failed. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>

        {/* ── Header ──────────────────────────────────── */}
        <div style={s.header}>
          <div style={s.headerGlow} />
          <div style={s.eyebrow}><Sparkles size={14} /> {t('store.eyebrow')}</div>
          <h1 style={s.heading}>{t('store.heading')}</h1>
          <p style={s.sub}>{t('store.sub')}</p>
        </div>

        {success && <div style={s.successBanner}>{t('store.successBanner')}</div>}
        {canceled && <div style={s.cancelBanner}>{t('store.cancelBanner')}</div>}

        {/* ── Paid Products ──────────────────────────── */}
        {filteredPaid.length > 0 && (
          <>
            <h2 style={s.sectionTitle}>{t('store.premiumProducts')}</h2>
            <div style={s.paidGrid}>
              {filteredPaid.map((p) => {
                const CatIcon = Bot
                return (
                  <div
                    key={p.id}
                    style={s.paidCard}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${p.color}40`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${p.color}12` }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={s.paidCardTop}>
                      <div style={{ ...s.paidIcon, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                        <CatIcon size={22} color={p.color} strokeWidth={1.5} />
                      </div>
                      {p.badge && <span style={{ ...s.badge, background: p.color }}>{p.badge}</span>}
                    </div>
                    <span style={s.paidCategory}>{p.category}</span>
                    <h3 style={s.paidTitle}>{p.title}</h3>
                    <p style={s.paidSubtitle}>{p.subtitle}</p>
                    <p style={s.paidDesc}>{p.description}</p>
                    <ul style={s.features}>
                      {p.features.map((f) => (
                        <li key={f} style={s.feature}><Check size={13} color="#10b981" strokeWidth={2.5} /> {f}</li>
                      ))}
                    </ul>
                    <div style={s.paidBottom}>
                      <div style={s.priceRow}>
                        <span style={s.price}>${p.price}</span>
                        <span style={s.originalPrice}>${p.originalPrice}</span>
                        <span style={s.discount}>{Math.round((1 - p.price / p.originalPrice) * 100)}% {t('store.off')}</span>
                      </div>
                      <button
                        onClick={() => handleBuy(p.id)}
                        disabled={loading === p.id}
                        style={{ ...s.buyBtn, background: p.color, opacity: loading === p.id ? 0.6 : 1 }}
                        onMouseEnter={(e) => { e.target.style.boxShadow = `0 6px 20px ${p.color}40` }}
                        onMouseLeave={(e) => { e.target.style.boxShadow = 'none' }}
                      >
                        {loading === p.id ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {t('store.redirecting')}</> : t('store.buyNow')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ── Free Tools ─────────────────────────────── */}
        {showFreeTools && (
          <>
            <div style={s.freeHeader}>
              <h2 style={s.sectionTitle}>{t('store.freeTools')}</h2>
              <span style={s.freeBadge}>{t('store.free')}</span>
            </div>
            <div style={s.freeGrid}>
              {freeTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.toolLink}
                  style={s.freeCard}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,167,107,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <div style={s.freeIcon}>
                    <tool.Icon size={20} color="#c8a76b" strokeWidth={1.5} />
                  </div>
                  <div style={s.freeText}>
                    <strong style={s.freeTitle}>{tool.title}</strong>
                    <span style={s.freeDesc}>{tool.description}</span>
                  </div>
                  <ArrowRight size={16} color="#666" />
                </a>
              ))}
            </div>
          </>
        )}

        {/* ── Bottom CTA ─────────────────────────────── */}
        <div style={s.cta}>
          <h2 style={s.ctaHeading}>{t('store.customCta')}</h2>
          <p style={s.ctaSub}>{t('store.customSub')}</p>
          <button
            style={s.ctaBtn}
            onClick={() => navigate(isAuthenticated ? '/contact' : '/register')}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 8px 30px rgba(200,167,107,0.3)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none' }}
          >
            {t('store.customBtn')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)' },
  header: { textAlign: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' },
  headerGlow: { position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(200,167,107,0.3)', background: 'rgba(200,167,107,0.08)', color: '#c8a76b', fontSize: '0.82rem', marginBottom: '1rem' },
  heading: { fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '1rem', margin: 0 },
  successBanner: { padding: '1rem', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' },
  cancelBanner: { padding: '1rem', borderRadius: '12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' },
  tabs: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.5rem' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#888', fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: '1px solid transparent' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', margin: '0 0 1.2rem' },
  paidGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  paidCard: { borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: '1.8rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden' },
  paidCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  paidIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { padding: '0.2rem 0.7rem', borderRadius: '999px', color: '#fff', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  paidCategory: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '0.3rem', display: 'block' },
  paidTitle: { fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.2rem' },
  paidSubtitle: { fontSize: '0.85rem', color: '#888', margin: '0 0 0.8rem' },
  paidDesc: { color: '#666', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' },
  features: { listStyle: 'none', padding: 0, margin: '0 0 1.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' },
  feature: { fontSize: '0.78rem', color: '#999', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  paidBottom: { marginTop: 'auto' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.8rem' },
  price: { fontSize: '1.8rem', fontWeight: 800, color: '#f3f4f6' },
  originalPrice: { fontSize: '0.9rem', color: '#555', textDecoration: 'line-through' },
  discount: { fontSize: '0.72rem', color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px' },
  buyBtn: { width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' },
  freeHeader: { display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2.5rem' },
  freeBadge: { fontSize: '0.7rem', padding: '0.2rem 0.7rem', borderRadius: '999px', background: 'rgba(200,167,107,0.15)', color: '#c8a76b', fontWeight: 600, textTransform: 'uppercase' },
  freeGrid: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '3rem' },
  freeCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' },
  freeIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  freeText: { flex: 1 },
  freeTitle: { display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' },
  freeDesc: { fontSize: '0.82rem', color: '#666' },
  cta: { textAlign: 'center', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
  ctaHeading: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' },
  ctaSub: { color: '#777', marginBottom: '2rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(200,167,107,0.3)' },
}
