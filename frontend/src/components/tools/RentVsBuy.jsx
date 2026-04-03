import { useState } from 'react'

export default function RentVsBuy() {
  const [rent, setRent] = useState(2200)
  const [homePrice, setHomePrice] = useState(350000)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(5)
  const [rentIncrease, setRentIncrease] = useState(3)

  const down = homePrice * (downPct / 100)
  const loan = homePrice - down
  const monthlyRate = rate / 100 / 12
  const n = 30 * 12
  const mortgage = monthlyRate > 0
    ? (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    : loan / n
  const monthlyOwn = mortgage + homePrice * 0.012 / 12 + 150 // tax + insurance estimate

  let totalRent = 0
  let monthlyRent = rent
  for (let y = 0; y < years; y++) {
    totalRent += monthlyRent * 12
    monthlyRent *= 1 + rentIncrease / 100
  }

  const totalOwn = monthlyOwn * years * 12
  // Calculate actual principal paid via amortization
  let remainingLoan = loan
  let principalPaid = 0
  for (let i = 0; i < years * 12; i++) {
    const interestPayment = remainingLoan * monthlyRate
    const principalPayment = mortgage - interestPayment
    principalPaid += principalPayment
    remainingLoan -= principalPayment
  }
  const equity = principalPaid + down
  const netOwn = totalOwn - equity
  const better = netOwn < totalRent ? 'buy' : 'rent'
  const diff = Math.abs(totalRent - netOwn)

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Rent vs Buy Comparison</h3>
      <p style={styles.desc}>Compare total costs over time</p>

      <div style={styles.fields}>
        <label style={styles.label}>Monthly Rent<input type="number" value={rent} onChange={(e) => setRent(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Home Price<input type="number" value={homePrice} onChange={(e) => setHomePrice(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Down Payment (%)<input type="number" value={downPct} onChange={(e) => setDownPct(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Interest Rate (%)<input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} style={styles.input} step={0.1} /></label>
        <label style={styles.label}>Compare Over (years)<input type="number" value={years} onChange={(e) => setYears(+e.target.value)} style={styles.input} /></label>
        <label style={styles.label}>Annual Rent Increase (%)<input type="number" value={rentIncrease} onChange={(e) => setRentIncrease(+e.target.value)} style={styles.input} /></label>
      </div>

      <div style={styles.comparison}>
        <div style={{ ...styles.colCard, borderColor: better === 'rent' ? '#6366f1' : 'rgba(255,255,255,0.1)' }}>
          <span style={styles.colTitle}>Renting</span>
          <span style={styles.colValue}>${totalRent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          <span style={styles.colSub}>total over {years} years</span>
          <span style={styles.colDetail}>Equity built: $0</span>
        </div>
        <div style={styles.vs}>VS</div>
        <div style={{ ...styles.colCard, borderColor: better === 'buy' ? '#10b981' : 'rgba(255,255,255,0.1)' }}>
          <span style={styles.colTitle}>Buying</span>
          <span style={styles.colValue}>${totalOwn.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          <span style={styles.colSub}>total over {years} years</span>
          <span style={styles.colDetail}>Est. equity: ${equity.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      <div style={styles.verdict}>
        {better === 'buy'
          ? `Buying saves you ~$${diff.toLocaleString('en-US', { maximumFractionDigits: 0 })} over ${years} years (net of equity)`
          : `Renting saves you ~$${diff.toLocaleString('en-US', { maximumFractionDigits: 0 })} over ${years} years`
        }
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  fields: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#aaa' },
  input: { padding: '0.55rem 0.7rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '0.95rem', outline: 'none' },
  comparison: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  colCard: { flex: 1, textAlign: 'center', padding: '1.2rem', borderRadius: '12px', border: '2px solid', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  colTitle: { fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' },
  colValue: { fontSize: '1.5rem', fontWeight: 800 },
  colSub: { fontSize: '0.75rem', color: '#666' },
  colDetail: { fontSize: '0.78rem', color: '#999', marginTop: '0.3rem' },
  vs: { fontSize: '0.9rem', fontWeight: 700, color: '#555' },
  verdict: { textAlign: 'center', fontSize: '0.9rem', color: '#6ee7b7', background: 'rgba(16,185,129,0.08)', padding: '0.8rem', borderRadius: '10px', fontWeight: 500 },
}
