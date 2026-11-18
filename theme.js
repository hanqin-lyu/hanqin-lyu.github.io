// Light / dark theme toggle.
// - No saved choice: the page follows the visitor's system setting (CSS handles this).
// - Clicking the toggle sets <html data-theme="light|dark"> and remembers it in localStorage.
// - A tiny inline script in each page's <head> applies the saved choice before first paint,
//   so there is no flash of the wrong theme.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function current() {
    var chosen = root.getAttribute('data-theme');
    if (chosen === 'light' || chosen === 'dark') return chosen;
    return systemDark.matches ? 'dark' : 'light';
  }

  function updateButtons() {
    var isDark = current() === 'dark';
    var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
  }

  function setTheme(next) {
    if (!reduceMotion.matches) {
      root.classList.add('theme-switching');
      window.setTimeout(function () { root.classList.remove('theme-switching'); }, 450);
    }
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* private mode: choice lasts this page only */ }
    updateButtons();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    setTheme(current() === 'dark' ? 'light' : 'dark');
  });

  // Visitors who never chose keep following their system; keep the button's label in step.
  systemDark.addEventListener('change', updateButtons);

  updateButtons();
})();
