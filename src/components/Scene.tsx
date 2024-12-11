import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Car } from './Car';
import { Ground } from './Ground';

export function Scene() {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <OrbitControls />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Physics broadphase="SAP" gravity={[0, -9.81, 0]}>
        <Car />
        <Ground />
      </Physics>
    </Canvas>
  );
}