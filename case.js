/* Tiny SVG helpers shared by the case-study pages. Each page registers its charts with Case.charts(fn);
   fn receives the colour tokens and is re-run when the colour scheme changes. */
var Case = (function () {
  var NS = "http://www.w3.org/2000/svg";
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() }
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  function txt(parent, x, y, s, anchor, fill) { var t = el("text", { x: x, y: y, "text-anchor": anchor || "start" }, parent); if (fill) t.setAttribute("fill", fill); t.textContent = s; return t }
  function rnd(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 } }
  function svg(id) { var s = document.getElementById(id); if (s) s.innerHTML = ""; return s }
  function tokens() {
    return { ink: css("--ink"), muted: css("--muted"), line: css("--line"), paper: css("--paper"), card: css("--card"),
      leaf: css("--leaf"), leafSoft: css("--leaf-soft"), apricot: css("--apricot"), apricotSoft: css("--apricot-soft"),
      slate: css("--slate"), slateSoft: css("--slate-soft") };
  }
  /* horizontal bars: rows = [[label, value, colour?]] */
  function hbars(id, rows, o) {
    var s = svg(id); if (!s) return; var c = tokens(); o = o || {};
    var lx = o.labelW || 130, max = o.max || Math.max.apply(null, rows.map(function (r) { return Math.abs(r[1]) })), W = (o.width || 520) - lx - 60, h = o.rowH || 26;
    rows.forEach(function (r, k) {
      var y = 6 + k * h, w = Math.abs(r[1]) / max * W;
      txt(s, lx - 8, y + 13, r[0], "end");
      el("rect", { x: lx, y: y, width: Math.max(w, 1), height: h - 9, rx: 3, fill: r[2] || c.slate }, s);
      txt(s, lx + w + 6, y + 13, (o.fmt ? o.fmt(r[1]) : r[1]), "start", c.ink);
    });
  }
  function charts(fn) {
    function run() { fn(tokens(), { el: el, txt: txt, rnd: rnd, svg: svg, hbars: hbars }) }
    run();
    try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", run) } catch (e) {}
    new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  return { charts: charts, el: el, txt: txt, rnd: rnd, svg: svg, hbars: hbars };
})();
