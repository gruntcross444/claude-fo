import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'

const SCORES = [1, 2, 3, 4]

function getResult(score, maxScore, t) {
  const pct = (score / maxScore) * 100
  if (pct >= 80) return { ...t('preQual.results.strong'), color: '#10b981' }
  if (pct >= 60) return { ...t('preQual.results.good'), color: '#6366f1' }
  if (pct >= 40) return { ...t('preQual.results.getting'), color: '#f59e0b' }
  return { ...t('preQual.results.needs'), color: '#f43f5e' }
}

export default function PreQualQuiz() {
  const { t } = useLang()
  const questions = t('preQual.questions')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const done = current >= questions.length
  const score = answers.reduce((a, b) => a + b, 0)
  const maxScore = questions.length * 4
  const result = done ? getResult(score, maxScore, t) : null

  function next() {
    if (selected === null) return
    setAnswers([...answers, SCORES[selected]])
    setSelected(null)
    setCurrent(current + 1)
  }

  function reset() {
    setCurrent(0)
    setAnswers([])
    setSelected(null)
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{t('preQual.title')}</h3>
      <p style={styles.desc}>{t('preQual.desc')}</p>

      {!done ? (
        <>
          <div style={styles.progress}>
            <span style={styles.step}>{t('preQual.question')} {current + 1} {t('preQual.of')} {questions.length}</span>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${(current / questions.length) * 100}%` }} />
            </div>
          </div>

          <p style={styles.question}>{questions[current].q}</p>

          <div style={styles.options}>
            {questions[current].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{ ...styles.option, ...(selected === i ? styles.optionSelected : {}) }}
              >
                {opt}
              </button>
            ))}
          </div>

          <button onClick={next} disabled={selected === null} style={{ ...styles.nextBtn, opacity: selected === null ? 0.4 : 1 }}>
            {current === questions.length - 1 ? t('preQual.seeResults') : t('preQual.next')}
          </button>
        </>
      ) : (
        <div style={styles.resultCard}>
          <div style={{ ...styles.resultBadge, background: result.color }}>{result.label}</div>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNumber}>{score}</span>
            <span style={styles.scoreMax}>/{maxScore}</span>
          </div>
          <p style={styles.resultText}>{result.text}</p>
          <button onClick={reset} style={styles.retakeBtn}>{t('preQual.retake')}</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' },
  desc: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  progress: { marginBottom: '1.5rem' },
  step: { fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.5rem' },
  progressBar: { height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.3s' },
  question: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem' },
  options: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' },
  option: { padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'inherit', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
  optionSelected: { borderColor: '#6366f1', background: 'rgba(99,102,241,0.15)' },
  nextBtn: { padding: '0.7rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', width: '100%' },
  resultCard: { textAlign: 'center', padding: '1rem 0' },
  resultBadge: { display: 'inline-block', padding: '0.4rem 1.2rem', borderRadius: '999px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' },
  scoreCircle: { marginBottom: '1rem' },
  scoreNumber: { fontSize: '3rem', fontWeight: 800 },
  scoreMax: { fontSize: '1.2rem', color: '#666' },
  resultText: { color: '#999', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' },
  retakeBtn: { padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '0.9rem' },
}
