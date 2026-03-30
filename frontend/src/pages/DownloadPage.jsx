import { useSearchParams } from 'react-router-dom'
import { Download, CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

const PRODUCT_FILES = {
  'prompts-real-estate': { name: 'Real Estate Prompt Pack', file: '/downloads/Real-Estate-Prompt-Pack-ClaudeFO.pdf' },
  'prompts-marketing': { name: 'Marketing & Sales Prompts', file: null },
  'prompts-business': { name: 'Business & Productivity Pack', file: null },
  'prompts-content': { name: 'Content Creator Toolkit', file: null },
  'finance-tracker': { name: 'Monthly Finance Tracker', file: null },
  'website-templates': { name: 'Website Templates Pack', file: null },
  'real-estate-template': { name: 'Real Estate Landing Template', file: null },
  'social-media-kit': { name: 'Social Media Kit', file: null },
  'content-calendar': { name: 'Content Calendar Planner', file: null },
  'lead-funnel-template': { name: 'Lead Funnel Blueprint', file: null },
  'email-sms-playbook': { name: 'Email & SMS Playbook', file: null },
  'automation-starter-kit': { name: 'Automation Starter Kit', file: null },
}

export default function DownloadPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('product')
  const product = PRODUCT_FILES[productId]

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.iconWrap}>
          <CheckCircle size={48} color="#10b981" strokeWidth={1.5} />
        </div>
        <h1 style={s.heading}>Payment Successful!</h1>
        <p style={s.sub}>Thank you for your purchase.</p>

        {product ? (
          <div style={s.card}>
            <h2 style={s.productName}>{product.name}</h2>
            {product.file ? (
              <a href={product.file} download style={s.downloadBtn}>
                <Download size={18} /> Download Your Product
              </a>
            ) : (
              <div style={s.pendingMsg}>
                <p>Your product is being prepared and will be sent to your email shortly.</p>
                <p style={s.small}>If you don't receive it within 24 hours, contact us.</p>
              </div>
            )}
          </div>
        ) : (
          <div style={s.card}>
            <p>Your download will be sent to your email shortly.</p>
          </div>
        )}

        <a href="/store" style={s.backLink}>
          Browse more products <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '500px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' },
  iconWrap: { marginBottom: '1.5rem' },
  heading: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', marginBottom: '2rem' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' },
  productName: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' },
  downloadBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s' },
  pendingMsg: { color: '#888', lineHeight: 1.6 },
  small: { fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', textDecoration: 'none', fontSize: '0.95rem' },
}
