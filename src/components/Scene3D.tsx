import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

/* ── Floating glowing sphere ── */
const GlowSphere = ({ position, color, size, speed }: {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
  });
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <Sphere ref={mesh} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
};

/* ── Rotating ring ── */
const RotatingRing = ({ position, color, radius }: {
  position: [number, number, number];
  color: string;
  radius: number;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.5;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={1.5} floatIntensity={0.8}>
      <Torus ref={mesh} args={[radius, 0.04, 16, 100]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          metalness={1}
          roughness={0}
        />
      </Torus>
    </Float>
  );
};

/* ── Mouse-reactive camera ── */
const CameraRig = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x - camera.position.x) * 0.03;
    camera.position.y += (-mouse.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

/* ── Main 3D Scene ── */
const Scene3D = () => (
  <Canvas
    className="absolute inset-0 w-full h-full"
    camera={{ position: [0, 0, 6], fov: 60 }}
    dpr={[1, 1.5]}
    gl={{ antialias: true, alpha: true }}
  >
    <CameraRig />
    <Stars radius={80} depth={40} count={3000} factor={3} fade speed={1} />

    {/* Ambient + directional lights */}
    <ambientLight intensity={0.2} />
    <pointLight position={[5, 5, 5]} color="#3b82f6" intensity={3} />
    <pointLight position={[-5, -3, 2]} color="#06b6d4" intensity={2} />
    <pointLight position={[0, 0, 4]} color="#818cf8" intensity={1} />

    {/* Main big sphere — left */}
    <GlowSphere position={[-2.8, 0.3, 0]} color="#1d4ed8" size={1.4} speed={0.6} />

    {/* Smaller sphere — right */}
    <GlowSphere position={[2.6, -0.4, -0.5]} color="#0891b2" size={0.9} speed={0.9} />

    {/* Tiny accent sphere */}
    <GlowSphere position={[1.2, 1.8, -1]} color="#6366f1" size={0.4} speed={1.4} />

    {/* Rings */}
    <RotatingRing position={[-2.8, 0.3, 0]} color="#60a5fa" radius={2.0} />
    <RotatingRing position={[2.6, -0.4, -0.5]} color="#22d3ee" radius={1.4} />
  </Canvas>
);

export default Scene3D;
