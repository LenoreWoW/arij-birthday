# Three.js Components Usage Guide

## Overview
Complete, production-ready Three.js components for Arij's birthday website with audio-reactive visualizations and elegant 3D sculptures.

## Components

### 1. AudioVisualizer
Audio-reactive 3D visualization for the intro section.

**Features:**
- IcosahedronGeometry with custom shader material
- Audio-reactive vertex displacement
- Glow effect with fresnel shading
- Particle system that pulses with music (1000 particles)
- Rotation based on audio intensity
- Automatic fallback animation when no audio is playing

**Usage:**
```jsx
import AudioVisualizer from './components/three/AudioVisualizer';
import Scene from './components/three/Scene';

function IntroSection() {
  const audioRef = useRef();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Scene camera={{ position: [0, 0, 8], fov: 45 }}>
        <AudioVisualizer audioElement={audioRef.current} />
      </Scene>

      <audio ref={audioRef} src="/path/to/music.mp3" />
    </div>
  );
}
```

### 2. HeroSculpture
Organic 3D sculpture for the hero section with mouse parallax.

**Features:**
- Two variants: 'blob' (organic) or 'torus' (torus knot)
- Perlin noise vertex displacement
- Elegant materials (gold, blush pink, cream)
- Mouse parallax effect
- Subtle rotation and breathing animation
- Post-processing bloom effect
- Accent spheres with emissive materials

**Usage:**
```jsx
import HeroSculpture from './components/three/HeroSculpture';
import Scene from './components/three/Scene';

function HeroSection() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Scene camera={{ position: [0, 0, 8], fov: 45 }}>
        <HeroSculpture variant="blob" /> {/* or variant="torus" */}
      </Scene>
    </div>
  );
}
```

### 3. Scene
Main Three.js scene wrapper with proper setup.

**Features:**
- Responsive canvas with high DPI support
- Professional lighting setup (ambient, point, directional)
- Configurable camera
- Optional orbit controls for debugging
- Shadow support
- Suspense for lazy loading

**Props:**
- `camera`: Camera configuration `{ position: [x, y, z], fov: number, near: number, far: number }`
- `controls`: Enable orbit controls (default: false)
- `shadows`: Enable shadows (default: true)

### 4. Shaders (audioReactive.js)
Complete vertex and fragment shaders for all components.

**Exports:**
- `audioReactiveVertexShader`: Audio-reactive displacement with 3D Perlin noise
- `audioReactiveFragmentShader`: Fresnel glow with three-color gradient
- `organicVertexShader`: Organic displacement with mouse parallax
- `organicFragmentShader`: Iridescent material with rim lighting

## Color Palette
- Gold: `#ffd700`
- Blush Pink: `#ff9eb5`, `#ffd4e5`
- Soft Pink: `#ff6b9d`
- Cream: `#ffecd1`

## Performance
- Optimized for 60fps on modern devices
- Automatic DPI scaling (1x-2x)
- High-performance rendering mode
- Efficient shader calculations
- Particle system optimized for 1000 particles

## Dependencies
All required dependencies are already installed:
- `@react-three/fiber` ^9.4.0
- `@react-three/drei` ^10.7.6
- `@react-three/postprocessing` ^3.0.4
- `three` ^0.180.0
- `postprocessing` ^6.37.8

## Browser Compatibility
- Modern browsers with WebGL 2.0 support
- Graceful degradation for Web Audio API
- Automatic fallback animations

## Notes
- Audio analysis requires user interaction to start (browser security)
- Mouse parallax is smooth with lerp interpolation
- All components are fully responsive
- No placeholder code - production ready!
