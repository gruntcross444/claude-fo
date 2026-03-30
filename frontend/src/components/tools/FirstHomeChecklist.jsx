import { useState } from 'react'

const ITEMS = [
  { id: 1, text: 'Check your credit score (aim for 620+, ideally 740+)', tip: 'Free at annualcreditreport.com' },
  { id: 2, text: 'Save for a down payment (3–20% of home price)', tip: 'FHA loans require as little as 3.5%' },
  { id: 3, text: 'Get pre-approved for a mortgage', tip: 'Shows sellers you are a serious buyer' },
  { id: 4, text: 'Calculate your debt-to-income ratio (below 43%)', tip: 'Monthly debts / gross monthly income' },
  { id: 5, text: 'Budget for closing costs (2–5% of loan amount)', tip: 'Includes appraisal, title, and lender fees' },
  { id: 6, text: 'Build an emergency fund (3–6 months of expenses)', tip: 'Separate from your down payment savings' },
  { id: 7, text: 'Research first-time buyer programs in your state', tip: 'Many offer down payment assistance or lower rates' },
  { id: 8, text: 'Gather documents (W-2s, tax returns, bank statements)', tip: 'Lenders typically need the last 2 years' },
  { id: 9, text: 'Hire a real estate agent', tip: 'Buyer agents are usually free — the seller pays' },
  { id: 10, text: 'Get a home inspection before closing', tip: 'Can save you from costly surprises' },
]

export default function FirstHomeChecklist() {
  const [checked, setChecked] = useState({})

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round((done / ITEMS.length) * 100)

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>First Home Checklist</h3>
      <p style={styles.desc}>10 steps to buying your first home</p>

      <div style={styles.progressWrap}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${pct}%` }} />
        </div>
        <span style={styles.progressText}>{done}/{ITEMS.length} complete</span>
      </div>

      <div style={styles.list}>
        {ITEMS.map((item) => (
          <div
            key={item.id}
            role="checkbox"
            aria-checked={!!checked[item.id]}
            tabIndex={0}
            style={{ ...styles.item, opacity: checked[item.id] ? 0.6 : 1 }}
            onClick={() => toggle(item.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(item.id) } }}
          >
            <span style={{ ...styles.checkbox, ...(checked[item.id] ? styles.checked : {}) }}>
              {checked[item.id] ? '✓' : ''}
            </span>
            <div>
              <span style={{ textDecoration: checked[item.id] ? 'line-through' : 'none' }}>{item.text}</span>
              <span style={styles.tip}>{item.tip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  progressBar: { flex: 1, height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.3s' },
  progressText: { fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item: { display: 'flex', gap: '0.8rem', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', alignItems: 'flex-start', transition: 'opacity 0.2s', fontSize: '0.9rem' },
  checkbox: { width: '22px', height: '22px', borderRadius: '6px', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', marginTop: '1px' },
  checked: { background: '#6366f1', borderColor: '#6366f1', color: '#fff' },
  tip: { display: 'block', fontSize: '0.78rem', color: '#666', marginTop: '0.2rem' },
}
