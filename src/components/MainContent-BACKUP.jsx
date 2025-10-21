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
    // Initialize smooth scroll (using native CSS)
    initSmoothScroll();

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
