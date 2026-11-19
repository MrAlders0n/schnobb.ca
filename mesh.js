// Floods a message through the drawn mesh, one hop at a time.
(function () {
  var svg = document.querySelector(".mesh");
  if (!svg || !svg.animate) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var nodes = Array.prototype.slice.call(svg.querySelectorAll(".node"));
  var pulses = Array.prototype.slice.call(svg.querySelectorAll(".pulse"));
  var HOP = 420;

  var neighbours = nodes.map(function () { return []; });
  pulses.forEach(function (p) {
    var a = +p.dataset.a, b = +p.dataset.b;
    neighbours[a].push(b);
    neighbours[b].push(a);
  });

  function depthsFrom(origin) {
    var depth = nodes.map(function () { return -1; });
    var queue = [origin];
    depth[origin] = 0;
    while (queue.length) {
      var n = queue.shift();
      neighbours[n].forEach(function (m) {
        if (depth[m] < 0) { depth[m] = depth[n] + 1; queue.push(m); }
      });
    }
    return depth;
  }

  function flood() {
    if (document.hidden) return;
    var origin = Math.floor(Math.random() * nodes.length);
    var depth = depthsFrom(origin);

    pulses.forEach(function (p) {
      var a = +p.dataset.a, b = +p.dataset.b;
      if (depth[a] === depth[b]) return;
      var from = depth[a] < depth[b] ? a : b;
      var to = from === a ? b : a;
      p.setAttribute("x1", nodes[from].dataset.x);
      p.setAttribute("y1", nodes[from].dataset.y);
      p.setAttribute("x2", nodes[to].dataset.x);
      p.setAttribute("y2", nodes[to].dataset.y);
      p.animate(
        [
          { strokeDashoffset: 1, opacity: 1 },
          { strokeDashoffset: 0, opacity: 1, offset: 0.55 },
          { strokeDashoffset: 0, opacity: 0 }
        ],
        { duration: 1100, delay: depth[from] * HOP, easing: "ease-out" }
      );
    });

    nodes.forEach(function (n, i) {
      var delay = depth[i] * HOP;
      n.querySelector(".dot").animate(
        [{ fill: "#ff4f7b", stroke: "#ff4f7b" }, { fill: "#0d2c36", stroke: "#63d8c6" }],
        { duration: 1400, delay: delay, easing: "ease-out" }
      );
      n.querySelector(".ring").animate(
        [{ transform: "scale(1)", opacity: 0.9 }, { transform: "scale(" + (i === origin ? 5 : 3) + ")", opacity: 0 }],
        { duration: 1200, delay: delay, easing: "ease-out" }
      );
    });
  }

  setTimeout(flood, 600);
  setInterval(flood, 5200);
})();

// Decodes the handle from scrambled glyphs once, on load.
(function () {
  var el = document.querySelector(".decode");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var target = el.textContent;
  var glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789";
  var start = null;
  var DURATION = 1100;
  el.setAttribute("aria-label", target);
  function frame(now) {
    if (start === null) start = now;
    var solved = Math.floor(((now - start) / DURATION) * target.length);
    if (solved >= target.length) { el.textContent = target; return; }
    var out = target.slice(0, solved);
    for (var i = solved; i < target.length; i++) {
      out += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
    }
    el.textContent = out;
    setTimeout(function () { requestAnimationFrame(frame); }, 45);
  }
  setTimeout(function () { requestAnimationFrame(frame); }, 350);
})();
