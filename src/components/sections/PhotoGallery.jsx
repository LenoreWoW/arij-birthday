import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PhotoGallery.css';

gsap.registerPlugin(ScrollTrigger);

const PhotoGallery = () => {
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);

  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80',
      caption: 'Creative Vision',
      size: 'large',
      offset: 0,
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      caption: 'Artistic Excellence',
      size: 'medium',
      offset: 50,
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
      caption: 'Design Mastery',
      size: 'small',
      offset: 100,
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
      caption: 'Innovative Spirit',
      size: 'medium',
      offset: 30,
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      caption: 'Boundless Creativity',
      size: 'large',
      offset: 80,
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
      caption: 'Artistic Journey',
      size: 'small',
      offset: 60,
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
      caption: 'Visionary Leader',
      size: 'medium',
      offset: 20,
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
      caption: 'Creative Soul',
      size: 'large',
      offset: 90,
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    const items = gallery.querySelectorAll('.gallery-item');

    // Title animation
    const title = section.querySelector('.gallery-title');
    gsap.fromTo(
      title,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    );

    // Gallery items parallax and reveal animations
    items.forEach((item, index) => {
      const speed = item.dataset.speed || 1;
      const offset = item.dataset.offset || 0;

      // Reveal animation
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      );

      // Parallax effect
      gsap.to(item, {
        y: offset,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'top bottom',
          end: 'bottom top',
          scrub: speed,
        },
      });

      // Image parallax inside container
      const img = item.querySelector('.gallery-image');
      gsap.to(img, {
        y: -offset * 0.5,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="photo-gallery-section">
      <div className="gallery-container">
        <h2 className="gallery-title">Moments of Brilliance</h2>
        <div ref={galleryRef} className="photo-gallery">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`gallery-item gallery-item-${photo.size}`}
              data-speed={photo.id % 2 === 0 ? 0.5 : 1.5}
              data-offset={photo.offset}
            >
              <div className="gallery-item-inner">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <p className="gallery-caption">{photo.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
