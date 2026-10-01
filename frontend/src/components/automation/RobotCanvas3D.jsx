import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './RobotCanvas3D.css';

// ════════════════════════════════════════════════════════════════════════════
// KINEMATIC POSE DEFINITIONS FOR 4 SECTIONS
// Angles in radians: [J1 (Base), J2 (Shoulder), J3 (Elbow), J4 (Forearm Roll), J5 (Wrist Pitch), J6 (Tool Roll)]
// ════════════════════════════════════════════════════════════════════════════
const POSES = {
  welding: [
    // 0: Standby / Iconic Photographic Stance (robot_welding.png)
    { j1: 0.35, j2: -0.42, j3: 1.15, j4: 0.0, j5: 0.95, j6: 0.15, cameraPos: [5.2, 2.7, 5.6], target: [0, 1.45, 0] },
    // 1: Extended Kinematic Reach
    { j1: -0.45, j2: 0.25, j3: 0.65, j4: 0.2, j5: 0.65, j6: 0.35, cameraPos: [5.6, 3.2, 5.4], target: [0, 1.6, 0] },
    // 2: Arc Welding Precision Seam Tracking (Facing workpiece)
    { j1: 0.35, j2: 0.55, j3: 0.95, j4: -0.15, j5: 0.45, j6: -0.2, cameraPos: [4.6, 2.5, 5.0], target: [0.6, 1.3, 0.3] },
    // 3: 360° Inspection Orbit Pose
    { j1: -0.55, j2: -0.35, j3: 1.25, j4: 0.6, j5: 0.85, j6: 0.8, cameraPos: [5.2, 3.4, 5.2], target: [0, 1.6, 0] },
  ],
  handling: [
    // 0: Standby / Home
    { j1: 0.0, j2: -0.35, j3: 0.95, j4: 0.0, j5: 0.65, j6: 0.0, cameraPos: [5.2, 2.8, 5.8], target: [0, 1.5, 0] },
    // 1: Palletizing Extended Reach
    { j1: -0.6, j2: 0.45, j3: 0.5, j4: 0.3, j5: 0.35, j6: 0.4, cameraPos: [5.8, 3.4, 5.4], target: [0, 1.6, 0] },
    // 2: Pick & Place Grip Action (Down at part fixture)
    { j1: 0.4, j2: 0.65, j3: 0.8, j4: -0.15, j5: 0.55, j6: 0.0, cameraPos: [4.8, 2.6, 5.2], target: [0.8, 1.3, 0.4] },
    // 3: Fast Sorting Cycle
    { j1: -0.7, j2: -0.25, j3: 1.15, j4: 0.85, j5: 0.6, j6: 0.9, cameraPos: [5.2, 3.4, 5.4], target: [0, 1.6, 0] },
  ],
  cutting: [
    // 0: Standby / Origin
    { j1: 0.1, j2: -0.35, j3: 0.95, j4: 0.0, j5: 0.65, j6: 0.1, cameraPos: [5.2, 2.8, 5.8], target: [0, 1.5, 0] },
    // 1: Large Gantry / Radius Cutting Reach
    { j1: -0.5, j2: 0.42, j3: 0.45, j4: 0.2, j5: 0.35, j6: 0.3, cameraPos: [5.8, 3.4, 5.4], target: [0, 1.6, 0] },
    // 2: Plasma Laser Pierce Action
    { j1: 0.3, j2: 0.58, j3: 0.88, j4: -0.1, j5: 0.55, j6: -0.2, cameraPos: [4.8, 2.5, 5.2], target: [0.7, 1.4, 0.3] },
    // 3: Bevel Profile Agility Pose
    { j1: -0.6, j2: -0.3, j3: 1.2, j4: 0.8, j5: 0.7, j6: 1.0, cameraPos: [5.2, 3.4, 5.4], target: [0, 1.6, 0] },
  ],
};

// Color palettes for each robot type
const THEMES = {
  welding: {
    primary: 0x1e2430,      // Dark industrial graphite
    secondary: 0x2d3748,    // Medium steel
    accent: 0xf97316,       // Hazard orange
    accentGlow: '#f97316',
    toolGlow: 0x38bdf8,     // Electric blue arc
    label: 'Robot Welding',
    sub: '6-Axis Arc & Spot Welding System',
  },
  handling: {
    primary: 0x162234,      // Precision navy
    secondary: 0x253752,    // High-tech cobalt
    accent: 0x06b6d4,       // Electric cyan
    accentGlow: '#06b6d4',
    toolGlow: 0x22d3ee,     // Laser alignment cyan
    label: 'Robot Handling',
    sub: 'High-Speed Pick, Place & Palletizing',
  },
  cutting: {
    primary: 0x151821,      // Obsidian dark steel
    secondary: 0x272c3d,    // Gunmetal
    accent: 0xef4444,       // Laser ruby crimson
    accentGlow: '#ef4444',
    toolGlow: 0xf43f5e,     // Intense plasma ruby
    label: 'Robot Cutting',
    sub: 'Plasma, Flame & Laser 3D Profiling',
  },
};

export default function RobotCanvas3D({
  robotType = 'welding',
  activeStep = 0,
  scrollProgress = 0,
  isId = false,
  onStepSelect = null,
}) {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [telemetry, setTelemetry] = useState({ j1: 0, j2: 0, j3: 0, j4: 0, j5: 0, j6: 0 });
  const [webGLSupported, setWebGLSupported] = useState(true);

  // References for mutable animation loop state
  const stateRef = useRef({
    robotType,
    activeStep,
    scrollProgress,
    wireframe,
    autoRotate,
    currentPose: { j1: 0, j2: 0, j3: 0, j4: 0, j5: 0, j6: 0 },
    targetPose: { j1: 0, j2: 0, j3: 0, j4: 0, j5: 0, j6: 0 },
    cameraPos: new THREE.Vector3(5.2, 3.8, 6.0),
    cameraTarget: new THREE.Vector3(0, 2.0, 0),
    controls: null,
    camera: null,
    renderer: null,
    joints: null,
    toolGroup: null,
    sparkParticles: null,
    gripperJaws: null,
    laserBeam: null,
    arcLight: null,
    materials: [],
  });

  // Keep stateRef in sync with props
  useEffect(() => {
    stateRef.current.robotType = robotType;
    stateRef.current.activeStep = activeStep;
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.wireframe = wireframe;
    stateRef.current.autoRotate = autoRotate;
  }, [robotType, activeStep, scrollProgress, wireframe, autoRotate]);

  // Update wireframe property across all materials
  useEffect(() => {
    if (stateRef.current.materials) {
      stateRef.current.materials.forEach((m) => {
        if (m) m.wireframe = wireframe;
      });
    }
  }, [wireframe]);

  // Reset Camera View handler
  const handleResetCamera = () => {
    const themePoses = POSES[robotType] || POSES.welding;
    const defaultPose = themePoses[activeStep] || themePoses[0];
    if (stateRef.current.camera && stateRef.current.controls) {
      stateRef.current.camera.position.set(...defaultPose.cameraPos);
      stateRef.current.controls.target.set(...defaultPose.target);
      stateRef.current.controls.update();
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // MAIN THREE.JS SCENE SETUP & ANIMATION LOOP
  // ════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = null; // Transparent canvas to blend with page theme

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    stateRef.current.renderer = renderer;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(5.2, 3.8, 6.0);
    stateRef.current.camera = camera;

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 12.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't flip below floor
    controls.target.set(0, 2.0, 0);
    stateRef.current.controls = controls;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 9, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    rimLight.position.set(-6, 6, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
    fillLight.position.set(0, -2, 5);
    scene.add(fillLight);

    // 5. Industrial Floor Grid & Ring
    const floorGroup = new THREE.Group();

    // Radial ring
    const ringGeo = new THREE.RingGeometry(1.4, 1.48, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00897b, opacity: 0.35, transparent: true, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.01;
    floorGroup.add(ringMesh);

    // Outer range boundary ring
    const outerRingGeo = new THREE.RingGeometry(3.0, 3.03, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0x334155, opacity: 0.25, transparent: true, side: THREE.DoubleSide });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = -Math.PI / 2;
    outerRingMesh.position.y = 0.01;
    floorGroup.add(outerRingMesh);

    // High tech grid
    const grid = new THREE.GridHelper(10, 20, 0x00897b, 0x1e293b);
    grid.position.y = 0.0;
    floorGroup.add(grid);

    // Shadow receiver plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    floorGroup.add(shadowPlane);

    scene.add(floorGroup);

    // ══════════════════════════════════════════════════════════════════════════
    // 6. BUILD PROCEDURAL 6-AXIS ROBOTIC ARM
    // ══════════════════════════════════════════════════════════════════════════
    // AUTHENTIC DAIHEN ROBOT MATERIALS & COLORWAYS (From User's Photos)
    // ══════════════════════════════════════════════════════════════════════════
    const matList = [];
    const createMat = (props) => {
      const mat = new THREE.MeshStandardMaterial({
        roughness: 0.4,
        metalness: 0.2,
        ...props,
      });
      matList.push(mat);
      return mat;
    };

    // Authentic industrial warm cream ivory cast iron enamel paint (from photos)
    const bodyMat = createMat({ color: 0xdedece, roughness: 0.38, metalness: 0.15 });
    const bodyDarkMat = createMat({ color: 0xc8c6bc, roughness: 0.45, metalness: 0.2 });
    const motorBlackMat = createMat({ color: 0x16181c, roughness: 0.42, metalness: 0.35 });
    const hoseBlackMat = createMat({ color: 0x111316, roughness: 0.8, metalness: 0.1 });
    const warningYellowMat = createMat({ color: 0xfacc15, roughness: 0.25, metalness: 0.2, emissive: 0xfacc15, emissiveIntensity: 0.25 });
    const badgeBlueMat = createMat({ color: 0x1d4ed8, roughness: 0.25, metalness: 0.3 });
    const badgeWhiteMat = createMat({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    const machinedSteelMat = createMat({ color: 0x5a6578, roughness: 0.25, metalness: 0.85 });
    const boltSteelMat = createMat({ color: 0xd1d5db, roughness: 0.15, metalness: 0.95 });
    const chromePistonMat = createMat({ color: 0xf1f5f9, roughness: 0.1, metalness: 0.95 });

    stateRef.current.materials = matList;

    // Helper: Create bright yellow warning triangle label on black motor housing
    const createYellowWarning = (w = 0.18, h = 0.15) => {
      const group = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.015), motorBlackMat);
      const tri = new THREE.Mesh(new THREE.ConeGeometry(w * 0.4, h * 0.75, 3), warningYellowMat);
      tri.rotation.z = Math.PI;
      tri.position.z = 0.01;
      group.add(plate);
      group.add(tri);
      return group;
    };

    // Helper: Create authentic DAIHEN / OTC blue rectangular brand nameplate
    const createDaihenBadge = (w = 0.54, h = 0.18) => {
      const group = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), badgeBlueMat);
      const border = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, h * 0.88, 0.022), badgeBlueMat);
      const innerWhite = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, h * 0.38, 0.025), badgeWhiteMat);
      innerWhite.position.z = 0.005;
      group.add(plate);
      group.add(border);
      group.add(innerWhite);
      return group;
    };

    // Helper: Circular bolt ring around pivot flanges
    const createBoltRing = (radius = 0.34, count = 12) => {
      const ringGroup = new THREE.Group();
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.035, 8), boltSteelMat);
        b.rotation.x = Math.PI / 2;
        b.position.set(Math.cos(ang) * radius, Math.sin(ang) * radius, 0);
        ringGroup.add(b);
      }
      return ringGroup;
    };

    // Robot Root
    const robotRoot = new THREE.Group();

    // ── FIXED BASE PEDESTAL & JOINTS ──
    const pedestalGroup = new THREE.Group();
    const j1Group = new THREE.Group();
    const j2Group = new THREE.Group();
    const j3Group = new THREE.Group();
    const j4Group = new THREE.Group();
    const j5Group = new THREE.Group();
    const j6Group = new THREE.Group();

    if (robotType === 'welding') {
      // ════════════════════════════════════════════════════════════════════════
      // 1. ROBOT WELDING — FAITHFUL REPLICA OF robot_welding.png (DAIHEN FD-B6)
      // Sculpted single cast bicep arm, double-bundled conduit, circular bolt rings
      // ════════════════════════════════════════════════════════════════════════

      // Heavy conical cast base pedestal
      const baseRiser = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.48, 0.48, 32), bodyMat);
      baseRiser.position.y = 0.24;
      baseRiser.castShadow = true;
      pedestalGroup.add(baseRiser);

      // 4 heavy flared anchor bolt lugs at 45°, 135°, 225°, 315°
      const lugAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      lugAngles.forEach((ang) => {
        const lug = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.42), bodyMat);
        lug.position.set(Math.cos(ang) * 1.42, 0.13, Math.sin(ang) * 1.42);
        lug.rotation.y = -ang;
        lug.castShadow = true;
        pedestalGroup.add(lug);

        // Counterbored socket head cap screw (Allen bolt)
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.14, 12), boltSteelMat);
        bolt.position.set(Math.cos(ang) * 1.44, 0.27, Math.sin(ang) * 1.44);
        pedestalGroup.add(bolt);
      });

      // Electrical / cable terminal junction box on base flank
      const termBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.3, 0.22), bodyDarkMat);
      termBox.position.set(-1.18, 0.24, -0.42);
      termBox.rotation.y = 0.35;
      pedestalGroup.add(termBox);

      const cableGland = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), motorBlackMat);
      cableGland.rotation.z = Math.PI / 2;
      cableGland.position.set(-1.38, 0.24, -0.42);
      pedestalGroup.add(cableGland);

      // Machined turntable seal ring
      const sealRing = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.16, 0.08, 32), machinedSteelMat);
      sealRing.position.y = 0.52;
      pedestalGroup.add(sealRing);

      // ── TURRET (Axis 1 Swivel Casting) ──
      j1Group.position.set(0, 0.56, 0);

      const turntable = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.1, 0.16, 32), bodyMat);
      turntable.position.y = 0.08;
      j1Group.add(turntable);

      // Main cast turret body with angled front face
      const turretBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.72, 1.1), bodyMat);
      turretBody.position.set(0, 0.48, 0.02);
      turretBody.castShadow = true;
      j1Group.add(turretBody);

      // Angled chamfered front face
      const frontBevel = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, 0.32), bodyMat);
      frontBevel.position.set(0, 0.38, 0.54);
      frontBevel.rotation.x = -0.32;
      j1Group.add(frontBevel);

      // Directional calibration label [ - 1 + ] on front
      const calibPlate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.02), badgeWhiteMat);
      calibPlate.position.set(0, 0.38, 0.7);
      calibPlate.rotation.x = -0.32;
      j1Group.add(calibPlate);

      // Asymmetric single-side shoulder upright hub on RIGHT side (cradling Axis 2)
      const shoulderHub = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.95, 0.85), bodyMat);
      shoulderHub.position.set(0.38, 0.84, 0.12);
      shoulderHub.castShadow = true;
      j1Group.add(shoulderHub);

      // Left cheek support
      const leftCheek = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.76, 0.7), bodyMat);
      leftCheek.position.set(-0.38, 0.74, 0.12);
      j1Group.add(leftCheek);

      // Lower conduit outlet bracket (where dress pack cable harness starts)
      const conduitOutlet = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.22), motorBlackMat);
      conduitOutlet.position.set(-0.42, 0.42, 0.35);
      j1Group.add(conduitOutlet);

      // Axis 1 rear servomotor housing
      const ax1Motor = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.52, 16), motorBlackMat);
      ax1Motor.position.set(0, 0.45, -0.62);
      ax1Motor.rotation.x = Math.PI / 2;
      j1Group.add(ax1Motor);

      // ── LOWER ARM / BICEP (Axis 2 Shoulder Pitch) ──
      // In robot_welding.png: Single sculpted cast arm arching backwards with side recess!
      j2Group.position.set(0, 1.05, 0.12);

      // Shoulder pivot shaft & CIRCULAR BOLT RING (from photo!)
      const shoulderShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.12, 24), machinedSteelMat);
      shoulderShaft.rotation.z = Math.PI / 2;
      j2Group.add(shoulderShaft);

      const boltRingL = createBoltRing(0.42, 16);
      boltRingL.position.set(0.56, 0, 0);
      boltRingL.rotation.y = Math.PI / 2;
      j2Group.add(boltRingL);

      const boltRingR = createBoltRing(0.34, 12);
      boltRingR.position.set(-0.48, 0, 0);
      boltRingR.rotation.y = -Math.PI / 2;
      j2Group.add(boltRingR);

      // Axis 2 rear servomotor block with bright yellow warning decal
      const ax2Motor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.42), motorBlackMat);
      ax2Motor.position.set(0.52, 0.35, -0.38);
      j2Group.add(ax2Motor);

      const ax2Warn = createYellowWarning(0.15, 0.13);
      ax2Warn.position.set(0.72, 0.35, -0.38);
      ax2Warn.rotation.y = Math.PI / 2;
      j2Group.add(ax2Warn);

      // ── SINGLE SCULPTED CAST BICEP ARM (AUTHENTIC DAIHEN ANATOMY) ──
      const bicepGroup = new THREE.Group();

      // Lower bicep root segment (leaning backward)
      const bicepRoot = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.85, 0.68), bodyMat);
      bicepRoot.position.set(0, 0.4, -0.06);
      bicepRoot.rotation.x = -0.12;
      bicepRoot.castShadow = true;
      bicepGroup.add(bicepRoot);

      // Mid bicep sculpted arm (continuous backward sweep)
      const bicepMid = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.1, 0.58), bodyMat);
      bicepMid.position.set(0, 1.1, -0.18);
      bicepMid.rotation.x = -0.16;
      bicepMid.castShadow = true;
      bicepGroup.add(bicepMid);

      // Upper bicep head (curving forward toward elbow pivot)
      const bicepHead = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.85, 0.54), bodyMat);
      bicepHead.position.set(0, 1.8, -0.26);
      bicepHead.rotation.x = 0.08;
      bicepHead.castShadow = true;
      bicepGroup.add(bicepHead);

      // Inner recessed pocket on left & right flank (authentic cast iron recess!)
      const recessL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.25, 0.42), bodyDarkMat);
      recessL.position.set(-0.26, 1.1, -0.18);
      bicepGroup.add(recessL);

      const recessR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.25, 0.42), bodyDarkMat);
      recessR.position.set(0.26, 1.1, -0.18);
      bicepGroup.add(recessR);

      // Cast conduit brackets on outer left side
      const lowerClamp = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.18), bodyMat);
      lowerClamp.position.set(-0.32, 0.78, -0.08);
      bicepGroup.add(lowerClamp);

      const upperClamp = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.18), bodyMat);
      upperClamp.position.set(-0.30, 1.58, -0.24);
      bicepGroup.add(upperClamp);

      // ── DOUBLE-BUNDLED CORRUGATED CONDUIT (DRESS PACK HARNESS) ──
      // Primary thick flexible conduit hose (from photo!)
      const hose1Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.42, 0.35, 0.35),
        new THREE.Vector3(-0.66, 0.68, 0.22),
        new THREE.Vector3(-0.58, 1.15, 0.04),
        new THREE.Vector3(-0.48, 1.65, -0.16),
        new THREE.Vector3(-0.38, 2.15, -0.28),
        new THREE.Vector3(-0.22, 2.45, -0.05),
      ]);
      const hose1Mesh = new THREE.Mesh(
        new THREE.TubeGeometry(hose1Curve, 40, 0.065, 12, false),
        hoseBlackMat
      );
      bicepGroup.add(hose1Mesh);

      // Secondary parallel conduit line (gas & power cable)
      const hose2Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.38, 0.38, 0.32),
        new THREE.Vector3(-0.56, 0.72, 0.18),
        new THREE.Vector3(-0.48, 1.20, 0.02),
        new THREE.Vector3(-0.42, 1.68, -0.18),
        new THREE.Vector3(-0.35, 2.18, -0.28),
        new THREE.Vector3(-0.20, 2.48, -0.02),
      ]);
      const hose2Mesh = new THREE.Mesh(
        new THREE.TubeGeometry(hose2Curve, 32, 0.038, 10, false),
        hoseBlackMat
      );
      bicepGroup.add(hose2Mesh);

      j2Group.add(bicepGroup);

      // ── ELBOW & UPPER ARM / FOREARM (Axis 3 Pitch) ──
      // Located at top of the curved bicep arm
      j3Group.position.set(0, 2.15, -0.22);

      // Cylindrical elbow cross-shaft
      const elbowHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.05, 24), machinedSteelMat);
      elbowHousing.rotation.z = Math.PI / 2;
      j3Group.add(elbowHousing);

      // Circular bolt ring on elbow hub disc
      const elbowBoltRing = createBoltRing(0.34, 12);
      elbowBoltRing.position.set(-0.54, 0, 0);
      elbowBoltRing.rotation.y = -Math.PI / 2;
      j3Group.add(elbowBoltRing);

      // Axis 3 Black Servomotor Block on right side with Yellow Warning label
      const ax3Motor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.45), motorBlackMat);
      ax3Motor.position.set(0.58, 0, 0);
      j3Group.add(ax3Motor);

      const ax3Warn = createYellowWarning(0.15, 0.13);
      ax3Warn.position.set(0.82, 0, 0);
      ax3Warn.rotation.y = Math.PI / 2;
      j3Group.add(ax3Warn);

      // ── SCULPTED CAST FOREARM (UPPER ARM) ──
      const forearmBody = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.85, 0.44), bodyMat);
      forearmBody.position.set(0, 0.92, 0);
      forearmBody.castShadow = true;
      j3Group.add(forearmBody);

      // Rear motor housing for Axis 4/5 atop the forearm
      const ax45Housing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.42), motorBlackMat);
      ax45Housing.position.set(0, 0.5, -0.26);
      j3Group.add(ax45Housing);

      // ── AUTHENTIC BLUE DAIHEN FD-B6 NAMEPLATE BADGE (from photo!) ──
      const badge = createDaihenBadge(0.56, 0.18);
      badge.position.set(-0.23, 1.35, 0);
      badge.rotation.y = -Math.PI / 2;
      j3Group.add(badge);

      // Forearm Roll (Axis 4)
      j4Group.position.set(0, 1.85, 0);
      const rollBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.32, 24), machinedSteelMat);
      rollBarrel.position.y = 0.16;
      j4Group.add(rollBarrel);
      j3Group.add(j4Group);

      // Wrist Pitch (Axis 5)
      j5Group.position.set(0, 0.32, 0);
      const wristPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.48, 16), machinedSteelMat);
      wristPivot.position.y = 0.16;
      wristPivot.rotation.z = Math.PI / 2;
      j5Group.add(wristPivot);

      const wristBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.32), bodyMat);
      wristBody.position.y = 0.26;
      j5Group.add(wristBody);
      j4Group.add(j5Group);

      // Tool Flange (Axis 6)
      j6Group.position.set(0, 0.44, 0);
      const toolFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24), motorBlackMat);
      toolFlange.position.y = 0.04;
      j6Group.add(toolFlange);

      // Shock sensor safety collision mount
      const shockSensor = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.16, 16), motorBlackMat);
      shockSensor.position.y = 0.16;
      j6Group.add(shockSensor);
      j5Group.add(j6Group);

    } else if (robotType === 'handling') {
      // ════════════════════════════════════════════════════════════════════════
      // 2. ROBOT HANDLING — EXACT REPLICA OF robot_handling.png (OTC Dual Servos)
      // Dual black motor blocks on shoulder & elbow with bright yellow warning labels!
      // ════════════════════════════════════════════════════════════════════════

      // Base pedestal with circular mounting flange
      const baseRiser = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.44, 32), bodyMat);
      baseRiser.position.y = 0.22;
      baseRiser.castShadow = true;
      pedestalGroup.add(baseRiser);

      // 8 anchor bolts
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8), boltSteelMat);
        bolt.position.set(Math.cos(angle) * 1.28, 0.24, Math.sin(angle) * 1.28);
        pedestalGroup.add(bolt);
      }

      // Turret (J1)
      j1Group.position.set(0, 0.52, 0);
      const turntable = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.1, 0.2, 32), bodyMat);
      turntable.position.y = 0.1;
      j1Group.add(turntable);

      const turretBody = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.72, 1.1), bodyMat);
      turretBody.position.set(0, 0.55, 0.06);
      turretBody.castShadow = true;
      j1Group.add(turretBody);

      // Shoulder support fork
      const lugL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.88, 0.7), bodyMat);
      lugL.position.set(0.5, 0.85, 0.16);
      j1Group.add(lugL);
      const lugR = lugL.clone();
      lugR.position.x = -0.5;
      j1Group.add(lugR);

      // Shoulder & Lower Arm (J2)
      j2Group.position.set(0, 1.02, 0.16);
      const shoulderShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.3, 24), machinedSteelMat);
      shoulderShaft.rotation.z = Math.PI / 2;
      j2Group.add(shoulderShaft);

      // ── PROMINENT AXIS 2 BLACK MOTOR BLOCK WITH YELLOW WARNING LABEL (from photo!) ──
      const ax2MotorBlock = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.42), motorBlackMat);
      ax2MotorBlock.position.set(0.6, 0.15, -0.32);
      ax2MotorBlock.castShadow = true;
      j2Group.add(ax2MotorBlock);

      const ax2Warn = createYellowWarning(0.16, 0.14);
      ax2Warn.position.set(0.83, 0.15, -0.32);
      ax2Warn.rotation.y = Math.PI / 2;
      j2Group.add(ax2Warn);

      // Sturdy cast handling arm
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.1, 0.48), bodyMat);
      armL.position.set(0.38, 1.05, 0);
      armL.castShadow = true;
      j2Group.add(armL);
      const armR = armL.clone();
      armR.position.x = -0.38;
      j2Group.add(armR);

      const armCore = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 0.36), bodyDarkMat);
      armCore.position.set(0, 1.0, 0);
      j2Group.add(armCore);

      // Elbow (J3)
      j3Group.position.set(0, 2.1, 0);
      const elbowHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.15, 24), machinedSteelMat);
      elbowHousing.rotation.z = Math.PI / 2;
      j3Group.add(elbowHousing);

      // ── PROMINENT AXIS 3 BLACK MOTOR BLOCK WITH YELLOW WARNING LABEL (from photo!) ──
      const ax3MotorBlock = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.4), motorBlackMat);
      ax3MotorBlock.position.set(0.62, 0, 0);
      ax3MotorBlock.castShadow = true;
      j3Group.add(ax3MotorBlock);

      const ax3Warn = createYellowWarning(0.16, 0.14);
      ax3Warn.position.set(0.85, 0, 0);
      ax3Warn.rotation.y = Math.PI / 2;
      j3Group.add(ax3Warn);

      // Forearm body
      const forearmBody = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.85, 0.46), bodyMat);
      forearmBody.position.set(0, 0.92, 0);
      forearmBody.castShadow = true;
      j3Group.add(forearmBody);

      // Blue OTC Brand Badge (from photo!)
      const badge = createDaihenBadge(0.5, 0.18, 'OTC');
      badge.position.set(0.24, 1.25, 0);
      badge.rotation.y = Math.PI / 2;
      j3Group.add(badge);

      // Forearm Roll (J4)
      j4Group.position.set(0, 1.85, 0);
      const rollBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.34, 24), machinedSteelMat);
      rollBarrel.position.y = 0.17;
      j4Group.add(rollBarrel);
      j3Group.add(j4Group);

      // Wrist Pitch (J5)
      j5Group.position.set(0, 0.34, 0);
      const wristPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.52, 16), machinedSteelMat);
      wristPivot.position.y = 0.17;
      wristPivot.rotation.z = Math.PI / 2;
      j5Group.add(wristPivot);

      const wristBody = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.38, 0.36), bodyMat);
      wristBody.position.y = 0.28;
      j5Group.add(wristBody);
      j4Group.add(j5Group);

      // Tool Flange (J6)
      j6Group.position.set(0, 0.46, 0);
      const toolFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 24), motorBlackMat);
      toolFlange.position.y = 0.04;
      j6Group.add(toolFlange);
      j5Group.add(j6Group);

    } else if (robotType === 'cutting') {
      // ════════════════════════════════════════════════════════════════════════
      // 3. ROBOT CUTTING — EXACT REPLICA OF robot_cutting.png (DAIHEN FD-A20)
      // Signature Mechanical Parallel Link Rod (Tie-Rod) & Long-Reach Geometry!
      // ════════════════════════════════════════════════════════════════════════

      // Cast base pedestal with corner bolt pads
      const baseRiser = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.45, 0.48, 32), bodyMat);
      baseRiser.position.y = 0.24;
      baseRiser.castShadow = true;
      pedestalGroup.add(baseRiser);

      // Corner bolt lugs
      const boltPads = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      boltPads.forEach((ang) => {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8), boltSteelMat);
        bolt.position.set(Math.cos(ang) * 1.34, 0.3, Math.sin(ang) * 1.34);
        pedestalGroup.add(bolt);
      });

      // Turret (J1)
      j1Group.position.set(0, 0.54, 0);
      const turntable = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.15, 0.22, 32), bodyMat);
      turntable.position.y = 0.11;
      j1Group.add(turntable);

      const turretBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.78, 1.15), bodyMat);
      turretBody.position.set(0, 0.58, 0.08);
      turretBody.castShadow = true;
      j1Group.add(turretBody);

      // ── LOWER LINKAGE ROD MOUNT PIVOT (front-left on turret, from photo!) ──
      const linkPivotLower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16), machinedSteelMat);
      linkPivotLower.position.set(-0.48, 0.45, 0.32);
      linkPivotLower.rotation.z = Math.PI / 2;
      j1Group.add(linkPivotLower);

      // Turret upright fork
      const lugL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 0.75), bodyMat);
      lugL.position.set(0.52, 0.88, 0.18);
      j1Group.add(lugL);
      const lugR = lugL.clone();
      lugR.position.x = -0.52;
      j1Group.add(lugR);

      // Shoulder & Lower Arm (J2)
      j2Group.position.set(0, 1.05, 0.18);
      const shoulderShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1.35, 24), machinedSteelMat);
      shoulderShaft.rotation.z = Math.PI / 2;
      j2Group.add(shoulderShaft);

      const boltRing = createBoltRing(0.4, 16);
      boltRing.position.set(0.62, 0, 0);
      boltRing.rotation.y = Math.PI / 2;
      j2Group.add(boltRing);

      // Forward-angled cast lower arm
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.3, 0.46), bodyMat);
      armL.position.set(0.38, 1.15, 0);
      armL.castShadow = true;
      j2Group.add(armL);
      const armR = armL.clone();
      armR.position.x = -0.38;
      j2Group.add(armR);

      // ── THE SIGNATURE PARALLEL LINKAGE ROD (TIE-ROD MECHANISM, from photo!) ──
      const linkRodGroup = new THREE.Group();
      const linkRod = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.25, 0.14), bodyMat);
      linkRod.position.set(-0.48, 1.15, 0.28);
      linkRod.castShadow = true;
      linkRodGroup.add(linkRod);

      const linkJointTop = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 16), machinedSteelMat);
      linkJointTop.position.set(-0.48, 2.25, 0.28);
      linkJointTop.rotation.z = Math.PI / 2;
      linkRodGroup.add(linkJointTop);

      const linkJointBot = linkJointTop.clone();
      linkJointBot.position.set(-0.48, 0.05, 0.28);
      linkRodGroup.add(linkJointBot);

      j2Group.add(linkRodGroup);

      // Elbow (J3) with Triangular Bellcrank Lever
      j3Group.position.set(0, 2.3, 0);
      const elbowHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.2, 24), machinedSteelMat);
      elbowHousing.rotation.z = Math.PI / 2;
      j3Group.add(elbowHousing);

      // Triangular bellcrank crank lever on elbow (where tie rod connects)
      const bellCrank = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.4), bodyMat);
      bellCrank.position.set(-0.48, 0, 0.2);
      j3Group.add(bellCrank);

      // Axis 3 motor on elbow rear
      const ax3Motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 16), motorBlackMat);
      ax3Motor.position.set(0.65, 0, 0);
      ax3Motor.rotation.z = Math.PI / 2;
      j3Group.add(ax3Motor);

      // Long extended forearm (DAIHEN FD-A20 long reach)
      const forearmBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.2, 0.42), bodyMat);
      forearmBody.position.set(0, 1.1, 0);
      forearmBody.castShadow = true;
      j3Group.add(forearmBody);

      // Blue DAIHEN Brand Badge on forearm (from photo!)
      const badge = createDaihenBadge(0.6, 0.18, 'DAIHEN');
      badge.position.set(0.22, 1.5, 0);
      badge.rotation.y = Math.PI / 2;
      j3Group.add(badge);

      // Forearm Roll (J4)
      j4Group.position.set(0, 2.2, 0);
      const rollBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.32, 24), machinedSteelMat);
      rollBarrel.position.y = 0.16;
      j4Group.add(rollBarrel);
      j3Group.add(j4Group);

      // Wrist Pitch (J5)
      j5Group.position.set(0, 0.32, 0);
      const wristPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16), machinedSteelMat);
      wristPivot.position.y = 0.16;
      wristPivot.rotation.z = Math.PI / 2;
      j5Group.add(wristPivot);

      const wristBody = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.38, 0.34), bodyMat);
      wristBody.position.y = 0.26;
      j5Group.add(wristBody);
      j4Group.add(j5Group);

      // Tool Flange (J6)
      j6Group.position.set(0, 0.44, 0);
      const toolFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 24), motorBlackMat);
      toolFlange.position.y = 0.04;
      j6Group.add(toolFlange);
      j5Group.add(j6Group);
    }

    // Assemble root kinematic tree
    j2Group.add(j3Group);
    j1Group.add(j2Group);
    robotRoot.add(pedestalGroup);
    robotRoot.add(j1Group);

    // ══════════════════════════════════════════════════════════════════════════
    // INTERCHANGEABLE TOOL HEADS BASED ON ROBOT TYPE
    // ══════════════════════════════════════════════════════════════════════════
    const toolGroup = new THREE.Group();
    toolGroup.position.y = 0.08;

    let sparkSystem = null;
    let gripperJawsObj = null;
    let laserBeamObj = null;
    let arcLightObj = null;

    if (robotType === 'welding') {
      // ── WELDING TORCH END-EFFECTOR ──
      const torchMount = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.2, 0.2, 16),
        bodyDarkMat
      );
      torchMount.position.y = 0.1;
      toolGroup.add(torchMount);

      // Gooseneck angled pipe (3 segments)
      const pipe1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12),
        machinedSteelMat
      );
      pipe1.position.set(0, 0.28, 0.05);
      pipe1.rotation.x = 0.35;
      toolGroup.add(pipe1);

      const pipe2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.35, 12),
        machinedSteelMat
      );
      pipe2.position.set(0, 0.52, 0.18);
      pipe2.rotation.x = 0.6;
      toolGroup.add(pipe2);

      // Ceramic heat insulator ring
      const insulator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
      );
      insulator.position.set(0, 0.68, 0.28);
      insulator.rotation.x = 0.6;
      toolGroup.add(insulator);

      // Brass/Copper gas cup shroud
      const gasCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.07, 0.25, 16),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.8 })
      );
      gasCup.position.set(0, 0.82, 0.37);
      gasCup.rotation.x = 0.6;
      toolGroup.add(gasCup);

      // Contact tip (copper wire guide)
      const contactTip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.2, metalness: 0.9 })
      );
      contactTip.position.set(0, 0.96, 0.45);
      contactTip.rotation.x = 0.6;
      toolGroup.add(contactTip);

      // Dynamic Arc Flash Light
      arcLightObj = new THREE.PointLight(0x38bdf8, 0, 4);
      arcLightObj.position.set(0, 1.05, 0.5);
      toolGroup.add(arcLightObj);

      // Glowing electrode tip
      const tipGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
      );
      tipGlow.position.set(0, 1.02, 0.49);
      toolGroup.add(tipGlow);

      // Welding spark particles
      const sparkCount = 24;
      const sparkGeo = new THREE.BufferGeometry();
      const sparkPositions = new Float32Array(sparkCount * 3);
      const sparkVelocities = [];

      for (let i = 0; i < sparkCount; i++) {
        sparkPositions[i * 3] = 0;
        sparkPositions[i * 3 + 1] = 1.05;
        sparkPositions[i * 3 + 2] = 0.5;
        sparkVelocities.push({
          x: (Math.random() - 0.5) * 0.05,
          y: Math.random() * 0.06 + 0.01,
          z: (Math.random() - 0.5) * 0.05,
          life: Math.random(),
        });
      }
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
      const sparkMat = new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.06,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      sparkSystem = new THREE.Points(sparkGeo, sparkMat);
      sparkSystem.userData = { velocities: sparkVelocities };
      toolGroup.add(sparkSystem);

    } else if (robotType === 'handling') {
      // ── PNEUMATIC PARALLEL GRIPPER END-EFFECTOR ──
      const gripperBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.28, 0.35),
        bodyDarkMat
      );
      gripperBody.position.y = 0.16;
      toolGroup.add(gripperBody);

      // Pneumatic ports & indicator LED
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      led.position.set(0, 0.25, 0.18);
      toolGroup.add(led);

      // Guide rails (chrome rods)
      const rail1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.68, 12),
        chromePistonMat
      );
      rail1.rotation.z = Math.PI / 2;
      rail1.position.set(0, 0.16, 0.08);
      toolGroup.add(rail1);

      // Jaws: Left and Right
      const jawMat = createMat({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
      const padMat = createMat({ color: 0x06b6d4, roughness: 0.7, metalness: 0.2 });

      const leftJawGroup = new THREE.Group();
      leftJawGroup.position.set(-0.22, 0.38, 0);

      const leftJawArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.22), jawMat);
      const leftPad = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.2), padMat);
      leftPad.position.x = 0.055;
      leftJawGroup.add(leftJawArm);
      leftJawGroup.add(leftPad);
      toolGroup.add(leftJawGroup);

      const rightJawGroup = new THREE.Group();
      rightJawGroup.position.set(0.22, 0.38, 0);

      const rightJawArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.22), jawMat);
      const rightPad = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.2), padMat);
      rightPad.position.x = -0.055;
      rightJawGroup.add(rightJawArm);
      rightJawGroup.add(rightPad);
      toolGroup.add(rightJawGroup);

      gripperJawsObj = { left: leftJawGroup, right: rightJawGroup };

      // Workpiece (Machined aluminum component held in gripper)
      const workpiece = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.28, 0.2),
        createMat({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 })
      );
      workpiece.position.set(0, 0.45, 0);
      toolGroup.add(workpiece);

      // Laser alignment sensor beam
      const laserGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.2, 8);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 });
      const laserBeam = new THREE.Mesh(laserGeo, laserMat);
      laserBeam.position.set(0, 1.1, 0);
      toolGroup.add(laserBeam);

    } else if (robotType === 'cutting') {
      // ── PLASMA / FIBER LASER CUTTING HEAD ──
      const headBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 0.45, 24),
        machinedSteelMat
      );
      headBody.position.y = 0.24;
      toolGroup.add(headBody);

      // Heat dissipation cooling fins
      for (let f = 0; f < 4; f++) {
        const fin = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24),
          machinedSteelMat
        );
        fin.position.y = 0.16 + f * 0.07;
        toolGroup.add(fin);
      }

      // Height sensor ceramic ring (THC)
      const thcRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.03, 12, 32),
        warningYellowMat
      );
      thcRing.rotation.x = Math.PI / 2;
      thcRing.position.y = 0.48;
      toolGroup.add(thcRing);

      // Conical nozzle shroud
      const nozzle = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.35, 24),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.9 })
      );
      nozzle.position.y = 0.65;
      nozzle.rotation.x = Math.PI; // point down
      toolGroup.add(nozzle);

      // Concentrated laser / plasma beam cone
      const beamGeo = new THREE.ConeGeometry(0.12, 1.4, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 1.4;
      toolGroup.add(beam);
      laserBeamObj = beam;

      // Hot cutting point light
      arcLightObj = new THREE.PointLight(0xef4444, 2.5, 3.5);
      arcLightObj.position.set(0, 1.8, 0);
      toolGroup.add(arcLightObj);

      // Target surface glow ring
      const targetGlow = new THREE.Mesh(
        new THREE.RingGeometry(0.04, 0.18, 24),
        new THREE.MeshBasicMaterial({ color: 0xffedd5, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
      );
      targetGlow.rotation.x = Math.PI / 2;
      targetGlow.position.y = 1.95;
      toolGroup.add(targetGlow);
    }

    j6Group.add(toolGroup);
    j5Group.add(j6Group);

    scene.add(robotRoot);

    // Save references to joints for animation loop
    stateRef.current.joints = {
      j1: j1Group,
      j2: j2Group,
      j3: j3Group,
      j4: j4Group,
      j5: j5Group,
      j6: j6Group,
    };
    stateRef.current.toolGroup = toolGroup;
    stateRef.current.sparkParticles = sparkSystem;
    stateRef.current.gripperJaws = gripperJawsObj;
    stateRef.current.laserBeam = laserBeamObj;
    stateRef.current.arcLight = arcLightObj;

    // ══════════════════════════════════════════════════════════════════════════
    // ANIMATION & KINEMATICS RENDER LOOP
    // ══════════════════════════════════════════════════════════════════════════
    let animationFrameId;
    let clock = new THREE.Clock();
    let lastTelemetryUpdate = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const s = stateRef.current;

      // 1. Calculate Target Pose based on active step or continuous scrollProgress
      const poses = POSES[s.robotType] || POSES.welding;
      const stepIdx = Math.max(0, Math.min(3, s.activeStep));

      // Calculate interpolation between poses if scrollProgress is available
      let targetJ1 = poses[stepIdx].j1;
      let targetJ2 = poses[stepIdx].j2;
      let targetJ3 = poses[stepIdx].j3;
      let targetJ4 = poses[stepIdx].j4;
      let targetJ5 = poses[stepIdx].j5;
      let targetJ6 = poses[stepIdx].j6;

      // Optional scrollProgress interpolation
      if (s.scrollProgress !== undefined && s.scrollProgress !== null) {
        const clampedProg = Math.max(0, Math.min(3, s.scrollProgress));
        const idxLow = Math.floor(clampedProg);
        const idxHigh = Math.min(3, idxLow + 1);
        const frac = clampedProg - idxLow;

        const p1 = poses[idxLow] || poses[0];
        const p2 = poses[idxHigh] || poses[3];

        targetJ1 = THREE.MathUtils.lerp(p1.j1, p2.j1, frac);
        targetJ2 = THREE.MathUtils.lerp(p1.j2, p2.j2, frac);
        targetJ3 = THREE.MathUtils.lerp(p1.j3, p2.j3, frac);
        targetJ4 = THREE.MathUtils.lerp(p1.j4, p2.j4, frac);
        targetJ5 = THREE.MathUtils.lerp(p1.j5, p2.j5, frac);
        targetJ6 = THREE.MathUtils.lerp(p1.j6, p2.j6, frac);
      }

      // Add gentle idle breathing movement to arm when idle
      const breath = Math.sin(elapsed * 1.5) * 0.015;
      targetJ2 += breath;
      targetJ3 -= breath * 0.8;

      // 2. Smoothly Lerp Joint Angles (Damped Spring feel)
      const lerpSpeed = 0.07;
      s.currentPose.j1 += (targetJ1 - s.currentPose.j1) * lerpSpeed;
      s.currentPose.j2 += (targetJ2 - s.currentPose.j2) * lerpSpeed;
      s.currentPose.j3 += (targetJ3 - s.currentPose.j3) * lerpSpeed;
      s.currentPose.j4 += (targetJ4 - s.currentPose.j4) * lerpSpeed;
      s.currentPose.j5 += (targetJ5 - s.currentPose.j5) * lerpSpeed;
      s.currentPose.j6 += (targetJ6 - s.currentPose.j6) * lerpSpeed;

      // Apply to 3D scene objects (Anthropomorphic pitch axes on X, azimuth on Y)
      if (s.joints) {
        s.joints.j1.rotation.y = s.currentPose.j1;
        s.joints.j2.rotation.x = s.currentPose.j2;
        s.joints.j3.rotation.x = s.currentPose.j3;
        s.joints.j4.rotation.y = s.currentPose.j4;
        s.joints.j5.rotation.x = s.currentPose.j5;
        s.joints.j6.rotation.y = s.currentPose.j6;
      }

      // 3. Tool specific animations
      if (s.robotType === 'welding') {
        // Spark particles & arc flicker when active (Step 2 or near it)
        const isActionActive = s.activeStep === 2 || (s.scrollProgress >= 1.5 && s.scrollProgress <= 2.5);
        if (s.arcLight) {
          s.arcLight.intensity = isActionActive ? 1.5 + Math.random() * 2.5 : 0.2;
          s.arcLight.color.setHex(Math.random() > 0.4 ? 0x38bdf8 : 0xf97316);
        }

        if (s.sparkParticles && s.sparkParticles.geometry) {
          const positions = s.sparkParticles.geometry.attributes.position.array;
          const vels = s.sparkParticles.userData.velocities;
          for (let i = 0; i < vels.length; i++) {
            if (isActionActive) {
              positions[i * 3] += vels[i].x;
              positions[i * 3 + 1] += vels[i].y;
              positions[i * 3 + 2] += vels[i].z;
              vels[i].y -= 0.002; // gravity
              vels[i].life -= 0.03;

              if (vels[i].life <= 0) {
                positions[i * 3] = 0;
                positions[i * 3 + 1] = 1.05;
                positions[i * 3 + 2] = 0.5;
                vels[i].x = (Math.random() - 0.5) * 0.04;
                vels[i].y = Math.random() * 0.05 + 0.01;
                vels[i].z = (Math.random() - 0.5) * 0.04;
                vels[i].life = 1.0;
              }
            } else {
              positions[i * 3] = 0;
              positions[i * 3 + 1] = 1.05;
              positions[i * 3 + 2] = 0.5;
            }
          }
          s.sparkParticles.geometry.attributes.position.needsUpdate = true;
        }
      } else if (s.robotType === 'handling') {
        // Gripper open / close animation
        if (s.gripperJaws) {
          const isGrip = s.activeStep === 2 || s.activeStep === 3;
          const targetJawOffset = isGrip ? 0.14 : 0.24;
          s.gripperJaws.left.position.x += (-targetJawOffset - s.gripperJaws.left.position.x) * 0.1;
          s.gripperJaws.right.position.x += (targetJawOffset - s.gripperJaws.right.position.x) * 0.1;
        }
      } else if (s.robotType === 'cutting') {
        // Laser beam opacity pulse
        if (s.laserBeam) {
          const isCutting = s.activeStep === 2;
          s.laserBeam.material.opacity = isCutting ? 0.7 + Math.sin(elapsed * 20) * 0.2 : 0.25;
        }
        if (s.arcLight) {
          s.arcLight.intensity = s.activeStep === 2 ? 3.0 + Math.random() * 1.5 : 0.6;
        }
      }

      // 4. Auto-rotation turntable if enabled
      if (s.autoRotate && s.controls) {
        s.controls.autoRotate = true;
        s.controls.autoRotateSpeed = 1.8;
      } else if (s.controls) {
        s.controls.autoRotate = false;
      }

      s.controls.update();
      renderer.render(scene, camera);

      // 5. Update UI Telemetry periodically (every 100ms)
      if (elapsed - lastTelemetryUpdate > 0.1) {
        lastTelemetryUpdate = elapsed;
        setTelemetry({
          j1: Math.round(THREE.MathUtils.radToDeg(s.currentPose.j1)),
          j2: Math.round(THREE.MathUtils.radToDeg(s.currentPose.j2)),
          j3: Math.round(THREE.MathUtils.radToDeg(s.currentPose.j3)),
          j4: Math.round(THREE.MathUtils.radToDeg(s.currentPose.j4)),
          j5: Math.round(THREE.MathUtils.radToDeg(s.currentPose.j5)),
          j6: Math.round(THREE.MathUtils.radToDeg(s.currentPose.j6)),
        });
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // ══════════════════════════════════════════════════════════════════════════
    // RESIZE OBSERVER
    // ══════════════════════════════════════════════════════════════════════════
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        const newW = cr.width;
        const newH = cr.height;
        if (newW > 0 && newH > 0 && camera && renderer) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (controls) controls.dispose();
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      matList.forEach((m) => m && m.dispose());
    };
  }, [robotType]);

  const currentTheme = THEMES[robotType] || THEMES.welding;

  const STEPS_NAV = useMemo(() => [
    { idx: 0, labelEn: '01 Overview', labelId: '01 Ikhtisar' },
    { idx: 1, labelEn: '02 Kinematics', labelId: '02 Kinematika' },
    { idx: 2, labelEn: '03 Precision Tool', labelId: '03 Perkakas Presisi' },
    { idx: 3, labelEn: '04 Tech Specs', labelId: '04 Spesifikasi' },
  ], []);

  return (
    <div className="robot-3d-viewport">
      {/* 3D Canvas Mount Point */}
      <div className="robot-3d-canvas-container" ref={mountRef}>
        {!webGLSupported && (
          <div className="robot-3d-fallback">
            <div className="robot-3d-fallback__badge">WebGL Disabled</div>
            <p>{isId ? 'Rendering 3D membutuhkan WebGL browser aktif.' : '3D preview requires an active WebGL browser.'}</p>
          </div>
        )}
      </div>

      {/* Floating Side Pose / Step Quick Selector */}
      <div className="robot-3d-hud-steps" role="tablist">
        {STEPS_NAV.map((step) => (
          <button
            key={step.idx}
            className={`robot-3d-step-btn ${activeStep === step.idx ? 'robot-3d-step-btn--active' : ''}`}
            onClick={() => onStepSelect && onStepSelect(step.idx)}
            title={isId ? step.labelId : step.labelEn}
          >
            <span className="robot-3d-step-dot" />
            <span className="robot-3d-step-text">{isId ? step.labelId : step.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Floating Bottom Telemetry & Controls Toolbar */}
      <div className="robot-3d-hud-bottom">
        {/* Real-time Joint Angle Degrees Readout */}
        <div className="robot-3d-telemetry">
          <div className="robot-3d-telemetry-item">
            <span className="robot-3d-telemetry-label">J1</span>
            <span className="robot-3d-telemetry-val">{telemetry.j1}°</span>
          </div>
          <div className="robot-3d-telemetry-item">
            <span className="robot-3d-telemetry-label">J2</span>
            <span className="robot-3d-telemetry-val">{telemetry.j2}°</span>
          </div>
          <div className="robot-3d-telemetry-item">
            <span className="robot-3d-telemetry-label">J3</span>
            <span className="robot-3d-telemetry-val">{telemetry.j3}°</span>
          </div>
          <div className="robot-3d-telemetry-item">
            <span className="robot-3d-telemetry-label">J4</span>
            <span className="robot-3d-telemetry-val">{telemetry.j4}°</span>
          </div>
          <div className="robot-3d-telemetry-item">
            <span className="robot-3d-telemetry-label">J5</span>
            <span className="robot-3d-telemetry-val">{telemetry.j5}°</span>
          </div>
          <div className="robot-3d-telemetry-item">
            <span className="robot-3d-telemetry-label">J6</span>
            <span className="robot-3d-telemetry-val">{telemetry.j6}°</span>
          </div>
        </div>

        {/* Viewport Control Actions */}
        <div className="robot-3d-controls-bar">
          <button
            className={`robot-3d-btn ${autoRotate ? 'robot-3d-btn--active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title={isId ? 'Putar Otomatis' : 'Auto Rotate'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{isId ? 'Putar' : 'Rotate'}</span>
          </button>

          <button
            className={`robot-3d-btn ${wireframe ? 'robot-3d-btn--active' : ''}`}
            onClick={() => setWireframe(!wireframe)}
            title={isId ? 'Mode Rangka (Wireframe)' : 'Wireframe Mode'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>{isId ? 'Rangka' : 'Wireframe'}</span>
          </button>

          <button
            className="robot-3d-btn"
            onClick={handleResetCamera}
            title={isId ? 'Reset Posisi Kamera' : 'Reset Camera View'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Drag & Scroll Guide Hint Overlay */}
      <div className="robot-3d-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5l-5-3-5 3M17 19l-5 3-5-3" />
        </svg>
        <span>{isId ? 'Scroll untuk gerak robot • Drag kursor untuk rotasi 360°' : 'Scroll to pose • Drag to orbit 360°'}</span>
      </div>
    </div>
  );
}
