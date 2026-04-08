/**
 * Roadmap Navigation Logic
 * Tracks the current scroll position and updates the active roadmap dot.
 */

document.addEventListener('DOMContentLoaded', () => {
  const roadmapDots = document.querySelectorAll('.roadmap-dot');
  
  if (!roadmapDots.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px', // Triggers when section is roughly in the middle of screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    let activeId = null;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId = entry.target.getAttribute('id');
      }
    });

    if (activeId) {
      const activeDotHref = `#${activeId}`;
      let foundActive = false;
      const nav = document.querySelector('.roadmap-nav');
      
      roadmapDots.forEach(dot => {
        dot.classList.remove('active', 'past');
        if (dot.getAttribute('href') === activeDotHref) {
          dot.classList.add('active');
          foundActive = true;
          
          if (nav) {
            const progressHeight = dot.offsetTop + (dot.offsetHeight / 2) - 10;
            nav.style.setProperty('--progress-height', `${progressHeight}px`);
          }
        } else if (!foundActive) {
          dot.classList.add('past');
        }
      });
    }
  }, observerOptions);

  // Sections to track based on dot hrefs
  roadmapDots.forEach(dot => {
    const targetId = dot.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      observer.observe(targetSection);
    }

    // Smooth scrolling click handler
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
