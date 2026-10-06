import { useEffect, useState } from 'react'
import heroImage from './assets/Hero.webp'
import fieldImage from './assets/outpost-hero.webp'
import geothermalImage from './assets/GeoThermalRepresentation.png'
import brandLogo from './assets/PowerPastureLogo.png'
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
    traits: ['Stable potential', 'Integrated thermal', 'Long-lived foundation'],
  },
  {
    id: '02',
    code: 'HYDRO',
    title: 'Hydro',
    copy: 'Where suitable resources exist, hydro can provide high-density and potentially dispatchable generation.',
    detail: 'Power Pasture evaluates the local water resource, site conditions, permitting pathway, and infrastructure needs together—shaping the project around what the location can responsibly support.',
    icon: 'hydro',
    stat: 'DENSE GENERATION',
    traits: ['Site specific', 'Potentially dispatchable', 'Infrastructure ready'],
  },
  {
    id: '03',
    code: 'SOLAR',
    title: 'Solar',
    copy: 'Scalable generation can be deployed according to available land, infrastructure requirements, and site demand.',
    detail: 'Its modular nature allows capacity to be shaped around land and demand, then paired with other resources or storage as the Power Pasture develops.',
    icon: 'solar',
    stat: 'MODULAR SCALE',
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
    traits: ['Condition driven', 'Complementary output', 'Diversified mix'],
  },
]

const sequence = [
  { id: '01', verb: 'Harvest', copy: 'Identify and harvest local renewable energy—geothermal, hydro, solar, and wind.' },
  { id: '02', verb: 'Hookup', copy: 'Connect modular infrastructure directly to the site’s energy-producing foundation.' },
  { id: '03', verb: 'Power', copy: 'Energize the site while keeping the workload adaptable as technology and demand evolve.' },
]

const applications = [
  { id: '01', title: 'Digital infrastructure', copy: 'AI, edge computing, high-performance computing, and modular data systems deployed closer to available energy.' },
  { id: '02', title: 'Industrial & commercial', copy: 'A shared energy foundation that can support multiple users as an industrial or commercial site develops.' },
  { id: '03', title: 'Community development', copy: 'Renewable generation planned alongside homes, roads, utilities, and other long-term community infrastructure.' },
  { id: '04', title: 'Energy & landowners', copy: 'A pathway for underused renewable resources, reclaimed industrial land, and other energy-rich locations.' },
  { id: '05', title: 'Research & development', copy: 'A real operating environment for studying distributed energy, computing, infrastructure, and emerging technologies.' },
  { id: '06', title: 'Workforce development', copy: 'Hands-on settings where students and workers can build practical experience with modern energy and digital systems.' },
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

function EnergyArt({ type }) {
  if (type === 'GEOTHERMAL') {
    return (
      <div className="energy-art energy-art-geothermal" aria-hidden="true">
        <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
          <path className="energy-ground-fill" d="M24 76 C120 65 200 82 292 72 S474 61 616 76 V262 H24Z" />
          <path className="energy-surface" d="M24 76 C120 65 200 82 292 72 S474 61 616 76" />
          <path className="energy-line energy-line-soft" pathLength="1" d="M24 134 C124 110 216 151 318 127 S510 104 616 130" />
          <path className="energy-line" pathLength="1" d="M24 190 C124 166 216 208 318 183 S510 160 616 186" />
          <path className="energy-line energy-line-soft" pathLength="1" d="M24 240 C124 216 216 258 318 233 S510 210 616 236" />
          <rect className="energy-structure energy-plant" x="238" y="25" width="150" height="50" rx="3" />
          <circle className="energy-exchanger" cx="270" cy="50" r="14" />
          <path className="energy-vector" d="M270 37v26M257 50h26M260.8 40.8l18.4 18.4M279.2 40.8l-18.4 18.4M300 41h70M300 51h70M300 61h44" />
          <path className="energy-bore" pathLength="1" d="M304 75 V214 C304 244 338 244 338 214 V75" />
          <path className="energy-flow" d="m292 142 12 12 12-12M326 154l12-12 12 12" />
          <path className="energy-heat" d="M150 221c-16-15 16-25 0-40s16-25 0-40M464 213c-16-15 16-25 0-40s16-25 0-40M526 231c-12-12 12-21 0-33s12-21 0-33" />
          <circle className="energy-core" cx="321" cy="228" r="9" />
          <circle className="energy-orbit" cx="321" cy="228" r="30" />
        </svg>
      </div>
    )
  }

  if (type === 'HYDRO') {
    return (
      <div className="energy-art energy-art-hydro" aria-hidden="true">
        <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
          <path className="energy-line energy-wave energy-line-soft" pathLength="1" d="M22 72 C70 50 112 92 160 72 S244 52 286 69" />
          <path className="energy-line energy-wave" pathLength="1" d="M22 112 C70 90 112 132 160 112 S244 92 296 110" />
          <path className="energy-line energy-wave energy-line-soft" pathLength="1" d="M22 152 C70 130 112 172 160 152 S244 132 304 151" />
          <path className="energy-structure energy-dam" d="M300 42 H354 L394 222 H326 Z" />
          <path className="energy-flow energy-penstock" d="M314 92 C342 120 350 162 388 186" />
          <circle className="energy-turbine" cx="417" cy="190" r="32" />
          <circle className="energy-core" cx="417" cy="190" r="7" />
          <path className="energy-vector" d="M417 183V163M423 194l18 10M411 194l-18 10" />
          <path className="energy-line energy-wave" pathLength="1" d="M450 222 C482 204 510 240 542 222 S594 210 620 221" />
        </svg>
      </div>
    )
  }

  if (type === 'SOLAR') {
    return (
      <div className="energy-art energy-art-solar" aria-hidden="true">
        <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
          <circle className="energy-sun" cx="510" cy="55" r="27" />
          <path className="energy-rays" pathLength="1" d="M510 12V2M510 108V98M467 55h-10M563 55h-10M479 24l-8-8M549 94l-8-8M541 24l8-8M471 94l8-8" />
          <path className="energy-panel" d="M122 92 456 74 505 205 78 225Z" />
          <path className="energy-grid-line" d="M156 90 125 223M224 86 213 219M291 83 300 215M358 79 388 211M424 77 475 207M94 181l394-16M106 136l365-13" />
          <path className="energy-structure" d="M286 216v34M220 252h134" />
        </svg>
      </div>
    )
  }

  return (
    <div className="energy-art energy-art-wind" aria-hidden="true">
      <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet">
        <path className="energy-line energy-stream energy-line-soft" pathLength="1" d="M22 66 C116 30 182 91 265 62 S430 42 616 68" />
        <path className="energy-line energy-stream" pathLength="1" d="M22 116 C104 86 164 132 236 112" />
        <path className="energy-line energy-stream energy-line-soft" pathLength="1" d="M408 124 C472 96 532 141 616 112" />
        <path className="energy-structure energy-tower" d="M320 105 302 248M320 105l18 143M286 248h68" />
        <circle className="energy-core" cx="320" cy="96" r="9" />
        <path className="energy-blade" d="M320 87 C303 63 281 35 270 27 C268 45 275 70 313 96M329 98 C359 94 391 88 403 82 C391 72 364 64 324 89M315 104 C301 130 290 159 290 174 C305 166 322 147 324 104" />
        <path className="energy-structure energy-tower energy-tower-small" d="M500 144 489 248M500 144l11 104M478 248h44" />
        <circle className="energy-turbine-small" cx="500" cy="138" r="6" />
        <path className="energy-blade energy-blade-small" d="M500 132 484 109M506 140l27 5M497 144l-11 26" />
        <path className="energy-surface" d="M28 248H616" />
      </svg>
    </div>
  )
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Power Pasture home">
      <span className="brand-mark" aria-hidden="true"><img src={brandLogo} alt="" /></span>
      <span><b>POWER PASTURE</b><small>LOCAL ENERGY INFRASTRUCTURE</small></span>
    </a>
  )
}

function WaitlistModal({ onClose }) {
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
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="waitlist-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <div className="modal-status"><i /> SECURE CHANNEL / OPEN</div>
        {!sent ? (
          <>
            <p className="eyebrow">EARLY ACCESS</p>
            <h2 id="waitlist-title">Join the network.</h2>
            <p className="modal-copy">Join the Power Pasture waitlist for deployment updates, project news, and early access opportunities.</p>
            <form onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <label>NAME<input name="name" required autoFocus placeholder="Your name" /></label>
              <label>WORK EMAIL<input name="email" required type="email" placeholder="you@company.com" /></label>
              <label>ORGANIZATION<input name="organization" placeholder="Company or fund" /></label>
              <button className="primary-button full" type="submit">Join the waitlist <Icon name="arrow" /></button>
            </form>
          </>
        ) : (
          <div className="success-state">
            <span><Icon name="check" size={28} /></span>
            <p className="eyebrow">WAITLIST CONFIRMED</p>
            <h2>You’re on the list.</h2>
            <p>We’ll keep you updated as the Power Pasture platform develops.</p>
            <button className="text-button" onClick={onClose}>Return to system <Icon name="arrow" /></button>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [booted, setBooted] = useState(false)
  const [bootMode] = useState(() => {
    try {
      return window.sessionStorage.getItem('power-pasture-intro') ? 'returning' : 'first'
    } catch {
      return 'first'
    }
  })
  const [heroPhase, setHeroPhase] = useState('0')

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
    const hero = document.querySelector('.hero')
    const fieldSection = document.querySelector('.field-section')
    const networkSection = document.querySelector('.network-section')
    const closingSection = document.querySelector('.closing-section')
    const sequenceRows = [...document.querySelectorAll('.sequence-list article')]
    const clamp = (value) => Math.max(0, Math.min(1, value))
    const smooth = (start, end, value) => {
      const point = clamp((value - start) / (end - start))
      return point * point * (3 - 2 * point)
    }
    const setVariable = (name, value) => root.style.setProperty(name, value)
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element))

    let frame = 0
    let targetHeroProgress = 0
    let renderedHeroProgress = 0
    let previousHeroProgress = 0
    let previousFrameTime = performance.now()
    let currentHeroPhase = '0'
    let hasScrolled = false
    let sectionUpdatePending = true
    let lastFieldProgress = -1
    let lastNetworkProgress = -1
    let lastClosingProgress = -1

    const setChapterVariables = (chapter, start, entered, leaving, end, progress) => {
      const entry = smooth(start, entered, progress)
      const exit = smooth(leaving, end, progress)
      const visibility = entry * (1 - exit)
      setVariable(`--phase-${chapter}-alpha`, visibility)
      setVariable(`--phase-${chapter}-y`, `${(1 - entry) * 42 - exit * 28}px`)
      setVariable(`--phase-${chapter}-depth`, `${(1 - visibility) * -34}px`)
      setVariable(`--phase-${chapter}-tilt`, `${(1 - entry) * -2.4 + exit * 1.6}deg`)
      setVariable(`--phase-${chapter}-blur`, `${(1 - visibility) * 7}px`)
      setVariable(`--phase-${chapter}-clip-top`, `${(1 - entry) * 34}%`)
      setVariable(`--phase-${chapter}-clip-bottom`, `${exit * 30}%`)
      setVariable(`--phase-${chapter}-label-x`, `${(1 - entry) * 16 - exit * 8}px`)
      setVariable(`--phase-${chapter}-title-x`, `${(1 - entry) * 25 - exit * 12}px`)
      setVariable(`--phase-${chapter}-copy-x`, `${(1 - entry) * 34 - exit * 16}px`)
    }

    const renderHero = (progress) => {
      const momentum = Math.max(-1, Math.min(1, (progress - previousHeroProgress) * 95))
      const introExit = smooth(.035, .205, progress)
      const storyEntrance = smooth(.135, .235, progress)
      const storyExit = smooth(.89, .985, progress)
      const storyVisibility = storyEntrance * (1 - storyExit)
      const imageTravel = smooth(0, .98, progress)
      const eyebrowExit = smooth(.025, .105, progress)
      const titleExit = smooth(.055, .155, progress)
      const copyExit = smooth(.085, .185, progress)
      const actionsExit = smooth(.11, .215, progress)
      const chapterProgress = smooth(.18, .9, progress)

      setVariable('--hero-scroll', progress)
      setVariable('--hero-image-y', `${imageTravel * -46}px`)
      setVariable('--hero-image-y-mobile', `${imageTravel * -24}px`)
      setVariable('--hero-image-x-mobile', `${imageTravel * -10}px`)
      setVariable('--hero-image-scale', 1.035 + imageTravel * .055)
      setVariable('--hero-image-scale-mobile', 1.025 + imageTravel * .035)
      setVariable('--hero-light-x', `${74 - imageTravel * 22}%`)
      setVariable('--hero-light-y', `${42 + imageTravel * 8}%`)
      setVariable('--hero-light-alpha', .1 + storyVisibility * .2)
      setVariable('--intro-alpha', 1 - introExit)
      setVariable('--intro-eyebrow-exit', eyebrowExit)
      setVariable('--intro-title-exit', titleExit)
      setVariable('--intro-copy-exit', copyExit)
      setVariable('--intro-actions-exit', actionsExit)
      setVariable('--intro-eyebrow-y', `${eyebrowExit * -14}px`)
      setVariable('--intro-title-y', `${titleExit * -34}px`)
      setVariable('--intro-copy-y', `${copyExit * -24}px`)
      setVariable('--intro-actions-y', `${actionsExit * -16}px`)
      setVariable('--narrative-alpha', storyVisibility)
      setVariable('--narrative-y', `${(1 - storyEntrance) * 64 - storyExit * 42 + momentum * -14}px`)
      setVariable('--narrative-x', `${(1 - storyEntrance) * -12 + storyExit * 8}px`)
      setVariable('--narrative-tilt', `${momentum * -.7}deg`)
      setVariable('--narrative-scale', .94 + storyVisibility * .06)
      setVariable('--chapter-progress', chapterProgress)
      setVariable('--chapter-position', `${chapterProgress * 100}%`)
      setVariable('--route-trunk-offset', 1 - smooth(.18, .42, progress))
      setVariable('--route-branch-offset', 1 - smooth(.4, .69, progress))
      setVariable('--route-network-offset', 1 - smooth(.66, .91, progress))
      setVariable('--route-alpha', storyVisibility * .9)
      setVariable('--route-node-one', smooth(.25, .36, progress) * (1 - smooth(.58, .71, progress) * .35))
      setVariable('--route-node-two', smooth(.48, .61, progress) * (1 - smooth(.79, .91, progress) * .25))
      setVariable('--route-node-three', smooth(.7, .84, progress))
      setVariable('--route-y', `${imageTravel * -12}px`)
      setVariable('--route-scale', 1 + imageTravel * .012)
      setVariable('--frame-alpha', storyVisibility)
      setVariable('--frame-scale', 1.018 - storyVisibility * .018 + storyExit * .008)
      setVariable('--frame-sweep', `${smooth(.17, .91, progress) * 100}%`)
      setChapterVariables('one', .145, .225, .365, .445, progress)
      setChapterVariables('two', .36, .445, .625, .71, progress)
      setChapterVariables('three', .62, .705, .875, .96, progress)

      const nextPhase = progress < .405 ? '0' : progress < .665 ? '1' : '2'
      if (nextPhase !== currentHeroPhase) {
        if (hero) hero.dataset.scrollPhase = nextPhase
        currentHeroPhase = nextPhase
        setHeroPhase(nextPhase)
      }
      hero?.classList.toggle('is-story', progress > .15)
    }

    const updateSections = () => {
      const sectionProgress = (section) => {
        if (!section) return 0
        const rect = section.getBoundingClientRect()
        const crossing = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        return smooth(.04, .96, crossing)
      }
      const fieldProgress = sectionProgress(fieldSection)
      const networkProgress = sectionProgress(networkSection)
      const closingProgress = sectionProgress(closingSection)
      if (Math.abs(fieldProgress - lastFieldProgress) > .0001) {
        sequenceRows.forEach((row, index) => {
          const station = .18 + index * .32
          const distance = fieldProgress - station
          const focus = clamp(1 - Math.abs(distance) / .22)
          row.style.setProperty('--sequence-focus', focus)
          row.style.setProperty('--sequence-shift', `${(1 - focus) * 8}px`)
        })
        setVariable('--field-image-y', `${(.5 - fieldProgress) * 46}px`)
        setVariable('--field-copy-y', `${(fieldProgress - .5) * 30}px`)
        lastFieldProgress = fieldProgress
      }
      if (Math.abs(networkProgress - lastNetworkProgress) > .0001) {
        setVariable('--network-copy-x', `${(1 - networkProgress) * -34}px`)
        setVariable('--network-console-y', `${(1 - networkProgress) * 42}px`)
        setVariable('--network-console-tilt', `${(1 - networkProgress) * 3.5}deg`)
        lastNetworkProgress = networkProgress
      }
      if (Math.abs(closingProgress - lastClosingProgress) > .0001) {
        setVariable('--closing-orbit-scale', .72 + closingProgress * .28)
        setVariable('--closing-orbit-rotate', `${(1 - closingProgress) * -12}deg`)
        lastClosingProgress = closingProgress
      }
    }

    const tick = () => {
      frame = 0
      const now = performance.now()
      const elapsed = Math.min(now - previousFrameTime, 64)
      previousFrameTime = now
      const rect = hero?.getBoundingClientRect()
      const travel = hero ? Math.max(hero.offsetHeight - window.innerHeight, 1) : 1
      targetHeroProgress = rect ? clamp(-rect.top / travel) : 0
      const distance = targetHeroProgress - renderedHeroProgress
      const spring = 1 - Math.pow(.001, elapsed / 1000)
      renderedHeroProgress = reducedMotion || Math.abs(distance) < .00008
        ? targetHeroProgress
        : renderedHeroProgress + distance * spring
      renderHero(renderedHeroProgress)
      previousHeroProgress = renderedHeroProgress

      if (sectionUpdatePending) {
        updateSections()
        sectionUpdatePending = false
      }

      const nextHasScrolled = window.scrollY > 30
      if (nextHasScrolled !== hasScrolled) {
        document.body.classList.toggle('has-scrolled', nextHasScrolled)
        hasScrolled = nextHasScrolled
      }

      if (!reducedMotion && Math.abs(targetHeroProgress - renderedHeroProgress) > .00008) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    const requestTick = () => {
      sectionUpdatePending = true
      setVariable('--scroll-y', `${window.scrollY}px`)
      const pageTravel = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      setVariable('--page-progress', clamp(window.scrollY / pageTravel))
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', requestTick, { passive: true })
    window.addEventListener('resize', requestTick)
    requestTick()
    return () => {
      window.clearTimeout(timer)
      reveal.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestTick)
      window.removeEventListener('resize', requestTick)
    }
  }, [bootMode])

  const goTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site" id="top">
      <div className="scroll-narrative" data-phase={heroPhase} aria-live="polite" aria-atomic="true">
        <div className="narrative-header" aria-hidden="true"><span>DEPLOYMENT PROTOCOL</span><b>0{Number(heroPhase) + 1} / 03</b></div>
        <div className="narrative-stage">
          <article className="scroll-phase phase-one" aria-hidden={heroPhase !== '0'}>
            <p><span>01 /</span> RESOURCE / IDENTIFIED</p><h2>Harvest.</h2>
            <div>Identify and harvest local renewable energy—geothermal, hydro, solar, and wind.</div>
          </article>
          <article className="scroll-phase phase-two" aria-hidden={heroPhase !== '1'}>
            <p><span>02 /</span> MODULE / CONNECTED</p><h2>Hookup.</h2>
            <div>Connect modular infrastructure directly to the site’s energy-producing foundation.</div>
          </article>
          <article className="scroll-phase phase-three" aria-hidden={heroPhase !== '2'}>
            <p><span>03 /</span> SITE / ENERGIZED</p><h2>Power.</h2>
            <div>Energize the site while keeping the workload adaptable as technology and demand evolve.</div>
          </article>
        </div>
        <div className="narrative-rail" aria-hidden="true"><i /><span className="is-one">01</span><span className="is-two">02</span><span className="is-three">03</span></div>
      </div>
      <div className={`boot-screen is-${bootMode} ${booted ? 'is-done' : ''}`} aria-hidden="true">
        <div className="boot-field"><i /><i /><i /><span /></div>
        <div className="boot-stage">
          <p className="boot-kicker"><i /> Local energy infrastructure</p>
          <div className="boot-identity">
            <span className="boot-brand"><img src={brandLogo} alt="" /></span>
            <div><b>Power Pasture</b><p>Turning local energy into infrastructure.</p></div>
          </div>
          <div className="boot-sequence">
            <span><i />Identify</span>
            <span><i />Prepare</span>
            <span><i />Deploy</span>
          </div>
          <div className="boot-line"><i /><b /></div>
        </div>
        <div className="boot-meta"><span>Geothermal / Hydro / Solar / Wind</span><span>Constitutional Oaks / Virginia</span></div>
      </div>

      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <button onClick={() => goTo('#system')}>Model</button>
          <button onClick={() => goTo('#applications')}>Applications</button>
        </nav>
        <button className="header-action" onClick={() => setWaitlistOpen(true)}>Join the waitlist <Icon name="arrow" size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-sticky">
            <div className="hero-visual">
              <img className="hero-image" src={heroImage} alt="Power Pasture infrastructure distributed through a mountain valley" />
              <div className="hero-visual-shade" aria-hidden="true" />
              <svg className="hero-route-map hero-route-map-desktop" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                <defs><filter id="route-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                <path className="route-trunk route-ghost" pathLength="1" d="M168 500 C250 456 324 452 401 394 C472 341 520 327 593 302" />
                <path className="route-trunk" pathLength="1" d="M168 500 C250 456 324 452 401 394 C472 341 520 327 593 302" />
                <path className="route-branch route-ghost" pathLength="1" d="M593 302 C655 278 704 245 751 213" />
                <path className="route-branch" pathLength="1" d="M593 302 C655 278 704 245 751 213" />
                <path className="route-network route-ghost" pathLength="1" d="M751 213 C806 178 850 158 914 144 M751 213 C822 236 870 273 934 286 M751 213 C754 153 747 118 780 80" />
                <path className="route-network" pathLength="1" d="M751 213 C806 178 850 158 914 144 M751 213 C822 236 870 273 934 286 M751 213 C754 153 747 118 780 80" />
                <g className="route-node route-node-one"><circle cx="168" cy="500" r="18" /><circle cx="168" cy="500" r="4" /><text x="188" y="490">01 / RESOURCE / IDENTIFIED</text></g>
                <g className="route-node route-node-two"><circle cx="593" cy="302" r="18" /><circle cx="593" cy="302" r="4" /><text x="613" y="292">02 / MODULE / CONNECTED</text></g>
                <g className="route-node route-node-three"><circle cx="751" cy="213" r="18" /><circle cx="751" cy="213" r="4" /><text x="771" y="203">03 / SITE / ENERGIZED</text></g>
              </svg>
              <svg className="hero-route-map hero-route-map-mobile" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs><filter id="route-glow-mobile" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                <path className="route-trunk route-ghost" pathLength="1" d="M72 690 C102 635 126 570 164 516 S214 470 242 446" />
                <path className="route-trunk" pathLength="1" d="M72 690 C102 635 126 570 164 516 S214 470 242 446" />
                <path className="route-branch route-ghost" pathLength="1" d="M242 446 C280 414 316 385 346 352" />
                <path className="route-branch" pathLength="1" d="M242 446 C280 414 316 385 346 352" />
                <path className="route-network route-ghost" pathLength="1" d="M346 352 C370 321 380 294 388 259 M346 352 C370 365 385 383 402 408 M346 352 C326 320 310 292 306 255" />
                <path className="route-network" pathLength="1" d="M346 352 C370 321 380 294 388 259 M346 352 C370 365 385 383 402 408 M346 352 C326 320 310 292 306 255" />
                <g className="route-node route-node-one"><circle cx="72" cy="690" r="16" /><circle cx="72" cy="690" r="4" /></g>
                <g className="route-node route-node-two"><circle cx="242" cy="446" r="16" /><circle cx="242" cy="446" r="4" /></g>
                <g className="route-node route-node-three"><circle cx="346" cy="352" r="16" /><circle cx="346" cy="352" r="4" /></g>
              </svg>
              <div className="hero-grid" aria-hidden="true" />
              <div className="hero-frame-corners" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="hero-frame-meta" aria-hidden="true"><span>POWER PASTURE // TERRAIN MODEL 001</span><span>SCROLL-LINKED FEED // LIVE</span></div>
              <div className="hero-telemetry" aria-hidden="true"><span><i /> RESOURCE IDENTIFIED</span><span>MODULE / CONNECTED</span><b>ENERGIZED</b></div>
              <div className="hero-scanline" aria-hidden="true" />
              <div className="hero-crosshair hero-crosshair-a" aria-hidden="true"><i /><span>GRID / 04</span></div>
              <div className="hero-crosshair hero-crosshair-b" aria-hidden="true"><i /><span>LIVE LINK</span></div>
              <div className="hero-glow" aria-hidden="true" />
            </div>
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><span className="live-dot" /> POWER PASTURE / POINT 001 <i /> SYSTEM ONLINE</div>
              <h1>Local energy.<br /><em>Infrastructure ready.</em></h1>
              <p>Power Pasture develops adaptable energy-producing sites around the renewable resources already available—geothermal, hydro, solar, and wind.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => goTo('#system')}>Explore the model <Icon name="arrow" /></button>
                <button className="text-button" onClick={() => setWaitlistOpen(true)}>Start a conversation <span>↗</span></button>
              </div>
            </div>

            <div className="scroll-state" aria-hidden="true">
              <span>SCROLL SEQUENCE</span><div><i /><b>00</b><b>01</b><b>02</b><b>03</b></div>
            </div>
            <div className="hero-foot">
              <span>SCROLL TO CONTROL SYSTEM</span><i />
              <div><span>37.2382° N</span><span>81.2964° W</span></div>
            </div>
          </div>
        </section>

        <div className="signal-rail" aria-hidden="true">
          <div><span>GEOTHERMAL</span><i /> <span>HYDRO</span><i /> <span>SOLAR</span><i /> <span>WIND</span><i /></div>
          <div><span>GEOTHERMAL</span><i /> <span>HYDRO</span><i /> <span>SOLAR</span><i /> <span>WIND</span><i /></div>
        </div>

        <section className="system-section" id="system">
          <div className="system-stage">
            <div className="section-intro" data-reveal>
              <p className="section-code">01 / ENERGY FOUNDATION</p>
              <div><h2>Four energy opportunities. <em>One infrastructure vision.</em></h2><p>Every Power Pasture begins with the resources and conditions of its location. A site may use one source or a complementary mix—the model is shaped around resource quality, land, interconnection, infrastructure demand, and long-term usefulness.</p></div>
            </div>

            <div className="layer-grid">
              {layers.map((layer) => (
                <article className="system-card energy-row" data-reveal data-index={layer.id} key={layer.id}>
                  <div className="layer-top"><span>{layer.id} / {layer.code}</span><span className="layer-icon"><Icon name={layer.icon} size={28} /></span></div>
                  <EnergyArt type={layer.code} />
                  <div className="energy-copy">
                    <p className="energy-role">{layer.stat}</p>
                    <h3>{layer.title}</h3>
                    <p className="energy-lede">{layer.copy}</p>
                    <p className="energy-detail">{layer.detail}</p>
                    <ul aria-label={`${layer.title} characteristics`}>
                      {layer.traits.map((trait) => <li key={trait}>{trait}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="field-section" id="deployment">
          <div className="field-visual" data-reveal>
            <img src={fieldImage} alt="A Power Pasture site connected to a mobile compute rig" />
            <div className="field-shade" />
            <div className="field-scan" />
            <div className="field-route" aria-hidden="true"><i /><i /><i /></div>
            <div className="target target-one"><i /></div>
            <div className="target target-two"><i /></div>
            <div className="field-hud top"><span>LIVE DEPLOYMENT / POINT 001</span><span>FEED 04:12:38</span></div>
            <div className="field-hud bottom"><span><small>ENERGY</small><b>LOCAL</b></span><span><small>SITE</small><b>PREPARED</b></span><span><small>WORKLOAD</small><b>ADAPTABLE</b></span></div>
          </div>
          <div className="field-copy" data-reveal>
            <p className="section-code">02 / DEPLOYMENT MODEL</p>
            <h2>The foundation stays.<br /><em>The workload can change.</em></h2>
            <p className="field-lede">Power Pasture develops the energy-producing foundation as the persistent asset, while the infrastructure consuming that energy can evolve.</p>
            <div className="sequence-list">
              {sequence.map((item) => <article key={item.id}><span>{item.id}</span><div><h3>{item.verb}.</h3><p>{item.copy}</p></div><i /></article>)}
            </div>
          </div>
        </section>

        <section className="geothermal-section" id="thermal" aria-labelledby="geothermal-title" data-reveal>
          <div className="geothermal-shell">
            <header className="geothermal-copy">
              <p className="geothermal-kicker">Geothermal opportunity</p>
              <h2 id="geothermal-title">Stable by nature.<br /><em>Built to last.</em></h2>
              <p>Geothermal can provide dependable energy and thermal resources while becoming a long-lived component of a site’s infrastructure.</p>
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

        <section className="network-section" id="platform">
          <div className="network-copy" data-reveal>
            <p className="section-code">03 / PLATFORM ARCHITECTURE</p>
            <h2>Bring infrastructure<br />to the <em>power.</em></h2>
            <p>Power Pasture separates the long-lived energy asset from the technology it serves. That makes it possible to deploy technical capacity where energy is available—and change that capacity without rebuilding the entire site.</p>
            <button className="outline-button" onClick={() => goTo('#applications')}>Explore applications <Icon name="arrow" /></button>
          </div>
          <div className="platform-stack" data-reveal aria-label="Power Pasture platform architecture">
            <article>
              <span>01 / FOUNDATION</span>
              <div><h3>Power Pasture</h3><p>The energy-producing site and local renewable resource foundation.</p></div>
              <small>Persistent asset</small>
            </article>
            <i aria-hidden="true"><Icon name="arrow" size={18} /></i>
            <article>
              <span>02 / SITE LAYER</span>
              <div><h3>Prepared infrastructure</h3><p>The permanent systems that ready a location for deployable technology.</p></div>
              <small>Deployment ready</small>
            </article>
            <i aria-hidden="true"><Icon name="arrow" size={18} /></i>
            <article>
              <span>03 / WORKLOAD</span>
              <div><h3>Outpost</h3><p>Modular technical infrastructure selected for customer or project requirements.</p></div>
              <small>Adaptable layer</small>
            </article>
          </div>
        </section>

        <section className="applications-section" id="applications">
          <div className="applications-shell">
            <header className="applications-heading" data-reveal>
              <div>
                <p className="section-code">04 / BROADER APPLICATIONS</p>
                <h2>One foundation.<br /><em>Many markets.</em></h2>
              </div>
              <p>Modular computing is an important first application—not the finish line. The same prepared energy foundation can support a wider range of commercial, community, research, and workforce needs.</p>
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
              <span>Designed around local opportunity</span>
              <p>Different resources. Different customers. One adaptable development model.</p>
            </div>
          </div>
        </section>

        <section className="closing-section" data-reveal>
          <div className="closing-grid" aria-hidden="true" />
          <div className="closing-orbit" aria-hidden="true"><i /><i /><i /><span>P</span></div>
          <p className="eyebrow"><span className="live-dot" /> CONSTITUTIONAL OAKS / LEE COUNTY, VIRGINIA</p>
          <h2>Prove it locally.<br /><em>Build it to travel.</em></h2>
          <p>Constitutional Oaks is the proving ground: a real-world environment for renewable energy, technical infrastructure, research, workforce development, and future commercial applications.</p>
          <div className="proof-points">
            <article><span>01</span><div><b>Demonstrate</b><small>Integrate local energy and deployable infrastructure.</small></div></article>
            <article><span>02</span><div><b>Learn</b><small>Build operating knowledge, research, and workforce capability.</small></div></article>
            <article><span>03</span><div><b>Repeat</b><small>Carry a proven framework into other energy-rich communities.</small></div></article>
          </div>
          <button className="primary-button large" onClick={() => setWaitlistOpen(true)}>Join the waitlist <Icon name="arrow" /></button>
          <div className="closing-meta"><span>ENERGY / LAND / INFRASTRUCTURE</span><span>APPALACHIA → ENERGY-RICH COMMUNITIES</span></div>
        </section>
      </main>

      <footer>
        <Brand />
        <p>© 2026 POWER PASTURE</p>
        <div><a href="mailto:hello@powerpasture.energy">CONTACT ↗</a><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      {waitlistOpen && <WaitlistModal onClose={() => setWaitlistOpen(false)} />}
    </div>
  )
}

export default App
