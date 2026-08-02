/* ===================== PAPER RIP: TORN OPENING OVERLAY ===================== */
// توليد مسار دائرة عضوية بحافة ممزقة غير منتظمة (Random-walk لاحتساب نصف القطر)
function buildTearPath(cx, cy, r, points, amplitude) {
  let d = '';
  let cur = r;
  let target = r;
  const step = (Math.PI * 2) / points;
  for (let i = 0; i < points; i++) {
    if (i % 18 === 0) target = r + (Math.random() - 0.5) * 2 * amplitude * 1.7;
    cur += (target - cur) * 0.16 + (Math.random() - 0.5) * amplitude * 0.85;
    const a = i * step;
    d += (i === 0 ? 'M' : 'L') + (cx + Math.cos(a) * cur).toFixed(1) + ' ' + (cy + Math.sin(a) * cur).toFixed(1) + ' ';
  }
  return d + 'Z';
}

window.addEventListener('load', () => {
  // إيقاف السكرول الناعم مؤقتاً أثناء تمزق الورق
  if (typeof lenis !== 'undefined') lenis.stop();

  const overlay = document.getElementById('paper-overlay');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // إخفاء عناصر الهيرو لحين كشفها عبر فتحة التمزق
  gsap.set('#hero h1 span', { y: 100, opacity: 0, rotateX: 45 });
  gsap.set('#hero p, #hero .cta-btn', { y: 30, opacity: 0 });
  gsap.set('.floater', { scale: 0, opacity: 0, rotateX: gsap.utils.random(-40, 40), rotateY: gsap.utils.random(-40, 40) });
  gsap.set('#logo-stage svg', { opacity: 0, y: 60, scale: 0.92, transformOrigin: '50% 50%' });

  const finish = () => {
    if (typeof lenis !== 'undefined') lenis.start();
    if (overlay) overlay.remove();
    // تشغيل منصة شعار AURORA الخلوي بعد اكتمال كشف الورق مباشرة
    buildLogoStage();
  };

  const introTl = gsap.timeline({ onComplete: finish });

  // إظهار محتوى الهيرو بالتتابع بعد أن تبدأ الفتحة بالاتساع
  const heroReveal = (tl, at) => {
    tl.to('#hero h1 span', { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out' }, at)
      .to('.floater', { scale: 1, opacity: 1, duration: 1.3, stagger: 0.08, ease: 'elastic.out(1, 0.75)' }, at + 0.3)
      .to('#hero p, #hero .cta-btn, #hero a[href="#contact"]', { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }, at + 0.5);
  };

  if (overlay && !reduceMotion) {
    // نصف قطر كبير يغطي كامل الشاشة (وزيادة للتأكد) حتى يختفي الورق تماماً في نهاية التمزق
    const w = window.innerWidth, h = window.innerHeight;
    const cx = w / 2, cy = h / 2;
    const R = Math.hypot(w, h) * 0.62;

    const path = overlay.querySelector('#ripPath');
    const halo = overlay.querySelector('#ripHalo');
    path.setAttribute('d', buildTearPath(0, 0, R, 320, R * 0.035));
    halo.setAttribute('d', buildTearPath(0, 0, R * 1.05, 320, R * 0.045));

    gsap.set('#ripWrap', { x: cx, y: cy });
    gsap.set('#ripScale', { transformOrigin: '50% 50%', scale: 0.0001, rotation: -6 });

    // تمزق دائري عضوي ينفتح من المركز نحو الخارج عبر تكبير ماسك الـ SVG
    introTl
      .to('#ripScale', { scale: 1, rotation: 0, duration: 1.8, ease: 'power3.inOut' }, 0.15);

    heroReveal(introTl, 0.55);
  } else {
    // وضع تقليل الحركة: تلاشٍ بسيط بدلاً من التمزق
    if (overlay) introTl.to(overlay, { opacity: 0, duration: 0.4, ease: 'power1.inOut' }, 0);
    heroReveal(introTl, 0.1);
  }
});
/* ===================== SERVICE DATA ===================== */
const services = [
  { n:'01', name:'Brand Identity', tag:'Branding', desc:'Naming, logo systems and visual language built to last.' },
  { n:'02', name:'Visual Systems', tag:'Branding', desc:'Scalable design tokens, grids and component libraries.' },
  { n:'03', name:'Packaging Design', tag:'Branding', desc:'Shelf-ready structural and print design.' },
  { n:'04', name:'Digital Design (UI/UX)', tag:'Digital', desc:'Interfaces engineered for clarity and conversion.' },
  { n:'05', name:'Web Development', tag:'Digital', desc:'Fast, animated builds shipped on modern stacks.' },
  { n:'06', name:'Paid Social &amp; Ads', tag:'Digital', desc:'Performance creative across Meta, TikTok and search.' },
  { n:'07', name:'Performance Marketing', tag:'Digital', desc:'Full-funnel media planning and optimisation.' },
  { n:'08', name:'Brand Strategy', tag:'Strategy', desc:'Positioning, architecture and go-to-market frameworks.' },
  { n:'09', name:'Content Strategy', tag:'Strategy', desc:'Editorial systems that keep channels in rhythm.' },
  { n:'10', name:'Video Editing', tag:'Motion', desc:'Story-led cuts for campaigns, social and film.' },
  { n:'11', name:'Motion Graphics', tag:'Motion', desc:'Kinetic type, 2D/3D-simulated animation and VFX polish.' },
];

const listEl = document.getElementById('service-list');
listEl.innerHTML = services.map(s => `
  <div class="service-row row-line group relative flex items-center gap-6 md:gap-10 py-7 md:py-9 opacity-0 translate-y-10">
    <span class="rev-num font-mono text-sm md:text-base text-dim w-10 shrink-0">${s.n}</span>
    <div class="flex-1">
      <div class="flex flex-col md:flex-row md:items-baseline md:gap-4">
        <h3 class="font-display text-2xl md:text-4xl tracking-tight text-bone group-hover:text-aurora transition-colors duration-300">${s.name}</h3>
        <span class="font-mono text-[10px] uppercase tracking-widest text-cyan/70">${s.tag}</span>
      </div>
      <p class="text-dim text-sm md:text-base mt-1 max-w-md">${s.desc}</p>
    </div>
    <span class="hidden md:block font-mono text-xs text-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
  </div>
`).join('') + '<div class="row-line"></div>';

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
/* ===================== SERVICES PINNED SCROLL TIMELINE ===================== */
const servicesSection = document.getElementById('services');
const serviceRows = gsap.utils.toArray('.service-row');

if (servicesSection && serviceRows.length) {
  // 1. تصفير الحالة الابتدائية لجميع الصفوف (إخفاؤها تماماً وإزاحتها للأسفل)
  gsap.set(serviceRows, { opacity: 0, y: 50, rotateX: 15 });

  if (!reduceMotion) {
    // 2. جعل الصفوف تتموضع فوق بعضها بشكل مطلق ليتم إظهارها واحدة تلو الأخرى في نفس المكان
    // نترك الصف الأول يظهر بشكل طبيعي، والبقية يتم التحكم بهم
    serviceRows.forEach((row, index) => {
      if (index > 0) {
        row.style.position = 'absolute';
        row.style.top = '0';
        row.style.left = '0';
        row.style.width = '100%';
      }
    });

    // تحويل الحاوية الأساسية إلى وضع نسبي لضبط الـ absolute المضاف حديثاً
    listEl.classList.add('relative', 'min-h-[450px]', 'md:min-h-[500px]');

    // 3. إنشاء التايم لاين وتثبيت السكشن بالكامل (Pin) أثناء التمرير
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesSection,
        start: 'top top',       // يبدأ التثبيت بمجرد وصول السكشن لأعلى الشاشة
        end: `+=${serviceRows.length * 100}%`, // مدة التثبيت تعتمد على عدد الخدمات ليعطي عمق للسكرول
        scrub: 1,               // ربط الحركة بالكامل وبشكل ناعم بـ "عجلة" السكرول
        pin: true,              // تثبيت السكشن في الشاشة
        anticipatePin: 1,
      }
    });

    // 4. بناء تتابع حركات الـ Show/Hide لكل خدمة
    serviceRows.forEach((row, index) => {
      // أنيميشن ظهور الخدمة الحالية
      pinTl.to(row, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power2.out',
      });

      // إذا لم تكن هذه هي الخدمة الأخيرة، قم بإخفائها وتصعيدها للأعلى لإفساح المجال للخدمة التالية
      if (index < serviceRows.length - 1) {
        pinTl.to(row, {
          opacity: 0,
          y: -50,
          rotateX: -15,
          duration: 0.8,
          ease: 'power2.in',
        }, '+=0.5'); // يترك مسافة زمنية صغيرة تظل فيها الخدمة مقروءة قبل الانتقال للتالية
      }
    });
  } else {
    // في حال تفعيل وضع تقليل الحركة (Reduced Motion) تظهر بشكل طبيعي متتابع بلا تعقيد
    const serviceTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: servicesSection,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      }
    });
    serviceTimeline.to(serviceRows, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.15 });
  }
}

/* Services section intro scroll animation + orb parallax */
if (!reduceMotion && servicesSection) {
  const servicesOrb = servicesSection.querySelector('.orb');
  const servicesIntro = servicesSection.querySelector('.relative.z-10.mb-16.max-w-2xl.reveal-on-scroll');

  if (servicesIntro) {
    gsap.fromTo(servicesIntro,
      { opacity: 0, y: 30, rotateX: 18 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: servicesSection,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1,
        }
      }
    );
  }

  if (servicesOrb) {
    gsap.fromTo(servicesOrb,
      { y: 20, x: 0, scale: 0.98, rotateZ: -6 },
      {
        y: -120,
        x: 60,
        scale: 1.12,
        rotateZ: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: servicesSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        }
      }
    );
  }
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

/* ===================== AURORA LOGO PARTICLE STAGE ===================== */
// بناء شعار AURORA من خلايا/جسيمات عبر أخذ عينات من بكسلات النص،
// ثم دوران ثلاثي الأبعاد وتشوّه الخلايا تبعاً لحركة المؤشر
function buildLogoStage() {
  const stage = document.getElementById('logo-stage');
  const svg = stage ? stage.querySelector('#logo-svg') : null;
  const group = stage ? stage.querySelector('#logo3d') : null;
  if (!stage || !svg || !group) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VBW = 1000, VBH = 200;
  const baseR = 3.5;

  // تدرج ألوان العلامة التجارية: سماوي ← بنفسجي ← كوزميك
  const c1 = [76, 251, 234], c2 = [157, 78, 221], c3 = [108, 43, 217];
  const brandColor = (t) => {
    let a, b, u;
    if (t < 0.5) { a = c1; b = c2; u = t * 2; }
    else { a = c2; b = c3; u = (t - 0.5) * 2; }
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * u) + ',' +
      Math.round(a[1] + (b[1] - a[1]) * u) + ',' +
      Math.round(a[2] + (b[2] - a[2]) * u) + ')';
  };

  const start = () => {
    // أخذ عينات من بكسلات النص لبناء الشبكة الخلوية
    const cv = document.createElement('canvas');
    cv.width = VBW; cv.height = VBH;
    const ctx = cv.getContext('2d');
    ctx.font = '700 150px "Bricolage Grotesque", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('AURORA', VBW / 2, VBH / 2);

    const img = ctx.getImageData(0, 0, VBW, VBH).data;
    const step = 7;
    const cells = [];
    const frag = document.createDocumentFragment();
    const NS = 'http://www.w3.org/2000/svg';

    for (let y = 0; y < VBH; y += step) {
      for (let x = 0; x < VBW; x += step) {
        if (img[(y * VBW + x) * 4 + 3] > 128) {
          const c = document.createElementNS(NS, 'circle');
          c.setAttribute('r', baseR);
          c.setAttribute('fill', brandColor(x / VBW));
          c.setAttribute('cx', x);
          c.setAttribute('cy', y);
          frag.appendChild(c);
          cells.push({ el: c, ax: x, ay: y, x: x, y: y, s: 1 });
        }
      }
    }
    group.appendChild(frag);

    // 1) ظهور الشعار في الخلفية بعد اكتمال كشف الورق
    gsap.to(svg, {
      opacity: 0.55, y: 0, scale: 1, duration: 1.5, ease: 'power3.out',
      transformOrigin: '50% 50%', clearProps: 'transform',
    });

    if (!reduceMotion) {
      // 2) دوران ثلاثي الأبعاد ناعم ومستمر
      gsap.to(group, {
        rotationY: -17, rotationZ: 3, transformPerspective: 1200,
        duration: 5.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.35,
      });

      // 3) تشوّه الخلايا مع حركة المؤشر ثم عودتها لبنيتها الأصلية
      const pointer = { x: null, y: null };
      let inView = true;
      let rafId = null;
      let idle = 0;

      const wake = () => {
        idle = 0;
        if (rafId === null) rafId = requestAnimationFrame(tick);
      };

      window.addEventListener('pointermove', (e) => {
        // تحويل إحداثيات المؤشر إلى إحداثيات الـ viewBox (مع مراعاة letterbox)
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

      const R = 170, MAX = 34, ANG = 0.55;
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
  };

  // انتظار تحميل الخط قبل أخذ العينات لضمان دقة شكل الشعار
  if (document.fonts && document.fonts.ready) {
    Promise.all([document.fonts.ready, document.fonts.load('700 150px "Bricolage Grotesque"')]).then(start);
  } else {
    start();
  }
}