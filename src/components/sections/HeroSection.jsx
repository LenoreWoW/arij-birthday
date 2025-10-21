import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    // Initial entrance animations
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      title.querySelectorAll('.hero-title-letter'),
      {
        y: 100,
        opacity: 0,
        rotationX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
      }
    )
    .fromTo(
      subtitle,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.5'
    )
    .fromTo(
      scrollIndicator,
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    // Scroll indicator bounce animation
    gsap.to(scrollIndicator, {
      y: 10,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(title, {
          y: progress * 200,
          opacity: 1 - progress * 1.5,
          scale: 1 - progress * 0.2,
          duration: 0,
        });
        gsap.to(subtitle, {
          y: progress * 150,
          opacity: 1 - progress * 2,
          duration: 0,
        });
        gsap.to(scrollIndicator, {
          opacity: 1 - progress * 3,
          duration: 0,
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    gsap.to(titleRef.current, {
      x: mousePosition.x * 20,
      y: mousePosition.y * 20,
      duration: 0.5,
      ease: 'power2.out',
    });
    gsap.to(subtitleRef.current, {
      x: mousePosition.x * 10,
      y: mousePosition.y * 10,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [mousePosition]);

  const titleLetters = 'ARIJ'.split('');

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          {titleLetters.map((letter, index) => (
            <span key={index} className="hero-title-letter">
              {letter}
            </span>
          ))}
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Art Director Extraordinaire
        </p>
      </div>

      <div ref={scrollIndicatorRef} className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <p className="scroll-text">Scroll to explore</p>
      </div>

      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </section>
  );
};

export default HeroSection;
