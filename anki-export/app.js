/* Anki .apkg → printable Q&A list, fully client-side.
   Pipeline: unzip (fflate) → maybe zstd-decompress (fzstd) → read SQLite
   (sql.js) → build cards → tag tree → render. Nothing leaves the browser. */
(function () {
  "use strict";

  var FSEP = String.fromCharCode(0x1f); // Anki joins note fields with the unit-separator

  var els = {
    drop: document.getElementById("drop"),
    file: document.getElementById("file"),
    msg: document.getElementById("msg"),
    controls: document.getElementById("controls"),
    tagtree: document.getElementById("tagtree"),
    out: document.getElementById("out"),
    viewQA: document.getElementById("viewQA"),
    viewQonly: document.getElementById("viewQonly"),
    printBtn: document.getElementById("printBtn"),
    selAll: document.getElementById("selAll"),
    selNone: document.getElementById("selNone")
  };

  var cards = [];      // { q, a, tags:[String] }
  var tagRoot = null;  // hierarchy of all tags
  var SQL = null;      // cached sql.js module

  /* ---------- status helpers ---------- */
  function say(text, kind) {
    els.msg.textContent = text || "";
    els.msg.className = "msg no-print" + (kind ? " " + kind : "");
  }

  /* ---------- drop / pick wiring ---------- */
  els.drop.addEventListener("click", function () { els.file.click(); });
  els.drop.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); els.file.click(); }
  });
  els.file.addEventListener("change", function () {
    if (els.file.files && els.file.files[0]) handleFile(els.file.files[0]);
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    els.drop.addEventListener(ev, function (e) {
      e.preventDefault(); els.drop.classList.add("over");
    });
  });
  ["dragleave", "dragend", "drop"].forEach(function (ev) {
    els.drop.addEventListener(ev, function () { els.drop.classList.remove("over"); });
  });
  els.drop.addEventListener("drop", function (e) {
    e.preventDefault();
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  });

  function handleFile(file) {
    say("Lese " + file.name + " …", "ok");
    var reader = new FileReader();
    reader.onerror = function () { say("Datei konnte nicht gelesen werden.", "err"); };
    reader.onload = function () {
      // give the browser a frame to paint the status before the heavy sync work
      setTimeout(function () { process(new Uint8Array(reader.result), file.name); }, 20);
    };
    reader.readAsArrayBuffer(file);
  }

  /* ---------- main pipeline ---------- */
  function process(bytes, name) {
    try {
      var files = fflate.unzipSync(bytes);
      var dbBytes = pickDatabase(files);
      if (!dbBytes) throw new Error("Keine Anki-Datenbank (collection.anki2*) im Archiv gefunden.");
    } catch (err) {
      return say("Konnte das Archiv nicht entpacken: " + err.message, "err");
    }

    ensureSQL().then(function () {
      try {
        var db = new SQL.Database(dbBytes);
        var models = readModels(db);
        cards = readCards(db, models);
        db.close();
      } catch (err) {
        return say("Datenbank-Fehler: " + err.message, "err");
      }
      if (!cards.length) return say("Keine Karten gefunden.", "err");

      tagRoot = buildTagTree(cards);
      renderTagTree();
      els.controls.hidden = false;
      render();
      say(cards.length + " Karten aus „" + name + "“ gelesen.", "ok");
    }).catch(function (err) {
      say("SQLite konnte nicht geladen werden: " + err.message, "err");
    });
  }

  function pickDatabase(files) {
    if (files["collection.anki21b"]) return fzstd.decompress(files["collection.anki21b"]);
    if (files["collection.anki21"]) return files["collection.anki21"];
    if (files["collection.anki2"]) return files["collection.anki2"];
    return null;
  }

  function ensureSQL() {
    if (SQL) return Promise.resolve(SQL);
    return initSqlJs({ locateFile: function (f) { return "./vendor/" + f; } })
      .then(function (mod) { SQL = mod; return mod; });
  }

  /* ---------- note types ---------- */
  // Returns map: mid -> { type, flds:[name], tmpls:[{qfmt,afmt}] }
  function readModels(db) {
    var models = {};
    // Schema 11: note types live as JSON in col.models
    try {
      var r = db.exec("SELECT models FROM col LIMIT 1");
      if (r.length && r[0].values[0][0]) {
        var json = JSON.parse(r[0].values[0][0]);
        Object.keys(json).forEach(function (mid) {
          var m = json[mid];
          models[mid] = {
            type: m.type,
            flds: (m.flds || []).slice().sort(byOrd).map(function (f) { return f.name; }),
            tmpls: (m.tmpls || []).map(function (t) { return { qfmt: t.qfmt, afmt: t.afmt }; })
          };
        });
      }
    } catch (e) { /* fall through to schema 18 */ }

    if (!Object.keys(models).length) {
      // Schema 18+: field names come from the `fields` table. Template formats
      // live in a protobuf blob we don't parse — front/back then falls back to
      // "first field = question", which readCards handles when tmpls is empty.
      try {
        var nt = db.exec("SELECT id FROM notetypes");
        var fl = db.exec("SELECT ntid, name, ord FROM fields ORDER BY ntid, ord");
        var byNt = {};
        if (fl.length) fl[0].values.forEach(function (row) {
          (byNt[row[0]] = byNt[row[0]] || []).push(row[1]);
        });
        if (nt.length) nt[0].values.forEach(function (row) {
          models[row[0]] = { type: 0, flds: byNt[row[0]] || [], tmpls: [] };
        });
      } catch (e) { /* leave models empty; readCards still degrades gracefully */ }
    }
    return models;
  }
  function byOrd(a, b) { return a.ord - b.ord; }

  /* ---------- cards ---------- */
  function readCards(db, models) {
    var res = db.exec(
      "SELECT c.ord, n.mid, n.flds, n.tags FROM cards c JOIN notes n ON c.nid = n.id"
    );
    if (!res.length) return [];
    var out = [];
    res[0].values.forEach(function (row) {
      var ord = row[0], mid = String(row[1]);
      var fields = String(row[2]).split(FSEP).map(sanitize);
      var tags = String(row[3] || "").split(/\s+/).filter(Boolean);
      var model = models[mid] || { type: 0, flds: [], tmpls: [] };
      var qa = splitFrontBack(model, fields, ord);
      if (qa.q || qa.a) out.push({ q: qa.q, a: qa.a, tags: tags });
    });
    return out;
  }

  var CLOZE_RE = /\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/g;

  function splitFrontBack(model, fields, ord) {
    var joined = fields.join(FSEP);
    if (model.type === 1 || /\{\{c\d+::/.test(joined)) return renderCloze(fields, ord);

    var byName = {};
    model.flds.forEach(function (name, i) { byName[name] = fields[i] || ""; });

    if (model.tmpls && model.tmpls.length) {
      var t = model.tmpls[ord] || model.tmpls[0];
      var front = refFields(t.qfmt, model.flds);
      var back = refFields(t.afmt, model.flds).filter(function (f) {
        return front.indexOf(f) === -1;
      });
      if (!front.length) front = model.flds.slice(0, 1);
      if (!back.length) back = model.flds.filter(function (f) { return front.indexOf(f) === -1; });
      return {
        q: pick(front, byName),
        a: pick(back, byName)
      };
    }
    // no template info: first field = question, rest = answer
    return { q: fields[0] || "", a: joinNonEmpty(fields.slice(1)) };
  }

  function pick(names, byName) {
    return joinNonEmpty(names.map(function (n) { return byName[n] || ""; }));
  }
  function joinNonEmpty(arr) {
    return arr.filter(function (s) { return s && s.trim(); }).join("<br>");
  }

  // Field names referenced by a template side, returned in field order (deduped).
  // Skips section tags ({{#Field}} / {{/Field}} / {{^Field}}) and strips filters
  // like {{cloze:Text}} / {{hint:Field}} down to the bare field name.
  function refFields(fmt, allFields) {
    if (!fmt) return [];
    var refs = {}, re = /\{\{([^{}#\/^][^{}]*)\}\}/g, m;
    while ((m = re.exec(fmt))) {
      var name = m[1].trim();
      if (name.indexOf(":") !== -1) name = name.split(":").pop().trim();
      refs[name] = true;
    }
    return allFields.filter(function (f) { return refs[f]; });
  }

  function renderCloze(fields, ord) {
    var num = ord + 1;
    var text = "";
    for (var i = 0; i < fields.length; i++) {
      if (/\{\{c\d+::/.test(fields[i])) { text = fields[i]; break; }
    }
    if (!text) text = fields[0] || "";
    var extra = joinNonEmpty(fields.filter(function (f) { return f !== text; }));

    var q = text.replace(CLOZE_RE, function (_m, n, ans, hint) {
      if (+n === num) return hint ? "[" + hint + "]" : "[…]";
      return ans; // other clozes on this card are shown as plain text
    });
    var a = text.replace(CLOZE_RE, function (_m, n, ans) {
      return +n === num ? "<u>" + ans + "</u>" : ans;
    });
    return { q: q, a: extra ? a + "<br>" + extra : a };
  }

  /* ---------- HTML sanitising: keep only basic formatting ---------- */
  var KEEP = { B: 1, STRONG: 1, I: 1, EM: 1, U: 1, BR: 1, UL: 1, OL: 1, LI: 1, SUB: 1, SUP: 1 };
  var DROP = { IMG: 1, SCRIPT: 1, STYLE: 1, AUDIO: 1, VIDEO: 1, SOURCE: 1, IFRAME: 1, OBJECT: 1 };

  function sanitize(html) {
    if (!html) return "";
    html = html.replace(/\[sound:[^\]]*\]/g, ""); // drop audio references
    var box = document.createElement("div");
    box.innerHTML = html;
    scrub(box);
    return box.innerHTML.replace(/(?:<br>\s*){3,}/g, "<br><br>").trim();
  }

  function scrub(node) {
    var kids = Array.prototype.slice.call(node.childNodes);
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (c.nodeType !== 1) continue;
      scrub(c);
      var tag = c.tagName;
      if (KEEP[tag]) {
        while (c.attributes.length) c.removeAttribute(c.attributes[0].name);
      } else if (tag === "P" || tag === "DIV" || tag === "BR") {
        c.parentNode.insertBefore(document.createElement("br"), c);
        unwrap(c);
      } else if (DROP[tag]) {
        c.remove();
      } else {
        unwrap(c); // span / font / a / etc. → keep text, drop the tag
      }
    }
  }
  function unwrap(el) {
    while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
    el.remove();
  }

  /* ---------- tag tree ---------- */
  function buildTagTree(cardList) {
    var root = { name: "", full: "", children: {} };
    cardList.forEach(function (card) {
      card.tags.forEach(function (tag) {
        var parts = tag.split("::"), node = root, full = "";
        parts.forEach(function (p) {
          full = full ? full + "::" + p : p;
          if (!node.children[p]) node.children[p] = { name: p, full: full, children: {} };
          node = node.children[p];
        });
      });
    });
    return root;
  }

  // cards whose tags include `full` or any descendant of it
  function cardsUnder(full) {
    var prefix = full + "::";
    return cards.filter(function (c) {
      for (var i = 0; i < c.tags.length; i++) {
        if (c.tags[i] === full || c.tags[i].indexOf(prefix) === 0) return true;
      }
      return false;
    });
  }

  function renderTagTree() {
    els.tagtree.innerHTML = "";
    var kids = childList(tagRoot);
    if (!kids.length) {
      els.tagtree.innerHTML = '<li class="empty">Dieses Deck hat keine Tags.</li>';
      return;
    }
    kids.forEach(function (n) { els.tagtree.appendChild(nodeLi(n)); });
  }

  function childList(node) {
    return Object.keys(node.children)
      .sort(function (a, b) { return a.localeCompare(b, "de"); })
      .map(function (k) { return node.children[k]; });
  }

  function nodeLi(node) {
    var li = document.createElement("li");
    var label = document.createElement("label");
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.tag = node.full;
    cb.addEventListener("change", render);
    var name = document.createElement("span");
    name.className = "tname";
    name.textContent = node.name;
    var cnt = document.createElement("span");
    cnt.className = "cnt";
    cnt.textContent = "(" + cardsUnder(node.full).length + ")";
    label.appendChild(cb);
    label.appendChild(name);
    label.appendChild(cnt);
    li.appendChild(label);

    var kids = childList(node);
    if (kids.length) {
      var ul = document.createElement("ul");
      kids.forEach(function (k) { ul.appendChild(nodeLi(k)); });
      li.appendChild(ul);
    }
    return li;
  }

  /* ---------- output ---------- */
  function checkedTagsInOrder() {
    // depth-first over the tree, keeping only checked tags → stable heading order
    var checked = {};
    Array.prototype.forEach.call(
      els.tagtree.querySelectorAll("input:checked"),
      function (cb) { checked[cb.dataset.tag] = true; }
    );
    var order = [];
    (function walk(node) {
      childList(node).forEach(function (n) {
        if (checked[n.full]) order.push(n.full);
        walk(n);
      });
    })(tagRoot);
    return order;
  }

  function render() {
    var heads = checkedTagsInOrder();
    if (!heads.length) {
      els.out.innerHTML =
        '<p class="empty no-print">Wähle oben mindestens einen Tag als Überschrift.</p>';
      return;
    }
    var html = "";
    heads.forEach(function (full) {
      var group = cardsUnder(full);
      html += '<section class="grp"><h2>' + escapeText(full) +
              '<span class="grpcount">' + group.length + "</span></h2>";
      html += '<ol class="qa">';
      group.forEach(function (c) {
        html += "<li><div class=\"q\">" + (c.q || "—") + "</div>";
        if (c.a) html += '<div class="a">' + c.a + "</div>";
        html += "</li>";
      });
      html += "</ol></section>";
    });
    els.out.innerHTML = html;
  }

  function escapeText(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- view toggle + print ---------- */
  function setView(qonly) {
    document.body.classList.toggle("qonly", qonly);
    els.viewQA.setAttribute("aria-pressed", String(!qonly));
    els.viewQonly.setAttribute("aria-pressed", String(qonly));
  }
  els.viewQA.addEventListener("click", function () { setView(false); });
  els.viewQonly.addEventListener("click", function () { setView(true); });
  els.printBtn.addEventListener("click", function () { window.print(); });

  els.selAll.addEventListener("click", function () { toggleAll(true); });
  els.selNone.addEventListener("click", function () { toggleAll(false); });
  function toggleAll(on) {
    Array.prototype.forEach.call(
      els.tagtree.querySelectorAll("input[type=checkbox]"),
      function (cb) { cb.checked = on; }
    );
    render();
  }
})();
