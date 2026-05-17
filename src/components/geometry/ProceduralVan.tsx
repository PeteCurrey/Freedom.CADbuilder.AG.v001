'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { VehicleConfig } from '@/types';

interface ProceduralVanProps {
  vehicle: VehicleConfig;
}

export default function ProceduralVan({ vehicle }: ProceduralVanProps) {
  const { length, width, height, wheelbase } = vehicle.dimensions;
  
  const l = length / 1000;
  const w = width / 1000;
  const h = height / 1000;
  const wb = (wheelbase || 3665) / 1000;

  // Exact styling parameters depending on selected model
  const style = useMemo(() => {
    switch (vehicle.model) {
      case 'mercedes-sprinter':
        return {
          color: '#f3f4f6', // Premium Arctic White
          grilleColor: '#1f2937', // Dark Slate
          grilleRows: 3,
          headlightSize: [0.15, 0.08, 0.08],
          cabLength: 1.1,
          hoodSlope: 0.45,
          windshieldSlope: 0.6,
          badgeColor: '#e5e7eb' // Chrome
        };
      case 'ford-transit':
        return {
          color: '#e5e7eb', // Platinum Silver
          grilleColor: '#111827', // Obsidian Black
          grilleRows: 4,
          headlightSize: [0.12, 0.12, 0.08],
          cabLength: 0.95,
          hoodSlope: 0.35,
          windshieldSlope: 0.68,
          badgeColor: '#1e3a8a' // Ford Blue
        };
      case 'fiat-ducato':
        return {
          color: '#ffffff', // Solid Gloss White
          grilleColor: '#374151', // Charcoal
          grilleRows: 2,
          headlightSize: [0.18, 0.07, 0.08],
          cabLength: 0.8, // Super short cabover nose
          hoodSlope: 0.25,
          windshieldSlope: 0.72, // Very upright windshield
          badgeColor: '#991b1b' // Fiat Red
        };
      case 'vw-crafter':
        return {
          color: '#d1d5db', // Indium Grey
          grilleColor: '#1f2937',
          grilleRows: 2,
          headlightSize: [0.14, 0.09, 0.08],
          cabLength: 1.05,
          hoodSlope: 0.4,
          windshieldSlope: 0.62,
          badgeColor: '#e5e7eb'
        };
      case 'renault-master':
        return {
          color: '#f9fafb', // Mineral White
          grilleColor: '#1f2937',
          grilleRows: 3,
          headlightSize: [0.16, 0.1, 0.08],
          cabLength: 1.0,
          hoodSlope: 0.42,
          windshieldSlope: 0.65,
          badgeColor: '#d97706' // Yellow/Chrome Accent
        };
      default:
        return {
          color: '#ffffff',
          grilleColor: '#1f2937',
          grilleRows: 3,
          headlightSize: [0.15, 0.08, 0.08],
          cabLength: 1.0,
          hoodSlope: 0.4,
          windshieldSlope: 0.65,
          badgeColor: '#cbd5e1'
        };
    }
  }, [vehicle.model]);

  // Create high-fidelity extruded side shell geometry
  const shellGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const cl = style.cabLength; // Cab length front offset
    
    // Front bumper to rear bumper outline mapping custom nose profile
    shape.moveTo(-l / 2, 0);
    shape.lineTo(l / 2 - cl, 0); // Bottom chassis line to start of hood
    shape.lineTo(l / 2 - cl * 0.4, cl * style.hoodSlope); // Slope up hood
    shape.lineTo(l / 2, cl * style.hoodSlope * 1.1); // Front nose edge
    shape.lineTo(l / 2 - 0.05, cl * style.hoodSlope * 1.8); // Front grille height
    shape.lineTo(l / 2 - cl * 0.45, cl * style.windshieldSlope * 2.2); // Windshield slope
    shape.lineTo(l / 2 - cl * 0.7, h); // Top roof transition
    shape.lineTo(-l / 2, h); // Main roof line
    shape.lineTo(-l / 2, 0); // Flat back doors
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: w - 0.06,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelOffset: 0,
      bevelSegments: 4
    });
  }, [l, w, h, style]);

  return (
    <group>
      {/* 1. Main Translucent Outer Shell */}
      <mesh geometry={shellGeometry} position={[0, 0.08, -(w - 0.06) / 2]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={style.color} 
          transparent 
          opacity={0.16} 
          roughness={0.15} 
          metalness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Solid Cabin / Cockpit Divider for realism */}
      <mesh position={[l / 2 - style.cabLength, h / 2, 0]}>
        <boxGeometry args={[0.02, h - 0.1, w - 0.05]} />
        <meshStandardMaterial color="#374151" transparent opacity={0.6} roughness={0.9} />
      </mesh>

      {/* 3. Solid Floor Panel */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[l - 0.1, w - 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 4. Signature Front Grille */}
      <group position={[l / 2 - 0.02, 0.4, 0]} rotation={[0, 0, -0.05]}>
        {/* Grille mesh backdrop */}
        <mesh>
          <boxGeometry args={[0.03, 0.35, w * 0.7]} />
          <meshStandardMaterial color={style.grilleColor} roughness={0.9} />
        </mesh>
        
        {/* Horizontal Grille Lines */}
        {Array.from({ length: style.grilleRows }).map((_, idx) => (
          <mesh key={idx} position={[0.02, 0.1 - (idx * 0.08), 0]}>
            <boxGeometry args={[0.01, 0.02, w * 0.65]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Center Brand Badge */}
        <mesh position={[0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshStandardMaterial color={style.badgeColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 5. Signature Headlights */}
      <group position={[l / 2 - 0.04, 0.45, 0]}>
        {/* Left Headlight */}
        <mesh position={[0, 0, w * 0.38]}>
          <boxGeometry args={style.headlightSize as [number, number, number]} />
          <meshStandardMaterial color="#fff" emissive="#fffee0" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        {/* Right Headlight */}
        <mesh position={[0, 0, -w * 0.38]}>
          <boxGeometry args={style.headlightSize as [number, number, number]} />
          <meshStandardMaterial color="#fff" emissive="#fffee0" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
      </group>

      {/* 6. Front Windshield Panel */}
      <mesh 
        position={[l / 2 - style.cabLength * 0.5, h * 0.65, 0]} 
        rotation={[0, 0, -style.windshieldSlope]}
      >
        <boxGeometry args={[0.02, h * 0.5, w * 0.85]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.85} roughness={0.05} metalness={0.9} />
      </mesh>

      {/* 7. Exact Wheelbase Wheels */}
      <group>
        {/* Front Left Wheel */}
        <group position={[wb / 2, 0.28, w / 2 - 0.08]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 24]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.1} />
          </mesh>
        </group>

        {/* Front Right Wheel */}
        <group position={[wb / 2, 0.28, -w / 2 + 0.08]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 24]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
            <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.1} />
          </mesh>
        </group>

        {/* Rear Left Wheel */}
        <group position={[-wb / 2, 0.28, w / 2 - 0.08]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 24]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.1} />
          </mesh>
        </group>

        {/* Rear Right Wheel */}
        <group position={[-wb / 2, 0.28, -w / 2 + 0.08]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 24]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
            <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* 8. Internal Wheel Arches */}
      <group>
        {/* Front Left Arch */}
        <mesh position={[wb / 2, 0.32, w / 2 - 0.16]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.25]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Front Right Arch */}
        <mesh position={[wb / 2, 0.32, -w / 2 + 0.16]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.25]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Rear Left Arch */}
        <mesh position={[-wb / 2, 0.32, w / 2 - 0.16]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.25]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Rear Right Arch */}
        <mesh position={[-wb / 2, 0.32, -w / 2 + 0.16]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.25]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
