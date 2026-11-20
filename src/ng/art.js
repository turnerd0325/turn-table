/* ===================== SHARED ART KIT (src/ng/art.js + art.css) =====================
   One look for every game upgrade. No libraries. Everything here turns itself off under
   reduced motion (the OS setting): tweens jump to the end, counters show the final number,
   particles are skipped, and CSS animations stop.

   Art.ease.*                         easing curves (outCubic, outBack, outElastic, ...)
   Art.tween({from,to,dur,ease,step,done})       number tween; returns {cancel, done:Promise}
   Art.to(el, keyframe, {dur,ease})              animate an element to a CSS state (Web Animations)
   Art.count(el, to, {from,dur,decimals,fmt})    smooth number counter
   Art.burst(x, y, {n,colors,shape,...})         particle burst at a screen point (capped)
   Art.burstAt(el, opts) / Art.sparkle(el, opts) burst from an element / twinkles around it
   Art.pulse(el, color) / Art.glow(el, on, color) / Art.shake(el) / Art.pop(el) / Art.good(el) / Art.bad(el)
   Art.scene(el, kind)                CSS backdrop: sky, dusk, night, lab, sea, field, space
   Art.backdrop(kind, w, h)           same backdrops as SVG markup for game boards
   Art.sprite(name, opts)             full <svg> string;  Art.g(name, {x,y,size,...}) <g> for inside an SVG
   Art.node(name, opts)               the sprite as a DOM element
   Art.names                          every sprite name
   Art.drag({root, items, targets, accept, onDrop, ...})   drag-and-drop for mouse, touch and keyboard
   Art.defs()                         shared SVG filters: url(#art-drop) url(#art-drop-lg) url(#art-glow) url(#art-soft)
   Art.reduced()                      true when motion should be off;  Art.setReduced(true|false|null) to force

   Rules: keep particle counts modest (the pool is capped at 160), call these from inside
   functions (not at load time), and never depend on an animation finishing for game logic
   without a fallback: under reduced motion every animation finishes at once. */
const Art = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  let forced = null;
  const reduced = () => forced !== null ? forced : (mq.matches || !!window.__TT_REDUCED);
  const setReduced = v => { forced = v === null || v === undefined ? null : !!v; document.documentElement.classList.toggle('art-still', !!reduced()); };
  let seq = 0;
  const uid = p => (p || 'a') + (++seq).toString(36);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------------- easing + tweens ---------------- */
  const ease = {
    linear: t => t,
    inQuad: t => t * t,
    outQuad: t => 1 - (1 - t) * (1 - t),
    inOutQuad: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outElastic: t => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI) / 3) + 1,
    outBounce: t => { const n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; }
  };
  const CSS_EASE = { linear: 'linear', outQuad: 'cubic-bezier(.25,.46,.45,.94)', outCubic: 'cubic-bezier(.22,.61,.36,1)',
    inOutCubic: 'cubic-bezier(.65,0,.35,1)', inOutQuad: 'cubic-bezier(.45,0,.55,1)', inQuad: 'cubic-bezier(.55,.085,.68,.53)',
    outBack: 'cubic-bezier(.34,1.56,.64,1)' };

  function tween({ from = 0, to = 1, dur = 400, delay = 0, ease: e = 'outCubic', step, done } = {}) {
    const f = typeof e === 'function' ? e : (ease[e] || ease.outCubic);
    let raf = 0, cancelled = false, resolve;
    const p = new Promise(r => resolve = r);
    const finish = () => { step && step(to, 1); done && done(); resolve(true); };
    if (reduced() || dur <= 0) { finish(); return { cancel() {}, done: p }; }
    let t0 = 0;
    const tick = now => {
      if (cancelled) return;
      if (!t0) t0 = now + delay;
      const t = clamp((now - t0) / dur, 0, 1);
      if (now >= t0) step && step(lerp(from, to, f(t)), t);
      if (t < 1) raf = requestAnimationFrame(tick); else { done && done(); resolve(true); }
    };
    raf = requestAnimationFrame(tick);
    return { cancel() { cancelled = true; cancelAnimationFrame(raf); resolve(false); }, done: p };
  }

  /* animate an element to a CSS state, e.g. Art.to(el,{transform:'translate(40px,0) scale(1.1)',opacity:1}) */
  function to(el, kf, { dur = 300, delay = 0, ease: e = 'outCubic' } = {}) {
    if (!el) return Promise.resolve();
    const apply = () => Object.assign(el.style, kf);
    if (reduced() || !el.animate) { apply(); return Promise.resolve(); }
    const cs = getComputedStyle(el), start = {};
    Object.keys(kf).forEach(k => start[k] = cs[k]);
    const a = el.animate([start, kf], { duration: dur, delay, easing: CSS_EASE[e] || e, fill: 'forwards' });
    return a.finished.then(() => { apply(); a.cancel(); }).catch(() => {});
  }

  /* ---------------- number counter ---------------- */
  function count(el, target, { from, dur = 700, decimals = 0, fmt, ease: e = 'outCubic' } = {}) {
    if (!el) return { cancel() {}, done: Promise.resolve() };
    if (from === undefined) from = parseFloat(String(el.textContent).replace(/[^0-9.\-]/g, '')) || 0;
    const show = fmt || (v => decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString());
    if (el._artCount) el._artCount.cancel();
    const tw = tween({ from, to: target, dur, ease: e, step: v => { el.textContent = show(v); } });
    el._artCount = tw;
    if (!reduced() && target !== from) pop(el, 1.12);
    return tw;
  }

  /* ---------------- particles (one shared canvas, capped pool) ---------------- */
  const MAXP = 160;
  const P = [];
  let cv = null, cx = null, praf = 0, dpr = 1;
  const PALETTE = ['#ffd23f', '#ff7a59', '#3fd1a0', '#2f6bff', '#b07cff', '#ffffff'];
  function canvas() {
    if (cv && cv.isConnected) return cv;
    cv = document.createElement('canvas');
    cv.className = 'art-fx';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    cx = cv.getContext('2d');
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    return cv;
  }
  function sizeCanvas() {
    if (!cv) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
  }
  function star(c, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    c.closePath(); c.fill();
  }
  function loop(now) {
    praf = 0;
    if (!P.length) { cx && cx.clearRect(0, 0, cv.width, cv.height); return; }
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, cv.width, cv.height);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      const dt = Math.min(.05, (now - (p.last || now)) / 1000); p.last = now;
      p.age += dt;
      if (p.age >= p.life) { P.splice(i, 1); continue; }
      p.vx *= p.drag; p.vy = p.vy * p.drag + p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.spin * dt;
      const k = p.age / p.life, a = k < .15 ? k / .15 : 1 - (k - .15) / .85;
      cx.save(); cx.globalAlpha = clamp(a, 0, 1); cx.translate(p.x, p.y); cx.rotate(p.rot);
      cx.fillStyle = p.color;
      if (p.shape === 'star') star(cx, p.r);
      else if (p.shape === 'spark') { cx.fillRect(-p.r * 1.8, -p.r * .28, p.r * 3.6, p.r * .56); }
      else if (p.shape === 'confetti') { cx.fillRect(-p.r, -p.r * .55, p.r * 2, p.r * 1.1); }
      else if (p.shape === 'ring') { cx.strokeStyle = p.color; cx.lineWidth = 2; cx.beginPath(); cx.arc(0, 0, p.r * (1 + k * 2.5), 0, 7); cx.stroke(); }
      else { cx.beginPath(); cx.arc(0, 0, p.r * (1 - k * .4), 0, 7); cx.fill(); }
      cx.restore();
    }
    praf = requestAnimationFrame(loop);
  }
  function burst(x, y, { n = 22, colors = PALETTE, shape = 'dot', speed = 260, spread = Math.PI * 2, angle = -Math.PI / 2,
    gravity = 520, life = .9, size = 5, drag = .985 } = {}) {
    if (reduced()) return;
    canvas();
    n = Math.min(n, MAXP);
    while (P.length + n > MAXP) P.shift();
    for (let i = 0; i < n; i++) {
      const a = angle + (Math.random() - .5) * spread, v = speed * (.45 + Math.random() * .75);
      P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: gravity, drag, age: 0, life: life * (.7 + Math.random() * .6),
        r: size * (.6 + Math.random() * .8), color: colors[i % colors.length], shape: Array.isArray(shape) ? shape[i % shape.length] : shape,
        rot: Math.random() * 6.3, spin: (Math.random() - .5) * 10, last: 0 });
    }
    if (!praf) praf = requestAnimationFrame(loop);
  }
  const centre = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r]; };
  function burstAt(el, opts) { if (!el) return; const [x, y] = centre(el); burst(x, y, opts); }
  function sparkle(el, { n = 10, colors = ['#fff7c2', '#ffd23f', '#ffffff'] } = {}) {
    if (!el || reduced()) return;
    const [x, y, r] = centre(el);
    for (let i = 0; i < Math.min(n, 30); i++) {
      const px = x + (Math.random() - .5) * r.width * 1.1, py = y + (Math.random() - .5) * r.height * 1.1;
      burst(px, py, { n: 1, colors: [colors[i % colors.length]], shape: 'star', speed: 30, gravity: -20, life: .7 + Math.random() * .5, size: 4 + Math.random() * 4 });
    }
  }

  /* ---------------- glow, pulse, pop, shake ---------------- */
  function once(el, cls, ms) {
    if (!el || reduced()) return;
    el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls);
    clearTimeout(el['_t' + cls]); el['_t' + cls] = setTimeout(() => el.classList.remove(cls), ms);
  }
  function pulse(el, color) { if (!el) return; if (color) el.style.setProperty('--art-glow', color); once(el, 'art-pulse', 900); }
  function glow(el, on = true, color) { if (!el) return; if (color) el.style.setProperty('--art-glow', color); el.classList.toggle('art-glow', !!on); }
  function pop(el, s) { if (!el) return; if (s) el.style.setProperty('--art-pop', s); once(el, 'art-pop', 400); }
  function shake(el) { once(el, 'art-shake', 450); }
  function good(el) { if (!el) return; glow(el, false); pulse(el, '#3fd1a0'); burstAt(el, { n: 18, colors: ['#3fd1a0', '#b8f5dd', '#ffd23f', '#fff'], speed: 200, shape: ['star', 'dot'] }); }
  function bad(el) { if (!el) return; pulse(el, '#ff5a5f'); shake(el); }

  /* ---------------- scenes ---------------- */
  const SCENES = ['sky', 'dusk', 'night', 'lab', 'sea', 'field', 'space'];
  function scene(el, kind = 'sky') {
    if (!el) return el;
    SCENES.forEach(k => el.classList.remove('art-scene--' + k));
    el.classList.add('art-scene', 'art-scene--' + kind);
    return el;
  }
  /* SVG backdrop for game boards. Put it first inside the board's <svg>. */
  function backdrop(kind = 'sky', w = 800, h = 450) {
    const id = uid('bd'), r = Math.min(w, h) * .04;
    const stops = {
      sky: [['0', '#5fb4ff'], ['.65', '#bfe3ff'], ['1', '#eaf6ff']],
      dusk: [['0', '#2b3a7a'], ['.55', '#d9778a'], ['1', '#ffd59e']],
      night: [['0', '#070d26'], ['1', '#1d2a5a']],
      lab: [['0', '#e9eef8'], ['.78', '#d3dcec'], ['.78', '#9aa9c4'], ['1', '#7f8fac']],
      sea: [['0', '#7cc8ff'], ['.5', '#cdeeff'], ['.5', '#1e8ad1'], ['1', '#0b4f8a']],
      field: [['0', '#7cc4ff'], ['.62', '#dff2ff'], ['.62', '#6cc36a'], ['1', '#3f8f45']],
      space: [['0', '#05081a'], ['1', '#111a3d']]
    }[kind] || [['0', '#eef3fb'], ['1', '#dbe4f3']];
    let extra = '';
    if (kind === 'night' || kind === 'space') {
      let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      for (let i = 0; i < 46; i++) extra += `<circle cx="${(rnd() * w).toFixed(1)}" cy="${(rnd() * h * (kind === 'night' ? .7 : 1)).toFixed(1)}" r="${(rnd() * 1.3 + .3).toFixed(2)}" fill="#fff" opacity="${(rnd() * .6 + .3).toFixed(2)}"/>`;
      if (kind === 'space') extra += `<circle cx="${w * .78}" cy="${h * .25}" r="${h * .45}" fill="url(#${id}n)" opacity=".55"/><circle cx="${w * .15}" cy="${h * .85}" r="${h * .35}" fill="url(#${id}m)" opacity=".4"/>`;
    }
    if (kind === 'sky' || kind === 'field') extra += `<circle cx="${w * .86}" cy="${h * .16}" r="${h * .3}" fill="url(#${id}s)"/>`;
    if (kind === 'field') extra += `<path d="M0 ${h * .64} Q ${w * .25} ${h * .55} ${w * .5} ${h * .63} T ${w} ${h * .6} V ${h} H 0 Z" fill="#7fcf74" opacity=".7"/>`;
    if (kind === 'sea') extra += `<path d="M0 ${h * .5} q ${w / 16} -6 ${w / 8} 0 t ${w / 8} 0 t ${w / 8} 0 t ${w / 8} 0 t ${w / 8} 0 t ${w / 8} 0 t ${w / 8} 0 t ${w / 8} 0 V ${h * .53} H 0Z" fill="#fff" opacity=".35"/>`;
    return `<g class="art-backdrop"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>
<radialGradient id="${id}s"><stop offset="0" stop-color="#fffbe0" stop-opacity=".95"/><stop offset=".25" stop-color="#fff2a8" stop-opacity=".55"/><stop offset="1" stop-color="#fff2a8" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}n"><stop offset="0" stop-color="#7a4dff" stop-opacity=".8"/><stop offset="1" stop-color="#7a4dff" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}m"><stop offset="0" stop-color="#2fc0ff" stop-opacity=".7"/><stop offset="1" stop-color="#2fc0ff" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}v" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>
<rect width="${w}" height="${h}" rx="${r}" fill="url(#${id})"/>${extra}<rect width="${w}" height="${h}" rx="${r}" fill="url(#${id}v)"/></g>`;
  }

  /* ---------------- shared SVG filters ---------------- */
  function defs() {
    if (document.getElementById('art-defs')) return;
    const d = document.createElementNS(NS, 'svg');
    d.id = 'art-defs'; d.setAttribute('aria-hidden', 'true'); d.setAttribute('focusable', 'false');
    d.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    d.innerHTML = `<defs>
<filter id="art-drop" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#0b1430" flood-opacity=".28"/></filter>
<filter id="art-drop-lg" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0b1430" flood-opacity=".3"/></filter>
<filter id="art-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="art-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
</defs>`;
    (document.body || document.documentElement).appendChild(d);
  }

  /* ---------------- sprite library (all drawn in a 100 x 100 box) ---------------- */
  const shade = (hex, amt) => { /* lighten (+) or darken (-) a #rrggbb colour */
    const n = parseInt(hex.slice(1), 16), f = c => clamp(Math.round(c + (amt > 0 ? (255 - c) * amt : c * amt)), 0, 255);
    return '#' + [n >> 16, n >> 8 & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join('');
  };
  const lin = (id, a, b, x2 = 0, y2 = 1, extra = '') => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}" ${extra}><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const rad = (id, stops, cx = .5, cy = .5, r = .5, fx, fy) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${fx !== undefined ? ` fx="${fx}" fy="${fy}"` : ''}>${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
  const GLASS = u => `<linearGradient id="${u}gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".22" stop-color="#e8f4ff" stop-opacity=".22"/><stop offset=".7" stop-color="#cfe6ff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient>`;

  const S = {
    testtube(u, o) {
      const c = o.color || '#3fb6ff', lvl = clamp(o.level === undefined ? .55 : o.level, 0, 1), top = 84 - lvl * 64;
      return `<defs>${GLASS(u)}${lin(u + 'l', shade(c, .35), shade(c, -.25), 1, 0)}<clipPath id="${u}c"><path d="M39 14h22v60a11 11 0 0 1-22 0z"/></clipPath></defs>
<ellipse cx="50" cy="92" rx="16" ry="3" fill="#0b1430" opacity=".18"/>
<g clip-path="url(#${u}c)"><rect x="36" y="${top}" width="28" height="80" fill="url(#${u}l)"/><ellipse cx="50" cy="${top}" rx="11" ry="2.2" fill="${shade(c, .55)}"/>
${lvl > .1 ? `<circle cx="46" cy="${top + 16}" r="1.8" fill="#fff" opacity=".7"/><circle cx="53" cy="${top + 26}" r="1.3" fill="#fff" opacity=".6"/><circle cx="48" cy="${top + 34}" r="1" fill="#fff" opacity=".55"/>` : ''}</g>
<path d="M39 14h22v60a11 11 0 0 1-22 0z" fill="url(#${u}gl)" stroke="#9db8d8" stroke-width="1.6"/>
<rect x="35" y="9" width="30" height="6.5" rx="3.2" fill="#f4f9ff" stroke="#9db8d8" stroke-width="1.6"/>
<path d="M43 20v52" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".75"/>`;
    },
    beaker(u, o) {
      const c = o.color || '#3fd1a0', lvl = clamp(o.level === undefined ? .5 : o.level, 0, 1), top = 84 - lvl * 56;
      const body = 'M27 22h46v56a8 8 0 0 1-8 8H35a8 8 0 0 1-8-8z';
      return `<defs>${GLASS(u)}${lin(u + 'l', shade(c, .3), shade(c, -.3))}<clipPath id="${u}c"><path d="${body}"/></clipPath></defs>
<ellipse cx="50" cy="90" rx="30" ry="3.5" fill="#0b1430" opacity=".18"/>
<g clip-path="url(#${u}c)"><rect x="20" y="${top}" width="60" height="70" fill="url(#${u}l)"/><ellipse cx="50" cy="${top}" rx="23" ry="2.6" fill="${shade(c, .5)}"/>
<circle cx="40" cy="${top + 18}" r="2" fill="#fff" opacity=".6"/><circle cx="60" cy="${top + 10}" r="1.4" fill="#fff" opacity=".5"/></g>
<path d="${body}" fill="url(#${u}gl)" stroke="#9db8d8" stroke-width="1.8"/>
<path d="M23 20h50c2 0 2 3 0 3H27l-4.5-1.5z" fill="#f4f9ff" stroke="#9db8d8" stroke-width="1.6" stroke-linejoin="round"/>
<g stroke="#7f9cc0" stroke-width="1.4" stroke-linecap="round" opacity=".8"><path d="M60 36h9M63 46h6M60 56h9M63 66h6"/></g>
<path d="M33 28v48" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    },
    flame(u) {
      return `<defs>${rad(u + 'h', [[0, '#ffb347', .55], [1, '#ffb347', 0]], .5, .62, .5)}${rad(u + 'o', [[0, '#ffe066'], [.45, '#ff9a2e'], [1, '#e8401c']], .5, .78, .75)}${rad(u + 'i', [[0, '#ffffff'], [.4, '#fff3a3'], [1, '#ffc93c']], .5, .8, .7)}${rad(u + 'b', [[0, '#bfe6ff'], [1, '#3d7bff', .2]], .5, .5, .5)}</defs>
<circle cx="50" cy="60" r="44" fill="url(#${u}h)"/>
<path d="M50 6C60 24 77 38 75 61c-1.6 17-12 29-25 29S26.6 78 25 61c-1.4-15 9-24 14-38 2 10 5 15 9 18 3-10 3-22 2-35z" fill="url(#${u}o)"/>
<path d="M50 38c7 10 14 19 13 33-.6 10-6 16-13 16s-12.4-6-13-16c-.8-11 7-17 9-27 1.5 4 3 6 4 6 1-4 1-8 0-12z" fill="url(#${u}i)"/>
<ellipse cx="50" cy="82" rx="7" ry="5" fill="url(#${u}b)"/>`;
    },
    magnifier(u) {
      return `<defs>${lin(u + 'm', '#e9eef6', '#7d8aa3', 1, 1)}${rad(u + 'g', [[0, '#eaf6ff', .55], [.8, '#9fd0ff', .25], [1, '#6fa8e8', .45]], .4, .38, .62)}${lin(u + 'h', '#6b4a2f', '#3a2716', 1, 1)}</defs>
<path d="M59 61l24 24" stroke="url(#${u}h)" stroke-width="11" stroke-linecap="round"/>
<path d="M59 61l8 8" stroke="#a6b1c4" stroke-width="12" stroke-linecap="round"/>
<circle cx="42" cy="42" r="25" fill="url(#${u}g)"/>
<circle cx="42" cy="42" r="25" fill="none" stroke="url(#${u}m)" stroke-width="7"/>
<circle cx="42" cy="42" r="28.5" fill="none" stroke="#5c6880" stroke-width="1" opacity=".5"/>
<path d="M28 34a16 16 0 0 1 14-10" stroke="#fff" stroke-width="3.6" stroke-linecap="round" fill="none" opacity=".85"/>`;
    },
    thermometer(u, o) {
      const lvl = clamp(o.level === undefined ? .6 : o.level, 0, 1), top = 70 - lvl * 56, c = o.color || '#ff4b4b';
      return `<defs>${GLASS(u)}${lin(u + 'r', shade(c, .25), shade(c, -.2), 1, 0)}${rad(u + 'b', [[0, shade(c, .6)], [.5, c], [1, shade(c, -.35)]], .4, .35, .65)}</defs>
<rect x="42" y="8" width="16" height="70" rx="8" fill="url(#${u}gl)" stroke="#9db8d8" stroke-width="1.6"/>
<rect x="46.5" y="${top}" width="7" height="${78 - top}" rx="3.5" fill="url(#${u}r)"/>
<circle cx="50" cy="80" r="13" fill="url(#${u}b)" stroke="${shade(c, -.4)}" stroke-width="1.2"/>
<circle cx="45.5" cy="75.5" r="3.4" fill="#fff" opacity=".65"/>
<g stroke="#5f6f8f" stroke-width="1.4" stroke-linecap="round"><path d="M60 18h6M60 28h4M60 38h6M60 48h4M60 58h6"/></g>
<path d="M45.5 13v56" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
    },
    sun(u) {
      let rays = '';
      for (let i = 0; i < 12; i++) rays += `<path d="M50 4l4.6 15h-9.2z" transform="rotate(${i * 30} 50 50)"/>`;
      return `<defs>${rad(u + 'h', [[0, '#fff6c4', .9], [.45, '#ffd84a', .35], [1, '#ffb703', 0]])}${rad(u + 'c', [[0, '#fffbe6'], [.35, '#ffe45c'], [.8, '#ffb703'], [1, '#f48c06']], .42, .38, .62)}${lin(u + 'r', '#ffe066', '#ff9f1c')}</defs>
<circle cx="50" cy="50" r="48" fill="url(#${u}h)"/>
<g fill="url(#${u}r)">${rays}</g>
<circle cx="50" cy="50" r="25" fill="url(#${u}c)"/>
<ellipse cx="42" cy="40" rx="8" ry="5" fill="#fff" opacity=".45" transform="rotate(-30 42 40)"/>`;
    },
    cloud(u, o) {
      const top = o.dark ? '#c3cad8' : '#ffffff', bot = o.dark ? '#7d879c' : '#d6e1f0';
      return `<defs><linearGradient id="${u}" x1="0" y1="26" x2="0" y2="76" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>
<ellipse cx="51" cy="78" rx="30" ry="3.5" fill="#0b1430" opacity=".1"/>
<g fill="url(#${u})"><circle cx="33" cy="56" r="15"/><circle cx="52" cy="45" r="21"/><circle cx="70" cy="56" r="15"/><rect x="18" y="52" width="66" height="22" rx="11"/></g>
<path d="M36 44a15 15 0 0 1 11-9" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity="${o.dark ? .35 : .9}"/>`;
    },
    rain(u) {
      let drops = '';
      [[30, 82], [46, 88], [62, 82], [38, 96], [56, 96], [72, 92]].forEach(([x, y], i) => drops += `<path d="M${x} ${y - 9}c3 4 4.6 6.4 4.6 8.6a4.6 4.6 0 0 1-9.2 0c0-2.2 1.6-4.6 4.6-8.6z" fill="url(#${u}d)" opacity="${i > 2 ? .75 : 1}"/>`);
      return `<defs>${lin(u + 'd', '#9fdcff', '#2f7bd8')}</defs><g transform="translate(0 -12)">${S.cloud(u + 'c', { dark: true })}</g>${drops}`;
    },
    snow(u) {
      let f = '';
      [[30, 80, 6], [50, 88, 7], [70, 80, 6], [40, 96, 4.5], [62, 96, 4.5]].forEach(([x, y, r]) => {
        let arms = ''; for (let i = 0; i < 3; i++) arms += `<path d="M${x - r} ${y}h${2 * r}" transform="rotate(${i * 60} ${x} ${y})"/>`;
        f += `<g stroke="#fff" stroke-width="2.2" stroke-linecap="round">${arms}</g><g stroke="#8fb8e8" stroke-width=".8" stroke-linecap="round" opacity=".8">${arms}</g>`;
      });
      return `<g transform="translate(0 -12)">${S.cloud(u + 'c', { dark: true })}</g>${f}`;
    },
    bird(u, o) {
      const c = o.color || '#2f6bff';
      return `<defs>${lin(u + 'b', shade(c, .35), shade(c, -.25))}${lin(u + 'w', shade(c, -.1), shade(c, -.45))}${rad(u + 'e', [[0, '#fff3d6'], [1, '#ffd08a']], .5, .4, .6)}</defs>
<ellipse cx="50" cy="88" rx="22" ry="3" fill="#0b1430" opacity=".14"/>
<path d="M22 58l-14-6 6 12-8 6 18-2z" fill="${shade(c, -.35)}"/>
<ellipse cx="46" cy="58" rx="26" ry="19" fill="url(#${u}b)"/>
<path d="M30 64c8 10 26 12 38 4-10 1-26-1-38-4z" fill="url(#${u}e)" opacity=".95"/>
<circle cx="68" cy="40" r="14" fill="url(#${u}b)"/>
<path d="M80 38l13 4-13 5z" fill="#ffb703" stroke="#c77700" stroke-width="1" stroke-linejoin="round"/>
<path d="M28 52c8-10 24-12 34-2-6 8-22 12-34 2z" fill="url(#${u}w)"/>
<path d="M34 54c6-4 14-5 20-2M36 58c6-3 12-3 17-1" stroke="${shade(c, .45)}" stroke-width="1.2" fill="none" opacity=".6"/>
<circle cx="72" cy="37" r="3.6" fill="#141a2e"/><circle cx="73.2" cy="35.8" r="1.2" fill="#fff"/>
<path d="M44 76l-3 9M52 76l2 9" stroke="#c77700" stroke-width="2" stroke-linecap="round"/>`;
    },
    moth(u, o) {
      const dark = o.tone === 'dark', base = o.color || (dark ? '#3a3a40' : '#e7dfcc'), spot = dark ? '#1c1c20' : '#6e665a';
      let sp = ''; let s = 11; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1, x = 50 + side * (8 + rnd() * 30), y = 26 + rnd() * 46; sp += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rnd() * 1.4 + .5).toFixed(2)}"/>`; }
      const fw = 'M50 40C40 22 18 14 8 22c-4 10 6 26 22 30 8 2 16-2 20-6z';
      const hw = 'M50 50C42 54 26 60 22 72c-1 8 10 10 18 4 6-5 9-14 10-22z';
      return `<defs>${lin(u + 'f', shade(base, .25), shade(base, -.22), 1, 1)}${lin(u + 'h', shade(base, .12), shade(base, -.3), 1, 1)}${lin(u + 'b', shade(base, -.1), shade(base, -.5))}</defs>
<ellipse cx="50" cy="86" rx="26" ry="3" fill="#0b1430" opacity=".15"/>
<g><path d="${hw}" fill="url(#${u}h)"/><path d="${fw}" fill="url(#${u}f)"/></g>
<g transform="matrix(-1 0 0 1 100 0)"><path d="${hw}" fill="url(#${u}h)"/><path d="${fw}" fill="url(#${u}f)"/></g>
<g fill="${spot}" opacity=".7">${sp}</g>
<g stroke="${shade(base, -.4)}" stroke-width=".8" fill="none" opacity=".55"><path d="M46 38C36 30 24 25 14 24M45 42C35 40 24 38 16 40M48 52c-6 6-12 12-18 18"/><path d="M54 38c10-8 22-13 32-14M55 42c10-2 21-4 29-2M52 52c6 6 12 12 18 18"/></g>
<circle cx="28" cy="34" r="4" fill="${shade(base, -.35)}" opacity=".55"/><circle cx="72" cy="34" r="4" fill="${shade(base, -.35)}" opacity=".55"/>
<ellipse cx="50" cy="50" rx="5" ry="20" fill="url(#${u}b)"/>
<g stroke="${shade(base, -.25)}" stroke-width=".9" opacity=".7"><path d="M45.5 46h9M45.2 52h9.6M45.6 58h8.8"/></g>
<path d="M48 32C44 22 38 16 32 14M52 32c4-10 10-16 16-18" stroke="${shade(base, -.5)}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    },
    fish(u, o) {
      const c = o.color || '#ff8a3d';
      return `<defs>${lin(u + 'b', shade(c, -.2), shade(c, .55))}${lin(u + 't', shade(c, -.1), shade(c, -.45), 1, 0)}<clipPath id="${u}c"><path d="M14 50C24 30 52 24 72 34c6 3 10 8 12 16-2 8-6 13-12 16-20 10-48 4-58-16z"/></clipPath></defs>
<ellipse cx="50" cy="86" rx="30" ry="3" fill="#0b1430" opacity=".12"/>
<path d="M18 50L2 32c-2 6-2 30 0 36z" fill="url(#${u}t)"/>
<path d="M44 30c4-10 14-14 24-12-4 6-8 12-10 16z" fill="${shade(c, -.25)}"/>
<path d="M14 50C24 30 52 24 72 34c6 3 10 8 12 16-2 8-6 13-12 16-20 10-48 4-58-16z" fill="url(#${u}b)"/>
<g clip-path="url(#${u}c)" stroke="${shade(c, -.35)}" stroke-width=".9" fill="none" opacity=".35">
${[30, 40, 50, 60].map(x => [38, 48, 58].map(y => `<path d="M${x} ${y - 4}a5 5 0 0 1 0 8"/>`).join('')).join('')}</g>
<path d="M64 38c-3 8-3 16 0 24" stroke="${shade(c, -.4)}" stroke-width="1.6" fill="none" opacity=".55"/>
<path d="M44 58c4 6 10 10 16 10-4-4-6-8-6-12z" fill="${shade(c, -.2)}" opacity=".85"/>
<circle cx="74" cy="44" r="5" fill="#fff"/><circle cx="75" cy="44" r="3" fill="#141a2e"/><circle cx="76" cy="42.8" r="1" fill="#fff"/>
<path d="M30 38c10-6 24-8 36-4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".45"/>`;
    },
    plant(u, o) {
      const c = o.color || '#3fae57';
      const leaf = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0C6-10 22-14 30-10 24 0 12 6 0 0z" fill="url(#${u}l)"/><path d="M1 -1C10 -6 20 -9 28 -10" stroke="${shade(c, .45)}" stroke-width="1.1" fill="none" opacity=".8"/></g>`;
      return `<defs>${lin(u + 'l', shade(c, .3), shade(c, -.3), 1, 1)}${lin(u + 'p', '#e58b5a', '#a64d24')}${lin(u + 'r', '#f2a274', '#c0602f')}</defs>
<ellipse cx="50" cy="94" rx="22" ry="3" fill="#0b1430" opacity=".18"/>
<path d="M50 70C50 52 48 38 52 18" stroke="${shade(c, -.25)}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
${leaf(50, 58, 200, 1)}${leaf(50, 50, -20, .95)}${leaf(51, 38, 205, .85)}${leaf(51, 30, -30, .8)}${leaf(52, 20, 240, .6)}
<path d="M30 72h40l-5 21H35z" fill="url(#${u}p)"/>
<rect x="27" y="68" width="46" height="9" rx="3" fill="url(#${u}r)"/>
<path d="M34 78l2 12" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".3"/>`;
    },
    rock(u, o) {
      const L = o.layers || ['#e3c48a', '#b0846a', '#d9d2c3', '#8f8a86', '#c9a26b'];
      const n = L.length, h = 64 / n;
      let bands = '', grain = '', s = 3; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      L.forEach((c, i) => {
        const y = 26 + i * h, w1 = (rnd() - .5) * 4, w2 = (rnd() - .5) * 4;
        bands += `<path d="M10 ${y + w1}Q30 ${y - 2} 50 ${y + w2}T90 ${y}V${y + h + 1}H10z" fill="${c}"/><path d="M10 ${y + w1}Q30 ${y - 2} 50 ${y + w2}T90 ${y}" stroke="${shade(c, -.3)}" stroke-width=".9" fill="none" opacity=".6"/>`;
        for (let k = 0; k < 9; k++) grain += `<circle cx="${(12 + rnd() * 76).toFixed(1)}" cy="${(y + 2 + rnd() * (h - 3)).toFixed(1)}" r="${(rnd() * .9 + .3).toFixed(2)}" fill="${shade(c, rnd() > .5 ? -.4 : .4)}" opacity=".7"/>`;
      });
      return `<defs><clipPath id="${u}c"><path d="M10 26L22 12h68v64l-0 0V90H10z"/></clipPath>${lin(u + 's', '#000', '#000', 1, 0)}
<linearGradient id="${u}v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>
<ellipse cx="50" cy="93" rx="42" ry="3" fill="#0b1430" opacity=".16"/>
<path d="M10 26L22 14h68L90 26z" fill="${shade(L[0], .3)}"/><path d="M22 14h68l-0 0" stroke="${shade(L[0], -.2)}" stroke-width=".8"/>
<g>${bands}${grain}</g><rect x="10" y="26" width="80" height="64" fill="url(#${u}v)"/>
<path d="M10 26h80v64H10z" fill="none" stroke="#5b4636" stroke-width="1.2" opacity=".5"/>`;
    },
    planet(u, o) {
      const k = o.kind || 'earth';
      const shadeOverlay = `${rad(u + 's', [[0, '#000', 0], [.55, '#000', .05], [1, '#000', .62]], .36, .32, .78)}${rad(u + 'hl', [[0, '#fff', .55], [1, '#fff', 0]], .32, .28, .35)}`;
      const ball = (fill, extra = '') => `<circle cx="50" cy="50" r="34" fill="${fill}"/><g clip-path="url(#${u}c)">${extra}</g><circle cx="50" cy="50" r="34" fill="url(#${u}s)"/><circle cx="50" cy="50" r="34" fill="url(#${u}hl)"/>`;
      const clip = `<clipPath id="${u}c"><circle cx="50" cy="50" r="34"/></clipPath>`;
      if (k === 'earth') return `<defs>${clip}${shadeOverlay}${rad(u + 'o', [[0, '#5bc0ff'], [1, '#1856b8']], .4, .4, .7)}${rad(u + 'a', [[.82, '#7fd4ff', 0], [.94, '#7fd4ff', .55], [1, '#7fd4ff', 0]])}</defs>
<circle cx="50" cy="50" r="41" fill="url(#${u}a)"/>${ball(`url(#${u}o)`, `<g fill="#3fae57"><path d="M24 30c8-6 18-4 20 4s-6 10-4 18-10 8-14 0-10-16-2-22z"/><path d="M56 22c10 0 18 6 16 12s-10 4-12 10 6 10 2 16-14 2-14-8 0-30 8-30z"/><path d="M40 70c6-2 14 0 14 6s-10 8-14 4z"/></g><g fill="#2f8a44" opacity=".6"><path d="M30 40c4-2 8 0 8 4s-6 4-8-4z"/><path d="M62 30c3 0 6 2 5 5s-5 1-5-5z"/></g><g fill="#fff" opacity=".75"><path d="M14 46c10-4 22-2 30 2-10 0-20 0-30-2z"/><path d="M48 58c12-4 26-2 36 2-12 0-24 0-36-2z"/><path d="M30 20c8-3 16-2 22 1-8 0-14 0-22-1z"/></g>`)}`;
      if (k === 'moon') return `<defs>${clip}${shadeOverlay}${rad(u + 'm', [[0, '#f1efe9'], [1, '#a9a69e']], .4, .4, .7)}${rad(u + 'k', [[0, '#8d8a83'], [1, '#c2bfb7']], .4, .4, .7)}</defs>${ball(`url(#${u}m)`, [[38, 36, 7], [60, 30, 4], [62, 58, 9], [40, 64, 5], [28, 50, 3.5], [52, 46, 2.6], [70, 44, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}k)"/><path d="M${x - r * .8} ${y - r * .3}a${r} ${r} 0 0 1 ${r * 1.4}-${r * .5}" stroke="#fff" stroke-width=".8" fill="none" opacity=".5"/>`).join(''))}`;
      if (k === 'mars') return `<defs>${clip}${shadeOverlay}${rad(u + 'm', [[0, '#f08a54'], [1, '#a5381a']], .4, .4, .7)}</defs>${ball(`url(#${u}m)`, `<g fill="#7a2a14" opacity=".45"><path d="M20 42c10-4 20 0 26 6s-6 10-14 6-16-6-12-12z"/><path d="M54 60c8-2 18 2 20 8s-12 6-18 2-6-8-2-10z"/><path d="M58 26c6 0 10 4 8 6s-8 2-10-2z"/></g><ellipse cx="50" cy="18" rx="10" ry="3.2" fill="#fff" opacity=".85"/>`)}`;
      if (k === 'jupiter' || k === 'saturn') {
        const cols = k === 'jupiter' ? ['#f2dcb8', '#c98b5a', '#efd2a6', '#b4703f', '#ecd6b0', '#c78f63', '#f3e2c4'] : ['#f6e7c1', '#e0c48c', '#f2dfb0', '#d3b27a', '#f6e7c1', '#dcc08a', '#f2e3bd'];
        const bands = cols.map((c, i) => `<rect x="10" y="${16 + i * 10}" width="80" height="10.5" fill="${c}"/>`).join('') + (k === 'jupiter' ? '<ellipse cx="62" cy="60" rx="7" ry="4" fill="#c4502e" opacity=".85"/>' : '');
        const ring = (front) => `<path d="${front ? 'M8 54a42 11 0 0 0 84 0' : 'M8 54a42 11 0 0 1 84 0'}" fill="none" stroke="url(#${u}r)" stroke-width="5" opacity="${front ? 1 : .8}"/>`;
        return `<defs>${clip}${shadeOverlay}${lin(u + 'r', '#cdb68a', '#f6e8c8', 1, 0)}</defs><g transform="rotate(-14 50 50)">${k === 'saturn' ? ring(false) : ''}${ball('#e8cfa2', bands)}${k === 'saturn' ? ring(true) : ''}</g>`;
      }
      return `<defs>${clip}${shadeOverlay}</defs>${ball(o.color || '#8aa0c8')}`;
    }
  };
  /* the rock-layer sprite under the name the spec uses */
  const names = Object.keys(S);
  S.rocklayers = S.rock;

  function inner(name, opts = {}) {
    const f = S[name];
    if (!f) throw new Error('Art: no sprite called ' + name + '. Try: ' + names.join(', '));
    defs();
    const body = f(uid('s'), opts);
    return opts.shadow === false ? body : `<g filter="url(#art-drop)">${body}</g>`;
  }
  /* full <svg>, e.g. el.innerHTML = Art.sprite('beaker',{size:64,color:'#ff6b6b',level:.7}) */
  function sprite(name, opts = {}) {
    const s = opts.size || 64, label = opts.label;
    return `<svg class="art-sprite${opts.cls ? ' ' + opts.cls : ''}" viewBox="0 0 100 100" width="${s}" height="${s}" ${label ? `role="img" aria-label="${String(label).replace(/"/g, '&quot;')}"` : 'aria-hidden="true"'}>${inner(name, opts)}</svg>`;
  }
  /* <g> for inside a game's SVG: x,y = top-left, size = width in SVG units */
  function g(name, opts = {}) {
    const s = (opts.size || 100) / 100, x = opts.x || 0, y = opts.y || 0, r = opts.rot ? ` rotate(${opts.rot} 50 50)` : '';
    return `<g class="art-g${opts.cls ? ' ' + opts.cls : ''}" transform="translate(${x} ${y}) scale(${s})${r}">${inner(name, opts)}</g>`;
  }
  function node(name, opts) {
    const t = document.createElement('template');
    t.innerHTML = sprite(name, opts);
    return t.content.firstElementChild;
  }

  /* ---------------- drag and drop: mouse, touch and keyboard ----------------
     Art.drag({
       root: element that holds the pieces (events are delegated, so re-rendering is fine),
       items: CSS selector for things you can pick up,
       targets: CSS selector for places you can drop,
       accept(item, target) -> true/false     (valid targets glow, invalid drops bounce back),
       onDrop(item, target)                   (called after the snap animation),
       onPick(item), onCancel(item),
       ghost: true   (drag a copy; the original stays until onDrop decides) ,
       label: item => 'name read out to screen readers'
     })
     Mouse/touch: drag it, or tap a piece then tap a target. Keyboard: Tab to a piece, Enter or
     Space to pick it up, arrow keys (or Tab) to move between valid targets, Enter to drop, Esc to cancel. */
  function drag(cfg) {
    const root = cfg.root || document;
    const accept = cfg.accept || (() => true);
    const say = live();
    let st = null;   /* {item, ghost, x0,y0, ox,oy, moved, mode:'pointer'|'tap'|'key', hot, keyI} */
    const items = () => [...root.querySelectorAll(cfg.items)];
    const targets = () => [...root.querySelectorAll(cfg.targets)];
    const name = it => (cfg.label ? cfg.label(it) : (it.getAttribute('aria-label') || it.textContent || 'piece').trim());
    const prep = () => items().forEach(it => {
      it.classList.add('art-draggable');
      if (!it.hasAttribute('tabindex')) it.tabIndex = 0;
      if (!it.getAttribute('role')) it.setAttribute('role', 'button');
    });
    prep();
    const mo = window.MutationObserver ? new MutationObserver(prep) : null;
    if (mo && root !== document) mo.observe(root, { childList: true, subtree: true });

    function mark(on) {
      targets().forEach(t => {
        t.classList.remove('art-drop-ok', 'art-drop-no', 'art-drop-hot');
        if (on) t.classList.add(accept(st.item, t) ? 'art-drop-ok' : 'art-drop-no');
      });
    }
    function setHot(t) {
      if (st.hot === t) return;
      if (st.hot) st.hot.classList.remove('art-drop-hot');
      st.hot = t; if (t) t.classList.add('art-drop-hot');
    }
    function pick(item, mode, e) {
      st = { item, mode, hot: null, keyI: -1 };
      item.classList.add('art-picked'); item.setAttribute('aria-pressed', 'true');
      mark(true);
      cfg.onPick && cfg.onPick(item);
      if (mode === 'key') say(`Picked up ${name(item)}. Use the arrow keys to choose a spot, Enter to drop, Escape to cancel.`);
    }
    function clear() {
      if (!st) return;
      mark(false);
      st.item.classList.remove('art-picked', 'art-dragging'); st.item.removeAttribute('aria-pressed');
      if (st.hot) st.hot.classList.remove('art-drop-hot');
      st = null;
    }
    function makeGhost(item, x, y) {
      const r = item.getBoundingClientRect(), gh = item.cloneNode(true);
      gh.classList.add('art-ghost'); gh.classList.remove('art-picked');
      gh.removeAttribute('id'); gh.setAttribute('aria-hidden', 'true');
      Object.assign(gh.style, { width: r.width + 'px', height: r.height + 'px', left: r.left + 'px', top: r.top + 'px' });
      document.body.appendChild(gh);
      st.ghost = gh; st.ox = x - r.left; st.oy = y - r.top; st.home = r;
      item.classList.add('art-dragging');
    }
    function moveGhost(x, y) { if (st.ghost) st.ghost.style.transform = `translate(${x - st.ox - st.home.left}px,${y - st.oy - st.home.top}px) rotate(-3deg) scale(1.06)`; }
    async function drop(t) {
      const s = st;
      if (!t || !accept(s.item, t)) {   /* bounce back */
        if (s.ghost) { await to(s.ghost, { transform: 'translate(0px,0px) rotate(0deg) scale(1)' }, { dur: 260, ease: 'outBack' }); s.ghost.remove(); }
        if (t) bad(t);
        if (s.mode === 'key') say(t ? `${name(s.item)} can't go there.` : 'Cancelled.');
        cfg.onCancel && cfg.onCancel(s.item, t);
        if (s.mode === 'key' && t) return;   /* stay picked up, try another spot */
        clear(); return;
      }
      if (s.ghost) {
        const r = t.getBoundingClientRect();
        const dx = r.left + r.width / 2 - (s.home.left + s.home.width / 2), dy = r.top + r.height / 2 - (s.home.top + s.home.height / 2);
        await to(s.ghost, { transform: `translate(${dx}px,${dy}px) rotate(0deg) scale(1)` }, { dur: 160, ease: 'outBack' });
        s.ghost.remove();
      }
      clear();
      pop(t, 1.08);
      if (s.mode === 'key') say(`Dropped ${name(s.item)}.`);
      cfg.onDrop && cfg.onDrop(s.item, t);
    }
    const under = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest ? el.closest(cfg.targets) : null; };
    const within = el => el && (root === document || root.contains(el));

    function down(e) {
      if ((e.button || 0) > 0) return;
      const it = e.target.closest && e.target.closest(cfg.items);
      if (!within(it)) {
        /* tap-to-place: a piece is waiting and they tapped a target */
        const t = e.target.closest && e.target.closest(cfg.targets);
        if (st && st.mode === 'tap' && within(t)) { e.preventDefault(); drop(t); }
        return;
      }
      if (st && st.mode === 'tap' && st.item === it) { clear(); return; }
      if (st) clear();
      e.preventDefault();
      pick(it, 'pointer', e);
      st.x0 = e.clientX; st.y0 = e.clientY; st.pid = e.pointerId; st.moved = false;
      try { it.setPointerCapture(e.pointerId); } catch (_) {}
    }
    function move(e) {
      if (!st || st.mode !== 'pointer' || e.pointerId !== st.pid) return;
      if (!st.moved && Math.hypot(e.clientX - st.x0, e.clientY - st.y0) < 5) return;
      if (!st.moved) { st.moved = true; makeGhost(st.item, st.x0, st.y0); }
      moveGhost(e.clientX, e.clientY);
      const t = under(e.clientX, e.clientY);
      setHot(within(t) && accept(st.item, t) ? t : null);
    }
    function up(e) {
      if (!st || st.mode !== 'pointer' || e.pointerId !== st.pid) return;
      try { st.item.releasePointerCapture(e.pointerId); } catch (_) {}
      if (!st.moved) { st.mode = 'tap'; return; }   /* a tap: now tap a target */
      const t = under(e.clientX, e.clientY);
      drop(within(t) ? t : null);
    }
    function key(e) {
      const it = e.target.closest && e.target.closest(cfg.items);
      if (!st) {
        if (within(it) && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(it, 'key'); }
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); const was = st.item; drop(null); was.focus && was.focus(); return; }
      const ok = targets().filter(t => accept(st.item, t));
      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Tab'].includes(e.key) && st.mode === 'key') {
        if (!ok.length) return;
        e.preventDefault();
        const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey);
        st.keyI = (st.keyI + (back ? -1 : 1) + ok.length) % ok.length;
        setHot(ok[st.keyI]);
        ok[st.keyI].scrollIntoView && ok[st.keyI].scrollIntoView({ block: 'nearest' });
        say((ok[st.keyI].getAttribute('aria-label') || 'Spot ' + (st.keyI + 1)));
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && st.mode === 'key') {
        e.preventDefault();
        const it2 = st.item; drop(st.hot);
        if (!st && it2.isConnected && it2.focus) it2.focus();
      }
    }
    const opt = { passive: false };
    const host = root === document ? document : root;
    host.addEventListener('pointerdown', down, opt);
    window.addEventListener('pointermove', move, opt);
    window.addEventListener('pointerup', up, opt);
    window.addEventListener('pointercancel', up, opt);
    host.addEventListener('keydown', key);
    return {
      cancel: clear,
      refresh: prep,
      destroy() {
        clear(); mo && mo.disconnect();
        host.removeEventListener('pointerdown', down, opt);
        window.removeEventListener('pointermove', move, opt);
        window.removeEventListener('pointerup', up, opt);
        window.removeEventListener('pointercancel', up, opt);
        host.removeEventListener('keydown', key);
      }
    };
  }
  let liveEl = null;
  function live() {
    return msg => {
      if (!liveEl || !liveEl.isConnected) {
        liveEl = document.createElement('div');
        liveEl.className = 'art-sr'; liveEl.setAttribute('role', 'status'); liveEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveEl);
      }
      liveEl.textContent = ''; setTimeout(() => { liveEl.textContent = msg; }, 30);
    };
  }

  if (mq.addEventListener) mq.addEventListener('change', () => setReduced(forced));
  if (document.documentElement) document.documentElement.classList.toggle('art-still', !!reduced());

  return { ease, tween, to, count, burst, burstAt, sparkle, pulse, glow, pop, shake, good, bad,
    scene, backdrop, defs, sprite, g, node, names, drag, reduced, setReduced, shade, uid, SCENES };
})();
