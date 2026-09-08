/**
 * Gradient Motion — ambient looping background for Block 2 (Experience
 * intro). Purple + lime blobs (site palette) drift slowly over the
 * site's own pale-grey token, with a soft grey "void" blob for negative
 * space — grey rather than black so the block's existing black text
 * stays readable throughout the loop.
 *
 * The canvas is padded well beyond its container and CSS-blurred (not
 * Canvas2D's own ctx.filter, which renders solid black under some
 * software/no-GPU renderers) for the soft organic edges. Sized against
 * the container's own bounding box, not the viewport, so it fills
 * exactly the block it sits behind.
 */
(function () {
  "use strict";

  var GREY = "#d6d6d6";
  var PURPLE = "#7a81ff";
  var PURPLE_DIM = "#5b62d9";
  var LIME = "#C6E298";
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

      // Deeper purple, adds weight lower-right — same hue family.
      var d2 = drift(t, 0.00009, W * 0.08, H * 0.07, 2.4);
      ctx.fillStyle = PURPLE_DIM;
      blobPath(ox + W * 0.66 + d2.x, oy + H * 0.86 + d2.y, W * 0.34, t, 3.3);
      ctx.fill();

      // Lime, upper-right — the accent glow.
      var d3 = drift(t, 0.00014, W * 0.09, H * 0.09, 4.2);
      ctx.fillStyle = LIME;
      blobPath(ox + W * 0.78 + d3.x, oy + H * 0.18 + d3.y, W * 0.40, t, 5.6);
      ctx.fill();

      // The void — a grey blob overlapping the glow from below, the
      // negative-space "dome"; grey (not black) keeps text readable.
      var d4 = drift(t, 0.0001, W * 0.06, H * 0.05, 1.7);
      ctx.fillStyle = GREY;
      blobPath(ox + W * 0.38 + d4.x, oy + H * 1.02 + d4.y, W * 0.46, t, 7.0);
      ctx.fill();

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("experienceIntroBgCanvas");
    if (!canvas) return;
    init(canvas.parentElement, canvas);
  });
})();
