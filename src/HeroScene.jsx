import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const palettes = {
  power: new THREE.Color('#63f5d8'),
  thermal: new THREE.Color('#69a87a'),
  uplink: new THREE.Color('#8ba6ff'),
}

function HeroScene({ mode = 'power' }) {
  const canvasRef = useRef(null)
  const modeRef = useRef(mode)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return undefined

    const scrollSection = document.querySelector('.hero')

    const pageSections = {
      system: document.querySelector('.system-section'),
      field: document.querySelector('.field-section'),
      network: document.querySelector('.network-section'),
      closing: document.querySelector('.closing-section'),
    }

    const context = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    })

    if (!context) return undefined

    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, false)
    context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.75),
    )

    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    renderer.setClearColor(0x020507, 0)

    const scene = new THREE.Scene()

    scene.fog = new THREE.FogExp2(
      0x0a0f14,
      0.032,
    )

    const camera = new THREE.PerspectiveCamera(
      34,
      1,
      0.1,
      100,
    )

    camera.position.set(
      0.35,
      3.6,
      8.8,
    )

    const graph = new THREE.Group()

    graph.rotation.y = -0.18

    scene.add(graph)

    const foreground = new THREE.Group()
    foreground.renderOrder = 40
    scene.add(foreground)

    const foregroundMaterials = []
    const foregroundLines = []
    const foregroundNodes = []
    const contentRigs = []
    const networkConstellation = new THREE.Group()
    const networkConstellationMaterials = []
    const networkConstellationLines = []
    const networkConstellationNodes = []
    const networkConstellationPulses = []
    networkConstellation.position.set(0.1, -0.15, -0.35)
    foreground.add(networkConstellation)

    const constellationPoints = [
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(-0.85, 0.05, 0.1),
      new THREE.Vector3(0.92, 0.12, -0.05),
      new THREE.Vector3(-0.45, -0.68, 0),
      new THREE.Vector3(0.5, -0.62, 0.05),
    ]
    constellationPoints.forEach((point, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: index === 0 ? 0x69ffe1 : 0x8ba6ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
      networkConstellationMaterials.push(material)
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.1 : 0.055, 12, 12),
        material,
      )
      node.position.copy(point)
      networkConstellation.add(node)
      networkConstellationNodes.push(node)
    })
    constellationPoints.slice(1).forEach((point, index) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([constellationPoints[0], point])
      const material = new THREE.LineBasicMaterial({
        color: 0x8ba6ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
      networkConstellationMaterials.push(material)
      const line = new THREE.Line(geometry, material)
      networkConstellation.add(line)
      networkConstellationLines.push(line)
      line.userData.offset = index * 0.18
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x69ffe1,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
      networkConstellationMaterials.push(pulseMaterial)
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), pulseMaterial)
      pulse.userData.start = constellationPoints[0]
      pulse.userData.end = point
      pulse.userData.offset = index * 0.21
      networkConstellation.add(pulse)
      networkConstellationPulses.push(pulse)
    })

    const createContentRig = (color, shape = 'ring') => {
      const group = new THREE.Group()
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
      const geometry = shape === 'ring'
        ? new THREE.TorusGeometry(0.28, 0.012, 8, 32)
        : new THREE.OctahedronGeometry(0.25, 0)
      const core = new THREE.Mesh(geometry, material)
      group.add(core)
      const axis = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.008, 0.008),
        material.clone(),
      )
      group.add(axis)
      const vertical = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.7, 0.008),
        material.clone(),
      )
      group.add(vertical)
      foreground.add(group)
      contentRigs.push({ group, core, materials: [material, axis.material, vertical.material] })
    }

    createContentRig(0x69ffe1, 'ring')
    createContentRig(0x69a87a, 'octa')
    createContentRig(0x8ba6ff, 'ring')
    createContentRig(0x69ffe1, 'octa')

    const makeForegroundLine = (points, color, opacity) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
      foregroundMaterials.push(material)
      const line = new THREE.Line(geometry, material)
      foreground.add(line)
      foregroundLines.push(line)
    }

    makeForegroundLine([
      new THREE.Vector3(-3.8, -2.2, 0),
      new THREE.Vector3(-3.8, 2.8, 0),
    ], 0x69ffe1, 0.16)
    makeForegroundLine([
      new THREE.Vector3(3.8, -2.2, 0),
      new THREE.Vector3(3.8, 2.8, 0),
    ], 0x8ba6ff, 0.13)

    const particlePositions = []
    for (let index = 0; index < 42; index += 1) {
      const angle = index * 2.39996
      const radius = 1.2 + (index % 7) * 0.34
      particlePositions.push(
        Math.cos(angle) * radius,
        -1.8 + (index % 9) * 0.5,
        -0.4 - (index % 4) * 0.12,
      )
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x69ffe1,
      size: 0.035,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    })
    foregroundMaterials.push(particleMaterial)
    foreground.add(new THREE.Points(particleGeometry, particleMaterial))

    ;[-2.9, 2.9].forEach((x, index) => {
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: index ? 0x8ba6ff : 0x69ffe1,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
      foregroundMaterials.push(nodeMaterial)
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        nodeMaterial,
      )
      node.position.set(x, 0.8, 0)
      foreground.add(node)
      foregroundNodes.push(node)
    })

    const activeMaterials = []
    const nodeRecords = []
    const edgeRecords = []
    const textSprites = []
    const artifactRecords = []

    const createTextSprite = (
      phase,
      code,
      title,
      copy,
    ) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 360
      const context = canvas.getContext('2d')

      context.clearRect(0, 0, canvas.width, canvas.height)
      const backing = context.createLinearGradient(0, 0, canvas.width, 0)
      backing.addColorStop(0, 'rgba(5, 11, 14, 0.9)')
      backing.addColorStop(0.72, 'rgba(5, 11, 14, 0.46)')
      backing.addColorStop(1, 'rgba(5, 11, 14, 0)')
      context.fillStyle = backing
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.shadowColor = 'rgba(105, 255, 225, 0.5)'
      context.shadowBlur = 16
      context.font = '600 34px IBM Plex Mono, monospace'
      context.fillStyle = '#69ffe1'
      context.fillText(`${phase} / ${code}`, 34, 44)
      context.shadowColor = 'rgba(0, 0, 0, 0.9)'
      context.shadowBlur = 12
      context.fillStyle = '#e9f1ef'
      context.font = '800 88px Space Grotesk, sans-serif'
      context.fillText(title, 34, 132)
      context.shadowBlur = 8
      context.fillStyle = 'rgba(233, 241, 239, 0.78)'
      context.font = '500 34px Space Grotesk, sans-serif'
      const words = copy.split(' ')
      let line = ''
      let lineY = 188
      words.forEach((word) => {
        const nextLine = `${line} ${word}`.trim()
        if (context.measureText(nextLine).width > 720) {
          context.fillText(line, 34, lineY)
          line = word
          lineY += 40
        } else {
          line = nextLine
        }
      })
      context.fillText(line, 34, lineY)
      context.fillStyle = 'rgba(105, 255, 225, 0.65)'
      context.fillRect(34, 310, 260, 2)
      context.fillStyle = 'rgba(233, 241, 239, 0.42)'
      context.font = '500 22px IBM Plex Mono, monospace'
      context.fillText('HITCH.OS / SPATIAL SEQUENCE', 34, 340)

      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const sprite = new THREE.Mesh(
        new THREE.PlaneGeometry(3.15, 1.08),
        material,
      )
      sprite.position.set(-2.2, 1.28, 0.9)
      sprite.renderOrder = 20
      sprite.userData.phase = phase
      graph.add(sprite)
      textSprites.push(sprite)
    }

    createTextSprite('01', 'SOURCE LAYER', 'Aggregate.', 'Generation, grid, and reserve sources converge on one field-ready Hitch Post.')
    createTextSprite('02', 'CONNECTION STATE', 'Hitch.', 'A mobile compute node connects to conditioned power, closed-loop thermal, and live telemetry.')
    createTextSprite('03', 'NETWORK STATE', 'Scale.', 'Every deployment becomes a reusable node in a distributed infrastructure network.')

    const createArtifact = (
      kind,
      color,
      position,
    ) => {
      const group = new THREE.Group()
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          kind === 'closing' ? 0.82 : 0.58,
          0.012,
          8,
          64,
        ),
        material,
      )
      ring.rotation.x = Math.PI / 2
      group.add(ring)

      const spine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, kind === 'network' ? 1.7 : 1.2, 8),
        material.clone(),
      )
      group.add(spine)

      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(
          kind === 'closing' ? 1.04 : 0.78,
          0.006,
          6,
          48,
        ),
        material.clone(),
      )
      orbit.rotation.set(0.8, 0.4, 0.2)
      group.add(orbit)
      group.position.copy(position)
      graph.add(group)
      artifactRecords.push({ group, ring, orbit, kind })
    }

    createArtifact('system', 0x69ffe1, new THREE.Vector3(-1.1, 0.42, 0.8))
    createArtifact('field', 0x69a87a, new THREE.Vector3(1.2, 0.36, 0.7))
    createArtifact('network', 0x8ba6ff, new THREE.Vector3(0.2, 0.62, -0.7))
    createArtifact('closing', 0x69ffe1, new THREE.Vector3(0, 0.72, 0.2))

    const activeMaterial = (
      opacity = 1,
      basic = false,
    ) => {
      const color =
        palettes.power.clone()

      const material = basic
        ? new THREE.MeshBasicMaterial({
            color,
            transparent: opacity < 1,
            opacity,
            blending:
              THREE.AdditiveBlending,
            depthWrite: opacity >= 1,
          })
        : new THREE.MeshStandardMaterial({
            color,
            emissive: color.clone(),
            emissiveIntensity: 1.65,
            metalness: 0.3,
            roughness: 0.2,
            transparent: opacity < 1,
            opacity,
          })

      activeMaterials.push(material)

      return material
    }

    const makeSoftLine = (
      geometry,
      color,
      opacity,
    ) =>
      new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
        }),
      )

    /*
     * Creates a beveled industrial-style box.
     * This is the main replacement for the old
     * primitive-looking cylinders and spheres.
     */
    const roundedBox = (
      width,
      height,
      depth,
      radius,
      color,
      metalness = 0.72,
      roughness = 0.28,
    ) => {
      const shape =
        new THREE.Shape()

      const x = width / 2
      const y = height / 2

      const r = Math.min(
        radius,
        width / 2,
        height / 2,
      )

      shape.moveTo(-x + r, -y)
      shape.lineTo(x - r, -y)

      shape.quadraticCurveTo(
        x,
        -y,
        x,
        -y + r,
      )

      shape.lineTo(x, y - r)

      shape.quadraticCurveTo(
        x,
        y,
        x - r,
        y,
      )

      shape.lineTo(-x + r, y)

      shape.quadraticCurveTo(
        -x,
        y,
        -x,
        y - r,
      )

      shape.lineTo(
        -x,
        -y + r,
      )

      shape.quadraticCurveTo(
        -x,
        -y,
        -x + r,
        -y,
      )

      const geometry =
        new THREE.ExtrudeGeometry(
          shape,
          {
            depth,
            bevelEnabled: true,
            bevelSegments: 3,
            bevelSize: radius * 0.32,
            bevelThickness:
              radius * 0.32,
            curveSegments: 3,
          },
        )

      geometry.center()

      return new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial(
          {
            color,
            metalness,
            roughness,
          },
        ),
      )
    }

    /*
     * Tiny vent slots across the front
     * surface of the hardware.
     */
    const createVentArray = (
      group,
      width,
      count,
      y,
      z,
      spacing,
      material,
    ) => {
      const ventGeometry =
        new THREE.BoxGeometry(
          0.035,
          0.018,
          0.018,
        )

      for (
        let index = 0;
        index < count;
        index += 1
      ) {
        const x =
          -width / 2 +
          spacing / 2 +
          index * spacing

        const vent =
          new THREE.Mesh(
            ventGeometry,
            material,
          )

        vent.position.set(
          x,
          y,
          z,
        )

        group.add(vent)
      }
    }

    /*
     * Creates a physical-looking I/O port
     * with an illuminated status indicator.
     */
    const createPort = (
      group,
      position,
      size,
      material,
      glowMaterial,
    ) => {
      const housing =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            size * 1.5,
            size,
            size * 0.55,
          ),
          material,
        )

      housing.position.copy(
        position,
      )

      group.add(housing)

      const light =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            size * 0.58,
            size * 0.22,
            size * 0.62,
          ),
          glowMaterial,
        )

      light.position.set(
        position.x,
        position.y,
        position.z +
          size * 0.02,
      )

      group.add(light)

      return light
    }

    /*
     * Builds the actual hardware modules.
     *
     * hub     = central AI/control unit
     * compute = larger accelerator unit
     * source  = incoming source hardware
     * network = smaller edge/network hardware
     */
    const createNode = ({
      position,
      size = 1,
      kind = 'network',
      initialScale = 1,
    }) => {
      const group =
        new THREE.Group()

      group.position.copy(position)

      group.scale.setScalar(
        initialScale,
      )

      graph.add(group)

      const shellColor =
        kind === 'hub'
          ? 0x1a2a32
          : kind === 'compute'
            ? 0x1d2f38
            : 0x14202a

      /*
       * Main chassis.
       */
      const shell =
        roundedBox(
          0.92 * size,
          0.5 * size,
          0.62 * size,
          0.065 * size,
          shellColor,
          0.92,
          0.15,
        )

      shell.position.y =
        0.28 * size

      group.add(shell)

      /*
       * Recessed front panel.
       */
      const inset =
        roundedBox(
          kind === 'hub'
            ? 0.68 * size
            : 0.6 * size,

          kind === 'hub'
            ? 0.31 * size
            : 0.27 * size,

          0.045 * size,

          0.032 * size,

          0x243540,

          0.75,
          0.25,
        )

      inset.position.set(
        0,
        0.29 * size,
        0.325 * size,
      )

      group.add(inset)

      /*
       * Dark inner cavity.
       */
      const innerMaterial =
        new THREE.MeshStandardMaterial(
          {
            color: 0x0f1820,
            metalness: 0.68,
            roughness: 0.32,
          },
        )

      /*
       * Illuminated processor / status core.
       */
      const coreMaterial =
        activeMaterial(
          kind === 'hub'
            ? 0.96
            : 0.82,
        )

      const core =
        new THREE.Mesh(
          kind === 'hub'
            ? new THREE.BoxGeometry(
                0.28 * size,
                0.11 * size,
                0.035 * size,
              )
            : new THREE.BoxGeometry(
                0.18 * size,
                0.08 * size,
                0.028 * size,
              ),
          coreMaterial,
        )

      core.position.set(
        0,
        kind === 'hub'
          ? 0.31 * size
          : 0.3 * size,
        0.355 * size,
      )

      group.add(core)

      /*
       * Dark frame around the illuminated core.
       */
      const coreFrame =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            kind === 'hub'
              ? 0.4 * size
              : 0.28 * size,

            kind === 'hub'
              ? 0.19 * size
              : 0.14 * size,

            0.025 * size,
          ),
          innerMaterial,
        )

      coreFrame.position.set(
        0,
        core.position.y,
        0.34 * size,
      )

      group.add(coreFrame)

      /*
       * Fine illuminated edge detail.
       */
      const edgeStripMaterial =
        activeMaterial(
          kind === 'hub'
            ? 0.24
            : 0.13,
          true,
        )

      const edgeStrip =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.72 * size,
            0.012 * size,
            0.014 * size,
          ),
          edgeStripMaterial,
        )

      edgeStrip.position.set(
        0,
        0.51 * size,
        0.305 * size,
      )

      group.add(edgeStrip)

      /*
       * Front ventilation.
       */
      const ventMaterial =
        new THREE.MeshStandardMaterial(
          {
            color: 0x2a4650,
            metalness: 0.62,
            roughness: 0.35,
          },
        )

      createVentArray(
        group,
        0.52 * size,
        kind === 'hub'
          ? 9
          : 7,
        0.15 * size,
        0.321 * size,
        0.065 * size,
        ventMaterial,
      )

      /*
       * Heavy side rails.
       */
      const sideRailMaterial =
        new THREE.MeshStandardMaterial(
          {
            color: 0x304a54,
            metalness: 0.85,
            roughness: 0.18,
          },
        )

      ;[-1, 1].forEach(
        (side) => {
          const rail =
            new THREE.Mesh(
              new THREE.BoxGeometry(
                0.035 * size,
                0.31 * size,
                0.48 * size,
              ),
              sideRailMaterial,
            )

          rail.position.set(
            0.47 * size * side,
            0.28 * size,
            0,
          )

          group.add(rail)
        },
      )

      /*
       * I/O ports.
       */
      const portGlowMaterial =
        activeMaterial(
          kind === 'hub'
            ? 0.9
            : 0.72,
          true,
        )

      const portMaterial =
        new THREE.MeshStandardMaterial(
          {
            color: 0x243f48,
            metalness: 0.78,
            roughness: 0.28,
          },
        )

      const portLights = []

      const portCount =
        kind === 'hub'
          ? 3
          : kind === 'compute'
            ? 4
            : 2

      for (
        let index = 0;
        index < portCount;
        index += 1
      ) {
        const x =
          (
            index -
            (portCount - 1) / 2
          ) *
          0.13 *
          size

        const light =
          createPort(
            group,
            new THREE.Vector3(
              x,
              0.27 * size,
              -0.325 * size,
            ),
            0.065 * size,
            portMaterial,
            portGlowMaterial.clone(),
          )

        portLights.push(light)

        activeMaterials.push(
          light.material,
        )
      }

      /*
       * Top panel.
       */
      const topPanel =
        roundedBox(
          0.56 * size,
          0.1 * size,
          0.35 * size,
          0.025 * size,

          kind === 'hub'
            ? 0x243540
            : 0x1f323c,

          0.84,
          0.22,
        )

      topPanel.position.set(
        0,
        0.55 * size,
        0,
      )

      group.add(topPanel)

      /*
       * Central hub gets additional
       * elevated accelerator hardware.
       */
      if (kind === 'hub') {
        const upperCoreMaterial =
          activeMaterial(
            0.32,
            true,
          )

        const upperCore =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              0.2 * size,
              0.045 * size,
              0.18 * size,
            ),
            upperCoreMaterial,
          )

        upperCore.position.set(
          0,
          0.62 * size,
          0.015 * size,
        )

        group.add(upperCore)

        const frame =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              0.31 * size,
              0.018 * size,
              0.26 * size,
            ),
            new THREE.MeshStandardMaterial(
              {
                color: 0x364a50,
                metalness: 0.7,
                roughness: 0.25,
              },
            ),
          )

        frame.position.copy(
          upperCore.position,
        )

        group.add(frame)
      }

      nodeRecords.push({
        group,
        core,
        shell,
        edgeStrip,
        portLights,
        kind,
        initialScale,
      })

      return {
        group,

        point: position
          .clone()
          .setY(
            position.y +
              (kind === 'hub'
                ? 0.72
                : 0.42) *
                size,
          ),
      }
    }

    /*
     * CENTRAL HUB
     */
    const hub = createNode({
      position:
        new THREE.Vector3(
          0,
          0,
          0,
        ),

      size: 0.78,

      kind: 'hub',
    })

    /*
     * SOURCE HARDWARE
     */
    const sourceNodes = [
      createNode({
        position:
          new THREE.Vector3(
            -2.55,
            0,
            -1.25,
          ),

        size: 0.72,

        kind: 'source',

        initialScale: 0.72,
      }),

      createNode({
        position:
          new THREE.Vector3(
            -2.95,
            0,
            0.45,
          ),

        size: 0.64,

        kind: 'source',

        initialScale: 0.72,
      }),

      createNode({
        position:
          new THREE.Vector3(
            -2.05,
            0,
            1.6,
          ),

        size: 0.68,

        kind: 'source',

        initialScale: 0.72,
      }),
    ]

    /*
     * COMPUTE / AI ACCELERATOR
     */
    const computeNode =
      createNode({
        position:
          new THREE.Vector3(
            2.8,
            0,
            0.65,
          ),

        size: 0.94,

        kind: 'compute',

        initialScale: 0.45,
      })

    /*
     * NETWORK / EDGE HARDWARE
     */
    const networkNodes = [
      createNode({
        position:
          new THREE.Vector3(
            1.55,
            0,
            -1.65,
          ),

        size: 0.56,

        initialScale: 0.01,
      }),

      createNode({
        position:
          new THREE.Vector3(
            3.05,
            0,
            -1.05,
          ),

        size: 0.5,

        initialScale: 0.01,
      }),

      createNode({
        position:
          new THREE.Vector3(
            1.95,
            0,
            1.85,
          ),

        size: 0.54,

        initialScale: 0.01,
      }),

      createNode({
        position:
          new THREE.Vector3(
            -0.45,
            0,
            2.18,
          ),

        size: 0.48,

        initialScale: 0.01,
      }),

      createNode({
        position:
          new THREE.Vector3(
            -1.05,
            0,
            -1.95,
          ),

        size: 0.5,

        initialScale: 0.01,
      }),
    ]

    /*
     * Creates a curved data/fiber connection.
     */
    const createEdge = (
      from,
      to,
      kind,
      arc = 0.55,
    ) => {
      const start =
        from.clone()

      const end =
        to.clone()

      const controlOne =
        start.clone().lerp(
          end,
          0.32,
        )

      const controlTwo =
        start.clone().lerp(
          end,
          0.68,
        )

      controlOne.y += arc
      controlTwo.y += arc

      const curve =
        new THREE.CubicBezierCurve3(
          start,
          controlOne,
          controlTwo,
          end,
        )

      const points =
        curve.getPoints(80)

      const geometry =
        new THREE.BufferGeometry().setFromPoints(
          points,
        )

      const base =
        makeSoftLine(
          geometry.clone(),
          0x426068,
          0.16,
        )

      graph.add(base)

      const glowMaterial =
        new THREE.MeshBasicMaterial({
          color:
            palettes.power.clone(),

          transparent: true,

          opacity: 0.075,

          blending:
            THREE.AdditiveBlending,

          depthWrite: false,
        })

      activeMaterials.push(
        glowMaterial,
      )

      const glow =
        new THREE.Mesh(
          new THREE.TubeGeometry(
            curve,
            48,
            kind === 'compute'
              ? 0.02
              : 0.01,
            5,
            false,
          ),
          glowMaterial,
        )

      graph.add(glow)

      const lineMaterial =
        new THREE.LineBasicMaterial({
          color:
            palettes.power.clone(),

          transparent: true,

          opacity: 0.82,

          blending:
            THREE.AdditiveBlending,

          depthWrite: false,
        })

      activeMaterials.push(
        lineMaterial,
      )

      const line =
        new THREE.Line(
          geometry,
          lineMaterial,
        )

      line.geometry.setDrawRange(
        0,
        2,
      )

      graph.add(line)

      const pulseMaterial =
        new THREE.MeshBasicMaterial({
          color:
            palettes.power.clone(),

          transparent: true,

          opacity: 0,

          blending:
            THREE.AdditiveBlending,

          depthWrite: false,
        })

      activeMaterials.push(
        pulseMaterial,
      )

      const pulses =
        Array.from(
          {
            length:
              kind ===
              'network'
                ? 1
                : 2,
          },

          (_, index) => {
            const pulse =
              new THREE.Mesh(
                new THREE.SphereGeometry(
                  index
                    ? 0.024
                    : 0.038,

                  10,

                  10,
                ),

                pulseMaterial.clone(),
              )

            activeMaterials.push(
              pulse.material,
            )

            pulse.userData.offset =
              index / 2

            graph.add(pulse)

            return pulse
          },
        )

      edgeRecords.push({
        curve,
        line,
        glow,
        pulses,
        kind,
      })
    }

    sourceNodes.forEach(
      (node, index) =>
        createEdge(
          node.point,
          hub.point,
          'source',
          0.5 +
            index * 0.08,
        ),
    )

    createEdge(
      hub.point,
      computeNode.point,
      'compute',
      0.82,
    )

    networkNodes.forEach(
      (node, index) =>
        createEdge(
          hub.point,
          node.point,
          'network',
          0.34 +
            (index % 3) * 0.12,
        ),
    )

    createEdge(
      networkNodes[0].point,
      networkNodes[1].point,
      'network',
      0.3,
    )

    createEdge(
      networkNodes[2].point,
      computeNode.point,
      'network',
      0.34,
    )

    createEdge(
      networkNodes[3].point,
      sourceNodes[2].point,
      'network',
      0.28,
    )

    /*
     * Very subtle grounding light.
     * This replaces the large sci-fi rings.
     */
    const hubGlowMaterial =
      activeMaterial(
        0.08,
        true,
      )

    const hubGlow =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.12,
          0.015,
          0.76,
        ),
        hubGlowMaterial,
      )

    hubGlow.position.y =
      0.035

    graph.add(hubGlow)

    /*
     * Soft studio-style ground.
     */
    const ground =
      new THREE.Mesh(
        new THREE.CircleGeometry(
          6.8,
          64,
        ),

        new THREE.MeshBasicMaterial(
          {
            color: 0x0d1419,
            transparent: true,
            opacity: 0.18,
          },
        ),
      )

    ground.rotation.x =
      -Math.PI / 2

    ground.position.y =
      -0.045

    graph.add(ground)

    /*
     * Very sparse background particles.
     */
    const coordinateGeometry =
      new THREE.BufferGeometry()

    const coordinatePositions =
      new Float32Array(
        92 * 3,
      )

    for (
      let index = 0;
      index < 92;
      index += 1
    ) {
      coordinatePositions[
        index * 3
      ] =
        (Math.random() -
          0.5) *
        12

      coordinatePositions[
        index * 3 + 1
      ] =
        Math.random() *
          2.2 +
        0.08

      coordinatePositions[
        index * 3 + 2
      ] =
        (Math.random() -
          0.5) *
        8
    }

    coordinateGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        coordinatePositions,
        3,
      ),
    )

    const coordinates =
      new THREE.Points(
        coordinateGeometry,
        new THREE.PointsMaterial({
          color: 0x68d8ca,
          size: 0.022,
          transparent: true,
          opacity: 0.42,
          sizeAttenuation: true,
        }),
      )

    graph.add(coordinates)

    /*
     * Lighting.
     */
    scene.add(
      new THREE.HemisphereLight(
        0xb8ffff,
        0x0a1015,
        1.65,
      ),
    )

    const key =
      new THREE.DirectionalLight(
        0xffffff,
        2.8,
      )

    key.position.set(
      3.2,
      6.2,
      5.2,
    )

    scene.add(key)

    const activeLight =
      new THREE.PointLight(
        0x63f5d8,
        9.5,
        10,
        2.2,
      )

    activeLight.position.set(
      0,
      2.2,
      1.8,
    )

    scene.add(activeLight)

    const blueFill =
      new THREE.PointLight(
        0x617dff,
        4.8,
        11,
        2,
      )

    blueFill.position.set(
      4.2,
      2.0,
      -3.2,
    )

    scene.add(blueFill)

    const rimLight =
      new THREE.DirectionalLight(
        0x8895ff,
        1.5,
      )

    rimLight.position.set(
      -4.5,
      3.5,
      -5,
    )

    scene.add(rimLight)

    /*
     * Mouse / pointer motion.
     */
    const pointer =
      new THREE.Vector2()

    const pointerTarget =
      new THREE.Vector2()

    const onPointer =
      (event) => {
        const rect =
          parent.getBoundingClientRect()

        pointerTarget.set(
          (
            (event.clientX -
              rect.left) /
              rect.width -
            0.5
          ) * 2,

          (
            (event.clientY -
              rect.top) /
              rect.height -
            0.5
          ) * 2,
        )
      }

    const onLeave = () =>
      pointerTarget.set(
        0,
        0,
      )

    parent.addEventListener(
      'pointermove',
      onPointer,
      {
        passive: true,
      },
    )

    parent.addEventListener(
      'pointerleave',
      onLeave,
      {
        passive: true,
      },
    )

    let viewportWidth =
      window.innerWidth

    const resize = () => {
      const {
        width,
        height,
      } =
        parent.getBoundingClientRect()

      viewportWidth = width

      renderer.setSize(
        Math.max(width, 1),
        Math.max(height, 1),
        false,
      )

      camera.aspect =
        width /
        Math.max(height, 1)

      camera.updateProjectionMatrix()
    }

    const resizeObserver =
      new ResizeObserver(
        resize,
      )

    resizeObserver.observe(
      parent,
    )

    resize()

    const clamp = (
      value,
    ) =>
      Math.max(
        0,
        Math.min(
          1,
          value,
        ),
      )

    const smooth = (
      start,
      end,
      value,
    ) => {
      const point =
        clamp(
          (value - start) /
            (end - start),
        )

      return (
        point *
        point *
        (3 - 2 * point)
      )
    }

    const clock =
      new THREE.Clock()

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    const targetColor =
      new THREE.Color()

    let animationFrame = 0

    /*
     * Main render loop.
     */
    const render = () => {
      const time =
        clock.getElapsedTime()

      const sectionRect =
        scrollSection?.getBoundingClientRect()

      const scrollDistance =
        scrollSection
          ? Math.max(
              scrollSection.offsetHeight -
                window.innerHeight,
              1,
            )
          : 1

      const progress =
        sectionRect
          ? clamp(
              -sectionRect.top /
                scrollDistance,
            )
          : 0

      const aggregate =
        smooth(
          0.08,
          0.3,
          progress,
        )

      const connect =
        smooth(
          0.33,
          0.6,
          progress,
        )

      const scale =
        smooth(
          0.64,
          0.92,
          progress,
        )

      const textPhaseOne =
        1 -
        smooth(
          0.28,
          0.4,
          progress,
        )

      const textPhaseTwo =
        smooth(
          0.25,
          0.4,
          progress,
        ) *
          (1 -
            smooth(
              0.62,
              0.74,
              progress,
            ))

      const textPhaseThree =
        smooth(
          0.58,
          0.74,
          progress,
        )

      const textSpins = [
        -smooth(0.28, 0.4, progress) * 1.25,
        (1 - smooth(0.25, 0.4, progress)) * 1.25 - smooth(0.62, 0.74, progress) * 1.25,
        (1 - smooth(0.58, 0.74, progress)) * 1.25,
      ]
      const textPresence = 1 - smooth(0.82, 0.98, progress)
      const textGate = smooth(0.17, 0.25, progress)

      ;[textPhaseOne, textPhaseTwo, textPhaseThree].forEach(
        (opacity, index) => {
          const sprite = textSprites[index]
          const isMobile = viewportWidth <= 620
          const mobileTextScale = isMobile ? 0.95 : 1
          sprite.scale.setScalar(isMobile ? 0.92 : 1)
          sprite.material.opacity = reducedMotion
            ? index === 0
              ? textPresence * textGate * mobileTextScale
              : 0
            : opacity * textPresence * textGate * 0.96 * mobileTextScale
          sprite.rotation.y = reducedMotion
            ? 0
            : textSpins[index] * (isMobile ? 0.55 : 0.82)
          sprite.position.x =
            (isMobile ? -0.4 : -2.6) +
            progress * (isMobile ? 0.35 : 0.9)
          sprite.position.y =
            (isMobile ? 2.4 : 1.75) +
            Math.sin(time * 0.7 + index) * 0.025
        },
      )

      const scrollY =
        window.scrollY

      const viewportHeight =
        window.innerHeight

      const transitionAt =
        (section) =>
          section
            ? smooth(
                section.offsetTop -
                  viewportHeight *
                    0.82,

                section.offsetTop -
                  viewportHeight *
                    0.08,

                scrollY,
              )
            : 0

      const toSystem =
        transitionAt(
          pageSections.system,
        )

      const toField =
        transitionAt(
          pageSections.field,
        )

      const toNetwork =
        transitionAt(
          pageSections.network,
        )

      const toClosing =
        transitionAt(
          pageSections.closing,
        )

      const foregroundStart = scrollSection
        ? scrollSection.offsetTop + scrollSection.offsetHeight - viewportHeight * 1.05
        : 0
      const foregroundEnergy = smooth(
        foregroundStart,
        foregroundStart + viewportHeight * 0.85,
        scrollY,
      )
      const foregroundColor = new THREE.Color()
        .lerpColors(
          palettes.power,
          palettes.uplink,
          Math.min(1, toNetwork + toClosing),
        )

      const constellationEnergy = toNetwork * (1 - toClosing * 0.72)
      networkConstellation.position.x = 0.1 + Math.sin(time * 0.22) * 0.08
      networkConstellation.position.y = -0.15 + Math.cos(time * 0.28) * 0.06
      networkConstellation.rotation.z += 0.0025 * constellationEnergy
      networkConstellationNodes.forEach((node, index) => {
        node.material.opacity = constellationEnergy * (index === 0 ? 0.95 : 0.72)
        node.scale.setScalar(1 + Math.sin(time * 1.8 + index) * 0.16 * constellationEnergy)
      })
      networkConstellationLines.forEach((line, index) => {
        line.material.opacity = constellationEnergy * (0.18 + Math.sin(time * 1.2 + index) * 0.06)
      })
      networkConstellationPulses.forEach((pulse) => {
        const pulseProgress = (time * 0.22 + pulse.userData.offset) % 1
        pulse.position.lerpVectors(pulse.userData.start, pulse.userData.end, pulseProgress)
        pulse.material.opacity = constellationEnergy * Math.sin(pulseProgress * Math.PI) * 0.95
      })

      foreground.position.y = Math.sin(time * 0.18) * 0.08
      foreground.rotation.z = Math.sin(time * 0.11) * 0.012
      foregroundLines.forEach((line, index) => {
        line.material.opacity = foregroundEnergy * (index ? 0.14 : 0.18)
        line.position.y = Math.sin(time * 0.32 + index) * 0.16
      })
      foregroundMaterials.forEach((material) => {
        material.color.lerp(foregroundColor, 0.04)
      })
      foregroundMaterials[2].opacity = foregroundEnergy * 0.62
      foregroundNodes.forEach((node, index) => {
        node.material.opacity = foregroundEnergy * (0.5 + Math.sin(time * 1.6 + index) * 0.18)
        node.scale.setScalar(1 + Math.sin(time * 1.2 + index) * 0.18)
      })

      const artifactWeights = [
        viewportWidth <= 620 ? 0 : Math.max(0.08, 1 - toSystem),
        toField,
        toNetwork,
        toClosing,
      ]

      artifactRecords.forEach(
        (artifact, index) => {
          const weight = artifactWeights[index]
          const pulse = 1 + Math.sin(time * 1.4 + index) * 0.06
          artifact.group.visible = weight > 0.02
          artifact.group.scale.setScalar(
            pulse * (0.82 + weight * 0.22),
          )
          artifact.group.rotation.y +=
            (0.002 + weight * 0.006) *
            (index % 2 ? -1 : 1)
          artifact.ring.material.opacity = weight * 0.5
          artifact.orbit.material.opacity = weight * 0.3
          artifact.group.children[1].material.opacity = weight * 0.22
        },
      )

      const lerp =
        THREE.MathUtils.lerp

      /*
       * Smoothly change all emissive
       * materials when mode changes.
       */
      targetColor.copy(
        palettes[
          modeRef.current
        ] ||
          palettes.power,
      )

      activeMaterials.forEach(
        (material) => {
          material.color?.lerp(
            targetColor,
            0.055,
          )

          material.emissive?.lerp(
            targetColor,
            0.055,
          )
        },
      )

      activeLight.color.lerp(
        targetColor,
        0.055,
      )

      pointer.lerp(
        pointerTarget,
        0.035,
      )

      /*
       * Hero scene positioning.
       */
      const heroShift =
        viewportWidth > 900
          ? 1.55
          : viewportWidth > 620
            ? 0.7
            : 0.45

      let targetX =
        heroShift

      let targetY =
        (viewportWidth <= 620 ? -0.92 : -0.62) -
        scale * 0.1

      let targetScale = viewportWidth <= 620 ? 0.7 : 1

      let rotationTarget =
        -0.18 +
        aggregate * 0.16 -
        connect * 0.24 +
        scale * 0.5

      /*
       * System section.
       */
      targetX = lerp(
        targetX,
        viewportWidth > 900
          ? 1.75
          : 0.5,
        toSystem,
      )

      targetY = lerp(
        targetY,
        -0.16,
        toSystem,
      )

      targetScale = lerp(
        targetScale,
        viewportWidth <= 620 ? 0.66 : 0.92,
        toSystem,
      )

      rotationTarget =
        lerp(
          rotationTarget,
          0.56,
          toSystem,
        )

      /*
       * Field section.
       */
      targetX = lerp(
        targetX,
        viewportWidth > 900
          ? 1.95
          : 0.3,
        toField,
      )

      targetY = lerp(
        targetY,
        -0.34,
        toField,
      )

      targetScale = lerp(
        targetScale,
        1.04,
        toField,
      )

      rotationTarget =
        lerp(
          rotationTarget,
          -0.12,
          toField,
        )

      /*
       * Network section.
       */
      targetX = lerp(
        targetX,
        viewportWidth > 900
          ? 1.68
          : 0.24,
        toNetwork,
      )

      targetY = lerp(
        targetY,
        -0.42,
        toNetwork,
      )

      targetScale = lerp(
        targetScale,
        0.9,
        toNetwork,
      )

      rotationTarget =
        lerp(
          rotationTarget,
          0.76,
          toNetwork,
        )

      /*
       * Closing section.
       */
      targetX = lerp(
        targetX,
        0,
        toClosing,
      )

      targetY = lerp(
        targetY,
        -0.14,
        toClosing,
      )

      targetScale = lerp(
        targetScale,
        1.08,
        toClosing,
      )

      rotationTarget =
        lerp(
          rotationTarget,
          progress *
              0.66 +
            time *
              0.025,
          toClosing,
        )

      rotationTarget +=
        pointer.x * 0.06

      /*
       * Smooth scene motion.
       */
      graph.rotation.y +=
        (
          rotationTarget -
          graph.rotation.y
        ) *
        0.05

      graph.rotation.x +=
        (
          pointer.y * 0.018 -
          graph.rotation.x
        ) *
        0.04

      graph.position.x +=
        (
          targetX -
          graph.position.x
        ) *
        0.05

      graph.position.y +=
        (
          targetY -
          graph.position.y
        ) *
        0.05

      const currentScale =
        graph.scale.x +
        (
          targetScale -
          graph.scale.x
        ) *
        0.05

      graph.scale.setScalar(
        currentScale,
      )

      /*
       * Camera movement.
       */
      let cameraX =
        0.25 -
        aggregate * 0.5 +
        connect * 0.42 +
        scale * 0.62

      let cameraY =
        4.25 -
        aggregate * 0.52 +
        connect * 0.14 +
        scale * 0.92

      let cameraZ =
        8.75 -
        aggregate * 0.58 +
        connect * 0.18 +
        scale * 1.05

      cameraX = lerp(
        cameraX,
        -0.28,
        toSystem,
      )

      cameraY = lerp(
        cameraY,
        3.48,
        toSystem,
      )

      cameraZ = lerp(
        cameraZ,
        8.05,
        toSystem,
      )

      cameraX = lerp(
        cameraX,
        0.58,
        toField,
      )

      cameraY = lerp(
        cameraY,
        3.05,
        toField,
      )

      cameraZ = lerp(
        cameraZ,
        7.5,
        toField,
      )

      cameraX = lerp(
        cameraX,
        0.1,
        toNetwork,
      )

      cameraY = lerp(
        cameraY,
        5.1,
        toNetwork,
      )

      cameraZ = lerp(
        cameraZ,
        9.45,
        toNetwork,
      )

      cameraX = lerp(
        cameraX,
        0,
        toClosing,
      )

      cameraY = lerp(
        cameraY,
        6.0,
        toClosing,
      )

      cameraZ = lerp(
        cameraZ,
        8.65,
        toClosing,
      )

      camera.position.x +=
        (
          cameraX +
          pointer.x * 0.1 -
          camera.position.x
        ) *
        0.045

      camera.position.y +=
        (
          cameraY -
          pointer.y * 0.08 -
          camera.position.y
        ) *
        0.045

      camera.position.z +=
        (
          cameraZ -
          camera.position.z
        ) *
        0.045

      camera.lookAt(
        targetX * 0.16,
        0.1,
        0,
      )

      const screenToWorld = (x, y) => {
        const point = new THREE.Vector3(x, y, 0.18).unproject(camera)
        const direction = point.sub(camera.position).normalize()
        const distance = -camera.position.z / direction.z
        return camera.position.clone().add(direction.multiplyScalar(distance))
      }

      const contentTargets = [
        { selector: '.system-section', x: -0.8 },
        { selector: '.field-section', x: 0.82 },
        { selector: '.network-section', x: -0.82 },
        { selector: '.closing-section', x: 0.78 },
      ]

      contentTargets.forEach((target, index) => {
        const section = document.querySelector(target.selector)
        const rect = section?.getBoundingClientRect()
        const rig = contentRigs[index]
        if (!rect || !rig) return
        const centerY = (rect.top + Math.min(rect.height, window.innerHeight) * 0.38) / window.innerHeight
        const visible = smooth(-0.18, 0.2, rect.bottom / window.innerHeight) * smooth(1.18, 0.78, rect.top / window.innerHeight)
        const world = screenToWorld(target.x, 1 - centerY * 2)
        rig.group.position.lerp(world, 0.12)
        rig.group.scale.setScalar(0.72 + visible * 0.35 + Math.sin(time * 1.3 + index) * 0.03)
        rig.group.rotation.x += 0.004 + visible * 0.006
        rig.group.rotation.y -= 0.006 + visible * 0.004
        rig.materials.forEach((material) => {
          material.opacity = reducedMotion ? visible * 0.55 : visible * 0.72
          material.color.lerp(foregroundColor, 0.05)
        })
      })

      /*
       * Source nodes appear as data
       * is aggregated.
       */
      sourceNodes.forEach(
        ({ group }) =>
          group.scale.setScalar(
            0.72 +
              aggregate *
                0.28,
          ),
      )

      /*
       * Compute node grows when the
       * network starts connecting.
       */
      computeNode.group.scale.setScalar(
        0.45 +
          connect *
            0.55,
      )

      computeNode.group.position.x =
        3.7 -
        connect * 0.8

      /*
       * Network nodes emerge later.
       */
      networkNodes.forEach(
        ({ group }, index) => {
          const localScale =
            smooth(
              0.64 +
                index *
                  0.018,

              0.84 +
                index *
                  0.018,

              progress,
            )

          group.scale.setScalar(
            Math.max(
              0.01,
              localScale,
            ),
          )
        },
      )

      /*
       * Very subtle hub breathing.
       */
      const hubPulse =
        0.72 * (
          1 +
        Math.sin(
          time * 2.1,
        ) *
          0.014 +
        aggregate * 0.025 +
        connect * 0.02
        )

      hub.group.scale.setScalar(
        hubPulse,
      )

      hubGlow.material.opacity =
        0.018 +
        aggregate *
          0.028 +
        scale * 0.025

      /*
       * Hardware animation.
       */
      nodeRecords.forEach(
        (
          node,
          nodeIndex,
        ) => {
          node.core.scale.x =
            0.96 +
            Math.sin(
              time * 1.8 +
                nodeIndex,
            ) *
              0.035

          node.core.material.emissiveIntensity =
            node.kind ===
            'hub'
              ? 1.7 +
                Math.sin(
                  time * 2.1,
                ) *
                  0.25 +
                aggregate *
                  0.35
              : 1.15 +
                Math.sin(
                  time * 1.6 +
                    nodeIndex,
                ) *
                  0.12

          node.edgeStrip.material.opacity =
            (
              node.kind ===
              'hub'
                ? 0.22
                : 0.11
            ) +
            Math.sin(
              time * 1.7 +
                nodeIndex,
            ) *
              0.025

          /*
           * Individual port LEDs
           * pulse independently.
           */
          node.portLights.forEach(
            (
              light,
              portIndex,
            ) => {
              const wave =
                Math.sin(
                  time * 2.4 -
                    portIndex *
                      0.8 +
                    nodeIndex *
                      0.55,
                )

              light.material.opacity =
                (
                  node.kind ===
                  'hub'
                    ? 0.72
                    : 0.48
                ) +
                Math.max(
                  0,
                  wave,
                ) *
                  0.2
            },
          )
        },
      )

      /*
       * Data movement along each connection.
       */
      edgeRecords.forEach(
        (
          edge,
          edgeIndex,
        ) => {
          const activation =
            edge.kind ===
            'source'
              ? aggregate
              : edge.kind ===
                  'compute'
                ? connect
                : scale

          const minimum =
            progress < 0.08
              ? edge.kind ===
                'source'
                ? 0.16
                : 0.04
              : 0

          const draw =
            Math.max(
              minimum,
              activation,
            )

          edge.line.geometry.setDrawRange(
            0,
            Math.max(
              2,
              Math.floor(
                81 * draw,
              ),
            ),
          )

          edge.line.material.opacity =
            0.1 +
            activation *
              0.55

          edge.glow.material.opacity =
            0.018 +
            activation *
              0.085 +
            toClosing *
              0.035

          edge.pulses.forEach(
            (
              pulse,
              pulseIndex,
            ) => {
              const pulseProgress =
                (
                  time *
                    (
                      0.11 +
                      activation *
                        0.14
                    ) +
                  pulse.userData
                    .offset +
                  edgeIndex *
                    0.13 +
                  progress *
                    0.35
                ) %
                1

              pulse.position.copy(
                edge.curve.getPointAt(
                  pulseProgress,
                ),
              )

              pulse.material.opacity =
                activation *
                Math.sin(
                  pulseProgress *
                    Math.PI,
                ) *
                0.75

              pulse.scale.setScalar(
                0.7 +
                  activation *
                    0.55 +
                  pulseIndex *
                    0.06,
              )
            },
          )
        },
      )

      if (
        !reducedMotion
      ) {
        coordinates.rotation.y =
          time * 0.006 +
          progress * 0.14
      }

      renderer.render(
        scene,
        camera,
      )

      animationFrame =
        window.requestAnimationFrame(
          render,
        )
    }

    render()

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      )

      resizeObserver.disconnect()

      parent.removeEventListener(
        'pointermove',
        onPointer,
      )

      parent.removeEventListener(
        'pointerleave',
        onLeave,
      )

      scene.traverse(
        (object) => {
          object.geometry?.dispose()

          if (
            Array.isArray(
              object.material,
            )
          ) {
            object.material.forEach(
              (material) =>
                material.dispose(),
            )
          } else {
            object.material?.dispose()
          }
        },
      )

      renderer.dispose()
    }
  }, [])

  return (
    <div
      className="global-scene-shell"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="global-three-canvas"
      />
    </div>
  )
}

export default HeroScene
