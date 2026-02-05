/* global d3 */

const fileInput = document.getElementById("fileInput");
const listEl = document.getElementById("list");
const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const searchEl = document.getElementById("search");
const summaryEl = document.getElementById("summary");
const fullRangeBtn = document.getElementById("fullRangeBtn");
const printPdfBtn = document.getElementById("printPdfBtn");

const chartHost = document.getElementById("chart");
const tooltip = document.getElementById("tooltip");

let allRows = [];      // full parsed dataset
let filteredRows = []; // date-filtered for chart
let textFilter = "";   // list filter

// Selection state (click a table row -> highlight a bar for that day)
// kind: "income" | "expense"
let selected = null;

function scrollListToSelection(dateStr, kind) {
  // Find the first visible matching transaction row and scroll it into view.
  // (It may not exist if a text filter hides it.)
  const sel = `.row[data-date="${CSS.escape(dateStr)}"][data-kind="${CSS.escape(kind)}"]`;
  const target = listEl.querySelector(sel);
  if (!target) return;
  target.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function setSelection(dateStr, kind, { scrollIntoView = false } = {}) {
  if (!dateStr || !kind) return;

  // Toggle selection when clicking the same item again
  if (selected && selected.dateStr === dateStr && selected.kind === kind) selected = null;
  else selected = { dateStr, kind };

  renderList();
  applyChartSelection();
  if (selected && scrollIntoView) scrollListToSelection(selected.dateStr, selected.kind);
}

// ---------- CSV parsing ----------
function parseCsvSemicolon(text) {
  // Supports optional header row; ignores empty lines.
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  // Detect & skip header if first cell isn't a date
  const firstParts = lines[0].split(";").map(s => s.trim());
  const isDateLike = /^\d{4}-\d{2}-\d{2}$/.test(firstParts[0]);
  const dataLines = isDateLike ? lines : lines.slice(1);

  const rows = [];
  for (let i = 0; i < dataLines.length; i++) {
    const parts = dataLines[i].split(";").map(s => s.trim());

    // Expect at least 4 columns; if "Info" itself contains semicolons,
    // everything after the 3rd semicolon belongs to Info.
    const dateStr = parts[0] ?? "";
    const amountStr = parts[1] ?? "";
    const name = parts[2] ?? "";
    const info = parts.slice(3).join(";").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;

    // Accept amounts like "-1234", "1,234.56", "1.234,56", etc.
    const amount = parseAmount(amountStr);
    if (!Number.isFinite(amount)) continue;

    const date = new Date(dateStr + "T00:00:00");

    rows.push({
      date,
      dateStr,
      amount,
      name,
      info,
      raw: { dateStr, amountStr, name, info }
    });
  }

  // chronological ascending
  rows.sort((a, b) => a.date - b.date);
  return rows;
}

function parseAmount(s) {
  const t = (s ?? "").trim();
  if (!t) return NaN;

  // Remove spaces
  let x = t.replace(/\s+/g, "");

  // If both '.' and ',' exist, assume the last one is the decimal separator.
  const hasDot = x.includes(".");
  const hasComma = x.includes(",");
  if (hasDot && hasComma) {
    const lastDot = x.lastIndexOf(".");
    const lastComma = x.lastIndexOf(",");
    const dec = lastDot > lastComma ? "." : ",";
    const thou = dec === "." ? "," : ".";
    x = x.replaceAll(thou, "");
    if (dec === ",") x = x.replace(",", ".");
  } else if (hasComma && !hasDot) {
    // Comma as decimal separator (common in EU) OR thousands separator.
    // Heuristic: if there are exactly 2 digits after comma => decimal.
    const m = x.match(/,(\d{2})$/);
    if (m) x = x.replace(",", ".");
    else x = x.replaceAll(",", "");
  } else {
    // Only dots or none: remove thousands commas already handled; keep dot decimals.
    x = x.replaceAll(",", "");
  }

  return Number(x);
}

// ---------- UI wiring ----------
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const text = await file.text();
  allRows = parseCsvSemicolon(text);

  if (allRows.length === 0) {
    listEl.innerHTML = `<div class="empty">Error: No rows parsed. Check the CSV format.</div>`;
    summaryEl.textContent = "";
    clearChart();
    return;
  }

  // Initialize date pickers to full range
  startDateEl.value = allRows[0].dateStr;
  endDateEl.value = allRows[allRows.length - 1].dateStr;

  renderAll();
});

[startDateEl, endDateEl].forEach(el => {
  el.addEventListener("change", () => renderAll());
});

searchEl.addEventListener("input", () => {
  textFilter = (searchEl.value ?? "").trim().toLowerCase();
  renderList(); // list filter does not affect chart
});

function renderAll() {
  renderList();
  renderChart();
  renderSummary();
}

// Click on a list row -> highlight the matching day bar.
// (Event delegation so it works after re-rendering the list.)
listEl.addEventListener("click", (e) => {
  const row = e.target?.closest?.(".row");
  if (!row) return;

  const dateStr = row.dataset.date;
  const kind = row.dataset.kind;
  if (!dateStr || !kind) return;

  setSelection(dateStr, kind);
});

// ---------- Left list ----------
function renderList() {
  if (allRows.length === 0) {
    listEl.innerHTML = `<div class="empty">Bitte eine CSV-Datei auswählen.</div>`;
    return;
  }

  const visible = textFilter
    ? allRows.filter(r =>
        (r.name ?? "").toLowerCase().includes(textFilter) ||
        (r.info ?? "").toLowerCase().includes(textFilter) ||
        (r.dateStr ?? "").includes(textFilter)
      )
    : allRows;

  if (visible.length === 0) {
    listEl.innerHTML = `<div class="empty">Dieser Filter hat keine Ergebnisse erzielt.</div>`;
    return;
  }

  listEl.innerHTML = visible.map(r => {
    const cls = r.amount >= 0 ? "pos" : "neg";
    const amt = formatMoney(r.amount);
    const safeName = escapeHtml(r.name);
    const safeInfo = escapeHtml(r.info);

    const kind = r.amount >= 0 ? "income" : "expense";
    const isSelected = !!(selected && selected.dateStr === r.dateStr && selected.kind === kind);
    return `
      <div class="row${isSelected ? " is-selected" : ""}" data-date="${r.dateStr}" data-kind="${kind}">
        <div class="row-top">
          <div>${formatDateDMY(r.date)}</div>
          <div class="amount ${cls}">${amt}</div>
        </div>
        <div class="row-mid">${safeName || "<span style='color:var(--muted)'>—</span>"}</div>
        <div class="row-bot">${safeInfo || "<span style='color:var(--muted)'>—</span>"}</div>
      </div>
    `;
  }).join("");
}

function escapeHtml(str) {
  return (str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(x) {
  // Basic formatting; customize to € etc if you want.
  const sign = x < 0 ? "-" : "";
  const abs = Math.abs(x);
  // Keep 2 decimals if it looks like cents data; else show as integer.
  const hasCents = Math.round(abs) !== abs;
  const s = hasCents ? abs.toFixed(2) : String(Math.round(abs));
  return `${sign}${s}`;
}

function formatDateDMY(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

// ---------- Right chart (D3) ----------
let svg = null;
let g = null;
let width = 0;
let height = 0;

const germanTime = d3.timeFormatLocale({
  dateTime: "%A, der %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],

  days: [
    "Sonntag", "Montag", "Dienstag", "Mittwoch",
    "Donnerstag", "Freitag", "Samstag"
  ],
  shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],

  months: [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ],
  shortMonths: [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
  ]
});


function clearChart() {
  chartHost.querySelector("svg")?.remove();
  svg = null;
  g = null;
}

function applyChartSelection() {
  if (!svg) return;

  const hasSel = !!selected;

  d3.select(chartHost).selectAll("rect.income")
    .classed("is-selected", d => hasSel && selected.dateStr === d.dateStr && selected.kind === "income")
    .classed("is-dim", d => hasSel && selected.dateStr !== d.dateStr);

  d3.select(chartHost).selectAll("rect.expense")
    .classed("is-selected", d => hasSel && selected.dateStr === d.dateStr && selected.kind === "expense")
    .classed("is-dim", d => hasSel && selected.dateStr !== d.dateStr);

  d3.select(chartHost).selectAll("circle.baldot")
    .classed("is-selected", d => hasSel && selected.dateStr === d.dateStr)
    .classed("is-dim", d => hasSel && selected.dateStr !== d.dateStr);
}

function getDateFilteredRows() {
  const start = startDateEl.value ? new Date(startDateEl.value + "T00:00:00") : null;
  const end = endDateEl.value ? new Date(endDateEl.value + "T00:00:00") : null;

  // If end is set, include the whole end day by using <= end
  return allRows.filter(r => {
    if (start && r.date < start) return false;
    if (end && r.date > end) return false;
    return true;
  });
}

function renderChart() {
  if (allRows.length === 0) {
    clearChart();
    return;
  }

  const start = startDateEl.value ? new Date(startDateEl.value + "T00:00:00") : null;
  const end = endDateEl.value ? new Date(endDateEl.value + "T00:00:00") : null;

  const txInRange = allRows.filter(r => {
    if (start && r.date < start) return false;
    if (end && r.date > end) return false;
    return true;
  });

  // Carry-in opening balance (set to 0 if you want balance to "restart" in-range)
  const openingBalance = start
    ? allRows.filter(r => r.date < start).reduce((a, r) => a + r.amount, 0)
    : 0;

  // ---- Aggregate by day: income/expense/net + tx list ----
  const dayMap = new Map();
  for (const r of txInRange) {
    const key = r.dateStr;
    if (!dayMap.has(key)) {
      dayMap.set(key, {
        date: r.date,
        dateStr: r.dateStr,
        income: 0,
        expense: 0, // negative number
        net: 0,
        tx: []
      });
    }
    const d = dayMap.get(key);
    d.net += r.amount;
    if (r.amount >= 0) d.income += r.amount;
    else d.expense += r.amount; // stays negative
    d.tx.push(r);
  }

  const days = Array.from(dayMap.values()).sort((a, b) => a.date - b.date);

  // Running balance using daily net
  let bal = openingBalance;
  for (const d of days) {
    bal += d.net;
    d.balance = bal;
  }

  clearChart();

  const padding = { top: 16, right: 56, bottom: 34, left: 54 };
  const rect = chartHost.getBoundingClientRect();
  const width = Math.max(300, rect.width - 28);
  const height = Math.max(260, rect.height - 28);

  svg = d3.select(chartHost)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  g = svg.append("g")
    .attr("transform", `translate(${padding.left},${padding.top})`);

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  if (days.length === 0) {
    g.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("fill", "#6b7280")
      .text("No data in the selected date range.");
    return;
  }

  // X scale
  const x = d3.scaleTime()
    .domain(d3.extent(days, d => d.date))
    .range([0, innerW]);

  // Compute a reasonable bar width based on minimum day gap
  const minDayDiff = (() => {
    if (days.length < 2) return 24 * 3600 * 1000;
    let min = Infinity;
    for (let i = 1; i < days.length; i++) {
      min = Math.min(min, days[i].date - days[i - 1].date);
    }
    return Math.max(min, 24 * 3600 * 1000);
  })();

  const totalSpan = (days[days.length - 1].date - days[0].date) + minDayDiff;
  const barWidth = Math.max(
    4,
    Math.min(22, (innerW * (minDayDiff / totalSpan)) * 0.85)
  );

  // Y scale for bars: must include both max income and max expense magnitude
  const maxIncome = d3.max(days, d => d.income) ?? 0;
  const minExpense = d3.min(days, d => d.expense) ?? 0; // negative
  const yBar = d3.scaleLinear()
    .domain([Math.min(0, minExpense), Math.max(0, maxIncome)])
    .nice()
    .range([innerH, 0]);

  // Y scale for balance line (right axis)
  const balExtent = d3.extent(days, d => d.balance);
  const yBal = d3.scaleLinear()
    .domain([balExtent[0], balExtent[1]])
    .nice()
    .range([innerH, 0]);

  // Axes
const xAxis = d3.axisBottom(x).ticks(Math.min(8, days.length)).tickFormat(germanTime.format("%b %Y"));
  const yAxisLeft = d3.axisLeft(yBar).ticks(6);
  const yAxisRight = d3.axisRight(yBal).ticks(6);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerH})`)
    .call(xAxis);

  g.append("g")
    .attr("class", "axis")
    .call(yAxisLeft);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${innerW},0)`)
    .call(yAxisRight);

  // Zero baseline
  g.append("line")
    .attr("x1", 0)
    .attr("x2", innerW)
    .attr("y1", yBar(0))
    .attr("y2", yBar(0))
    .attr("stroke", "#cbd5e1")
    .attr("stroke-dasharray", "4,4");

  // ---- Bars: income (up) ----
  g.selectAll("rect.income")
    .data(days)
    .enter()
    .append("rect")
    .attr("class", "income")
    .attr("data-date", d => d.dateStr)
    .attr("x", d => x(d.date) - barWidth / 2)
    .attr("width", barWidth)
    .attr("y", d => yBar(d.income))
    .attr("height", d => Math.max(0, yBar(0) - yBar(d.income)))
    .attr("rx", 3)
    .attr("fill", "#059669")
    .style("cursor", "pointer")
    .on("mouseenter", (event, d) => showDayTooltip(event, d))
    .on("mousemove", (event, d) => moveTooltip(event, d))
    .on("mouseleave", hideTooltip);

  // Click income bar -> select & scroll to first matching income transaction row
  g.selectAll("rect.income")
    .on("click", (event, d) => {
      event.stopPropagation?.();
      setSelection(d.dateStr, "income", { scrollIntoView: true });
    });

  // ---- Bars: expense (down) ----
  g.selectAll("rect.expense")
    .data(days)
    .enter()
    .append("rect")
    .attr("class", "expense")
    .attr("data-date", d => d.dateStr)
    .attr("x", d => x(d.date) - barWidth / 2)
    .attr("width", barWidth)
    .attr("y", d => yBar(0)) // starts at baseline
    .attr("height", d => Math.max(0, yBar(d.expense) - yBar(0))) // d.expense is negative -> yBar(expense) > yBar(0)
    .attr("rx", 3)
    .attr("fill", "#dc2626")
    .style("cursor", "pointer")
    .on("mouseenter", (event, d) => showDayTooltip(event, d))
    .on("mousemove", (event, d) => moveTooltip(event, d))
    .on("mouseleave", hideTooltip);

  // Click expense bar -> select & scroll to first matching expense transaction row
  g.selectAll("rect.expense")
    .on("click", (event, d) => {
      event.stopPropagation?.();
      setSelection(d.dateStr, "expense", { scrollIntoView: true });
    });

  // ---- Balance line overlay ----
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => yBal(d.balance));

  g.append("path")
    .datum(days)
    .attr("fill", "none")
    .attr("stroke", "#111827")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Dots on balance line
  g.selectAll("circle.baldot")
    .data(days)
    .enter()
    .append("circle")
    .attr("class", "baldot")
    .attr("data-date", d => d.dateStr)
    .attr("cx", d => x(d.date))
    .attr("cy", d => yBal(d.balance))
    .attr("r", 3.5)
    .attr("fill", "#111827")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .style("cursor", "pointer")
    .on("mouseenter", (event, d) => showDayTooltip(event, d))
    .on("mousemove", (event, d) => moveTooltip(event, d))
    .on("mouseleave", hideTooltip);

  // Click balance dot -> pick the dominant kind for that day (income if net>=0 else expense)
  g.selectAll("circle.baldot")
    .on("click", (event, d) => {
      event.stopPropagation?.();
      const kind = (d.net ?? 0) >= 0 ? "income" : "expense";
      setSelection(d.dateStr, kind, { scrollIntoView: true });
    });

  // Apply selection styling (if a row was selected)
  applyChartSelection();

  // Tooltip for aggregated day (income/expense + running balance + tx list)
  function showDayTooltip(event, d) {
    const txList = d.tx
      .slice(0, 8)
      .map(t => `• ${escapeHtml(formatMoney(t.amount))} — ${escapeHtml(t.name || "—")} — ${escapeHtml(t.info || "—")}`)
      .join("<br/>");

    const more = d.tx.length > 8
      ? `<br/><span style="color:#cbd5e1;">…and ${d.tx.length - 8} more</span>`
      : "";

    tooltip.style.opacity = "1";
    tooltip.innerHTML = `
      <div style="font-weight:700;margin-bottom:6px;">${formatDateDMY(d.date)}</div>
      <div><span style="color:#cbd5e1;">Einnahmen:</span> <strong>${escapeHtml(formatMoney(d.income))}</strong></div>
      <div><span style="color:#cbd5e1;">Ausgaben:</span> <strong>${escapeHtml(formatMoney(d.expense))}</strong></div>
      <div><span style="color:#cbd5e1;">Netto:</span> <strong>${escapeHtml(formatMoney(d.net))}</strong></div>
      <div style="margin-top:4px;"><span style="color:#cbd5e1;">Laufende Summe:</span> <strong>${escapeHtml(formatMoney(d.balance))}</strong></div>
      <div style="margin-top:8px;color:#cbd5e1;">Transaktionen:</div>
      <div style="margin-top:4px;">${txList || "<span style='color:#cbd5e1'>—</span>"}${more}</div>
    `;
    moveTooltip(event, d);
  }

  // redraw-on-resize (one-shot listener; next redraw installs again)
  window.addEventListener("resize", debounce(() => {
    if (allRows.length) renderChart();
  }, 150), { once: true });
}


function showTooltip(event, d) {
  tooltip.style.opacity = "1";
  tooltip.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;">${d.dateStr} — ${escapeHtml(formatMoney(d.amount))}</div>
    <div><span style="color:#cbd5e1;">Name:</span> ${escapeHtml(d.name || "—")}</div>
    <div style="margin-top:4px;"><span style="color:#cbd5e1;">Info:</span> ${escapeHtml(d.info || "—")}</div>
  `;
  moveTooltip(event, d);
}

function moveTooltip(event) {
  const hostRect = chartHost.getBoundingClientRect();
  const x = event.clientX - hostRect.left + 12;
  const y = event.clientY - hostRect.top + 12;

  // keep tooltip inside the chart area
  const maxX = chartHost.clientWidth - tooltip.offsetWidth - 10;
  const maxY = chartHost.clientHeight - tooltip.offsetHeight - 10;

  tooltip.style.left = `${Math.max(10, Math.min(x, maxX))}px`;
  tooltip.style.top = `${Math.max(10, Math.min(y, maxY))}px`;
}

function hideTooltip() {
  tooltip.style.opacity = "0";
}

function debounce(fn, ms) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ---------- Summary ----------
function renderSummary() {
  if (allRows.length === 0) {
    summaryEl.textContent = "";
    return;
  }

  const inRange = getDateFilteredRows();
  const sum = inRange.reduce((acc, r) => acc + r.amount, 0);
  const pos = inRange.filter(r => r.amount >= 0).reduce((a, r) => a + r.amount, 0);
  const neg = inRange.filter(r => r.amount < 0).reduce((a, r) => a + r.amount, 0);

  summaryEl.innerHTML = `
    <div><strong>${inRange.length}</strong> Datenpunkte in diesem Zeitraum</div>
    <div>Summe: <strong>${formatMoney(sum)}</strong></div>
    <div>Einnahmen: <span style="color:var(--pos);font-weight:700;">${formatMoney(pos)}</span> · Ausgaben: <span style="color:var(--neg);font-weight:700;">${formatMoney(neg)}</span></div>
  `;
}

fullRangeBtn.addEventListener("click", () => {
  if (allRows.length === 0) return;

  startDateEl.value = allRows[0].dateStr;
  endDateEl.value = allRows[allRows.length - 1].dateStr;

  renderAll();
});

// PDF Drucken Button Funktion (Button ist aktuell im HTML auskommentiert)
if (printPdfBtn) {
  printPdfBtn.addEventListener("click", () => {
    window.print();
  });
}

// Shortcut Strg + P (oder Cmd + P) abfangen
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "p") {
    // Optional: Hier könnte man Standardverhalten verhindern 
    // und eigene Logik triggern, aber window.print() ist Standard.
    console.log("Druckvorgang gestartet...");
  }
});