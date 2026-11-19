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
