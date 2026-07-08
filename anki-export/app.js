/* Anki .apkg → printable field list, fully client-side.
   Pipeline: unzip (fflate) → maybe zstd-decompress (fzstd) → read SQLite
   (sql.js) → per note, extract every field's HTML (no deck CSS) → group by
   tag → render. Per-field font size + bold/italic/underline controls tweak
   the export. Nothing leaves the browser. */
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
    selNone: document.getElementById("selNone"),
    fieldfmt: document.getElementById("fieldfmt"),
    fsReset: document.getElementById("fsReset")
  };

  var notes = [];       // [{ fields:[{name, html}], tags:[String] }]
  var models = {};      // mid -> { flds:[name] }
  var tagRoot = null;   // hierarchy of all tags
  var SQL = null;       // cached sql.js module
  var qonly = false;    // current view: only the first (question) field?
  var usedFields = {};  // field names that carry content in at least one note
  var fieldFmt = {};    // field name -> { size, bold, italic, underline }

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
        models = readModels(db);
        usedFields = {}; fieldFmt = {};
        notes = readNotes(db, models);
        db.close();
      } catch (err) {
        return say("Datenbank-Fehler: " + err.message, "err");
      }
      if (!notes.length) return say("Keine Notizen gefunden.", "err");

      renderFieldControls();
      tagRoot = buildTagTree(notes);
      renderTagTree();
      els.controls.hidden = false;
      render();
      say(notes.length + " Notizen aus „" + name + "“ gelesen.", "ok");
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

  /* ---------- note types: we only need each type's ordered field names ---------- */
  function readModels(db) {
    var out = {};
    // Schema 11: note types live as JSON in col.models
    try {
      var r = db.exec("SELECT models FROM col LIMIT 1");
      if (r.length && r[0].values[0][0]) {
        var json = JSON.parse(r[0].values[0][0]);
        Object.keys(json).forEach(function (mid) {
          out[mid] = {
            flds: (json[mid].flds || []).slice().sort(byOrd).map(function (f) { return f.name; })
          };
        });
      }
    } catch (e) { /* fall through to schema 18 */ }

    // Schema 18+: field names are plain columns in the `fields` table.
    if (!Object.keys(out).length) {
      try {
        var fl = db.exec("SELECT ntid, name, ord FROM fields ORDER BY ntid, ord");
        if (fl.length) fl[0].values.forEach(function (row) {
          var mid = String(row[0]);
          (out[mid] = out[mid] || { flds: [] }).flds.push(row[1]);
        });
      } catch (e) { /* leave empty; readNotes falls back to generic field names */ }
    }
    return out;
  }
  function byOrd(a, b) { return a.ord - b.ord; }

  /* ---------- notes → fields ---------- */
  // One entry per note (not per card), so cloze/reversed notes aren't duplicated.
  function readNotes(db, models) {
    var res = db.exec("SELECT mid, flds, tags FROM notes");
    if (!res.length) return [];
    var out = [];
    res[0].values.forEach(function (row) {
      var mid = String(row[0]);
      var values = String(row[1]).split(FSEP);
      var tags = String(row[2] || "").split(/\s+/).filter(Boolean);
      var names = (models[mid] && models[mid].flds.length) ? models[mid].flds : [];
      var fields = values.map(function (v, i) {
        var name = names[i] || ("Feld " + (i + 1));
        var html = sanitizeField(v);
        if (html) usedFields[name] = true;
        return { name: name, html: html };
      });
      out.push({ fields: fields, tags: tags });
    });
    return out;
  }

  /* ---------- cloze: render {{cN::answer::hint}} readably ---------- */
  var CLOZE_RE = /\{\{c\d+::([\s\S]*?)(?:::([\s\S]*?))?\}\}/g;
  function renderCloze(html, reveal) {
    if (html.indexOf("{{c") === -1) return html;
    return html.replace(CLOZE_RE, function (_m, ans, hint) {
      return reveal ? "<u>" + ans + "</u>" : (hint ? "[" + hint + "]" : "[…]");
    });
  }

  /* ---------- sanitising: keep basic formatting, drop CSS/classes/media ---------- */
  var KEEP = { B: 1, STRONG: 1, I: 1, EM: 1, U: 1, BR: 1, UL: 1, OL: 1, LI: 1, SUB: 1, SUP: 1, MARK: 1 };
  var DROP = { SCRIPT: 1, STYLE: 1, IMG: 1, AUDIO: 1, VIDEO: 1, SOURCE: 1, IFRAME: 1, OBJECT: 1, EMBED: 1, LINK: 1 };

  function sanitizeField(html) {
    if (!html) return "";
    html = html.replace(/\[sound:[^\]]*\]/g, ""); // audio refs — no media available
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
        unwrap(c); // span / font / a / etc. → keep text, drop the tag + its classes
      }
    }
  }
  function unwrap(el) {
    while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
    el.remove();
  }

  /* ---------- tag tree ---------- */
  function buildTagTree(list) {
    var root = { name: "", full: "", children: {} };
    list.forEach(function (note) {
      note.tags.forEach(function (tag) {
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

  // notes whose tags include `full` or any descendant of it
  function notesUnder(full) {
    var prefix = full + "::";
    return notes.filter(function (c) {
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
    cnt.textContent = "(" + notesUnder(node.full).length + ")";
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

  /* ---------- per-field formatting controls ---------- */
  function renderFieldControls() {
    els.fieldfmt.innerHTML = "";
    var names = Object.keys(usedFields).sort(function (a, b) { return a.localeCompare(b, "de"); });
    if (!names.length) {
      els.fieldfmt.innerHTML = '<div class="empty">Keine Felder erkannt.</div>';
      return;
    }
    names.forEach(function (name) {
      if (!fieldFmt[name]) fieldFmt[name] = { size: 1, bold: false, italic: false, underline: false };
      var row = document.createElement("div");
      row.className = "fsrow";

      var label = document.createElement("span");
      label.className = "fsname";
      label.textContent = name;
      label.title = name;

      var val = document.createElement("span");
      val.className = "fsval";
      val.dataset.fld = name;

      row.appendChild(label);
      row.appendChild(sizeButton("−", name, -0.05));
      row.appendChild(val);
      row.appendChild(sizeButton("+", name, 0.05));
      row.appendChild(fmtToggle(name, "bold", "B"));
      row.appendChild(fmtToggle(name, "italic", "I"));
      row.appendChild(fmtToggle(name, "underline", "U"));
      els.fieldfmt.appendChild(row);
    });
    updateFieldStyles();
  }

  function sizeButton(text, name, delta) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "fsstep";
    b.textContent = text;
    b.addEventListener("click", function () {
      var s = Math.round((fieldFmt[name].size + delta) * 20) / 20; // 5% steps
      fieldFmt[name].size = Math.min(3, Math.max(0.3, s));
      updateFieldStyles();
    });
    return b;
  }

  function fmtToggle(name, prop, label) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "fstog fstog-" + prop;
    b.textContent = label;
    b.dataset.fld = name;
    b.dataset.prop = prop;
    b.addEventListener("click", function () {
      fieldFmt[name][prop] = !fieldFmt[name][prop];
      updateFieldStyles();
    });
    return b;
  }

  // Rebuild the field stylesheet + refresh every control's displayed state.
  function updateFieldStyles() {
    var css = "";
    Object.keys(fieldFmt).forEach(function (name) {
      var f = fieldFmt[name], decls = [];
      if (f.size !== 1) decls.push("font-size:" + f.size + "em");
      if (f.bold) decls.push("font-weight:700");
      if (f.italic) decls.push("font-style:italic");
      if (f.underline) decls.push("text-decoration:underline");
      if (decls.length) {
        css += '.afld[data-fld="' + cssAttr(name) + '"]{' +
          decls.map(function (d) { return d + " !important"; }).join(";") + "}\n";
      }
      var pct = els.fieldfmt.querySelector('.fsval[data-fld="' + cssAttr(name) + '"]');
      if (pct) pct.textContent = Math.round(f.size * 100) + "%";
    });
    Array.prototype.forEach.call(els.fieldfmt.querySelectorAll(".fstog"), function (b) {
      var on = fieldFmt[b.dataset.fld] && fieldFmt[b.dataset.fld][b.dataset.prop];
      b.setAttribute("aria-pressed", String(!!on));
    });

    var el = document.getElementById("field-style-css");
    if (!el) {
      el = document.createElement("style");
      el.id = "field-style-css";
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  // Escape a field name for use inside a CSS [data-fld="…"] selector.
  function cssAttr(s) { return String(s).replace(/["\\]/g, "\\$&"); }

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
      var group = notesUnder(full);
      html += '<section class="grp"><h2>' + escapeText(full) +
              '<span class="grpcount">' + group.length + "</span></h2>";
      html += '<ul class="notes">';
      group.forEach(function (note) {
        var fields = qonly ? note.fields.slice(0, 1) : note.fields;
        var blocks = "";
        fields.forEach(function (fld) {
          if (!fld.html) return;
          blocks += '<div class="afld" data-fld="' + escapeAttr(fld.name) + '">' +
                    renderCloze(fld.html, !qonly) + "</div>";
        });
        if (blocks) html += '<li class="note">' + blocks + "</li>";
      });
      html += "</ul></section>";
    });
    els.out.innerHTML = html;
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }
  function escapeText(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- view toggle + print ---------- */
  function setView(questionsOnly) {
    qonly = questionsOnly;
    els.viewQA.setAttribute("aria-pressed", String(!qonly));
    els.viewQonly.setAttribute("aria-pressed", String(qonly));
    render();
  }
  els.viewQA.addEventListener("click", function () { setView(false); });
  els.viewQonly.addEventListener("click", function () { setView(true); });
  els.printBtn.addEventListener("click", function () { window.print(); });

  els.selAll.addEventListener("click", function () { toggleAll(true); });
  els.selNone.addEventListener("click", function () { toggleAll(false); });
  els.fsReset.addEventListener("click", function () {
    Object.keys(fieldFmt).forEach(function (n) {
      fieldFmt[n] = { size: 1, bold: false, italic: false, underline: false };
    });
    updateFieldStyles();
  });
  function toggleAll(on) {
    Array.prototype.forEach.call(
      els.tagtree.querySelectorAll("input[type=checkbox]"),
      function (cb) { cb.checked = on; }
    );
    render();
  }
})();
