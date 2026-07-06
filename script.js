/* PAA — interactions
   Loaded with `defer`, so the DOM is ready when this runs.
   Category filtering itself is pure CSS, driven by <body data-tab>. */

const CATEGORIES = ["patent", "marke", "muster"];

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

// --- service worker ----------------------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
