'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Grid
} from '@react-three/drei';
import { useProjectStore } from '@/store/useProjectStore';

import ProceduralVan from '../geometry/ProceduralVan';
import ProceduralFurniture from '../geometry/ProceduralFurniture';
import WeightHeatmap from './WeightHeatmap';

function SceneComponents() {
  const { components, selectedComponentId, selectComponent } = useProjectStore();

  return (
    <group position={[0, 0.21, 0]}>
      {components.map((component) => (
        <group
          key={component.id}
          position={[
            component.position.x / 1000,
            component.position.y / 1000,
            component.position.z / 1000,
          ]}
          rotation={[
            component.rotation.x,
            component.rotation.y,
            component.rotation.z,
          ]}
          onClick={(e) => {
            e.stopPropagation();
            selectComponent(component.id);
          }}
        >
          <ProceduralFurniture 
            component={component} 
            isSelected={selectedComponentId === component.id} 
          />
        </group>
      ))}
      <WeightHeatmap />
    </group>
  );
}

export default function Visualizer3D() {
  const { vehicle } = useProjectStore();

  return (
    <div className="w-full h-full bg-[#f8fafc]">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={40} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
          
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          
          <ProceduralVan vehicle={vehicle} />
          <SceneComponents />

          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
          />
          
          <Grid 
            infiniteGrid 
            fadeDistance={50} 
            fadeStrength={5} 
            sectionSize={1} 
            cellSize={0.2}
            sectionColor="#e2e8f0"
            cellColor="#cbd5e1"
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
