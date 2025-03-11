document.addEventListener("DOMContentLoaded", function() {
	const toc = document.getElementById("toc");
	const headings = document.querySelectorAll("h2, h3, h4");
	const list = document.createElement("p");
	headings.forEach(heading => {
		const li = document.createElement("p");
		li.style.margin = "6px";
		if (heading.classList.contains("gestrichen")) {
			li.style.fontStyle = "italic";
		}
		// Slight indent for h3 items
		if (heading.tagName === "H2") {
			li.style.fontWeight = "bold";
			li.textContent = li.textContent.toUpperCase();
			li.style.marginTop = "2px";
		}
		if (heading.tagName === "H3") {
			li.style.fontWeight = "bold";
			li.style.marginTop = "10px";
		}
		if (heading.tagName === "H4") {
			li.style.marginLeft = "18px";
		}
		const a = document.createElement("a");
		a.href = "#" + heading.id;
		a.textContent = heading.textContent;
		li.appendChild(a);
		list.appendChild(li);
	});
	toc.appendChild(list);
});
