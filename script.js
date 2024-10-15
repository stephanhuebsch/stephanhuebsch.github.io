// Obere Reihe der buttons "Patent", "Marke", "Muster"

function setActiveButton(buttonIndex) {
    // Get all buttons
    const buttons = document.getElementsByClassName("top-row");

    // Remove the 'active' class from all buttons
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    // Add the 'active' class to the clicked button
    buttons[buttonIndex].classList.add("active");
}

// Nach Klick auf top-row button entsprechende Elemente ein/ausblenden
// Nicht schön, aber funktioniert...

function toggleVisibility(IPType) {
    if (IPType == "patent") {
        var elements = document.getElementsByClassName("patent");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.nodeName.toLowerCase() === 'a' || element.nodeName.toLowerCase() === 'button' || element.nodeName.toLowerCase() === 'h3') {
                // Check if inside a span = inside a dropdown:
                var isInSpan = element.closest('span');
                
                if (isInSpan || element.nodeName.toLowerCase() === 'h3') {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'inline';
                }
            }
            else {
                element.style.display = 'flex';
            }
        }
        var elements = document.getElementsByClassName("marke");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.style.display = 'none';
        }
        var elements = document.getElementsByClassName("muster");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.style.display = 'none';
        }
    }
    if (IPType == "marke") {
        var elements = document.getElementsByClassName("patent");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.style.display = 'none';
        }
        var elements = document.getElementsByClassName("marke");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.nodeName.toLowerCase() === 'a' || element.nodeName.toLowerCase() === 'button') {
                element.style.display = 'inline';
            }
            else {
                element.style.display = 'flex';
            }
        }
        var elements = document.getElementsByClassName("muster");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.style.display = 'none';
        }
    }
    if (IPType == "muster") {
        var elements = document.getElementsByClassName("patent");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.style.display = 'none';
        }
        var elements = document.getElementsByClassName("marke");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.style.display = 'none';
        }
        var elements = document.getElementsByClassName("muster");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.nodeName.toLowerCase() === 'a' || element.nodeName.toLowerCase() === 'button') {
                element.style.display = 'inline';
            }
            else {
                element.style.display = 'flex';
            }
        }
    }
}

function jumpToEPC() {
    x = prompt("Artikel: a87\nAusfO: r12a\nGebO: g2");
    if(/[aA][1-9][0-9]{0,2}[a-z]{0,1}/.test(x)) {
        window.location = "https://www.epo.org/de/legal/epc/2020/a" + x.substring(1) + ".html"  
    }  
    else if(/[rR][1-9][0-9]{0,2}[a-z]{0,1}/.test(x)) {   
        window.location = "https://www.epo.org/de/legal/epc/2020/r" + x.substring(1) + ".html"  
    }  
    else if(/[fFgG][1-9][0-9]{0,1}[a-z]{0,1}/.test(x)) {   
        window.location = "https://www.epo.org/de/legal/epc/2020/f" + x.substring(1) + ".html"  
    }  
    //else {   
    //    window.location = "https://www.epo.org//law-practice/legal-texts/html/epc/2020/d/index.html"  
    //}
}

function jumpToPCT() {
    x = prompt("Artikel: a19\nAusfO: r13bis\nVerwV: v104");  
    if(/[aA][1-9][0-9]{0,2}[a-z]{0,9}/.test(x)){   
        window.location = "https://www.wipo.int/pct/de/texts/articles/a" + x.substring(1) + ".html"  
    }  
    else if(/[rR][1-9][0-9]{0,2}[a-z]{0,9}/.test(x)){   
        window.location = "https://www.wipo.int/pct/en/texts/rules/r" + x.substring(1) + ".html"  
    }  
    else if(/[sSvV][1-9][0-9]{2}[a-z]{0,9}/.test(x)){   
        window.location = "https://www.wipo.int/pct/en/texts/ai/s" + x.substring(1) + ".html"  
    }  
    //else {   
    //    window.location = "https://www.wipo.int/pct/de/texts/index.html"  
    //}
}

function jumpToPatG() {
    x = prompt("PatG 1970, bitte gewünschten Paragraphen eingeben:");
    if(/[1-9][0-9]{0,2}[a-z]{0,1}/.test(x)) {
        window.location = "http://www.ris.bka.gv.at/Ergebnis.wxe?Abfrage=Bundesnormen&Index=&Titel=Patentgesetz&VonParagraf=" + x + "&BisParagraf=" + x + "&SkipToDocumentPage=true"
    }
    //else {
    //    window.location = "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002181"
    //}
}

function jumpToRL() {
    a = prompt("EPA Prüfungsrichtlinien 2023, Teil und Kapitel (zB d3) eingeben:");
    if(a.substring(1) == "1") {x = "i";}
    else if(a.substring(1) == "2") {x = "ii"}
    else if(a.substring(1) == "3") {x = "iii"}
    else if(a.substring(1) == "4") {x = "iv"}
    else if(a.substring(1) == "5") {x = "v"}
    else if(a.substring(1) == "6") {x = "vi"}
    else if(a.substring(1) == "7") {x = "vii"}
    else if(a.substring(1) == "8") {x = "viii"}
    else if(a.substring(1) == "9") {x = "ix"}
    else if(a.substring(1) == "10") {x = "x"}
    else if(a.substring(1) == "11") {x = "xi"}
    else if(a.substring(1) == "12") {x = "xii"}
    else if(a.substring(1) == "13") {x = "xiii"}
    else if(a.substring(1) == "14") {x = "xiv"}
    window.location = "https://www.epo.org/de/legal/guidelines-epc/2023/" + a.substring(0,1).toLowerCase() + "_" + x + ".html";
}

function jumpToRIS() {
    x = prompt("Bitte Abkürzung des Gesetzes eingeben:");
    a = "";
    if(["abgb"].includes(x.toLowerCase())) {a = "10001622"}
    else if(["patg"].includes(x.toLowerCase())) {a = "10002181"}
    else if(["schzg"].includes(x.toLowerCase())) {a = "10003470"}
    else if(["hlschg"].includes(x.toLowerCase())) {a = "10002876"}
    else if(["sortschg"].includes(x.toLowerCase())) {a = "20001503"}
    else if(["ppg"].includes(x.toLowerCase())) {a = "20010791"}
    else if(["urhg"].includes(x.toLowerCase())) {a = "10001848"}
    else if(["uwg"].includes(x.toLowerCase())) {a = "10002665"}
    else if(["pag"].includes(x.toLowerCase())) {a = "20003819"}
    else if(["gmg"].includes(x.toLowerCase())) {a = "10003230"}
    else if(["patawg"].includes(x.toLowerCase())) {a = "10002093"}
    else if(["bvg", "b-vg"].includes(x.toLowerCase())) {a = "10000138"}
    else if(["patv-eg", "patveg", "patv eg"].includes(x.toLowerCase())) {a = "10002458"}
    else if(["stgb"].includes(x.toLowerCase())) {a = "10002296"}
    else if(["fagg"].includes(x.toLowerCase())) {a = "20008847"}
    else if(["kschg"].includes(x.toLowerCase())) {a = "10002462"}
    else if(["zpo"].includes(x.toLowerCase())) {a = "10001699"}
    else if(["ug"].includes(x.toLowerCase())) {a = "20002128"}
    else if(["stvo"].includes(x.toLowerCase())) {a = "10011336"}
    if(a.length > 0) {
        window.location = "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=" + a;
    }
}

// swipe gestures

document.addEventListener('DOMContentLoaded', function() {

    var startX;

    document.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
    });

    document.addEventListener('touchend', function(event) {
        var endX = event.changedTouches[0].clientX;
        var deltaX = endX - startX;
        
        // get currently active top-row button
        var allButtons = Array.from(document.getElementsByClassName("top-row"));

        if (deltaX > 100) {
        
            // Right swipe -> move selected button to the left
            if (allButtons[1].classList.contains("active")) {
                toggleVisibility('patent');
                setActiveButton(0);
            }
            else if (allButtons[2].classList.contains("active")) {
                toggleVisibility('marke');
                setActiveButton(1)
            }
        
        } else if (deltaX < -100) {
            // Left swipe -> move selected button to the right
            if (allButtons[1].classList.contains("active")) {
                toggleVisibility('muster');
                setActiveButton(2)
            }
            else if (allButtons[0].classList.contains("active")) {
                toggleVisibility('marke');
                setActiveButton(1)
            }
        
        }
    });

});

// left/right arrow keys

document.addEventListener('DOMContentLoaded', function() {
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        
            var allButtons = Array.from(document.getElementsByClassName("top-row"));
            
            if (allButtons[0].classList.contains("active") && event.key === 'ArrowRight') {
                toggleVisibility('marke');
                setActiveButton(1);
            }
            
            else if (allButtons[1].classList.contains("active") && event.key === 'ArrowRight') {
                toggleVisibility('muster');
                setActiveButton(2);
            }
            
            else if (allButtons[1].classList.contains("active") && event.key === 'ArrowLeft') {
                toggleVisibility('patent');
                setActiveButton(0);
            }
            
            else if (allButtons[2].classList.contains("active") && event.key === 'ArrowLeft') {
                toggleVisibility('marke');
                setActiveButton(1);
            }
            
        }

    });  

});




document.addEventListener('DOMContentLoaded', function() {
    // Font Awesome icon as HTML
    const symbol = ' &thinsp;<span class="fa-solid fa-file-text"></span>';

    // Select all <a> elements with an href attribute ending in .pdf
    document.querySelectorAll('a[href$=".pdf"]').forEach(function(link) {
        // Get the corresponding button inside the link, if it exists
        const button = link.querySelector('button');

        if (button) {
            // Append the Font Awesome icon to the button text using innerHTML
            button.innerHTML += symbol;  // Use innerHTML to add HTML content
        } else {
            // Get the button element that is outside the <a> tag (if <a> is inside a <button>)
            const parentButton = link.closest('button');

            if (parentButton) {
                // Append the Font Awesome icon to the <a> element's text content using innerHTML
                link.innerHTML += symbol;  // Use innerHTML to add HTML content
            }
        }
    });
});




document.addEventListener('DOMContentLoaded', function() {
    let navigationUrl = ""; // Variable to store the clicked URL

    document.querySelectorAll('a, .dropdown-content a').forEach(link => {
        link.addEventListener('click', function (e) {
            // Check if Ctrl key is held or if it's a middle mouse click (button 1)
            if (e.ctrlKey) {
                return; // Skip overlay and allow normal behavior: open in new tab
            }
            
            // Store the clicked link URL
            navigationUrl = link.href;

            // Check if the link ends with .pdf and skip overlay if it does
            if (link.href.endsWith('.pdf')) {
                return; // Exit the event handler without further actions
            }
            
            e.preventDefault(); // Prevent navigation temporarily for non-PDF links
            const overlay = document.getElementById('loadingOverlay');
            overlay.style.display = 'flex';

            // Save state in sessionStorage to detect back navigation
            sessionStorage.setItem('overlayShown', 'true');
            
            // Trigger actual navigation after showing overlay
            window.location.href = link.href;
        });
    });

    // Show overlay on page unload if not a .pdf link and not a reload
    window.addEventListener('beforeunload', function () {
        // Only show the overlay if the navigation URL does not end with .pdf and it's not a reload
        if (!navigationUrl.endsWith('.pdf') && performance.navigation.type !== 1) {
            const overlay = document.getElementById('loadingOverlay');
            overlay.style.display = 'flex';
        }
    });

    // Hide overlay if navigating back
    window.addEventListener('pageshow', function (event) {
        const overlay = document.getElementById('loadingOverlay');
        if (sessionStorage.getItem('overlayShown') === 'true' && event.persisted) {
            overlay.style.display = 'none'; // Hide overlay if returning to the page
            sessionStorage.removeItem('overlayShown'); // Clear the flag for the next session
        }
    });
});
