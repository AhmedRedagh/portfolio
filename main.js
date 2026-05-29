/* ═══════════════════════════════════════════════════════════════
   Ahmed Reda Portfolio — main.js v2
   All 20 improvements implemented
   ═══════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── Preloader ─────────────────────────────────────────────────── */
(function initPreloader() {
  const el    = document.getElementById('preloader');
  const numEl = document.getElementById('pre-num');
  const bar   = document.querySelector('.pre-bar');
  let count = 0;

  const tick = setInterval(() => {
    count += Math.floor(Math.random() * 9) + 2;
    if (count >= 100) {
      count = 100;
      clearInterval(tick);
      numEl.textContent = 100;
      bar.style.width = '100%';

      anime.timeline({ easing: 'easeInOutQuad' })
        .add({ targets: '.pre-label', opacity: 0, duration: 300 })
        .add({
          targets: el, opacity: 0, duration: 600,
          complete: () => {
            el.style.display = 'none';
            document.body.classList.remove('is-loading');
            revealHero();
          }
        });
    } else {
      numEl.textContent = count;
      bar.style.width = count + '%';
    }
  }, 28);
})();

/* ─── Theme Toggle ───────────────────────────────────────────────── */
(function initTheme() {
  const root   = document.documentElement;
  const btn    = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('ar-theme') || 'dark';
  root.setAttribute('data-theme', stored);

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ar-theme', next);
  });
})();

/* ─── Three.js Particle Field ────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 6;

  const COUNT = innerWidth < 768 ? 300 : 700;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    pos[i3]   = (Math.random() - 0.5) * 24;
    pos[i3+1] = (Math.random() - 0.5) * 24;
    pos[i3+2] = (Math.random() - 0.5) * 8;
    vel[i]    = Math.random() * 0.004 + 0.001;
    const t   = Math.random();
    col[i3]   = t < 0.5 ? 0 : 0.61;
    col[i3+1] = t < 0.5 ? 0.83 : 0.48;
    col[i3+2] = 1.0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.018, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  let mx = 0, my = 0, cx = 0, cy = 0;
  addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; });

  function raf() {
    requestAnimationFrame(raf);
    const p = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) { p[i*3+1] -= vel[i]; if (p[i*3+1] < -12) p[i*3+1] = 12; }
    geo.attributes.position.needsUpdate = true;
    pts.rotation.y += 0.0002;
    cx += (mx * 0.4 - cx) * 0.04;
    cy += (-my * 0.4 - cy) * 0.04;
    camera.position.x = cx; camera.position.y = cy;
    renderer.render(scene, camera);
  }
  raf();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ─── Spotlight Cursor ───────────────────────────────────────────── */
(function initSpotlight() {
  const sp = document.getElementById('spotlight');
  if (!sp) return;
  sp.style.left = '0'; sp.style.top = '0';
  addEventListener('mousemove', e => {
    sp.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
  }, { passive: true });
})();

/* ─── Custom Cursor ─────────────────────────────────────────────── */
(function initCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = -200, my = -200, rx = -200, ry = -200;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function lerpRing() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    /* Use transform instead of left/top — no layout reflow */
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    dot.style.transform  = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
    requestAnimationFrame(lerpRing);
  })();

  document.querySelectorAll('a, button, .proj-card, .pf-btn, .tc-tag, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─── Hero Reveal ───────────────────────────────────────────────── */
function revealHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('#navbar',       { y: -60, opacity: 0, duration: 1 })
    .from('.hero-badge',   { y: 24,  opacity: 0, duration: 0.7 }, '-=0.5')
    .add(() => scramble(document.getElementById('name-ahmed')), '-=0.2')
    .from('#name-ahmed',   { y: 60,  opacity: 0, duration: 0.9 }, '-=0.7')
    .add(() => scramble(document.getElementById('name-reda')),  '-=0.3')
    .from('#name-reda',    { y: 60,  opacity: 0, duration: 0.9 }, '-=0.7')
    .from('.hero-role',    { y: 20,  opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-bio',     { y: 20,  opacity: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-actions', { y: 20,  opacity: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-stats',   { y: 20,  opacity: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-social .social-btn', { x: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.4')
    .from('.hero-scroll',  { y: -20, opacity: 0, duration: 0.5 }, '-=0.3');

  document.querySelectorAll('.h-stat-num').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || '0');
    gsap.to({ v: 0 }, {
      v: target, duration: 2.4, ease: 'power2.out', delay: 1.2,
      onUpdate: function() { el.textContent = decimal > 0 ? this.targets()[0].v.toFixed(decimal) : Math.floor(this.targets()[0].v); }
    });
  });

  setTimeout(startTypewriter, 1600);
}

/* ─── Text Scramble ─────────────────────────────────────────────── */
function scramble(el) {
  if (!el) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&';
  const original = el.textContent;
  let frame = 0;
  const total = original.length * 4;
  const iv = setInterval(() => {
    el.textContent = original.split('').map((ch, i) => i < frame / 4 ? original[i] : ch === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]).join('');
    frame++;
    if (frame > total) clearInterval(iv);
  }, 28);
}

/* ─── Typewriter ────────────────────────────────────────────────── */
function startTypewriter() {
  const el = document.getElementById('role-typed');
  if (!el) return;
  const words = ['Flutter Developer', 'Mobile Engineer', 'Clean Architect', 'App Builder'];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
    deleting ? ci-- : ci++;
    let delay = deleting ? 50 : 100;
    if (!deleting && ci === word.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ─── Navbar ────────────────────────────────────────────────────── */
(function initNavbar() {
  const nav   = document.getElementById('navbar');
  const bar   = document.querySelector('.nav-scroll-bar');
  const links = document.querySelectorAll('.nav-link');
  const dots  = document.querySelectorAll('.sd');

  addEventListener('scroll', () => {
    const sy    = window.scrollY;
    const total = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = ((sy / total) * 100).toFixed(1) + '%';
    nav.classList.toggle('scrolled', sy > 60);

    const btt = document.getElementById('back-top');
    if (btt) btt.classList.toggle('visible', sy > 400);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top    = sec.offsetTop - 140;
      const bottom = top + sec.offsetHeight;
      if (sy >= top && sy < bottom) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (a) a.classList.add('active');
        dots.forEach(d => d.classList.remove('active'));
        const d = document.querySelector(`.sd[href="#${sec.id}"]`);
        if (d) d.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ─── Mobile Drawer ─────────────────────────────────────────────── */
(function initDrawer() {
  const btn     = document.getElementById('hamburger');
  const drawer  = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const close   = document.getElementById('drawer-close');
  const links   = document.querySelectorAll('.drawer-link');

  function open()  { btn.classList.add('open'); drawer.classList.add('open'); overlay.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
  function shut()  { btn.classList.remove('open'); drawer.classList.remove('open'); overlay.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }

  btn?.addEventListener('click',     open);
  close?.addEventListener('click',   shut);
  overlay?.addEventListener('click', shut);
  links.forEach(l => l.addEventListener('click', shut));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
})();

/* ─── Back to Top ───────────────────────────────────────────────── */
document.getElementById('back-top')?.addEventListener('click', () => {
  gsap.to(window, { scrollTo: { y: 0 }, duration: 1, ease: 'power3.inOut' });
});

/* ─── Smooth Anchor Scroll ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { scrollTo: { y: target.offsetTop - 80 }, duration: 1.1, ease: 'power3.inOut' });
  });
});
document.querySelectorAll('.sd[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { scrollTo: { y: target.offsetTop - 80 }, duration: 1.1, ease: 'power3.inOut' });
  });
});

/* ─── Copy Email ────────────────────────────────────────────────── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => showToast('Email copied!'));
  });
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ─── Project Modals ─────────────────────────────────────────────── */
const MODALS = {
  sanad: {
    title: 'Sanad Rewards', cat: 'Health & Wellness · Android & iOS',
    desc: 'Health challenge platform integrating Apple Health and Google Fit APIs for real-time fitness data sync. Features a full multimedia content platform with articles, podcasts, videos, and community feed with offline-first support. Custom Lottie-animated calendar system and location-based services for challenge tracking.',
    kpis: ['100K+ Downloads', '4.5★ Rating', '50K+ Active Users', '90% Manual Entry Eliminated'],
    stack: ['Flutter', 'Dart', 'BLoC', 'Firebase', 'Apple Health', 'Google Fit', 'REST APIs', 'Lottie'],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/app/sanad-rewards/id6473984293' },
      { label: 'Play Store', href: 'https://play.google.com/store/apps/details?id=com.sanad.rewards' }
    ]
  },
  league: {
    title: 'League Plus', cat: 'Sports Prediction · Android & iOS',
    desc: 'Cross-platform sports prediction platform enabling real-time match predictions and custom league creation. Implemented GraphQL integration for live match data. Built deep linking and referral engine and integrated Firebase Cloud Messaging for personalised push notifications.',
    kpis: ['30K+ Active Users', '99.9% Uptime', '+25% User Acquisition', '40% FCM Open Rate'],
    stack: ['Flutter', 'Dart', 'BLoC', 'GraphQL', 'Firebase', 'Hive', 'Deep Links', 'Lottie'],
    links: []
  },
  pulse: {
    title: 'Pulse', cat: 'Gym & Fitness · Android & iOS',
    desc: 'Gym training and fitness app featuring Pusher Socket real-time chatting, Firebase integration, video player, Pedometer for steps tracking, and location services. Deep linking and FCM referral system contributed to 25% user acquisition growth.',
    kpis: ['40% Notif Open Rate', 'Real-time Chat', 'Step Tracking', '+25% Acquisition'],
    stack: ['Flutter', 'Dart', 'BLoC', 'Pusher', 'GraphQL', 'Firebase', 'Hive', 'Deep Links'],
    links: []
  },
  kitchen: {
    title: 'The Kitchen', cat: 'Restaurant POS & Management · Android & iOS',
    desc: 'Full-featured restaurant POS and management system with complete order management, inventory tracking, and reporting dashboards. Offline-first architecture ensures uninterrupted restaurant operations even without connectivity.',
    kpis: ['Full POS System', 'Offline-First', 'Inventory Management', 'Real-time Reporting'],
    stack: ['Flutter', 'Dart', 'BLoC', 'REST APIs', 'Firebase', 'Local Storage'],
    links: []
  },
  salute: {
    title: 'Salute', cat: 'Medical Transport & Emergency · Android & iOS',
    desc: 'Real-time ambulance tracking via Google Maps SDK and Socket.IO. Driver-patient matching algorithm with route optimisation and offline-first reliability. Automated scheduling system that cut patient no-shows by 30%.',
    kpis: ['-30% No-Shows', 'Real-time Tracking', 'Route Optimisation', 'Offline-First'],
    stack: ['Flutter', 'Dart', 'Cubit', 'Google Maps SDK', 'Socket.IO', 'Firestore', 'Push Notifications'],
    links: []
  },
  islami: {
    title: 'Islami Hub', cat: 'Islamic Companion · iOS',
    desc: 'Comprehensive Islamic companion app featuring a Quran reader with audio playback, geolocation-based prayer times, Qibla compass, and FCM notifications with 85%+ delivery rate. Custom animations enhance the spiritual experience.',
    kpis: ['85%+ FCM Delivery', 'Qibla Compass', 'Geolocation Prayer Times', 'Custom Animations'],
    stack: ['Flutter', 'Dart', 'Cubit', 'Location Services', 'Firebase', 'Custom Animations'],
    links: []
  },
  year: {
    title: 'A Year in Review', cat: 'Medical Conference · Android & iOS',
    desc: 'QR-based attendance system, workshop enrollment, real-time Q&A, and moderator interaction features for medical conferences. Full Arabic/English localisation with complete RTL layout handling.',
    kpis: ['QR Attendance', 'Real-time Q&A', 'Full RTL Support', 'Workshop Enrollment'],
    stack: ['Flutter', 'Dart', 'Cubit', 'REST APIs', 'Firebase', 'Localization'],
    links: []
  },
  crm: {
    title: 'GTS CRM', cat: 'Customer Relationship Management · iOS',
    desc: 'End-to-end CRM system with client pipeline management, activity logging, comprehensive sales dashboards, and offline sync for field sales teams. Designed for sales reps working in the field without reliable connectivity.',
    kpis: ['Offline Sync', 'Sales Dashboard', 'Pipeline Management', 'Activity Logging'],
    stack: ['Flutter', 'Dart', 'BLoC', 'REST APIs', 'Firebase', 'GoRouter'],
    links: []
  }
};

function openModal(id) {
  const data = MODALS[id];
  if (!data) return;

  const linksHtml = data.links.length
    ? `<div class="modal-links">${data.links.map(l => `<a href="${l.href}" target="_blank" rel="noopener" class="modal-link">${l.label}</a>`).join('')}</div>`
    : '';

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-proj-title">${data.title}</div>
    <div class="modal-proj-cat">${data.cat}</div>
    <p class="modal-proj-desc">${data.desc}</p>
    <div class="modal-section-title">Key Metrics</div>
    <div class="modal-kpi-row">${data.kpis.map(k => `<span class="modal-kpi">${k}</span>`).join('')}</div>
    <div class="modal-section-title">Tech Stack</div>
    <div class="modal-stack">${data.stack.map(s => `<span>${s}</span>`).join('')}</div>
    ${linksHtml}
  `;

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');
  overlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.pj-detail').forEach(btn => {
  btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.dataset.modal); });
});
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ─── GSAP Scroll Animations ─────────────────────────────────────── */
(function initScroll() {
  gsap.utils.toArray('.section-head').forEach(h => {
    gsap.from(h, { scrollTrigger: { trigger: h, start: 'top 82%', once: true }, y: 36, opacity: 0, duration: 0.8, ease: 'power3.out' });
  });
  gsap.from('.about-vis', {
    scrollTrigger: { trigger: '#about', start: 'top 72%', once: true },
    x: -60, opacity: 0, duration: 1, ease: 'power3.out'
  });
  gsap.from('.about-text-col', {
    scrollTrigger: { trigger: '#about', start: 'top 72%', once: true },
    x: 60, opacity: 0, duration: 1, ease: 'power3.out'
  });
  gsap.utils.toArray('.tl-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 82%', once: true },
      x: i % 2 === 0 ? 50 : -50, opacity: 0, duration: 0.8, delay: i * 0.05, ease: 'power3.out'
    });
  });
  gsap.utils.toArray('.proj-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 86%', once: true },
      y: 48, opacity: 0, duration: 0.7, delay: (i % 3) * 0.08, ease: 'power2.out'
    });
  });
  gsap.utils.toArray('.sk-fill').forEach(fill => {
    ScrollTrigger.create({
      trigger: fill, start: 'top 90%', once: true,
      onEnter: () => { fill.style.width = fill.dataset.w + '%'; }
    });
  });
  gsap.from('.tc-tag', {
    scrollTrigger: { trigger: '.tech-cloud', start: 'top 88%', once: true },
    y: 20, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out'
  });
  gsap.utils.toArray('.cert-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 86%', once: true },
      y: 40, opacity: 0, duration: 0.7, delay: (i % 3) * 0.08, ease: 'power2.out'
    });
  });
  gsap.from('.contact-left', {
    scrollTrigger: { trigger: '#contact', start: 'top 72%', once: true },
    x: -60, opacity: 0, duration: 1, ease: 'power3.out'
  });
  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '#contact', start: 'top 72%', once: true },
    x: 60, opacity: 0, duration: 1, ease: 'power3.out'
  });

  /* Parallax hero */
  gsap.to('#hero .hero-content', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    y: 100, opacity: 0.3, ease: 'none'
  });
})();

/* ─── 3D Card Tilt ───────────────────────────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  });
});

/* ─── Project Filter ─────────────────────────────────────────────── */
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.proj-card').forEach(card => {
      const match = f === 'all' || card.dataset.cat === f;
      gsap.to(card, { opacity: match ? 1 : 0.18, scale: match ? 1 : 0.97, duration: 0.35, ease: 'power2.out' });
    });
  });
});

/* ─── Magnetic Nav Links ─────────────────────────────────────────── */
document.querySelectorAll('.nav-link, .nav-cta').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.22;
    const y = (e.clientY - r.top  - r.height / 2) * 0.22;
    gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ─── Contact Form ───────────────────────────────────────────────── */
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  const btn  = this.querySelector('.btn-submit');
  const text = btn.querySelector('.submit-text');
  text.textContent = 'Sending…';
  btn.disabled = true;
  gsap.to(btn, { scale: 0.96, duration: 0.15, yoyo: true, repeat: 1 });
  setTimeout(() => { text.textContent = 'Send Message'; btn.disabled = false; }, 4000);
});

/* ═══════════════════════════════════════════════════════════════
   v3 — Performance-safe additions
   ═══════════════════════════════════════════════════════════════ */

/* ─── Hero Photo Reveal ──────────────────────────────────────────── */
function revealPhoto() {
  const frame = document.getElementById('hero-photo');
  if (!frame) return;
  gsap.from(frame, { clipPath: 'circle(0% at 50% 50%)', opacity: 0, duration: 1.4, ease: 'power4.out', delay: 0.8 });
  gsap.from('.photo-event-badge', { y: 20, opacity: 0, duration: 0.8, delay: 1.8 });
  gsap.from('.photo-tech-ring span', { opacity: 0, stagger: 0.08, duration: 0.4, delay: 2, ease: 'power2.out' });
}
const _orig = revealHero;
revealHero = function() { _orig(); revealPhoto(); };

/* ─── GSAP Horizontal Scroll (single tween, no nested STriggers) ── */
(function initHorizontalScroll() {
  const pinWrap = document.getElementById('proj-pin-wrap');
  const track   = document.getElementById('proj-h-track');
  const progBar = document.querySelector('.proj-progress-bar');
  if (!pinWrap || !track || window.innerWidth < 768) return;

  /* Slide counter */
  const counter = document.createElement('div');
  counter.style.cssText = 'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);font-family:var(--font-mono);font-size:0.8125rem;color:var(--muted);z-index:10;pointer-events:none;';
  pinWrap.appendChild(counter);

  const slides = track.querySelectorAll('.ph-slide');

  function setup() {
    ScrollTrigger.getAll().forEach(t => { if (t.vars.trigger === pinWrap) t.kill(); });
    const total = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: -total,
      ease: 'none',
      scrollTrigger: {
        trigger: pinWrap,
        pin: true,
        scrub: 1,
        end: () => '+=' + total,
        invalidateOnRefresh: true,
        onUpdate(self) {
          if (progBar) progBar.style.width = (self.progress * 100).toFixed(1) + '%';
          const idx = Math.min(Math.floor(self.progress * slides.length), slides.length - 1);
          counter.textContent = (idx + 1) + ' / ' + slides.length;
        }
      }
    });
  }

  setTimeout(setup, 200);
  addEventListener('resize', () => setTimeout(setup, 300));

  /* Modal wiring */
  document.querySelectorAll('.ph-detail').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.dataset.modal); });
  });
})();

/* ─── Section title slide-up reveal ─────────────────────────────── */
document.querySelectorAll('.sec-title').forEach(title => {
  const wrap = document.createElement('div');
  wrap.style.overflow = 'hidden';
  title.parentNode.insertBefore(wrap, title);
  wrap.appendChild(title);
  gsap.from(title, {
    scrollTrigger: { trigger: wrap, start: 'top 88%', once: true },
    y: '110%', duration: 0.85, ease: 'power4.out'
  });
});

/* ─── Timeline spine draws on scroll ────────────────────────────── */
(function() {
  const spine = document.querySelector('.tl-spine');
  if (!spine) return;
  spine.style.height = '0';
  ScrollTrigger.create({
    trigger: '#experience',
    start: 'top 65%',
    end: 'bottom 65%',
    scrub: 1,
    onUpdate: self => { spine.style.height = (self.progress * 100) + '%'; }
  });
})();

/* ─── Magnetic slide titles ──────────────────────────────────────── */
document.querySelectorAll('.ph-title').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width/2) * 0.05, y: (e.clientY - r.top - r.height/2) * 0.05, duration: 0.35, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
});
