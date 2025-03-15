document.addEventListener("DOMContentLoaded", function() {
	const toc = document.getElementById("toc");
	const allHeadings = document.querySelectorAll("h2, h3, h4");
    const headings = Array.from(allHeadings).filter(heading => !heading.classList.contains('not_toc'));

	const list = document.createElement("p");
	
	// Determine if there are any h2 elements
    const hasH2 = Array.from(headings).some(heading => heading.tagName === "H2");
    
	headings.forEach(heading => {
		const li = document.createElement("p");
		li.style.margin = "6px";
		const a = document.createElement("a");
		a.href = "#" + heading.id;
		
        // Set margins based on the tag and whether an h2 is present
        if (heading.tagName === "H2") {
            li.style.marginLeft = "0px";
            li.style.fontWeight = "bold";
            a.textContent = heading.textContent.toUpperCase();
        } else if (heading.tagName === "H3") {
            li.style.marginLeft = hasH2 ? "20px" : "0px";
            li.style.fontWeight = "bold";
            a.textContent = heading.textContent;
        } else if (heading.tagName === "H4") {
            li.style.marginLeft = hasH2 ? "40px" : "20px";
            a.textContent = heading.textContent;
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
    rootMargin: '0px',    // No extra margin around the viewport
    threshold: 0.2        // Fires when 80% of the section is visible
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
    '<a href="uwg.html">UWG</a>' +
    '<a href="urhg.html">UrhG</a>' +
    '<a href="pvue.html">PVÜ</a>' +
    '<a href="standesrl.html">StandesRL</a>';

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
            console.log("was active, will remove this class now");
            this.classList.remove("active");
            document.getElementById("top").style.height = "30px";
            //this.innerHTML = "▼";
        } else {
            console.log("was not active, will now be active");
            this.classList.add("active");
            document.getElementById("top").style.height = "auto";
            //this.innerHTML = "▲";
        }
    });
});


// check for resize to make the #expandButton appear:

document.addEventListener("DOMContentLoaded", function() {
  const topElement = document.getElementById("top");
  const expandButton = document.getElementById("expandButton");

  function checkOverflow() {
    console.log("scrollHeight:", topElement.scrollHeight, "clientHeight:", topElement.clientHeight);
    if (!expandButton.classList.contains("active")) { // nicht aktiv, i.e. eingeklappt
      if (topElement.scrollHeight-5 < topElement.clientHeight) { // keine zweite Zeile
        expandButton.style.display = "none";
      } else {                                                  // mehr als eine Zeile
        expandButton.style.display = "inline";
      }
    } else if (expandButton.classList.contains("active")) { // aktiv, i.e. ausgeklappt
      if (topElement.scrollHeight > 60) {                   // keine zweite Zeile
        expandButton.style.display = "inline";
      } else {                                                  // mehr als eine Zeile
        expandButton.style.display = "none";
      }
    } else {
     console.log("Unbekannter Fehler!");
    }
  }
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
});

