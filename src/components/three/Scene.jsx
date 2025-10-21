import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

function Lights() {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />

      {/* Main key light */}
      <pointLight
        position={[10, 10, 10]}
        intensity={1.2}
        color="#ffd4e5"
        castShadow
      />

      {/* Fill light */}
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.6}
        color="#e0c9ff"
      />

      {/* Back rim light */}
      <pointLight
        position={[0, 0, -15]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Top accent light */}
      <pointLight
        position={[0, 15, 0]}
        intensity={0.5}
        color="#ffd700"
      />

      {/* Directional light for depth */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
        color="#fff0f5"
        castShadow
      />
    </>
  );
}

function SceneWrapper({ children, camera, controls = false, shadows = true }) {
  return (
    <Canvas
      shadows={shadows}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
    >
      {/* Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={camera?.position || [0, 0, 8]}
        fov={camera?.fov || 45}
        near={camera?.near || 0.1}
        far={camera?.far || 100}
      />

      {/* Lights */}
      <Lights />

      {/* Scene content */}
      <Suspense fallback={null}>
        {children}
      </Suspense>

      {/* Optional orbit controls for debugging */}
      {controls && (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          maxDistance={15}
          minDistance={3}
        />
      )}
    </Canvas>
  );
}

export default SceneWrapper;
