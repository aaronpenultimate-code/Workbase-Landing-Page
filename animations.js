(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      if (el.classList.contains('reveal-stagger')) {
        const children = Array.from(el.children).filter((child) => child.classList.contains('reveal'));
        children.forEach((child, index) => {
          child.style.transitionDelay = `${Math.min(index * 80, 520)}ms`;
          child.classList.add('is-visible');
        });
      }

      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach((el) => revealObserver.observe(el));

  const parallaxShapes = document.querySelectorAll('.parallax-shape');
  if (!parallaxShapes.length) return;

  let rafId = null;
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  const updateParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    parallaxShapes.forEach((shape, i) => {
      const factor = 0.05 + i * 0.025;
      const offset = clamp(scrollY * factor, -30, 30);
      shape.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    rafId = null;
  };

  window.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
})();
