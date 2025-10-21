import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

let scrollHandler = null;
let resizeHandler = null;

/**
 * Initialize smooth scroll using native CSS
 * @param {Object} options - Configuration options (kept for compatibility)
 * @returns {Function} Cleanup function
 */
export function initSmoothScroll(options = {}) {
  // Destroy existing instance if any
  if (scrollHandler) {
    destroySmoothScroll();
  }

  // Enable native smooth scrolling via CSS
  document.documentElement.style.scrollBehavior = 'smooth';

  // Refresh ScrollTrigger on scroll
  scrollHandler = () => {
    ScrollTrigger.update();
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Update ScrollTrigger on window resize
  resizeHandler = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener('resize', resizeHandler);

  // Return cleanup function
  return () => {
    destroySmoothScroll();
  };
}

/**
 * Destroy smooth scroll
 */
export function destroySmoothScroll() {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  // Reset scroll behavior
  document.documentElement.style.scrollBehavior = 'auto';

  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

/**
 * Get current scroll instance (for compatibility)
 * @returns {null}
 */
export function getLenis() {
  return null;
}

/**
 * Scroll to target element or position
 * @param {string|number|HTMLElement} target - Target element, selector, or position
 * @param {Object} options - Scroll options
 */
export function scrollTo(target, options = {}) {
  let scrollTarget = target;

  if (typeof target === 'string') {
    scrollTarget = document.querySelector(target);
  }

  if (scrollTarget instanceof HTMLElement) {
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start', ...options });
  } else if (typeof scrollTarget === 'number') {
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }
}

/**
 * Scroll to top of page
 * @param {Object} options - Scroll options
 */
export function scrollToTop(options = {}) {
  scrollTo(0, options);
}

/**
 * Stop smooth scroll (compatibility function)
 */
export function stopScroll() {
  // Native smooth scroll can't be stopped mid-animation
  console.warn('stopScroll() is not supported with native smooth scroll');
}

/**
 * Start smooth scroll (compatibility function)
 */
export function startScroll() {
  // Native smooth scroll is always active
}

/**
 * Create a scroll-triggered animation
 * @param {string|HTMLElement} trigger - Trigger element or selector
 * @param {Object} animationProps - GSAP animation properties
 * @param {Object} scrollTriggerProps - ScrollTrigger properties
 * @returns {gsap.core.Tween} GSAP animation instance
 */
export function createScrollAnimation(trigger, animationProps, scrollTriggerProps = {}) {
  const defaultScrollTriggerProps = {
    trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  };

  return gsap.to(trigger, {
    ...animationProps,
    scrollTrigger: {
      ...defaultScrollTriggerProps,
      ...scrollTriggerProps,
    },
  });
}

/**
 * Create a scroll-triggered timeline
 * @param {string|HTMLElement} trigger - Trigger element or selector
 * @param {Object} scrollTriggerProps - ScrollTrigger properties
 * @returns {gsap.core.Timeline} GSAP timeline instance
 */
export function createScrollTimeline(trigger, scrollTriggerProps = {}) {
  const defaultScrollTriggerProps = {
    trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  };

  return gsap.timeline({
    scrollTrigger: {
      ...defaultScrollTriggerProps,
      ...scrollTriggerProps,
    },
  });
}

/**
 * Pin an element during scroll
 * @param {string|HTMLElement} element - Element to pin
 * @param {Object} options - Pin options
 */
export function pinElement(element, options = {}) {
  const defaultOptions = {
    trigger: element,
    start: 'top top',
    end: '+=100%',
    pin: true,
    pinSpacing: true,
  };

  ScrollTrigger.create({
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create parallax effect
 * @param {string|HTMLElement} element - Element to animate
 * @param {number} speed - Parallax speed (0-1, where 0.5 is half speed)
 */
export function createParallax(element, speed = 0.5) {
  gsap.to(element, {
    yPercent: -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/**
 * Batch create scroll animations for multiple elements
 * @param {string} selector - CSS selector for elements
 * @param {Object} animationProps - GSAP animation properties
 * @param {Object} scrollTriggerProps - ScrollTrigger properties
 */
export function batchScrollAnimation(selector, animationProps, scrollTriggerProps = {}) {
  ScrollTrigger.batch(selector, {
    onEnter: (elements) => {
      gsap.to(elements, animationProps);
    },
    start: 'top 80%',
    ...scrollTriggerProps,
  });
}

export default {
  initSmoothScroll,
  destroySmoothScroll,
  getLenis,
  scrollTo,
  scrollToTop,
  stopScroll,
  startScroll,
  createScrollAnimation,
  createScrollTimeline,
  pinElement,
  createParallax,
  batchScrollAnimation,
};
