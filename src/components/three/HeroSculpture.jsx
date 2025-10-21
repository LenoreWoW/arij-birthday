import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { organicVertexShader, organicFragmentShader } from '../../shaders/audioReactive';

function TorusKnotSculpture({ mousePosition }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseStrength: { value: 0.3 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#ffd700') },
      uColorB: { value: new THREE.Color('#ff9eb5') },
    }),
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uMouse.value.set(
        mousePosition.x,
        mousePosition.y
      );
    }

    if (meshRef.current) {
      // Gentle continuous rotation
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

      // Mouse parallax
      meshRef.current.position.x = mousePosition.x * 0.5;
      meshRef.current.position.y = mousePosition.y * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.4, 256, 64, 2, 3]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={organicVertexShader}
        fragmentShader={organicFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function BlobSculpture({ mousePosition }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseStrength: { value: 0.4 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#ffecd1') },
      uColorB: { value: new THREE.Color('#ff9eb5') },
    }),
    []
  );

  // Custom geometry for organic blob
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 32);
    const positions = geo.attributes.position.array;

    // Add randomness to create organic shape
    for (let i = 0; i < positions.length; i += 3) {
      const vertex = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      );
      const length = vertex.length();
      const noise = Math.random() * 0.3;
      vertex.normalize().multiplyScalar(length * (1 + noise));
      positions[i] = vertex.x;
      positions[i + 1] = vertex.y;
      positions[i + 2] = vertex.z;
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();

    return geo;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uMouse.value.set(
        mousePosition.x,
        mousePosition.y
      );
    }

    if (meshRef.current) {
      // Organic floating animation
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.15;
      meshRef.current.rotation.z = Math.cos(time * 0.12) * 0.08;

      // Breathing effect
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      meshRef.current.scale.setScalar(scale);

      // Mouse parallax
      meshRef.current.position.x = mousePosition.x * 0.4;
      meshRef.current.position.y = mousePosition.y * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={organicVertexShader}
        fragmentShader={organicFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function AccentSpheres({ mousePosition }) {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.position.x = -mousePosition.x * 0.2;
      groupRef.current.position.y = -mousePosition.y * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[3, 2, -2]} scale={0.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[-3, -1.5, -1]} scale={0.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ff9eb5"
          emissive="#ff9eb5"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[2, -2, 1]} scale={0.25}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ffecd1"
          emissive="#ffecd1"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function HeroSculpture({ variant = 'blob' }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;

      // Smooth mouse movement
      setMousePosition((prev) => ({
        x: prev.x + (x - prev.x) * 0.1,
        y: prev.y + (y - prev.y) * 0.1,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  return (
    <>
      <group>
        {/* Main sculpture */}
        {variant === 'torus' ? (
          <TorusKnotSculpture mousePosition={mousePosition} />
        ) : (
          <BlobSculpture mousePosition={mousePosition} />
        )}

        {/* Accent spheres */}
        <AccentSpheres mousePosition={mousePosition} />

        {/* Subtle backdrop ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -3]}>
          <ringGeometry args={[3, 3.5, 64]} />
          <meshBasicMaterial
            color="#ffd4e5"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          radius={0.8}
        />
      </EffectComposer>
    </>
  );
}

export default HeroSculpture;
