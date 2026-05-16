'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { VehicleConfig } from '@/types';

interface ProceduralVanProps {
  vehicle: VehicleConfig;
}

export default function ProceduralVan({ vehicle }: ProceduralVanProps) {
  const { length, width, height } = vehicle.dimensions;
  
  const l = length / 1000;
  const w = width / 1000;
  const h = height / 1000;

  // Create a more realistic shell using shapes/lathe or just extrusions
  const shellGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Simple side profile with curvature
    shape.moveTo(-l/2, 0);
    shape.lineTo(l/2 - 1, 0); // Start of cab
    shape.quadraticCurveTo(l/2, 0, l/2, h/2); // Front bumper/hood
    shape.lineTo(l/2 - 0.5, h); // Windscreen
    shape.lineTo(-l/2, h); // Roof
    shape.lineTo(-l/2, 0); // Rear
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: w,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 3
    });
  }, [l, w, h]);

  return (
    <group>
      {/* External Shell (Translucent) */}
      <mesh geometry={shellGeometry} position={[0, 0, -w/2]}>
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>

      {/* Internal Floor (Solid) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[l, w]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* Wheel Arches (Procedural) */}
      <mesh position={[-l/2 + 1, 0.2, -w/2 + 0.1]}>
        <boxGeometry args={[0.8, 0.4, 0.3]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-l/2 + 1, 0.2, w/2 - 0.1]}>
        <boxGeometry args={[0.8, 0.4, 0.3]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}
