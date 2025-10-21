import { useEffect } from 'react';

function MainContent({ audioManager }) {
  useEffect(() => {
    // Enable native smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="main-content" style={{ padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Happy Birthday Arij!</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Welcome to your special birthday website!
      </p>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        Music is playing: {audioManager ? 'Audio Manager Ready' : 'No Audio Manager'}
      </p>

      <div style={{ marginTop: '100vh', padding: '2rem', background: '#f0f0f0' }}>
        <h2>Section 2</h2>
        <p>Scroll down to test smooth scrolling...</p>
      </div>

      <div style={{ marginTop: '100vh', padding: '2rem', background: '#e0e0e0' }}>
        <h2>Section 3</h2>
        <p>Keep scrolling...</p>
      </div>

      <div style={{ marginTop: '100vh', padding: '2rem', background: '#d0d0d0' }}>
        <h2>Section 4</h2>
        <p>Almost there...</p>
      </div>

      <div style={{ marginTop: '100vh', padding: '2rem', background: '#c0c0c0' }}>
        <h2>The End!</h2>
        <p>You made it! 🎉</p>
      </div>
    </div>
  );
}

export default MainContent;
