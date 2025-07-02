import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import styles from './HomePage.module.css';

const AnimatedShape = () => {
    const mainSphereRef = useRef();
    const wireframeRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        
        const scale = 1 + 0.1 * Math.sin(time * 1.5);
        if (mainSphereRef.current) {
            mainSphereRef.current.scale.set(scale, scale, scale);
        }

        if (wireframeRef.current) {
            wireframeRef.current.rotation.x += 0.001;
            wireframeRef.current.rotation.y += 0.002;
        }

        const { pointer } = state;
        if (mainSphereRef.current) {
             mainSphereRef.current.position.x = THREE.MathUtils.lerp(mainSphereRef.current.position.x, pointer.x * 0.5, 0.03);
             mainSphereRef.current.position.y = THREE.MathUtils.lerp(mainSphereRef.current.position.y, pointer.y * 0.5, 0.03);
        }
    });

    return (
        <group>
            {/* Bola utama dengan material reflektif */}
            <Sphere ref={mainSphereRef} args={[1, 64, 64]} scale={1}>
                <meshStandardMaterial 
                    color="#1D4ED8"
                    metalness={0.6}
                    roughness={0.1}
                />
            </Sphere>
            {/* Lapisan wireframe untuk efek teknis */}
            <Sphere ref={wireframeRef} args={[1.01, 32, 32]} scale={1.01}>
                 <meshStandardMaterial 
                    color="#93c5fd"
                    wireframe={true}
                    transparent
                    opacity={0.1}
                />
            </Sphere>
        </group>
    );
};


const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textSection}>
        <h1 className={styles.mainTitle}>
            <span>Perdagangkan Aset Digital</span>
            <span>dengan <span className={styles.highlight}>Percaya Diri</span></span>
        </h1>
        <p className={styles.subtitle}>
          Platform aman dan terpercaya untuk masa depan keuangan Anda.
        </p>
        <button className={styles.ctaButton}>
          Mulai Sekarang
        </button>
      </div>
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} color="#3B82F6" intensity={5} />
            <AnimatedShape />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default HomePage;