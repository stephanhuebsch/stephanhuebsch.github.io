document.addEventListener("DOMContentLoaded", function() {
	const toc = document.getElementById("toc");
	const allHeadings = document.querySelectorAll("h2, h3, h4");
    const headings = Array.from(allHeadings).filter(heading => !heading.classList.contains('not_toc'));

	const list = document.createElement("div");
	
	// Determine if there are any h2 elements
    //const hasH2 = Array.from(headings).some(heading => heading.tagName === "H2");
    
    var indentH3 = 0;
    var indentH4 = 1;
    const indentPixel = 20;
    
	headings.forEach(heading => {
		const li = document.createElement("p");
		li.style.margin = "6px";
		const a = document.createElement("a");
		a.href = "#" + heading.id;
		
        if (heading.tagName === "H2") {
            li.style.marginLeft = "0px"; // immer null
            li.style.fontWeight = "bold";
            a.innerHTML = heading.innerHTML.toUpperCase();
            indentH3 = 1;
            indentH4 = 1;
        } else if (heading.tagName === "H3") {
            li.style.marginLeft = indentH3 * indentPixel + "px";
            li.style.fontWeight = "bold";
            a.innerHTML = heading.innerHTML;
            if (indentH3 == 1) {
                indentH4 = 2;
            }
        } else if (heading.tagName === "H4") {
            li.style.marginLeft = indentH4 * indentPixel + "px";
            
            const originalText = heading.innerHTML;
            const regex = /^(§|Art\.)&nbsp;([0-9]+[a-z]*)(?:<sup>[^<]*<\/sup>)?/i;
            const match = originalText.match(regex);

            if (match && !heading.classList.contains("gestrichen")) {
                const prefixAndNumber = match[0]; // The matched prefix and number/letter
                const restOfText = originalText.slice(prefixAndNumber.length); // The rest of the text

                // Wrap the prefix and number in <strong> tags
                heading.innerHTML = `<strong>${prefixAndNumber}</strong>${restOfText}`;
                //console.log(heading.innerHTML);
            }
            //console.log("test")
            
            a.innerHTML = heading.innerHTML;
        }
        
        if (heading.classList.contains("gestrichen")) {
            li.style.fontStyle = "italic";
        }
        
		li.appendChild(a);
		list.appendChild(li);
		
	});
	toc.appendChild(list);
});

// Highlight in #toc

document.addEventListener("DOMContentLoaded", function() {
  const sections = document.querySelectorAll('.paragraph');
  const observerOptions = {
    root: null,           // Uses the viewport as the container
    rootMargin: '-46px 0px 0px 0px',    // No extra margin around the viewport
    threshold: 0.2        // Fires when 20% of the section is visible
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      // Find the heading within the current section
      const heading = entry.target.querySelector('h2, h3, h4');

      if (heading) {
        // Get the corresponding TOC link for the heading
        const activeLink = document.querySelector(`#toc a[href="#${heading.id}"]`);
        if (!activeLink) return;

        // Add the active class if the section is intersecting, remove it if not
        if (entry.isIntersecting) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));
});

// Fill in #top

document.addEventListener("DOMContentLoaded", function() {
  const top = document.getElementById("top");

  top.innerHTML = '<a href="patg.html">PatG</a>' +
    '<a href="gmg.html">GMG</a>' +
    '<a href="patv-eg.html">PatV-EG</a>' +
    '<a href="mschg.html">MSchG</a>' +
    '<a href="muschg.html">MuSchG</a>' +
    '<a href="schzg.html">SchZG</a>' +
    '<a href="pav.html">PAV</a>' +
    '<a href="eingabenk.html">EingabenK</a>' + 
    '<a href="patanwg.html">PatAnwG</a>' +
    '<a href="standesrl.html">StandesRL</a>' + 
    '<a href="ausbv.html">AusbV</a>' + 
    '<a href="hlschg.html">HlSchG</a>' +
    '<a href="hlschv.html">HlSchV</a>' +
    '<a href="sortschg.html">SortSchG</a>' +
    '<a href="sortschv.html">SortSchV</a>' +
    //'<a href="uwg.html">UWG</a>' +
    //'<a href="urhg.html">UrhG</a>' +
    '<a href="pag.html">PAG</a>' + 
    '<a href="pag-valv.html">PAG-ValV</a>' + 
    '<a href="pvue.html">PVÜ</a>' +
    '<a href="zustg.html">ZustG</a>' +
    '<a href="rsp.html">Rsp</a>';

  // Get the current page's file name, e.g., "a.html"
  var currentPage = window.location.pathname.split("/").pop();

  // Select all menu links inside the #top div
  var menuLinks = document.querySelectorAll("#top a");

  // Loop through each link
  menuLinks.forEach(function(link) {
    // Check if the href of the link matches the current page
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});



document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("expandButton").addEventListener("click", function() {
        if (this.classList.contains("active")) {
            //console.log("was active, will remove this class now");
            this.classList.remove("active");
            document.getElementById("top").style.height = "46px";
        } else {
            //console.log("was not active, will now be active");
            this.classList.add("active");
            document.getElementById("top").style.height = "auto";
        }
    });
});


// check for resize to make the #expandButton appear:

document.addEventListener("DOMContentLoaded", function() {
  const topElement = document.getElementById("top");
  const expandButton = document.getElementById("expandButton");

  function checkOverflow() {
    //console.log("scrollHeight:", topElement.scrollHeight, "clientHeight:", topElement.clientHeight);
    if (!expandButton.classList.contains("active")) { // nicht aktiv, i.e. eingeklappt
      if (topElement.scrollHeight-5 < topElement.clientHeight) { // keine zweite Zeile
        expandButton.style.display = "none";
        topElement.style.height = "46px";
      } else {                                                  // mehr als eine Zeile
        expandButton.style.display = "inline";
      }
    } else if (expandButton.classList.contains("active")) { // aktiv, i.e. ausgeklappt
      if (topElement.scrollHeight > 60) {                   // keine zweite Zeile
        expandButton.style.display = "inline";
        //console.log("button is active, scroll height > 60");
      } else {                                                  // mehr als eine Zeile
        expandButton.style.display = "none";
        expandButton.classList.remove("active");
        //console.log("button is active, scroll height <= 60");
      }
    } else {
     console.log("Unbekannter Fehler!");
    }
  }
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
});



// ---- PART 1: Handle clicks on hash links ---- //
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href*="#"]');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  const [url, hash] = href.split('#');

  if (!hash) return; // skip if no actual hash

  if (url && url !== window.location.pathname && !url.startsWith('#')) {
    // Cross-page navigation: save hash for use after navigation
    sessionStorage.setItem('scrollToTocHash', '#' + hash);
  } else {
    // Same-page link: scroll TOC immediately
    setTimeout(() => {
      scrollTocToHash('#' + hash);
    }, 100); // slight delay to let content scroll first
  }
});

// ---- PART 2: On page load, scroll TOC if needed ---- //
window.addEventListener('load', () => {
  const hash = window.location.hash || sessionStorage.getItem('scrollToTocHash');

  if (hash) {
    scrollTocToHash(hash);
    sessionStorage.removeItem('scrollToTocHash'); // Clean up
  }
});

// ---- Helper: Scroll TOC to matching link ---- //
function scrollTocToHash(hash) {
  const toc = document.getElementById('toc');
  if (!toc) return;

  const tocLink = toc.querySelector('a[href="' + hash + '"]');
  if (tocLink) {
    // Optional: highlight active link
    //toc.querySelectorAll('a').forEach(link => link.classList.remove('active'));
    //tocLink.classList.add('active');

    // Scroll into view
    tocLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


document.addEventListener("DOMContentLoaded", function () {
    const info = document.getElementById("info");
        if (info) {
            info.addEventListener("click", function () {
            alert("Manche Überschriften wurden geändert oder ergänzt.");
        });
    }
});

// === TOC Toggle: robust, class-basiert, accessible ===
document.addEventListener('DOMContentLoaded', () => {
  const toc = document.getElementById('toc');
  const container = document.querySelector('.container');
  let button = document.getElementById('toggleButton');

  // Wenn Button nicht im DOM existiert (nur CSS vorhanden), legen wir ihn an.
  if (!button) {
    button = document.createElement('button');
    button.id = 'toggleButton';
    button.type = 'button';
    // Icon: du kannst FontAwesome nutzen falls geladen; ansonsten einfacher Text
    //button.innerHTML = '<span aria-hidden="true">☰</span>';
    button.innerHTML = '<i class="fa fa-list-ol"></i>';
    button.setAttribute('aria-label', 'Inhaltsverzeichnis anzeigen');
    document.body.appendChild(button);
  }

  // Hilfsfunktionen
  const isSmallViewport = () => window.matchMedia('(max-width: 600px)').matches;

  function openToc() {
    document.body.classList.add('toc-open');
    button.setAttribute('aria-expanded', 'true');
    // Fokus auf erstes Link im TOC (besserer UX / a11y)
    const firstLink = toc && toc.querySelector('a[href^="#"]');
    if (firstLink) firstLink.focus({ preventScroll: true });
  }
  function closeToc() {
    document.body.classList.remove('toc-open');
    button.setAttribute('aria-expanded', 'false');
    // optional: fokus zurück auf Button
    button.focus({ preventScroll: true });
  }
  function toggleToc() {
    if (document.body.classList.contains('toc-open')) closeToc();
    else openToc();
  }

  // Initial: nur erstellen / aktivieren wenn es ein TOC gibt
  if (!toc) {
    // nichts zu tun
    button.style.display = 'none';
    return;
  }

  // Button click toggles only on small screens
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isSmallViewport()) return; // optional: nur mobil
    toggleToc();
  });

  // Click inside document: close TOC when clicking outside the TOC (on small screens)
  document.addEventListener('click', (e) => {
    if (!isSmallViewport()) {
      // wenn grosser Viewport, stellen wir sicher, dass toc-open nicht gesetzt bleibt
      if (document.body.classList.contains('toc-open')) document.body.classList.remove('toc-open');
      return;
    }
    // Wenn TOC offen und Klick ausserhalb von #toc und ausserhalb Button -> schliessen
    //if (document.body.classList.contains('toc-open')) {
    //  if (!e.target.closest('#toc') && !e.target.closest('#toggleButton')) {
    //    closeToc();
    //  }
    //}
  });

  // Wenn ein Link im TOC geklickt wird: TOC schliessen (aber nur mobil)
  toc.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (isSmallViewport()) {
      // Schliessen und erlauben Navigation/Hash
      // setTimeout gibt dem Browser Zeit zum Scrollen / Navigieren
      closeToc();
      // optional: falls du willst, scrollTocToHash aufrufen:
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        setTimeout(() => {
          const hash = href;
          const tocLink = toc.querySelector('a[href="' + hash + '"]');
          if (tocLink) tocLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
      }
    }
  });

  // Sync beim Resize: entferne toc-open auf großen Bildschirmen und
  // show/hide button gemäss Media-Query (button CSS kann das eigentlich regeln,
  // aber wenn wir inline display manipuliert haben, synchronisieren)
  const onResize = () => {
    if (!isSmallViewport()) {
      // Auf großen Bildschirm: TOC sichtbar per CSS / Container links, also Klasse entfernen
      if (document.body.classList.contains('toc-open')) document.body.classList.remove('toc-open');
      // Button wird per CSS (media-query) sichtbar/unsichtbar; wir lassen CSS regeln,
      // falls du inline styles verwendest, kannst du hier button.style.display = 'none' setzen.
    } else {
      // Auf small screens: button sollte sichtbar sein (CSS) — nichts weiter nötig
    }
  };
  window.addEventListener('resize', onResize);
  // initial sync
  onResize();
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggleButton');
  if (!btn) return;
  // kleine Verzögerung für nicer entrance
  setTimeout(() => btn.classList.add('visible'), 80);
});

// Fügt auf load + bei Änderung der Fenstergröße die Klasse "mobile" auf <body>.
// Das löst die CSS-Transition für #toggleButton aus, weil CSS auf body.mobile reagiert.

(function() {
  const mq = window.matchMedia('(max-width: 600px)');
  let resizeTimer = null;

  function applyMobileClass(shouldSet) {
    const body = document.body;
    if (shouldSet) {
      if (!body.classList.contains('mobile')) {
        body.classList.add('mobile');
        // optional: kleine Verzögerung, damit die Transition sichtbar wird
        // falls du ein "initial pop" willst, kannst du #toggleButton.visible setzen:
        const btn = document.getElementById('toggleButton');
        if (btn) {
          btn.classList.remove('visible');
          // kurz warten und sichtbar machen (gibt nice entrance)
          setTimeout(() => btn.classList.add('visible'), 40);
        }
      }
    } else {
      if (body.classList.contains('mobile')) {
        // entferne visible sofort um sanft ausblenden zu starten
        const btn = document.getElementById('toggleButton');
        if (btn) btn.classList.remove('visible');
        // etwas warten, damit die button-Transitions ablaufen, dann mobile-Klasse entfernen
        setTimeout(() => {
          document.body.classList.remove('mobile');
        }, 220); // 220ms passt zu deiner opacity-transition (320ms) — anpassbar
      }
    }
  }

  // initial setzen
  applyMobileClass(mq.matches);

  // Listener für matchMedia (modern)
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', (ev) => {
      // debounce/kleine Verzögerung, um flackern bei Resize zu vermeiden
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        applyMobileClass(ev.matches);
        resizeTimer = null;
      }, 40);
    });
  } else if (typeof mq.addListener === 'function') {
    // fallback für ältere Browser
    mq.addListener((ev) => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        applyMobileClass(ev.matches);
        resizeTimer = null;
      }, 80);
    });
  }

  // Optional: falls dein Code an anderer Stelle #toggleButton erstellt, stelle sicher,
  // dass es bereits vorhanden ist, bevor hier .visible gesetzt wird.
})();

document.addEventListener("DOMContentLoaded", () => {  
  const openAllDetails = () => {
    document.querySelectorAll("details").forEach(d => d.setAttribute("open", ""));
  };
  const restoreDetails = () => {
    document.querySelectorAll("details").forEach(d => d.removeAttribute("open"));
  };
  window.addEventListener("beforeprint", openAllDetails);
  window.addEventListener("afterprint", restoreDetails);
});

// Funktion, um mittels ?plaintext=true alle Anmerkungen etc zu entfernen:
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);

  if (params.get("plaintext") === "true") {

    document.querySelectorAll("span.anmerkung").forEach(el => el.remove());

    document.querySelectorAll("div.wide").forEach(el => el.remove());

    document.querySelectorAll("div.right").forEach(el => el.remove());
	  
    document.querySelectorAll("div.columns.paragraph").forEach(el => {
      el.classList.remove("columns");
    });

    document.querySelectorAll("div.gestrichen").forEach(el => el.remove());
  }
});


// Icons hinzufügen: 

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("summary.rechtsprechung").forEach(summary => {
    const wrapper = document.createElement("span");
    wrapper.innerHTML = `<i class="fa fa-scale-balanced fa-fw"></i>&ensp;Rechtsprechung: `;

    summary.insertBefore(wrapper, summary.firstChild);
  });
  document.querySelectorAll("summary.eugesetz").forEach(summary => {
    const wrapper = document.createElement("span");
    wrapper.innerHTML = `<i class="fa fa-euro-sign fa-fw"></i>&ensp;Unionsrecht: `;

    summary.insertBefore(wrapper, summary.firstChild);
  });
  document.querySelectorAll("summary.uebersicht").forEach(summary => {
    const wrapper = document.createElement("span");
    wrapper.innerHTML = `<i class="fa fa-pen-to-square fa-fw"></i>&ensp;Übersicht: `;

    summary.insertBefore(wrapper, summary.firstChild);
  });
  document.querySelectorAll("summary.beispiel").forEach(summary => {
    const wrapper = document.createElement("span");
    wrapper.innerHTML = `<i class="fa fa-lightbulb fa-fw"></i>&ensp;Beispiel: `;

    summary.insertBefore(wrapper, summary.firstChild);
  });
  document.querySelectorAll("summary.ausland").forEach(summary => {
    const wrapper = document.createElement("span");
    wrapper.innerHTML = `<i class="fa fa-globe fa-fw"></i>&ensp;Vergleich zum Ausland: `;

    summary.insertBefore(wrapper, summary.firstChild);
  });
});



// Dynamische Verweise mit ul.verweis
document.addEventListener("DOMContentLoaded", async function () {

    // --- 1. Dictionary mapping files to abbreviations ---
    const FILE_ABBREVIATIONS = {
		"ausbv.html": "AusbV",
		"eingabenk.html": "EingabenK",
        "gmg.html": "GMG",
        "hlschg.html": "HlSchG",
        "hlschv.html": "HlSchV",
        "mschg.html": "MSchG",
        "muschg.html": "MuSchG",
		"pag-valv.html": "PAG-ValV",
		"pag.html": "PAG",
        "patanwg.html": "PatAnwG",
        "patg.html": "PatG",
        "patv-eg.html": "PatV-EG",
        "pav.html": "PAV",
		"pvue.html": "PVÜ"
        "schzg.html": "SchZG",
        "sortschg.html": "SortSchG",
        "sortschv.html": "SortSchV",
        "standesrl.html": "StandesRL",
		"zustg.html": "ZustG",
    };

    // --- 2. Cache for fetched DOMs (key = filename) ---
    const PAGE_CACHE = {};

    // --- 3. Fetch-and-cache function ---
    async function fetchPageDOM(url) {
        if (PAGE_CACHE[url]) {
            return PAGE_CACHE[url];
        }
        const res = await fetch(url);
        const text = await res.text();
        const parser = new DOMParser();
        const dom = parser.parseFromString(text, "text/html");

        PAGE_CACHE[url] = dom;   // cache it
        return dom;
    }

    // --- 4. Extract structure from h4 while preserving HTML ---
    function extractSectionParts(h4) {
        const html = h4.innerHTML.trim();

        // Detect § or Art.
        let prefixMatch = html.match(/^(§|Art\.)\s*&nbsp;?/i);
        let prefix = prefixMatch ? prefixMatch[1] : "";

        // Remove prefix for remainder
        let remaining = prefixMatch ? html.slice(prefixMatch[0].length).trim() : html;

        // Section number until first space (supports <sup>, 32a, 43bis, etc.)
        let match = remaining.match(/^(.+?)(\s|$)/);
        let sectionIdentifierHTML = "";
        let restHTML = remaining;

        if (match) {
            sectionIdentifierHTML = match[1];
            restHTML = remaining.slice(match[1].length).trim();
        }

        return {
            prefix,
            sectionIdentifierHTML,
            restHTML
        };
    }

    // --- 5. Process all <li data="X.html#ID"> ---
    const placeholders = document.querySelectorAll("li[data]");

    for (let li of placeholders) {

        const target = li.getAttribute("data");
        if (!target) continue;

        let [page, hash] = target.split("#");
        const elementId = hash;

        try {
            const dom = await fetchPageDOM(page);
            const h4 = dom.querySelector("h4[id='" + elementId + "']");
            if (!h4) continue;

            const { prefix, sectionIdentifierHTML, restHTML } = extractSectionParts(h4);

            // Add required &nbsp; after § or Art.
            const safePrefix = prefix ? (prefix + "&nbsp;") : "";

            // Lookup  abbreviation
            const abbr = FILE_ABBREVIATIONS[page] || page;

            // Final HTML
            li.innerHTML =
                `<a href="${page}#${elementId}">${safePrefix}${sectionIdentifierHTML} ${abbr}</a>: ${restHTML}`;

        } catch (err) {
            console.error("Error processing", target, err);
        }
    }
});
