/* ============================================================
   nav.js – Sticky nav, mobile hamburger, scroll-reveal
   ============================================================ */
(function () {
  'use strict';

  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a, button') : [];

  // ── Sticky scroll class ────────────────────────────────────
  function onScroll() {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    revealOnScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Hamburger toggle ───────────────────────────────────────
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Scroll-reveal observer ─────────────────────────────────
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    reveals.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  // Use IntersectionObserver when available
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      io.observe(el);
    });
  }

  // ── Smooth anchor scroll ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') === '#') return;
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll to Top Button ───────────────────────────────────
  function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.id = 'scrollToTop';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ── Custom Cursor ──────────────────────────────────────────
  function initCustomCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    
    const ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mousedown', function() {
      dot.classList.add('clicking');
      ring.classList.add('clicking');
    });

    document.addEventListener('mouseup', function() {
      dot.classList.remove('clicking');
      ring.classList.remove('clicking');
    });

    function animateCursor() {
      // Very fast spring for dot
      dotX += (mouseX - dotX) * 0.6;
      dotY += (mouseY - dotY) * 0.6;
      // Slower spring for ring
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      dot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactives
    const interactives = document.querySelectorAll('a, button, input, select, textarea, .roadmap-dot, .feature-card, .btn');
    
    interactives.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      });
      el.addEventListener('mouseleave', function() {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      });
    });
  }

  // Initialize after DOM is fully loaded just in case
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initScrollToTop();
      initCustomCursor();
    });
  } else {
    initScrollToTop();
    initCustomCursor();
  }

}());
