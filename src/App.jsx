import { useEffect, useRef, useState } from 'react'
import heroImage from './assets/Hero.webp'
import heroVideo from './assets/HeroVid.mp4'
import geothermalImage from './assets/GeoThermalRepresentation.webp'
import hospitalImage from './assets/hospital.webp'
import outageSequenceImage from './assets/MicroGridOutageSequence.webp'
import outageProbabilityImage from './assets/OutageSurvivalPropabilities.webp'
import industrialHeroImage from './assets/IndustrialHero.webp'
import industrialEfficiencyImage from './assets/EffeciensybyGenerationMethod.webp'
import industrialInteriorImage from './assets/Inside.webp'
import powerPastureImage from './assets/PowerPastureImage.webp'
import brandLogo from './assets/PowerPastureLogo-tm.webp'
import './App.css'

// Launch solution pages individually as their content is approved.
const enabledSolutionPages = new Set(['/hospitals', '/manufacturing'])

const layers = [
  {
    id: '01',
    code: 'GEOTHERMAL',
    title: 'Geothermal',
    copy: 'Stable energy and thermal resources become a long-lived component of the site’s infrastructure.',
    detail: 'Where subsurface conditions support it, geothermal can contribute dependable energy, year-round thermal exchange, or both—giving the site a stable base layer for changing infrastructure.',
    icon: 'geothermal',
    stat: 'ENERGY + THERMAL',
    potential: 'STEADY / 24-7',
    potentialDetail: 'Steady, around-the-clock production and thermal support where subsurface conditions allow.',
    traits: ['Stable potential', 'Integrated thermal', 'Long-lived foundation'],
  },
  {
    id: '02',
    code: 'HYDRO',
    title: 'Hydro',
    copy: 'Where suitable resources exist, hydro can provide high-density and potentially dispatchable generation.',
    detail: 'Power Pasture™ evaluates the local water resource, site conditions, permitting pathway, and infrastructure needs together—shaping the project around what the location can responsibly support.',
    icon: 'hydro',
    stat: 'DENSE GENERATION',
    potential: 'HIGH-DENSITY',
    potentialDetail: 'High-density output with dispatchable potential at sites with a suitable water resource.',
    traits: ['Site specific', 'Potentially dispatchable', 'Infrastructure ready'],
  },
  {
    id: '03',
    code: 'SOLAR',
    title: 'Solar',
    copy: 'Scalable generation can be deployed according to available land, infrastructure requirements, and site demand.',
    detail: 'Its modular nature allows capacity to be shaped around land and demand, then paired with other resources or storage as the Power Pasture™ develops.',
    icon: 'solar',
    stat: 'MODULAR SCALE',
    potential: 'SCALABLE',
    potentialDetail: 'Modular capacity that can scale with available land, infrastructure, and site demand.',
    traits: ['Land responsive', 'Phased deployment', 'Resource pairing'],
  },
  {
    id: '04',
    code: 'WIND',
    title: 'Wind',
    copy: 'Where local conditions support it, wind can complement other sources and diversify the energy strategy.',
    detail: 'Rather than forcing wind into every site, the model uses it where the resource is strong and where it can add a complementary production profile to the wider energy mix.',
    icon: 'windTurbine',
    stat: 'RESOURCE DIVERSITY',
    potential: 'COMPLEMENTARY',
    potentialDetail: 'A complementary production profile that can diversify the site’s wider renewable mix.',
    traits: ['Condition driven', 'Complementary output', 'Diversified mix'],
  },
]

const applications = [
  { id: '01', path: '/data-centers', title: 'Data centers', copy: 'High-demand digital infrastructure deployed closer to abundant, locally produced energy.' },
  { id: '02', title: 'Home developments', copy: 'Local renewable generation planned alongside homes, roads, utilities, and growing communities.' },
  { id: '03', path: '/hospitals', title: 'Hospitals', copy: 'A resilient Outpost Node™ for facilities that depend on continuous, dependable operation.' },
  { id: '04', title: 'Office buildings', copy: 'Adaptable energy systems for commercial campuses and the organizations they support.' },
  { id: '05', title: 'Shopping centers', copy: 'Scalable generation for retail destinations, mixed-use sites, and their surrounding services.' },
  { id: '06', path: '/manufacturing', title: 'Manufacturing & industrial', copy: 'Continuous, high-density power and process heat for manufacturing, cold storage, and heavy industrial operations.' },
]

function Icon({ name, size = 20 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    bolt: <path d="m13.2 2-9 12h7l-.5 8 9-12h-7.2l.7-8Z" />,
    thermal: <><path d="M14 14.7V5a2 2 0 0 0-4 0v9.7a4 4 0 1 0 4 0Z" /><path d="M12 11v6" /></>,
    geothermal: <><path d="M3 9h18M3 14c3-1.4 5.8 1.4 9 0s6-1.4 9 0M3 19c3-1.4 5.8 1.4 9 0s6-1.4 9 0" /><path d="M9 9v8a3 3 0 0 0 6 0V9" /><path d="M8 6c-1-1-1-2 0-3M12 6c-1-1-1-2 0-3M16 6c-1-1-1-2 0-3" /></>,
    hydro: <><path d="M6 4h12l2 14H4L6 4Z" /><circle cx="12" cy="12" r="3" /><path d="M12 9v6M9.4 10.5l5.2 3M14.6 10.5l-5.2 3M3 21c2-1.5 4 1.5 6 0s4-1.5 6 0 4-1.5 6 0" /></>,
    solar: <><circle cx="18.5" cy="5.5" r="2.5" /><path d="M18.5 1v1M18.5 9v1M14 5.5h1M22 5.5h1" /><path d="m5 9 12-1 2 9H3l2-8Z" /><path d="M8.7 8.7 8 17M13 8.3l1 8.7M4 13h14M11 17v4M7 21h8" /></>,
    windTurbine: <><circle cx="12" cy="8" r="1.5" /><path d="M12 6.5 9.5 2C8 2.5 7.1 3.4 6.5 4.5L10.8 8M13.3 8.7l5.2.1c.3 1.4 0 2.7-.6 3.8l-4.7-2.9M11.8 9.5 9.2 14c-1.4-.5-2.3-1.4-2.9-2.5l4.4-2.8M12 9.5 10.5 22M13.5 22h-6" /></>,
    water: <path d="M12 2S6 9 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    wind: <><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h6" /></>,
    signal: <><path d="M5 16a7 7 0 0 1 14 0M8 16a4 4 0 0 1 8 0" /><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" /></>,
    hospital: <><path d="M5 21V5h14v16M3 21h18M9 9h6M12 6v6M8 15h2M14 15h2M8 18h2M14 18h2" /></>,
    post: <><path d="M12 5v16M8 21h8M7 5h10M9 2h6v6H9z" /><path d="M5 11h14M7 11v4M17 11v4" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg {...props}>{paths[name]}</svg>
}

function EnergyArtFrame({ type, children }) {
  const meta = {
    GEOTHERMAL: { code: 'GEO / 01', output: 'STEADY THERMAL LOOP' },
    HYDRO: { code: 'HYDRO / 02', output: 'DENSE GENERATION' },
    SOLAR: { code: 'SOLAR / 03', output: 'MODULAR OUTPUT' },
    WIND: { code: 'WIND / 04', output: 'COMPLEMENTARY LOAD' },
  }[type]

  return (
    <div className={`energy-art energy-art-${type.toLowerCase()}`} aria-hidden="true">
      <span className="energy-art-grid" />
      <div className="energy-art-meta"><span><i /> RESOURCE SCHEMATIC</span><b>{meta.code}</b></div>
      {children}
      <div className="energy-art-footer"><span>RESOURCE INPUT</span><i /><span>{meta.output}</span></div>
    </div>
  )
}

function EnergyArt({ type }) {
  if (type === 'GEOTHERMAL') {
    return (
      <EnergyArtFrame type="GEOTHERMAL">
        <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
          <path className="energy-ground-fill" d="M24 76 C120 65 200 82 292 72 S474 61 616 76 V262 H24Z" />
          <path className="energy-surface" d="M24 76 C120 65 200 82 292 72 S474 61 616 76" />
          <path className="energy-line energy-line-soft" pathLength="1" d="M24 134 C124 110 216 151 318 127 S510 104 616 130" />
          <path className="energy-line" pathLength="1" d="M24 190 C124 166 216 208 318 183 S510 160 616 186" />
          <path className="energy-line energy-line-soft" pathLength="1" d="M24 240 C124 216 216 258 318 233 S510 210 616 236" />
          <path className="energy-datum" d="M52 90V244M44 118h16M44 172h16M44 226h16" />
          <text className="energy-svg-label" x="70" y="117">- 0.8 KM</text>
          <text className="energy-svg-label" x="70" y="171">- 1.6 KM</text>
          <text className="energy-svg-label" x="70" y="225">THERMAL ZONE</text>
          <rect className="energy-structure energy-plant" x="238" y="25" width="150" height="50" rx="3" />
          <circle className="energy-exchanger" cx="270" cy="50" r="14" />
          <path className="energy-vector" d="M270 37v26M257 50h26M260.8 40.8l18.4 18.4M279.2 40.8l-18.4 18.4M300 41h70M300 51h70M300 61h44" />
          <text className="energy-svg-label" x="405" y="54">EXCHANGE MODULE</text>
          <path className="energy-bore" pathLength="1" d="M304 75 V214 C304 244 338 244 338 214 V75" />
          <path className="energy-flow" d="m292 142 12 12 12-12M326 154l12-12 12 12" />
          <path className="energy-heat" d="M150 221c-16-15 16-25 0-40s16-25 0-40M464 213c-16-15 16-25 0-40s16-25 0-40M526 231c-12-12 12-21 0-33s12-21 0-33" />
          <path className="energy-signal" pathLength="1" d="M321 228V83C321 66 337 57 388 54" />
          <circle className="energy-core" cx="321" cy="228" r="9" />
          <circle className="energy-orbit" cx="321" cy="228" r="30" />
          <circle className="energy-node" cx="388" cy="54" r="4" />
        </svg>
      </EnergyArtFrame>
    )
  }

  if (type === 'HYDRO') {
    return (
      <EnergyArtFrame type="HYDRO">
        <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
          <path className="energy-water-fill" d="M22 70C70 50 112 92 160 72S244 52 300 70V218H22Z" />
          <path className="energy-line energy-wave energy-line-soft" pathLength="1" d="M22 72 C70 50 112 92 160 72 S244 52 286 69" />
          <path className="energy-line energy-wave" pathLength="1" d="M22 112 C70 90 112 132 160 112 S244 92 296 110" />
          <path className="energy-line energy-wave energy-line-soft" pathLength="1" d="M22 152 C70 130 112 172 160 152 S244 132 304 151" />
          <text className="energy-svg-label" x="34" y="46">RESERVOIR / INTAKE</text>
          <path className="energy-structure energy-dam" d="M300 42 H354 L394 222 H326 Z" />
          <path className="energy-datum" d="M312 62h31M318 92h32M322 122h34M328 152h35M333 182h37" />
          <path className="energy-flow energy-penstock" d="M314 92 C342 120 350 162 388 186" />
          <circle className="energy-turbine" cx="417" cy="190" r="32" />
          <circle className="energy-core" cx="417" cy="190" r="7" />
          <path className="energy-vector" d="M417 183V163M423 194l18 10M411 194l-18 10" />
          <path className="energy-signal" pathLength="1" d="M449 190H510V112H592" />
          <rect className="energy-output" x="510" y="89" width="84" height="46" rx="4" />
          <path className="energy-vector" d="M524 102h55M524 111h40M524 120h49" />
          <text className="energy-svg-label" x="500" y="72">GENERATOR OUTPUT</text>
          <circle className="energy-node" cx="510" cy="190" r="4" />
          <path className="energy-line energy-wave" pathLength="1" d="M450 222 C482 204 510 240 542 222 S594 210 620 221" />
        </svg>
      </EnergyArtFrame>
    )
  }

  if (type === 'SOLAR') {
    return (
      <EnergyArtFrame type="SOLAR">
        <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
          <circle className="energy-sun" cx="520" cy="52" r="27" />
          <path className="energy-rays" pathLength="1" d="M520 9V1M520 103V95M477 52h-10M573 52h-10M489 21l-8-8M559 91l-8-8M551 21l8-8M481 91l8-8" />
          <text className="energy-svg-label" x="35" y="48">ARRAY / SOUTH ORIENTATION</text>
          <path className="energy-panel" d="M96 86 442 70 495 202 52 224Z" />
          <path className="energy-grid-line" d="M134 84 101 222M204 81 191 217M273 78l7 135M342 75 370 210M410 72 459 205M69 180l410-16M82 133l380-13" />
          <path className="energy-structure" d="M264 216v34M194 252h142" />
          <path className="energy-signal" pathLength="1" d="M337 214C392 226 442 240 505 223V170" />
          <rect className="energy-output" x="490" y="132" width="112" height="58" rx="4" />
          <path className="energy-vector" d="M507 148h78M507 158h52M507 169h66" />
          <text className="energy-svg-label" x="497" y="117">INVERTER / GRID LINK</text>
          <circle className="energy-node" cx="337" cy="214" r="4" />
          <circle className="energy-node" cx="505" cy="223" r="4" />
        </svg>
      </EnergyArtFrame>
    )
  }

  return (
    <EnergyArtFrame type="WIND">
      <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
        <path className="energy-line energy-stream energy-line-soft" pathLength="1" d="M22 66 C116 30 182 91 265 62 S430 42 616 68" />
        <path className="energy-line energy-stream" pathLength="1" d="M22 116 C104 86 164 132 236 112" />
        <path className="energy-line energy-stream energy-line-soft" pathLength="1" d="M408 124 C472 96 532 141 616 112" />
        <text className="energy-svg-label" x="30" y="42">PREVAILING WIND / LIVE</text>
        <path className="energy-structure energy-tower" d="M320 105 302 248M320 105l18 143M286 248h68" />
        <circle className="energy-core" cx="320" cy="96" r="9" />
        <path className="energy-blade" d="M320 87 C303 63 281 35 270 27 C268 45 275 70 313 96M329 98 C359 94 391 88 403 82 C391 72 364 64 324 89M315 104 C301 130 290 159 290 174 C305 166 322 147 324 104" />
        <path className="energy-structure energy-tower energy-tower-small" d="M500 144 489 248M500 144l11 104M478 248h44" />
        <circle className="energy-turbine-small" cx="500" cy="138" r="6" />
        <path className="energy-blade energy-blade-small" d="M500 132 484 109M506 140l27 5M497 144l-11 26" />
        <path className="energy-surface" d="M28 248H616" />
        <path className="energy-signal" pathLength="1" d="M320 248C380 236 432 237 500 248H578" />
        <rect className="energy-output" x="548" y="211" width="60" height="38" rx="3" />
        <path className="energy-vector" d="M559 222h38M559 231h28M559 240h34" />
        <text className="energy-svg-label" x="512" y="197">SITE LINK</text>
        <circle className="energy-node" cx="500" cy="248" r="4" />
      </svg>
    </EnergyArtFrame>
  )
}

function Brand() {
  return (
    <a className="brand" href="/" aria-label="Power Pasture home">
      <span className="brand-mark"><img src={brandLogo} alt="Power Pasture logo" width="384" height="256" decoding="async" /></span>
      <span aria-hidden="true"><b>POWER PASTURE™</b><small>LOCAL ENERGY INFRASTRUCTURE</small></span>
    </a>
  )
}

function InquiryModal({ onClose }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const panelRef = useRef(null)
  const returnFocusRef = useRef(document.activeElement)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        const formspreeMessage = result?.errors?.map(({ message }) => message).filter(Boolean).join(' ')
        throw new Error(
          response.status === 429
            ? 'Too many requests. Please wait a moment and try again.'
            : formspreeMessage || 'We could not send your inquiry. Please try again.',
        )
      }

      setSent(true)
    } catch (error) {
      setSubmitError(error.message || 'We could not send your inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const panel = panelRef.current
    const previousFocus = returnFocusRef.current
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const focusable = [...panel.querySelectorAll(focusableSelector)]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    window.requestAnimationFrame(() => panel?.querySelector(focusableSelector)?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
      previousFocus?.focus?.()
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={sent ? 'inquiry-success-title' : 'inquiry-title'}
        aria-describedby={sent ? 'inquiry-success-copy' : 'inquiry-copy'}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close inquiry dialog"><Icon name="close" /></button>
        <div className="modal-status"><i /> SECURE CHANNEL / OPEN</div>
        {!sent ? (
          <>
            <p className="eyebrow">PROJECT INQUIRY</p>
            <h2 id="inquiry-title">Get your Power Pasture.</h2>
            <p className="modal-copy" id="inquiry-copy">Tell us about your organization and energy needs. We’ll follow up to explore what your site can support.</p>
            <form
              action="https://formspree.io/f/xbgdabkr"
              method="POST"
              onSubmit={handleSubmit}
              aria-busy={submitting}
            >
              <label>NAME<input name="name" required autoComplete="name" placeholder="Your name" /></label>
              <label>WORK EMAIL<input name="email" required type="email" autoComplete="email" placeholder="you@company.com" /></label>
              <label>ORGANIZATION<input name="organization" autoComplete="organization" placeholder="Company or fund" /></label>
              {submitError && <p className="inquiry-error" role="alert">{submitError}</p>}
              <button className="primary-button full" type="submit" disabled={submitting}>
                {submitting ? 'Sending inquiry…' : <>Submit inquiry <Icon name="arrow" /></>}
              </button>
            </form>
          </>
        ) : (
          <div className="success-state" role="status" aria-live="polite">
            <span><Icon name="check" size={28} /></span>
            <p className="eyebrow">INQUIRY RECEIVED</p>
            <h2 id="inquiry-success-title">Thank you.</h2>
            <p id="inquiry-success-copy">We’ll be in touch to discuss your Power Pasture™.</p>
            <button className="text-button" onClick={onClose}>Explore More <Icon name="arrow" /></button>
          </div>
        )}
      </div>
    </div>
  )
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [videoAllowed, setVideoAllowed] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const mobileViewport = window.matchMedia('(max-width: 768px)').matches
    const revealTargets = [...document.querySelectorAll('[data-reveal]')]
    const reveal = new IntersectionObserver(
      (entries, observer) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }),
      mobileViewport
        ? { threshold: 0.025, rootMargin: '0px 0px -4% 0px' }
        : { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    revealTargets.forEach((element) => reveal.observe(element))

    let frame = 0
    let hasScrolled = false

    const tick = () => {
      frame = 0
      const scrollY = window.scrollY
      const nextHasScrolled = scrollY > 30
      if (nextHasScrolled !== hasScrolled) {
        document.body.classList.toggle('has-scrolled', nextHasScrolled)
        hasScrolled = nextHasScrolled
      }
      const pageTravel = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      root.style.setProperty('--page-progress', Math.max(0, Math.min(1, scrollY / pageTravel)))
    }

    const requestTick = () => {
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', requestTick, { passive: true })
    window.addEventListener('resize', requestTick)
    requestTick()
    return () => {
      reveal.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestTick)
      window.removeEventListener('resize', requestTick)
    }
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = navigator.connection
    const updateVideoPreference = () => setVideoAllowed(!motionQuery.matches && !connection?.saveData)
    updateVideoPreference()
    motionQuery.addEventListener('change', updateVideoPreference)
    connection?.addEventListener?.('change', updateVideoPreference)
    return () => {
      motionQuery.removeEventListener('change', updateVideoPreference)
      connection?.removeEventListener?.('change', updateVideoPreference)
    }
  }, [])

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="site-header">
        <Brand />
        <nav id="primary-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <a href="#system" onClick={() => setMenuOpen(false)}>Energy Sources</a>
          <a href="#applications" onClick={() => setMenuOpen(false)}>Applications</a>
        </nav>
        <button className="header-action" onClick={() => setInquiryOpen(true)}>
          <span className="header-action-label"><span>GET YOUR</span><span>POWER PASTURE™</span></span>
          <Icon name="arrow" size={17} />
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        ><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main id="main-content">
        <section className="hero">
          <div className="hero-sticky">
            <div className="hero-visual">
              {videoAllowed ? <video
                className="hero-image hero-video"
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                width="1280"
                height="720"
                onCanPlay={(event) => event.currentTarget.classList.add('is-ready')}
                onError={() => setVideoAllowed(false)}
                aria-hidden="true"
              /> : <img
                className="hero-image hero-poster"
                src={heroImage}
                alt="Power Pasture renewable energy infrastructure distributed across a mountain valley"
                width="960"
                height="540"
              />}
              <div className="hero-tech-frame" aria-hidden="true">
                <i /><i /><i /><i />
              </div>
            </div>
            <div className="hero-video-copy">
              <p className="hero-video-kicker"><span /> Local renewable energy infrastructure</p>
              <h1>Local renewable energy <em>for power-intensive projects.</em></h1>
              <p>Geothermal, hydro, solar, and wind—planned as one site-specific system for data centers, manufacturing, hospitals, and growing communities.</p>
              <a className="hero-video-cta" href="https://main-power-pasture.dylan-226.workers.dev/#system">
                Explore the system <Icon name="arrow" size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="power-index" aria-labelledby="power-index-title">
          <div className="power-index-heading">
            <h2 id="power-index-title">GET YOUR POWER PASTURE™</h2>
            <span>Select an energy source for details and potential</span>
          </div>
          <div className="power-index-grid">
            {[...layers].reverse().map((layer) => (
              <details
                key={layer.id}
                onMouseEnter={(event) => {
                  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) event.currentTarget.open = true
                }}
                onMouseLeave={(event) => {
                  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) event.currentTarget.open = false
                }}
              >
                <summary>
                  <span className="power-index-icon"><Icon name={layer.icon} size={30} /></span>
                  <span><b>{layer.title}</b><small>{layer.potential}</small></span>
                  <span className="power-index-chevron"><Icon name="arrow" size={18} /></span>
                </summary>
                <div className="power-index-detail">
                  <span>WHAT IT IS</span>
                  <p>{layer.copy}</p>
                  <div>
                    <span>ENERGY POTENTIAL</span>
                    <b>{layer.potential}</b>
                    <p>{layer.potentialDetail}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="system-section" id="system">
          <div className="system-stage">
            <div className="section-intro" data-reveal>
              <p className="section-code">01 / BUILD YOUR POWER PASTURE™</p>
              <div><h2>Start with the energy potential <em>already there.</em></h2><p>Every Power Pasture™ begins with the resources and conditions of its location. Choose a source below to see how geothermal, hydro, solar, and wind can work alone or together.</p></div>
            </div>

            <div className="layer-grid">
              {layers.map((layer) => (
                <article className="system-card energy-row" id={`source-${layer.code.toLowerCase()}`} data-reveal data-index={layer.id} key={layer.id}>
                  <div className="layer-top"><span>{layer.id} / {layer.code}</span><span className="layer-icon"><Icon name={layer.icon} size={28} /></span></div>
                  <EnergyArt type={layer.code} />
                  <div className="energy-copy">
                    <p className="energy-role">{layer.stat}</p>
                    <h3>{layer.title}</h3>
                    <p className="energy-lede">{layer.copy}</p>
                    <p className="energy-detail">{layer.detail}</p>
                    <div className="energy-potential"><span>ENERGY POTENTIAL</span><b>{layer.potential}</b></div>
                    <ul aria-label={`${layer.title} characteristics`}>
                      {layer.traits.map((trait) => <li key={trait}>{trait}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="geothermal-section" id="thermal" aria-labelledby="geothermal-title" data-reveal>
          <div className="geothermal-shell">
            <header className="geothermal-copy">
              <p className="geothermal-kicker">The geothermal advantage</p>
              <h2 id="geothermal-title">Available beneath the surface.<br /><em>Built to last.</em></h2>
              <p>Geothermal delivers consistent, around-the-clock energy and thermal capacity—creating a durable foundation for infrastructure that must perform in every season.</p>
              <button className="primary-button large geothermal-cta" onClick={() => setInquiryOpen(true)}>GET YOUR POWER PASTURE <Icon name="arrow" /></button>
            </header>

            <figure className="geothermal-product">
              <img
                src={geothermalImage}
                alt="Containerized data center connected to an underground closed-loop geothermal cooling system"
                width="1448"
                height="1086"
                loading="lazy"
                decoding="async"
              />
              <figcaption><span>Geothermal infrastructure</span><b>01</b></figcaption>
            </figure>

            <div className="geothermal-detail">
              <div className="geothermal-detail-copy">
                <p className="geothermal-kicker">Persistent resource</p>
                <h3>Energy and thermal infrastructure</h3>
                <p>The Earth’s stable subsurface conditions can support efficient year-round operation and a durable foundation for changing technical workloads.</p>
              </div>

              <div className="geothermal-features" aria-label="Geothermal infrastructure benefits">
                <span><i><Icon name="bolt" size={20} /></i><b>Reliable</b><small>Consistent, around-the-clock energy</small></span>
                <span><i><Icon name="thermal" size={20} /></i><b>Efficient</b><small>Maximum value from local resources</small></span>
                <span><i><Icon name="signal" size={20} /></i><b>Enduring</b><small>Infrastructure built for generations</small></span>
              </div>
            </div>
          </div>
        </section>

        <section className="applications-section" id="applications">
          <div className="applications-shell">
            <header className="applications-heading" data-reveal>
              <div>
                <p className="section-code">02 / LIMITLESS APPLICATIONS</p>
                <h2>Limitless<br /><em>applications.</em></h2>
              </div>
              <p>Power Pasture™ delivers the scalable, resilient energy foundation for the infrastructure that powers modern life—from data centers, home developments, hospitals, offices, and shopping centers to advanced manufacturing, cold storage, and heavy industrial operations.</p>
            </header>

            <div className="applications-grid">
              {applications.map((application) => {
                const isLinked = enabledSolutionPages.has(application.path)
                const Card = isLinked ? 'a' : 'article'
                return (
                  <Card className={isLinked ? 'application-card' : undefined} href={isLinked ? application.path : undefined} key={application.id} data-reveal>
                    <span>{application.id}</span>
                    <h3>{application.title}</h3>
                    <p>{application.copy}</p>
                    {isLinked && <b>Explore solution <Icon name="arrow" size={17} /></b>}
                  </Card>
                )
              })}
            </div>

            <div className="applications-footer" data-reveal>
              <span>One adaptable system</span>
              <p>Built to support as many applications as your site demands—today and as it grows.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <Brand />
        <p className="footer-legal">
          <span>© 2026 POWER PASTURE™</span>
          <small>PATENT PENDING</small>
        </p>
        <div><a href="mailto:taylor@powerpasture.com">CONTACT ↗</a><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
    </div>
  )
}

const solutionPages = {
  '/data-centers': {
    slug: 'data-centers',
    index: '01',
    eyebrow: 'Data center energy solutions',
    title: 'Power and thermal infrastructure for data centers.',
    intro: 'Power Pasture™ plans local renewable generation and geothermal thermal capacity around computing demand, cooling needs, site conditions, interconnection constraints, and phased campus growth.',
    seoTitle: 'Renewable Energy Infrastructure for Data Centers | Power Pasture™',
    seoDescription: 'Explore site-specific renewable power and geothermal thermal infrastructure for data centers, including load planning, cooling strategy, and phased capacity growth.',
    signal: ['Continuous demand profile', 'Power + thermal planning', 'Phased campus growth'],
    schematic: ['LOCAL RESOURCES', 'ENERGY + THERMAL', 'DATA CENTER LOAD'],
    sectionKicker: 'Plan the energy system with the campus',
    sectionTitle: 'The infrastructure question starts before the first rack.',
    sectionCopy: 'A data center does not have one energy requirement. It has a power profile, a heat-rejection strategy, a reliability plan, and a growth curve. The Power Pasture™ model brings those decisions into one site-specific planning frame.',
    priorities: [
      { code: '01', title: 'Align supply and load', copy: 'Model the campus demand profile alongside the output characteristics of the renewable resources available at the site.' },
      { code: '02', title: 'Plan power and cooling together', copy: 'Evaluate geothermal energy and thermal exchange as part of the same infrastructure conversation, where subsurface conditions support them.' },
      { code: '03', title: 'Create a path to scale', copy: 'Shape generation, thermal systems, storage, and grid interaction around construction phases instead of treating growth as an afterthought.' },
    ],
    processTitle: 'A site-specific data center energy strategy.',
    processCopy: 'The final configuration depends on resource quality, local permitting, engineering, interconnection, and the facility’s operating requirements.',
    process: [
      { label: 'ASSESS', title: 'Site + load', copy: 'Characterize renewable resources, land, infrastructure, thermal needs, and the expected computing load.' },
      { label: 'DESIGN', title: 'Integrated system', copy: 'Match generation and thermal resources to the site, then define how storage and the grid fit the operating plan.' },
      { label: 'DEPLOY', title: 'Phased capacity', copy: 'Sequence infrastructure around campus development so the energy system can evolve with demand.' },
    ],
    resourceTitle: 'Resources play different roles.',
    resources: [
      { name: 'Geothermal', role: 'Steady energy + thermal potential', copy: 'Can provide dependable generation, subsurface thermal exchange, or both where the geology and project design support it.' },
      { name: 'Hydro', role: 'Dense generation', copy: 'Can contribute high-density and potentially dispatchable output at sites with a suitable water resource.' },
      { name: 'Solar + wind', role: 'Scalable complements', copy: 'Can add modular and complementary production profiles to a broader site energy strategy.' },
    ],
    ctaTitle: 'Start with the campus demand and the site beneath it.',
  },
  '/manufacturing': {
    slug: 'manufacturing',
    index: '02',
    eyebrow: 'Manufacturing energy solutions',
    title: 'Local renewable energy for industrial operations.',
    intro: 'Power Pasture™ brings power, process heat, site resilience, and expansion planning into one renewable infrastructure strategy for manufacturing, cold storage, and industrial facilities.',
    seoTitle: 'Industrial Power Generation: Options, Efficiency and How to Choose | Power Pasture™',
    seoDescription: 'Compare industrial power generation technologies, CHP efficiency, reliability, emissions, cost, and the steps for choosing a site-specific system.',
    signal: ['Power + process heat', 'Operational continuity', 'Industrial expansion'],
    schematic: ['LOCAL RESOURCES', 'POWER + PROCESS HEAT', 'INDUSTRIAL LOAD'],
    sectionKicker: 'Design around the operating process',
    sectionTitle: 'Industrial demand is more than an electric meter.',
    sectionCopy: 'Manufacturing facilities combine continuous and variable loads, thermal processes, equipment constraints, and production schedules. A useful energy strategy begins by understanding how the facility actually operates.',
    priorities: [
      { code: '01', title: 'Map the production profile', copy: 'Connect the facility’s electric and thermal demand to production schedules, critical equipment, and expected expansion.' },
      { code: '02', title: 'Use heat intentionally', copy: 'Evaluate whether geothermal or other site resources can support process heat, thermal exchange, space conditioning, or cold storage.' },
      { code: '03', title: 'Build operational flexibility', copy: 'Combine resources with distinct output profiles so the infrastructure can respond to changing production needs.' },
    ],
    processTitle: 'An energy system shaped around production.',
    processCopy: 'Resource quality, process temperatures, land, permitting, interconnection, and facility requirements determine what a specific site can support.',
    process: [
      { label: 'PROFILE', title: 'Process demand', copy: 'Document electrical loads, temperature requirements, operating windows, and the cost of interruption.' },
      { label: 'MATCH', title: 'Resource roles', copy: 'Assign local resources to the power and thermal jobs they are best positioned to perform.' },
      { label: 'PHASE', title: 'Industrial growth', copy: 'Plan deployment around equipment cycles, new production lines, and future facility expansion.' },
    ],
    resourceTitle: 'Build a diversified site system.',
    resources: [
      { name: 'Geothermal', role: 'Energy + process thermal potential', copy: 'Can support steady generation and useful thermal applications where temperature, geology, and system design align.' },
      { name: 'Hydro', role: 'High-density potential', copy: 'Can provide substantial local generation and possible dispatchability where a viable water resource exists.' },
      { name: 'Solar + wind', role: 'Modular production', copy: 'Can scale across available land and complement other resources as facility demand changes.' },
    ],
    ctaTitle: 'Bring the energy plan closer to the production plan.',
  },
  '/hospitals': {
    slug: 'hospitals',
    index: '03',
    eyebrow: 'Hospital Outpost Node™',
    title: 'A resilient Outpost Node™ for critical care.',
    intro: 'At a hospital campus, Power Pasture™ takes the form of an Outpost Node™—a dedicated local energy installation that coordinates site generation, storage, utility interconnection, and critical-load priorities through a clear, modular architecture.',
    seoTitle: 'Hospital Microgrids: How They Work | Power Pasture™',
    seoDescription: 'Learn how hospital microgrids work, what they deliver, and how Power Pasture™ uses Outpost Node™, Outpost™, Stall™, and HITCH Post™ architecture.',
    signal: ['Critical-load priorities', 'Grid + island operation', 'Modular campus growth'],
    schematic: ['LOCAL ENERGY RESOURCES', 'HITCH POST™', 'HOSPITAL CAMPUS'],
    sectionKicker: 'Power for a critical operating environment',
    sectionTitle: 'Critical care cannot wait for the grid.',
    sectionCopy: 'A hospital combines life-safety systems, clinical loads, ventilation, heating, cooling, hot water, and continuous campus growth. The Outpost Node™ organizes local energy infrastructure around those realities while remaining part of the facility’s wider resilience and compliance strategy.',
    priorities: [
      { code: '01', title: 'Protect the essential', copy: 'Map life-safety, clinical, thermal, and flexible loads so the Outpost Node™ can assign a clear priority to each part of the campus.' },
      { code: '02', title: 'Work every day', copy: 'Use local generation, thermal resources, storage, and the utility as an active operating system—not infrastructure that only wakes up during an outage.' },
      { code: '03', title: 'Expand in place', copy: 'Add capacity as new wings, imaging suites, central-plant equipment, and other campus loads come online.' },
    ],
    architecture: {
      kicker: 'The hospital system, in Power Pasture™ language',
      title: 'One campus. Four defined parts. One connected system.',
      copy: 'The vocabulary makes the physical architecture easy to understand—from the overall deployment down to the fixed point where power is conditioned and routed.',
      terms: [
        { code: '01', name: 'Outpost Node™', role: 'The overall site or deployment location', copy: 'The dedicated, localized microgrid installation serving the hospital campus. A multi-position field is a Power Pasture™; a single-site or hospital-dedicated installation is an Outpost Node™.' },
        { code: '02', name: 'Outpost™', role: 'The relocatable infrastructure unit', copy: 'The physical, relocatable technical module or enclosure that houses microgrid equipment, power distribution, controls, and an optional compute or operational payload.' },
        { code: '03', name: 'Stall™', role: 'The prepared site position', copy: 'The move-in-ready landing position on hospital grounds where an Outpost™ connects to the campus system.' },
        { code: '04', name: 'HITCH Post™', role: 'The fixed power + utility interface', copy: 'The service node assigned to the Stall™ that conditions, controls, and manages generation, storage, and utility interconnection before routing power onward.' },
      ],
      example: 'At Northside Hospital, we deployed an Outpost™ into a single Stall™, anchored by a HITCH Post™ to create a self-sustaining Outpost Node™.',
    },
    processLabel: 'OPERATING SEQUENCE',
    processTitle: 'Designed for normal operation, outages, and the return to grid.',
    processCopy: 'The final sequence, permitted configuration, and supported loads are determined through engineering, utility coordination, commissioning, and approval by the authorities responsible for the facility. The Outpost Node™ complements required emergency power, life-safety systems, and facility-specific continuity planning.',
    process: [
      { label: 'GRID-CONNECTED', title: 'Operate every day', copy: 'The HITCH Post™ coordinates local resources, storage, campus demand, and utility power according to the hospital’s operating plan.' },
      { label: 'ISLAND MODE', title: 'Protect critical loads', copy: 'When utility service is interrupted, the system follows the commissioned transition sequence and directs available energy toward the campus load priorities.' },
      { label: 'RECOVERY', title: 'Return with control', copy: 'After utility service stabilizes and operating checks are complete, the Outpost Node™ follows the approved sequence back to grid-connected operation.' },
    ],
    resourceTitle: 'Feed the Outpost Node™ with the best resources the site can support.',
    resources: [
      { name: 'Geothermal', role: 'Steady energy + thermal foundation', copy: 'Can support year-round thermal exchange and, where the resource and engineering align, dependable generation for campus infrastructure.' },
      { name: 'Solar + storage', role: 'Modular production + time shifting', copy: 'Can add scalable capacity across suitable roofs, parking structures, or nearby land, with storage supporting the campus operating strategy.' },
      { name: 'Hydro + wind', role: 'Site-specific complements', copy: 'Can diversify the local resource mix where water, wind, land, and permitting conditions responsibly support development.' },
    ],
    ctaTitle: 'Build an Outpost Node™ around the realities of your hospital campus.',
  },
  '/geothermal': {
    slug: 'geothermal',
    index: '04',
    eyebrow: 'Geothermal technical deep-dive',
    title: 'One subsurface resource. Two infrastructure roles.',
    intro: 'Depending on local geology and project design, geothermal can provide dependable energy, year-round thermal exchange, or both—creating a long-lived foundation for power-intensive sites.',
    seoTitle: 'Geothermal Energy & Thermal Infrastructure | Power Pasture™',
    seoDescription: 'Learn how Power Pasture evaluates geothermal generation and thermal exchange for data centers, manufacturing, hospitals, and other power-intensive sites.',
    signal: ['Steady resource potential', 'Energy + thermal pathways', 'Long-lived infrastructure'],
    schematic: ['SUBSURFACE RESOURCE', 'EXCHANGE + GENERATION', 'SITE DEMAND'],
    sectionKicker: 'The geothermal advantage',
    sectionTitle: 'Useful energy is not limited to electricity.',
    sectionCopy: 'The subsurface can be evaluated for both generation and direct thermal value. Treating those pathways together can reveal infrastructure options that an electricity-only analysis would miss.',
    priorities: [
      { code: '01', title: 'Electric generation', copy: 'Where temperature, flow, and geology support it, geothermal can contribute steady local power with a compact surface footprint.' },
      { code: '02', title: 'Thermal exchange', copy: 'Ground-source and direct-use systems can move or use heat for cooling, heating, hot water, or industrial processes.' },
      { code: '03', title: 'Combined value', copy: 'Some sites may be able to coordinate electric and thermal pathways as part of one integrated infrastructure plan.' },
    ],
    processTitle: 'Evaluate the resource before defining the system.',
    processCopy: 'Geothermal potential is site-specific. Subsurface data, drilling, engineering, water considerations, permitting, and economics determine the appropriate configuration.',
    process: [
      { label: 'SCREEN', title: 'Regional potential', copy: 'Review existing geology, temperature indicators, land constraints, water considerations, and nearby infrastructure.' },
      { label: 'CHARACTERIZE', title: 'Subsurface resource', copy: 'Use appropriate technical studies to understand temperature, flow, depth, and the project’s uncertainty profile.' },
      { label: 'ENGINEER', title: 'System pathway', copy: 'Match generation, closed-loop exchange, direct use, or a combined approach to the site’s actual demand.' },
    ],
    resourceTitle: 'A platform for different kinds of demand.',
    resources: [
      { name: 'Data centers', role: 'Power + heat rejection', copy: 'Geothermal can be evaluated against continuous computing loads and the campus cooling strategy.' },
      { name: 'Manufacturing', role: 'Power + process heat', copy: 'Suitable resources may support electric demand, useful process temperatures, or thermal exchange.' },
      { name: 'Hospitals', role: 'Year-round campus thermal loads', copy: 'Healthcare campuses can evaluate geothermal alongside central plant, utility, and resilience planning.' },
    ],
    ctaTitle: 'Find out what the resource beneath your site can support.',
  },
}

function useRevealEffects() {
  useEffect(() => {
    const targets = [...document.querySelectorAll('[data-reveal]')]
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
    targets.forEach((target) => observer.observe(target))
    window.scrollTo(0, 0)
    return () => observer.disconnect()
  }, [])
}

function PageSeo({ page }) {
  useEffect(() => {
    document.title = page.seoTitle
    const updateMeta = (selector, content) => document.querySelector(selector)?.setAttribute('content', content)
    updateMeta('meta[name="description"]', page.seoDescription)
    updateMeta('meta[property="og:title"]', page.seoTitle)
    updateMeta('meta[property="og:description"]', page.seoDescription)
    updateMeta('meta[property="og:url"]', `https://powerpasture.com/${page.slug}`)
    updateMeta('meta[name="twitter:title"]', page.seoTitle)
    updateMeta('meta[name="twitter:description"]', page.seoDescription)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://powerpasture.com/${page.slug}`)
  }, [page])
  return null
}

function DemandSchematic({ labels, type }) {
  return (
    <div className={`demand-schematic demand-schematic-${type}`} aria-label={`${labels.join(' to ')} diagram`} role="img">
      <div className="schematic-grid" aria-hidden="true" />
      {labels.map((label, index) => (
        <div className="schematic-stage" key={label}>
          <span>0{index + 1}</span>
          <i>{index === 0
            ? <Icon name="geothermal" size={26} />
            : index === 1
              ? <Icon name={type === 'hospitals' ? 'post' : 'bolt'} size={26} />
              : <Icon name={type === 'hospitals' ? 'hospital' : 'signal'} size={26} />}</i>
          <b>{label}</b>
          {index < labels.length - 1 && <Icon name="arrow" size={20} />}
        </div>
      ))}
      <small>CONCEPTUAL SYSTEM FLOW / FINAL CONFIGURATION IS SITE-SPECIFIC</small>
    </div>
  )
}

function BrandArchitecture({ architecture }) {
  return (
    <section className="solution-architecture" id="architecture" aria-labelledby="architecture-title">
      <header data-reveal>
        <p className="section-code">BRANDED ARCHITECTURE</p>
        <p className="architecture-kicker">{architecture.kicker}</p>
        <h2 id="architecture-title">{architecture.title}</h2>
        <p>{architecture.copy}</p>
      </header>

      <div className="architecture-system" aria-label="Hospital Outpost Node architecture" data-reveal>
        <span>LOCAL RESOURCES</span><Icon name="arrow" size={18} />
        <span>HITCH POST™</span><Icon name="arrow" size={18} />
        <span>OUTPOST™</span><Icon name="arrow" size={18} />
        <span>HOSPITAL CAMPUS</span>
      </div>

      <div className="architecture-grid">
        {architecture.terms.map((term) => (
          <article key={term.code} data-reveal>
            <span>{term.code}</span>
            <small>{term.role}</small>
            <h3>{term.name}</h3>
            <p>{term.copy}</p>
          </article>
        ))}
      </div>

      <blockquote data-reveal>
        <span>IN PRACTICE</span>
        <p>“{architecture.example}”</p>
      </blockquote>
    </section>
  )
}

function HospitalArticlePage({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  useRevealEffects()

  return (
    <div className="site hospital-article-site" id="top">
      <PageSeo page={page} />
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="site-header">
        <Brand />
        <nav id="primary-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <a href="#what-a-hospital-microgrid-is" onClick={() => setMenuOpen(false)}>Overview</a>
          <a href="#architecture" onClick={() => setMenuOpen(false)}>Our architecture</a>
          <a href="#what-documented-projects-and-studies-show" onClick={() => setMenuOpen(false)}>Evidence</a>
          <a href="#how-to-plan-a-hospital-microgrid" onClick={() => setMenuOpen(false)}>Planning</a>
        </nav>
        <button className="header-action" onClick={() => setInquiryOpen(true)}>START A CONVERSATION <Icon name="arrow" size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main id="main-content">
        <article>
          <header className="hospital-article-hero">
            <div className="hospital-article-hero-top" data-reveal>
              <a className="breadcrumb" href="/#applications">Power Pasture™ / Solutions / <span>Hospitals</span></a>
              <p className="solution-kicker"><i /> Hospital resilience / Technical guide</p>
            </div>
            <figure className="hospital-article-hero-image" data-reveal>
              <img src={hospitalImage} alt="Hospital energy plant with microgrid switchgear and generation equipment" width="1280" height="720" />
            </figure>
            <div className="hospital-article-hero-copy" data-reveal>
              <h1>Hospital microgrids: How they work and what they deliver</h1>
              <p>A hospital microgrid is a local energy system—made of generation, storage, and a smart controller—that serves a hospital campus and can disconnect from the utility grid to keep power on during an outage. It does more than a backup generator because it also runs every day to manage cost, emissions, and reliability. This guide explains how it works, what goes into one, what documented projects show, what the approval path looks like, and how to plan one for your site.</p>
            </div>
          </header>

          <div className="hospital-reading-shell hospital-reading-intro">
            <aside className="hospital-toc" aria-label="Table of contents" data-reveal>
              <p>Table of contents</p>
              <ol>
                <li><a href="#what-a-hospital-microgrid-is">What a hospital microgrid is</a></li>
                <li><a href="#architecture">The Power Pasture™ architecture</a></li>
                <li><a href="#how-it-runs">How it runs</a></li>
                <li><a href="#what-goes-into-a-hospital-microgrid">What goes into it</a></li>
                <li><a href="#what-documented-projects-and-studies-show">Projects and studies</a></li>
                <li><a href="#rules-permits-and-approvals">Rules and approvals</a></li>
                <li><a href="#how-to-plan-a-hospital-microgrid">How to plan one</a></li>
                <li><a href="#perspective">Perspective</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#sources">Sources</a></li>
              </ol>
            </aside>

            <div className="hospital-prose">
              <section className="hospital-tldr" aria-labelledby="tldr-title" data-reveal>
                <p className="section-code">THE SHORT VERSION</p>
                <h2 id="tldr-title">TL;DR</h2>
                <ul>
                  <li>A hospital microgrid combines on-site generation, storage, and a controller. It can island from the grid in an outage and works around the clock when the grid is up.</li>
                  <li>Typical building blocks include solar, batteries or thermal storage, combined heat and power, wind, fuel cells, and engine generators.</li>
                  <li>Published projects and studies report savings on utility costs and strong coverage of life-critical loads, with results that depend on site design.</li>
                  <li>Approval runs through regulations, the utility, the building department, and the state health facilities office. Federal rules now allow alternate emergency power sources in many facility types.</li>
                  <li>The best design starts from the local resource mix and the hospital’s load tiers, not from a standard product.</li>
                </ul>
              </section>

              <section id="what-a-hospital-microgrid-is" data-reveal>
                <p className="section-code">01 / DEFINITION</p>
                <h2>What a hospital microgrid is</h2>
                <p>The California Department of Health Care Access and Information (HCAI) describes a microgrid as a self-sufficient energy system serving a discrete footprint, such as a hospital site, using distributed energy resources and often battery storage. It <a href="https://hcai.ca.gov/wp-content/uploads/2021/09/HBSB-Microgrid-White-Paper-FINAL-9.24.2021-A.pdf">can disconnect from the central grid and operate independently</a>.</p>
                <p>Three ideas define it:</p>
                <ol>
                  <li><strong>A clear boundary.</strong> The microgrid serves a defined set of buildings and loads, such as a main hospital, a central plant, and a medical office building.</li>
                  <li><strong>Local resources.</strong> Power is produced close to where it is used, rather than only pulled from distant plants.</li>
                  <li><strong>The ability to island.</strong> When the utility fails, the system separates from it and keeps serving the site.</li>
                </ol>

                <h3>How it differs from conventional backup power</h3>
                <p>A standard backup system waits. Generators start when the grid drops and stay idle the rest of the time. The same HCAI white paper notes that simple backup generators are used only in emergencies, while a microgrid <a href="https://hcai.ca.gov/wp-content/uploads/2021/09/HBSB-Microgrid-White-Paper-FINAL-9.24.2021-A.pdf">operates 24/7/365 managing and supplying energy</a>.</p>
                <p>That daily duty matters for reliability. A system that is exercised and managed every day is one the operator understands well. Backup-only setups have a record that shows the exposure: a 2018 legal and industry review reports that during the 2003 blackout, <a href="https://www.bricker.com/insights/publications/Potential-benefits-of-microgrids-for-hospitals">half of New York City’s 58 hospitals had failures in their backup generators</a>.</p>
                <p>There is an efficiency angle too. The HCAI paper states that as much as 8 to 15 percent of electricity dissipates in transit across the central grid, and that generating power close to the point of use <a href="https://hcai.ca.gov/wp-content/uploads/2021/09/HBSB-Microgrid-White-Paper-FINAL-9.24.2021-A.pdf">overcomes this inefficiency</a>.</p>
              </section>
            </div>
          </div>

          <BrandArchitecture architecture={page.architecture} />

          <div className="hospital-reading-shell hospital-reading-main">
            <div className="hospital-prose">
              <section id="how-it-runs" data-reveal>
                <p className="section-code">02 / OPERATING MODES</p>
                <h2>How it runs: grid-connected and island mode</h2>
                <p>The microgrid controller is the central brain. HCAI compares it to a conductor: it <a href="https://hcai.ca.gov/wp-content/uploads/2021/09/HBSB-Microgrid-White-Paper-FINAL-9.24.2021-A.pdf">manages generators, batteries, and nearby building energy systems</a> and orchestrates them toward goals such as lowest price, cleanest energy, or greatest reliability. In a Power Pasture™ hospital deployment, the HITCH Post™ provides the fixed power and utility interface that conditions, controls, and manages those local resources before power is routed into the Outpost™ and hospital campus.</p>

                <h3>When the utility is available</h3>
                <p>In grid-connected mode, the controller decides each hour where power should come from. According to the same paper, it may buy grid power when prices are low and use solar to charge batteries, then discharge those batteries when grid power is expensive. The hospital gains value every day, not only during emergencies.</p>

                <h3>When the utility goes down</h3>
                <p>When an outage hits, the microgrid disconnects from the central grid and operates independently. HCAI’s advisory guide says the final approval step includes developing a sequence of events for <a href="https://hcai.ca.gov/wp-content/uploads/2025/04/A7_Healthcare_Microgrids_Advisory_Guide-04-08-2025-A.pdf">transitioning from normal operation to island mode and back</a>. That sequence is worth rehearsing with facilities staff because it defines who does what when the lights flicker.</p>
                <p>The controller can also manage power for the hospital’s life-safety emergency power branch, and it prioritizes loads. Research on a modeled hospital microgrid describes tiers of need: high-critical, low-critical, and noncritical loads, with the controller <a href="https://www.nature.com/articles/s41598-026-56638-8">optimizing power flow across those tiers</a>. Operating rooms, ICU equipment, and life-safety systems come first. Lighting in administrative wings and some HVAC zones can be shed when supply is tight.</p>

                <figure className="hospital-editorial-figure hospital-editorial-figure-wide">
                  <img src={outageSequenceImage} alt="Six-step hospital microgrid outage sequence from grid-connected operation through island mode and restoration" width="1280" height="720" loading="lazy" decoding="async" />
                  <figcaption>From normal operation to island mode and restoration: the commissioned sequence keeps critical loads first.</figcaption>
                </figure>
              </section>

              <section id="what-goes-into-a-hospital-microgrid" data-reveal>
                <p className="section-code">03 / SYSTEM COMPONENTS</p>
                <h2>What goes into a hospital microgrid</h2>
                <p>HCAI lists a wide menu of equipment a hospital microgrid can include: solar panels, battery or thermal energy storage, combined heat and power, wind power, fuel cells, and reciprocating engine generators, all <a href="https://hcai.ca.gov/wp-content/uploads/2021/09/HBSB-Microgrid-White-Paper-FINAL-9.24.2021-A.pdf">coordinated by the controller</a>.</p>
                <div className="hospital-table-wrap" role="region" aria-label="Hospital microgrid components" tabIndex="0">
                  <table>
                    <thead><tr><th>Component</th><th>Role in the hospital</th><th>Notes</th></tr></thead>
                    <tbody>
                      <tr><td>Solar PV</td><td>Daytime generation, battery charging</td><td>Rooftops, canopies, nearby land</td></tr>
                      <tr><td>Battery or thermal storage</td><td>Shifts energy in time, bridges outages</td><td>Sizing drives outage endurance</td></tr>
                      <tr><td>Combined heat and power</td><td>Electricity plus heat for sterilization, hot water, space heating</td><td>Suits hospitals’ constant thermal demand</td></tr>
                      <tr><td>Wind</td><td>Added generation where the resource exists</td><td>Site dependent</td></tr>
                      <tr><td>Fuel cells</td><td>Steady, quiet generation</td><td>Often fed by gas or biogas</td></tr>
                      <tr><td>Engine generators</td><td>Firm backup and extended-duration support</td><td>Can stay as a supplement</td></tr>
                      <tr><td>Controller</td><td>Dispatches everything, handles islanding</td><td>The central brain</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>A hospital is an unusually good fit for this mix because it needs power and heat all day and all night. A site that can pair electricity with thermal infrastructure wastes less and relies less on any single source.</p>
              </section>

              <section id="what-documented-projects-and-studies-show" data-reveal>
                <p className="section-code">04 / DOCUMENTED RESULTS</p>
                <h2>What documented projects and studies show</h2>
                <p>Numbers from real projects and peer-reviewed studies give a grounded picture of what to expect. Results vary with climate, tariffs, load, and design, so treat them as examples of what well-designed systems have reported, not guarantees.</p>

                <h3>Cost savings and resilience in the literature</h3>
                <p>A 2026 Scientific Reports study using the National Renewable Energy Laboratory’s REopt platform found net present cost savings of <a href="https://www.nature.com/articles/s41598-026-56638-8">14 percent for the financial optimization scenario</a> and 9 to 14.2 percent across resilience-constrained scenarios, compared with full grid dependence. Adding resilience requirements cost between 0.4 and 2.4 percent of net present cost relative to the financial-only design. In plain terms, in that modeled case, resilience came at a small premium on top of a design that already saved money.</p>
                <p>Two more findings from the same study are useful for planners. Systems designed around summer outages yield higher savings because more solar is available, and a deliberate deep-discharge protocol for the battery during emergencies is crucial for cost-effectiveness.</p>
                <p>A separate 2026 study in PMC, on a resilience-oriented optimization framework combining PV, multi-node battery storage, and medical load prioritization, reports that coordinated storage placement <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12887040/">reduced Energy Not Supplied by 55 to 63 percent</a> versus baseline configurations, while holding at least 95 percent supply to life-critical loads across most simulated outages. It also identifies storage capacity, PV penetration, and outage duration as the dominant factors in resilience.</p>

                <figure className="hospital-editorial-figure hospital-editorial-figure-wide">
                  <img src={outageProbabilityImage} alt="Comparison of outage survival probabilities for an optimized hospital microgrid and a business-as-usual system" width="1280" height="720" loading="lazy" decoding="async" />
                  <figcaption>In the cited South Africa hospital study, the optimized design materially improved the probability of surviving five- and ten-hour outages.</figcaption>
                </figure>

                <p>A 2023 study from the U.S. Department of Energy’s OSTI library looked at a hospital in South Africa. It found that the optimized system could <a href="https://www.osti.gov/biblio/1996404">sustain five-hour outages with probability 1 and ten-hour outages with probability 0.65</a>, against 0.5 and 0.0 in a business-as-usual case. The lesson travels: the duration of outage you want to cover shapes the design and the odds.</p>

                <h3>Projects on the ground</h3>
                <div className="hospital-table-wrap" role="region" aria-label="Documented hospital microgrid projects" tabIndex="0">
                  <table>
                    <thead><tr><th>Project</th><th>Design</th><th>Reported result</th></tr></thead>
                    <tbody>
                      <tr><td><a href="https://www.energizeinnovation.fund/projects/renewable-microgrid-medical-center">Kaiser Permanente Richmond, California</a></td><td>Renewable microgrid with a controller for generation, storage, delivery, and islanding</td><td>Projected savings of nearly 20 percent of baseline utility cost per year; supports life and safety functions for three hours or longer, supplementing existing backup</td></tr>
                      <tr><td><a href="https://www.energizeinnovation.fund/projects/essential-power-support-kaiser-permanente-ontario-medical-center-using-long-duration">Kaiser Permanente Ontario, California</a></td><td>9 MWh, 10-hour flow battery with solar PV and a controller; full permission to operate granted in early 2025</td><td>Up to 4.1 GWh of clean energy a year, with estimated annual savings of $328,000 or $9.84 million over the system’s lifetime</td></tr>
                      <tr><td><a href="https://www.gundersenhealth.org/our-system/sustainability/renewable-energy/microgrid">Gundersen Health System, Onalaska, Wisconsin</a></td><td>New backup energy storage combined with existing solar panels and a landfill gas-to-energy project</td><td>Aims to be one of the first 100 percent resilient and renewable energy healthcare campuses in the U.S.</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>Notice the pattern. Each project works from what the site already has: rooftop space, a nearby landfill gas source, an existing backup plant. That is the heart of good microgrid design.</p>
              </section>

              <section id="rules-permits-and-approvals" data-reveal>
                <p className="section-code">05 / COMPLIANCE PATH</p>
                <h2>Rules, permits and approvals</h2>
                <p>Hospitals are among the most regulated buildings in the country, so the approval path deserves planning from day one.</p>

                <h3>Federal flexibility on emergency power</h3>
                <p>The Centers for Medicare &amp; Medicaid Services issued a categorical waiver allowing new and existing health care facilities to use <a href="https://www.cms.gov/files/document/qso-23-11-lsc.pdf">alternate sources of power other than a generator set or battery system</a>, in accordance with the 2021 edition of NFPA 99 and the 2023 edition of NFPA 70. There is one exception. Nursing homes that use life support systems must still provide an emergency generator under 42 CFR §483.90(c)(2), and other sources are not permitted for that purpose in those facilities.</p>

                <h3>The California process as a model</h3>
                <p>California has published the most detailed public roadmap. The HCAI Healthcare Microgrids Advisory Guide (April 2025) lays out five steps:</p>
                <ol>
                  <li>Review the relevant regulations, standards, and Title 24 requirements.</li>
                  <li>Make initial contact with the California Air Resources Board, the local utility, the local building department, and the state hospital building office.</li>
                  <li>Submit plans and obtain all approvals needed for permitting.</li>
                  <li>Construct and commission the system.</li>
                  <li>Receive final approval, including a documented sequence for moving between normal operation and island mode.</li>
                </ol>
                <p>The full process is in the <a href="https://hcai.ca.gov/wp-content/uploads/2025/04/A7_Healthcare_Microgrids_Advisory_Guide-04-08-2025-A.pdf">HCAI advisory guide</a>. Requirements outside California differ by state and utility, so confirm local rules with your authority having jurisdiction early. The Richmond project page also notes that the work helps inform the discussion on diesel backup requirements for healthcare facilities, and that regulators and developers are <a href="https://www.energizeinnovation.fund/projects/renewable-microgrid-medical-center">forging new methods and standards</a> for resilient, autonomous critical facilities. The rules are moving in a favorable direction.</p>
              </section>

              <section id="how-to-plan-a-hospital-microgrid" data-reveal>
                <p className="section-code">06 / PLANNING SEQUENCE</p>
                <h2>How to plan a hospital microgrid</h2>
                <p>A workable plan follows a clear order. Skipping steps is where projects stall.</p>
                <ol className="hospital-planning-list">
                  <li><strong>Map the loads.</strong> Sort them into life-critical, low-critical, and noncritical tiers. Record peak and average demand, plus thermal demand for heating, hot water, and sterilization.</li>
                  <li><strong>Set the outage target.</strong> Decide how many hours or days of islanded operation the campus needs. Studies show that outage duration, storage size, and solar share drive resilience most.</li>
                  <li><strong>Inventory local resources.</strong> Check roof and land area for solar, wind exposure, nearby water flow or heat sources, and any biogas. Existing assets such as a central plant or backup units can stay in the design.</li>
                  <li><strong>Choose the mix.</strong> Pair resources so they cover each other’s gaps: solar by day, steady sources overnight, storage between.</li>
                  <li><strong>Define the control strategy.</strong> Decide what the controller optimizes day to day, how it prioritizes loads in an outage, and how batteries are discharged in an emergency.</li>
                  <li><strong>Engage regulators and the utility early.</strong> Interconnection and facility approvals set the schedule more than construction does.</li>
                  <li><strong>Commission and rehearse.</strong> Test the transition to island mode and back with facilities and clinical leadership.</li>
                </ol>
              </section>

              <section id="perspective" data-reveal>
                <p className="section-code">07 / POWER PASTURE™ PERSPECTIVE</p>
                <h2>Perspective</h2>
                <blockquote className="hospital-perspective">
                  <p>Most hospital microgrid conversations start with a battery and a generator. We start with the site. Every campus sits on a different set of local resources, and the strongest systems are the ones built around them.</p>
                  <p>At Power Pasture™ we design site-specific systems that pair geothermal, hydro, solar, and wind according to what is actually available near the hospital. Our approach is meant to deliver stable, 24/7 operation, because a hospital cannot ask the sun or the wind to keep a schedule. Steady sources carry the base load, variable sources add volume, and the HITCH Post™ ties it together with the thermal infrastructure the campus already needs.</p>
                  <p>We also believe in modular scaling. A hospital grows: a new wing, a new imaging suite, a new central plant. An Outpost Node™ that can grow in steps with the campus protects the original investment and keeps reliability intact as demand rises.</p>
                  <p>The projects above show that regulators, utilities, and health systems are now comfortable with renewable-led resilience. The next step is fitting that resilience to each place, and that is the work we do.</p>
                  <cite>— Dylan</cite>
                </blockquote>
              </section>

              <section id="work-with-power-pasture" className="hospital-work-with" data-reveal>
                <p className="section-code">YOUR SITE / YOUR OUTPOST NODE™</p>
                <h2>Work with Power Pasture™ on your site</h2>
                <p>If you operate a hospital or a power-intensive campus, we design and implement custom renewable energy infrastructure that combines geothermal, hydro, solar, and wind into a system suited to your local conditions. Our focus is high-density, dispatchable generation with stable 24/7 operation, scaled in modules as your needs grow, and integrated with thermal infrastructure.</p>
                <p>To discuss how a site-specific system could fit your facility, see our <a href="https://powerpasture.com">local renewable energy infrastructure</a> offer. Pricing is project-based and depends on your site, so the starting point is a conversation about your loads and local resources.</p>
                <button className="primary-button" onClick={() => setInquiryOpen(true)}>Discuss your hospital site <Icon name="arrow" size={18} /></button>
              </section>

              <section id="faq" data-reveal>
                <p className="section-code">08 / COMMON QUESTIONS</p>
                <h2>FAQ</h2>
                <div className="hospital-faq">
                  <details><summary>Is a hospital microgrid the same as a backup generator?</summary><p>No. A backup generator sits idle until an outage. A microgrid is a managed system of generation, storage, and controls that runs all the time and can island from the grid when needed. A generator can still be one of its components.</p></details>
                  <details><summary>What can power a hospital microgrid?</summary><p>Per the California HCAI white paper, options include solar, battery or thermal storage, combined heat and power, wind, fuel cells, and engine generators. The right mix depends on the resources near your site and on your outage target. Controllers coordinate these sources and prioritize critical loads.</p></details>
                  <details><summary>Can a hospital microgrid save money?</summary><p>Published work suggests it can. A 2026 modeling study reported net present cost savings of 9 to 14.2 percent in resilience-constrained designs versus full grid dependence, and the Kaiser Permanente Richmond project projects nearly 20 percent savings on baseline utility cost. Actual results depend on tariffs, load, and design.</p></details>
                  <details><summary>Do federal rules allow sources other than generators for emergency power?</summary><p>In many facility types, yes. A 2023 CMS categorical waiver permits alternate emergency power sources in line with NFPA 99 (2021) and NFPA 70 (2023). Nursing homes using life support systems are the exception and must keep an emergency generator.</p></details>
                  <details><summary>How long does a hospital microgrid take to approve?</summary><p>It varies by state, utility, and project size. The path generally runs through regulatory review, early contact with the utility and building authorities, plan approval, construction and commissioning, and final approval. Start those conversations first, since they often set the timeline.</p></details>
                </div>
              </section>

              <section id="sources" className="hospital-sources" data-reveal>
                <p className="section-code">09 / REFERENCES</p>
                <h2>Sources</h2>
                <ul>
                  <li><a href="https://hcai.ca.gov/wp-content/uploads/2021/09/HBSB-Microgrid-White-Paper-FINAL-9.24.2021-A.pdf">Microgrids for Healthcare Facilities, California HCAI white paper (2021)</a></li>
                  <li><a href="https://hcai.ca.gov/wp-content/uploads/2025/04/A7_Healthcare_Microgrids_Advisory_Guide-04-08-2025-A.pdf">Healthcare Microgrids Advisory Guide, California HCAI (2025)</a></li>
                  <li><a href="https://www.bricker.com/insights/publications/Potential-benefits-of-microgrids-for-hospitals">Potential benefits of microgrids for hospitals, Bricker (2018)</a></li>
                  <li><a href="https://www.nature.com/articles/s41598-026-56638-8">Techno-economic analysis and resilience enhancement of a hospital microgrid, Scientific Reports (2026)</a></li>
                  <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12887040/">Resilience-oriented optimization of hospital microgrids, PMC (2026)</a></li>
                  <li><a href="https://www.osti.gov/biblio/1996404">Optimizing design and dispatch of a resilient renewable hospital microgrid, OSTI (2023)</a></li>
                  <li><a href="https://www.energizeinnovation.fund/projects/renewable-microgrid-medical-center">Renewable Microgrid for a Medical Center, CEC Energize Innovation Fund</a></li>
                  <li><a href="https://www.energizeinnovation.fund/projects/essential-power-support-kaiser-permanente-ontario-medical-center-using-long-duration">Essential Power Support for Kaiser Permanente Ontario Medical Center, CEC Energize Innovation Fund</a></li>
                  <li><a href="https://www.gundersenhealth.org/our-system/sustainability/renewable-energy/microgrid">Microgrid Technology, Gundersen Sustainability</a></li>
                  <li><a href="https://www.cms.gov/files/document/qso-23-11-lsc.pdf">CMS QSO-23-11-LSC categorical waiver (2023)</a></li>
                </ul>
              </section>
            </div>
          </div>
        </article>
      </main>

      <footer>
        <Brand />
        <p className="footer-legal"><span>© 2026 POWER PASTURE™</span><small>PATENT PENDING</small></p>
        <div><a href="mailto:taylor@powerpasture.com">CONTACT ↗</a><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
    </div>
  )
}

function IndustrialArticlePage({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  useRevealEffects()

  return (
    <div className="site hospital-article-site industrial-article-site" id="top">
      <PageSeo page={page} />
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="site-header">
        <Brand />
        <nav id="primary-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <a href="#what-industrial-power-generation-means" onClick={() => setMenuOpen(false)}>Overview</a>
          <a href="#generation-technologies" onClick={() => setMenuOpen(false)}>Technologies</a>
          <a href="#designing-for-reliability" onClick={() => setMenuOpen(false)}>Reliability</a>
          <a href="#how-to-choose" onClick={() => setMenuOpen(false)}>How to choose</a>
        </nav>
        <button className="header-action" onClick={() => setInquiryOpen(true)}>START A CONVERSATION <Icon name="arrow" size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main id="main-content">
        <article>
          <header className="hospital-article-hero">
            <div className="hospital-article-hero-top" data-reveal>
              <a className="breadcrumb" href="/#applications">Power Pasture™ / Solutions / <span>Manufacturing &amp; industrial</span></a>
              <p className="solution-kicker"><i /> Industrial energy / Technical guide</p>
            </div>
            <figure className="hospital-article-hero-image industrial-article-hero-image" data-reveal>
              <img src={industrialHeroImage} alt="Solar array, wind turbines, and an electrical substation at an industrial site" width="1280" height="720" />
            </figure>
            <div className="hospital-article-hero-copy" data-reveal>
              <h1>Industrial power generation: Options, efficiency and how to choose</h1>
              <p>Industrial power generation is electricity produced for a facility’s own use, at or near the site, instead of being bought only from the grid. The right system depends on the load, available fuel and natural resources, useful heat demand, reliability requirements, and the real cost of an outage.</p>
            </div>
          </header>

          <div className="hospital-reading-shell hospital-reading-intro">
            <aside className="hospital-toc" aria-label="Table of contents" data-reveal>
              <p>Table of contents</p>
              <ol>
                <li><a href="#what-industrial-power-generation-means">What industrial generation means</a></li>
                <li><a href="#on-site-versus-grid">On-site versus the grid</a></li>
                <li><a href="#generation-technologies">Technologies side by side</a></li>
                <li><a href="#combined-heat-and-power">Combined heat and power</a></li>
                <li><a href="#designing-for-reliability">Designing for reliability</a></li>
                <li><a href="#emissions-and-cost">Emissions and cost</a></li>
                <li><a href="#how-to-choose">How to choose a system</a></li>
                <li><a href="#matching-the-sector">Matching the sector</a></li>
                <li><a href="#where-power-pasture-fits">Where Power Pasture™ fits</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#sources">Sources</a></li>
              </ol>
            </aside>

            <div className="hospital-prose">
              <section className="hospital-tldr" aria-labelledby="industrial-tldr-title" data-reveal>
                <p className="section-code">THE SHORT VERSION</p>
                <h2 id="industrial-tldr-title">TL;DR</h2>
                <ul>
                  <li>Industrial power generation produces electricity—and often useful heat—at or near the facility that uses it.</li>
                  <li>Combined heat and power can exceed 80 percent total system efficiency, compared with about 50 percent for typical separate heat and power.</li>
                  <li>Gas turbines and combined-cycle systems suit large loads; engines, microturbines, and fuel cells serve smaller or modular loads.</li>
                  <li>Wind, solar, geothermal, and battery storage are generally the lowest-emission options. Strong systems pair a low-cost primary source with dependable backup.</li>
                  <li>Choose from the load profile, reliability needs, local resources, emissions targets, and lifetime cost—not from technology alone.</li>
                </ul>
              </section>

              <section id="what-industrial-power-generation-means" data-reveal>
                <p className="section-code">01 / DEFINITION</p>
                <h2>What industrial power generation actually means</h2>
                <p>The term covers more than a generator running a factory floor. At its broadest, it is an engineered power system serving a plant, hospital campus, data center, cold-storage operation, or other power-intensive facility.</p>
                <p>The IEEE Technology Navigator <a href="https://technav.ieee.org/topic/industrial-power-systems/">describes industrial power systems</a> as the electrical distribution and generation infrastructure that supplies, conditions, and manages power inside manufacturing plants, processing facilities, and large commercial buildings. That includes switchgear, transformers, protective relays, power-factor correction, harmonic mitigation, and on-site generation—from standby units to cogeneration plants.</p>
                <p>Industrial power generation therefore asks two connected questions: where does the electricity come from, and how is it delivered and protected once it is inside the facility’s fence?</p>
              </section>

              <section id="on-site-versus-grid" data-reveal>
                <p className="section-code">02 / POINT OF USE</p>
                <h2>On-site generation versus the grid</h2>
                <p>Central-station plants send power over long transmission lines. On-site generation sits at the point of use. The U.S. Department of Energy calls combined heat and power <a href="https://www.energy.gov/cmei/ito/combined-heat-and-power-basics">a type of distributed generation</a> located at or near where the energy is consumed.</p>
                <p>Most industrial sites still lean on the grid. The U.S. Energy Information Administration notes that <a href="https://www.eia.gov/TODAYINENERGY/detail.php?id=16331">most electricity used at industrial facilities</a> comes from grid purchases, though many facilities add their own equipment for resilience and operational value.</p>
                <p>The practical difference comes down to three things:</p>
                <ul>
                  <li><strong>Losses.</strong> Power made on site avoids transmission and distribution losses.</li>
                  <li><strong>Heat.</strong> A facility next to the generator can put waste heat to work. A distant plant cannot.</li>
                  <li><strong>Control.</strong> The operator decides how the system is configured, fueled, protected, and backed up.</li>
                </ul>
              </section>
            </div>
          </div>

          <div className="hospital-reading-shell hospital-reading-main">
            <div className="hospital-prose">
              <section id="generation-technologies" data-reveal>
                <p className="section-code">03 / TECHNOLOGY OPTIONS</p>
                <h2>The main technologies, side by side</h2>
                <p>No single technology wins everywhere. Capacity, load shape, fuel availability, thermal demand, emissions requirements, and required response time all change the answer.</p>
                <div className="hospital-table-wrap" role="region" aria-label="Industrial generation technology comparison" tabIndex="0">
                  <table>
                    <thead><tr><th>Technology</th><th>Typical role</th><th>Electrical efficiency</th><th>Notes</th></tr></thead>
                    <tbody>
                      <tr><td>Reciprocating engines</td><td>Small to mid-size prime power and CHP</td><td>27–38%</td><td>Modular and responsive</td></tr>
                      <tr><td>Microturbines</td><td>Small CHP and modular loads</td><td>15–32%</td><td>Compact packages</td></tr>
                      <tr><td>Fuel cells</td><td>Clean, quiet, steady loads</td><td>40–57%</td><td>Strong electrical efficiency</td></tr>
                      <tr><td>Gas-fired steam turbines</td><td>Steam-heavy sites</td><td>30–40% thermal</td><td>Rankine cycle</td></tr>
                      <tr><td>Combined-cycle gas turbines</td><td>Large primary and hybrid power</td><td>55–60% thermal</td><td>High efficiency and scalable output</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>The engine, microturbine, and fuel-cell figures come from the Department of Energy’s <a href="https://www.energy.gov/sites/prod/files/2013/11/f4/micropower_market_assessment.pdf">Industrial Applications for Micropower</a> assessment. The source is from 1999, so the efficiency ranges remain useful for comparison while its historical equipment costs should not be treated as current quotes.</p>
                <p>The steam and combined-cycle ranges come from the University of Texas at Arlington’s open textbook chapter on <a href="https://uta.pressbooks.pub/poweringlargeloads/chapter/5-natural-gas-generators/">natural-gas generators</a>. It identifies gas turbines and combined-cycle generators as strong candidates for large primary and hybrid applications because of their efficiency and scalability.</p>
              </section>

              <section id="combined-heat-and-power" data-reveal>
                <p className="section-code">04 / USEFUL HEAT</p>
                <h2>Combined heat and power: More from every unit of fuel</h2>
                <p>Conventional generation throws away a large share of its input as heat. The EPA’s Catalog of CHP Technologies says that in conventional separate generation, <a href="https://www.epa.gov/sites/default/files/2015-07/documents/catalog_of_chp_technologies.pdf">nearly two-thirds of energy is wasted</a> as heat discharged to the atmosphere. CHP can reach total system efficiency above 80 percent, compared with about 50 percent for typical separate heat and power.</p>
                <p>The Department of Energy gives a more conservative <a href="https://www.energy.gov/cmei/ito/combined-heat-and-power-basics">expected CHP efficiency of 65 to 75 percent</a>. The real number depends on the equipment and how much recovered heat the facility can put to work.</p>
                <figure className="hospital-editorial-figure hospital-editorial-figure-wide">
                  <img src={industrialEfficiencyImage} alt="Efficiency comparison between separate heat and power generation and combined heat and power" width="1280" height="720" loading="lazy" decoding="async" />
                  <figcaption>Separate generation loses useful heat. CHP captures it for on-site heating, cooling, process demand, or additional electricity.</figcaption>
                </figure>
                <p>CHP pays off most where there is steady, year-round demand for both power and heat or steam: food processing, chemicals, paper, hospitals, and campuses. If useful heat demand is intermittent, much of the efficiency advantage shrinks.</p>
              </section>

              <section id="designing-for-reliability" data-reveal>
                <p className="section-code">05 / CONTINUITY</p>
                <h2>Designing for reliability</h2>
                <p>For a continuous-process plant, cold-storage facility, hospital, or data center, generating power is only half the problem. The other half is keeping it on.</p>
                <p>The IEEE Technology Navigator notes that critical production processes may receive <a href="https://technav.ieee.org/topic/industrial-power-systems/">duplicate feeds with automatic transfer switches</a> to maintain continuity during a utility disturbance or equipment failure. Reliability-centered design puts a number on what an hour of downtime costs, then adds redundancy until the next increment costs more than the risk it removes.</p>
                <figure className="hospital-editorial-figure hospital-editorial-figure-wide">
                  <img src={industrialInteriorImage} alt="Rows of industrial electrical switchgear and control cabinets inside a power room" width="1280" height="720" loading="lazy" decoding="async" />
                  <figcaption>Generation, switchgear, protection, duplicate feeds, and transfer equipment work as one reliability system.</figcaption>
                </figure>
                <p>Maintenance belongs in the calculation. The UK government’s CHP guide says engine and gas-turbine CHP units <a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/961492/Part_2_CHP_Technologies_BEIS_v03.pdf">need inspection and maintenance at least once a year</a>. If a facility cannot accept a planned shutdown, a second unit or source must carry the load while the first is serviced.</p>
              </section>

              <section id="emissions-and-cost" data-reveal>
                <p className="section-code">06 / LIFETIME VALUE</p>
                <h2>Emissions and cost: How the options compare</h2>
                <p>The UTA <a href="https://uta.pressbooks.pub/poweringlargeloads/chapter/chapter-12-comparative-analysis/">comparison of generation options</a> finds wind, solar, geothermal, and battery energy storage generally among the lowest-emission solutions, while diesel produces the highest pollutant levels.</p>
                <p>On unsubsidized energy cost, its analysis places wind and solar at the low end, followed by natural gas. But the most important conclusion for an industrial buyer is not a single winner. Strong strategies pair a primary source with low levelized energy cost with a dependable solution for backup and peak demand. The best mix changes with the resources, tariffs, and operating needs of each location.</p>
                <blockquote className="hospital-perspective">
                  <p>Industrial power generation goes wrong when a facility picks a technology first and studies the site second. The load, land, water, heat, subsurface, and weather are different at every location, so a single catalog answer will usually be oversized, underused, or fragile.</p>
                  <p>Our approach starts from the site. We look at which geothermal, hydro, solar, and wind resources are actually present, then pair them into a system designed around the facility’s demand. Where heat matters, we plan the thermal and electrical infrastructure together.</p>
                  <p>The best power plant for your facility is the one designed around your site and your load.</p>
                  <cite>— Dylan</cite>
                </blockquote>
              </section>

              <section id="how-to-choose" data-reveal>
                <p className="section-code">07 / DECISION SEQUENCE</p>
                <h2>How to choose a system for your facility</h2>
                <p>Work through the criteria in order. Each decision narrows the field.</p>
                <ol className="hospital-planning-list">
                  <li><strong>Profile the load.</strong> Record peak demand, average demand, and hourly and seasonal swings. Flat 24/7 loads favor steady sources; spiky loads need fast capacity or storage.</li>
                  <li><strong>Put a price on downtime.</strong> Calculate what an interruption costs per hour and how much redundancy that exposure justifies.</li>
                  <li><strong>Map the heat demand.</strong> If the site needs steam, hot water, cooling, or process heat year-round, integrated thermal design can raise total efficiency.</li>
                  <li><strong>Inventory local resources.</strong> Assess sun, wind, flowing water, geothermal potential, fuel supply, land, and interconnection conditions.</li>
                  <li><strong>Set emissions and regulatory targets.</strong> Identify air permits, local rules, utility requirements, and corporate commitments early.</li>
                  <li><strong>Compare lifetime cost.</strong> Include fuel, planned maintenance, redundancy, interconnection, storage, and the cost of the backup tier.</li>
                  <li><strong>Plan for growth.</strong> Use a modular design that can add capacity without replacing the original system.</li>
                </ol>
              </section>

              <section id="matching-the-sector" data-reveal>
                <p className="section-code">08 / APPLICATION FIT</p>
                <h2>Matching the system to your sector</h2>
                <h3>Data centers</h3>
                <p>The load is high, flat, and intolerant of interruption. Prime power from firm sources, redundancy, and fast transfer matter more than headline efficiency. Heat recovery can add value where a nearby process or district system can use it.</p>
                <h3>Manufacturing</h3>
                <p>Many plants combine a large electrical load with continuous heat or steam demand—the textbook case for CHP or integrated renewable thermal design. Process continuity drives the redundancy plan.</p>
                <h3>Hospitals</h3>
                <p>Continuous power is non-negotiable, and hospitals use heat, hot water, and cooling year-round. That combination suits integrated electrical and thermal systems with duplicate supply paths.</p>
                <h3>Growing communities and developments</h3>
                <p>Demand grows in phases. Modular generation that scales with each phase avoids stranded capital and lets a development add capacity as it adds buildings.</p>
              </section>

              <section id="where-power-pasture-fits" className="hospital-work-with" data-reveal>
                <p className="section-code">09 / SITE-SPECIFIC INFRASTRUCTURE</p>
                <h2>Where Power Pasture™ fits</h2>
                <p>We design and implement custom renewable energy infrastructure for power-intensive users, including data centers, manufacturing facilities, hospitals, and commercial and residential developments. Our systems combine geothermal, hydro, solar, and wind according to local resource availability, with modular scaling, dense and dispatchable generation, and stable 24/7 operation as design goals.</p>
                <figure className="hospital-editorial-figure industrial-power-pasture-figure">
                  <img src={powerPastureImage} alt="Power Pasture system diagram connecting geothermal, hydro, solar, and wind resources" width="1920" height="1080" loading="lazy" decoding="async" />
                  <figcaption>One site-specific system, planned from the local resource base through the facility load.</figcaption>
                </figure>
                <p>Tell us about your load, location, heat demand, and reliability requirements. Project scope and pricing are set per site, so the work begins with the facility and the resources around it.</p>
                <button className="primary-button" onClick={() => setInquiryOpen(true)}>Discuss your industrial site <Icon name="arrow" size={18} /></button>
              </section>

              <section id="faq" data-reveal>
                <p className="section-code">10 / COMMON QUESTIONS</p>
                <h2>FAQ</h2>
                <div className="hospital-faq">
                  <details><summary>What is the difference between industrial and utility generation?</summary><p>Utility plants are centrally located and deliver power over transmission and distribution networks. Industrial generation sits at or near the facility that uses the power, which can avoid network losses, recover useful heat, and support a site-specific reliability design.</p></details>
                  <details><summary>Is combined heat and power the same as cogeneration?</summary><p>Yes. Both terms describe the concurrent production of electricity or mechanical power and useful thermal energy from a single energy source. The approach works best where demand for both electricity and heat is steady.</p></details>
                  <details><summary>Which industrial generation technology is most efficient?</summary><p>It depends on the measure. Combined-cycle gas turbines reach about 55 to 60 percent thermal efficiency, while fuel cells reach 40 to 57 percent electrical efficiency in the cited DOE data. When useful heat is recovered, engines, microturbines, and fuel cells can reach roughly 80 to 85 percent overall efficiency.</p></details>
                  <details><summary>Can renewable energy provide reliable industrial power?</summary><p>Yes, when the resources are designed as a system. Firm sources such as geothermal and hydro can carry steady demand where available, while solar and wind add low-emission energy and storage or dispatchable capacity covers gaps.</p></details>
                  <details><summary>How often does an on-site generator need maintenance?</summary><p>The cited UK CHP guide says engine and gas-turbine CHP units need inspection and maintenance at least once a year. A facility that cannot accept the shutdown should include redundancy so another unit or source carries the load.</p></details>
                </div>
              </section>

              <section id="sources" className="hospital-sources" data-reveal>
                <p className="section-code">11 / REFERENCES</p>
                <h2>Sources</h2>
                <ul>
                  <li><a href="https://www.energy.gov/cmei/ito/combined-heat-and-power-basics">Combined Heat and Power Basics, U.S. Department of Energy</a></li>
                  <li><a href="https://www.epa.gov/sites/default/files/2015-07/documents/combined_heat_and_power_frequently_asked_questions.pdf">Combined Heat and Power: Frequently Asked Questions, U.S. EPA</a></li>
                  <li><a href="https://www.epa.gov/sites/default/files/2015-07/documents/catalog_of_chp_technologies.pdf">Catalog of CHP Technologies, U.S. EPA</a></li>
                  <li><a href="https://www.eia.gov/TODAYINENERGY/detail.php?id=8550">Industrial onsite generation increasingly relies on natural gas, U.S. EIA</a></li>
                  <li><a href="https://www.eia.gov/TODAYINENERGY/detail.php?id=16331">Industrial facilities get most of their electricity from the grid, U.S. EIA</a></li>
                  <li><a href="https://www.eia.gov/todayinenergy/detail.php?id=8250">Combined heat and power technology fills an important energy niche, U.S. EIA</a></li>
                  <li><a href="https://technav.ieee.org/topic/industrial-power-systems/">Industrial power systems, IEEE Technology Navigator</a></li>
                  <li><a href="https://uta.pressbooks.pub/poweringlargeloads/chapter/5-natural-gas-generators/">Natural Gas Generators, Powering Large Loads, UTA Pressbooks</a></li>
                  <li><a href="https://uta.pressbooks.pub/poweringlargeloads/chapter/chapter-12-comparative-analysis/">Comparative Analysis, Powering Large Loads, UTA Pressbooks</a></li>
                  <li><a href="https://www.energy.gov/sites/prod/files/2013/11/f4/micropower_market_assessment.pdf">Industrial Applications for Micropower: A Market Assessment, U.S. DOE</a></li>
                  <li><a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/961492/Part_2_CHP_Technologies_BEIS_v03.pdf">CHP Technologies guide, UK Government</a></li>
                  <li><a href="https://egsa.org/Publications/OnSite-Power-Generation-Book">On-Site Power Generation, Electrical Generating Systems Association</a></li>
                </ul>
              </section>
            </div>
          </div>
        </article>
      </main>

      <footer>
        <Brand />
        <p className="footer-legal"><span>© 2026 POWER PASTURE™</span><small>PATENT PENDING</small></p>
        <div><a href="mailto:taylor@powerpasture.com">CONTACT ↗</a><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
    </div>
  )
}

function DetailPage({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  useRevealEffects()

  return (
    <div className={`site solution-site solution-${page.slug}`} id="top">
      <PageSeo page={page} />
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="site-header">
        <Brand />
        <nav id="primary-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          {page.architecture ? <>
            <a href="/#system" onClick={() => setMenuOpen(false)}>Energy Sources</a>
            <a href="#architecture" onClick={() => setMenuOpen(false)}>Outpost Node</a>
            <a href="#operations" onClick={() => setMenuOpen(false)}>Operations</a>
          </> : <>
            <a href="/#system" onClick={() => setMenuOpen(false)}>Energy Sources</a>
            <a href="/#applications" onClick={() => setMenuOpen(false)}>Solutions</a>
            <a href="/geothermal" onClick={() => setMenuOpen(false)}>Geothermal</a>
          </>}
        </nav>
        <button className="header-action" onClick={() => setInquiryOpen(true)}>START A CONVERSATION <Icon name="arrow" size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main id="main-content">
        <section className="solution-hero">
          <div className="solution-hero-copy" data-reveal>
            <a className="breadcrumb" href="/#applications">Power Pasture™ / Solutions / <span>{page.eyebrow}</span></a>
            <p className="solution-kicker"><i /> {page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="solution-lede">{page.intro}</p>
            <button className="primary-button" onClick={() => setInquiryOpen(true)}>Discuss your site <Icon name="arrow" size={18} /></button>
          </div>
          <div className="solution-hero-visual" data-reveal>
            {page.slug === 'geothermal' ? (
              <figure className="geothermal-detail-image">
                <img src={geothermalImage} alt="Concept illustration of infrastructure connected to a subsurface geothermal loop" width="1448" height="1086" />
                <figcaption>GEOTHERMAL / ENERGY + THERMAL INFRASTRUCTURE</figcaption>
              </figure>
            ) : <DemandSchematic labels={page.schematic} type={page.slug} />}
          </div>
          <div className="solution-signals" aria-label="Planning priorities">
            {page.signal.map((item, index) => <span key={item}><small>0{index + 1}</small>{item}</span>)}
          </div>
        </section>

        <section className="solution-priorities" aria-labelledby={`${page.slug}-priorities`}>
          <header data-reveal>
            <p className="section-code">{page.index} / {page.sectionKicker}</p>
            <h2 id={`${page.slug}-priorities`}>{page.sectionTitle}</h2>
            <p>{page.sectionCopy}</p>
          </header>
          <div className="priority-grid">
            {page.priorities.map((priority) => (
              <article key={priority.code} data-reveal>
                <span>{priority.code}</span>
                <h3>{priority.title}</h3>
                <p>{priority.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {page.architecture && <BrandArchitecture architecture={page.architecture} />}

        <section className="solution-process" id="operations" aria-labelledby={`${page.slug}-process`}>
          <div className="process-intro" data-reveal>
            <p className="section-code">{page.processLabel || 'SYSTEM PLANNING'}</p>
            <h2 id={`${page.slug}-process`}>{page.processTitle}</h2>
            <p>{page.processCopy}</p>
          </div>
          <ol className="process-flow">
            {page.process.map((step, index) => (
              <li key={step.label} data-reveal>
                <span>0{index + 1}</span>
                <small>{step.label}</small>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="solution-resources" aria-labelledby={`${page.slug}-resources`}>
          <header data-reveal>
            <p className="section-code">RESOURCE ROLES</p>
            <h2 id={`${page.slug}-resources`}>{page.resourceTitle}</h2>
          </header>
          <div className="resource-list">
            {page.resources.map((resource, index) => (
              <article key={resource.name} data-reveal>
                <span>0{index + 1}</span>
                <div><h3>{resource.name}</h3><small>{resource.role}</small></div>
                <p>{resource.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="solution-next" data-reveal>
          <p className="section-code">YOUR SITE / YOUR DEMAND / YOUR SYSTEM</p>
          <h2>{page.ctaTitle}</h2>
          <p>Tell us about your organization, location, and energy needs. We’ll start with what the site can responsibly support.</p>
          <button className="primary-button large" onClick={() => setInquiryOpen(true)}>Get your Power Pasture <Icon name="arrow" /></button>
        </section>
      </main>

      <footer>
        <Brand />
        <p className="footer-legal"><span>© 2026 POWER PASTURE™</span><small>PATENT PENDING</small></p>
        <div><a href="mailto:taylor@powerpasture.com">CONTACT ↗</a><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
    </div>
  )
}

function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found | Power Pasture™'
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, follow')
  }, [])
  return (
    <div className="site not-found-site">
      <header className="site-header"><Brand /></header>
      <main id="main-content" className="not-found"><p className="section-code">404 / PAGE NOT FOUND</p><h1>This page is off the grid.</h1><p>The page you requested does not exist.</p><a className="primary-button" href="/">Return home <Icon name="arrow" /></a></main>
    </div>
  )
}

function App({ pathname }) {
  const browserPath = typeof window === 'undefined' ? '/' : window.location.pathname
  const path = (pathname ?? browserPath).replace(/\/+$/, '') || '/'
  if (path === '/') return <HomePage />
  if (path === '/hospitals') return <HospitalArticlePage page={solutionPages['/hospitals']} />
  if (path === '/manufacturing') return <IndustrialArticlePage page={solutionPages['/manufacturing']} />
  if (enabledSolutionPages.has(path) && solutionPages[path]) return <DetailPage page={solutionPages[path]} />
  return <NotFoundPage />
}

export default App
