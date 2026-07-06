/* PAA — interactions
   Loaded with `defer`, so the DOM is ready when this runs.
   Category filtering itself is pure CSS, driven by <body data-tab>. */

const CATEGORIES = ["patent", "marke", "muster"];

const tabsEl = document.querySelector(".tabs");
const indicator = tabsEl && tabsEl.querySelector(".tab-indicator");

// Slide the pill behind the active tab to its measured position.
function moveIndicator(animate = true) {
  if (!indicator) return;
  const active = tabsEl.querySelector('.tab[aria-selected="true"]');
  if (!active) return;
  if (!animate) indicator.style.transition = "none";
  indicator.style.width = active.offsetWidth + "px";
  indicator.style.transform = `translateX(${active.offsetLeft - tabsEl.clientLeft}px)`;
  if (!animate) {
    void indicator.offsetWidth; // flush, then restore CSS transition
    indicator.style.transition = "";
  }
}

function tabFromUrl() {
  const t = new URLSearchParams(location.search).get("tab");
  return CATEGORIES.includes(t) ? t : "patent";
}

function setTab(cat, { push = false } = {}) {
  if (!CATEGORIES.includes(cat)) cat = "patent";
  document.body.dataset.tab = cat;
  for (const btn of document.querySelectorAll(".tab")) {
    btn.setAttribute("aria-selected", String(btn.dataset.tab === cat));
  }
  moveIndicator();
  const url = `?tab=${cat}`;
  if (push) history.pushState(null, "", url);
  else history.replaceState(null, "", url);
}

function moveTab(delta) {
  const next = CATEGORIES.indexOf(document.body.dataset.tab) + delta;
  if (next >= 0 && next < CATEGORIES.length) setTab(CATEGORIES[next], { push: true });
}

// --- init + navigation -------------------------------------
// Only the main page has the category switcher; on subpages (which share
// this script) the tab logic is skipped so nothing gets filtered away.
if (document.querySelectorAll(".tab").length) {
  setTab(tabFromUrl());
  moveIndicator(false); // snap into place on first paint (no slide-in)
  window.addEventListener("load", () => moveIndicator(false));
  window.addEventListener("resize", () => moveIndicator(false));

  for (const btn of document.querySelectorAll(".tab")) {
    btn.addEventListener("click", () => setTab(btn.dataset.tab, { push: true }));
  }

  window.addEventListener("popstate", () => setTab(tabFromUrl()));

  // arrow keys (desktop)
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, summary")) return;
    if (e.key === "ArrowRight") moveTab(1);
    else if (e.key === "ArrowLeft") moveTab(-1);
  });

  // horizontal swipe (touch)
  let startX = null, startY = null;
  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      moveTab(dx < 0 ? 1 : -1); // swipe left -> next, right -> previous
    }
    startX = startY = null;
  }, { passive: true });
}

// --- auto icon for links to PDF files ----------------------
const PDF_ICON =
  '<svg class="pdf-ic" viewBox="0 0 384 512" aria-hidden="true" fill="currentColor">' +
  '<path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448' +
  'c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM384 128H256V0L384 128z"/></svg>';

for (const link of document.querySelectorAll('a[href$=".pdf"]')) {
  (link.querySelector("button") || link).insertAdjacentHTML("beforeend", PDF_ICON);
}

// --- light / dark toggle -----------------------------------
// The head script already set html[data-theme]; here we sync the icon and
// theme-colour, and let the footer button flip + persist the choice.
const ICON = {
  // shown while light -> click switches to dark
  moon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  // shown while dark -> click switches to light
  sun: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>',
};
const themeBtn = document.getElementById("themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#14171d" : "#eceef1");
  if (themeBtn) themeBtn.innerHTML = theme === "dark" ? ICON.sun : ICON.moon;
}
if (themeBtn) {
  applyTheme(currentTheme());
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
  // follow the OS if the user hasn't made an explicit choice
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (_) {}
    if (!saved) applyTheme(e.matches ? "dark" : "light");
  });
}

// --- service worker ----------------------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
