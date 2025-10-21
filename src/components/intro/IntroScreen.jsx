import { useState, useEffect, useRef } from 'react';
import ParticleBackground from './ParticleBackground';
import '../../styles/IntroScreen.css';

const IntroScreen = ({ onBegin, audioRef }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ripples, setRipples] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const createRipple = (event) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleBeginClick = async (event) => {
    if (isClicked) return;

    setIsClicked(true);
    createRipple(event);

    // Initialize audio
    try {
      if (audioRef && audioRef.current) {
        audioRef.current.volume = 0.6;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }

    // Fade out and transition
    setTimeout(() => {
      const screen = document.querySelector('.intro-screen');
      if (screen) {
        screen.classList.add('fade-out');
      }
    }, 400);

    setTimeout(() => {
      onBegin();
    }, 1200);
  };

  return (
    <div className="intro-screen">
      <ParticleBackground />

      <div className="intro-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-bar">
              <div
                className="loading-progress"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="loading-text">Preparing something special...</p>
          </div>
        ) : (
          <>
            <div className="title-container">
              <h1 className="main-title">
                <span className="title-word">Happy</span>
                <span className="title-word">Birthday</span>
                <span className="title-word title-name">Arij</span>
              </h1>
              <div className="title-underline"></div>
            </div>

            <button
              ref={buttonRef}
              className="begin-button"
              onClick={handleBeginClick}
              disabled={isClicked}
            >
              <span className="button-text">Click to Begin</span>
              <span className="button-glow"></span>
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: ripple.size,
                    height: ripple.size,
                  }}
                ></span>
              ))}
            </button>

            <div className="audio-indicator">
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
            </div>

            <p className="hint-text">
              <svg
                className="headphone-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              Best experienced with headphones
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default IntroScreen;
