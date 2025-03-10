(function() {
	// ------------------------
	// Define mapping objects
	// ------------------------
	const mappingsOriginal = {
		// ------------------------
		// Österreich: IP
		// ------------------------
		"PatG": {
			vollerName: "Patentgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002181",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002181&Paragraf={num}"
		},
		"GMG": {
			vollerName: "Gebrauchsmustergesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003230",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003230&Paragraf={num}"
		},
		"PatV-EG": {
			vollerName: "Patentverträge-Einführungsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002458",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002458&Paragraf={num}"
		},
		"PatAnwG": {
			vollerName: "Patentanwaltsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002093",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002093&Paragraf={num}"
		},
		"PAG": {
			vollerName: "Patentamtsgebührengesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20003819",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20003819&Paragraf={num}"
		},
		"MSchG": {
			vollerName: "Markenschutzgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002180",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002180&Paragraf={num}"
		},
		"MuSchG": {
			vollerName: "Musterschutzgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002963",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002963&Paragraf={num}"
		},
		"SchZG": {
			vollerName: "Schutzzertifikatsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003470",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003470&Paragraf={num}"
		},
		"SortSchG": {
			vollerName: "Sortenschutzgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001503",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001503&Paragraf={num}"
		},
		"HlSchG": {
			vollerName: "Halbleiterschutzgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002876",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002876&Paragraf={num}"
		},
		"UWG": {
			vollerName: "Gesetz gegen den unlauteren Wettbewerb",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002665",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002665&Paragraf={num}"
		},
		"UrhG": {
			vollerName: "Urheberrechtsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001848",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001848&Paragraf={num}"
		},
		// ------------------------
		// Österreich: allgemein
		// ------------------------
		"ABGB": {
			vollerName: "Allgemeines bürgerliches Gesetzbuch",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001622",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001622&Paragraf={num}"
		},
		"AktG": {
			vollerName: "Aktiengesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002070",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002070&Paragraf={num}"
		},
		"ASGG": {
			vollerName: "Arbeits- und Sozialgerichtsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000813",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000813&Paragraf={num}"
		},
		"AStG": {
			vollerName: "Alternative-Streitbeilegung-Gesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20009242",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20009242&Paragraf={num}"
		},
		"AußStrG": {
			vollerName: "Außerstreitgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20003047",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20003047&Paragraf={num}"
		},
		"AVG": {
			vollerName: "Allgemeines Verwaltungsverfahrensgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10005768",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10005768&Paragraf={num}"
		},
		"B-VG": {
			vollerName: "Bundes-Verfassungsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000138",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000138&Artikel={num}"
		},
		"BWG": {
			vollerName: "Bankwesengesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10004827",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10004827&Paragraf={num}"
		},
		"DepotG": {
			vollerName: "Depotgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002142",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002142&Paragraf={num}"
		},
		"EGEO": {
			vollerName: "Einführungsgesetz zur Exekutionsordnung",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001916",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001916&Artikel={num}"
		},
		"EGJN": {
			vollerName: "Einführungsgesetz zur Jurisdiktionsnorm",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001696",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001696&Artikel={num}"
		},
		"EGZPO": {
			vollerName: "Einführungsgesetz zur Zivilprozessordnung",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001698",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001698&Artikel={num}"
		},
		"EO": {
			vollerName: "Exekutionsordnung",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001700",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001700&Paragraf={num}"
		},
		"FlexKapGG": {
			vollerName: "Flexible-Kapitalgesellschafts-Gesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20012473",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20012473&Paragraf={num}"
		},
		"GebG": {
			vollerName: "Gebührengesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003882",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003882&Paragraf={num}"
		},
		"GEO": {
			vollerName: "Geschäftsordnung für die Gerichte I. und II. Instanz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000240",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000240&Paragraf={num}"
		},
		"GmbHG": {
			vollerName: "GmbH-Gesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001720",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001720&Paragraf={num}"
		},
		"GOG": {
			vollerName: "Gerichtsorganisationsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000009",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000009&Paragraf={num}"
		},
		"IEG": {
			vollerName: "Insolvenzrechtseinführungsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001735",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001735&Paragraf={num}"
		},
		"IESG": {
			vollerName: "Insolvenz-Entgeltsicherungsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008418",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008418&Paragraf={num}"
		},
		"IO": {
			vollerName: "Insolvenzordnung",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001736",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001736&Paragraf={num}"
		},
		"JN": {
			vollerName: "Jurisdiktionsnorm",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001697",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001697&Paragraf={num}"
		},
		"KartG": {
			vollerName: "Kartellgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20004174",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20004174&Paragraf={num}"
		},
		"KMG": {
			vollerName: "Kapitalmarktgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010729",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010729&Paragraf={num}"
		},
		"KSchG": {
			vollerName: "Konsumentenschutzgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002462",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002462&Paragraf={num}"
		},
		"OGHG": {
			vollerName: "Bundesgesetz über den Obersten Gerichtshof",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000449",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000449&Paragraf={num}"
		},
		"PPG": {
			vollerName: "Produktpirateriegesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010791",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010791&Paragraf={num}"
		},
		"Reo": {
			vollerName: "Restrukturierungsordnung",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011622",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011622&Paragraf={num}"
		},
		"RpflG": {
			vollerName: "Rechtspflegergesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002703",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002703&Paragraf={num}"
		},
		"UGB": {
			vollerName: "Unternehmergesetzbuch",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001702",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001702&Paragraf={num}"
		},
		"URG": {
			vollerName: "Unternehmensreorganisationsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003479",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003479&Paragraf={num}"
		},
		"VfGG": {
			vollerName: "Verfassungsgerichtshofgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000245",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000245&Paragraf={num}"
		},
		"VwGG": {
			vollerName: "Verwaltungsgerichtshofgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000795",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000795&Paragraf={num}"
		},
		"WechselG": {
			vollerName: "Wechselgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001934",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001934&Artikel={num}"
		},
		"WettbG": {
			vollerName: "Wettbewerbsgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001898",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001898&Paragraf={num}"
		},
		"ZPO": {
			vollerName: "Zivilprozessordnung",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001699",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001699&Paragraf={num}"
		},
		"ZustG": {
			vollerName: "Zustellgesetz",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10005522",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10005522&Paragraf={num}"
		},
		// ------------------------
		// Europa
		// ------------------------
		"EPÜ": {
			vollerName: "Europäisches Patentübereinkommen",
			gesamterText: "https://www.epo.org/de/legal/epc/2020/convention.html",
			einzelneNorm: "https://www.epo.org/de/legal/epc/2020/a{num}.html"
		},
		"EPÜ AusfO": {
			vollerName: "Europäisches Patentübereinkommen Ausführungsordnung",
			gesamterText: "https://www.epo.org/de/legal/epc/2020/regulations.html",
			einzelneNorm: "https://www.epo.org/de/legal/epc/2020/r{num}.html"
		},
		"EPÜ GebO": {
			vollerName: "Europäisches Patentübereinkommen Gebührenordnung",
			gesamterText: "https://www.epo.org/de/legal/epc/2020/rfees.html",
			einzelneNorm: "https://www.epo.org/de/legal/epc/2020/f{num}.html"
		},
		"EPGÜ": {
			vollerName: "Übereinkommen über ein einheitliches Patentgericht",
			gesamterText: "https://www.epo.org/de/legal/up-upc/2022/upca.html",
			einzelneNorm: "https://www.epo.org/de/legal/up-upc/2022/upca_{num}.html"
		},
		"UPCA": {
			vollerName: "Agreement on a Unified Patent Court",
			gesamterText: "https://www.epo.org/de/legal/up-upc/2022/upca.html",
			einzelneNorm: "https://www.epo.org/de/legal/up-upc/2022/upca_{num}.html"
		},
		"DOEPS": {
			vollerName: "Durchführungsordnung zum einheitlichen Patentschutz",
			gesamterText: "https://www.epo.org/de/legal/up-upc/2022/upr.html",
			einzelneNorm: "https://www.epo.org/de/legal/up-upc/2022/upr_{num}.html"
		},
		"UPR": {
			vollerName: "Rules relating to Unitary Patent Protection",
			gesamterText: "https://www.epo.org/de/legal/up-upc/2022/upr.html",
			einzelneNorm: "https://www.epo.org/de/legal/up-upc/2022/upr_{num}.html"
		},
		"GebOEPS": {
			vollerName: "Gebührenordnung zum einheitlichen Patentschutz",
			gesamterText: "https://www.epo.org/de/legal/up-upc/2022/upf.html",
			einzelneNorm: "https://www.epo.org/de/legal/up-upc/2022/upf_{num}.html"
		},
		"VO 1257/2012": {
			vollerName: "VO 1257/2012",
			gesamterText: "https://www.epo.org/de/legal/up-upc/2022/eu20121257.html",
			einzelneNorm: "https://www.epo.org/de/legal/up-upc/2022/eu20121257_{num}.html"
		},
		"VO 1260/2012": {
			vollerName: "VO 1260/2012",
			gesamterText: "https://www.epo.org/de/legal/up-upc/2022/eu20121260.html",
			einzelneNorm: "https://www.epo.org/de/legal/up-upc/2022/eu20121260_{num}.html"
		},
		"UMV": {
			vollerName: "Unionsmarkenverordnung",
			gesamterText: "https://eur-lex.europa.eu/legal-content/DE/TXT/?qid=1506417891296&uri=CELEX:32017R1001",
			einzelneNorm: "https://eur-lex.europa.eu/legal-content/DE/TXT/?qid=1506417891296&uri=CELEX:32017R1001#art_{num}"
		},
		"Brüssel Ia": {
			vollerName: "Europäische Gerichtsstands- und Vollstreckungsverordnung",
			gesamterText: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02012R1215-20150226",
			einzelneNorm: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02012R1215-20150226"
		},
		"EuGVVO": {
			vollerName: "Europäische Gerichtsstands- und Vollstreckungsverordnung",
			gesamterText: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02012R1215-20150226",
			einzelneNorm: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02012R1215-20150226"
		},
		"EuInsVO": {
			vollerName: "Europäische Verordnung über Insolvenzverfahren",
			gesamterText: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32015R0848",
			einzelneNorm: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32015R0848"
		},
		// ------------------------
		// International
		// ------------------------
		"Genfer Akte": {
			vollerName: "Haager Musterabkommen Genfer Akte",
			gesamterText: "https://www.wipo.int/wipolex/en/text/285214",
			einzelneNorm: "https://www.wipo.int/wipolex/en/text/285214#article{num}"
		},
		"MMP": {
			vollerName: "Madrider Markenprotokoll",
			gesamterText: "https://www.wipo.int/wipolex/en/text/283484",
			einzelneNorm: "https://www.wipo.int/wipolex/en/text/283484"
		},
		"MMP AusfO": {
			vollerName: "Madrider Markenprotokoll Ausführungsordnung",
			gesamterText: "https://www.wipo.int/wipolex/en/text/586467",
			einzelneNorm: "https://www.wipo.int/wipolex/en/text/586467#rule{num}"
		},
		"PVÜ": {
			vollerName: "Pariser Verbandsübereinkunft",
			gesamterText: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002271",
			einzelneNorm: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002271&Artikel={num}"
		},
		"PCT": {
			vollerName: "Patentzusammenarbeitsvertrag",
			gesamterText: "https://www.wipo.int/pct/de/texts/articles/atoc.html",
			einzelneNorm: "https://www.wipo.int/pct/de/texts/articles/a{num}.html"
		},
		"PCT AusfO": {
			vollerName: "Patentzusammenarbeitsvertrag Ausführungsordnung",
			gesamterText: "https://www.wipo.int/pct/en/texts/rules/rtoc_short.html",
			einzelneNorm: "https://www.wipo.int/pct/en/texts/rules/r{num}.html"
		},
		"PCT VerwV": {
			vollerName: "Patentzusammenarbeitsvertrag Verwaltungsvorschriften",
			gesamterText: "https://www.wipo.int/pct/en/texts/ai/ai_index.html",
			einzelneNorm: "https://www.wipo.int/pct/en/texts/ai/s{num}.html"
		}
	};

	// bis, ter -> a, b (zB für PVÜ im RIS)
	const bis_zu_a = {
		"bis": "a",
		"quater": "c",
		"ter": "b", // ter muss nach quater kommen, weil sonst [qua]ter gematcht wird
		"quinquies": "d",
		"sexies": "e",
		"septies": "f",
		"octies": "g",
		"novies": "h",
		"decies": "i"
	};

	// -------------------------
	// Build normalized mapping objects (lowercase & ignore hyphens)
	// -------------------------
	function buildNormalizedMapping(mappingOriginal) {
		const normalized = {};
		Object.keys(mappingOriginal).forEach(key => {
			normalized[key.toLowerCase().replace(/-/g, '')] = mappingOriginal[key];
		});
		return normalized;
	}

	const mappingsNorm = buildNormalizedMapping(mappingsOriginal);

	// -------------------------
	// Build lower-case lookup objects for suggestions (keep original casing for display)
	// -------------------------
	const alleGesetze = [...Object.keys(mappingsOriginal)].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

	// -------------------------
	// Create modal elements
	// -------------------------
	let modal = document.createElement("div");
	modal.style.position = "fixed";
	modal.style.maxWidth = "350px";
	modal.style.lineHeight = "18px";
	modal.style.top = "50%";
	modal.style.left = "50%";
	modal.style.transform = "translate(-50%, -50%)";
	modal.style.background = "#F1F3F5";
	modal.style.padding = "20px";
	modal.style.borderRadius = "10px";
	modal.style.boxShadow = "rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px, rgb(0, 0, 0) -1px 1px 0px";
	modal.style.borderBottom = "6px solid #888";
	modal.style.zIndex = "10000";
	modal.style.textAlign = "center";
	modal.style.fontSize = "16px";
	modal.style.fontFamily = "Arial";
	modal.style.hyphens = "auto";
	modal.style.lineHeight = "20px";

	let p_title = document.createElement("p");
	p_title.style.fontSize = "16px";
	p_title.style.margin = "0 0 10px 0";
	p_title.style.fontWeight = "bold";
	p_title.style.color = "#333";
	p_title.style.lineHeight = "20px";
	p_title.textContent = "Gesetzestexte";

	let p_text = document.createElement("p");
	p_text.style.fontSize = "14px";
	p_text.style.margin = "0 0 10px 0";
	p_text.style.color = "#333";
	p_text.style.textAlign = "left";
	p_text.style.lineHeight = "20px";
	p_text.innerHTML = "Bitte ein <abbr title='zB PatG, ZPO, EPÜ, ...'>Gesetz</abbr> oder einen <abbr title='zB 22a PatG, 393 ZPO, 123 EPÜ, ...'>konkreten Paragraphen/Artikel</abbr> eingeben:";
	modal.appendChild(p_title);
	modal.appendChild(p_text);

	// Close button
	let closeButton = document.createElement("button");
	closeButton.textContent = "✕";
	closeButton.classList.add("hoverRed");
	closeButton.style.position = "absolute";
	closeButton.style.top = "3px";
	closeButton.style.right = "3px";
	closeButton.style.backgroundColor = "rgba(0, 0, 0, 0)";
	closeButton.style.color = "#333";
	closeButton.style.border = "none";
	closeButton.style.borderRadius = "6px";
	closeButton.style.cursor = "pointer";
	closeButton.style.width = "20px";
	closeButton.style.height = "20px";
	closeButton.style.fontSize = "12px";
	closeButton.style.lineHeight = "20px";
	closeButton.style.padding = "0";
	closeButton.style.boxShadow = "none";
	closeButton.style.textShadow = "none";
	closeButton.onclick = function() {
		modal.remove();
		document.removeEventListener("keydown", escHandler);
		document.body.style.cursor = "default";
	};
	modal.appendChild(closeButton);

	// Input container
	let inputContainer = document.createElement("div");
	inputContainer.style.position = "relative";
	inputContainer.style.display = "flex";
	inputContainer.style.width = "80%";
	inputContainer.style.marginLeft = "10%";
	inputContainer.style.marginRight = "10%";
	inputContainer.style.lineHeight = "20px";
	modal.appendChild(inputContainer);

	// Input field
	let input = document.createElement("input");
	input.type = "text";
	input.placeholder = "PatG, 15a GMG, ...";
	input.style.backgroundColor = "white";
	input.style.color = "#333";
	input.style.fontFamily = "Arial";
	input.style.padding = "5px";
	input.style.margin = "0";
	input.style.fontSize = "16px";
	input.style.width = "70%";
	input.style.border = "1px solid #888";
	input.style.borderRadius = "5px";
	input.style.outline = "none";
	input.style.lineHeight = "20px";
	input.style.cursor = "auto";
	input.style.height = "auto";
	input.style.boxShadow = "none";
	input.style.boxSizing = "border-box";
	inputContainer.appendChild(input);

	// Suggestions dropdown
	let suggestions = document.createElement("ul");
	suggestions.style.listStyleType = "none";
	suggestions.style.textAlign = "left";
	suggestions.style.fontFamily = "Arial";
	suggestions.style.color = "#333";
	suggestions.style.lineHeight = "20px";
	suggestions.style.padding = "0";
	suggestions.style.margin = "5px 0 0 0";
	suggestions.style.maxHeight = "150px";
	suggestions.style.overflowY = "auto";
	suggestions.style.border = "1px solid #888";
	suggestions.style.borderRadius = "5px";
	suggestions.style.position = "absolute";
	suggestions.style.top = "calc(100% - 6px)";
	suggestions.style.left = "0";
	suggestions.style.width = "calc(70% - 1px)";
	suggestions.style.background = "white";
	suggestions.style.fontWeight = "normal";
	suggestions.style.display = "none";
	inputContainer.appendChild(suggestions);

	// Submit button
	let button = document.createElement("button");
	button.innerText = "Suche";
	button.classList.add("buttonSuche");
	button.style.margin = "0 0 0 10px";
	button.style.padding = "3px 8px";
	button.style.fontSize = "16px";
	button.style.cursor = "pointer";
	button.style.backgroundColor = "#bbb";
	button.style.color = "#333";
	button.style.border = "0";
	button.style.borderBottom = "4px solid #999";
	button.style.borderRadius = "5px";
	button.style.lineHeight = "20px";
	button.style.fontWeight = "normal";
	button.style.textTransform = "none";
	button.style.boxShadow = "none";
	button.style.webkitBoxSizing = "content-box";
	button.style.boxSizing = "content-box";
	button.style.height = "auto";
	button.style.textShadow = "none";
	inputContainer.appendChild(button);

	// Additional info text
	let text_unten = document.createElement("p");
	text_unten.style.color = "#333";
	text_unten.style.fontFamily = "Arial";
	text_unten.style.fontSize = "12px";
	text_unten.style.fontStyle = "italic";
	text_unten.style.marginTop = "8px";
	text_unten.style.marginBottom = "0";
	text_unten.style.lineHeight = "20px";
	text_unten.innerHTML = "Groß- und Kleinschreibung wird ignoriert &ndash; ";
	let github_link = document.createElement("a");
	github_link.style.color = "#333";
	github_link.classList.add("hoverRed");
	github_link.style.textDecoration = "none";
	github_link.style.lineHeight = "20px";
	github_link.style.fontWeight = "bold";
	github_link.style.border = "none";
	github_link.href = "https://github.com/stephanhuebsch/bookmarks/";
	github_link.innerText = "Quellcode";
	text_unten.appendChild(github_link);
	modal.appendChild(text_unten);

	// -------------------------
	// Variables for suggestions
	// -------------------------
	let selectedSuggestionIndex = -1;
	let suppressInputEvent = false;

	function updateSuggestions() {
		if (suppressInputEvent) return;
		let query = input.value.toLowerCase();
		suggestions.innerHTML = "";
		selectedSuggestionIndex = -1;

		let match = query.match(/^(?:(\d+[a-zA-Z]*\s+))?(.*)$/);
		let prefix = match[1] || "";
		let searchTerm = match[2] || "";

		// Remove hyphens for matching purposes.
		let sanitizedSearchTerm = searchTerm.replace(/-/g, '');

		// Find matches based on abbreviation (default behavior)
		let matches = alleGesetze.filter(gesetz => {
			let sanitizedGesetz = gesetz.toLowerCase().replace(/-/g, '');
			return sanitizedGesetz.includes(sanitizedSearchTerm);
		});

		// If no matches were found, check full names
		if (matches.length === 0) {
			Object.keys(mappingsOriginal).forEach(abbreviation => {
				let fullLawName = mappingsOriginal[abbreviation].vollerName.toLowerCase().replace(/-/g, '');
				if (fullLawName.includes(sanitizedSearchTerm)) {
					matches.push(abbreviation); // Add the abbreviation (not the full name) to the dropdown
				}
			});
		}

		// Display results
		if (matches.length > 0 && searchTerm.length > 0) {
			suggestions.style.display = "block";
			matches.forEach(gesetz => {
				let item = document.createElement("li");
				item.style.padding = "5px";
				item.style.cursor = "pointer";
				item.style.borderBottom = "1px solid lightgray";
				item.textContent = prefix + gesetz; // Keep only abbreviation in the dropdown
				item.onclick = function() {
					input.value = prefix + gesetz;
					suggestions.style.display = "none";
				};
				suggestions.appendChild(item);
			});
		} else {
			suggestions.style.display = "none";
		}
	}

	input.addEventListener("input", function(e) {
		if (!suppressInputEvent) {
			updateSuggestions();
		}
	});
	input.addEventListener("blur", function() {
		setTimeout(() => suggestions.style.display = "none", 200);
	});
	input.addEventListener("focus", updateSuggestions);

	input.addEventListener("keydown", function(event) {
		if (suggestions.style.display === "block") {
			let items = suggestions.getElementsByTagName("li");
			if (event.key === "ArrowDown") {
				event.preventDefault();
				if (selectedSuggestionIndex < items.length - 1) {
					selectedSuggestionIndex++;
				} else {
					selectedSuggestionIndex = 0;
				}
				for (let i = 0; i < items.length; i++) {
					items[i].style.backgroundColor = (i === selectedSuggestionIndex) ? "#ddd" : "";
				}
				if (items[selectedSuggestionIndex]) {
					suppressInputEvent = true;
					input.value = items[selectedSuggestionIndex].textContent;
					setTimeout(() => {
						suppressInputEvent = false;
					}, 0);
					items[selectedSuggestionIndex].scrollIntoView({
						block: "nearest"
					});
				}
				return;
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				if (selectedSuggestionIndex > 0) {
					selectedSuggestionIndex--;
				} else {
					selectedSuggestionIndex = items.length - 1;
				}
				for (let i = 0; i < items.length; i++) {
					items[i].style.backgroundColor = (i === selectedSuggestionIndex) ? "#ddd" : "";
				}
				if (items[selectedSuggestionIndex]) {
					suppressInputEvent = true;
					input.value = items[selectedSuggestionIndex].textContent;
					setTimeout(() => {
						suppressInputEvent = false;
					}, 0);
					items[selectedSuggestionIndex].scrollIntoView({
						block: "nearest"
					});
				}
				return;
			} else if (event.key === "Enter") {
				if (selectedSuggestionIndex >= 0) {
					event.preventDefault();
					let selectedItem = items[selectedSuggestionIndex];
					if (selectedItem) {
						input.value = selectedItem.textContent;
						suggestions.style.display = "none";
						submitInput();
					}
					return;
				}
			}
		}
		if (event.key === "Enter") {
			submitInput();
		}
	});

	// -------------------------
	// Submission: use normalized mappings (ignore hyphens)
	// -------------------------
	function submitInput() {
		document.body.style.cursor = "progress";
		let trimmed = input.value.trim().toLowerCase();
		// Check if the input starts with a number followed by some text.
		let match = trimmed.match(/^(\d+[a-z]*)\s+(.+)$/);
		if (match) {
			let number = match[1];
			// Normalize the law key by removing hyphens.
			let lawKey = match[2].trim().toLowerCase().replace(/-/g, '');

			// Check for mapping
			if (mappingsNorm.hasOwnProperty(lawKey)) {
				let urlTemplate = mappingsNorm[lawKey].einzelneNorm;
				if (lawKey == "pvü") {
					for (const [key, value] of Object.entries(bis_zu_a)) {
						if (number.endsWith(key)) {
							number = number.slice(0, -key.length) + value;
						 }
					}
				}
				let finalUrl = urlTemplate.replace("{num}", number);
				window.location.href = finalUrl;
				return;
			} else {
				console.log("Ungültige Eingabe.");
				document.body.style.cursor = "default";
				input.style.transition = "border 0.3s ease-in-out, background-color 0.3s ease-in-out";
				input.style.border = "1px solid #BC101D";
				input.style.backgroundColor = "#f1cfd1";
				input.classList.add("wiggle");
				setTimeout(() => {
					input.style.border = "1px solid #888";
					input.style.backgroundColor = "white";
					input.classList.remove("wiggle");
				}, 600);
			}
		} else {
			// No number provided.
			let normalizedInput = trimmed.replace(/-/g, '');
			if (mappingsNorm.hasOwnProperty(normalizedInput)) {
				window.location.href = mappingsNorm[normalizedInput].gesamterText;
				return;
			} else {
				console.log("Ungültige Eingabe.");
				document.body.style.cursor = "default";
				input.style.transition = "border 0.3s ease-in-out, background-color 0.3s ease-in-out";
				input.style.border = "1px solid #BC101D";
				input.style.backgroundColor = "#f1cfd1";
				input.classList.add("wiggle");
				setTimeout(() => {
					input.style.border = "1px solid #888";
					input.style.backgroundColor = "white";
					input.classList.remove("wiggle");
				}, 600);
			}
		}
	}

	button.onclick = submitInput;
	document.addEventListener("keydown", function(event) {
		if (event.key === "Escape") {
			modal.remove();
			document.body.style.cursor = "default";
		}
	});

	const style = document.createElement("style");
	style.textContent =
		".hoverRed { transition: color 0.3s ease-in-out; }" +
		".hoverRed:hover { color: #BC101D !important; }" +
		".buttonSuche:hover { filter: brightness(105%); }" +
		"abbr { cursor: text; text-decoration: underline dotted; }" +
		"@keyframes wiggle { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); } }" +
		".wiggle { animation: wiggle 0.3s ease-in-out; }";

	document.head.appendChild(style);

	document.body.appendChild(modal);
	input.focus();
//})();
