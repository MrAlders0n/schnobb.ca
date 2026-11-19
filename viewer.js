// Opens gallery photos in an on-page viewer instead of a bare image file.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".gallery a"));
  if (!links.length || !window.HTMLDialogElement) return;

  var viewer = document.createElement("dialog");
  viewer.className = "viewer";
  viewer.setAttribute("aria-label", "Photo viewer");
  viewer.tabIndex = -1;
  viewer.innerHTML =
    '<img alt="">' +
    '<div class="viewer-bar">' +
    '<button type="button" data-go="-1">prev</button>' +
    '<span class="viewer-count"></span>' +
    '<button type="button" data-go="1">next</button>' +
    '<button type="button" data-close>close</button>' +
    "</div>";
  document.body.appendChild(viewer);

  var img = viewer.querySelector("img");
  var count = viewer.querySelector(".viewer-count");
  var current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    var thumb = links[current].querySelector("img");
    var full = links[current].href;
    // Show the small copy at once, then swap in the full one when it has loaded.
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    var loader = new Image();
    loader.onload = function () {
      if (links[current].href === full) img.src = full;
    };
    loader.src = full;
    count.textContent = current + 1 + " / " + links.length;
    new Image().src = links[(current + 1) % links.length].href;
  }

  function close() {
    viewer.close();
  }

  links.forEach(function (link, i) {
    link.addEventListener("click", function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      show(i);
      viewer.showModal();
      viewer.focus();
      document.documentElement.classList.add("viewing");
    });
  });

  viewer.addEventListener("close", function () {
    document.documentElement.classList.remove("viewing");
    links[current].focus();
  });

  viewer.addEventListener("click", function (event) {
    var go = event.target.getAttribute("data-go");
    if (go) show(current + Number(go));
    else if (event.target === viewer || event.target.hasAttribute("data-close")) close();
  });

  viewer.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") show(current + 1);
    if (event.key === "ArrowLeft") show(current - 1);
  });

  // Swipe sideways to move between photos, swipe down to close.
  var startX = 0, startY = 0;
  viewer.addEventListener("touchstart", function (event) {
    startX = event.changedTouches[0].clientX;
    startY = event.changedTouches[0].clientY;
  }, { passive: true });
  viewer.addEventListener("touchend", function (event) {
    var dx = event.changedTouches[0].clientX - startX;
    var dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
  }, { passive: true });
})();
