import { useState } from 'react'
import { Calculator, BarChart3, ClipboardCheck, Scale, FileText, ChevronRight, Wrench } from 'lucide-react'
import Navbar from '../components/Navbar'
import EmailGate from '../components/EmailGate'
import MortgageCalculator from '../components/tools/MortgageCalculator'
import RecastCalculator from '../components/tools/RecastCalculator'
import FirstHomeChecklist from '../components/tools/FirstHomeChecklist'
import RentVsBuy from '../components/tools/RentVsBuy'
import PreQualQuiz from '../components/tools/PreQualQuiz'
import { useLang } from '../i18n/LanguageContext'

const TOOLS = [
  { id: 'mortgage', label: 'Mortgage Calculator', desc: 'Estimate your monthly payment', Icon: Calculator, component: MortgageCalculator, color: '#6366f1' },
  { id: 'recast', label: 'Recast Calculator', desc: 'Payment after lump-sum reduction', Icon: BarChart3, component: RecastCalculator, color: '#10b981' },
  { id: 'checklist', label: 'First Home Checklist', desc: '10 steps to buying your first home', Icon: ClipboardCheck, component: FirstHomeChecklist, color: '#f59e0b' },
  { id: 'rentvsbuy', label: 'Rent vs Buy', desc: 'Compare costs over time', Icon: Scale, component: RentVsBuy, color: '#a855f7' },
  { id: 'quiz', label: 'PQ Assessment', desc: 'Are you ready to buy?', Icon: FileText, component: PreQualQuiz, color: '#ec4899' },
]

export default function ToolsPage() {
  const { t } = useLang()
  const [active, setActive] = useState('mortgage')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeTool = TOOLS.find((tool) => tool.id === active)
  const ActiveComponent = activeTool.component

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.layout} data-tools-layout>

        {/* ── Mobile toggle ─────────────────────────── */}
        <button style={s.mobileToggle} data-tools-toggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Wrench size={16} /> {t('toolsExtra.menu')} <ChevronRight size={14} style={{ transform: sidebarOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {/* ── Left Sidebar ──────────────────────────── */}
        <aside style={{ ...s.sidebar, ...(sidebarOpen ? s.sidebarOpen : {}) }} data-tools-sidebar className={sidebarOpen ? 'open' : ''}>
          <div style={s.sidebarHeader}>
            <Wrench size={18} color="#c8a76b" />
            <span style={s.sidebarTitle}>{t('tools.eyebrow')}</span>
          </div>
          <div style={s.toolList}>
            {TOOLS.map((tool) => {
              const isActive = active === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => { setActive(tool.id); setSidebarOpen(false) }}
                  style={{ ...s.toolBtn, ...(isActive ? { ...s.toolBtnActive, borderLeftColor: tool.color, background: `${tool.color}10` } : {}) }}
                >
                  <div style={{ ...s.toolIcon, background: isActive ? `${tool.color}20` : 'rgba(255,255,255,0.04)', borderColor: isActive ? `${tool.color}40` : 'rgba(255,255,255,0.08)' }}>
                    <tool.Icon size={18} color={isActive ? tool.color : '#666'} strokeWidth={1.5} />
                  </div>
                  <div style={s.toolInfo}>
                    <span style={{ ...s.toolLabel, color: isActive ? '#fff' : '#aaa' }}>{tool.label}</span>
                    <span style={s.toolDesc}>{tool.desc}</span>
                  </div>
                  {isActive && <ChevronRight size={14} color={tool.color} />}
                </button>
              )
            })}
          </div>
          <div style={s.sidebarFooter}>
            <p style={s.sidebarNote}>{t('toolsExtra.freeNote').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
          </div>
        </aside>

        {/* ── Right Content Area ────────────────────── */}
        <main style={s.main}>
          <div style={s.toolHeader}>
            <div style={{ ...s.activeIcon, background: `${activeTool.color}15`, border: `1px solid ${activeTool.color}30` }}>
              <activeTool.Icon size={24} color={activeTool.color} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={s.heading}>{activeTool.label}</h1>
              <p style={s.sub}>{activeTool.desc}</p>
            </div>
          </div>

          <EmailGate source={`tool_${active}`}>
            <ActiveComponent />
          </EmailGate>
        </main>
      </div>

      <footer style={s.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  layout: { display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', gap: '1.5rem', position: 'relative' },

  // Mobile toggle
  mobileToggle: { display: 'none', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', margin: '1rem 0', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#aaa', fontSize: '0.9rem', cursor: 'pointer', width: '100%' },

  // Sidebar
  sidebar: { width: '280px', flexShrink: 0, padding: '2rem 0', position: 'sticky', top: '70px', height: 'fit-content', maxHeight: 'calc(100vh - 90px)', overflowY: 'auto' },
  sidebarOpen: {},
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 0.5rem', marginBottom: '1.5rem' },
  sidebarTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#c8a76b', textTransform: 'uppercase', letterSpacing: '0.08em' },
  toolList: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  toolBtn: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', borderRadius: '12px', border: 'none', borderLeft: '3px solid transparent', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' },
  toolBtnActive: { borderLeft: '3px solid' },
  toolIcon: { width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid', transition: 'all 0.2s' },
  toolInfo: { flex: 1, minWidth: 0 },
  toolLabel: { display: 'block', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' },
  toolDesc: { display: 'block', fontSize: '0.75rem', color: '#555', marginTop: '0.15rem' },
  sidebarFooter: { marginTop: '2rem', padding: '1rem', borderRadius: '10px', background: 'rgba(200,167,107,0.05)', border: '1px solid rgba(200,167,107,0.15)' },
  sidebarNote: { fontSize: '0.78rem', color: '#888', lineHeight: 1.5, margin: 0, textAlign: 'center' },

  // Main content
  main: { flex: 1, padding: '2rem 0', minWidth: 0 },
  toolHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  activeIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  heading: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '0.9rem', margin: 0 },

  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}

