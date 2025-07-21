import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Text3D, Environment } from '@react-three/drei';
import * as THREE from 'three';
import styles from './HomePage.module.css';

// Particle system component
const ParticleField = () => {
    const pointsRef = useRef();
    const particleCount = 1000;
    
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={particleCount}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#3b82f6"
                sizeAttenuation
                transparent
                opacity={0.6}
            />
        </points>
    );
};

// Enhanced 3D shapes
const AnimatedShape = () => {
    const mainSphereRef = useRef();
    const innerSphereRef = useRef();
    const outerRingRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        
        // Main sphere animations
        if (mainSphereRef.current) {
            mainSphereRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
            mainSphereRef.current.rotation.y = time * 0.3;
            
            // Mouse interaction
            const { pointer } = state;
            mainSphereRef.current.position.x = THREE.MathUtils.lerp(
                mainSphereRef.current.position.x, 
                pointer.x * 0.3, 
                0.02
            );
            mainSphereRef.current.position.y = THREE.MathUtils.lerp(
                mainSphereRef.current.position.y, 
                pointer.y * 0.3, 
                0.02
            );
        }

        // Inner sphere animation
        if (innerSphereRef.current) {
            innerSphereRef.current.rotation.x = time * 0.8;
            innerSphereRef.current.rotation.y = -time * 0.6;
            innerSphereRef.current.scale.setScalar(0.8 + Math.sin(time * 2) * 0.1);
        }

        // Outer ring animation
        if (outerRingRef.current) {
            outerRingRef.current.rotation.z = time * 0.4;
            outerRingRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
        }
    });

    return (
        <group>
            {/* Particle field background */}
            <ParticleField />
            
            {/* Outer ring */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh ref={outerRingRef} scale={[1.8, 1.8, 0.1]}>
                    <torusGeometry args={[1, 0.05, 16, 100]} />
                    <meshStandardMaterial
                        color="#10b981"
                        metalness={0.8}
                        roughness={0.2}
                        emissive="#059669"
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </Float>

            {/* Main distorted sphere */}
            <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
                <Sphere ref={mainSphereRef} args={[1, 128, 128]} scale={1.2}>
                    <MeshDistortMaterial
                        color="#2563eb"
                        metalness={0.8}
                        roughness={0.1}
                        distort={0.4}
                        speed={2}
                        emissive="#1e40af"
                        emissiveIntensity={0.1}
                    />
                </Sphere>
            </Float>

            {/* Inner glowing sphere */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
                <Sphere ref={innerSphereRef} args={[0.3, 32, 32]} scale={0.8}>
                    <meshStandardMaterial
                        color="#f59e0b"
                        metalness={1}
                        roughness={0}
                        emissive="#d97706"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.9}
                    />
                </Sphere>
            </Float>

            {/* Additional floating elements */}
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
                <mesh position={[2, 1, -1]} scale={0.3}>
                    <octahedronGeometry args={[1]} />
                    <meshStandardMaterial
                        color="#8b5cf6"
                        metalness={0.7}
                        roughness={0.3}
                        emissive="#7c3aed"
                        emissiveIntensity={0.2}
                    />
                </mesh>
            </Float>

            <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.4}>
                <mesh position={[-2, -1, 1]} scale={0.2}>
                    <icosahedronGeometry args={[1]} />
                    <meshStandardMaterial
                        color="#ec4899"
                        metalness={0.6}
                        roughness={0.4}
                        emissive="#db2777"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </Float>
        </group>
    );
};

// Loading component
const LoadingFallback = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#60a5fa',
        fontSize: '1.2rem',
        fontWeight: '600'
    }}>
        <div className="spinner" style={{ marginRight: '1rem' }}></div>
        Loading 3D Experience...
    </div>
);

const HomePage = () => {
    return (
        <div className={`${styles.container} fade-in`}>
            <div className={styles.textSection}>
                <h1 className={styles.mainTitle}>
                    <span>Perdagangkan Aset Digital</span>
                    <span>dengan <span className={styles.highlight}>Percaya Diri</span></span>
                </h1>
                <p className={styles.subtitle}>
                    Platform trading cryptocurrency terdepan dengan teknologi blockchain terbaru. 
                    Nikmati pengalaman trading yang aman, cepat, dan menguntungkan dengan 
                    fitur analisis real-time dan komunitas global.
                </p>
                <button className={styles.ctaButton}>
                    <span style={{ marginRight: '0.5rem' }}>🚀</span>
                    Mulai Trading Sekarang
                </button>
            </div>
            
            <div className={styles.canvasContainer}>
                <Canvas 
                    camera={{ 
                        position: [0, 0, 5], 
                        fov: 60,
                        near: 0.1,
                        far: 1000
                    }}
                    gl={{ 
                        antialias: true, 
                        alpha: true,
                        powerPreference: "high-performance"
                    }}
                    dpr={[1, 2]}
                >
                    <Suspense fallback={<LoadingFallback />}>
                        {/* Enhanced lighting setup */}
                        <Environment preset="city" />
                        <ambientLight intensity={0.2} />
                        <directionalLight 
                            position={[10, 10, 5]} 
                            intensity={1} 
                            color="#ffffff"
                            castShadow
                        />
                        <pointLight 
                            position={[-10, -10, -10]} 
                            color="#3b82f6" 
                            intensity={0.8}
                        />
                        <pointLight 
                            position={[10, -10, 5]} 
                            color="#10b981" 
                            intensity={0.6}
                        />
                        <spotLight
                            position={[0, 10, 0]}
                            angle={0.3}
                            penumbra={1}
                            intensity={0.5}
                            color="#f59e0b"
                        />
                        
                        {/* Main 3D content */}
                        <AnimatedShape />
                        
                        {/* Post-processing effects would go here */}
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};

export default HomePage;