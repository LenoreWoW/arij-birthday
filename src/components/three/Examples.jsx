import { useRef } from 'react';
import Scene from './Scene';
import AudioVisualizer from './AudioVisualizer';
import HeroSculpture from './HeroSculpture';

/**
 * Example 1: Audio Visualizer for Intro Section
 * Features: Audio-reactive geometry, particles, glow effects
 */
export function IntroExample() {
  const audioRef = useRef();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0a0a0a' }}>
      {/* Three.js Scene */}
      <Scene
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows={false}
      >
        <AudioVisualizer audioElement={audioRef.current} />
      </Scene>

      {/* HTML Content Overlay */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        textAlign: 'center',
        color: 'white',
        pointerEvents: 'none'
      }}>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>Happy Birthday Arij</h1>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/path/to/music.mp3"
        style={{ display: 'none' }}
      />
    </div>
  );
}

/**
 * Example 2: Hero Section with Blob Sculpture
 * Features: Organic shape, mouse parallax, bloom effects
 */
export function HeroBlobExample() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#fff5f8' }}>
      {/* Three.js Scene */}
      <Scene
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows={true}
      >
        <HeroSculpture variant="blob" />
      </Scene>

      {/* HTML Content Overlay */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        zIndex: 10,
        maxWidth: '400px'
      }}>
        <h2 style={{ fontSize: '3rem', color: '#ff6b9d', margin: 0 }}>
          A Special Day
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Celebrating someone amazing
        </p>
      </div>
    </div>
  );
}

/**
 * Example 3: Hero Section with Torus Knot Sculpture
 * Features: Torus knot geometry, elegant materials
 */
export function HeroTorusExample() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#ffecd1' }}>
      {/* Three.js Scene */}
      <Scene
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows={true}
      >
        <HeroSculpture variant="torus" />
      </Scene>

      {/* HTML Content Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        zIndex: 10,
        maxWidth: '400px',
        textAlign: 'right'
      }}>
        <h2 style={{ fontSize: '3rem', color: '#ffd700', margin: 0 }}>
          Golden Moments
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Every moment with you shines
        </p>
      </div>
    </div>
  );
}

/**
 * Example 4: Debug Mode with Orbit Controls
 * For testing and development
 */
export function DebugExample() {
  const audioRef = useRef();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#1a1a1a' }}>
      <Scene
        camera={{ position: [0, 0, 8], fov: 45 }}
        controls={true} // Enable orbit controls
        shadows={true}
      >
        {/* Toggle between components */}
        <AudioVisualizer audioElement={audioRef.current} />
        {/* <HeroSculpture variant="blob" /> */}
        {/* <HeroSculpture variant="torus" /> */}
      </Scene>

      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <p>Debug Mode - Use mouse to rotate</p>
        <p>Scroll to zoom in/out</p>
      </div>

      <audio ref={audioRef} src="/path/to/music.mp3" style={{ display: 'none' }} />
    </div>
  );
}

/**
 * Example 5: Combined Components Layout
 * Multiple sections in one page
 */
export function FullPageExample() {
  const audioRef = useRef();

  return (
    <div>
      {/* Intro Section with Audio Visualizer */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', background: '#0a0a0a' }}>
        <Scene camera={{ position: [0, 0, 8], fov: 45 }}>
          <AudioVisualizer audioElement={audioRef.current} />
        </Scene>
        <audio ref={audioRef} src="/path/to/music.mp3" style={{ display: 'none' }} />
      </section>

      {/* Hero Section with Blob */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', background: '#fff5f8' }}>
        <Scene camera={{ position: [0, 0, 8], fov: 45 }}>
          <HeroSculpture variant="blob" />
        </Scene>
      </section>

      {/* Hero Section with Torus */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', background: '#ffecd1' }}>
        <Scene camera={{ position: [0, 0, 8], fov: 45 }}>
          <HeroSculpture variant="torus" />
        </Scene>
      </section>
    </div>
  );
}

// Default export for easy testing
export default function ThreeJsExamples() {
  return <HeroBlobExample />;
}
