import { useEffect, useState } from 'react'
import heroImage from './assets/Hero.webp'
import fieldImage from './assets/outpost-hero.webp'
import geothermalImage from './assets/GeoThermalRepresentation.png'
import brandLogo from './assets/PowerPastureLogo.png'
import './App.css'

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
    code: 'INTERFACE',
    title: 'Universal interface',
    copy: 'One strain-relieved connection brings power, thermal, and data online without rebuilding the site.',
    icon: 'interface',
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
    copy: 'Every Power Pasture site reports, balances, and optimizes itself as part of a distributed operating network.',
    icon: 'signal',
    stat: 'ALWAYS ONLINE',
  },
]

const sequence = [
  { id: '01', verb: 'Harvest', copy: 'The post aggregates and stores available energy before a compute rig arrives.' },
  { id: '02', verb: 'Connect', copy: 'A mobile compute rig connects through one standardized physical interface.' },
  { id: '03', verb: 'Operate', copy: 'Power, thermal management, and telemetry synchronize in a single motion.' },
]

function Icon({ name, size = 20 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    bolt: <path d="m13.2 2-9 12h7l-.5 8 9-12h-7.2l.7-8Z" />,
    interface: <><path d="M3 7h7v10H3zM14 5v14M10 9h4M10 15h4M19 8v8M14 12h5" /></>,
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
    <a className="brand" href="#top" aria-label="Power Pasture home">
      <span className="brand-mark" aria-hidden="true"><img src={brandLogo} alt="" /></span>
      <span><b>POWER PASTURE</b><small>SOVEREIGN COMPUTE</small></span>
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
            <p className="modal-copy">Join the Power Pasture waitlist for deployment updates and early access opportunities.</p>
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
            <p>We’ll keep you updated as the Power Pasture network comes online.</p>
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
  const [heroPhase, setHeroPhase] = useState('0')

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 1350)
    const root = document.documentElement
    const hero = document.querySelector('.hero')
    const fieldSection = document.querySelector('.field-section')
    const networkSection = document.querySelector('.network-section')
    const closingSection = document.querySelector('.closing-section')
    const sequenceRows = [...document.querySelectorAll('.sequence-list article')]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
      setVariable(`--phase-${chapter}-y`, `${(1 - entry) * 76 - exit * 48}px`)
      setVariable(`--phase-${chapter}-depth`, `${(1 - visibility) * -140}px`)
      setVariable(`--phase-${chapter}-tilt`, `${(1 - entry) * -9 + exit * 7}deg`)
      setVariable(`--phase-${chapter}-blur`, `${(1 - visibility) * 12}px`)
      setVariable(`--phase-${chapter}-clip-top`, `${(1 - entry) * 58}%`)
      setVariable(`--phase-${chapter}-clip-bottom`, `${exit * 52}%`)
    }

    const renderHero = (progress) => {
      const momentum = Math.max(-1, Math.min(1, (progress - previousHeroProgress) * 95))
      const introExit = smooth(.035, .205, progress)
      const storyEntrance = smooth(.135, .235, progress)
      const storyExit = smooth(.89, .985, progress)
      const storyVisibility = storyEntrance * (1 - storyExit)

      setVariable('--hero-scroll', progress)
      setVariable('--intro-alpha', 1 - introExit)
      setVariable('--intro-eyebrow-exit', smooth(.025, .105, progress))
      setVariable('--intro-title-exit', smooth(.055, .155, progress))
      setVariable('--intro-copy-exit', smooth(.085, .185, progress))
      setVariable('--intro-actions-exit', smooth(.11, .215, progress))
      setVariable('--narrative-alpha', storyVisibility)
      setVariable('--narrative-y', `${(1 - storyEntrance) * 64 - storyExit * 42 + momentum * -14}px`)
      setVariable('--narrative-scale', .94 + storyVisibility * .06)
      setVariable('--chapter-progress', smooth(.18, .9, progress))
      setVariable('--route-trunk-offset', 1 - smooth(.18, .42, progress))
      setVariable('--route-branch-offset', 1 - smooth(.4, .69, progress))
      setVariable('--route-network-offset', 1 - smooth(.66, .91, progress))
      setVariable('--route-alpha', storyVisibility * .9)
      setVariable('--route-node-one', smooth(.25, .36, progress) * (1 - smooth(.58, .71, progress) * .35))
      setVariable('--route-node-two', smooth(.48, .61, progress) * (1 - smooth(.79, .91, progress) * .25))
      setVariable('--route-node-three', smooth(.7, .84, progress))
      setVariable('--frame-alpha', storyVisibility)
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
  }, [])

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
            <p><span>01</span> SOURCE LAYER</p><h2>Aggregate.</h2>
            <div>Generation, grid, and reserve sources converge on one field-ready Power Pasture site.</div>
          </article>
          <article className="scroll-phase phase-two" aria-hidden={heroPhase !== '1'}>
            <p><span>02</span> CONNECTION STATE</p><h2>Connect.</h2>
            <div>A mobile compute node connects to conditioned power, closed-loop thermal, and live telemetry.</div>
          </article>
          <article className="scroll-phase phase-three" aria-hidden={heroPhase !== '2'}>
            <p><span>03</span> NETWORK STATE</p><h2>Scale.</h2>
            <div>Every deployment becomes a reusable node in a distributed infrastructure network.</div>
          </article>
        </div>
        <div className="narrative-rail" aria-hidden="true"><i /><span className="is-one">01</span><span className="is-two">02</span><span className="is-three">03</span></div>
      </div>
      <div className={`boot-screen ${booted ? 'is-done' : ''}`} aria-hidden="true">
        <div className="boot-lock"><span className="boot-brand" aria-hidden="true"><img src={brandLogo} alt="" /></span><b>POWER PASTURE OS</b><small>INITIALIZING SOVEREIGN COMPUTE</small></div>
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
        <button className="header-action" onClick={() => setWaitlistOpen(true)}>Join the waitlist <Icon name="arrow" size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-sticky">
            <div className="hero-visual">
              <img className="hero-image" src={heroImage} alt="Power Pasture infrastructure distributed through a mountain valley" />
              <div className="hero-visual-shade" aria-hidden="true" />
              <svg className="hero-route-map" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                <defs><filter id="route-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                <path className="route-trunk route-ghost" pathLength="1" d="M168 500 C250 456 324 452 401 394 C472 341 520 327 593 302" />
                <path className="route-trunk" pathLength="1" d="M168 500 C250 456 324 452 401 394 C472 341 520 327 593 302" />
                <path className="route-branch route-ghost" pathLength="1" d="M593 302 C655 278 704 245 751 213" />
                <path className="route-branch" pathLength="1" d="M593 302 C655 278 704 245 751 213" />
                <path className="route-network route-ghost" pathLength="1" d="M751 213 C806 178 850 158 914 144 M751 213 C822 236 870 273 934 286 M751 213 C754 153 747 118 780 80" />
                <path className="route-network" pathLength="1" d="M751 213 C806 178 850 158 914 144 M751 213 C822 236 870 273 934 286 M751 213 C754 153 747 118 780 80" />
                <g className="route-node route-node-one"><circle cx="168" cy="500" r="18" /><circle cx="168" cy="500" r="4" /><text x="188" y="490">SOURCE / 31.4 MW</text></g>
                <g className="route-node route-node-two"><circle cx="593" cy="302" r="18" /><circle cx="593" cy="302" r="4" /><text x="613" y="292">LINK / NOMINAL</text></g>
                <g className="route-node route-node-three"><circle cx="751" cy="213" r="18" /><circle cx="751" cy="213" r="4" /><text x="771" y="203">NETWORK / LIVE</text></g>
              </svg>
              <div className="hero-grid" aria-hidden="true" />
              <div className="hero-frame-corners" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="hero-frame-meta" aria-hidden="true"><span>POWER PASTURE // TERRAIN MODEL 001</span><span>SCROLL-LINKED FEED // LIVE</span></div>
              <div className="hero-telemetry" aria-hidden="true"><span><i /> FEED 04:12:38</span><span>NODE 001 / 04</span><b>98.4%</b></div>
              <div className="hero-scanline" aria-hidden="true" />
              <div className="hero-crosshair hero-crosshair-a" aria-hidden="true"><i /><span>GRID / 04</span></div>
              <div className="hero-crosshair hero-crosshair-b" aria-hidden="true"><i /><span>LIVE LINK</span></div>
              <div className="hero-glow" aria-hidden="true" />
            </div>
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><span className="live-dot" /> POWER PASTURE / POINT 001 <i /> SYSTEM ONLINE</div>
              <h1>Compute,<br /><em>unbound.</em></h1>
              <p>Field-ready power and cooling for mobile AI infrastructure. Pull in, connect, and operate.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => goTo('#system')}>Explore the system <Icon name="arrow" /></button>
                <button className="text-button" onClick={() => setWaitlistOpen(true)}>Join the waitlist <span>↗</span></button>
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
          <div><span>SOVEREIGN POWER</span><i /> <span>ADAPTIVE THERMAL</span><i /> <span>UNIVERSAL LINK</span><i /> <span>MOBILE COMPUTE</span><i /></div>
          <div><span>SOVEREIGN POWER</span><i /> <span>ADAPTIVE THERMAL</span><i /> <span>UNIVERSAL LINK</span><i /> <span>MOBILE COMPUTE</span><i /></div>
        </div>

        <section className="system-section" id="system">
          <div className="system-stage">
            <div className="section-intro" data-reveal>
              <p className="section-code">01 / OPERATING SYSTEM</p>
              <div><h2>Infrastructure that moves at <em>compute speed.</em></h2><p>Data centers take years. AI demand moves in months. Power Pasture separates permanent utility infrastructure from movable compute—turning fixed constraints into a flexible network.</p></div>
            </div>

            <div className="layer-grid">
              {layers.map((layer) => (
                <article className="system-card" data-reveal data-index={layer.id} key={layer.id}>
                  <div className="layer-top"><span>{layer.id} / {layer.code}</span><span className="layer-icon"><Icon name={layer.icon} size={20} /></span></div>
                  <div className="layer-graphic" aria-hidden="true"><span /><i /><i /><i /></div>
                  <h3>{layer.title}</h3>
                  <p>{layer.copy}</p>
                  <small>{layer.stat} <b>↗</b></small>
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

        <section className="geothermal-section" id="thermal" aria-labelledby="geothermal-title" data-reveal>
          <div className="geothermal-shell">
            <header className="geothermal-copy">
              <p className="geothermal-kicker">Closed Loop Systems</p>
              <h2 id="geothermal-title">Sustainable<br /><em>by design.</em></h2>
              <p>Our containerized data centers use closed loop geothermal cooling to deliver high performance with minimal environmental impact.</p>
            </header>

            <figure className="geothermal-product">
              <img src={geothermalImage} alt="Containerized data center connected to an underground closed-loop geothermal cooling system" />
              <figcaption><span>Closed loop thermal system</span><b>01</b></figcaption>
            </figure>

            <div className="geothermal-detail">
              <div className="geothermal-detail-copy">
                <p className="geothermal-kicker">Ground loop</p>
                <h3>Geothermal cooling</h3>
                <p>A closed loop system circulates fluid through underground pipes, using the Earth’s stable temperature to cool efficiently and reliably year-round.</p>
              </div>

              <div className="geothermal-features" aria-label="Geothermal cooling benefits">
                <span><i><Icon name="bolt" size={20} /></i><b>Efficient</b><small>Lower energy use</small></span>
                <span><i><Icon name="signal" size={20} /></i><b>Quiet</b><small>No noisy cooling towers</small></span>
                <span><i><Icon name="thermal" size={20} /></i><b>Sustainable</b><small>Reduced carbon impact</small></span>
              </div>
            </div>
          </div>
        </section>

        <section className="network-section" id="network">
          <div className="network-copy" data-reveal>
            <p className="section-code">03 / NETWORK EFFECT</p>
            <h2>Fix the post.<br />Mobilize the <em>rig.</em></h2>
            <p>Standardized connection points let compute move to available energy. Every deployment expands a reusable network—not another stranded facility.</p>
            <button className="outline-button" onClick={() => setWaitlistOpen(true)}>Join deployment waitlist <Icon name="arrow" /></button>
          </div>
          <div className="network-readout" data-reveal>
            <div className="network-readout-top"><span><i /> LIVE NETWORK TOPOLOGY</span><b>04 NODES ONLINE</b></div>
            <div className="network-stats"><span><small>AVAILABLE CAPACITY</small><b>31.4 MW</b></span><span><small>FLEET UPTIME</small><b>99.98%</b></span><span><small>ACTIVE RIGS</small><b>03 / 04</b></span></div>
            <div className="network-legend"><span><i className="power" /> POWER PASTURE</span><span><i className="compute" /> COMPUTE NODE</span><span><i className="route" /> ACTIVE ROUTE</span></div>
          </div>
        </section>

        <section className="closing-section" data-reveal>
          <div className="closing-grid" aria-hidden="true" />
          <div className="closing-orbit" aria-hidden="true"><i /><i /><i /><span>P</span></div>
          <p className="eyebrow"><span className="live-dot" /> ACCESS POINT / OPEN</p>
          <h2>Bring compute<br /><em>to the power.</em></h2>
          <p>Ready to see the next infrastructure layer?</p>
          <button className="primary-button large" onClick={() => setWaitlistOpen(true)}>Join the waitlist <Icon name="arrow" /></button>
          <div className="closing-meta"><span>NDA-READY MATERIALS</span><span>INVESTORS / OPERATORS / STRATEGIC PARTNERS</span></div>
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
