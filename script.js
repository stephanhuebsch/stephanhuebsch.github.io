/* PAA — interactions
   Loaded with `defer`, so the DOM is ready when this runs.
   Category filtering itself is pure CSS, driven by <body data-tab>. */

const CATEGORIES = ["patent", "marke", "muster"];

const tabsEl = document.querySelector(".tabs");
const indicator = tabsEl && tabsEl.querySelector(".tab-indicator");
const tabbar = document.querySelector(".tabbar");
const footer = document.querySelector(".site-footer");

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

// True justify: chips on a *full* (wrapped) line stretch to fill it; the
// last line of each segment (a run of chips between full-width items such
// as a .subsection) stays at its natural width, like justified text.
function justifyChips() {
  const rows = [...document.querySelectorAll(".stretch")].filter((r) => r.offsetParent);
  // reset to natural widths so wrapping reflects real content
  for (const row of rows) {
    for (const c of row.children) { c.style.flexGrow = ""; c.style.maxWidth = ""; }
  }
  for (const row of rows) {
    let seg = [];
    const flush = () => {
      if (seg.length) {
        const lastTop = Math.max(...seg.map((c) => c.offsetTop));
        for (const c of seg) if (c.offsetTop !== lastTop) c.style.flexGrow = "1";
      }
      seg = [];
    };
    for (const child of row.children) {
      if (child.matches("a, details.menu")) seg.push(child);
      else flush(); // a full-width divider ends the segment
    }
    flush();
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
  justifyChips();
  onScrollEdges(); // content height changed -> re-check the footer border
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
// Document icon from Heroicons (heroicons.com, MIT).
const PDF_ICON =
  '<svg class="pdf-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
  '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>';

for (const link of document.querySelectorAll('a[href$=".pdf"]')) {
  (link.querySelector("button") || link).insertAdjacentHTML("beforeend", PDF_ICON);
}

// --- dropdowns: only one open at a time, close on outside click ---
// Close with a fade-out (menuOut) before actually collapsing the <details>.
function closeMenu(d) {
  if (!d.open || d.classList.contains("closing")) return;
  const list = d.querySelector(".menu-list");
  if (!list || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    d.open = false;
    return;
  }
  d.classList.add("closing");
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    list.removeEventListener("animationend", onEnd);
    d.classList.remove("closing");
    d.open = false;
  };
  const onEnd = (e) => { if (e.animationName === "menuOut") finish(); };
  list.addEventListener("animationend", onEnd);
  const timer = setTimeout(finish, 250); // fallback if animationend never fires
}
function closeMenusExcept(keep) {
  for (const d of document.querySelectorAll("details.menu[open]")) {
    if (d !== keep) closeMenu(d);
  }
}
// Keep the floating panel left-aligned to its summary, but never spilling
// past main's right edge (shift it left, and clamp, when it would).
function positionPanel(menu) {
  const list = menu.querySelector(".menu-list");
  const main = document.querySelector("main");
  if (!list || !main) return;
  list.style.left = "0px";
  const cs = getComputedStyle(main);
  const box = main.getBoundingClientRect();
  const mainLeft = box.left + (parseFloat(cs.paddingLeft) || 0);
  const mainRight = box.right - (parseFloat(cs.paddingRight) || 0);
  list.style.maxWidth = Math.min(460, mainRight - mainLeft) + "px";
  const menuLeft = menu.getBoundingClientRect().left;
  const width = list.offsetWidth;
  let left = 0;
  if (menuLeft + width > mainRight) left = mainRight - width - menuLeft;
  if (menuLeft + left < mainLeft) left = mainLeft - menuLeft;
  list.style.left = left + "px";
}
// `toggle` doesn't bubble, so listen in the capture phase.
document.addEventListener("toggle", (e) => {
  const d = e.target;
  if (d.tagName === "DETAILS" && d.classList.contains("menu") && d.open) {
    closeMenusExcept(d);
    positionPanel(d);
  }
}, true);
document.addEventListener("click", (e) => {
  // clicking an open summary should fade it out, not snap it shut
  const summary = e.target.closest(".menu > summary");
  if (summary) {
    const d = summary.parentElement;
    if (d.open && !d.classList.contains("closing")) {
      e.preventDefault();
      closeMenu(d);
    }
    return;
  }
  // tap/click anywhere outside a menu closes the open one
  if (!e.target.closest("details.menu")) closeMenusExcept(null);
});
// reposition any open panel when the viewport changes.
window.addEventListener("resize", () => {
  for (const d of document.querySelectorAll("details.menu[open]")) positionPanel(d);
});
// Close any open menu immediately (no fade) — used for scroll/background.
function closeMenusInstant() {
  for (const d of document.querySelectorAll("details.menu[open]")) {
    d.classList.remove("closing");
    d.open = false;
  }
}
// When the page is backgrounded (e.g. an external link opened the iOS in-app
// browser), close any open menu so it isn't still open on return.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) closeMenusInstant();
});

// --- sticky bar edges + chip justification ---
// Tab bar: mark it stuck (border + top cover) once it reaches the top.
// Footer: drop its top border once the page is scrolled to the very bottom
// (which includes the case where everything fits without scrolling).
function onScrollEdges() {
  // "stuck" = pinned to the top by scrolling, not merely resting there (the
  // bar sits at top:0 now that the masthead is gone, so also require a scroll).
  if (tabbar) {
    tabbar.classList.toggle("stuck", window.scrollY > 0 && tabbar.getBoundingClientRect().top <= 0);
  }
  if (footer) {
    const atBottom =
      Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1;
    footer.classList.toggle("at-bottom", atBottom);
  }
}
// Chip widths change page height, so justify first, then re-check the edges.
function refreshLayout() {
  justifyChips();
  onScrollEdges();
}
// Remember whether a touch gesture began inside an open popup, so scrolling
// from within the popup doesn't dismiss it (only scrolling elsewhere does).
let touchStartedInPopup = false;
document.addEventListener("touchstart", (e) => {
  touchStartedInPopup = !!e.target.closest(".menu-list");
}, { passive: true });
window.addEventListener("scroll", () => {
  onScrollEdges();
  // touch devices: scrolling dismisses an open popup (unless it started inside one)
  if (matchMedia("(hover: none)").matches && !touchStartedInPopup) closeMenusInstant();
}, { passive: true });
window.addEventListener("resize", refreshLayout, { passive: true });
window.addEventListener("load", refreshLayout); // after fonts settle
refreshLayout();

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

function savedTheme() {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : null;
  } catch (_) { return null; }
}

// Only <html data-theme> drives the colours: CSS repaints the page background,
// and because the iOS status bar is translucent (black-translucent) it shows
// that background, so the top updates instantly. The two static
// <meta name="theme-color"> tags handle Safari's address bar per OS scheme;
// nothing here needs to touch them.
function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeBtn) themeBtn.innerHTML = theme === "dark" ? ICON.sun : ICON.moon;
}
if (themeBtn) {
  applyTheme(currentTheme());
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", next); } catch (e) {}
    applyTheme(next);
  });
  // follow the OS if the user hasn't made an explicit choice
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!savedTheme()) applyTheme(e.matches ? "dark" : "light");
  });
}

// --- service worker ----------------------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
