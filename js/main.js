/* ============================================================
   PLF Climatização — main.js
   ============================================================ */

/* ---- Scroll Frame Sequence ---- */
(function () {
  var TOTAL_FRAMES = 100;
  var isMobile     = window.innerWidth <= 1024;
  var BASE_PATH    = isMobile
    ? 'assets/celular/extracted/'
    : 'assets/pc/extracted/';

  function frameSrc(n) {
    return BASE_PATH + String(n).padStart(3, '0') + '.jpg';
  }

  var container = document.getElementById('frame-container');
  var stickyEl  = document.getElementById('frame-sticky');
  var img       = document.getElementById('frame-img');
  if (!container || !img || !stickyEl) return;

  /* Phase elements */
  var phase1 = document.getElementById('phase-1');
  var phase2 = document.getElementById('phase-2');
  var phase3 = document.getElementById('phase-3');

  var PHASE1_END = 0.33;
  var PHASE2_END = 0.66;
  var FADE_START = 0.88;

  /* Pre-load all frames in small batches so the browser doesn't choke */
  var frames = new Array(TOTAL_FRAMES + 1);
  var BATCH  = 10;

  function loadBatch(start) {
    var end = Math.min(start + BATCH, TOTAL_FRAMES + 1);
    for (var i = start; i < end; i++) {
      if (!frames[i]) {
        var el = new Image();
        el.src = frameSrc(i);
        frames[i] = el;
      }
    }
    if (end <= TOTAL_FRAMES) {
      setTimeout(function () { loadBatch(end); }, 32);
    }
  }
  loadBatch(1);

  var ticking      = false;
  var currentPhase = 0;

  function setPhase(phase) {
    if (phase === currentPhase) return;
    currentPhase = phase;
    phase1.classList.toggle('active', phase === 1);
    phase2.classList.toggle('active', phase === 2);
    phase3.classList.toggle('active', phase === 3);
  }

  function updateFrame() {
    ticking = false;

    var rect     = container.getBoundingClientRect();
    var scrollH  = container.offsetHeight - window.innerHeight;
    var progress = Math.max(0, Math.min(1, -rect.top / scrollH));

    var idx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));

    if (frames[idx] && frames[idx].complete && frames[idx].naturalWidth > 0) {
      img.src = frames[idx].src;
    }

    stickyEl.style.opacity = progress >= FADE_START
      ? String(1 - (progress - FADE_START) / (1 - FADE_START))
      : '1';

    if (progress <= PHASE1_END)      setPhase(1);
    else if (progress <= PHASE2_END) setPhase(2);
    else                             setPhase(3);
  }

  function onScroll() {
    if (!ticking) { requestAnimationFrame(updateFrame); ticking = true; }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  updateFrame();
  setPhase(1);
})();

/* ---- FAQ Accordion ---- */
(function () {
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function (item) {
    var btn    = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      /* close all */
      items.forEach(function (i) {
        i.classList.remove('open');
        var a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
        var b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      /* open clicked if it was closed */
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ---- Intersection Observer — Scroll Reveal ---- */
(function () {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();
