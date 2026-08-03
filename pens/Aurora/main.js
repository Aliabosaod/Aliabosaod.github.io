/* ===================== CRT INK SPLATTER INTRO ===================== */
// توليد مسار حبر عضوي انفجاري مع أطراف/أذرع ممدودة (Random-walk لنصف القطر)
function buildSplatter(cx, cy, r, points, amp) {
  let d = '';
  let cur = r;
  let target = r;
  const pts = [];
  const step = (Math.PI * 2) / points;
  for (let i = 0; i < points; i++) {
    if (i % 9 === 0) {
      target = Math.random() < 0.34
        ? r * (1.3 + Math.random() * 0.7)   // أطراف/أذرع حبر ممدودة
        : r * (0.8 + Math.random() * 0.4);
    }
    cur += (target - cur) * 0.13 + (Math.random() - 0.5) * amp;
    const a = i * step;
    const rr = Math.max(5, cur);
    pts.push({ a: a, r: rr });
    d += (i === 0 ? 'M' : 'L') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1) + ' ';
  }
  return { d: d + 'Z', pts: pts };
}

// ألوان التوهج الحراري: برتقالي ساطع على الحافة نحو أحمر داكن في العمق
function thermalColor(t) {
  const a = [255, 146, 40], b = [198, 26, 10];
  return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
    Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
    Math.round(a[2] + (b[2] - a[2]) * t) + ')';
}

// بناء كتلة الحبر: جسم أسود + هالة حرارية مشوشة + نقاط هالف-تون على الحواف + قطرات متطايرة
function buildInkSplatter() {
  const svg = document.getElementById('ink-svg');
  if (!svg) return [];
  const body = svg.querySelector('#ink-body');
  const glow = svg.querySelector('#ink-glow');
  const dotsEl = svg.querySelector('#ink-dots');
  const dropsEl = svg.querySelector('#ink-drops');
  const NS = 'http://www.w3.org/2000/svg';

  const cx = 500, cy = 500, R = 340;
  const res = buildSplatter(cx, cy, R, 240, R * 0.16);
  body.setAttribute('d', res.d);
  glow.setAttribute('d', res.d);

  // نقاط الهالف-تون الحرارية في شريط قريب من حافة الحبر
  const frag = document.createDocumentFragment();
  for (let i = 0; i < res.pts.length; i += 2) {
    const p = res.pts[i];
    const a = p.a + (Math.random() - 0.5) * 0.05;
    const depth = Math.random() * 0.16;
    const rr = p.r * (1 - depth);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', (cx + Math.cos(a) * rr).toFixed(1));
    c.setAttribute('cy', (cy + Math.sin(a) * rr).toFixed(1));
    c.setAttribute('r', ((6.5 - depth * 22) * (0.8 + Math.random() * 0.5)).toFixed(1));
    c.setAttribute('fill', thermalColor(depth));
    c.setAttribute('opacity', Math.max(0, 1 - depth * 3).toFixed(2));
    frag.appendChild(c);
  }
  dotsEl.appendChild(frag);

  // قطرات حبر متطايرة (سوداء مع بعض النقاط الحرارية)
  const dFrag = document.createDocumentFragment();
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2;
    const dist = R * (1.05 + Math.random() * 0.5);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', 'ink-drop');
    c.setAttribute('cx', (cx + Math.cos(a) * dist).toFixed(1));
    c.setAttribute('cy', (cy + Math.sin(a) * dist).toFixed(1));
    c.setAttribute('r', (3 + Math.random() * 7).toFixed(1));
    c.setAttribute('fill', i % 3 === 0 ? thermalColor(Math.random() * 0.4) : '#0b0b0b');
    dFrag.appendChild(c);
  }
  dropsEl.appendChild(dFrag);
  return dropsEl.querySelectorAll('.ink-drop');
}

// شعار AURORA الحقيقي: مصدر خلايا النقاط بدلاً من نص مؤقت
const auroraLogoImage = new Image();
auroraLogoImage.src = 'imgs/logo-2k-without-background.png';

window.addEventListener('load', () => {
  // إيقاف السكرول الناعم مؤقتاً أثناء المقدمة
  if (typeof lenis !== 'undefined') lenis.stop();

  const overlay = document.getElementById('crt-overlay');
  const screen = document.getElementById('crt-screen');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // إخفاء محتوى الهيرو حتى يُكشف عبر تلاشي الشاشة البيضاء
  gsap.set('#hero h1 span', { y: 100, opacity: 0, rotateX: 45 });
  gsap.set('#hero p, #hero .cta-btn', { y: 30, opacity: 0 });
  gsap.set('.floater', { scale: 0, opacity: 0, rotateX: gsap.utils.random(-40, 40), rotateY: gsap.utils.random(-40, 40) });

  const finish = () => {
    if (typeof lenis !== 'undefined') lenis.start();
    // نقل منصة الشعار إلى الهيرو لتبقى في خلفية الصفحة بعد انتهاء المقدمة
    const hero = document.getElementById('hero');
    const stage = document.getElementById('logo-stage');
    if (stage && hero) {
      hero.appendChild(stage);
      gsap.set(stage, { zIndex: 5, opacity: 0.6 });
    }
    if (overlay) overlay.remove();
  };

  const introTl = gsap.timeline({ onComplete: finish });

  // إظهار محتوى الهيرو بالتتابع بعد تلاشي الشاشة البيضاء
  const heroReveal = (tl, at) => {
    tl.to('#hero h1 span', { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out' }, at)
      .to('.floater', { scale: 1, opacity: 1, duration: 1.3, stagger: 0.08, ease: 'elastic.out(1, 0.75)' }, at + 0.3)
      .to('#hero p, #hero .cta-btn, #hero a[href="#contact"]', { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }, at + 0.5);
  };

  // كشف الشعار: ينتظر اكتمال تحميل صورة اللوغو الحقيقية قبل البناء والإظهار
  const revealLogo = (immediateColor) => {
    const run = () => assembleLogoStage(immediateColor);
    if (auroraLogoImage.complete && auroraLogoImage.naturalWidth > 0) run();
    else auroraLogoImage.addEventListener('load', run, { once: true });
  };

  if (overlay && !reduceMotion) {
    const drops = buildInkSplatter();

    // مقياس التغطية: يُحسب من أبعاد الشاشة الفعلية ليضمن غطاءً كاملاً بأي نسبة عرض/ارتفاع
    const rect = screen.getBoundingClientRect();
    const scaleUnit = Math.max(rect.width, rect.height) / 1000;
    const halfDiagVB = (Math.hypot(rect.width, rect.height) / 2) / scaleUnit;
    const coverScale = Math.max(1.4, halfDiagVB / 250);
    const dotScale = 0.02;

    gsap.set('#splatter-group', { scale: dotScale, rotation: -5, transformOrigin: '50% 50%' });
    gsap.set('.ink-drop', { scale: 0, opacity: 0 });

    introTl
      // 1) نقطة حبر عضوية صغيرة جداً عند المركز بالضبط (تمكث لحظة ثم تنبض)
      .to('#splatter-group', { scale: dotScale * 1.8, rotation: 0, duration: 0.5, ease: 'power1.out' }, 0)
      // 2) انفجار بطيء سينمائي حتى تغطية كامل الشاشة مع حافة هالف-تون حرارية تكتسح الأطراف
      .to('#splatter-group', { scale: coverScale, rotation: 0, duration: 2.3, ease: 'expo.out' }, 0.55)
      // 3) قطرات حبر متطايرة أثناء الانفجار
      .to(drops, { scale: 1, opacity: 1, duration: 0.65, stagger: 0.04, ease: 'power2.out' }, 0.95)
      // 4) تكثف الحبر عند المركز وانكشاف اللوغو الحقيقي بشبكته الخلوية من تحته
      .to('#splatter-group', { scale: coverScale * 0.9, opacity: 0, duration: 1.2, ease: 'power3.in' }, 3.3)
      .fromTo('#logo-stage', { scale: 0.6, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.15, ease: 'power3.out',
        onStart: () => revealLogo(false),
      }, 3.55)
      // 5) تلاشي الشاشة البيضاء وكشف الموقع + إشعال ألوان العلامة
      .to(screen, { opacity: 0, duration: 1.3, ease: 'power2.inOut' }, 4.8)
      .add(() => igniteLogo(), 4.85);

    heroReveal(introTl, 5.0);
  } else {
    // وضع تقليل الحركة: تلاشٍ سريع للشاشة البيضاء + لوغو حقيقي ثابت
    if (overlay) introTl.to(screen, { opacity: 0, duration: 0.5, ease: 'power1.inOut' }, 0);
    if (overlay) introTl.add(() => revealLogo(true), 0.05);
    heroReveal(introTl, 0.2);
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

/* ===================== AURORA LOGO CELLS (يتولد من تكثف الحبر) ===================== */
let auroraCells = [];

// ألوان العلامة: سماوي ← بنفسجي ← كوزميك
function brandColor(t) {
  const c1 = [76, 251, 234], c2 = [157, 78, 221], c3 = [108, 43, 217];
  let a, b, u;
  if (t < 0.5) { a = c1; b = c2; u = t * 2; }
  else { a = c2; b = c3; u = (t - 0.5) * 2; }
  return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * u) + ',' +
    Math.round(a[1] + (b[1] - a[1]) * u) + ',' +
    Math.round(a[2] + (b[2] - a[2]) * u) + ')';
}

// بناء مرحلة الشعار: اللوغو الحقيقي ظاهر بوضوح + شبكة سطحية من الخلايا تشوّه مع المؤشر
function assembleLogoStage(immediateColor) {
  const stage = document.getElementById('logo-stage');
  const svg = stage ? stage.querySelector('#logo-svg') : null;
  const group = stage ? stage.querySelector('#logo3d') : null;
  if (!stage || !svg || !group) return;
  if (group.childElementCount > 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VBW = 1000, VBH = 200;
  const baseR = 2.2;
  const NS = 'http://www.w3.org/2000/svg';

  // 1) اللوغو الحقيقي: صورة واضحة تماماً في المركز (مواد/نص الصورة تظهر كاملة)
  const imageEl = document.createElementNS(NS, 'image');
  imageEl.setAttribute('href', 'imgs/logo-2k-without-background.png');
  imageEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'imgs/logo-2k-without-background.png');
  imageEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  if (auroraLogoImage.complete && auroraLogoImage.naturalWidth > 0) {
    const iw = auroraLogoImage.naturalWidth, ih = auroraLogoImage.naturalHeight;
    const s = Math.min(VBW / iw, VBH / ih);
    imageEl.setAttribute('x', ((VBW - iw * s) / 2).toFixed(1));
    imageEl.setAttribute('y', ((VBH - ih * s) / 2).toFixed(1));
    imageEl.setAttribute('width', (iw * s).toFixed(1));
    imageEl.setAttribute('height', (ih * s).toFixed(1));
  } else {
    imageEl.setAttribute('x', '0');
    imageEl.setAttribute('y', '0');
    imageEl.setAttribute('width', VBW);
    imageEl.setAttribute('height', VBH);
  }
  group.appendChild(imageEl);

  // 2) الشبكة السطحية: عينات من بكسلات اللوغو نفسه (خلايا صغيرة تشوّه وتتباعد مع المؤشر)
  const cv = document.createElement('canvas');
  cv.width = VBW; cv.height = VBH;
  const ctx = cv.getContext('2d');
  if (auroraLogoImage.complete && auroraLogoImage.naturalWidth > 0) {
    const iw = auroraLogoImage.naturalWidth, ih = auroraLogoImage.naturalHeight;
    const s = Math.min(VBW / iw, VBH / ih);
    ctx.drawImage(auroraLogoImage, (VBW - iw * s) / 2, (VBH - ih * s) / 2, iw * s, ih * s);
  } else {
    ctx.font = '700 150px "Bricolage Grotesque", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('AURORA', VBW / 2, VBH / 2);
  }

  const img = ctx.getImageData(0, 0, VBW, VBH).data;
  const step = 7;
  const cells = [];
  const frag = document.createDocumentFragment();

  for (let y = 0; y < VBH; y += step) {
    for (let x = 0; x < VBW; x += step) {
      if (img[(y * VBW + x) * 4 + 3] > 128) {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('r', baseR);
        c.setAttribute('fill', immediateColor ? brandColor(x / VBW) : '#0b0b0b');
        c.setAttribute('opacity', '0.6');
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        frag.appendChild(c);
        cells.push({ el: c, ax: x, ay: y, x: x, y: y, s: 1 });
      }
    }
  }
  group.appendChild(frag);
  auroraCells = cells;

  // إظهار الشعار في وضع تقليل الحركة
  if (immediateColor) {
    gsap.to(stage, { opacity: 0.6, duration: 0.7, ease: 'power2.out' });
  }

  if (!reduceMotion) {
    // دوران ثلاثي الأبعاد ناعم ومستمر
    gsap.to(group, {
      rotationY: -17, rotationZ: 3, transformPerspective: 1200,
      duration: 5.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.3,
    });
    // تشوّه الخلايا وتفاعلها مع المؤشر ثم عودتها لبنيتها الأصلية
    setupDistortion(stage, svg, cells, VBW, VBH, baseR);
  }
}

// إشعال ألوان العلامة التجارية فوق خلايا الشعار (بعد كشف الخلفية الداكنة)
function igniteLogo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < auroraCells.length; i++) {
    const cell = auroraCells[i];
    gsap.to(cell.el, {
      attr: { fill: brandColor(cell.ax / 1000) },
      duration: 1.1, ease: 'power1.inOut', delay: i * 0.0015,
    });
  }
}

// تشوّه الخلايا مع حركة المؤشر (دفع + منحنى حلزوني) ثم استرخاء ناعم نحو البنية الأصلية
function setupDistortion(stage, svg, cells, VBW, VBH, baseR) {
  const pointer = { x: null, y: null };
  let inView = true;
  let rafId = null;
  let idle = 0;

  const wake = () => {
    idle = 0;
    if (rafId === null) rafId = requestAnimationFrame(tick);
  };

  window.addEventListener('pointermove', (e) => {
    // تحويل إحداثيات المؤشر إلى إحداثيات الـ viewBox
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / VBW, rect.height / VBH);
    const ox = rect.left + (rect.width - VBW * scale) / 2;
    const oy = rect.top + (rect.height - VBH * scale) / 2;
    pointer.x = (e.clientX - ox) / scale;
    pointer.y = (e.clientY - oy) / scale;
    if (inView) wake();
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    pointer.x = null;
    pointer.y = null;
    if (inView) wake();
  });

  // إيقاف العمل عند خروج الهيرو من الشاشة
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) wake();
  }, { threshold: 0 }).observe(stage);

  const R = 150, MAX = 30, ANG = 0.55;
  const cosA = Math.cos(ANG), sinA = Math.sin(ANG);
  const K = 0.16;

  function tick() {
    let wrote = false;
    if (inView && pointer.x !== null && pointer.y !== null) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        let tx = cell.ax, ty = cell.ay, ts = 1;
        const rx = cell.ax - pointer.x, ry = cell.ay - pointer.y;
        const d2 = rx * rx + ry * ry;
        if (d2 < R * R && d2 > 0.001) {
          // قوة التشتت تتناقص مع المسافة + منحنى حلزوني خفيف
          const d = Math.sqrt(d2);
          const f = 1 - d / R;
          const s = f * f * MAX;
          const ex = rx / d, ey = ry / d;
          tx += (ex * cosA - ey * sinA) * s;
          ty += (ex * sinA + ey * cosA) * s;
          ts = 1 + f * 0.55;
        }
        // استرخاء ناعم نحو الهدف ثم عودة إلى الشكل الأصلي
        cell.x += (tx - cell.x) * K;
        cell.y += (ty - cell.y) * K;
        cell.s += (ts - cell.s) * K;
        if (Math.abs(cell.x - tx) > 0.04 || Math.abs(cell.y - ty) > 0.04 || Math.abs(cell.s - ts) > 0.008) {
          const el = cell.el;
          el.setAttribute('cx', cell.x.toFixed(2));
          el.setAttribute('cy', cell.y.toFixed(2));
          el.setAttribute('r', (baseR * cell.s).toFixed(2));
          wrote = true;
        }
      }
    }
    idle = wrote ? 0 : idle + 1;
    if (idle > 60) { rafId = null; return; }
    rafId = requestAnimationFrame(tick);
  }
}