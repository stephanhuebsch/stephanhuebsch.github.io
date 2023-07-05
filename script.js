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
            if (element.nodeName.toLowerCase() === 'a' || element.nodeName.toLowerCase() === 'button') {
                element.style.display = 'inline';
            }
            else {
                element.style.display = 'block';
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
            if (element.nodeName.toLowerCase() === 'a') {
                element.style.display = 'inline';
            }
            else {
                element.style.display = 'block';
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
            if (element.nodeName.toLowerCase() === 'a') {
                element.style.display = 'inline';
            }
            else {
                element.style.display = 'block';
            }
        }
    }
}

function jumpToEPC() {
    x = prompt("Artikel EPÜ\t→\ta87\nAusfOrd\t→\tr12a\nGebOrd\t→\tf2");
    if(/[a][1-9][0-9]{0,2}[a-z]{0,1}/.test(x)) {
        window.location = "https://www.epo.org//law-practice/legal-texts/html/epc/2020/d/ar" + x.substring(1) + ".html"  
    }  
    else if(/[r][1-9][0-9]{0,2}[a-z]{0,1}/.test(x)) {   
        window.location = "https://www.epo.org//law-practice/legal-texts/html/epc/2020/d/" + x + ".html"  
    }  
    else if(/[f][1-9][0-9]{0,1}[a-z]{0,1}/.test(x)) {   
        window.location = "https://www.epo.org//law-practice/legal-texts/html/epc/2020/d/articl" + x.substring(1) + ".html"  
    }  
    else {   
        window.location = "https://www.epo.org//law-practice/legal-texts/html/epc/2020/d/index.html"  
    }
}

function jumpToPCT() {
    x = prompt("Artikel PCT\t→\ta19\nAusfOrd\t→\tr13bis\nVerwVor\t→\ts104");  
    if(/[a][1-9][0-9]{0,2}[a-z]{0,9}/.test(x)){   
        window.location = "https://www.wipo.int/pct/en/texts/articles/" + x + ".html"  
    }  
    else if(/[r][1-9][0-9]{0,2}[a-z]{0,9}/.test(x)){   
        window.location = "https://www.wipo.int/pct/en/texts/rules/" + x + ".html"  
    }  
    else if(/[s][1-9][0-9]{2}[a-z]{0,9}/.test(x)){   
        window.location = "https://www.wipo.int/pct/en/texts/ai/" + x + ".html"  
    }  
    else {   
        window.location = "https://www.wipo.int/pct/de/texts/index.html"  
    }
}

function jumpToPatG() {
    x = prompt("Patentgesetz 1970");  
    if(/^[1-9][0-9]{0,2}[a-z]{0,1}$/.test(x)){   
        window.location = "https://www.jusline.at/gesetz/patg/paragraf/" + x
    } 
    else {   
        window.location = "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002181"  
    }
}

// swipe gesture

document.addEventListener('DOMContentLoaded', function() {

    var startX;

    document.body.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
    });

    document.body.addEventListener('touchend', function(event) {
        var endX = event.changedTouches[0].clientX;
        var deltaX = endX - startX;
        
        // get currently active top-row button
        var allButtons = Array.from(document.getElementsByClassName("top-row"));

        if (deltaX > 20) {
        
            // Right swipe -> move selected button to the left
            if (allButtons[1].classList.contains("active")) {
                setActiveButton(0);
            }
            else if (allButtons[2].classList.contains("active")) {
                setActiveButton(1);
            }
        
        } else if (deltaX < -20) {
            // Left swipe -> move selected button to the right
            if (allButtons[1].classList.contains("active")) {
                setActiveButton(2);
            }
            else if (allButtons[0].classList.contains("active")) {
                setActiveButton(1);
            }
        
        }
    });

});
