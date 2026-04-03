import { useState } from 'react'

export default function RecastCalculator() {
  const [balance, setBalance] = useState(280000)
  const [rate, setRate] = useState(6.5)
  const [remaining, setRemaining] = useState(25)
  const [lumpSum, setLumpSum] = useState(50000)

  const monthlyRate = rate / 100 / 12
  const numPayments = remaining * 12

  const currentMonthly = monthlyRate > 0
    ? (balance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : balance / numPayments

  const newBalance = Math.max(0, balance - lumpSum)
  const newMonthly = monthlyRate > 0 && newBalance > 0
    ? (newBalance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0

  const savings = Math.max(0, currentMonthly - newMonthly)

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Recast Calculator</h3>
      <p style={styles.desc}>See your new payment after a lump-sum principal reduction</p>

      <div style={styles.fields}>
        <label style={styles.label}>
          Current Balance
          <input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          Interest Rate (%)
          <input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} style={styles.input} step={0.1} />
        </label>
        <label style={styles.label}>
          Years Remaining
          <input type="number" value={remaining} onChange={(e) => setRemaining(+e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          Lump Sum Payment
          <input type="number" value={lumpSum} onChange={(e) => setLumpSum(+e.target.value)} style={styles.input} />
        </label>
      </div>

      <div style={styles.results}>
        <div style={styles.row}>
          <div style={styles.col}>
            <span style={styles.small}>Current Payment</span>
            <span style={styles.val}>${currentMonthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
          <div style={styles.arrow}>→</div>
          <div style={styles.col}>
            <span style={styles.small}>New Payment</span>
            <span style={{ ...styles.val, color: '#6ee7b7' }}>${Math.max(0, newMonthly).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
        <div style={styles.savingsRow}>
          You save <strong>${savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo</strong> — that&apos;s <strong>${(savings * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}/year</strong>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  fields: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#aaa' },
  input: { padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '1rem', outline: 'none' },
  results: { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1.5rem' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' },
  col: { textAlign: 'center' },
  arrow: { fontSize: '1.5rem', color: '#666' },
  small: { fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' },
  val: { fontSize: '1.8rem', fontWeight: 800 },
  savingsRow: { textAlign: 'center', fontSize: '0.9rem', color: '#999', background: 'rgba(16,185,129,0.1)', padding: '0.7rem', borderRadius: '8px' },
}
