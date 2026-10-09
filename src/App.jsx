import { useEffect, useRef, useState } from 'react'
import heroImage from './assets/Hero.webp'
import geothermalImage from './assets/GeoThermalRepresentation.png'
import brandLogo from './assets/PowerPastureLogo-tm.png'
import './App.css'

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
  { id: '01', title: 'Data centers', copy: 'High-demand digital infrastructure deployed closer to abundant, locally produced energy.' },
  { id: '02', title: 'Home developments', copy: 'Local renewable generation planned alongside homes, roads, utilities, and growing communities.' },
  { id: '03', title: 'Hospitals', copy: 'Resilient energy infrastructure for facilities that depend on continuous, dependable operation.' },
  { id: '04', title: 'Office buildings', copy: 'Adaptable energy systems for commercial campuses and the organizations they support.' },
  { id: '05', title: 'Shopping centers', copy: 'Scalable generation for retail destinations, mixed-use sites, and their surrounding services.' },
  { id: '06', title: 'Manufacturing & industrial', copy: 'Continuous, high-density power and process heat for manufacturing, cold storage, and heavy industrial operations.' },
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
    <a className="brand" href="#top" aria-label="Power Pasture™ home">
      <span className="brand-mark" aria-hidden="true"><img src={brandLogo} alt="" /></span>
      <span><b>POWER PASTURE™</b><small>LOCAL ENERGY INFRASTRUCTURE</small></span>
    </a>
  )
}

function InquiryModal({ onClose }) {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="inquiry-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <div className="modal-status"><i /> SECURE CHANNEL / OPEN</div>
        {!sent ? (
          <>
            <p className="eyebrow">PROJECT INQUIRY</p>
            <h2 id="inquiry-title">Get your Power Pasture.</h2>
            <p className="modal-copy">Tell us about your organization and energy needs. We’ll follow up to explore what your site can support.</p>
            <form onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <label>NAME<input name="name" required autoFocus placeholder="Your name" /></label>
              <label>WORK EMAIL<input name="email" required type="email" placeholder="you@company.com" /></label>
              <label>ORGANIZATION<input name="organization" placeholder="Company or fund" /></label>
              <button className="primary-button full" type="submit">Submit inquiry <Icon name="arrow" /></button>
            </form>
          </>
        ) : (
          <div className="success-state">
            <span><Icon name="check" size={28} /></span>
            <p className="eyebrow">INQUIRY RECEIVED</p>
            <h2>Thank you.</h2>
            <p>We’ll be in touch to discuss your Power Pasture™.</p>
            <button className="text-button" onClick={onClose}>Return to system <Icon name="arrow" /></button>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [booted, setBooted] = useState(false)
  const [bootMode] = useState(() => {
    try {
      return window.sessionStorage.getItem('power-pasture-intro') ? 'returning' : 'first'
    } catch {
      return 'first'
    }
  })
  const connectorLayerRef = useRef(null)
  const hydroRef = useRef(null)
  const geothermalRef = useRef(null)
  const hubRef = useRef(null)
  const hydroPathRef = useRef(null)
  const geothermalPathRef = useRef(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const bootDuration = reducedMotion ? 120 : bootMode === 'first' ? 1550 : 800
    const timer = window.setTimeout(() => setBooted(true), bootDuration)
    try {
      window.sessionStorage.setItem('power-pasture-intro', 'seen')
    } catch {
      // The intro still works when browser storage is unavailable.
    }
    const root = document.documentElement
    const clamp = (value) => Math.max(0, Math.min(1, value))
    const setVariable = (name, value) => root.style.setProperty(name, value)
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

    // Reveal anything already in view after a mobile resize, refresh, or anchor jump.
    const revealVisibleTargets = () => {
      const revealLine = window.innerHeight * (mobileViewport ? .96 : .92)
      revealTargets.forEach((element) => {
        if (element.classList.contains('is-visible')) return
        const rect = element.getBoundingClientRect()
        if (rect.top < revealLine && rect.bottom > 0) {
          element.classList.add('is-visible')
          reveal.unobserve(element)
        }
      })
    }

    let frame = 0
    let hasScrolled = false

    const tick = () => {
      frame = 0

      const nextHasScrolled = window.scrollY > 30
      if (nextHasScrolled !== hasScrolled) {
        document.body.classList.toggle('has-scrolled', nextHasScrolled)
        hasScrolled = nextHasScrolled
      }

    }

    const requestTick = () => {
      setVariable('--scroll-y', `${window.scrollY}px`)
      const pageTravel = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      setVariable('--page-progress', clamp(window.scrollY / pageTravel))
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', requestTick, { passive: true })
    window.addEventListener('resize', requestTick)
    window.addEventListener('resize', revealVisibleTargets)
    revealVisibleTargets()
    requestTick()
    return () => {
      window.clearTimeout(timer)
      reveal.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestTick)
      window.removeEventListener('resize', requestTick)
      window.removeEventListener('resize', revealVisibleTargets)
    }
  }, [bootMode])

  useEffect(() => {
    const layer = connectorLayerRef.current
    const hub = hubRef.current
    const hydro = hydroRef.current
    const geothermal = geothermalRef.current
    const hydroPath = hydroPathRef.current
    const geothermalPath = geothermalPathRef.current
    if (!layer || !hub || !hydro || !geothermal || !hydroPath || !geothermalPath) return undefined

    let frame = 0
    let active = true

    const edgePoint = (rect, targetX, targetY, layerRect) => {
      const centerX = rect.left - layerRect.left + rect.width / 2
      const centerY = rect.top - layerRect.top + rect.height / 2
      const dx = targetX - centerX
      const dy = targetY - centerY
      const scale = 1 / Math.max(
        Math.abs(dx) / Math.max(rect.width / 2, 1),
        Math.abs(dy) / Math.max(rect.height / 2, 1),
        1,
      )
      return { x: centerX + dx * scale, y: centerY + dy * scale }
    }

    const drawPath = (source, path, layerRect, hubRect) => {
      const hubCenterX = hubRect.left - layerRect.left + hubRect.width / 2
      const sourceRect = source.getBoundingClientRect()
      const sourceCenterX = sourceRect.left - layerRect.left + sourceRect.width / 2
      const sourceCenterY = sourceRect.top - layerRect.top + sourceRect.height / 2
      const start = {
        x: hubCenterX >= sourceCenterX
          ? sourceRect.right - layerRect.left
          : sourceRect.left - layerRect.left,
        y: sourceCenterY,
      }
      const end = edgePoint(hubRect, sourceCenterX, sourceCenterY, layerRect)
      const dx = end.x - start.x
      const dy = end.y - start.y
      const sideBend = Math.abs(dy) > Math.abs(dx) * 2 && layerRect.width < 760
        ? Math.min(72, layerRect.width * .18) * (sourceCenterX >= layerRect.width / 2 ? 1 : -1)
        : 0
      let d
      if (Math.abs(dx) >= Math.abs(dy)) {
        d = `M${start.x} ${start.y} C${start.x + dx * .42} ${start.y}, ${end.x - dx * .28} ${end.y}, ${end.x} ${end.y}`
      } else if (sideBend) {
        const sideX = sideBend > 0 ? layerRect.width - 10 : 10
        const midY = start.y + dy * .52
        d = `M${start.x} ${start.y} C${sideX} ${start.y + dy * .16}, ${sideX} ${start.y + dy * .34}, ${sideX} ${midY} C${sideX} ${end.y - dy * .28}, ${sideX} ${end.y - dy * .12}, ${end.x} ${end.y}`
      } else {
        d = `M${start.x} ${start.y} C${start.x} ${start.y + dy * .42}, ${end.x} ${end.y - dy * .28}, ${end.x} ${end.y}`
      }
      path.setAttribute('d', d)
    }

    const drawConnectors = () => {
      frame = 0
      const layerRect = layer.getBoundingClientRect()
      const hubRect = hub.getBoundingClientRect()
      layer.setAttribute('viewBox', `0 0 ${layerRect.width} ${layerRect.height}`)
      drawPath(hydro, hydroPath, layerRect, hubRect)
      drawPath(geothermal, geothermalPath, layerRect, hubRect)
    }

    const scheduleDraw = () => {
      if (active && !frame) frame = window.requestAnimationFrame(drawConnectors)
    }

    const observer = new ResizeObserver(scheduleDraw)
    const motionObserver = new MutationObserver(scheduleDraw)
    ;[layer, hub, hydro, geothermal].forEach((element) => observer.observe(element))
    motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
    window.addEventListener('scroll', scheduleDraw, { passive: true })
    window.addEventListener('resize', scheduleDraw)
    document.fonts?.ready.then(scheduleDraw)
    scheduleDraw()

    return () => {
      active = false
      observer.disconnect()
      motionObserver.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleDraw)
      window.removeEventListener('resize', scheduleDraw)
    }
  }, [])

  const goTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site" id="top">
      <div className={`boot-screen is-${bootMode} ${booted ? 'is-done' : ''}`} aria-hidden="true">
        <div className="boot-field"><i /><i /><i /><span /></div>
        <div className="boot-stage">
          <p className="boot-kicker"><i /> Local energy infrastructure</p>
          <div className="boot-identity">
            <span className="boot-brand"><img src={brandLogo} alt="" /></span>
            <div><b>Power Pasture™</b><p>Turning local energy into infrastructure.</p></div>
          </div>
          <div className="boot-sequence">
            <span><i />Identify</span>
            <span><i />Prepare</span>
            <span><i />Deploy</span>
          </div>
          <div className="boot-line"><i /><b /></div>
        </div>
        <div className="boot-meta"><span>Geothermal / Hydro / Solar / Wind</span><span>Lee County</span></div>
      </div>

      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <button onClick={() => goTo('#system')}>Model</button>
          <button onClick={() => goTo('#applications')}>Applications</button>
        </nav>
        <button className="header-action" onClick={() => setInquiryOpen(true)}>GET YOUR POWER PASTURE <Icon name="arrow" size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-sticky">
            <div className="hero-visual">
              <img className="hero-image" src={heroImage} alt="Power Pasture™ infrastructure distributed through a mountain valley" />
              <div className="hero-visual-shade" aria-hidden="true" />
              <div className="hero-grid" aria-hidden="true" />
              <div className="hero-scanline" aria-hidden="true" />
              <div className="hero-crosshair hero-crosshair-a" aria-hidden="true"><i /><span>GRID / 04</span></div>
              <div className="hero-crosshair hero-crosshair-b" aria-hidden="true"><i /><span>LIVE LINK</span></div>
              <div className="hero-glow" aria-hidden="true" />
            </div>
            <svg ref={connectorLayerRef} className="hero-inline-connectors" aria-hidden="true">
              <path ref={hydroPathRef} className="hero-energy-link source-link link-hydro" pathLength="1" />
              <path ref={geothermalPathRef} className="hero-energy-link source-link link-geothermal" pathLength="1" />
            </svg>
            <div className="hero-energy-map" aria-hidden="true">
              <svg viewBox="0 0 620 350" preserveAspectRatio="none">
                <path className="hero-energy-link source-link link-one link-one-desktop" pathLength="1" d="M120 115 C225 115 310 140 440 175" />
                <path className="hero-energy-link source-link link-one link-one-mobile" pathLength="1" d="M120 55 C225 55 310 106 440 175" />
                <path className="hero-energy-link source-link link-two" pathLength="1" d="M120 270 C225 270 310 228 440 175" />
                <circle className="hero-energy-junction" cx="440" cy="175" r="4" />
              </svg>

              <div className="hero-source-node source-wind">
                <Icon name="windTurbine" size={22} /><span><b>Wind</b><small>Variable resource</small></span>
              </div>
              <div className="hero-source-node source-solar">
                <Icon name="solar" size={22} /><span><b>Solar</b><small>Scalable generation</small></span>
              </div>

              <div ref={hubRef} className="hero-map-hub">
                <span>P</span><b>Power Pasture™</b><small>Unified local energy</small>
              </div>
              <span className="hero-map-label source-label">LOCAL RENEWABLE INPUTS</span>
            </div>
            <div className="hero-copy">
              <div className="hero-status-row">
                <div className="eyebrow hero-eyebrow"><span className="live-dot" /><span className="hero-eyebrow-copy">LOCAL ENERGY / MANY APPLICATIONS</span><i /><span>SYSTEM ONLINE</span></div>
                <span ref={hydroRef} className="hero-source-inline hero-source-inline-hydro" aria-hidden="true">
                  <Icon name="hydro" size={18} /><span><b>Hydro</b><small>Dense generation</small></span>
                </span>
                <span ref={geothermalRef} className="hero-source-inline hero-source-inline-geothermal" aria-hidden="true">
                  <Icon name="geothermal" size={18} /><span><b>Geothermal</b><small>Steady resource</small></span>
                </span>
              </div>
              <h1>Unifying renewable energy<br /><em>to power the world’s consumers.</em></h1>
              <p>Power Pasture™ brings geothermal, hydro, solar, and wind together to serve real-world demand.</p>
            </div>

          </div>
        </section>

        <aside className="power-index" aria-label="Renewable energy source index">
          <div className="power-index-heading">
            <p>GET YOUR POWER PASTURE™</p>
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
        </aside>

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
              <img src={geothermalImage} alt="Containerized data center connected to an underground closed-loop geothermal cooling system" />
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
              {applications.map((application) => (
                <article key={application.id} data-reveal>
                  <span>{application.id}</span>
                  <h3>{application.title}</h3>
                  <p>{application.copy}</p>
                </article>
              ))}
            </div>

            <div className="applications-footer" data-reveal>
              <span>Built around real demand</span>
              <p>One adaptable model. As many applications as the site can support.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <Brand />
        <p>© 2026 POWER PASTURE™</p>
        <div><a href="mailto:hello@powerpasture.energy">CONTACT ↗</a><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
    </div>
  )
}

export default App
