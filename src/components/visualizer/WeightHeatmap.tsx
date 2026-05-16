'use client';

import React, { useMemo } from 'react';
import { useProjectStore } from '@/store/useProjectStore';

export default function WeightHeatmap() {
  const { components, getWeightStats, vehicle } = useProjectStore();
  const { centerOfGravity, totalWeight } = getWeightStats();
  
  // Create a mesh that shows a crosshair at the CoG
  const cogX = centerOfGravity.x / 1000;
  const cogZ = centerOfGravity.z / 1000;

  return (
    <group position={[0, 0.01, 0]}>
      {/* Floor Heatmap Placeholder */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[vehicle.dimensions.width / 1000, vehicle.dimensions.length / 1000]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.1} 
        />
      </mesh>

      {/* Center of Gravity Crosshair */}
      <group position={[cogX, 0.02, cogZ]}>
        {/* Dynamic Crosshair */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.12, 32]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.02, 32]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Connection lines to axles */}
        <mesh position={[0, 0, -cogZ + (vehicle.dimensions.wheelbase / 2000)]} rotation={[-Math.PI / 2, 0, 0]}>
           <planeGeometry args={[0.01, 0.5]} />
           <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Component Weight Circles */}
      {components.map(c => (
        <mesh 
          key={c.id} 
          position={[c.position.x / 1000, 0.015, c.position.z / 1000]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[Math.sqrt(c.weight) / 15, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
