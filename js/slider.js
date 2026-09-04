/**
 * Minimal, dependency-free image slider. Arrow-controlled only —
 * no dot pagination, no generic carousel chrome (per art direction).
 */
(function () {
  "use strict";

  var ARROW_ICON = "assets/icons/icon-arrow-right.png";

  function Slider(container, images) {
    this.container = container;
    this.images = images || [];
    this.index = 0;
    this.render();
  }

  Slider.prototype.render = function () {
    var self = this;
    this.container.innerHTML = "";
    this.container.classList.add("panel-slider");
    if (this.images.length <= 1) {
      this.container.parentElement.classList.add("panel-media--single");
    }

    var track = document.createElement("div");
    track.className = "panel-slider__track";

    this.slides = this.images.map(function (src, i) {
      var slide = document.createElement("div");
      slide.className = "panel-slider__slide" + (i === 0 ? " is-active" : "");
      var img = document.createElement("img");
      img.src = src;
      img.loading = i === 0 ? "eager" : "lazy";
      img.alt = "";
      slide.appendChild(img);
      track.appendChild(slide);
      return slide;
    });
    this.container.appendChild(track);

    if (this.images.length > 1) {
      var next = document.createElement("button");
      next.className = "panel-slider__arrow panel-slider__arrow--next";
      next.setAttribute("aria-label", "Next image");
      next.innerHTML = '<img src="' + ARROW_ICON + '" alt="">';
      next.addEventListener("click", function () { self.go(1); });

      this.container.appendChild(next);
    }
  };

  Slider.prototype.go = function (delta) {
    if (!this.slides || this.slides.length < 2) return;
    this.slides[this.index].classList.remove("is-active");
    this.index = (this.index + delta + this.slides.length) % this.slides.length;
    this.slides[this.index].classList.add("is-active");
  };

  window.MK = window.MK || {};
  window.MK.Slider = Slider;
})();
