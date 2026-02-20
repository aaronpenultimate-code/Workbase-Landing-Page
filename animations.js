document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealNodes = Array.from(document.querySelectorAll('.reveal'));
  const staggerNodes = Array.from(document.querySelectorAll('.reveal-stagger'));

  if (reducedMotion) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;

      if (node.classList.contains('reveal-stagger')) {
        const children = Array.from(node.children).filter((child) => child.classList.contains('reveal'));
        children.forEach((child, index) => {
          child.style.transitionDelay = `${Math.min(index * 90, 540)}ms`;
          child.classList.add('is-visible');
        });
      } else {
        node.classList.add('is-visible');
      }

      obs.unobserve(node);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  revealNodes.forEach((node) => {
    if (node.closest('.hero')) {
      node.classList.add('is-visible');
      return;
    }
    observer.observe(node);
  });

  staggerNodes.forEach((node) => {
    if (node.closest('.hero')) return;
    observer.observe(node);
  });

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const parallaxShapes = Array.from(document.querySelectorAll('.parallax-shape'));
  if (!parallaxShapes.length) return;

  let latestScrollY = window.scrollY || 0;
  let ticking = false;

  const updateParallax = () => {
    parallaxShapes.forEach((shape) => {
      const speed = Number(shape.dataset.speed || 0.06);
      const offset = clamp(latestScrollY * speed, -36, 36);
      shape.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    latestScrollY = window.scrollY || 0;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
});
