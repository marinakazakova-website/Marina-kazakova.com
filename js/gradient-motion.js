/**
 * Gradient Motion — ambient looping background, one shared implementation
 * reused wherever it's needed (homepage Block 2, the Brands page hero
 * zone, ...). Two purple tones (site palette) drift slowly over the
 * site's own pale-grey token, with a soft grey "void" blob for negative
 * space — grey rather than black so black text placed on top of it
 * stays readable throughout the loop. Purple + pale-grey only, no lime
 * — a restrained, deliberate two-tone read. Do not fork a second
 * variant of this animation; give it a differently-sized container
 * instead.
 *
 * The canvas is padded well beyond its container and CSS-blurred (not
 * Canvas2D's own ctx.filter, which renders solid black under some
 * software/no-GPU renderers) for the soft organic edges. Sized against
 * the container's own bounding box, not the viewport, so it fills
 * exactly whichever block it sits behind.
 *
 * Usage: give a <canvas data-gradient-motion> as a direct child of the
 * element whose box it should fill (that parent needs its own
 * position/z-index so the canvas — position:absolute — layers behind
 * sibling content correctly); it auto-inits on DOMContentLoaded. Call
 * window.MK.gradientMotion.init(container, canvas) directly for cases
 * where the sizing reference isn't simply canvas.parentElement.
 */
(function () {
  "use strict";

  var GREY = "#d6d6d6";
  var PURPLE = "#7a81ff";
  var PURPLE_DIM = "#5b62d9";
  var BLUR = 90;

  function init(container, canvas) {
    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, PAD;

    function resize() {
      var rect = container.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      PAD = Math.round(BLUR * 1.7);
      var gw = W + PAD * 2, gh = H + PAD * 2;
      canvas.style.left = (-PAD) + "px";
      canvas.style.top = (-PAD) + "px";
      canvas.style.width = gw + "px";
      canvas.style.height = gh + "px";
      canvas.style.filter = "blur(" + BLUR + "px)";
      canvas.width = gw * DPR;
      canvas.height = gh * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    // A soft organic "blob" — a circle whose radius wobbles with a
    // couple of slow sine harmonics, so it never reads as a perfect disc.
    function blobPath(cx, cy, baseR, t, seed) {
      ctx.beginPath();
      var steps = 48;
      for (var i = 0; i <= steps; i++) {
        var a = (i / steps) * Math.PI * 2;
        var wob = 1
          + 0.16 * Math.sin(a * 3 + t * 0.00035 + seed)
          + 0.09 * Math.sin(a * 5 - t * 0.0005 + seed * 1.7);
        var r = baseR * wob;
        var x = cx + Math.cos(a) * r;
        var y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    function drift(t, speed, ax, ay, phase) {
      return {
        x: Math.sin(t * speed + phase) * ax,
        y: Math.cos(t * speed * 0.8 + phase * 1.3) * ay
      };
    }

    var rafId = null;
    function frame(t) {
      var gw = W + PAD * 2, gh = H + PAD * 2;
      var ox = PAD, oy = PAD; // shift so container-space (0,0) sits inside the padded canvas

      ctx.fillStyle = GREY;
      ctx.fillRect(0, 0, gw, gh);

      // Purple, lower-left — the dominant glow field.
      var d1 = drift(t, 0.00012, W * 0.10, H * 0.08, 0.0);
      ctx.fillStyle = PURPLE;
      blobPath(ox + W * 0.22 + d1.x, oy + H * 0.78 + d1.y, W * 0.44, t, 1.1);
      ctx.fill();

      // Deeper purple, upper-right — same hue family, fills the space
      // the lime blob used to occupy, keeping the two-tone read.
      var d2 = drift(t, 0.00009, W * 0.08, H * 0.07, 2.4);
      ctx.fillStyle = PURPLE_DIM;
      blobPath(ox + W * 0.74 + d2.x, oy + H * 0.22 + d2.y, W * 0.38, t, 3.3);
      ctx.fill();

      // The void — a grey blob overlapping the glow from below, the
      // negative-space "dome"; grey (not black) keeps text readable.
      var d3 = drift(t, 0.0001, W * 0.06, H * 0.05, 1.7);
      ctx.fillStyle = GREY;
      blobPath(ox + W * 0.38 + d3.x, oy + H * 1.02 + d3.y, W * 0.46, t, 7.0);
      ctx.fill();

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
  }

  window.MK = window.MK || {};
  window.MK.gradientMotion = { init: init };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-gradient-motion]").forEach(function (canvas) {
      init(canvas.parentElement, canvas);
    });
  });
})();
