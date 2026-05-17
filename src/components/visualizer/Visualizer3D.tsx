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
import * as THREE from 'three';
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
    <div className="w-full h-full bg-[#090d16] relative overflow-hidden">
      {/* CAD Studio Grids Overlay UI (for premium spatial visual feel) */}
      <div className="absolute inset-x-0 bottom-4 z-10 pointer-events-none flex justify-center">
        <div className="bg-slate-950/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">ACES FILMIC PIPELINE</span>
          </div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">STUDIO LIGHTING</span>
          </div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">SHADOW MAP: 2K OPTIMIZED</span>
          </div>
        </div>
      </div>

      <Canvas 
        shadows 
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping, 
          toneMappingExposure: 1.15
        }}
      >
        <Suspense fallback={null}>
          {/* Architectural telephoto focal crop: FOV 35, Lower epic 3/4 camera positioning */}
          <PerspectiveCamera makeDefault position={[6.5, 3.2, 6.5]} fov={32} />
          
          {/* Cinematic smooth damping orbit controls */}
          <OrbitControls 
            makeDefault 
            enableDamping 
            dampingFactor={0.05}
            minDistance={3.5} 
            maxDistance={11} 
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.05} // Blocks looking below ground plane
          />
          
          {/* Ambient light tuned down for realistic depth of shadows */}
          <ambientLight intensity={0.35} />

          {/* Steeper Main Sun Light for crisp, realistic roof & side panel shadows */}
          <directionalLight
            position={[12, 16, 8]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.00008}
            shadow-normalBias={0.02}
          />

          {/* Studio Warm Fill Light to create cinematic contrast inside the layout */}
          <spotLight
            position={[-4, 8, 8]}
            angle={0.6}
            penumbra={1}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Soft Ground Contact Shadows to anchor wheels and chassis perfectly */}
          <ContactShadows 
            position={[0, 0.01, 0]} 
            opacity={0.7} 
            scale={18} 
            blur={1.8} 
            far={3.5} 
          />
          
          <ProceduralVan vehicle={vehicle} />
          <SceneComponents />

          {/* Dark high-contrast blueprint grid helper */}
          <Grid 
            infiniteGrid 
            fadeDistance={30} 
            fadeStrength={4} 
            sectionSize={1} 
            cellSize={0.2}
            sectionColor="#1e293b"
            cellColor="#0f172a"
          />
          
          {/* Studio light preset for warm, photorealistic, professional metal/wood reflections */}
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
