/* ===================== CYBERNETIC INTRO (combined fusion → particle burst → permanent centered logo) ===================== */
window.addEventListener('load', () => {
  // إيقاف السكرول الناعم مؤقتاً أثناء المقدمة
  if (typeof lenis !== 'undefined') lenis.stop();

  const intro = document.getElementById('cyber-intro');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // إخفاء العناصر العائمة للهيرو حتى يُكشف عند نهاية المقدمة
  gsap.set('.floater', { scale: 0, opacity: 0, rotateX: gsap.utils.random(-40, 40), rotateY: gsap.utils.random(-40, 40) });

  const finish = () => {
    if (typeof lenis !== 'undefined') lenis.start();
    if (intro) intro.remove();
  };

  const introTl = gsap.timeline({ onComplete: finish });

  // إظهار العناصر العائمة للهيرو بعد تلاشي المقدمة
  const heroReveal = (tl, at) => {
    tl.to('.floater', { scale: 1, opacity: 1, duration: 1.3, stagger: 0.08, ease: 'elastic.out(1, 0.75)' }, at + 0.3);
  };

  // إمالة ثلاثية الأبعاد للشعار تتبع المؤشر
  let tiltReady = false;
  const setupTilt = () => {
    const tilt = document.getElementById('logo-tilt');
    if (!tilt || tiltReady) return;
    tiltReady = true;
    const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    window.addEventListener('pointermove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      ry(nx * 12);
      rx(-ny * 12);
    }, { passive: true });
  };

  // تسليم الشعار الدائم إلى مركز الهيرو بعد المشهد الثالث
  const emitParticles = () => {
    const fx = document.getElementById('logo-fx');
    if (!fx) return;
    const N = 26;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('span');
      p.className = 'fx-particle';
      const angle = (i / N) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 34 + Math.random() * 96;
      p.style.setProperty('--c', i % 2 ? '#00f3ff' : '#ff0055');
      fx.appendChild(p);
      gsap.fromTo(p,
        { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, opacity: 0.85 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: 0, opacity: 0,
          duration: 1.4 + Math.random() * 1.5,
          repeat: -1, delay: i * 0.13,
          ease: 'power2.out',
        });
    }
  };

  const finalizeLogo = () => {
    const stage = document.getElementById('logo-stage');
    if (!stage) return;
    gsap.set('.logo-slot-fill', { clipPath: 'circle(50% at 50% 50%)' });
    gsap.set('.logo-slot-ring .ring-solid', { strokeDashoffset: 0 });
    gsap.set(stage, {
      position: 'absolute', left: '50%', top: '50%',
      xPercent: -50, yPercent: -50,
      width: 'min(38vmin, 320px)', height: 'min(38vmin, 320px)',
      zIndex: 3, scale: 1, opacity: 1, pointerEvents: 'none',
    });
    if (!reduceMotion) {
      gsap.to('#logo-spin', { rotationY: 360, duration: 16, repeat: -1, ease: 'none' });
      gsap.to('#logo-spin', { rotationX: 14, yoyo: true, repeat: -1, duration: 3.4, ease: 'sine.inOut' });
      gsap.to(stage, { y: -16, yoyo: true, repeat: -1, duration: 3.2, ease: 'sine.inOut' });
      gsap.fromTo('#brand-logo',
        { filter: 'brightness(0.92) ' },
        { filter: 'brightness(1.28) ',
          duration: 2.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      emitParticles();
    }
  };

  const reparentLogo = () => {
    const stage = document.getElementById('logo-stage');
    const slot = document.getElementById('hero-logo-slot');
    if (!stage || !slot) return;
    slot.appendChild(stage);
    gsap.set(stage, { position: 'absolute', left: '50%', top: '50%', xPercent: -50, yPercent: -50, zIndex: 3, scale: 1, opacity: 1 });
  };

  // انحلال العين إلى انفجار جسيمات متوهجة عند اكتمال المسح
  const burstOut = () => {
    const host = document.getElementById('burst-layer');
    if (host) {
      const N = 40;
      const pf = document.createDocumentFragment();
      for (let i = 0; i < N; i++) {
        const p = document.createElement('span');
        p.className = 't-particle';
        const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const dist = window.innerHeight * (0.45 + Math.random() * 0.55);
        p.style.setProperty('--c', i % 2 ? '#ff0055' : '#00f3ff');
        pf.appendChild(p);
        gsap.fromTo(p,
          { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1.4, autoAlpha: 1 },
          { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0.15, autoAlpha: 0,
            duration: 1.1 + Math.random() * 0.6, delay: i * 0.014, ease: 'power3.out' });
      }
      host.appendChild(pf);
    }
    // انحلال العين نحو الخارج
    gsap.to('.cyber-eye-wrap', { scale: 2.0, autoAlpha: 0, duration: 0.6, ease: 'power2.in' });
    gsap.to('.cyber-glow, .eye-hud', { autoAlpha: 0, duration: 0.4 });
    // وميض مركزي ساطع
    const flash = document.getElementById('burst-flash');
    if (flash) gsap.fromTo(flash, { scale: 0.4, autoAlpha: 1 }, { scale: 2.6, autoAlpha: 0, duration: 0.7, ease: 'power2.out' });
  };

  if (intro && !reduceMotion) {
    const scene = document.getElementById('scene-fusion');
    const pctEl = document.getElementById('scan-progress-pct');
    const fillEl = document.getElementById('scan-progress-fill');
    const pctState = { v: 0 };
    const tickVerify = document.getElementById('tick-verify');
    const reticle = document.querySelector('.reticle');
    const eyeWrap = document.getElementById('cyber-eye-wrap');
    const beam = document.querySelector('.scan-beam');
    const gaugeProg = document.getElementById('scan-gauge-prog');

    gsap.set(scene, { autoAlpha: 1 });
    gsap.set('#fusion-bg', { autoAlpha: 0 });
    gsap.set('.fusion-glow', { autoAlpha: 0 });
    gsap.set(reticle, { scale: 1.6, autoAlpha: 0 });
    gsap.set(eyeWrap, { scale: 1.25, autoAlpha: 0 });
    gsap.set('#logo-stage', { scale: 0.3, autoAlpha: 0 });
    gsap.set('.cyber-glow, #eye-hud', { autoAlpha: 0 });

    const confirmAccess = () => {
      if (tickVerify) { tickVerify.classList.add('is-ok', 'verified'); tickVerify.textContent = 'IDENTITY OK'; }
      const lbl = document.querySelector('.hud-progress-label span:first-child');
      if (lbl) lbl.textContent = 'ACCESS GRANTED';
      const lblWrap = document.querySelector('.hud-progress-label');
      if (lblWrap) lblWrap.classList.add('access');
    };

    introTl
      // ---- COMBINED SCENE · wallpaper backdrop + HUD ----
      .to('#fusion-bg', { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0.1)
      .to('.fusion-glow', { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0.25)
      .to('.hud-grid', { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, 0.15)
      .to('.hud-corner', { autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0.3)
      // ---- centerpiece · dominant cyber eye ----
      .to(eyeWrap, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 0.35)
      .to('.cyber-glow', { autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 0.55)
      // ---- HUD overlay · labels, readouts, rings, graph, beam ----
      .to('.hud-label', { autoAlpha: 1, duration: 0.4, stagger: 0.2, ease: 'power2.out' }, 0.7)
      .to('.hud-readout', { autoAlpha: 1, duration: 0.4, stagger: 0.15, ease: 'power2.out' }, 0.75)
      .to('#eye-hud', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0.85)
      .to('.hud-graph', { autoAlpha: 1, duration: 0.4 }, 0.9)
      .to('.hud-graph .g-line', { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, 0.95)
      .to(beam, { autoAlpha: 1, duration: 0.25 }, 0.9)
      .to(beam, { top: '86%', duration: 1.0, ease: 'power1.inOut' }, 1.0)
      .to(beam, { top: '10%', duration: 0.45, ease: 'power1.inOut' }, 2.0)
      .to(beam, { top: '86%', duration: 0.6, ease: 'power1.inOut' }, 2.45)
      // ---- holographic scan counter 0 → 100 ----
      .to(pctState, {
        v: 100, duration: 1.7, ease: 'power1.inOut', snap: { v: 1 },
        onUpdate: () => {
          const v = Math.round(pctState.v);
          if (pctEl) pctEl.textContent = String(v).padStart(3, '0');
          if (fillEl) fillEl.style.width = v + '%';
          if (gaugeProg) gaugeProg.style.strokeDashoffset = (301.6 * (1 - pctState.v / 100)).toFixed(1);
        },
      }, 1.2)
      .to('.hud-progress', { autoAlpha: 1, duration: 0.4 }, 1.2)
      .to('.hud-tick-row .tick', { autoAlpha: 1, duration: 0.3, stagger: 0.18, ease: 'power2.out' }, 1.5)
      .to(reticle, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1.7)
      .to('.fusion-center', { x: 5, y: -3, duration: 0.07, repeat: 4, yoyo: true, ease: 'none' }, 2.5)
      .add(confirmAccess, 2.6)
      .to(reticle, { scale: 0.9, duration: 0.25, ease: 'power2.in' }, 2.65)
      // ---- HUD out + morph: eye dissolves into a glowing particle burst ----
      .to('.hud-grid, .hud-corner, .hud-readout, .hud-label, .hud-graph, .hud-tick-row, .hud-progress, #eye-hud, .cyber-glow, .reticle, .scan-beam', { autoAlpha: 0, duration: 0.3 }, 2.75)
      .call(burstOut, null, 2.8)
      // ---- permanent centered logo revealed from within the burst ----
      .to('#logo-stage', { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 2.9)
      .to('.logo-slot-ring .ring-solid', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 3.0)
      .to('.logo-slot-fill', { clipPath: 'circle(50% at 50% 50%)', duration: 0.7, ease: 'power3.out' }, 3.05)
      .call(setupTilt, null, 3.4)
      .call(reparentLogo, null, 3.5)
      .call(finalizeLogo, null, 3.55)
      // ---- outro ----
      .to(intro, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, 3.65);

    heroReveal(introTl, 3.75);
  } else {
    // وضع تقليل الحركة: تلاشٍ سريع للمقدمة + شعار ثابت في مركز الهيرو
    gsap.set('.logo-slot-fill', { clipPath: 'circle(50% at 50% 50%)' });
    gsap.set('.logo-slot-ring .ring-solid', { strokeDashoffset: 0 });
    gsap.set('.floater', { scale: 1, opacity: 1, rotateX: 0, rotateY: 0 });
    introTl.call(reparentLogo, null, 0)
            .call(finalizeLogo, null, 0.05);
    if (intro) introTl.to(intro, { autoAlpha: 0, duration: 0.4, ease: 'power1.inOut' }, 0.1);
  }
});
/* ===================== SERVICE DATA ===================== */
const services = [
  { en:'Brand Identity & Strategy',           ar:'الهوية البصرية والاستراتيجية',           tags:['Logo Design','Color Palette','Typography','Brand Guidelines'], img:'https://picsum.photos/seed/aurora-svc-01/900/1100' },
  { en:'Graphic Design',                      ar:'التصميم الجرافيكي',                     tags:['Social Media Posts','Campaign Visuals','Digital Graphics'], img:'https://picsum.photos/seed/aurora-svc-02/900/1100' },
  { en:'Digital & Social Media Design',       ar:'التصميم الرقمي وتصاميم السوشيال ميديا',  tags:['Website Graphics','App UI Design','Email Campaign Design','Social Media Assets'], img:'https://picsum.photos/seed/aurora-svc-03/900/1100' },
  { en:'Paid Advertising & Boosting',         ar:'الإعلانات المموّلة والترويج الرقمي',     tags:['Sponsored Ads','Social Media Boosting','Ad Campaign Design','Performance Ads'], img:'https://picsum.photos/seed/aurora-svc-04/900/1100' },
  { en:'Print & Collateral Design',           ar:'تصميم المطبوعات والمواد التسويقية',      tags:['Brochures','Business Cards','Posters','Catalogs','Company Profiles','Annual Reports'], img:'https://picsum.photos/seed/aurora-svc-05/900/1100' },
  { en:'Packaging Design',                    ar:'تصميم التغليف',                        tags:['Product Packaging','Labels','Boxes','Bags & Wrapping'], img:'https://picsum.photos/seed/aurora-svc-06/900/1100' },
  { en:'Environmental & Event Graphics',      ar:'تصاميم الفعاليات والمساحات',            tags:['Signage','Exhibition Displays','Trade Show Booths','Retail Graphics'], img:'https://picsum.photos/seed/aurora-svc-07/900/1100' },
  { en:'Full-Service Digital Solutions',      ar:'الحلول الرقمية المتكاملة',              tags:['Website Design','Digital Marketing','SEO','Content Development','Website Maintenance'], img:'https://picsum.photos/seed/aurora-svc-08/900/1100' },
  { en:'Strategy Consulting',                 ar:'الاستشارات الاستراتيجية',               tags:['Market Positioning','Growth Strategy','Brand Strategy','Long-Term Planning'], img:'https://picsum.photos/seed/aurora-svc-09/900/1100' },
  { en:'Business Advisory',                   ar:'استشارات الأعمال',                     tags:['Business Model Development','Operations Guidance','Business Planning','Future Readiness'], img:'https://picsum.photos/seed/aurora-svc-10/900/1100' },
  { en:'Portfolio & Creative Platforms',      ar:'البورتفوليو والمنصات الإبداعية',        tags:['Portfolio Design','Portfolio Websites','Creative Presentations','Personal & Brand Profiles'], img:'https://picsum.photos/seed/aurora-svc-11/900/1100' },
  { en:'Video Editing & Post-Production',     ar:'مونتاج الفيديو والتحريك الإبداعي',      tags:['Commercial & Promo Editing','Reels & Short-Form Content','Motion Graphics','VFX & Color Grading'], img:'https://picsum.photos/seed/aurora-svc-12/900/1100' },
];

/* ===================== LENIS SMOOTH SCROLL ===================== */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================== FLOATING TUMBLE ASSETS ===================== */
function initFloaters(container){
  const floaters = container.querySelectorAll('.floater');
  floaters.forEach((el, i) => {
    const depth = parseFloat(el.dataset.depth || 0.4);
    gsap.set(el, {
      rotateX: gsap.utils.random(-20, 20),
      rotateY: gsap.utils.random(-20, 20),
      rotateZ: gsap.utils.random(-8, 8),
      transformPerspective: 900,
    });

    if(!reduceMotion){
      // continuous ambient tumble
      gsap.to(el, {
        y: '+=' + gsap.utils.random(18, 34),
        x: '+=' + gsap.utils.random(-16, 16),
        rotateX: '+=' + gsap.utils.random(30, 70) * (Math.random() > 0.5 ? 1 : -1),
        rotateY: '+=' + gsap.utils.random(30, 90) * (Math.random() > 0.5 ? 1 : -1),
        rotateZ: '+=' + gsap.utils.random(-25, 25),
        duration: gsap.utils.random(6, 11),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.3,
      });
    }

    // scroll-linked parallax drift + extra spin, scoped to this section
    gsap.to(el, {
      y: (i % 2 === 0 ? '-=' : '+=') + (120 * depth),
      rotateZ: '+=' + (60 * depth) * (i % 2 === 0 ? 1 : -1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      }
    });
  });
}
initFloaters(document.getElementById('hero-floaters'));
initFloaters(document.getElementById('video-floaters'));

/* Marquee */
gsap.to('#marquee', {
  xPercent: -50,
  ease: 'none',
  duration: 22,
  repeat: -1,
});
/* ===================== SERVICES — NATURAL FLOW + REVEAL (12) ===================== */
const servicesTrack = document.getElementById('services-snap');
const servicesSectionEl = document.getElementById('services');

if (servicesTrack && servicesSectionEl) {
  // ---- build 12 full-screen slides (alternating 50/50 zig-zag) ----
  services.forEach((s, i) => {
    const num = String(i + 1).padStart(2, '0');
    const slide = document.createElement('section');
    slide.className = 'svc-slide' + (i % 2 === 1 ? ' svc-flip' : '');
    slide.setAttribute('aria-label', 'Service ' + (i + 1));
    slide.innerHTML = `
      <div class="svc-watermark">${num}</div>
      <div class="svc-text">
        <span class="svc-index">${num} / 12</span>
        <h2>
          <span class="svc-title-en">${s.en}</span>
          <span class="svc-title-ar" dir="rtl">${s.ar}</span>
        </h2>
        <ul class="svc-tags">${s.tags.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="svc-visual">
        <div class="svc-glow"></div>
        <div class="svc-card">
          <img src="${s.img}" alt="${s.en}" loading="lazy">
          <span class="svc-chip">Aurora · ${num}</span>
        </div>
      </div>`;
    servicesTrack.appendChild(slide);
  });

  const slides = gsap.utils.toArray('.svc-slide');
  const TOTAL = services.length;
  const counterEl = document.getElementById('svc-counter');
  const dotsNav = document.getElementById('svc-dots');
  let svcActive = 0;
  let svcInView = false;

  const svcGoTo = (i) => {
    i = Math.max(0, Math.min(TOTAL - 1, i));
    if (typeof lenis !== 'undefined') lenis.scrollTo(slides[i], { offset: 0, duration: 1.1 });
    else window.scrollTo({ top: slides[i].offsetTop, behavior: 'smooth' });
  };

  // ---- side dots ----
  services.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to service ' + (i + 1));
    b.addEventListener('click', () => svcGoTo(i));
    dotsNav.appendChild(b);
  });

  function svcActivate(i) {
    svcActive = i;
    document.querySelectorAll('#svc-dots button').forEach((d, di) => d.classList.toggle('is-active', di === i));
    counterEl.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b> / ${String(TOTAL).padStart(2, '0')}`;
  }

  // ---- 3D tilt + inner image parallax ----
  document.querySelectorAll('.svc-card').forEach((card) => {
    const img = card.querySelector('img');
    gsap.set(card, { transformPerspective: 900 });
    const rX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const rY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const pX = gsap.quickTo(img, 'x', { duration: 0.6, ease: 'power3.out' });
    const pY = gsap.quickTo(img, 'y', { duration: 0.6, ease: 'power3.out' });

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rY(gsap.utils.mapRange(0, 1, -8, 8, px));
      rX(gsap.utils.mapRange(0, 1, 7, -7, py));
      pX(gsap.utils.mapRange(0, 1, -18, 18, px));
      pY(gsap.utils.mapRange(0, 1, -18, 18, py));
    });
    card.addEventListener('mouseleave', () => { rX(0); rY(0); pX(0); pY(0); });
  });

  // ---- HUD follows scroll (dots + counter update as each slide passes) ----
  slides.forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => { if (self.isActive) svcActivate(i); },
    });
  });

  // ---- reveal each slide's content as it enters the viewport ----
  if (!reduceMotion) {
    gsap.utils.toArray('.svc-slide').forEach((sec) => {
      gsap.from(sec.querySelectorAll('.svc-text, .svc-visual'), {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    });
  }

  svcActivate(0);

  // ---- keyboard nav (only while the section is on screen) ----
  ScrollTrigger.create({
    trigger: servicesSectionEl,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { svcInView = self.isActive; },
  });
  window.addEventListener('keydown', (e) => {
    if (!svcInView) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); svcGoTo(svcActive + 1); }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); svcGoTo(svcActive - 1); }
  });
}

/* Video section stat counters + heading reveal */
gsap.from('#video h2, #video p, #video .grid > div', {
  y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
  scrollTrigger: { trigger: '#video', start: 'top 70%' }
});

/* CTA reveal */
gsap.from('#contact h2, #contact p, #contact a', {
  y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: '#contact', start: 'top 75%' }
});

/* Scroll reveal observer for additional elements */
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if(reduceMotionQuery.matches){
  revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  revealElements.forEach((el) => revealObserver.observe(el));
}