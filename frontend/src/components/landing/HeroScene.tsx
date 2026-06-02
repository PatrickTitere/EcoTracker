import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars, MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

function EcoOrb({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
      ref.current.rotation.y = state.clock.elapsedTime * 0.22 * speed;
    }
  });
  return (
    <Float speed={1.8 * speed} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere ref={ref} args={[0.55, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function Ring() {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[2.2, 0.03, 16, 100]} />
      <meshBasicMaterial color="#4ade80" transparent opacity={0.35} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#86efac" />
      <pointLight position={[-10, -5, -5]} intensity={0.8} color="#38bdf8" />
      <Stars radius={80} depth={40} count={4000} factor={3} saturation={0} fade speed={0.6} />
      <Sparkles count={120} scale={12} size={2} speed={0.4} color="#4ade80" />
      <Sparkles count={60} scale={8} size={3} speed={0.2} color="#a78bfa" position={[0, 2, 0]} />
      <EcoOrb position={[0, 0, 0]} color="#22c55e" speed={1} />
      <EcoOrb position={[-1.8, 0.6, -0.5]} color="#38bdf8" speed={1.3} />
      <EcoOrb position={[1.6, -0.4, 0.3]} color="#a3e635" speed={0.9} />
      <EcoOrb position={[0.5, 1.2, -1.2]} color="#2dd4bf" speed={1.1} />
      <Ring />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="hero-scene">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="hero-scene-vignette" aria-hidden />
    </div>
  );
}