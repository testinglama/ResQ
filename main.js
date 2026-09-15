import * as THREE from 'three';

/* ==========================================================================
   PHOTOGRAPH SLOT. — PRISTINE OPTICAL LENS WEBG OBJECT
   High-key studio reflections, solid optical crystal lens, satin titanium
   gimbal rings, and vibrant lime focal core.
   Ultra-clean, modern luxury aesthetic with zero noise or visual clutter.
   ========================================================================== */

class OpticalSculpture {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.width = this.container.clientWidth || 530;
    this.height = this.container.clientHeight || 530;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.dragRotation = { x: 0.18, y: -0.25 };

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    const isMobile = window.innerWidth < 640;
    this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, isMobile ? 7.8 : 6.7);

    // 2. High-performance WebGL Renderer with capped DPR for maximum FPS
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // 3. High-Key Studio Reflection Environment
    this.setupStudioEnvironment();

    // 4. Studio Lighting
    this.setupLighting();

    // 5. Build Pristine Optical Sculpture
    this.masterGroup = new THREE.Group();
    this.masterGroup.rotation.x = this.dragRotation.x;
    this.masterGroup.rotation.y = this.dragRotation.y;
    this.scene.add(this.masterGroup);

    this.buildSculpture();

    // 6. Events & Animation
    this.bindEvents();
    this.clock = new THREE.Clock();

    // 7. IntersectionObserver for 0% offscreen CPU/GPU load
    this.isVisible = true;
    this.isLooping = true;
    this.setupIntersectionObserver();

    this.animate();
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window && this.container) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.isLooping) {
            this.isLooping = true;
            this.animate();
          }
        });
      }, { rootMargin: '120px' });
      this.observer.observe(this.container);
    }
  }

  setupStudioEnvironment() {
    // Generate an ultra-clean, high-key photographic studio environment
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');

    // Base high-key studio gradient with subtle warm white tones
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
    baseGrad.addColorStop(0.0, '#FFFFFF');
    baseGrad.addColorStop(0.35, '#FFF8F4');
    baseGrad.addColorStop(0.7, '#FDF1E8');
    baseGrad.addColorStop(1.0, '#F6E3D5');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Overhead large diffuse softbox
    const softboxTop = ctx.createRadialGradient(512, 60, 10, 512, 60, 260);
    softboxTop.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    softboxTop.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)');
    softboxTop.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = softboxTop;
    ctx.fillRect(160, 0, 704, 280);

    // Right Key Studio Light
    const softboxRight = ctx.createRadialGradient(840, 220, 20, 840, 220, 220);
    softboxRight.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    softboxRight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = softboxRight;
    ctx.fillRect(620, 20, 404, 400);

    // Left Fiery Orange & Vermilion Accent Reflection
    const orangeAccent = ctx.createRadialGradient(160, 260, 10, 160, 260, 180);
    orangeAccent.addColorStop(0, 'rgba(255, 85, 0, 0.9)');
    orangeAccent.addColorStop(0.6, 'rgba(229, 37, 33, 0.3)');
    orangeAccent.addColorStop(1, 'rgba(255, 85, 0, 0)');
    ctx.fillStyle = orangeAccent;
    ctx.fillRect(0, 80, 360, 400);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    pmremGenerator.dispose();
    envTexture.dispose();

    this.scene.environment = envMap;
  }

  setupLighting() {
    // Pure studio ambient light with warm tone
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.65);
    this.scene.add(ambientLight);

    // Main studio key light
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.95);
    keyLight.position.set(5, 6, 5);
    this.scene.add(keyLight);

    // Soft warm fill light
    const fillLight = new THREE.DirectionalLight(0xFFF3EB, 0.35);
    fillLight.position.set(-6, -2, 4);
    this.scene.add(fillLight);

    // Dedicated Fiery Orange Spotlight directly illuminating the core with pure #FF5500 photons
    this.orangeLight = new THREE.PointLight(0xFF5500, 3.6, 10);
    this.orangeLight.position.set(0.5, 0.5, 3.8);
    this.scene.add(this.orangeLight);

    // Back warm rim light
    const backRim = new THREE.DirectionalLight(0xFFEADB, 0.85);
    backRim.position.set(0, -4, -5);
    this.scene.add(backRim);
  }

  buildSculpture() {
    // =========================================================================
    // 1. MATERIALS: Obsidian Red, Polished Mahogany & Fiery Orange Core
    // =========================================================================
    // Deep obsidian red-orange metallic gimbal ring
    this.obsidianRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x220603,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9
    });

    // Deep polished mahogany bevel rim
    this.mahoganyBevelMat = new THREE.MeshPhysicalMaterial({
      color: 0x3A0A04,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0
    });

    // Saturated fiery electric orange (#FF5500)
    this.orangeMat = new THREE.MeshPhysicalMaterial({
      color: 0xFF5500,
      roughness: 0.22,
      metalness: 0.03,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.1,
      emissive: 0xFF2200,
      emissiveIntensity: 0.55
    });

    // Ruby Vermilion Red Accent
    this.redAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0xE52521,
      roughness: 0.24,
      metalness: 0.1,
      clearcoat: 0.7,
      emissive: 0x880000,
      emissiveIntensity: 0.45
    });

    // =========================================================================
    // 2. OUTER PRECISION GIMBAL RING (Obsidian Red #220603 with Radar Ticks)
    // =========================================================================
    this.outerRingGroup = new THREE.Group();

    // Main Torus Body
    const outerRingGeo = new THREE.TorusGeometry(1.85, 0.085, 20, 72);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, this.obsidianRingMat);
    this.outerRingGroup.add(outerRingMesh);

    // Mahogany Bevel Rim
    const outerRimGeo = new THREE.TorusGeometry(1.92, 0.018, 12, 72);
    const outerRimMesh = new THREE.Mesh(outerRimGeo, this.mahoganyBevelMat);
    this.outerRingGroup.add(outerRimMesh);

    // 8-Directional Tactical Emergency Radar Markers (Orange & Vermilion)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const isCardinal = i % 2 === 0;
      const dotGeo = new THREE.SphereGeometry(isCardinal ? 0.048 : 0.026, 12, 12);
      const dotMesh = new THREE.Mesh(dotGeo, isCardinal ? (i === 0 ? this.orangeMat : this.redAccentMat) : this.mahoganyBevelMat);
      dotMesh.position.set(Math.cos(angle) * 1.85, Math.sin(angle) * 1.85, 0.06);
      this.outerRingGroup.add(dotMesh);
    }

    this.masterGroup.add(this.outerRingGroup);

    // =========================================================================
    // 3. MID GIMBAL RING (Doppler Radar Sweep Ring)
    // =========================================================================
    this.midRingGroup = new THREE.Group();

    const midRingGeo = new THREE.TorusGeometry(1.55, 0.055, 18, 64);
    const midRingMesh = new THREE.Mesh(midRingGeo, this.obsidianRingMat);
    this.midRingGroup.add(midRingMesh);

    // Inner Orbit Ring
    const innerOrbitRingGeo = new THREE.TorusGeometry(1.48, 0.02, 12, 64);
    const innerOrbitRingMesh = new THREE.Mesh(innerOrbitRingGeo, this.mahoganyBevelMat);
    this.midRingGroup.add(innerOrbitRingMesh);

    this.midRingGroup.rotation.x = Math.PI / 3.8;
    this.midRingGroup.rotation.y = Math.PI / 5;
    this.masterGroup.add(this.midRingGroup);

    // =========================================================================
    // 4. PRECISION OPTICAL APERTURE & GLASS SHIELD
    // =========================================================================
    this.lensGroup = new THREE.Group();

    // Pristine Optical Glass Torus Ring (lightweight clearcoat glass without heavy transmission pass)
    const glassTorusGeo = new THREE.TorusGeometry(1.12, 0.07, 20, 60);
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95
    });
    const glassTorus = new THREE.Mesh(glassTorusGeo, this.glassMaterial);
    this.lensGroup.add(glassTorus);

    // Precision Aperture Diaphragm Collar
    const apertureBandGeo = new THREE.CylinderGeometry(1.18, 1.18, 0.06, 48, 1, true);
    const apertureBandMesh = new THREE.Mesh(apertureBandGeo, this.mahoganyBevelMat);
    apertureBandMesh.rotation.x = Math.PI / 2;
    this.lensGroup.add(apertureBandMesh);

    // Concentric Fine Aperture Rings (Fiery Orange & Ruby Red)
    const apRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.014, 12, 48), this.orangeMat);
    this.lensGroup.add(apRing1);

    const apRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.01, 12, 48), this.redAccentMat);
    this.lensGroup.add(apRing2);

    // =========================================================================
    // 5. INNER EMERGENCY BEACON CORE: Incandescent Magma Orb (#FF5500)
    // =========================================================================
    const coreGeo = new THREE.SphereGeometry(0.52, 32, 32);
    this.coreMesh = new THREE.Mesh(coreGeo, this.orangeMat);
    this.lensGroup.add(this.coreMesh);

    this.masterGroup.add(this.lensGroup);

    // =========================================================================
    // 6. TACTICAL GPS / RADAR TARGETING RETICLE
    // =========================================================================
    this.reticleGroup = new THREE.Group();
    const reticleMat = new THREE.MeshBasicMaterial({ color: 0xFF5500, transparent: true, opacity: 0.85 });

    // Center crosshairs
    const ch = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.014), reticleMat);
    ch.position.z = 0.44;
    this.reticleGroup.add(ch);

    const cv = new THREE.Mesh(new THREE.PlaneGeometry(0.014, 0.18), reticleMat);
    cv.position.z = 0.44;
    this.reticleGroup.add(cv);

    // Concentric GPS targeting ring
    const targetRingGeo = new THREE.RingGeometry(0.24, 0.255, 32);
    const targetRingMesh = new THREE.Mesh(targetRingGeo, reticleMat);
    targetRingMesh.position.z = 0.44;
    this.reticleGroup.add(targetRingMesh);

    this.masterGroup.add(this.reticleGroup);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // Cursor tracking for smooth parallax
    window.addEventListener('mousemove', (e) => {
      if (!this.isVisible) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = normX * 0.3;
      this.mouse.targetY = normY * 0.24;
    }, { passive: true });

    // Interactive Drag & Tilt
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.dragRotation.y += deltaX * 0.006;
      this.dragRotation.x += deltaY * 0.006;
      this.dragRotation.x = Math.max(-0.65, Math.min(0.65, this.dragRotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }, { passive: true });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.dragRotation.y += deltaX * 0.007;
      this.dragRotation.x += deltaY * 0.007;
      this.dragRotation.x = Math.max(-0.65, Math.min(0.65, this.dragRotation.x));
      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
  }

  onResize() {
    this.width = this.container.clientWidth || 530;
    this.height = this.container.clientHeight || 530;
    if (this.width === 0 || this.height === 0) return;

    this.camera.aspect = this.width / this.height;
    this.camera.position.z = window.innerWidth < 640 ? 7.8 : 6.7;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  }

  animate() {
    // Zero CPU/GPU cost when scrolled away from Hero
    if (!this.isVisible) {
      this.isLooping = false;
      return;
    }
    this.isLooping = true;
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // 1. Smooth lerp for mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Continuous horizontal rotation of the outer model
    if (!this.isDragging) {
      this.dragRotation.y += 0.0028;
    }

    this.masterGroup.rotation.x = this.dragRotation.x + this.mouse.y * 0.35;
    this.masterGroup.rotation.y = this.dragRotation.y + this.mouse.x * 0.45;

    // Subtle gentle floating on the Y axis
    this.masterGroup.position.y = Math.sin(time * 1.2) * 0.02;

    // 3. Counter-rotation Doppler radar sweep of the inner ring
    this.midRingGroup.rotation.y -= 0.0092;
    this.midRingGroup.rotation.z -= 0.0048;

    // 4. Crisis Emergency Beacon Cadence (urgent flashing pulse & illumination)
    const beaconPulse = 1.0 + Math.sin(time * 3.6) * 0.08;
    this.coreMesh.scale.set(beaconPulse, beaconPulse, beaconPulse);
    if (this.orangeMat) {
      this.orangeMat.emissiveIntensity = 0.55 + Math.sin(time * 3.6) * 0.35;
    }
    if (this.orangeLight) {
      this.orangeLight.intensity = 3.6 + Math.sin(time * 3.6) * 1.5;
    }

    // 5. Tactical GPS Reticle pulse
    if (this.reticleGroup) {
      const reticlePulse = 0.65 + Math.sin(time * 4.2) * 0.3;
      this.reticleGroup.children.forEach(child => {
        if (child.material) child.material.opacity = reticlePulse;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   UI CONTROLLER & INTERACTIVE BOOKING MATRIX
   ========================================================================== */

class AppUI {
  constructor() {
    this.state = {
      studioKey: 'loft',
      studioName: 'North-Facing Sunlit Loft',
      studioHourlyRate: 140,
      hours: 3,
      gearTotal: 100,
      gearNames: ['Profoto Pro-11 Pack (2 Heads)', '10Gbps Tether Cloud Pipeline'],
      cleaningFee: 35
    };

    this.init();
  }

  init() {
    this.initStudioTabs();
    this.initTimeSlots();
    this.initGearAddons();
    this.initLockBooking();
    this.initHowItWorksModal();
    this.initPhotographUpload();
    this.initDonorForm();
    this.initIncidentReporting();
    this.initResourceLocator();
    this.initMobileNav();
    this.initCountdownTimer();
    this.initSmoothScroll();
    this.updateSummary();
  }

  initStudioTabs() {
    const studioCards = document.querySelectorAll('.studio-card');
    studioCards.forEach(card => {
      card.addEventListener('click', () => {
        studioCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        this.state.studioKey = card.getAttribute('data-studio');
        this.state.studioHourlyRate = parseInt(card.getAttribute('data-rate'), 10);
        this.state.studioName = card.querySelector('.studio-name').textContent;

        this.updateSummary();
      });
    });
  }

  initTimeSlots() {
    const slotChips = document.querySelectorAll('.slot-chip');
    slotChips.forEach(chip => {
      chip.addEventListener('click', () => {
        slotChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        this.state.hours = parseInt(chip.getAttribute('data-hours'), 10);
        this.updateSummary();
      });
    });
  }

  initGearAddons() {
    const checkboxes = document.querySelectorAll('.gear-checkbox input');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', () => {
        let total = 0;
        const selected = [];
        checkboxes.forEach(c => {
          if (c.checked) {
            total += parseInt(c.getAttribute('data-cost'), 10);
            const label = c.closest('.gear-checkbox').querySelector('.gear-text').childNodes[0].textContent.trim();
            selected.push(label);
          }
        });
        this.state.gearTotal = total;
        this.state.gearNames = selected;
        this.updateSummary();
      });
    });
  }

  updateSummary() {
    const studioCost = this.state.studioHourlyRate * this.state.hours;
    const total = studioCost + this.state.gearTotal + this.state.cleaningFee;

    const elStudioName = document.getElementById('summary-studio-name');
    const elStudioPrice = document.getElementById('summary-studio-price');
    const elGearName = document.getElementById('summary-gear-name');
    const elGearPrice = document.getElementById('summary-gear-price');
    const elTotal = document.getElementById('summary-total');

    if (elStudioName) elStudioName.textContent = `${this.state.studioName} (${this.state.hours}h)`;
    if (elStudioPrice) elStudioPrice.textContent = `$${studioCost}`;
    if (elGearName) elGearName.textContent = this.state.gearNames.length > 0 ? this.state.gearNames.join(' + ') : 'No Hardware Selected';
    if (elGearPrice) elGearPrice.textContent = `$${this.state.gearTotal}`;
    if (elTotal) elTotal.textContent = `$${total}`;
  }

  initLockBooking() {
    const lockBtn = document.getElementById('btn-lock-slot');
    const toast = document.getElementById('booking-toast');
    const toastDesc = document.getElementById('toast-desc');

    if (lockBtn && toast) {
      lockBtn.addEventListener('click', () => {
        const ticketId = '#PS-' + Math.floor(1000 + Math.random() * 9000);
        const idElem = document.getElementById('ticket-id');
        if (idElem) idElem.textContent = ticketId;

        if (toastDesc) {
          toastDesc.textContent = `${this.state.studioName} locked for ${this.state.hours} hours. Pass code: ${ticketId}.`;
        }

        toast.classList.add('active');
        setTimeout(() => {
          toast.classList.remove('active');
        }, 4500);
      });
    }
  }

  initHowItWorksModal() {
    const modal = document.getElementById('how-modal');
    const openBtn = document.getElementById('cta-how-it-works');
    const navGetStartedBtn = document.getElementById('nav-get-started');
    const closeBtn = document.getElementById('modal-close');
    const exploreBtn = document.getElementById('modal-explore-btn');

    if (!modal) return;

    const openModal = () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  initCountdownTimer() {
    const timerEl = document.getElementById('countdown');
    if (!timerEl) return;

    let secondsLeft = 15 * 60; // 15 mins hold

    setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
        const secs = (secondsLeft % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }

  initPhotographUpload() {
    const fileInput = document.getElementById('photo-file-input');
    const triggerBtn = document.getElementById('btn-trigger-upload');
    const dropzone = document.getElementById('upload-dropzone');
    const previewImg = document.getElementById('upload-preview-img');
    const statusText = document.getElementById('upload-file-status');

    if (!fileInput || !dropzone) return;

    const handleFile = (file) => {
      if (!file || !file.type.startsWith('image/')) {
        if (statusText) statusText.textContent = 'Please select a valid image file.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (previewImg) {
          previewImg.style.opacity = '0';
          const previewWrap = document.getElementById('dash-preview-wrap');
          if (previewWrap) previewWrap.style.display = 'block';
          setTimeout(() => {
            previewImg.src = e.target.result;
            previewImg.style.opacity = '1';
          }, 150);
        }

        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        if (statusText) {
          statusText.textContent = `${file.name} (${sizeMb} MB) • Uploaded successfully`;
          statusText.style.color = '#1C0502';
          statusText.style.fontWeight = '700';
        }
      };
      reader.readAsDataURL(file);
    };

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => fileInput.click());
    }

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files[0]) {
        handleFile(dt.files[0]);
      }
    });
  }

  initDonorForm() {
    const form = document.getElementById('donor-register-form');
    const toast = document.getElementById('booking-toast');
    const toastTitle = toast?.querySelector('.toast-title');
    const toastDesc = document.getElementById('toast-desc');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('donor-name')?.value || 'Volunteer';
      const group = document.getElementById('donor-group')?.value || 'Donor';

      if (toast) {
        if (toastTitle) toastTitle.textContent = 'Donor Registered Successfully!';
        if (toastDesc) toastDesc.textContent = `Thank you, ${name} (${group})! You are registered in the UMU RESQ Emergency Blood Network.`;
        toast.classList.add('active');
        setTimeout(() => {
          toast.classList.remove('active');
        }, 5000);
      }

      form.reset();
    });
  }

  initIncidentReporting() {
    const form = document.getElementById('incident-report-form');
    const categorySelect = document.getElementById('inc-category');
    const chips = document.querySelectorAll('.category-chip');
    const fileInput = document.getElementById('incident-file-input');
    const dropzone = document.getElementById('incident-file-dropzone');
    const fileLabel = document.getElementById('incident-file-label');
    const queueList = document.getElementById('triage-tickets-list');
    const toast = document.getElementById('booking-toast');
    const toastTitle = toast?.querySelector('.toast-title');
    const toastDesc = document.getElementById('toast-desc');

    // 1. Quick Category Chips
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.getAttribute('data-cat');
        if (categorySelect && cat) {
          for (let opt of categorySelect.options) {
            if (opt.value === cat || opt.text.includes(cat)) {
              categorySelect.value = opt.value;
              break;
            }
          }
        }
      });
    });

    // 2. Dropzone file attachment
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const f = e.target.files[0];
          const sizeKb = Math.round(f.size / 1024);
          if (fileLabel) {
            fileLabel.innerHTML = `<strong>${f.name}</strong> (${sizeKb} KB) • Attached`;
            fileLabel.style.color = '#1C0502';
          }
        }
      });

      ['dragover', 'dragenter'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.style.borderColor = '#FF5500';
          dropzone.style.background = '#FFF3EB';
        });
      });

      ['dragleave', 'drop'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.style.borderColor = '';
          dropzone.style.background = '';
        });
      });

      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          const f = e.dataTransfer.files[0];
          const sizeKb = Math.round(f.size / 1024);
          if (fileLabel) {
            fileLabel.innerHTML = `<strong>${f.name}</strong> (${sizeKb} KB) • Attached`;
            fileLabel.style.color = '#1C0502';
          }
        }
      });
    }

    // 3. Form Submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cat = categorySelect?.value || 'Incident';
        const severity = document.getElementById('inc-severity')?.value || 'HIGH';
        const location = document.getElementById('inc-location')?.value || 'UMU Campus';
        const landmark = document.getElementById('inc-landmark')?.value || '';
        const ticketNum = Math.floor(4100 + Math.random() * 899);
        const ticketId = `#INC-${ticketNum}`;

        // Prepend to Live Triage Queue
        if (queueList) {
          const ticketCard = document.createElement('div');
          const isCritical = severity === 'CRITICAL';
          ticketCard.className = `triage-ticket-item ${isCritical ? 'ticket-critical' : 'ticket-warning'}`;
          ticketCard.style.animation = 'fadeSlideUp 0.4s ease both';
          ticketCard.innerHTML = `
            <div class="ticket-top">
              <span class="ticket-id">${ticketId}</span>
              <span class="ticket-badge ${isCritical ? 'badge-critical' : 'badge-warning'}">DISPATCHED</span>
            </div>
            <h4 class="ticket-heading">${cat}</h4>
            <p class="ticket-loc">${location}${landmark ? ' • ' + landmark : ''}</p>
            <div class="ticket-meta">
              <span>Status: Response Team En Route</span>
              <span class="ticket-time">Just now</span>
            </div>
          `;
          queueList.prepend(ticketCard);
        }

        // Show Toast
        if (toast) {
          if (toastTitle) toastTitle.textContent = 'Incident Report Dispatched!';
          if (toastDesc) toastDesc.textContent = `Ticket ${ticketId} registered. Campus security & triage unit notified.`;
          toast.classList.add('active');
          setTimeout(() => {
            toast.classList.remove('active');
          }, 5000);
        }

        form.reset();
        if (fileLabel) {
          fileLabel.innerHTML = `Drag &amp; drop photos or <strong class="browse-link">browse files</strong>`;
          fileLabel.style.color = '';
        }
      });
    }
  }

  initResourceLocator() {
    const searchInput = document.getElementById('resource-search-input');
    const zoneSelect = document.getElementById('resource-zone-select');
    const categoryChips = document.querySelectorAll('.resource-chip');
    const cards = document.querySelectorAll('.resource-card');
    const emptyState = document.getElementById('resources-empty');
    const resetBtn = document.getElementById('btn-reset-filters');

    let currentCategory = 'all';
    let currentZone = 'all';
    let currentSearch = '';

    const filterResources = () => {
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const zone = card.getAttribute('data-zone') || '';
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
        const title = (card.querySelector('.resource-name')?.textContent || '').toLowerCase();
        const loc = (card.querySelector('.resource-location')?.textContent || '').toLowerCase();
        const equip = (card.querySelector('.equip-desc')?.textContent || '').toLowerCase();

        const matchCat = currentCategory === 'all' || cat === currentCategory;
        const matchZone = currentZone === 'all' || zone === currentZone;
        const matchSearch = !currentSearch || 
          keywords.includes(currentSearch) || 
          title.includes(currentSearch) || 
          loc.includes(currentSearch) || 
          equip.includes(currentSearch);

        if (matchCat && matchZone && matchSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    };

    // Category chips
    categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.getAttribute('data-category') || 'all';
        filterResources();
      });
    });

    // Zone select
    if (zoneSelect) {
      zoneSelect.addEventListener('change', (e) => {
        currentZone = e.target.value;
        filterResources();
      });
    }

    // Search input with instant filtering
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim().toLowerCase();
        filterResources();
      });
    }

    // Reset filters
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentZone = 'all';
        currentSearch = '';
        if (searchInput) searchInput.value = '';
        if (zoneSelect) zoneSelect.value = 'all';
        categoryChips.forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-category') === 'all');
        });
        filterResources();
      });
    }

    // Route Guidance Modal
    const routeModal = document.getElementById('route-modal');
    const routeCloseBtn = document.getElementById('route-modal-close');
    const routeDismissBtn = document.getElementById('route-modal-dismiss');
    const routeTitle = document.getElementById('route-modal-title');
    const routeLoc = document.getElementById('route-modal-loc');
    const routeDist = document.getElementById('route-metric-dist');
    const routeTime = document.getElementById('route-metric-time');
    const routeInstruct = document.getElementById('route-modal-instruct');

    const openRouteModal = (btn) => {
      if (!routeModal) return;
      const title = btn.getAttribute('data-title') || 'Resource Location';
      const loc = btn.getAttribute('data-loc') || 'Campus Zone';
      const dist = btn.getAttribute('data-dist') || '100m';
      const time = btn.getAttribute('data-time') || '2 mins';
      const instructions = btn.getAttribute('data-instructions') || 'Follow primary campus walkways.';

      if (routeTitle) routeTitle.textContent = title;
      if (routeLoc) routeLoc.textContent = loc;
      if (routeDist) routeDist.textContent = dist;
      if (routeTime) routeTime.textContent = time;
      if (routeInstruct) routeInstruct.textContent = instructions;

      routeModal.classList.add('open');
      routeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeRouteModal = () => {
      if (!routeModal) return;
      routeModal.classList.remove('open');
      routeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.btn-route-action').forEach(btn => {
      btn.addEventListener('click', () => openRouteModal(btn));
    });

    if (routeCloseBtn) routeCloseBtn.addEventListener('click', closeRouteModal);
    if (routeDismissBtn) routeDismissBtn.addEventListener('click', closeRouteModal);

    if (routeModal) {
      routeModal.addEventListener('click', (e) => {
        if (e.target === routeModal) closeRouteModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && routeModal && routeModal.classList.contains('open')) {
        closeRouteModal();
      }
    });
  }

  initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !drawer) return;

    const toggleDrawer = () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };

    const openDrawer = () => {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      menuBtn.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
        closeDrawer();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new OpticalSculpture('canvas-3d');
  new AppUI();
});
