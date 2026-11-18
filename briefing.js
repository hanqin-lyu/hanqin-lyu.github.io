// 60-second briefing — turns <div class="deck" data-deck> with <article class="slide"> children
// into a small slide deck. Without this script the slides simply read top to bottom.
//
// - Next / previous: buttons, ← → keys (when the deck has focus or is fullscreen), swipe.
// - Fragments: elements with [data-fragment] inside a slide are revealed one per "next".
// - Deep link: #briefing-3 opens slide 3; the address updates as the reader moves.
// - Fullscreen: the browser's own, or a fixed overlay where that isn't available.
// - The slide title (.trim) plays the site's cabinet-handle trim each time a slide opens.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var ICONS = {
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    play: '<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>' +
          '<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13M15.5 5.5v13"/></svg>',
    full: '<svg class="icon-enter" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>' +
          '<svg class="icon-exit" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'
  };

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (html) node.innerHTML = html;
    return node;
  }

  function initDeck(deck) {
    var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
    if (slides.length < 2) return;
    var prefix = deck.getAttribute('data-deck') || 'briefing';
    var index = 0;
    var step = 0; // how many fragments of the current slide are revealed

    // Wrap the slides so they can share one grid cell.
    var viewport = el('div', { 'class': 'deck-viewport' });
    slides[0].parentNode.insertBefore(viewport, slides[0]);
    slides.forEach(function (s) { viewport.appendChild(s); });

    deck.setAttribute('role', 'region');
    deck.setAttribute('aria-roledescription', 'carousel');
    if (!deck.hasAttribute('aria-label')) deck.setAttribute('aria-label', '60-second briefing');
    deck.setAttribute('tabindex', '0');

    slides.forEach(function (s, i) {
      var title = s.querySelector('.slide-title');
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', (i + 1) + ' of ' + slides.length + (title ? ': ' + title.textContent.trim() : ''));
    });

    // Controls
    var bar = el('div', { 'class': 'deck-bar' });
    var dots = el('div', { 'class': 'deck-dots' });
    slides.forEach(function (s, i) {
      var kicker = s.querySelector('.slide-kicker');
      var label = 'Go to slide ' + (i + 1) + (kicker ? ': ' + kicker.textContent.trim() : '');
      var dot = el('button', { 'class': 'deck-dot', type: 'button', 'aria-label': label, title: label });
      dot.addEventListener('click', function () { userStop(); go(i, 'all'); });
      dots.appendChild(dot);
    });
    var nav = el('div', { 'class': 'deck-nav' });
    var count = el('span', { 'class': 'deck-count', 'aria-hidden': 'true' });
    var prevBtn = el('button', { 'class': 'deck-btn', type: 'button', 'aria-label': 'Previous' }, ICONS.prev);
    var nextBtn = el('button', { 'class': 'deck-btn deck-btn--primary', type: 'button' },
      '<span class="deck-btn-label">Next</span>' + ICONS.next);
    var fullBtn = el('button', { 'class': 'deck-btn', type: 'button', 'aria-label': 'Full screen', title: 'Full screen' }, ICONS.full);
    var playBtn = el('button', { 'class': 'deck-btn deck-btn--play', type: 'button', 'aria-label': 'Play slideshow', title: 'Play slideshow', 'aria-pressed': 'false' }, ICONS.play);
    var status = el('p', { 'class': 'deck-status', 'aria-live': 'polite' });
    var progress = el('span', { 'class': 'deck-progress', 'aria-hidden': 'true' });
    nav.appendChild(count); nav.appendChild(playBtn); nav.appendChild(prevBtn); nav.appendChild(nextBtn); nav.appendChild(fullBtn);
    bar.appendChild(progress); bar.appendChild(dots); bar.appendChild(nav);
    deck.appendChild(bar);
    deck.appendChild(status);

    function fragmentsOf(i) { return Array.prototype.slice.call(slides[i].querySelectorAll('[data-fragment]')); }

    function playTrim(slide) {
      var t = slide.querySelector('.trim');
      if (!t || reduceMotion.matches) return;
      t.classList.remove('trim-play');
      void t.offsetWidth; // restart the animation
      t.classList.add('trim-play');
    }

    function render(announce) {
      slides.forEach(function (s, i) {
        var active = i === index;
        s.classList.toggle('is-active', active);
        s.classList.toggle('is-before', i < index);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
        if (active) s.removeAttribute('inert'); else s.setAttribute('inert', '');
      });
      var frags = fragmentsOf(index);
      frags.forEach(function (f, i) {
        f.classList.toggle('is-shown', i < step);
        f.classList.toggle('is-current', i === step - 1 && step < frags.length);
        f.classList.toggle('is-last', i === frags.length - 1 && step === frags.length);
      });
      Array.prototype.forEach.call(dots.children, function (d, i) {
        if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      count.textContent = (index + 1) + ' / ' + slides.length;
      var atEnd = index === slides.length - 1 && step >= frags.length;
      prevBtn.disabled = index === 0 && step <= Math.min(1, frags.length);
      nextBtn.disabled = atEnd;
      if (announce) status.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length;
    }

    function setHash() {
      if (!history.replaceState) return;
      history.replaceState(null, '', '#' + prefix + '-' + (index + 1));
    }

    // reveal: 'first' shows the first fragment, 'all' shows every fragment
    function go(i, reveal) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      var changed = i !== index;
      index = i;
      var n = fragmentsOf(i).length;
      step = reveal === 'all' ? n : Math.min(1, n);
      render(true);
      if (changed) playTrim(slides[i]);
      setHash();
    }

    function next() {
      var n = fragmentsOf(index).length;
      if (step < n) { step++; render(false); setHash(); return; }
      if (index < slides.length - 1) go(index + 1, 'first');
    }

    function prev() {
      var n = fragmentsOf(index).length;
      if (n && step > 1) { step--; render(false); setHash(); return; }
      if (index > 0) go(index - 1, 'all');
    }

    // Autoplay: on by default. It starts the first time at least half the deck is on screen, pauses while
    // the deck is scrolled away or the tab is hidden, and resumes when it comes back. It stays off once the
    // reader takes over (pause, prev/next, dots, keys, swipe), after it has played to the end, when the
    // page was opened on a specific slide (#briefing-N), and for readers who ask for reduced motion.
    // Fragments advance every FRAGMENT_MS, whole slides after SLIDE_MS.
    var SLIDE_MS = 6500, FRAGMENT_MS = 2200;
    var timer = null;
    var userStopped = reduceMotion.matches; // true once the reader has taken over, or played to the end
    var autoPaused = false;                 // paused by us (off screen / hidden tab), to resume later
    var inView = false;
    function playing() { return timer !== null; }
    function atEnd() { return index === slides.length - 1 && step >= fragmentsOf(index).length; }
    function updatePlayBtn() {
      var on = playing();
      var label = on ? 'Pause slideshow' : 'Play slideshow';
      playBtn.setAttribute('aria-label', label);
      playBtn.setAttribute('title', label);
      playBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      deck.classList.toggle('deck--playing', on);
    }
    function runProgress(ms) {
      progress.style.transition = 'none';
      progress.style.transform = 'scaleX(0)';
      if (!ms) return;
      void progress.offsetWidth;
      progress.style.transition = 'transform ' + ms + 'ms linear';
      progress.style.transform = 'scaleX(1)';
    }
    function schedule() {
      if (atEnd()) { userStopped = true; stopAuto(true); return; } // played through: don't restart on its own
      var delay = step < fragmentsOf(index).length ? FRAGMENT_MS : SLIDE_MS;
      runProgress(delay);
      timer = setTimeout(function () { next(); schedule(); }, delay);
    }
    // announce: tell screen readers (only for the reader's own play/pause, not the automatic ones)
    function startAuto(announce) {
      if (playing()) return;
      if (atEnd()) go(0, 'first'); // pressing play at the end starts again
      timer = 0; // mark as playing before the first tick
      autoPaused = false;
      updatePlayBtn();
      if (announce) status.textContent = 'Slideshow playing';
      schedule();
    }
    function stopAuto(announce) {
      if (!playing()) return;
      clearTimeout(timer);
      timer = null;
      runProgress(0);
      updatePlayBtn();
      if (announce) status.textContent = 'Slideshow paused';
    }
    function userStop() { userStopped = true; autoPaused = false; stopAuto(true); }
    function pauseForNow() { if (playing()) { stopAuto(false); autoPaused = true; } }
    function maybeAutoStart() {
      if (userStopped || document.hidden || !inView) return;
      if (playing()) return;
      startAuto(false);
    }

    playBtn.addEventListener('click', function () {
      if (playing()) userStop();
      else { userStopped = false; startAuto(true); }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pauseForNow();
      else if (autoPaused) maybeAutoStart();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          inView = entry.intersectionRatio >= 0.5;
          if (inView) maybeAutoStart(); else pauseForNow();
        });
      }, { threshold: [0, 0.5] }).observe(deck);
    }

    // Anything the reader does by hand takes over from autoplay.
    function byHand(fn) { return function () { userStop(); fn.apply(null, arguments); }; }
    var manualNext = byHand(next), manualPrev = byHand(prev);

    prevBtn.addEventListener('click', manualPrev);
    nextBtn.addEventListener('click', manualNext);

    // Keyboard: only while the deck (or something in it) has focus, or it is fullscreen.
    function onKey(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); manualNext(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); manualPrev(); }
      else if (e.key === ' ' && e.target === deck) { e.preventDefault(); if (e.shiftKey) manualPrev(); else manualNext(); }
      else if (e.key === 'Home') { e.preventDefault(); userStop(); go(0, 'first'); }
      else if (e.key === 'End') { e.preventDefault(); userStop(); go(slides.length - 1, 'all'); }
      else if (e.key === 'p' || e.key === 'P') { e.preventDefault(); playBtn.click(); }
    }
    deck.addEventListener('keydown', onKey);

    // Swipe
    var startX = null, startY = 0;
    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      startX = e.clientX; startY = e.clientY;
    });
    viewport.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) manualNext(); else manualPrev(); }
    });
    viewport.addEventListener('pointercancel', function () { startX = null; });

    // Full screen. The overlay (fixed, covering the window) always switches on at once, so it works
    // everywhere — including embedded browsers where the native Fullscreen API silently does nothing.
    // Native fullscreen is requested on top of it; leaving native fullscreen (Esc) leaves the overlay too.
    var nativeActive = false;
    function isFull() { return deck.classList.contains('deck--overlay'); }
    function updateFullBtn() {
      var label = isFull() ? 'Exit full screen' : 'Full screen';
      fullBtn.setAttribute('aria-label', label);
      fullBtn.setAttribute('title', label);
      fullBtn.setAttribute('aria-pressed', isFull() ? 'true' : 'false');
    }
    function enterFull() {
      deck.classList.add('deck--overlay');
      document.documentElement.style.overflow = 'hidden';
      updateFullBtn();
      deck.focus({ preventScroll: true });
      if (deck.requestFullscreen) {
        try {
          var p = deck.requestFullscreen();
          if (p && p.catch) p.catch(function () { /* overlay alone is fine */ });
        } catch (err) { /* overlay alone is fine */ }
      }
    }
    function exitFull() {
      if (document.fullscreenElement === deck && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      deck.classList.remove('deck--overlay');
      document.documentElement.style.overflow = '';
      updateFullBtn();
      fullBtn.focus({ preventScroll: true });
    }
    fullBtn.addEventListener('click', function () { if (isFull()) exitFull(); else enterFull(); });
    document.addEventListener('fullscreenchange', function () {
      if (document.fullscreenElement === deck) { nativeActive = true; return; }
      if (nativeActive) { nativeActive = false; if (isFull()) exitFull(); } // Esc left native fullscreen
    });
    // Esc closes the overlay wherever focus is.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isFull() && !document.fullscreenElement) exitFull();
    });

    // A #briefing-N link followed while already on the page (replaceState above never fires this).
    var hashRe = new RegExp('^#' + prefix + '-(\\d+)$');
    window.addEventListener('hashchange', function () {
      var m = hashRe.exec(location.hash);
      if (!m) return;
      userStop();
      go(parseInt(m[1], 10) - 1, 'all');
      (deck.closest('[id]') || deck).scrollIntoView({ block: 'start', behavior: 'instant' });
    });

    // Switch to deck mode with transitions off, so slides don't fade over each other on page load.
    deck.classList.add('deck--ready', 'deck--noanim');
    setTimeout(function () { deck.classList.remove('deck--noanim'); }, 60);

    // Opened at #briefing-N (a slide) or at the section itself (#briefing, the home page's
    // "60-sec briefing →"): bring the deck into view ourselves once the page has finished loading.
    // Earlier, images and fonts shift the layout, and the site's smooth scrolling can leave the
    // browser's own jump unfinished. [id] carries scroll-margin for the sticky nav.
    var target = deck.closest('[id]') || deck;
    function revealOnLoad() {
      var reveal = function () { target.scrollIntoView({ block: 'start', behavior: 'instant' }); };
      if (document.readyState === 'complete') reveal();
      else window.addEventListener('load', function () { setTimeout(reveal, 0); }, { once: true });
    }

    // Start: honour #briefing-N, otherwise slide 1
    var match = hashRe.exec(location.hash);
    index = -1; // so the first go() counts as a change and plays the trim when deep-linked
    if (match) {
      userStopped = true; // opened on a specific slide: let the reader read it, no autoplay
      go(parseInt(match[1], 10) - 1, 'all');
      revealOnLoad();
    } else {
      index = 0;
      step = Math.min(1, fragmentsOf(0).length);
      render(false);
      if (target.id && location.hash === '#' + target.id) revealOnLoad(); // autoplay starts once it's in view
    }
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-deck]'), initDeck);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
