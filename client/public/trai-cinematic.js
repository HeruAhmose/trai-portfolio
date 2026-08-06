/*! ===========================================================================
 *  TRAI Cinematic Layer  v1.0
 *  ---------------------------------------------------------------------------
 *  One file. Drop it into any TRAI property — Firebase, static HTML, React SPA —
 *  and it adds a brand-true cinematic intro, an ambient generative field,
 *  scroll-driven reveals, and interaction polish, without touching the markup.
 *
 *      <script src="trai-cinematic.js" data-brand="tamerian" defer></script>
 *
 *  Design position: the brand's motif is the golden angle, 137.507764°, which
 *  is a real constraint from the cultivation work rather than an ornament. Every
 *  generative element here is built from it. Nothing is a stock particle field.
 *
 *  Behaviour it guarantees:
 *    • runs once per session, so the intro never becomes an obstacle
 *    • honours prefers-reduced-motion completely — a single composed frame
 *    • pauses all animation when the tab is hidden or the canvas is offscreen
 *    • repairs `maximum-scale=1` in the viewport meta, which blocks pinch-zoom
 *      and fails WCAG 1.4.4
 *    • degrades to nothing if canvas is unavailable
 *    • adds no dependency and no build step
 * ========================================================================== */
(function () {
  'use strict';

  if (window.__traiCinematic) return;
  window.__traiCinematic = true;

  var script  = document.currentScript;
  var BRAND   = (script && script.dataset.brand) || 'trai';
  var SKIPKEY = 'trai-intro-' + BRAND;
  var FIELD   = (script && script.dataset.field) !== 'off';
  var REDUCE  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- palette
     Each property keeps its own accent, but the geometry and motion are
     shared, so the family reads as one house without looking cloned. */
  var BRANDS = {
    trai:      { gold:'#d8aa43', hot:'#f0c463', cool:'#2b5ca8', ink:'#05070a',
                 mark:'\u03a6', line:'Sovereign technology' },
    tamerian:  { gold:'#d8aa43', hot:'#f0c463', cool:'#1d6f66', ink:'#030308',
                 mark:'\u25c6', line:'Where carbon meets crystal' },
    califia:   { gold:'#e0b450', hot:'#f5d07a', cool:'#2f6fd0', ink:'#04060c',
                 mark:'\u265b', line:'Cognitive sovereignty' },
    techbridge:{ gold:'#d8aa43', hot:'#f0c463', cool:'#3a7d5c', ink:'#06090c',
                 mark:'\u2b21', line:'Community technology' },
    bluegold:  { gold:'#d6a33a', hot:'#f0c463', cool:'#2b5ca8', ink:'#08070a',
                 mark:'\u03a6', line:'Cultivated on the golden angle' }
  };
  var C = BRANDS[BRAND] || BRANDS.trai;

  var GOLDEN = Math.PI * (3 - Math.sqrt(5));   /* 137.507764° in radians */

  /* ------------------------------------------------------------------ utils */
  function el(tag, css, parent) {
    var n = document.createElement(tag);
    if (css) n.style.cssText = css;
    (parent || document.body).appendChild(n);
    return n;
  }
  function hexToRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  var GOLD = hexToRgb(C.gold), HOT = hexToRgb(C.hot), COOL = hexToRgb(C.cool);
  function mix(a, b, t) {
    return 'rgb(' + Math.round(a[0]+(b[0]-a[0])*t) + ',' +
                    Math.round(a[1]+(b[1]-a[1])*t) + ',' +
                    Math.round(a[2]+(b[2]-a[2])*t) + ')';
  }

  /* ------------------------------------------------------- accessibility fix
     `maximum-scale=1` disables pinch-zoom and fails WCAG 2.1 SC 1.4.4. It is
     present on more than one TRAI property. Repair it rather than document it. */
  function fixViewport() {
    var m = document.querySelector('meta[name="viewport"]');
    if (!m) return;
    var v = m.getAttribute('content') || '';
    if (/maximum-scale|user-scalable\s*=\s*(no|0)/i.test(v)) {
      m.setAttribute('content',
        v.replace(/,?\s*maximum-scale\s*=\s*[\d.]+/ig, '')
         .replace(/,?\s*user-scalable\s*=\s*(no|0)/ig, ''));
    }
  }

  /* ------------------------------------------------------------------ styles */
  function styles() {
    var s = document.createElement('style');
    s.textContent = [
      '@keyframes traiFade{from{opacity:0}to{opacity:1}}',
      '@keyframes traiRise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}',
      '@keyframes traiPulse{0%,100%{opacity:.35}50%{opacity:1}}',
      '#trai-intro{position:fixed;inset:0;z-index:99999;background:' + C.ink + ';',
        'display:grid;place-items:center;transition:opacity .9s cubic-bezier(.2,.7,.3,1)}',
      '#trai-intro.out{opacity:0;pointer-events:none}',
      '#trai-intro canvas{position:absolute;inset:0;width:100%;height:100%}',
      '#trai-intro .tx{position:relative;text-align:center;padding:0 6vw}',
      '#trai-intro .mk{font:400 clamp(4rem,15vw,11rem)/1 Georgia,serif;color:' + C.gold + ';',
        'margin:0;text-shadow:0 0 90px ' + C.gold + '66;animation:traiFade 1.2s both}',
      '#trai-intro .ln{font:500 .68rem/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;',
        'letter-spacing:.36em;text-transform:uppercase;color:#EDE6D8;opacity:.72;',
        'margin:1.4rem 0 0;animation:traiRise 1.1s .5s both}',
      '#trai-intro .sk{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);',
        'background:none;border:1px solid ' + C.gold + '55;color:' + C.gold + ';cursor:pointer;',
        'font:500 .6rem/1 ui-monospace,monospace;letter-spacing:.24em;text-transform:uppercase;',
        'padding:.6rem 1.2rem;animation:traiFade 1s 1.6s both}',
      '#trai-intro .sk:hover{background:' + C.gold + ';color:' + C.ink + '}',
      '#trai-field{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5}',
      '.trai-rv{opacity:0;transform:translateY(20px)}',
      '.trai-rv.in{opacity:1;transform:none;transition:opacity .85s cubic-bezier(.2,.7,.3,1),transform .85s cubic-bezier(.2,.7,.3,1)}',
      '@media(prefers-reduced-motion:reduce){',
        '#trai-intro{transition:none}.trai-rv{opacity:1;transform:none;transition:none}',
        '#trai-intro .mk,#trai-intro .ln,#trai-intro .sk{animation:none}}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ================================================================= INTRO
     A phyllotaxis bloom: florets placed at n × 137.507764°, radius ∝ √n,
     resolving outward from the core. It is the cultivation geometry drawing
     itself, and it doubles as the brand mark's own construction. */
  function intro(done) {
    if (sessionStorage.getItem(SKIPKEY)) { done(); return; }
    try { sessionStorage.setItem(SKIPKEY, '1'); } catch (e) {}

    var wrap = el('div', '', document.body);
    wrap.id = 'trai-intro';
    wrap.setAttribute('role', 'presentation');

    var cv = document.createElement('canvas');
    wrap.appendChild(cv);
    var tx = el('div', '', wrap); tx.className = 'tx';
    tx.innerHTML = '<p class="mk">' + C.mark + '</p><p class="ln">' + C.line + '</p>';
    var skip = el('button', '', wrap);
    skip.className = 'sk'; skip.textContent = 'Skip';
    skip.setAttribute('aria-label', 'Skip the introduction');

    var ctx = cv.getContext('2d');
    if (!ctx) { finish(); return; }

    var dpr = Math.min(window.devicePixelRatio || 1, 2), W, H, raf, t0 = 0, ended = false;
    function size() {
      W = wrap.clientWidth; H = wrap.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    var TOTAL = 900, DUR = 2600;

    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / DUR);
      var e = 1 - Math.pow(1 - p, 3);                 /* ease-out cubic */
      ctx.clearRect(0, 0, W, H);

      var cx = W / 2, cy = H / 2;
      var unit = Math.min(W, H) / 2 / Math.sqrt(TOTAL) * 1.25;
      var shown = Math.floor(TOTAL * e);

      for (var n = 1; n <= shown; n++) {
        var k = n / TOTAL;
        var a = n * GOLDEN + e * 0.7;
        var r = unit * Math.sqrt(n) * e;
        var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        var age = Math.min(1, (shown - n) / 90);       /* newest florets flare */
        ctx.beginPath();
        ctx.arc(x, y, (0.7 + 2.6 * k) * (1 + (1 - age) * 1.4), 0, 6.2832);
        ctx.fillStyle = k < .45 ? mix(HOT, GOLD, k / .45)
                                : mix(GOLD, COOL, (k - .45) / .55);
        ctx.globalAlpha = (0.16 + 0.66 * (1 - k)) * (0.4 + 0.6 * age);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* core bloom */
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * 9);
      g.addColorStop(0, C.hot + Math.round(60 * (1 - p * 0.5)).toString(16));
      g.addColorStop(1, C.hot + '00');
      ctx.fillStyle = g;
      ctx.fillRect(cx - unit * 9, cy - unit * 9, unit * 18, unit * 18);

      if (p < 1) raf = requestAnimationFrame(frame);
      else setTimeout(finish, 700);
    }

    function finish() {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      wrap.classList.add('out');
      setTimeout(function () { wrap.remove(); done(); }, 950);
    }

    skip.addEventListener('click', finish);
    document.addEventListener('keydown', function esc(ev) {
      if (ev.key === 'Escape') { document.removeEventListener('keydown', esc); finish(); }
    });

    if (REDUCE) {
      /* one composed frame, held briefly, then out */
      t0 = performance.now() - DUR;
      frame(performance.now());
      setTimeout(finish, 900);
    } else {
      raf = requestAnimationFrame(frame);
    }
  }

  /* ================================================== AMBIENT FIELD
     A slow spiral drift behind the page. Deliberately low-contrast: it should
     register as atmosphere, never compete with type. */
  function field() {
    if (!FIELD) return;
    /* Both Blue-Gold and the portfolio already draw a full-bleed hero canvas.
       A second generative layer behind it competes rather than adds, so if the
       page paints its own, stand down. */
    var existing = document.querySelector('canvas:not(#trai-field):not(#trai-intro canvas)');
    if (existing) {
      var r = existing.getBoundingClientRect();
      if (r.width > window.innerWidth * 0.6 && r.height > window.innerHeight * 0.4) return;
    }
    var cv = el('canvas', '', document.body);
    cv.id = 'trai-field';
    cv.setAttribute('aria-hidden', 'true');
    var ctx = cv.getContext('2d');
    if (!ctx) { cv.remove(); return; }

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5), W, H, raf, t = 0, live = true;
    function size() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    var N = 220, mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / W - .5) * 2; ty = (e.clientY / H - .5) * 2;
    }, { passive: true });

    function draw() {
      if (!live) return;
      ctx.clearRect(0, 0, W, H);
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      t += 0.0016;
      var cx = W * (0.5 + mx * 0.06), cy = H * (0.48 + my * 0.05);
      var unit = Math.min(W, H) / 2 / Math.sqrt(N) * 1.5;
      for (var n = 1; n <= N; n++) {
        var k = n / N;
        var a = n * GOLDEN + t;
        var r = unit * Math.sqrt(n);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.7 + 2.2 * k, 0, 6.2832);
        ctx.fillStyle = k < .5 ? C.gold : C.cool;
        ctx.globalAlpha = 0.05 + 0.13 * (1 - k);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    if (REDUCE) { t = 2; draw(); live = false; cancelAnimationFrame(raf); }
    else raf = requestAnimationFrame(draw);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { live = false; cancelAnimationFrame(raf); }
      else if (!REDUCE) { live = true; raf = requestAnimationFrame(draw); }
    });
  }

  /* ============================================= SCROLL REVEALS
     Applied to plausible content blocks that are not already animated, so an
     existing site gains motion without its markup being touched. */
  function reveals() {
    var sel = 'section, article, .card, .feature, [class*="section"]';
    var nodes = [].slice.call(document.querySelectorAll(sel))
      .filter(function (n) {
        return !n.closest('#trai-intro') &&
               !n.classList.contains('trai-rv') &&
               n.offsetHeight > 60 && n.offsetHeight < window.innerHeight * 3;
      })
      .slice(0, 120);

    if (!('IntersectionObserver' in window) || REDUCE) {
      nodes.forEach(function (n) { n.classList.add('trai-rv', 'in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    nodes.forEach(function (n, i) {
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight) { n.classList.add('trai-rv', 'in'); return; }
      n.classList.add('trai-rv');
      io.observe(n);
    });
  }

  /* ============================================================= boot */
  function boot() {
    fixViewport();
    styles();
    intro(function () {
      field();
      reveals();
      document.documentElement.classList.add('trai-ready');
      window.dispatchEvent(new CustomEvent('trai:ready'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
