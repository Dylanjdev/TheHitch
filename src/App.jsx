import { lazy, Suspense, useEffect, useState } from 'react'
import heroImage from './assets/Hero.webp'
import fieldImage from './assets/outpost-hero.webp'
import './App.css'

const GlobalScene = lazy(() => import('./HeroScene.jsx'))

const layers = [
  {
    id: '01',
    code: 'SOURCE',
    title: 'Power aggregation',
    copy: 'Generation, storage, conditioning, and live metering become one field-ready source layer.',
    icon: 'bolt',
    stat: 'MULTI-SOURCE',
  },
  {
    id: '02',
    code: 'HITCH',
    title: 'Universal interface',
    copy: 'One strain-relieved connection brings power, thermal, and data online without rebuilding the site.',
    icon: 'hitch',
    stat: 'ONE CONNECTION',
  },
  {
    id: '03',
    code: 'THERMAL',
    title: 'Adaptive cooling',
    copy: 'Closed-loop thermal infrastructure responds continuously to variable, high-density compute loads.',
    icon: 'thermal',
    stat: 'CLOSED-LOOP',
  },
  {
    id: '04',
    code: 'CONTROL',
    title: 'Live orchestration',
    copy: 'Every Hitch Post reports, balances, and optimizes itself as part of a distributed operating network.',
    icon: 'signal',
    stat: 'ALWAYS ONLINE',
  },
]

const sequence = [
  { id: '01', verb: 'Harvest', copy: 'The post aggregates and stores available energy before a compute rig arrives.' },
  { id: '02', verb: 'Hitch', copy: 'A mobile compute rig connects through one standardized physical interface.' },
  { id: '03', verb: 'Operate', copy: 'Power, thermal management, and telemetry synchronize in a single motion.' },
]

function Icon({ name, size = 20 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    bolt: <path d="m13.2 2-9 12h7l-.5 8 9-12h-7.2l.7-8Z" />,
    hitch: <><path d="M3 7h7v10H3zM14 5v14M10 9h4M10 15h4M19 8v8M14 12h5" /></>,
    thermal: <><path d="M14 14.7V5a2 2 0 0 0-4 0v9.7a4 4 0 1 0 4 0Z" /><path d="M12 11v6" /></>,
    signal: <><path d="M5 16a7 7 0 0 1 14 0M8 16a4 4 0 0 1 8 0" /><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg {...props}>{paths[name]}</svg>
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="The Hitch Post home">
      <span className="brand-glyph" aria-hidden="true"><i /><i /><i /></span>
      <span><b>THE HITCH POST</b><small>SOVEREIGN COMPUTE</small></span>
    </a>
  )
}

function BriefingModal({ onClose }) {
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
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="briefing-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <div className="modal-status"><i /> SECURE CHANNEL / OPEN</div>
        {!sent ? (
          <>
            <p className="eyebrow">PRIVATE BRIEFING</p>
            <h2 id="briefing-title">Connect to the network.</h2>
            <p className="modal-copy">Share your details and we’ll coordinate an executive overview of the Hitch Post deployment model.</p>
            <form onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <label>NAME<input name="name" required autoFocus placeholder="Your name" /></label>
              <label>WORK EMAIL<input name="email" required type="email" placeholder="you@company.com" /></label>
              <label>ORGANIZATION<input name="organization" placeholder="Company or fund" /></label>
              <button className="primary-button full" type="submit">Transmit request <Icon name="arrow" /></button>
            </form>
          </>
        ) : (
          <div className="success-state">
            <span><Icon name="check" size={28} /></span>
            <p className="eyebrow">TRANSMISSION RECEIVED</p>
            <h2>Signal locked.</h2>
            <p>The Hitch Post team will follow up to coordinate a private briefing.</p>
            <button className="text-button" onClick={onClose}>Return to system <Icon name="arrow" /></button>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [briefingOpen, setBriefingOpen] = useState(false)
  const [booted, setBooted] = useState(false)
  const [heroPhase, setHeroPhase] = useState('0')

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 1350)
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element))

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const root = document.documentElement
        const hero = document.querySelector('.hero')
        const clamp = (value) => Math.max(0, Math.min(1, value))
        const smooth = (start, end, value) => {
          const point = clamp((value - start) / (end - start))
          return point * point * (3 - 2 * point)
        }
        const rect = hero?.getBoundingClientRect()
        const travel = hero ? Math.max(hero.offsetHeight - window.innerHeight, 1) : 1
        const progress = rect ? clamp(-rect.top / travel) : 0
        const phaseOne = 1 - smooth(.28, .4, progress)
        const phaseTwo = smooth(.25, .4, progress) * (1 - smooth(.62, .74, progress))
        const phaseThree = smooth(.58, .74, progress)
        const phaseOneSpin = -smooth(.28, .4, progress) * 72
        const phaseTwoSpin = (1 - smooth(.25, .4, progress)) * 72 - smooth(.62, .74, progress) * 72
        const phaseThreeSpin = (1 - smooth(.58, .74, progress)) * 72

        root.style.setProperty('--scroll-y', `${window.scrollY}px`)
        root.style.setProperty('--hero-scroll', progress)
        root.style.setProperty('--intro-alpha', 1 - smooth(.05, .17, progress))
        root.style.setProperty('--phase-one-alpha', phaseOne)
        root.style.setProperty('--phase-two-alpha', phaseTwo)
        root.style.setProperty('--phase-three-alpha', phaseThree)
        root.style.setProperty('--phase-one-y', `${(1 - phaseOne) * 42}px`)
        root.style.setProperty('--phase-two-y', `${(1 - phaseTwo) * 42}px`)
        root.style.setProperty('--phase-three-y', `${(1 - phaseThree) * 42}px`)
        root.style.setProperty('--phase-one-spin', `${phaseOneSpin}deg`)
        root.style.setProperty('--phase-two-spin', `${phaseTwoSpin}deg`)
        root.style.setProperty('--phase-three-spin', `${phaseThreeSpin}deg`)
        root.style.setProperty('--hero-copy-y', `${-progress * 92}px`)
        root.style.setProperty('--hero-image-scale', `${1.04 + progress * 0.055}`)
        root.style.setProperty('--hero-image-x', `${progress * -1.2}%`)
        root.style.setProperty('--scene-y', `${progress * -24}px`)
        root.style.setProperty('--scene-rotate', `${progress * 1.6}deg`)
        root.style.setProperty('--telemetry-x', `${progress * -14}px`)
        const narrativeWidth = Math.min(340, window.innerWidth * 0.32)
        const narrativeTravel = window.innerWidth > 768
          ? Math.max(window.innerWidth - narrativeWidth - 160, 0)
          : 0
        root.style.setProperty('--narrative-x', `${progress * narrativeTravel}px`)
        root.style.setProperty('--narrative-tilt', `${(0.5 - progress) * 5}deg`)
        root.style.setProperty('--narrative-scale', `${1 - progress * 0.06}`)
        const sectionProgress = (selector) => {
          const section = document.querySelector(selector)
          if (!section) return 0
          return smooth(window.innerHeight * 0.88, window.innerHeight * 0.12, -section.getBoundingClientRect().top)
        }
        const systemSection = document.querySelector('.system-section')
        const systemTravel = systemSection ? Math.max(systemSection.offsetHeight - window.innerHeight, 1) : 1
        const systemProgress = systemSection
          ? clamp((window.scrollY - systemSection.offsetTop) / systemTravel)
          : 0
        const fieldProgress = sectionProgress('.field-section')
        const networkProgress = sectionProgress('.network-section')
        const closingProgress = sectionProgress('.closing-section')
        document.querySelectorAll('.sequence-list article').forEach((row, index) => {
          const station = 0.18 + index * 0.32
          const distance = fieldProgress - station
          const focus = clamp(1 - Math.abs(distance) / 0.22)
          row.style.setProperty('--sequence-focus', focus)
          row.style.setProperty('--sequence-shift', `${(0.5 - focus) * 10}px`)
        })
        document.querySelectorAll('.layer-grid article').forEach((card, index) => {
          const station = 0.14 + index * 0.24
          const distance = systemProgress - station
          const focus = clamp(1 - Math.abs(distance) / 0.13)
          const cardPhase = 0.5 + distance / 0.13
          card.style.setProperty('--card-focus', focus)
          card.style.setProperty('--card-opacity', `${0.04 + focus * 0.96}`)
          card.style.setProperty('--card-scale', `${0.9 + focus * 0.1}`)
          card.style.setProperty('--card-phase', cardPhase)
          card.style.setProperty('--card-turn', `${(0.5 - cardPhase) * 5}deg`)
          card.style.setProperty('--card-vertical', `${(0.5 - cardPhase) * 42}deg`)
          card.style.setProperty('--card-depth', `${(0.5 - cardPhase) * 56}px`)
          card.style.setProperty('--card-rise', `${(0.5 - cardPhase) * 12}px`)
        })
        root.style.setProperty('--system-intro-y', `${(1 - systemProgress) * 28}px`)
        root.style.setProperty('--field-image-y', `${(0.5 - fieldProgress) * 46}px`)
        root.style.setProperty('--field-copy-y', `${(fieldProgress - 0.5) * 30}px`)
        root.style.setProperty('--network-copy-x', `${(1 - networkProgress) * -34}px`)
        root.style.setProperty('--network-console-y', `${(1 - networkProgress) * 42}px`)
        root.style.setProperty('--network-console-tilt', `${(1 - networkProgress) * 3.5}deg`)
        root.style.setProperty('--closing-orbit-scale', `${0.72 + closingProgress * 0.28}`)
        root.style.setProperty('--closing-orbit-rotate', `${(1 - closingProgress) * -12}deg`)
        const nextPhase = progress < .28 ? '0' : progress < .58 ? '1' : '2'
        if (hero) hero.dataset.scrollPhase = nextPhase
        setHeroPhase((currentPhase) => currentPhase === nextPhase ? currentPhase : nextPhase)
        document.body.classList.toggle('has-scrolled', window.scrollY > 30)
        frame = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.clearTimeout(timer)
      reveal.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const goTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site" id="top">
      <Suspense fallback={<div className="global-scene-loading"><i /> INITIALIZING SPATIAL NETWORK</div>}><GlobalScene mode="power" /></Suspense>
      <div className={`boot-screen ${booted ? 'is-done' : ''}`} aria-hidden="true">
        <div className="boot-lock"><span className="boot-symbol">H</span><b>HITCH.OS</b><small>INITIALIZING SOVEREIGN COMPUTE</small></div>
        <div className="boot-line"><i /></div>
        <div className="boot-meta"><span>NODE / 001</span><span>SYS.NOMINAL</span></div>
      </div>

      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <button onClick={() => goTo('#system')}>System</button>
          <button onClick={() => goTo('#deployment')}>Deployment</button>
          <button onClick={() => goTo('#network')}>Network</button>
        </nav>
        <button className="header-action" onClick={() => setBriefingOpen(true)}>Request briefing <Icon name="arrow" size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-sticky">
            <img className="hero-image" src={heroImage} alt="Hitch Post infrastructure distributed through a mountain valley" />
            <div className="hero-telemetry" aria-hidden="true"><span><i /> FEED 04:12:38</span><span>NODE 001 / 04</span><b>98.4%</b></div>
            <div className="hero-scanline" aria-hidden="true" />
            <div className="hero-crosshair hero-crosshair-a" aria-hidden="true"><i /><span>GRID / 04</span></div>
            <div className="hero-crosshair hero-crosshair-b" aria-hidden="true"><i /><span>LIVE LINK</span></div>
            <div className="hero-grid" aria-hidden="true" />
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><span className="live-dot" /> HITCH POST / POINT 001 <i /> SYSTEM ONLINE</div>
              <h1>Compute,<br /><em>unbound.</em></h1>
              <p>Field-ready power and cooling for mobile AI infrastructure. Pull in, hitch up, and operate.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => goTo('#system')}>Explore the system <Icon name="arrow" /></button>
                <button className="text-button" onClick={() => setBriefingOpen(true)}>Investor briefing <span>↗</span></button>
              </div>
            </div>

            <div className="scroll-narrative three-text-fallback" aria-live="polite" aria-atomic="true">
              <article className="scroll-phase phase-one" aria-hidden={heroPhase !== '0'}>
                <p><span>01</span> SOURCE LAYER</p><h2>Aggregate.</h2>
                <div>Generation, grid, and reserve sources converge on one field-ready Hitch Post.</div>
              </article>
              <article className="scroll-phase phase-two" aria-hidden={heroPhase !== '1'}>
                <p><span>02</span> CONNECTION STATE</p><h2>Hitch.</h2>
                <div>A mobile compute node connects to conditioned power, closed-loop thermal, and live telemetry.</div>
              </article>
              <article className="scroll-phase phase-three" aria-hidden={heroPhase !== '2'}>
                <p><span>03</span> NETWORK STATE</p><h2>Scale.</h2>
                <div>Every deployment becomes a reusable node in a distributed infrastructure network.</div>
              </article>
            </div>

            <div className="scroll-state" aria-hidden="true">
              <span>3D SEQUENCE</span><div><i /><b>00</b><b>01</b><b>02</b><b>03</b></div>
            </div>
            <div className="hero-foot">
              <span>SCROLL TO CONTROL SYSTEM</span><i />
              <div><span>37.2382° N</span><span>81.2964° W</span></div>
            </div>
          </div>
        </section>

        <div className="signal-rail" aria-hidden="true">
          <div><span>SOVEREIGN POWER</span><i /> <span>ADAPTIVE THERMAL</span><i /> <span>UNIVERSAL HITCH</span><i /> <span>MOBILE COMPUTE</span><i /></div>
          <div><span>SOVEREIGN POWER</span><i /> <span>ADAPTIVE THERMAL</span><i /> <span>UNIVERSAL HITCH</span><i /> <span>MOBILE COMPUTE</span><i /></div>
        </div>

        <section className="system-section" id="system">
          <div className="system-stage">
            <div className="section-intro" data-reveal>
              <p className="section-code">01 / OPERATING SYSTEM</p>
              <div><h2>Infrastructure that moves at <em>compute speed.</em></h2><p>Data centers take years. AI demand moves in months. The Hitch Post separates permanent utility infrastructure from movable compute—turning fixed constraints into a flexible network.</p></div>
            </div>

            <div className="layer-grid" data-reveal>
              {layers.map((layer) => (
                <article key={layer.id}>
                  <div className="layer-top"><span>{layer.id} / {layer.code}</span><Icon name={layer.icon} size={22} /></div>
                  <div className="layer-graphic"><span /><i /><i /><i /></div>
                  <h3>{layer.title}</h3>
                  <p>{layer.copy}</p>
                  <small>{layer.stat} <b>↗</b></small>
                </article>
              ))}
            </div>
            <div className="system-progress" aria-hidden="true"><span>OPERATING SYSTEM / SEQUENCE</span><i /><b>01</b><b>02</b><b>03</b><b>04</b></div>
          </div>
        </section>

        <section className="field-section" id="deployment">
          <div className="field-visual" data-reveal>
            <img src={fieldImage} alt="A Hitch Post site connected to a mobile compute rig" />
            <div className="field-shade" />
            <div className="field-scan" />
            <div className="field-route" aria-hidden="true"><i /><i /><i /></div>
            <div className="target target-one"><i /></div>
            <div className="target target-two"><i /></div>
            <div className="field-hud top"><span>LIVE DEPLOYMENT / POINT 001</span><span>FEED 04:12:38</span></div>
            <div className="field-hud bottom"><span><small>CONNECTION</small><b>NOMINAL</b></span><span><small>RESERVE</small><b>84%</b></span><span><small>LATENCY</small><b>04 MS</b></span></div>
          </div>
          <div className="field-copy" data-reveal>
            <p className="section-code">02 / DEPLOYMENT LOGIC</p>
            <h2>One post.<br /><em>Three states.</em></h2>
            <p className="field-lede">The asset never waits. It produces before the rig arrives, connects in one motion, and operates as a synchronized system.</p>
            <div className="sequence-list">
              {sequence.map((item) => <article key={item.id}><span>{item.id}</span><div><h3>{item.verb}.</h3><p>{item.copy}</p></div><i /></article>)}
            </div>
          </div>
        </section>

        <section className="network-section" id="network">
          <div className="network-copy" data-reveal>
            <p className="section-code">03 / NETWORK EFFECT</p>
            <h2>Fix the post.<br />Mobilize the <em>rig.</em></h2>
            <p>Standardized connection points let compute move to available energy. Every deployment expands a reusable network—not another stranded facility.</p>
            <button className="outline-button" onClick={() => setBriefingOpen(true)}>View deployment thesis <Icon name="arrow" /></button>
          </div>
          <div className="network-readout" data-reveal>
            <div className="network-readout-top"><span><i /> LIVE 3D TOPOLOGY</span><b>04 NODES ONLINE</b></div>
            <div className="network-stats"><span><small>AVAILABLE CAPACITY</small><b>31.4 MW</b></span><span><small>FLEET UPTIME</small><b>99.98%</b></span><span><small>ACTIVE RIGS</small><b>03 / 04</b></span></div>
            <div className="network-legend"><span><i className="power" /> HITCH POST</span><span><i className="compute" /> COMPUTE NODE</span><span><i className="route" /> ACTIVE ROUTE</span></div>
          </div>
        </section>

        <section className="closing-section" data-reveal>
          <div className="closing-grid" aria-hidden="true" />
          <div className="closing-orbit" aria-hidden="true"><i /><i /><i /><span>H</span></div>
          <p className="eyebrow"><span className="live-dot" /> ACCESS POINT / OPEN</p>
          <h2>Bring compute<br /><em>to the power.</em></h2>
          <p>Ready to see the next infrastructure layer?</p>
          <button className="primary-button large" onClick={() => setBriefingOpen(true)}>Request a private briefing <Icon name="arrow" /></button>
          <div className="closing-meta"><span>NDA-READY MATERIALS</span><span>INVESTORS / OPERATORS / STRATEGIC PARTNERS</span></div>
        </section>
      </main>

      <footer>
        <Brand />
        <p>© 2026 THE HITCH POST NETWORK</p>
        <div><a href="mailto:hello@thehitchpost.energy">CONTACT ↗</a><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      {briefingOpen && <BriefingModal onClose={() => setBriefingOpen(false)} />}
    </div>
  )
}

export default App
