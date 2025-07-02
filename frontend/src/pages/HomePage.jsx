import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import styles from './HomePage.module.css';

const AnimatedSphere = () => (
    <Sphere visible args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial color="#3B82F6" attach="material" distort={0.5} speed={2} roughness={0.1} />
    </Sphere>
);

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textSection}>
        <h1 className={styles.title}>
          Perdagangkan Aset Digital <br/> dengan <span>Percaya Diri</span>
        </h1>
        <p className={styles.subtitle}>
          Platform aman dan terpercaya untuk masa depan keuangan Anda.
        </p>
      </div>
      <div className={styles.canvasContainer}>
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} />
            <AnimatedSphere />
            <OrbitControls enableZoom={false} autoRotate={true} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default HomePage;