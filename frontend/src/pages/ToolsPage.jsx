import { useState } from 'react'
import Navbar from '../components/Navbar'
import EmailGate from '../components/EmailGate'
import MortgageCalculator from '../components/tools/MortgageCalculator'
import RecastCalculator from '../components/tools/RecastCalculator'
import FirstHomeChecklist from '../components/tools/FirstHomeChecklist'
import RentVsBuy from '../components/tools/RentVsBuy'
import PreQualQuiz from '../components/tools/PreQualQuiz'

const TOOLS = [
  { id: 'mortgage', label: 'Mortgage Calculator', component: MortgageCalculator },
  { id: 'recast', label: 'Recast Calculator', component: RecastCalculator },
  { id: 'checklist', label: 'First Home Checklist', component: FirstHomeChecklist },
  { id: 'rentvsbuy', label: 'Rent vs Buy', component: RentVsBuy },
  { id: 'quiz', label: 'PQ Assessment', component: PreQualQuiz },
]

export default function ToolsPage() {
  const [active, setActive] = useState('mortgage')

  const ActiveComponent = TOOLS.find((t) => t.id === active).component

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.eyebrow}>Free Tools</span>
          <h1 style={styles.heading}>Real Estate Tools</h1>
          <p style={styles.sub}>Calculators, checklists, and assessments to help you make smarter decisions</p>
        </div>

        <div style={styles.tabs}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{ ...styles.tab, ...(active === t.id ? styles.tabActive : {}) }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <EmailGate source={`tool_${active}`}>
          <ActiveComponent />
        </EmailGate>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — All rights reserved</p>
      </footer>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  eyebrow: {
    display: 'inline-block',
    padding: '0.3rem 0.9rem',
    borderRadius: '999px',
    border: '1px solid rgba(200,167,107,0.4)',
    color: '#c8a76b',
    fontSize: '0.8rem',
    marginBottom: '1rem',
  },
  heading: { fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#888', fontSize: '1rem', margin: 0 },
  tabs: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' },
  tab: {
    padding: '0.5rem 1rem',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: '#888',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    color: '#fff',
    border: '1px solid transparent',
  },
  footer: { textAlign: 'center', padding: '2rem', color: '#555', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
