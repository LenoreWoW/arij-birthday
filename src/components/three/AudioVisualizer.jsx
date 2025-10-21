import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioReactiveVertexShader, audioReactiveFragmentShader } from '../../shaders/audioReactive';

function Particles({ audioData }) {
  const particlesRef = useRef();
  const particleCount = 1000;

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const radius = 6;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius + (Math.random() - 0.5) * 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const { low, mid, high } = audioData;
      const time = state.clock.elapsedTime;

      // Pulse scale based on audio
      const scale = 1 + (low * 0.3 + mid * 0.2 + high * 0.1);
      particlesRef.current.scale.setScalar(scale);

      // Rotate particles
      particlesRef.current.rotation.y = time * 0.1 + high * 0.05;
      particlesRef.current.rotation.x = time * 0.05 + mid * 0.03;

      // Update particle material opacity
      if (particlesRef.current.material) {
        particlesRef.current.material.opacity = 0.6 + high * 0.4;
      }
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffd4e5"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

function AudioVisualizer({ audioElement }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const audioDataRef = useRef({ low: 0, mid: 0, high: 0 });

  // Initialize audio analysis
  useEffect(() => {
    if (!audioElement) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (error) {
      console.warn('Audio analysis not available:', error);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioElement]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioLow: { value: 0 },
      uAudioMid: { value: 0 },
      uAudioHigh: { value: 0 },
      uIntensity: { value: 1.5 },
      uColorA: { value: new THREE.Color('#ff6b9d') },
      uColorB: { value: new THREE.Color('#ffd4e5') },
      uColorC: { value: new THREE.Color('#ffd700') },
    }),
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Analyze audio
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const bufferLength = dataArrayRef.current.length;
      const lowEnd = Math.floor(bufferLength * 0.2);
      const midEnd = Math.floor(bufferLength * 0.6);

      let lowSum = 0;
      let midSum = 0;
      let highSum = 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArrayRef.current[i] / 255;
        if (i < lowEnd) lowSum += value;
        else if (i < midEnd) midSum += value;
        else highSum += value;
      }

      audioDataRef.current.low = lowSum / lowEnd;
      audioDataRef.current.mid = midSum / (midEnd - lowEnd);
      audioDataRef.current.high = highSum / (bufferLength - midEnd);
    } else {
      // Fallback animation when no audio
      audioDataRef.current.low = (Math.sin(time * 0.5) + 1) * 0.3;
      audioDataRef.current.mid = (Math.sin(time * 0.7) + 1) * 0.3;
      audioDataRef.current.high = (Math.sin(time * 0.9) + 1) * 0.3;
    }

    // Update uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uAudioLow.value = audioDataRef.current.low;
      materialRef.current.uniforms.uAudioMid.value = audioDataRef.current.mid;
      materialRef.current.uniforms.uAudioHigh.value = audioDataRef.current.high;
    }

    // Rotate mesh based on audio
    if (meshRef.current) {
      const rotationSpeed = 0.3 + audioDataRef.current.mid * 0.5;
      meshRef.current.rotation.y = time * rotationSpeed;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2 + audioDataRef.current.low * 0.2;
      meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.1;
    }
  });

  return (
    <group>
      {/* Main audio-reactive geometry */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={audioReactiveVertexShader}
          fragmentShader={audioReactiveFragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Particle system */}
      <Particles audioData={audioDataRef.current} />

      {/* Additional inner glow sphere */}
      <mesh scale={0.8}>
        <icosahedronGeometry args={[2, 16]} />
        <meshBasicMaterial
          color="#ffd4e5"
          transparent
          opacity={0.1 + audioDataRef.current.high * 0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default AudioVisualizer;
