import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Building2, Code2, Bot, Smartphone, Palette, Calculator, FileText, BarChart3, Home, Scale, ClipboardCheck, Wrench, Check, ArrowRight, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

const STORE_CATEGORIES = ['All', 'Real Estate', 'Web Development', 'AI & Automation', 'Mobile Apps', 'Logo & Branding']

const CATEGORY_ICONS = {
  'Real Estate': Building2,
  'Web Development': Code2,
  'AI & Automation': Bot,
  'Mobile Apps': Smartphone,
  'Logo & Branding': Palette,
}

const paidProducts = [
  { id: 'real-estate-template', title: 'Real Estate Landing Template', subtitle: 'Rental Community Page', description: 'High-converting landing page template designed for rental communities. Pricing tiers, amenity sections, WhatsApp integration, and bilingual support.', price: 24, originalPrice: 39, category: 'Real Estate', color: '#c8a76b', features: ['Luxury design', 'Pricing section', 'WhatsApp CTA', 'Bilingual ready', 'Mobile-first', 'Netlify deploy'], badge: 'New' },
  { id: 'finance-tracker', title: 'Monthly Finance Tracker', subtitle: 'Personal & Business Budgeting', description: 'Track income, expenses, savings goals, and investments with automated dashboards. Includes 12-month overview, category breakdowns, and visual charts.', price: 19, originalPrice: 29, category: 'Web Development', color: '#10b981', features: ['Google Sheets + Excel', 'Auto-calculated dashboards', '12-month annual view', 'Expense categories', 'Savings goal tracker', 'Dark & light themes'], badge: 'Best Seller' },
  { id: 'website-templates', title: 'Website Templates Pack', subtitle: 'React + Vite Ready-to-Deploy', description: 'Collection of 5 professionally designed landing pages and portfolio templates. Clean code, responsive, fast — just add your content and deploy.', price: 39, originalPrice: 69, category: 'Web Development', color: '#6366f1', features: ['5 unique designs', 'React + Vite', 'Fully responsive', 'Dark & light mode', 'SEO optimized', 'Deploy in minutes'], badge: null },
  { id: 'prompts-real-estate', title: 'Real Estate Prompt Pack', subtitle: '50+ Ready-to-Use Prompts', description: 'Property listings, tenant emails, market analysis, investor reports, social posts for agents — just fill in your details and go.', price: 14, originalPrice: 29, category: 'AI & Automation', color: '#f59e0b', features: ['50+ prompts', 'Listing descriptions', 'Tenant comms', 'Market reports', 'Social captions', 'Fill-in-the-blank'], badge: 'Best Seller' },
  { id: 'prompts-marketing', title: 'Marketing & Sales Prompts', subtitle: '75+ Plug-and-Play Prompts', description: 'Ad copy, email sequences, cold outreach, social media campaigns, and sales scripts — for any industry.', price: 19, originalPrice: 39, category: 'AI & Automation', color: '#f43f5e', features: ['75+ prompts', 'Ad copy generators', 'Email sequences', 'Cold DM scripts', 'Launch campaigns', 'A/B test variants'], badge: 'Popular' },
  { id: 'prompts-business', title: 'Business & Productivity Pack', subtitle: '60+ Professional Prompts', description: 'SOPs, meeting agendas, project proposals, financial summaries, hiring templates, and workflow automations.', price: 14, originalPrice: 29, category: 'AI & Automation', color: '#10b981', features: ['60+ prompts', 'SOP generators', 'Proposal templates', 'Report writers', 'Hiring scripts', 'Process automations'], badge: null },
  { id: 'prompts-content', title: 'Content Creator Toolkit', subtitle: '80+ Creative Prompts', description: 'Blog posts, YouTube scripts, newsletter intros, SEO articles, podcast outlines, and social media carousels.', price: 19, originalPrice: 34, category: 'AI & Automation', color: '#8b5cf6', features: ['80+ prompts', 'Blog post outlines', 'Video scripts', 'Newsletter hooks', 'SEO frameworks', 'Carousel templates'], badge: 'New' },
  { id: 'lead-funnel-template', title: 'Lead Funnel Blueprint', subtitle: 'Complete Funnel Setup Guide', description: 'Step-by-step guide to building a high-converting lead funnel — landing page, lead magnet, email sequence, and CRM setup.', price: 34, originalPrice: 59, category: 'AI & Automation', color: '#8b5cf6', features: ['Funnel architecture', 'Email sequence templates', 'Lead magnet ideas', 'CRM setup guide', 'A/B testing tips', 'Conversion tracking'], badge: null },
  { id: 'email-sms-playbook', title: 'Email & SMS Playbook', subtitle: 'Campaign Templates + Strategy', description: 'Ready-to-use email blast and SMS campaign templates with audience segmentation strategies and AI prompt templates for copy generation.', price: 24, originalPrice: 44, category: 'AI & Automation', color: '#6366f1', features: ['20+ email templates', '10+ SMS templates', 'AI copy prompts', 'Segmentation guide', 'Scheduling strategy', 'Compliance checklist'], badge: 'Popular' },
  { id: 'automation-starter-kit', title: 'Automation Starter Kit', subtitle: 'Make.com + Zapier Workflows', description: 'Pre-built workflow automations for lead capture, follow-ups, social posting, and CRM updates. Just import and customize.', price: 19, originalPrice: 39, category: 'AI & Automation', color: '#14b8a6', features: ['15+ workflows', 'Make.com blueprints', 'Zapier templates', 'Lead nurture flows', 'Social auto-post', 'Setup video guide'], badge: null },
  { id: 'social-media-kit', title: 'Social Media Kit', subtitle: '50+ Editable Templates', description: 'Professional templates for Instagram posts, stories, reels covers, carousels, and LinkedIn banners.', price: 29, originalPrice: 49, category: 'Logo & Branding', color: '#f43f5e', features: ['50+ templates', 'Instagram, TikTok, LinkedIn', 'Canva & Figma formats', 'Stories, posts, carousels', 'Brand color customization', 'Commercial license'], badge: 'Popular' },
  { id: 'content-calendar', title: 'Content Calendar Planner', subtitle: '90-Day Social Strategy', description: 'Plan, schedule, and track your social media content across all platforms.', price: 14, originalPrice: 24, category: 'Logo & Branding', color: '#8b5cf6', features: ['90-day planner', 'Multi-platform', 'Content pillars', 'Post ideas bank', 'Analytics tracker', 'Notion + Sheets'], badge: null },
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
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(null)
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const filteredPaid = active === 'All' ? paidProducts : paidProducts.filter((p) => p.category === active)
  const showFreeTools = active === 'All' || active === 'Real Estate'

  async function handleBuy(productId) {
    if (!isAuthenticated) { navigate('/register'); return }
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
          <div style={s.eyebrow}><Sparkles size={14} /> {t('store.eyebrow')}</div>
          <h1 style={s.heading}>{t('store.heading')}</h1>
          <p style={s.sub}>{t('store.sub')}</p>
        </div>

        {success && <div style={s.successBanner}>{t('store.successBanner')}</div>}
        {canceled && <div style={s.cancelBanner}>{t('store.cancelBanner')}</div>}

        {/* ── Category Tabs ───────────────────────────── */}
        <div style={s.tabs}>
          {STORE_CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat]
            return (
              <button key={cat} onClick={() => setActive(cat)} style={{ ...s.tab, ...(active === cat ? s.tabActive : {}) }}>
                {CatIcon && <CatIcon size={14} />} {cat}
              </button>
            )
          })}
        </div>

        {/* ── Paid Products ──────────────────────────── */}
        {filteredPaid.length > 0 && (
          <>
            <h2 style={s.sectionTitle}>{t('store.premiumProducts')}</h2>
            <div style={s.paidGrid}>
              {filteredPaid.map((p) => {
                const CatIcon = CATEGORY_ICONS[p.category] || Code2
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
                        {loading === p.id ? t('store.redirecting') : t('store.buyNow')}
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

      <footer style={s.footer}><p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p></footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', fontSize: '0.8rem', marginBottom: '1rem' },
  heading: { fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '1rem', margin: 0 },
  successBanner: { padding: '1rem', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' },
  cancelBanner: { padding: '1rem', borderRadius: '12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' },
  tabs: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.5rem' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#888', fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid transparent' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', margin: '0 0 1.2rem' },
  paidGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem', marginBottom: '3rem' },
  paidCard: { borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
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
  price: { fontSize: '1.5rem', fontWeight: 800 },
  originalPrice: { fontSize: '0.9rem', color: '#555', textDecoration: 'line-through' },
  discount: { fontSize: '0.72rem', color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px' },
  buyBtn: { width: '100%', padding: '0.7rem', borderRadius: '10px', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  freeHeader: { display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2.5rem' },
  freeBadge: { fontSize: '0.7rem', padding: '0.2rem 0.7rem', borderRadius: '999px', background: 'rgba(200,167,107,0.15)', color: '#c8a76b', fontWeight: 600, textTransform: 'uppercase' },
  freeGrid: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '3rem' },
  freeCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' },
  freeIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  freeText: { flex: 1 },
  freeTitle: { display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' },
  freeDesc: { fontSize: '0.82rem', color: '#666' },
  cta: { textAlign: 'center', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
  ctaHeading: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' },
  ctaSub: { color: '#777', marginBottom: '2rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
