/* ============================================================
   MOD STORE – Phone Stage Showcase (3D Carousel swipeable)
   ============================================================ */
(function () {
  var stage = document.getElementById('phone-stage');
  if (!stage) return;

  var devices = Array.from(stage.querySelectorAll('.stage-device'));
  // We need at least 3 devices for a proper 3D carousel effect
  if (devices.length < 3) return;

  var total = devices.length;
  // By default, let's make the second device (index 1) the center to start, 
  // so index 0 is left, and index 2 is right.
  var currentIndex = 1;

  // Apply classes based on current sliding state
  function updateClasses() {
    devices.forEach(function (dev, index) {
      // Clear old positioning classes
      dev.className = 'stage-device';

      var leftIndex = (currentIndex - 1 + total) % total;
      var rightIndex = (currentIndex + 1) % total;

      if (index === currentIndex) {
        dev.classList.add('position-center');
      } else if (index === leftIndex) {
        dev.classList.add('position-left');
      } else if (index === rightIndex) {
        dev.classList.add('position-right');
      } else {
        dev.classList.add('position-hidden');
      }
    });
  }

  // Swipe Left means showing the next item
  function next() {
    currentIndex = (currentIndex + 1) % total;
    updateClasses();
  }

  // Swipe Right means showing the previous item
  function prev() {
    currentIndex = (currentIndex - 1 + total) % total;
    updateClasses();
  }

  // Initialize the carousel layout
  updateClasses();

  /* ── Touch / Mouse swipe logic ────────────────────────────── */
  var startX = 0;
  var isDragging = false;

  // Mouse Drag
  stage.addEventListener('mousedown', function (e) {
    startX = e.clientX;
    isDragging = true;
  });

  window.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        next(); // Dragged left
      } else {
        prev(); // Dragged right
      }
    }
  });
  
  // Also handle mouse leaving the stage area during drag
  stage.addEventListener('mouseleave', function (e) {
    if (isDragging) {
      isDragging = false;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    }
  });

  // Touch Swipe
  stage.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        next(); // Swiped left
      } else {
        prev(); // Swiped right
      }
    }
  }, { passive: true });

  /* ── Auto-advance every 4s ──────────────────────────────── */
  var timer = setInterval(next, 4000);

  stage.addEventListener('mouseenter', function () {
    clearInterval(timer);
  });
  stage.addEventListener('mouseleave', function () {
    clearInterval(timer); // ensure no duplicate timers
    timer = setInterval(next, 4000);
  });

  /* ── Scroll-reveal observer ─────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

})();
