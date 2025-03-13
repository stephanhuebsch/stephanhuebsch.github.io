document.addEventListener("DOMContentLoaded", function() {
	const toc = document.getElementById("toc");
	const headings = document.querySelectorAll("h2, h3, h4");
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


