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
    '<a href="patanwg.html">PatAnwG</a>' +
    '<a href="schzg.html">SchZG</a>' +
    '<a href="hlschg.html">HlSchG</a>' +
    '<a href="hlschv.html">HlSchV</a>' +
    '<a href="sortschg.html">SortSchG</a>' +
    '<a href="sortschv.html">SortSchV</a>' +
    //'<a href="uwg.html">UWG</a>' +
    //'<a href="urhg.html">UrhG</a>' +
    '<a href="pvue.html">PVÜ</a>' +
    '<a href="standesrl.html">StandesRL</a>' + 
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

document.addEventListener("DOMContentLoaded", function () {
  const toc = document.getElementById("toc");
  const container = document.querySelector(".container");

  // Create the resizer element
  const resizer = document.createElement("div");
  resizer.style.width = "8px";
  resizer.style.cursor = "ew-resize";
  resizer.style.position = "fixed";
  resizer.style.top = "0";
  resizer.style.bottom = "0";
  resizer.style.background = "transparent";

  document.body.appendChild(resizer);

  function updateLayout() {
    const tocRect = toc.getBoundingClientRect();
    resizer.style.left = tocRect.right + "px";

    if (container) {
      container.style.marginLeft = toc.offsetWidth + 0 + "px";
    }
  }

  // Initial setup
  updateLayout();
  window.addEventListener("resize", updateLayout);

  let isResizing = false;

  resizer.addEventListener("mousedown", function (e) {
    isResizing = true;
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  });

  document.addEventListener("mousemove", function (e) {
    if (!isResizing) return;

    const newWidth = e.clientX;
    const minWidth = 150;
    const maxWidth = 500;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      toc.style.width = newWidth + "px";
      updateLayout();
    }
  });

  document.addEventListener("mouseup", function () {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = "unset";
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {    const tocDiv = document.getElementById('toc');
    const containerDiv = document.querySelector('div.container');
    const button = document.createElement('button');

    // Check if tocDiv is hidden and show the button
    if (tocDiv && window.getComputedStyle(tocDiv).display === 'none') {
        // Apply button styles via external CSS class
        button.id = 'toggleButton'; // Assign ID for external styling
        button.innerHTML = '<i class="fa fa-list-ol"></i>'; // example icon
        document.body.appendChild(button); // Append button to body

        // Event listener for the button
        button.addEventListener('click', function() {
            if (containerDiv) {
                containerDiv.style.display = 'none';
                button.style.display = 'none';
            }
            if (tocDiv) {
                tocDiv.style.display = 'block';
            }
        });
    }

    // Event listener for all <a> tags to hide tocDiv and show containerDiv
    document.body.addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'a') {
            if (tocDiv && containerDiv) {
                tocDiv.style.display = 'none';
                containerDiv.style.display = 'block';
                button.style.display = 'block';
            }
        }
    });
});
