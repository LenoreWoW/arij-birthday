import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const Timeline = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);

  const milestones = [
    {
      id: 1,
      date: '2020',
      title: 'The Beginning of Excellence',
      description: 'When creative vision met unstoppable ambition, marking the start of an incredible journey in art direction.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    },
    {
      id: 2,
      date: '2021',
      title: 'Breaking New Ground',
      description: 'Pioneering innovative design concepts that challenged conventions and set new standards in the industry.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    },
    {
      id: 3,
      date: '2022',
      title: 'Award-Winning Creativity',
      description: 'Recognition and accolades for outstanding artistic contributions that inspired teams and captivated audiences.',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    },
    {
      id: 4,
      date: '2023',
      title: 'Leading with Vision',
      description: 'Ascending to new heights of creative leadership, mentoring talents and shaping the future of design.',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    },
    {
      id: 5,
      date: '2024',
      title: 'Masterclass in Innovation',
      description: 'Pushing boundaries with groundbreaking projects that blend artistry with cutting-edge technology.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
    },
    {
      id: 6,
      date: '2025',
      title: 'The Future Awaits',
      description: 'A new chapter begins, filled with endless possibilities and dreams waiting to be realized.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    const title = section.querySelector('.timeline-title');
    const timelineLine = section.querySelector('.timeline-line');
    const items = timeline.querySelectorAll('.timeline-item');

    // Title animation
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
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Timeline line draw animation
    gsap.fromTo(
      timelineLine,
      {
        scaleY: 0,
      },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      }
    );

    // Timeline items animations
    items.forEach((item, index) => {
      const isLeft = index % 2 === 0;
      const card = item.querySelector('.timeline-card');
      const dot = item.querySelector('.timeline-dot');
      const content = item.querySelector('.timeline-content');
      const image = item.querySelector('.timeline-image');

      // Dot animation
      gsap.fromTo(
        dot,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Card slide in animation
      gsap.fromTo(
        card,
        {
          x: isLeft ? -100 : 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content stagger animation
      gsap.fromTo(
        content.children,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image parallax
      gsap.to(image, {
        y: -30,
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
    <section ref={sectionRef} className="timeline-section">
      <div className="timeline-container">
        <h2 className="timeline-title">Journey Through Time</h2>

        <div ref={timelineRef} className="timeline">
          <div className="timeline-line"></div>

          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`timeline-item ${index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'}`}
            >
              <div className="timeline-dot">
                <div className="timeline-dot-inner"></div>
              </div>

              <div className="timeline-card">
                <div className="timeline-image-wrapper">
                  <img
                    src={milestone.image}
                    alt={milestone.title}
                    className="timeline-image"
                    loading="lazy"
                  />
                  <div className="timeline-date-badge">{milestone.date}</div>
                </div>

                <div className="timeline-content">
                  <h3 className="timeline-item-title">{milestone.title}</h3>
                  <p className="timeline-item-description">{milestone.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
