import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MessageSection.css';

gsap.registerPlugin(ScrollTrigger);

const MessageSection = () => {
  const sectionRef = useRef(null);
  const messageRef = useRef(null);
  const quoteRef = useRef(null);
  const signatureRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const message = messageRef.current;
    const quote = quoteRef.current;
    const signature = signatureRef.current;

    // Quote marks animation
    const quoteMark = section.querySelector('.quote-mark-open');
    gsap.fromTo(
      quoteMark,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -45,
      },
      {
        opacity: 0.1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Message fade in with split text effect
    const lines = message.querySelectorAll('.message-line');
    gsap.fromTo(
      lines,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: message,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1,
        },
      }
    );

    // Quote animation
    gsap.fromTo(
      quote,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Signature animation
    gsap.fromTo(
      signature,
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: signature,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Parallax background gradient
    gsap.to('.message-gradient-1', {
      y: 100,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    gsap.to('.message-gradient-2', {
      y: -100,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="message-section">
      <div className="message-background">
        <div className="message-gradient-1"></div>
        <div className="message-gradient-2"></div>
      </div>

      <div className="message-container">
        <div className="quote-mark-open">"</div>

        <div ref={messageRef} className="message-content">
          <p className="message-line">
            To the most brilliant art director I know,
          </p>
          <p className="message-line">
            Your creative vision transforms the ordinary into extraordinary.
          </p>
          <p className="message-line">
            Every project you touch becomes a masterpiece,
          </p>
          <p className="message-line">
            every idea you share sparks inspiration.
          </p>
          <p className="message-line">
            Your dedication, passion, and artistic excellence
          </p>
          <p className="message-line">
            continue to amaze and inspire everyone around you.
          </p>
          <p className="message-line message-highlight">
            May this year bring you as much joy and beauty
          </p>
          <p className="message-line message-highlight">
            as you bring into the world through your art.
          </p>
        </div>

        <div ref={quoteRef} className="message-quote">
          <p className="quote-text">
            "Creativity takes courage, and you have it in abundance."
          </p>
        </div>

        <div ref={signatureRef} className="message-signature">
          <p className="signature-text">Happy Birthday, Arij</p>
          <div className="signature-line"></div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
