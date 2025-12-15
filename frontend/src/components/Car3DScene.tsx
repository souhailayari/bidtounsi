/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei';
import { motion } from 'motion/react';
import type { Group } from 'three';
import { getModelPath, DEFAULT_CAR_COLOR } from '../utils/3dModels';

// Loader 3D moderne
function Loader3D() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-white text-sm font-medium">Chargement du modèle 3D...</p>
      </div>
    </Html>
  );
}

// Composant pour charger un modèle .glb avec gestion d'erreur améliorée
function GLBModel({ modelPath, onError }: { modelPath: string; onError?: () => void }) {
  const groupRef = useRef<Group>(null);
  
  const { scene } = useGLTF(modelPath, true, (error) => {
    console.error('Erreur de chargement du modèle .glb:', modelPath, error);
    onError?.();
  });
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

// Essayer de charger un modèle .glb, sinon utiliser la voiture simplifiée
function Car3DModel({ modelPath, color }: { modelPath?: string; color?: string }) {
  const groupRef = useRef<Group>(null);
  const carColor = color || DEFAULT_CAR_COLOR;
  const [modelError, setModelError] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  // Si un chemin de modèle est fourni et qu'il n'y a pas d'erreur, essayer de le charger
  if (modelPath && !modelError) {
    return (
      <Suspense fallback={null}>
        <GLBModel 
          modelPath={modelPath}
          onError={() => {
            console.log('Modèle 3D non trouvé, affichage du fallback');
            setModelError(true);
          }}
        />
      </Suspense>
    );
  }

  // Voiture 3D améliorée par défaut (fallback)
  return (
    <group ref={groupRef}>
      {/* Carrosserie principale avec dégradé */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.9, 4.5]} />
        <meshStandardMaterial 
          color={carColor} 
          metalness={0.9} 
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Toit arrondi */}
      <mesh position={[0, 1.35, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.7, 2.2]} />
        <meshStandardMaterial 
          color={carColor} 
          metalness={0.9} 
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Vitres teintées */}
      <mesh position={[0, 1.35, -0.3]}>
        <boxGeometry args={[1.95, 0.65, 2.15]} />
        <meshPhysicalMaterial 
          color="#0A0F1F" 
          transparent 
          opacity={0.7}
          metalness={0.1}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {/* Pare-chocs avant */}
      <mesh position={[0, 0.3, 2.4]} castShadow>
        <boxGeometry args={[2, 0.4, 0.3]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Pare-chocs arrière */}
      <mesh position={[0, 0.3, -2.4]} castShadow>
        <boxGeometry args={[2, 0.4, 0.3]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Roues avec jantes */}
      {[-1, 1].map((x) =>
        [1.5, -1.5].map((z) => (
          <group key={`wheel-${x}-${z}`} position={[x * 0.9, 0.15, z]}>
            {/* Pneu */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.45, 0.45, 0.35, 32]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            {/* Jante */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.36, 32]} />
              <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* Phares LED avant */}
      {[-0.7, 0.7].map((x) => (
        <group key={`headlight-${x}`}>
          <mesh position={[x, 0.6, 2.3]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              emissive="#FFFFFF"
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight position={[x, 0.6, 2.5]} intensity={0.5} distance={10} color="#FFFFFF" />
        </group>
      ))}

      {/* Feux arrière LED */}
      {[-0.7, 0.7].map((x) => (
        <mesh key={`taillight-${x}`} position={[x, 0.6, -2.3]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#FF0000" 
            emissive="#FF0000"
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* Spoiler arrière */}
      <mesh position={[0, 1.1, -2.3]} castShadow>
        <boxGeometry args={[2, 0.1, 0.4]} />
        <meshStandardMaterial color={carColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Logo avant (cercle) */}
      <mesh position={[0, 0.6, 2.31]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}

// Particules flottantes
function FloatingParticles() {
  const particlesRef = useRef<any>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#60A5FA" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Scène 3D principale premium
export function Car3DScene({ modelPath, color }: { modelPath?: string; color?: string }) {
  // Utiliser le modèle fourni ou le modèle par défaut
  const finalModelPath = modelPath || getModelPath();
  
  useEffect(() => {
    console.log('Car3DScene rendu');
    console.log('modelPath prop:', modelPath);
    console.log('finalModelPath:', finalModelPath);
  }, [modelPath, finalModelPath]);
  
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [6, 3, 8], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: 4, // ACESFilmicToneMapping constant
          toneMappingExposure: 1.2
        }}
      >
        {/* Éclairage premium */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Lumières d'appoint colorées */}
        <pointLight position={[-8, 4, -8]} intensity={1} color="#60A5FA" />
        <pointLight position={[8, 4, -8]} intensity={1} color="#A78BFA" />
        <spotLight 
          position={[0, 10, 0]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2}
          castShadow
        />

        {/* Environment map pour reflets réalistes */}
        <Environment preset="sunset" />

        {/* Étoiles en arrière-plan */}
        <Stars 
          radius={150} 
          depth={60} 
          count={5000} 
          factor={5} 
          saturation={0.4}
          fade
          speed={0.5}
        />

        {/* Particules flottantes */}
        <FloatingParticles />

        {/* Voiture 3D avec suspense */}
        <Suspense fallback={<Loader3D />}>
          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
          >
            <Car3DModel modelPath={finalModelPath} color={color} />
          </Float>
        </Suspense>

        {/* Ombres de contact réalistes */}
        <ContactShadows
          opacity={0.5}
          scale={15}
          blur={2}
          far={4}
          resolution={512}
          color="#000000"
          position={[0, -0.5, 0]}
        />

        {/* Sol réfléchissant */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.5, 0]} 
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#0A0F1F" 
            transparent 
            opacity={0.4}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Grille de sol */}
        <gridHelper args={[100, 50, '#1D4ED8', '#374151']} position={[0, -0.49, 0]} />

        {/* Contrôles d'orbite optimisés */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          maxDistance={15}
          minDistance={4}
        />
      </Canvas>
    </div>
  );
}

// Version mini pour les cards
export function MiniCar3D({ modelPath, color }: { modelPath?: string; color?: string }) {
  const finalModelPath = modelPath || getModelPath();
  
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [4, 2, 5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#60A5FA" />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
            <Car3DModel modelPath={finalModelPath} color={color} />
          </Float>
        </Suspense>

        <ContactShadows opacity={0.4} scale={8} blur={1.5} far={3} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
