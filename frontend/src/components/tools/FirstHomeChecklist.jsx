import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'

export default function FirstHomeChecklist() {
  const { t } = useLang()
  const items = t('firstHome.items')
  const [checked, setChecked] = useState({})

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round((done / items.length) * 100)

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{t('firstHome.title')}</h3>
      <p style={styles.desc}>{t('firstHome.desc')}</p>

      <div style={styles.progressWrap}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${pct}%` }} />
        </div>
        <span style={styles.progressText}>{done}/{items.length} {t('firstHome.complete')}</span>
      </div>

      <div style={styles.list}>
        {items.map((item, i) => (
          <div
            key={i}
            role="checkbox"
            aria-checked={!!checked[i]}
            tabIndex={0}
            style={{ ...styles.item, opacity: checked[i] ? 0.6 : 1 }}
            onClick={() => toggle(i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i) } }}
          >
            <span style={{ ...styles.checkbox, ...(checked[i] ? styles.checked : {}) }}>
              {checked[i] ? '✓' : ''}
            </span>
            <div>
              <span style={{ textDecoration: checked[i] ? 'line-through' : 'none' }}>{item.text}</span>
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
