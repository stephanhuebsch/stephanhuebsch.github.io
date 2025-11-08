document.addEventListener("DOMContentLoaded", function() {
	const toc = document.getElementById("toc");
	const allHeadings = document.querySelectorAll("h2, h3, h4");
    const headings = Array.from(allHeadings).filter(heading => !heading.classList.contains('not_toc'));

	const list = document.createElement("p");
	
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
    '<a href="pav.html">PAV</a>' +
    '<a href="schzg.html">SchZG</a>' +
    '<a href="patanwg.html">PatAnwG</a>' +
    '<a href="standesrl.html">StandesRL</a>' + 
    '<a href="hlschg.html">HlSchG</a>' +
    '<a href="hlschv.html">HlSchV</a>' +
    '<a href="sortschg.html">SortSchG</a>' +
    '<a href="sortschv.html">SortSchV</a>' +
    //'<a href="uwg.html">UWG</a>' +
    //'<a href="urhg.html">UrhG</a>' +
    '<a href="pvue.html">PVÜ</a>' +
    '<a href="ausbv.html">AusbV</a>' + 
    '<a href="pag.html">PAG</a>' + 
    '<a href="pag-valv.html">PAG-ValV</a>' + 
    '<a href="eingabenk.html">EingabenK</a>' + 
    '<a href="zustg.html">ZustG</a>';

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
    if (document.body.classList.contains('toc-open')) {
      if (!e.target.closest('#toc') && !e.target.closest('#toggleButton')) {
        closeToc();
      }
    }
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

