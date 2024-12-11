import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox, useRaycastVehicle } from '@react-three/cannon';
import { Mesh } from 'three';

export function Car() {
  const chassis = useRef<Mesh>(null);
  
  const [chassisBody] = useBox(() => ({
    mass: 1500,
    position: [0, 4, 0],
    rotation: [0, Math.PI, 0],
    args: [2.5, 1, 4],
  }));

  const wheelRadius = 0.3;
  const wheelInfo = {
    radius: wheelRadius,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 100000,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    axleLocal: [-1, 0, 0],
    chassisConnectionPointLocal: [1, 0, 1],
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
    frictionSlip: 2,
  };

  const wheels = [
    { ...wheelInfo, chassisConnectionPointLocal: [-1, 0, 1.5] },
    { ...wheelInfo, chassisConnectionPointLocal: [1, 0, 1.5] },
    { ...wheelInfo, chassisConnectionPointLocal: [-1, 0, -1.5] },
    { ...wheelInfo, chassisConnectionPointLocal: [1, 0, -1.5] },
  ];

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody,
    wheels,
    wheelInfos: wheels,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  useFrame(() => {
    if (!chassis.current) return;

    const { forward, backward, left, right } = getKeys();
    const engineForce = 1000;
    const maxSteer = 0.5;

    // Apply engine force
    if (forward) {
      api.applyEngineForce(engineForce, 2);
      api.applyEngineForce(engineForce, 3);
    } else if (backward) {
      api.applyEngineForce(-engineForce, 2);
      api.applyEngineForce(-engineForce, 3);
    } else {
      api.applyEngineForce(0, 2);
      api.applyEngineForce(0, 3);
    }

    // Apply steering
    if (left) {
      api.setSteeringValue(maxSteer, 0);
      api.setSteeringValue(maxSteer, 1);
    } else if (right) {
      api.setSteeringValue(-maxSteer, 0);
      api.setSteeringValue(-maxSteer, 1);
    } else {
      api.setSteeringValue(0, 0);
      api.setSteeringValue(0, 1);
    }
  });

  return (
    <group ref={vehicle}>
      <mesh ref={chassisBody}>
        <boxGeometry args={[2.5, 1, 4]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {wheels.map((_, index) => (
        <Wheel key={index} radius={wheelRadius} leftSide={index % 2 === 0} />
      ))}
    </group>
  );
}

function Wheel({ radius, leftSide }: { radius: number; leftSide: boolean }) {
  return (
    <mesh rotation={[0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2]}>
      <cylinderGeometry args={[radius, radius, 0.4, 32]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}

function getKeys() {
  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  if (typeof window !== 'undefined') {
    keys.forward = !!window?.keyMap?.['ArrowUp'];
    keys.backward = !!window?.keyMap?.['ArrowDown'];
    keys.left = !!window?.keyMap?.['ArrowLeft'];
    keys.right = !!window?.keyMap?.['ArrowRight'];
  }

  return keys;
}