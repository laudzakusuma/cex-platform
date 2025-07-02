import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Starfield = (props) => {
  const ref = useRef();
  
  const [sphere] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      p.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      if (p.length() > 1) {
        p.normalize();
      }
      positions.set([p.x, p.y, p.z], i * 3);
    }
    return [positions];
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const BackgroundCanvas = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Starfield />
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;