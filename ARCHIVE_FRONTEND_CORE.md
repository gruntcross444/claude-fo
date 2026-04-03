# ARCHIVE_FRONTEND_CORE

### `frontend/src/i18n/LanguageContext.jsx`

```jsx
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
```

### `frontend/src/i18n/en.js`

```javascript
export default {
  // Navbar
  nav: {
    services: 'Services',
    features: 'Features',
    portfolio: 'Portfolio',
    store: 'Store',
    tools: 'Tools',
    prompts: 'Prompts',
    contact: 'Contact',
    login: 'Log in',
    logout: 'Log out',
    getStarted: 'Get Started',
  },

  // Hero
  hero: {
    eyebrow: 'Premium Digital Agency',
    heading: 'We craft',
    sub: 'Full-stack development, AI automation, branding & real estate solutions.',
    sub2: 'Exclusive. Premium. Results-driven.',
    cta: 'Explore Our Work',
    ctaAuth: 'View Portfolio',
    secondary: 'Our Services',
  },

  // Typing words
  typingWords: [
    'stunning websites',
    'AI automations',
    'brand identities',
    'lead funnels',
    'magic prompts',
    'mobile apps',
    'digital products',
  ],

  // Stats
  stats: {
    projects: 'Projects Delivered',
    clients: 'Happy Clients',
    tools: 'Tools Built',
    experience: 'Years Experience',
  },

  // Trust
  trust: {
    label: 'Trusted by businesses in',
  },

  // Services
  services: {
    heading: 'Services',
    sub: 'What we bring to the table',
    webDev: { title: 'Web Development', desc: 'Full-stack applications built with modern technologies. Fast, scalable, and maintainable code.' },
    realEstate: { title: 'Real Estate', desc: 'Rental community platforms, property landing pages, and lead-generating tools for the real estate industry.' },
    branding: { title: 'Logo & Branding', desc: 'Vector logos, animated logos, brand identity systems, and social media kits that make you stand out.' },
    ai: { title: 'AI & Automation', desc: 'Workflow automations, AI-powered funnels, lead magnets, email blasts, and SMS campaigns that run on autopilot.' },
    mobile: { title: 'Mobile Apps', desc: 'Cross-platform mobile experiences that feel native. Reach your users wherever they are.' },
  },

  // Features
  features: {
    heading: 'Why work with us',
    sub: 'The values that drive every project',
    fast: { title: 'Fast Delivery', desc: 'Agile workflow means you get working software quickly, with regular updates along the way.' },
    secure: { title: 'Secure by Default', desc: 'Security is built in from day one — not bolted on after the fact.' },
    clean: { title: 'Clean Code', desc: 'Readable, maintainable code that your team can build on for years to come.' },
    comms: { title: 'Clear Communication', desc: 'Transparent updates and no surprises. You always know where your project stands.' },
  },

  // Portfolio teaser
  portfolioTeaser: {
    heading: 'Portfolio',
    sub: 'A selection of our work — register to see everything',
    cta: 'Create Free Account',
    ctaAuth: 'View Portfolio',
    ctaText: 'Sign up to access the full portfolio',
  },

  // CTA
  cta: {
    heading: 'Ready to elevate your brand?',
    sub: "Let's build something extraordinary together.",
    btn: 'Start Your Project',
    btnAuth: 'Get in Touch',
    prompts: 'Browse Free Prompts',
  },

  // Store
  store: {
    eyebrow: 'Digital Products',
    heading: 'Store',
    sub: 'Premium templates, tools, and prompt packs to grow your business',
    premiumProducts: 'Premium Products',
    freeTools: 'Free Tools',
    free: 'Free',
    buyNow: 'Buy Now',
    redirecting: 'Redirecting...',
    useFree: 'Use Free Tool',
    off: 'off',
    customCta: 'Need something custom?',
    customSub: 'We build tailored solutions for your business — from landing pages to full automation systems.',
    customBtn: "Let's Build It",
    successBanner: 'Payment successful! Check your email for the download link.',
    cancelBanner: 'Checkout was canceled. No charge was made.',
  },

  // Tools
  tools: {
    eyebrow: 'Free Tools',
    heading: 'Real Estate Tools',
    sub: 'Calculators, checklists, and assessments to help you make smarter decisions',
  },

  // Prompts
  prompts: {
    eyebrow: 'Magic Prompts Library',
    heading: 'Prompt Library',
    free: 'Free',
    premium: 'Premium',
    copy: 'Copy Prompt',
    copied: 'Copied!',
    unlock: 'Get Full Access',
    ctaHeading: 'Want all prompts?',
    ctaSub: 'Get the full prompt library — unlock every premium template.',
    ctaBtn: 'Browse Prompt Packs in Store',
  },

  // Contact
  contact: {
    eyebrow: 'Get in touch',
    heading: 'Contact',
    sub: "Let's talk about your project",
    whatsapp: 'WhatsApp',
    whatsappSub: 'Chat with me directly',
    calendly: 'Calendly',
    calendlySub: 'Book a consultation — coming soon',
    follow: 'Follow us',
    formTitle: 'Send a message',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    sent: "Message sent! I'll get back to you soon.",
    error: 'Something went wrong. Try WhatsApp instead.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: 'Tell me about your project...',
  },

  // Auth
  auth: {
    loginHeading: 'Welcome back',
    loginSub: 'Log in to access the portfolio',
    registerHeading: 'Create an account',
    registerSub: 'Get access to the full portfolio',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    loginBtn: 'Log in',
    loggingIn: 'Logging in...',
    registerBtn: 'Create account',
    creating: 'Creating account...',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUp: 'Sign up',
    logIn: 'Log in',
    orContinue: 'or continue with',
  },

  // Email gate
  emailGate: {
    heading: 'See your results',
    sub: 'Enter your email to unlock the calculator results. Free, no spam.',
    btn: 'Unlock Results',
    unlocking: 'Unlocking...',
    privacy: 'We respect your privacy. Unsubscribe anytime.',
    error: 'Please enter a valid email',
  },

  // Exit popup
  exitPopup: {
    heading: "Wait — don't leave empty-handed!",
    sub: 'Get <strong>10% off</strong> your first purchase + our free Real Estate Toolkit.',
    btn: 'Claim My 10% Off',
    sending: 'Sending...',
    privacy: 'No spam. Unsubscribe anytime.',
    successHeading: "You're in!",
    successSub: 'Check your inbox for the discount code and free toolkit.',
    continue: 'Continue Browsing',
  },

  // Sticky CTA
  stickyCta: {
    text: 'Ready to start your project?',
    btn: 'Get a Free Consultation',
    btnAuth: 'Get in Touch',
  },

  // Spin wheel
  spinWheel: {
    heading: 'Spin to Win!',
    sub: 'Enter your email for a chance to win up to <strong>50% off</strong> or free products.',
    btn: 'Spin the Wheel',
    loading: 'Loading...',
    wonHeading: 'You won!',
    lostHeading: 'So close!',
    wonSub: 'Your discount code has been sent to your email!',
    lostSub: 'No worries — sign up now and get 5% off automatically.',
    wonBtn: 'Continue Shopping',
    lostBtn: 'Sign Up Anyway',
  },

  // Footer
  footer: {
    rights: 'All rights reserved',
  },

  // Download
  download: {
    heading: 'Payment Successful!',
    sub: 'Thank you for your purchase.',
    btn: 'Download Your Product',
    pending: 'Your product is being prepared and will be sent to your email shortly.',
    pendingSub: "If you don't receive it within 24 hours, contact us.",
    back: 'Browse more products',
  },

  // Stats section CTAs
  statsCta: {
    store: 'Browse Store',
    tools: 'Try Free Tools',
  },

  // Categories
  categories: {
    all: 'All',
    realEstate: 'Real Estate',
    webDev: 'Web Development',
    ai: 'AI & Automation',
    mobile: 'Mobile Apps',
    branding: 'Logo & Branding',
  },
}
```

### `frontend/src/i18n/es.js`

```javascript
export default {
  // Navbar
  nav: {
    services: 'Servicios',
    features: 'Ventajas',
    portfolio: 'Portafolio',
    store: 'Tienda',
    tools: 'Herramientas',
    prompts: 'Prompts',
    contact: 'Contacto',
    login: 'Iniciar sesion',
    logout: 'Cerrar sesion',
    getStarted: 'Comenzar',
  },

  // Hero
  hero: {
    eyebrow: 'Agencia Digital Premium',
    heading: 'Creamos',
    sub: 'Desarrollo web, automatizacion con IA, branding y soluciones inmobiliarias.',
    sub2: 'Exclusivo. Premium. Enfocado en resultados.',
    cta: 'Explora Nuestro Trabajo',
    ctaAuth: 'Ver Portafolio',
    secondary: 'Nuestros Servicios',
  },

  // Typing words
  typingWords: [
    'sitios web increibles',
    'automatizaciones con IA',
    'identidades de marca',
    'embudos de ventas',
    'prompts magicos',
    'apps moviles',
    'productos digitales',
  ],

  // Stats
  stats: {
    projects: 'Proyectos Entregados',
    clients: 'Clientes Satisfechos',
    tools: 'Herramientas Creadas',
    experience: 'Anos de Experiencia',
  },

  // Trust
  trust: {
    label: 'Con la confianza de empresas en',
  },

  // Services
  services: {
    heading: 'Servicios',
    sub: 'Lo que traemos a la mesa',
    webDev: { title: 'Desarrollo Web', desc: 'Aplicaciones completas con tecnologia moderna. Rapido, escalable y codigo de calidad.' },
    realEstate: { title: 'Bienes Raices', desc: 'Plataformas para comunidades de alquiler, landing pages inmobiliarias y herramientas de captacion de leads.' },
    branding: { title: 'Logo y Marca', desc: 'Logos vectoriales, logos animados, sistemas de identidad visual y kits para redes sociales que te hacen destacar.' },
    ai: { title: 'IA y Automatizacion', desc: 'Automatizaciones, embudos con IA, lead magnets, email marketing y campanas SMS que trabajan en piloto automatico.' },
    mobile: { title: 'Apps Moviles', desc: 'Experiencias moviles multiplataforma que se sienten nativas. Llega a tus usuarios donde esten.' },
  },

  // Features
  features: {
    heading: 'Por que trabajar con nosotros',
    sub: 'Los valores que impulsan cada proyecto',
    fast: { title: 'Entrega Rapida', desc: 'Flujo de trabajo agil — recibes software funcional rapidamente, con actualizaciones constantes.' },
    secure: { title: 'Seguridad Integrada', desc: 'La seguridad se construye desde el dia uno — no se agrega despues.' },
    clean: { title: 'Codigo Limpio', desc: 'Codigo legible y mantenible que tu equipo puede desarrollar por anos.' },
    comms: { title: 'Comunicacion Clara', desc: 'Actualizaciones transparentes y sin sorpresas. Siempre sabes donde esta tu proyecto.' },
  },

  // Portfolio teaser
  portfolioTeaser: {
    heading: 'Portafolio',
    sub: 'Una seleccion de nuestro trabajo — registrate para verlo todo',
    cta: 'Crear Cuenta Gratis',
    ctaAuth: 'Ver Portafolio',
    ctaText: 'Registrate para acceder al portafolio completo',
  },

  // CTA
  cta: {
    heading: 'Listo para elevar tu marca?',
    sub: 'Construyamos algo extraordinario juntos.',
    btn: 'Inicia Tu Proyecto',
    btnAuth: 'Contactanos',
    prompts: 'Explora Prompts Gratis',
  },

  // Store
  store: {
    eyebrow: 'Productos Digitales',
    heading: 'Tienda',
    sub: 'Plantillas premium, herramientas y paquetes de prompts para hacer crecer tu negocio',
    premiumProducts: 'Productos Premium',
    freeTools: 'Herramientas Gratis',
    free: 'Gratis',
    buyNow: 'Comprar Ahora',
    redirecting: 'Redirigiendo...',
    useFree: 'Usar Gratis',
    off: 'desc.',
    customCta: 'Necesitas algo personalizado?',
    customSub: 'Construimos soluciones a medida para tu negocio — desde landing pages hasta sistemas de automatizacion completos.',
    customBtn: 'Construyamoslo',
    successBanner: 'Pago exitoso! Revisa tu email para el enlace de descarga.',
    cancelBanner: 'Compra cancelada. No se realizo ningun cargo.',
  },

  // Tools
  tools: {
    eyebrow: 'Herramientas Gratis',
    heading: 'Herramientas Inmobiliarias',
    sub: 'Calculadoras, checklists y evaluaciones para tomar decisiones mas inteligentes',
  },

  // Prompts
  prompts: {
    eyebrow: 'Biblioteca de Prompts Magicos',
    heading: 'Biblioteca de Prompts',
    free: 'Gratis',
    premium: 'Premium',
    copy: 'Copiar Prompt',
    copied: 'Copiado!',
    unlock: 'Obtener Acceso Completo',
    ctaHeading: 'Quieres todos los prompts?',
    ctaSub: 'Obtene la biblioteca completa — desbloquea todas las plantillas premium.',
    ctaBtn: 'Ver Paquetes en la Tienda',
  },

  // Contact
  contact: {
    eyebrow: 'Ponte en contacto',
    heading: 'Contacto',
    sub: 'Hablemos de tu proyecto',
    whatsapp: 'WhatsApp',
    whatsappSub: 'Chatea conmigo directamente',
    calendly: 'Calendly',
    calendlySub: 'Agenda una consulta — proximamente',
    follow: 'Siguenos',
    formTitle: 'Envia un mensaje',
    name: 'Nombre',
    email: 'Email',
    message: 'Mensaje',
    send: 'Enviar Mensaje',
    sending: 'Enviando...',
    sent: 'Mensaje enviado! Te respondere pronto.',
    error: 'Algo salio mal. Prueba por WhatsApp.',
    namePlaceholder: 'Tu nombre',
    emailPlaceholder: 'tu@email.com',
    messagePlaceholder: 'Cuentame sobre tu proyecto...',
  },

  // Auth
  auth: {
    loginHeading: 'Bienvenido de vuelta',
    loginSub: 'Inicia sesion para acceder al portafolio',
    registerHeading: 'Crea tu cuenta',
    registerSub: 'Accede al portafolio completo',
    email: 'Email',
    password: 'Contrasena',
    name: 'Nombre',
    loginBtn: 'Iniciar sesion',
    loggingIn: 'Iniciando sesion...',
    registerBtn: 'Crear cuenta',
    creating: 'Creando cuenta...',
    noAccount: 'No tienes cuenta?',
    hasAccount: 'Ya tienes cuenta?',
    signUp: 'Registrate',
    logIn: 'Inicia sesion',
    orContinue: 'o continuar con',
  },

  // Email gate
  emailGate: {
    heading: 'Ve tus resultados',
    sub: 'Ingresa tu email para desbloquear los resultados. Gratis, sin spam.',
    btn: 'Desbloquear Resultados',
    unlocking: 'Desbloqueando...',
    privacy: 'Respetamos tu privacidad. Cancela cuando quieras.',
    error: 'Por favor ingresa un email valido',
  },

  // Exit popup
  exitPopup: {
    heading: 'Espera — no te vayas con las manos vacias!',
    sub: 'Obtene <strong>10% de descuento</strong> en tu primera compra + nuestro Kit Inmobiliario gratis.',
    btn: 'Reclamar Mi 10% Off',
    sending: 'Enviando...',
    privacy: 'Sin spam. Cancela cuando quieras.',
    successHeading: 'Ya estas dentro!',
    successSub: 'Revisa tu bandeja para el codigo de descuento y el kit gratuito.',
    continue: 'Seguir Navegando',
  },

  // Sticky CTA
  stickyCta: {
    text: 'Listo para iniciar tu proyecto?',
    btn: 'Obtene una Consulta Gratis',
    btnAuth: 'Contactanos',
  },

  // Spin wheel
  spinWheel: {
    heading: 'Gira y Gana!',
    sub: 'Ingresa tu email para tener chance de ganar hasta <strong>50% de descuento</strong> o productos gratis.',
    btn: 'Girar la Ruleta',
    loading: 'Cargando...',
    wonHeading: 'Ganaste!',
    lostHeading: 'Casi!',
    wonSub: 'Tu codigo de descuento fue enviado a tu email!',
    lostSub: 'No te preocupes — registrate ahora y obtene 5% automaticamente.',
    wonBtn: 'Seguir Comprando',
    lostBtn: 'Registrarme',
  },

  // Footer
  footer: {
    rights: 'Todos los derechos reservados',
  },

  // Download
  download: {
    heading: 'Pago Exitoso!',
    sub: 'Gracias por tu compra.',
    btn: 'Descargar Tu Producto',
    pending: 'Tu producto esta siendo preparado y sera enviado a tu email en breve.',
    pendingSub: 'Si no lo recibes en 24 horas, contactanos.',
    back: 'Ver mas productos',
  },

  // Stats section CTAs
  statsCta: {
    store: 'Ver Tienda',
    tools: 'Probar Herramientas Gratis',
  },

  // Categories
  categories: {
    all: 'Todos',
    realEstate: 'Bienes Raices',
    webDev: 'Desarrollo Web',
    ai: 'IA y Automatizacion',
    mobile: 'Apps Moviles',
    branding: 'Logo y Marca',
  },
}
```

### `frontend/src/hooks/useScrollReveal.jsx`

```jsx
import { useEffect, useRef, useState } from 'react'

export default function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}
```

### `frontend/src/hooks/useTypingEffect.jsx`

```jsx
import { useState, useEffect } from 'react'

export default function useTypingEffect(texts, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)

        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)

        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % texts.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime])

  return displayText
}
```

### `frontend/src/hooks/useCounter.jsx`

```jsx
import { useState, useEffect, useRef } from 'react'

export default function useCounter(end, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(!startOnVisible)
  const ref = useRef(null)

  useEffect(() => {
    if (!startOnVisible) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [startOnVisible])

  useEffect(() => {
    if (!started) return

    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [started, end, duration])

  return [ref, count]
}
```

### `frontend/src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  function login(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

### `frontend/src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './i18n/LanguageContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

### `frontend/src/App.jsx`

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PortfolioPage from './pages/PortfolioPage'
import StorePage from './pages/StorePage'
import ToolsPage from './pages/ToolsPage'
import PromptsPage from './pages/PromptsPage'
import ContactPage from './pages/ContactPage'
import OAuthCallback from './pages/OAuthCallback'
import DownloadPage from './pages/DownloadPage'
import ProtectedRoute from './components/ProtectedRoute'
import ExitIntentPopup from './components/ExitIntentPopup'
import StickyCTA from './components/StickyCTA'
import SpinWheel from './components/SpinWheel'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/prompts" element={<PromptsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth/:provider/callback" element={<OAuthCallback />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SpinWheel />
      <ExitIntentPopup />
      <StickyCTA />
    </>
  )
}
```

### `frontend/src/App.css`

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
```

### `frontend/src/index.css`

```css
:root {
  --text: #9ca3af;
  --text-h: #f3f4f6;
  --bg: #0a0b0f;
  --bg-card: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.06);
  --border-hover: rgba(255,255,255,0.15);
  --accent: #6366f1;
  --accent-gold: #c8a76b;
  --accent-gold-light: #f0d89c;

  --sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --heading: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --mono: ui-monospace, 'Cascadia Code', Consolas, monospace;

  font: 16px/160% var(--sans);
  letter-spacing: -0.01em;
  color-scheme: dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
}

#root {
  min-height: 100svh;
}

h1, h2, h3 {
  font-family: var(--heading);
  color: var(--text-h);
  letter-spacing: -0.02em;
}

h1 {
  font-weight: 800;
}

h2 {
  font-weight: 700;
}

p {
  margin: 0;
}

a {
  transition: color 0.2s, opacity 0.2s;
}

/* ── Cursor blink animation ────────────────────────────── */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ── Bounce animation for scroll hints ─────────────────── */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(8px); }
  60% { transform: translateY(4px); }
}

/* ── Spin wheel pointer pulse ──────────────────────────── */
@keyframes pointerPulse {
  0% { transform: translateX(-50%) scale(1); }
  100% { transform: translateX(-50%) scale(1.2); }
}

/* ── Fade in up for results ────────────────────────────── */
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* ── Smooth scrolling ──────────────────────────────────── */
html {
  scroll-behavior: smooth;
}

/* ── Selection color ───────────────────────────────────── */
::selection {
  background: rgba(99, 102, 241, 0.3);
  color: #fff;
}

/* ── Scrollbar ─────────────────────────────────────────── */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg);
}
::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.2);
}

/* ── Mobile ────────────────────────────────────────────── */
@media (max-width: 768px) {
  :root {
    font-size: 15px;
  }
}
```

### `frontend/src/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### `frontend/package.json`

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.14.0",
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "vite": "^8.0.1"
  }
}
```

### `frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Claude.FO | Digital Agency — Web Dev, AI & Automation</title>
    <meta name="description" content="Premium bilingual digital agency. Web development, AI automation, branding, and real estate tools. Serving 500M+ Spanish speakers worldwide." />
    <meta property="og:title" content="Claude.FO | Digital Agency" />
    <meta property="og:description" content="Web dev, AI automation, branding & real estate tools. English + Spanish." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://claude-fo.vercel.app" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

### `frontend/vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### `frontend/eslint.config.js`

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```
