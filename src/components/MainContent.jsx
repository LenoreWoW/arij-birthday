import { useEffect, useRef } from 'react';
import { initSmoothScroll, destroySmoothScroll } from '../utils/SmoothScroll';
import HeroSection from './sections/HeroSection';
import PhotoGallery from './sections/PhotoGallery';
import MessageSection from './sections/MessageSection';
import Timeline from './sections/Timeline';
import CelebrationSection from './sections/CelebrationSection';

function MainContent({ audioManager }) {
  const contentRef = useRef(null);

  useEffect(() => {
    // Initialize smooth scroll
    const lenis = initSmoothScroll({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
    });

    // Cleanup on unmount
    return () => {
      destroySmoothScroll();
    };
  }, []);

  return (
    <div ref={contentRef} className="main-content">
      <HeroSection audioManager={audioManager} />
      <PhotoGallery />
      <MessageSection />
      <Timeline />
      <CelebrationSection audioManager={audioManager} />
    </div>
  );
}

export default MainContent;
