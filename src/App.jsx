import { useState, useEffect, useRef } from 'react';
import IntroScreen from './components/intro/IntroScreen';
import MainContent from './components/MainContent';
import AudioManager from './utils/AudioManager';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioManagerRef = useRef(null);

  useEffect(() => {
    // Initialize Audio Manager
    audioManagerRef.current = new AudioManager();

    return () => {
      // Cleanup audio on unmount
      if (audioManagerRef.current) {
        audioManagerRef.current.stop();
      }
    };
  }, []);

  const handleIntroComplete = async () => {
    setIsTransitioning(true);

    // Start audio playback
    if (audioManagerRef.current) {
      try {
        await audioManagerRef.current.init('/audio/birthday-music.mp3');
        await audioManagerRef.current.play();
      } catch (error) {
        console.error('Failed to start audio:', error);
      }
    }

    // Transition delay for smooth animation
    setTimeout(() => {
      setShowIntro(false);
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <div className="app">
      {showIntro ? (
        <IntroScreen
          onComplete={handleIntroComplete}
          isTransitioning={isTransitioning}
        />
      ) : (
        <MainContent
          audioManager={audioManagerRef.current}
        />
      )}
    </div>
  );
}

export default App;
