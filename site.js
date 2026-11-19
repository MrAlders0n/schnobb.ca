// The handle sits scrambled until it reaches the middle of the screen, then decodes once.
(function () {
  var el = document.querySelector(".decode");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var target = el.textContent;
  var glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789";
  var DURATION = 1100;

  function scramble(from) {
    var out = target.slice(0, from);
    for (var i = from; i < target.length; i++) {
      out += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
    }
    return out;
  }

  function decode() {
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var solved = Math.floor(((now - start) / DURATION) * target.length);
      if (solved >= target.length) {
        el.textContent = target;
        el.style.width = "";
        return;
      }
      el.textContent = scramble(solved);
      setTimeout(function () { requestAnimationFrame(frame); }, 45);
    }
    requestAnimationFrame(frame);
  }

  if (!("IntersectionObserver" in window)) return;

  el.setAttribute("aria-label", target);
  // Hold the finished width so the line never reflows while scrambled.
  el.style.width = el.getBoundingClientRect().width + "px";
  el.textContent = scramble(0);

  // The bottom half of the screen is cut off, so this fires as the handle crosses the middle.
  var watcher = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    watcher.disconnect();
    decode();
  }, { rootMargin: "0px 0px -50% 0px" });
  watcher.observe(el);
})();
