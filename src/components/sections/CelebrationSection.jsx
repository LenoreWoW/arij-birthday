import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CelebrationSection.css';

gsap.registerPlugin(ScrollTrigger);

const CelebrationSection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const confettiIntervalRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const title = titleRef.current;
    const message = messageRef.current;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Confetti particles
    const confettiColors = [
      '#f093fb',
      '#f5576c',
      '#ffd700',
      '#4facfe',
      '#00f2fe',
      '#43e97b',
    ];

    class Confetti {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speed = Math.random() * 3 + 2;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.swing = Math.random() * 2 - 1;
        this.swingSpeed = Math.random() * 0.05 + 0.01;
      }

      update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * this.swingSpeed) * this.swing;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const confettiParticles = [];
    let confettiActive = false;

    const createConfetti = (count = 100) => {
      for (let i = 0; i < count; i++) {
        confettiParticles.push(new Confetti());
      }
    };

    const animateConfetti = () => {
      if (!confettiActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiParticles.forEach((confetti) => {
        confetti.update();
        confetti.draw();
      });

      requestAnimationFrame(animateConfetti);
    };

    // Trigger confetti on scroll
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      onEnter: () => {
        if (!confettiActive) {
          confettiActive = true;
          createConfetti(150);
          animateConfetti();

          // Add more confetti periodically
          confettiIntervalRef.current = setInterval(() => {
            if (confettiParticles.length < 200) {
              createConfetti(20);
            }
          }, 1000);
        }
      },
    });

    // Title animation
    const titleLetters = title.querySelectorAll('.celebration-title-letter');
    gsap.fromTo(
      titleLetters,
      {
        y: 100,
        opacity: 0,
        rotation: 180,
        scale: 0,
      },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Continuous floating animation for title
    gsap.to(title, {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Message animation
    const messageLines = message.querySelectorAll('.celebration-message-line');
    gsap.fromTo(
      messageLines,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: message,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Sparkle effect
    const sparkles = section.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
      gsap.to(sparkle, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        delay: index * 0.3,
        ease: 'power2.out',
      });
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      confettiActive = false;
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
      audioRef.current.loop = false;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      setIsPlaying(true);
    }
  };

  return (
    <section ref={sectionRef} className="celebration-section">
      <canvas ref={canvasRef} className="confetti-canvas"></canvas>

      <div className="celebration-content">
        <div className="sparkles-container">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">✨</div>
          <div className="sparkle sparkle-3">✨</div>
          <div className="sparkle sparkle-4">✨</div>
          <div className="sparkle sparkle-5">✨</div>
          <div className="sparkle sparkle-6">✨</div>
        </div>

        <h1 ref={titleRef} className="celebration-title">
          {'HAPPY BIRTHDAY!'.split('').map((letter, index) => (
            <span key={index} className="celebration-title-letter">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>

        <div ref={messageRef} className="celebration-message">
          <p className="celebration-message-line celebration-highlight">
            Here's to another year of inspiring creativity,
          </p>
          <p className="celebration-message-line celebration-highlight">
            breaking boundaries, and making magic happen.
          </p>
          <p className="celebration-message-line">
            May your day be as extraordinary as you are,
          </p>
          <p className="celebration-message-line">
            filled with joy, laughter, and endless inspiration.
          </p>
          <p className="celebration-message-line celebration-final">
            Keep shining, keep creating, keep being amazing!
          </p>
        </div>

        <div className="celebration-wishes">
          <div className="wish-card">
            <div className="wish-icon">🎨</div>
            <p className="wish-text">Endless Creativity</p>
          </div>
          <div className="wish-card">
            <div className="wish-icon">✨</div>
            <p className="wish-text">Boundless Joy</p>
          </div>
          <div className="wish-card">
            <div className="wish-icon">🌟</div>
            <p className="wish-text">Infinite Success</p>
          </div>
        </div>

        <button
          className="audio-control"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="celebration-footer">
        <p className="footer-text">With love and admiration</p>
        <div className="footer-heart">❤️</div>
      </div>
    </section>
  );
};

export default CelebrationSection;
