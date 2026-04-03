import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'

export default function MortgageCalculator() {
  const { t } = useLang()
  const [price, setPrice] = useState(350000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)

  const loanAmount = price * (1 - down / 100)
  const monthlyRate = rate / 100 / 12
  const numPayments = term * 12
  const monthly = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments
  const totalPaid = monthly * numPayments
  const totalInterest = totalPaid - loanAmount

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{t('mortgageCalc.title')}</h3>
      <p style={styles.desc}>{t('mortgageCalc.desc')}</p>

      <div style={styles.fields}>
        <label style={styles.label}>
          {t('mortgageCalc.homePrice')}
          <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          {t('mortgageCalc.downPayment')}
          <input type="number" value={down} onChange={(e) => setDown(+e.target.value)} style={styles.input} min={0} max={100} />
        </label>
        <label style={styles.label}>
          {t('mortgageCalc.interestRate')}
          <input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} style={styles.input} step={0.1} />
        </label>
        <label style={styles.label}>
          {t('mortgageCalc.loanTerm')}
          <input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} style={styles.input} />
        </label>
      </div>

      <div style={styles.results}>
        <div style={styles.resultMain}>
          <span style={styles.resultLabel}>{t('mortgageCalc.monthlyPayment')}</span>
          <span style={styles.resultValue}>${monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={styles.resultRow}>
          <div><span style={styles.small}>{t('mortgageCalc.loanAmount')}</span><br />${loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div><span style={styles.small}>{t('mortgageCalc.totalInterest')}</span><br />${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div><span style={styles.small}>{t('mortgageCalc.totalPaid')}</span><br />${totalPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
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
  results: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.5rem' },
  resultMain: { textAlign: 'center', marginBottom: '1rem' },
  resultLabel: { fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.3rem' },
  resultValue: { fontSize: '2.2rem', fontWeight: 800, color: '#a5b4fc' },
  resultRow: { display: 'flex', justifyContent: 'space-around', textAlign: 'center', fontSize: '0.9rem' },
  small: { fontSize: '0.75rem', color: '#666' },
}
