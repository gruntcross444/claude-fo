import { createContext, useContext, useState, useEffect } from 'react'
import en from './en'
import es from './es'

const translations = { en, es }
const LanguageContext = createContext(null)

function detectLanguage() {
  // Check saved preference first
  const saved = localStorage.getItem('lang')
  if (saved && translations[saved]) return saved

  // Auto-detect from browser
  const browserLang = navigator.language?.slice(0, 2)
  if (browserLang === 'es') return 'es'
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage)

  function switchLang(newLang) {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  function t(key) {
    const keys = key.split('.')
    let value = translations[lang]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
