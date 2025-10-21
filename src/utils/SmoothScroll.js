import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

/**
 * Initialize Lenis smooth scroll with GSAP ScrollTrigger integration
 * @param {Object} options - Lenis configuration options
 * @returns {Function} Cleanup function
 */
export function initSmoothScroll(options = {}) {
  // Destroy existing instance if any
  if (lenisInstance) {
    destroySmoothScroll();
  }

  // Default Lenis options
  const defaultOptions = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  };

  // Create Lenis instance
  lenisInstance = new Lenis({
    ...defaultOptions,
    ...options,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Add Lenis to GSAP ticker for smooth integration
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  // Disable GSAP ticker lag smoothing for more consistent scrolling
  gsap.ticker.lagSmoothing(0);

  // Update ScrollTrigger on window resize
  const handleResize = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    destroySmoothScroll();
  };
}

/**
 * Destroy Lenis smooth scroll instance
 */
export function destroySmoothScroll() {
  if (lenisInstance) {
    // Remove from GSAP ticker
    gsap.ticker.remove((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Destroy Lenis instance
    lenisInstance.destroy();
    lenisInstance = null;

    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}

/**
 * Get current Lenis instance
 * @returns {Lenis|null} Current Lenis instance
 */
export function getLenis() {
  return lenisInstance;
}

/**
 * Scroll to target element or position
 * @param {string|number|HTMLElement} target - Target element, selector, or position
 * @param {Object} options - Scroll options
 */
export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    });
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
 * Stop smooth scroll
 */
export function stopScroll() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

/**
 * Start smooth scroll
 */
export function startScroll() {
  if (lenisInstance) {
    lenisInstance.start();
  }
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
