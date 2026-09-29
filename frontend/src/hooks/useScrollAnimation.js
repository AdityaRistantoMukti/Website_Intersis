import { useEffect, useRef } from 'react';

/**
 * Hook to observe elements entering viewport and add 'visible' class
 * for CSS-based scroll animations (fade-up, fade-in)
 */
export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.fade-up, .fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/**
 * Hook to animate a number counter from 0 to target
 * @param {number} target - End number
 * @param {number} duration - Animation duration in ms
 */
export function useCountUp(target, duration = 2000) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startTime = null;
    let animationId;
    let started = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            animationId = requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        };
        animationId = requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [target, duration]);

  return ref;
}
