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
    this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 6.7);

    // 2. High-performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    this.animate();
  }

  setupStudioEnvironment() {
    // Generate an ultra-clean, high-key photographic studio environment
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');

    // Base high-key studio gradient (pure clean tones, zero muddy dark shadows)
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
    baseGrad.addColorStop(0.0, '#FFFFFF');
    baseGrad.addColorStop(0.35, '#F8F8F6');
    baseGrad.addColorStop(0.7, '#EBEBE7');
    baseGrad.addColorStop(1.0, '#DADAD4');
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

    // Left Lime Accent Reflection
    const limeAccent = ctx.createRadialGradient(160, 260, 10, 160, 260, 180);
    limeAccent.addColorStop(0, 'rgba(199, 233, 72, 0.85)');
    limeAccent.addColorStop(0.6, 'rgba(199, 233, 72, 0.2)');
    limeAccent.addColorStop(1, 'rgba(199, 233, 72, 0)');
    ctx.fillStyle = limeAccent;
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
    // Pure studio ambient light - balanced so colors stay true without bleaching
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
    this.scene.add(ambientLight);

    // Main studio key light
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.95);
    keyLight.position.set(5, 6, 5);
    this.scene.add(keyLight);

    // Soft fill light
    const fillLight = new THREE.DirectionalLight(0xF4F5F3, 0.35);
    fillLight.position.set(-6, -2, 4);
    this.scene.add(fillLight);

    // Dedicated Lime Spotlight directly illuminating the core with pure #C7E948 photons
    const limeLight = new THREE.PointLight(0xC7E948, 3.2, 10);
    limeLight.position.set(0.5, 0.5, 3.8);
    this.scene.add(limeLight);

    // Back rim light
    const backRim = new THREE.DirectionalLight(0xFFFFFF, 0.85);
    backRim.position.set(0, -4, -5);
    this.scene.add(backRim);
  }

  buildSculpture() {
    // =========================================================================
    // 1. MATERIALS: Ink Black (#0E0E0F matching title), Polished Bevel & Lime Core
    // =========================================================================
    // Exact title ink color: #0E0E0F
    this.inkRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x0E0E0F,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9
    });

    this.inkBevelMat = new THREE.MeshPhysicalMaterial({
      color: 0x141416,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0
    });

    // Exact Lime Accent: electric, saturated #C7E948 matching "How it works?" button
    this.limeMat = new THREE.MeshPhysicalMaterial({
      color: 0xC7E948,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      envMapIntensity: 0.08, // Eliminates white studio glare washing out saturation
      emissive: 0x6E8224,
      emissiveIntensity: 0.55
    });

    // =========================================================================
    // 2. OUTER PRECISION GIMBAL RING (Ink Black #0E0E0F)
    // =========================================================================
    this.outerRingGroup = new THREE.Group();

    // Main Torus Body
    const outerRingGeo = new THREE.TorusGeometry(1.85, 0.085, 32, 100);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, this.inkRingMat);
    this.outerRingGroup.add(outerRingMesh);

    // Ink Bevel Rim
    const outerRimGeo = new THREE.TorusGeometry(1.92, 0.018, 16, 100);
    const outerRimMesh = new THREE.Mesh(outerRimGeo, this.inkBevelMat);
    this.outerRingGroup.add(outerRimMesh);

    // 4-Quadrant Precision Index Dots
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const dotGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const dotMesh = new THREE.Mesh(dotGeo, i === 0 ? this.limeMat : this.inkBevelMat);
      dotMesh.position.set(Math.cos(angle) * 1.85, Math.sin(angle) * 1.85, 0.06);
      this.outerRingGroup.add(dotMesh);
    }

    this.masterGroup.add(this.outerRingGroup);

    // =========================================================================
    // 3. MID GIMBAL RING (Ink Black #0E0E0F)
    // =========================================================================
    this.midRingGroup = new THREE.Group();

    const midRingGeo = new THREE.TorusGeometry(1.55, 0.055, 24, 90);
    const midRingMesh = new THREE.Mesh(midRingGeo, this.inkRingMat);
    this.midRingGroup.add(midRingMesh);

    // Inner Orbit Ring
    const innerOrbitRingGeo = new THREE.TorusGeometry(1.48, 0.02, 16, 90);
    const innerOrbitRingMesh = new THREE.Mesh(innerOrbitRingGeo, this.inkBevelMat);
    this.midRingGroup.add(innerOrbitRingMesh);

    this.midRingGroup.rotation.x = Math.PI / 3.8;
    this.midRingGroup.rotation.y = Math.PI / 5;
    this.masterGroup.add(this.midRingGroup);

    // =========================================================================
    // 4. PRECISION OPTICAL APERTURE & GLASS RING
    // =========================================================================
    this.lensGroup = new THREE.Group();

    // Pristine Optical Glass Torus Ring (frames the core without obscuring it)
    const glassTorusGeo = new THREE.TorusGeometry(1.12, 0.07, 32, 80);
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.02,
      metalness: 0.0,
      ior: 1.5,
      thickness: 0.3,
      clearcoat: 1.0
    });
    const glassTorus = new THREE.Mesh(glassTorusGeo, this.glassMaterial);
    this.lensGroup.add(glassTorus);

    // Precision Aperture Diaphragm Collar
    const apertureBandGeo = new THREE.CylinderGeometry(1.18, 1.18, 0.06, 64, 1, true);
    const apertureBandMesh = new THREE.Mesh(apertureBandGeo, this.inkBevelMat);
    apertureBandMesh.rotation.x = Math.PI / 2;
    this.lensGroup.add(apertureBandMesh);

    // Concentric Fine Aperture Rings
    const apRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.014, 16, 64), this.limeMat);
    this.lensGroup.add(apRing1);

    const apRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.01, 16, 64), this.inkBevelMat);
    this.lensGroup.add(apRing2);



    // =========================================================================
    // 5. INNER FOCAL CORE: Punchy, Saturated Lime Jewel Nucleus (#C7E948)
    // =========================================================================
    const coreGeo = new THREE.SphereGeometry(0.52, 48, 48);
    this.coreMesh = new THREE.Mesh(coreGeo, this.limeMat);
    this.lensGroup.add(this.coreMesh);

    this.masterGroup.add(this.lensGroup);

    // =========================================================================
    // 6. MINIMAL LASER RETICLE (Clean cardinal brackets)
    // =========================================================================
    this.reticleGroup = new THREE.Group();
    const reticleMat = new THREE.MeshBasicMaterial({ color: 0xC7E948, transparent: true, opacity: 0.75 });

    // Center crosshair
    const ch = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.012), reticleMat);
    ch.position.z = 0.44;
    this.reticleGroup.add(ch);

    const cv = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 0.12), reticleMat);
    cv.position.z = 0.44;
    this.reticleGroup.add(cv);

    this.masterGroup.add(this.reticleGroup);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Cursor tracking for smooth parallax
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = normX * 0.3;
      this.mouse.targetY = normY * 0.24;
    });

    // Interactive Drag & Tilt
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.dragRotation.y += deltaX * 0.006;
      this.dragRotation.x += deltaY * 0.006;
      this.dragRotation.x = Math.max(-0.65, Math.min(0.65, this.dragRotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

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
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // 1. Smooth lerp for mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Stately original continuous horizontal rotation of the outer model
    if (!this.isDragging) {
      this.dragRotation.y += 0.0028;
    }

    this.masterGroup.rotation.x = this.dragRotation.x + this.mouse.y * 0.35;
    this.masterGroup.rotation.y = this.dragRotation.y + this.mouse.x * 0.45;

    // Subtle gentle floating on the Y axis (very subtle amplitude so it stays clear of the title)
    this.masterGroup.position.y = Math.sin(time * 1.2) * 0.02;

    // 3. Counter-rotation of the inner ring revolving in the opposite direction
    this.midRingGroup.rotation.y -= 0.0058;
    this.midRingGroup.rotation.z -= 0.0035;

    // 4. Subtle optical core respiration (breathing focus effect)
    const scalePulse = 1.0 + Math.sin(time * 2.0) * 0.04;
    this.coreMesh.scale.set(scalePulse, scalePulse, scalePulse);

    // 5. Reticle crosshair pulse
    if (this.reticleGroup) {
      const reticlePulse = 0.7 + Math.sin(time * 3.0) * 0.25;
      this.reticleGroup.children[0].material.opacity = reticlePulse;
      this.reticleGroup.children[1].material.opacity = reticlePulse;
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
    if (navGetStartedBtn) navGetStartedBtn.addEventListener('click', openModal);
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
          setTimeout(() => {
            previewImg.src = e.target.result;
            previewImg.style.opacity = '1';
          }, 150);
        }

        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        if (statusText) {
          statusText.textContent = `${file.name} (${sizeMb} MB) • Uploaded successfully`;
          statusText.style.color = '#0E0E0F';
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
