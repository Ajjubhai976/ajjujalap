/*
  UBA's Honey - Minimal 3D Glassmorphic JS
  Features: Three.js WebGL scroll-bound animations, Purity analyzer, Blockchain ledger, Operations map, Cart drawer.
*/

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Three.js 3D WebGL Setup (Jar and Bee models with Scroll Animations)
  // =========================================================================
  const webglContainer = document.getElementById('webgl-container');
  let scene, camera, renderer;
  let jarGroup, beeGroup;
  let wingLeft, wingRight;
  let scrollPercent = 0;

  if (webglContainer && typeof THREE !== 'undefined') {
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    webglContainer.appendChild(renderer.domElement);

    // Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xe0a96d, 5, 20);
    goldLight.position.set(5, 5, 5);
    scene.add(goldLight);

    const whiteLight = new THREE.DirectionalLight(0xffffff, 1.2);
    whiteLight.position.set(-5, 8, 2);
    scene.add(whiteLight);

    // -- 3D Honey Jar Mesh Generation --
    jarGroup = new THREE.Group();

    // Jar Cap (Gold Metal)
    const capGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.15, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
      name: 'cap'
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 0.9;
    jarGroup.add(capMesh);

    // Jar Neck
    const neckGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.1, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.05,
      transmission: 0.95,
      transparent: true,
      opacity: 1,
      thickness: 0.18,
      ior: 1.5,
      name: 'glass'
    });
    const neckMesh = new THREE.Mesh(neckGeo, glassMat);
    neckMesh.position.y = 0.78;
    jarGroup.add(neckMesh);

    // Jar Body (Outer Glass)
    const bodyGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.4, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, glassMat);
    bodyMesh.position.y = 0.03;
    jarGroup.add(bodyMesh);

    // Honey Core (Inner Liquid)
    const honeyGeo = new THREE.CylinderGeometry(0.63, 0.63, 1.25, 32);
    const honeyMat = new THREE.MeshStandardMaterial({
      color: 0xffa000,
      roughness: 0.1,
      metalness: 0.1,
      emissive: 0xff6f00,
      emissiveIntensity: 0.45
    });
    const honeyMesh = new THREE.Mesh(honeyGeo, honeyMat);
    honeyMesh.position.y = 0.03;
    jarGroup.add(honeyMesh);
    
    // Add to Scene
    scene.add(jarGroup);

    // -- 3D Cyber-Bee Mesh Generation --
    beeGroup = new THREE.Group();

    // Thorax (Front body)
    const thoraxGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.4, metalness: 0.8 });
    const thoraxMesh = new THREE.Mesh(thoraxGeo, blackMat);
    beeGroup.add(thoraxMesh);

    // Abdomen segments (Striped Gold/Black)
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.7 });
    
    const abd1Geo = new THREE.SphereGeometry(0.20, 16, 16);
    const abd1Mesh = new THREE.Mesh(abd1Geo, goldMat);
    abd1Mesh.position.z = -0.22;
    beeGroup.add(abd1Mesh);

    const abd2Geo = new THREE.SphereGeometry(0.21, 16, 16);
    const abd2Mesh = new THREE.Mesh(abd2Geo, blackMat);
    abd2Mesh.position.z = -0.42;
    beeGroup.add(abd2Mesh);

    const abd3Geo = new THREE.SphereGeometry(0.15, 16, 16);
    const abd3Mesh = new THREE.Mesh(abd3Geo, goldMat);
    abd3Mesh.position.z = -0.6;
    beeGroup.add(abd3Mesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, blackMat);
    headMesh.position.set(0, 0.05, 0.22);
    beeGroup.add(headMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });
    const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(0.07, 0.08, 0.28);
    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = -0.07;
    beeGroup.add(eyeLeft);
    beeGroup.add(eyeRight);

    // Wings
    const wingGeo = new THREE.BoxGeometry(0.45, 0.01, 0.2);
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0ffff,
      transmission: 0.9,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1
    });

    // Left Wing Pivot Setup
    wingLeft = new THREE.Mesh(wingGeo, wingMat);
    wingLeft.geometry.translate(0.22, 0, 0); // offset origin to pivot point
    wingLeft.position.set(0.12, 0.12, -0.05);
    beeGroup.add(wingLeft);

    // Right Wing Pivot Setup
    wingRight = new THREE.Mesh(wingGeo, wingMat);
    wingRight.geometry.translate(-0.22, 0, 0); // offset origin to pivot point
    wingRight.position.set(-0.12, 0.12, -0.05);
    beeGroup.add(wingRight);

    // Scale bee down slightly
    beeGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(beeGroup);

    // Scroll progress calculations
    const calculateScrollPercent = () => {
      const h = document.documentElement, 
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
      scrollPercent = (h[st] || b[st]) / ((h[sh] || b[sh]) - window.innerHeight);
      if (isNaN(scrollPercent)) scrollPercent = 0;
    };
    window.addEventListener('scroll', calculateScrollPercent);
    calculateScrollPercent(); // init

    // Lerp helper
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    // Scroll Coordinates Mapping Configuration
    // Sections map to: 0.0 (Hero), 0.2 (Tech), 0.4 (Analyzer), 0.6 (Ledger), 0.8 (Map), 1.0 (Store)
    const getTargetCoordinates = (pct, time) => {
      let jarTarget = { x: 2.2, y: 0.2, z: 0, rx: 0.1, ry: time * 0.4, rz: 0 };
      let beeTarget = { x: -1.8, y: 1.4, z: 0.5, rx: 0.1, ry: 0.8, rz: 0 };

      // Make responsive adjustments for smaller screen widths
      const widthFactor = window.innerWidth < 1024 ? 0 : 1;

      if (!widthFactor) {
        // Mobile layout: position elements behind text in center
        jarTarget.x = 0; jarTarget.y = 0.5; jarTarget.z = -1;
        beeTarget.x = 0; beeTarget.y = 2.0; beeTarget.z = -1.5;
        return { jarTarget, beeTarget };
      }

      if (pct < 0.2) {
        // Transition: Hero -> Tech
        const t = pct / 0.2;
        jarTarget.x = lerp(2.2, -2.4, t);
        jarTarget.y = lerp(0.2, 0.3, t);
        jarTarget.z = lerp(0, -0.5, t);
        jarTarget.rx = lerp(0.1, 0.25, t);
        jarTarget.ry = lerp(time * 0.4, time * 0.3 + 1.5, t);
        jarTarget.rz = lerp(0, -0.1, t);

        beeTarget.x = lerp(-1.8, 2.0, t);
        beeTarget.y = lerp(1.4, -0.5, t);
        beeTarget.z = lerp(0.5, 0.6, t);
        beeTarget.rx = lerp(0.1, -0.1, t);
        beeTarget.ry = lerp(0.8, -0.4, t);
      } 
      else if (pct < 0.4) {
        // Transition: Tech -> Analyzer
        const t = (pct - 0.2) / 0.2;
        jarTarget.x = lerp(-2.4, 2.3, t);
        jarTarget.y = lerp(0.3, -0.2, t);
        jarTarget.z = lerp(-0.5, 0, t);
        jarTarget.rx = lerp(0.25, -0.05, t);
        jarTarget.ry = lerp(time * 0.3 + 1.5, time * 0.4 - 0.5, t);
        jarTarget.rz = lerp(-0.1, 0.05, t);

        beeTarget.x = lerp(2.0, -2.4, t);
        beeTarget.y = lerp(-0.5, 1.2, t);
        beeTarget.z = lerp(0.6, -1.0, t);
        beeTarget.rx = lerp(-0.1, 0.05, t);
        beeTarget.ry = lerp(-0.4, 1.0, t);
      } 
      else if (pct < 0.6) {
        // Transition: Analyzer -> Ledger
        const t = (pct - 0.4) / 0.2;
        jarTarget.x = lerp(2.3, -2.6, t);
        jarTarget.y = lerp(-0.2, 0.2, t);
        jarTarget.z = lerp(0, -1.5, t);
        jarTarget.rx = lerp(-0.05, 0.1, t);
        jarTarget.ry = lerp(time * 0.4 - 0.5, time * 0.2 + 2.0, t);
        jarTarget.rz = lerp(0.05, -0.05, t);

        beeTarget.x = lerp(-2.4, 2.2, t);
        beeTarget.y = lerp(1.2, 0.6, t);
        beeTarget.z = lerp(-1.0, 0.2, t);
        beeTarget.rx = lerp(0.05, 0.0, t);
        beeTarget.ry = lerp(1.0, -0.8, t);
      } 
      else if (pct < 0.8) {
        // Transition: Ledger -> Map
        const t = (pct - 0.6) / 0.2;
        jarTarget.x = lerp(-2.6, 0.0, t);
        jarTarget.y = lerp(0.2, 1.8, t);
        jarTarget.z = lerp(-1.5, -4.5, t);
        jarTarget.rx = lerp(0.1, 0.4, t);
        jarTarget.ry = lerp(time * 0.2 + 2.0, time * 0.5, t);
        jarTarget.rz = lerp(-0.05, 0.0, t);

        beeTarget.x = lerp(2.2, -1.2, t);
        beeTarget.y = lerp(0.6, -0.6, t);
        beeTarget.z = lerp(0.2, -1.2, t);
        beeTarget.rx = lerp(0.0, -0.2, t);
        beeTarget.ry = lerp(-0.8, 0.6, t);
      } 
      else {
        // Transition: Map -> Store
        const t = (pct - 0.8) / 0.2;
        jarTarget.x = lerp(0.0, -2.1, t);
        jarTarget.y = lerp(1.8, -0.2, t);
        jarTarget.z = lerp(-4.5, 0.8, t);
        jarTarget.rx = lerp(0.4, 0.08, t);
        jarTarget.ry = lerp(time * 0.5, time * 0.4 + 0.5, t);
        jarTarget.rz = lerp(0.0, 0.0, t);

        beeTarget.x = lerp(-1.2, 1.8, t);
        beeTarget.y = lerp(-0.6, -1.1, t);
        beeTarget.z = lerp(-1.2, 1.2, t);
        beeTarget.rx = lerp(-0.2, 0.08, t);
        beeTarget.ry = lerp(0.6, -0.6, t);
      }

      return { jarTarget, beeTarget };
    };

    // Actual coordinates to lerp
    let jarCurrent = { x: 2.2, y: 0.2, z: 0, rx: 0.1, ry: 0, rz: 0 };
    let beeCurrent = { x: -1.8, y: 1.4, z: 0.5, rx: 0.1, ry: 0.8, rz: 0 };

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Wing flapping animation
      if (wingLeft && wingRight) {
        wingLeft.rotation.z = Math.sin(time * 65) * 0.5;
        wingRight.rotation.z = -Math.sin(time * 65) * 0.5;
      }

      // Calculate Target Positions
      const { jarTarget, beeTarget } = getTargetCoordinates(scrollPercent, time);

      // Interpolate actual positions (smooth lerping)
      jarCurrent.x = lerp(jarCurrent.x, jarTarget.x, 0.06);
      jarCurrent.y = lerp(jarCurrent.y, jarTarget.y, 0.06);
      jarCurrent.z = lerp(jarCurrent.z, jarTarget.z, 0.06);
      jarCurrent.rx = lerp(jarCurrent.rx, jarTarget.rx, 0.06);
      jarCurrent.ry = lerp(jarCurrent.ry, jarTarget.ry, 0.06);
      jarCurrent.rz = lerp(jarCurrent.rz, jarTarget.rz, 0.06);

      beeCurrent.x = lerp(beeCurrent.x, beeTarget.x, 0.06);
      beeCurrent.y = lerp(beeCurrent.y, beeTarget.y, 0.06);
      beeCurrent.z = lerp(beeCurrent.z, beeTarget.z, 0.06);
      beeCurrent.rx = lerp(beeCurrent.rx, beeTarget.rx, 0.06);
      beeCurrent.ry = lerp(beeCurrent.ry, beeTarget.ry, 0.06);

      // Apply coordinates + subtle hovering offset
      jarGroup.position.set(jarCurrent.x, jarCurrent.y + Math.sin(time * 1.5) * 0.04, jarCurrent.z);
      jarGroup.rotation.set(jarCurrent.rx, jarCurrent.ry, jarCurrent.rz);

      beeGroup.position.set(beeCurrent.x, beeCurrent.y + Math.sin(time * 2.5) * 0.06, beeCurrent.z);
      // Face flight direction helper (subtle tilt)
      beeGroup.rotation.set(beeCurrent.rx, beeCurrent.ry, Math.sin(time * 2) * 0.03);

      renderer.render(scene, camera);
    };

    animate();
  }

  // =========================================================================
  // 2. Interactive Molecular Purity Analyzer
  // =========================================================================
  const viscositySlider = document.getElementById('viscosity-slider');
  const enzymeSlider = document.getElementById('enzyme-slider');
  const pollenSlider = document.getElementById('pollen-slider');
  const hmfSlider = document.getElementById('hmf-slider');

  const viscosityVal = document.getElementById('viscosity-val');
  const enzymeVal = document.getElementById('enzyme-val');
  const pollenVal = document.getElementById('pollen-val');
  const hmfVal = document.getElementById('hmf-val');

  const gaugePercentage = document.getElementById('gauge-percentage');
  const gaugeFill = document.getElementById('gauge-fill');
  const gradeBanner = document.getElementById('grade-banner');
  const statusReadout = document.getElementById('status-readout');

  const updateAnalyzer = () => {
    const visc = parseFloat(viscositySlider.value);
    const enz = parseFloat(enzymeSlider.value);
    const pollen = parseFloat(pollenSlider.value);
    const hmf = parseFloat(hmfSlider.value);

    viscosityVal.innerText = `${visc.toLocaleString()} cps`;
    enzymeVal.innerText = `${enz} DU`;
    pollenVal.innerText = `${pollen}%`;
    hmfVal.innerText = `${hmf} mg/kg`;

    // Visual background fill ratios for custom sliders
    const sliders = [viscositySlider, enzymeSlider, pollenSlider, hmfSlider];
    sliders.forEach(slider => {
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const val = parseFloat(slider.value);
      const pct = ((val - min) / (max - min)) * 100;
      slider.style.setProperty('--percent', `${pct}%`);
    });

    // Purity logic
    const pollFactor = pollen / 100;
    const enzFactor = enz / 40;
    const hmfFactor = Math.max(0, 1 - (hmf / 40));
    
    const optimalVisc = 2200;
    const viscVariance = Math.abs(visc - optimalVisc) / 2200;
    const viscFactor = Math.max(0, 1 - viscVariance);

    let purity = (pollFactor * 40) + (enzFactor * 30) + (hmfFactor * 20) + (viscFactor * 10);
    purity = Math.min(99.99, Math.max(10, purity));

    gaugePercentage.innerHTML = `${purity.toFixed(2)}<span>%</span>`;

    // SVG radial fill offset
    const circumference = 565.48;
    const offset = circumference - (circumference * purity) / 100;
    gaugeFill.style.strokeDashoffset = offset;

    // Minimal style color overrides
    if (purity >= 97) {
      gradeBanner.innerText = 'S-GRADE QUANTUM';
      gradeBanner.style.color = '#e0a96d';
      gaugeFill.style.stroke = '#e0a96d';
      statusReadout.innerText = 'SYS_OK: MOLECULAR INTEGRITY SECURED.';
    } else if (purity >= 88) {
      gradeBanner.innerText = 'A-GRADE PURE';
      gradeBanner.style.color = '#ffffff';
      gaugeFill.style.stroke = '#ffffff';
      statusReadout.innerText = 'SYS_OK: STANDARD PURITY RATIO MATCH.';
    } else if (purity >= 70) {
      gradeBanner.innerText = 'B-GRADE BIOLOGICAL';
      gradeBanner.style.color = '#a0aec0';
      gaugeFill.style.stroke = '#a0aec0';
      statusReadout.innerText = 'SYS_NOTICE: INCREASE MATURATION CYCLE.';
    } else {
      gradeBanner.innerText = 'RE-FILTRATION ADV';
      gradeBanner.style.color = '#a77c50';
      gaugeFill.style.stroke = '#a77c50';
      statusReadout.innerText = 'SYS_WARNING: UNREGULATED VISCOSITY RATIO.';
    }
  };

  if (viscositySlider) {
    viscositySlider.addEventListener('input', updateAnalyzer);
    enzymeSlider.addEventListener('input', updateAnalyzer);
    pollenSlider.addEventListener('input', updateAnalyzer);
    hmfSlider.addEventListener('input', updateAnalyzer);
    updateAnalyzer();
  }

  // =========================================================================
  // 3. Blockchain Batch Authenticator
  // =========================================================================
  const authInput = document.getElementById('auth-input');
  const authBtn = document.getElementById('auth-btn');
  const consoleContent = document.getElementById('console-content');

  const mockDatabase = {
    'UBA-88X': {
      origin: 'Himalayan Sanctuary (Dome 3-A)',
      pollination: 'Alpine Goldenrod & Lavender',
      integrity: '99.982% Molecular purity',
      smartContract: '0x88eA77f6bEE40C519d00921200df1240954cfE39',
      hiveID: 'HD-8890',
      timestamp: '2088-05-18 10:24:15 UTC'
    },
    'UBA-99Y': {
      origin: 'Arctic Geo-Dome (Sector 12-F)',
      pollination: 'Cryo-Tundra Moss & Violet',
      integrity: '99.994% Molecular purity',
      smartContract: '0x99aF0288fEE40C0032cd012398402df984534ef0',
      hiveID: 'HD-9941',
      timestamp: '2088-06-02 04:12:30'
    },
    'NEO-BEE7': {
      origin: 'Pacific Sanctuary (Dome 7-C)',
      pollination: 'Coral Aster & Sea Aster Pollen',
      integrity: '99.954% Molecular purity',
      smartContract: '0x77cE1277fEE4091Acd02934823902df352932fA0',
      hiveID: 'HD-0742',
      timestamp: '2088-06-08 18:45:09'
    }
  };

  const printToConsole = (lines, delay = 250) => {
    consoleContent.innerHTML = '';
    let i = 0;
    const typeLine = () => {
      if (i < lines.length) {
        const line = document.createElement('span');
        line.className = 'console-line ' + (lines[i].type || '');
        line.innerHTML = lines[i].text;
        consoleContent.appendChild(line);
        consoleContent.scrollTop = consoleContent.scrollHeight;
        i++;
        setTimeout(typeLine, delay);
      }
    };
    typeLine();
  };

  if (authBtn && authInput) {
    authBtn.addEventListener('click', () => {
      const code = authInput.value.trim().toUpperCase();
      if (!code) {
        printToConsole([{ text: '>&nbsp;[LEDGER]: CODE REQUIRED.', type: 'line-warning' }]);
        return;
      }

      printToConsole([
        { text: `>&nbsp;QUERYING INDEX [${code}]...` },
        { text: '>&nbsp;CONNECTING HIVE LEDGER CLIENT...' },
        { text: '>&nbsp;RESOLVING BLOCK DATA...' }
      ], 150);

      setTimeout(() => {
        if (mockDatabase[code]) {
          const data = mockDatabase[code];
          printToConsole([
            { text: '>&nbsp;LEDGER MATCH FOUND.', type: 'line-success' },
            { text: `>&nbsp;&nbsp;&nbsp;TX:&nbsp;<span class="blockchain-badge">${data.smartContract.substring(0,20)}...</span>` },
            { text: `>&nbsp;&nbsp;&nbsp;DATE:&nbsp;${data.timestamp}` },
            { text: `>&nbsp;&nbsp;&nbsp;ORIGIN:&nbsp;${data.origin}` },
            { text: `>&nbsp;&nbsp;&nbsp;FLORA:&nbsp;${data.pollination}` },
            { text: `>&nbsp;&nbsp;&nbsp;INTEGRITY:&nbsp;${data.integrity}`, type: 'line-success' }
          ], 100);
        } else {
          printToConsole([
            { text: '>&nbsp;RESOLVE INDEX: FAILED.', type: 'line-danger' },
            { text: '>&nbsp;LEDGER WARNING: UNREGISTERED SIGNATURE.', type: 'line-danger' }
          ], 100);
        }
      }, 700);
    });
  }

  // =========================================================================
  // 4. Interactive Hive Status Map
  // =========================================================================
  const hiveNodes = document.querySelectorAll('.hive-node');
  const diagTitle = document.getElementById('diag-title');
  const diagOrigin = document.getElementById('diag-origin');
  const diagTemp = document.getElementById('diag-temp');
  const diagHum = document.getElementById('diag-hum');
  const diagDrones = document.getElementById('diag-drones');
  const diagYield = document.getElementById('diag-yield');
  const diagChartBar = document.getElementById('diag-chart-bar');
  const diagChartVal = document.getElementById('diag-chart-val');

  const hiveData = {
    '1': {
      title: 'HIVE DOME ALPHA',
      origin: 'NEO-HIMALAYAS (ZONE 9)',
      temp: '21.4°C (Ambient: -2°C)',
      hum: '41.8%',
      drones: '12,450 active units',
      yield: '1,840 Liters',
      barPercent: '84%',
      val: '84% Capacity'
    },
    '2': {
      title: 'HIVE DOME BETA',
      origin: 'ARCTIC BIO-DOME (SECTOR 7)',
      temp: '19.8°C (Ambient: -28°C)',
      hum: '35.2%',
      drones: '9,800 active units',
      yield: '1,220 Liters',
      barPercent: '62%',
      val: '62% Capacity'
    },
    '3': {
      title: 'HIVE DOME GAMMA',
      origin: 'PACIFIC DOME (SATELLITE 12)',
      temp: '23.9°C (Ambient: 14°C)',
      hum: '68.4%',
      drones: '15,100 active units',
      yield: '2,150 Liters',
      barPercent: '95%',
      val: '95% Capacity'
    }
  };

  if (hiveNodes.length > 0) {
    hiveNodes.forEach(node => {
      node.addEventListener('click', () => {
        const id = node.getAttribute('data-id');
        const data = hiveData[id];
        
        hiveNodes.forEach(n => n.querySelector('.node-core').style.background = '');
        node.querySelector('.node-core').style.background = '#e0a96d';

        diagTitle.innerText = data.title;
        diagOrigin.innerText = data.origin;
        diagTemp.innerText = data.temp;
        diagHum.innerText = data.hum;
        diagDrones.innerText = data.drones;
        diagYield.innerText = data.yield;
        
        diagChartBar.style.width = '0%';
        setTimeout(() => {
          diagChartBar.style.width = data.barPercent;
          diagChartVal.innerText = data.val;
        }, 100);
      });
    });
  }

  // =========================================================================
  // 5. Minimal Cart & Ordering System
  // =========================================================================
  let cart = [];
  const cartDrawer = document.getElementById('cart-drawer');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCount = document.getElementById('cart-count');
  
  const subtotalVal = document.getElementById('subtotal-val');
  const taxVal = document.getElementById('tax-val');
  const totalVal = document.getElementById('total-val');
  const checkoutBtn = document.getElementById('checkout-btn');

  const checkoutOverlay = document.getElementById('checkout-overlay');
  const receiptItems = document.getElementById('receipt-items');
  const receiptSubtotal = document.getElementById('receipt-subtotal');
  const receiptTax = document.getElementById('receipt-tax');
  const receiptTotal = document.getElementById('receipt-total');
  const receiptClose = document.getElementById('receipt-close');
  const receiptOrderHash = document.getElementById('receipt-order-hash');

  const toggleCart = () => {
    cartDrawer.classList.toggle('open');
  };

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', toggleCart);

  const updateCartTotals = () => {
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.qty;
    });
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    subtotalVal.innerText = `$${subtotal.toFixed(2)}`;
    taxVal.innerText = `$${tax.toFixed(2)}`;
    totalVal.innerText = `$${total.toFixed(2)}`;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalQty;
    cartCount.style.display = totalQty > 0 ? 'flex' : 'none';
  };

  const renderCart = () => {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty-message">ACQUISITION BAY IS EMPTY.<br>[AWAITING CARGO IDENTIFIER]</p>';
      updateCartTotals();
      return;
    }

    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img class="cart-item-img" src="${item.img}" alt="${item.name}">
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-desc">${item.spec}</span>
          <div class="cart-item-qty-row">
            <div class="qty-control">
              <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
            </div>
            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    document.querySelectorAll('.dec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => adjustQty(e.target.getAttribute('data-id'), -1));
    });
    document.querySelectorAll('.inc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => adjustQty(e.target.getAttribute('data-id'), 1));
    });

    updateCartTotals();
  };

  const adjustQty = (id, change) => {
    const item = cart.find(x => x.id === id);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) {
        cart = cart.filter(x => x.id !== id);
      }
      renderCart();
    }
  };

  const addCartBtns = document.querySelectorAll('.add-cart-btn');
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const productCard = btn.closest('.product-card');
      const id = productCard.getAttribute('data-id');
      const name = productCard.getAttribute('data-name');
      const spec = productCard.getAttribute('data-spec');
      const price = parseFloat(productCard.getAttribute('data-price'));
      const img = productCard.getAttribute('data-img');

      const existing = cart.find(x => x.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, spec, price, qty: 1, img });
      }

      renderCart();
      if (!cartDrawer.classList.contains('open')) {
        toggleCart();
      }
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      cartDrawer.classList.remove('open');

      receiptItems.innerHTML = '';
      let subtotal = 0;
      cart.forEach(item => {
        const cost = item.price * item.qty;
        subtotal += cost;
        const line = document.createElement('div');
        line.className = 'receipt-line';
        line.innerHTML = `<span>${item.name} x${item.qty}</span><span>$${cost.toFixed(2)}</span>`;
        receiptItems.appendChild(line);
      });

      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      receiptSubtotal.innerText = `$${subtotal.toFixed(2)}`;
      receiptTax.innerText = `$${tax.toFixed(2)}`;
      receiptTotal.innerText = `$${total.toFixed(2)}`;

      const randomHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      receiptOrderHash.innerText = randomHash.substring(0, 16) + '...' + randomHash.substring(randomHash.length - 8);

      checkoutOverlay.classList.add('active');
      cart = [];
      renderCart();
    });
  }

  if (receiptClose) {
    receiptClose.addEventListener('click', () => {
      checkoutOverlay.classList.remove('active');
    });
  }

});
