/* ============================================================
   docs.js – Walking stepper scroll-drive + FAQ accordion
   ============================================================ */
(function () {
  'use strict';

  // ── FAQ Accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    btn.setAttribute('aria-expanded', 'false');
  });

  // ── Walking Stepper ─────────────────────────────────────────
  var stepperStops = Array.from(document.querySelectorAll('.stepper-stop[data-stepper-target]'));
  var fill         = document.querySelector('.docs-stepper__rail-fill');

  if (!stepperStops.length) return;

  var sections = stepperStops.map(function (stop) {
    return document.getElementById(stop.dataset.stepperTarget);
  });

  var totalStops = stepperStops.length;

  function updateStepper() {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
    var triggerY = navH + window.innerHeight * 0.3;
    var activeIndex = 0;

    sections.forEach(function (sec, i) {
      if (!sec) return;
      var rect = sec.getBoundingClientRect();
      if (rect.top <= triggerY) activeIndex = i;
    });

    stepperStops.forEach(function (stop, i) {
      stop.classList.remove('active', 'past');
      if (i < activeIndex)   stop.classList.add('past');
      if (i === activeIndex) stop.classList.add('active');
    });

    var fillPct = totalStops > 1 ? (activeIndex / (totalStops - 1)) * 100 : 0;
    if (fill) fill.style.height = fillPct + '%';
  }

  window.addEventListener('scroll', updateStepper, { passive: true });
  updateStepper();

  // ── Smooth scroll on stop click ──────────────────────────────
  stepperStops.forEach(function (stop) {
    stop.addEventListener('click', function (e) {
      var targetId = stop.dataset.stepperTarget;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

}());
