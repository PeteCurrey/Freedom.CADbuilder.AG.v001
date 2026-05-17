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

  // Custom brand visual and proportion setup to perfectly match the photorealistic catalog styles
  const brandConfig = useMemo(() => {
    switch (vehicle.model) {
      case 'mercedes-sprinter':
        return {
          bodyColor: '#f8fafc', // Polar White
          paintColor: '#f8fafc',
          accentColor: '#1e293b',
          noseLength: 1.15,
          hoodHeight: 0.95,
          windshieldAngle: 0.52, // Sleek aerodynamic curve
          grilleStyle: 'sprinter',
          logoShape: 'star',
          wheelType: 'premium-alloy'
        };
      case 'ford-transit':
        return {
          bodyColor: '#cbd5e1', // Frozen Silver Metallic
          paintColor: '#cbd5e1',
          accentColor: '#0f172a',
          noseLength: 1.0,
          hoodHeight: 1.02,
          windshieldAngle: 0.6, // Slightly steeper
          grilleStyle: 'transit',
          logoShape: 'oval',
          wheelType: 'sport-alloy'
        };
      case 'fiat-ducato':
        return {
          bodyColor: '#ffffff', // Italian White
          paintColor: '#ffffff',
          accentColor: '#334155',
          noseLength: 0.8, // Ultra-short profile
          hoodHeight: 1.05,
          windshieldAngle: 0.68,
          grilleStyle: 'ducato',
          logoShape: 'roundel',
          wheelType: 'steel-cap'
        };
      case 'vw-crafter':
        return {
          bodyColor: '#94a3b8', // Indium Grey Metallic
          paintColor: '#94a3b8',
          accentColor: '#1e293b',
          noseLength: 1.08,
          hoodHeight: 0.98,
          windshieldAngle: 0.55,
          grilleStyle: 'crafter',
          logoShape: 'roundel',
          wheelType: 'premium-alloy'
        };
      case 'renault-master':
        return {
          bodyColor: '#f1f5f9',
          paintColor: '#f1f5f9',
          accentColor: '#0f172a',
          noseLength: 1.05,
          hoodHeight: 1.0,
          windshieldAngle: 0.58,
          grilleStyle: 'master',
          logoShape: 'diamond',
          wheelType: 'steel-cap'
        };
      default:
        return {
          bodyColor: '#ffffff',
          paintColor: '#ffffff',
          accentColor: '#1f2937',
          noseLength: 1.0,
          hoodHeight: 0.98,
          windshieldAngle: 0.58,
          grilleStyle: 'generic',
          logoShape: 'roundel',
          wheelType: 'premium-alloy'
        };
    }
  }, [vehicle.model]);

  // Dimensions for continuous aerodynamic alignment
  const cabLength = brandConfig.noseLength + 0.45;
  const cargoLength = l - cabLength;
  const cabinStartX = l / 2 - cabLength;
  const cargoHeight = h - 0.25;

  // Wheel Spokes Helper
  const spokesArray = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <group>
      {/* =========================================================
          1. CHASSIS SYSTEM (Heavy metal structural detailing)
          ========================================================= */}
      {/* Solid Black Matte Underbody Skirts */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[l + 0.1, 0.16, w]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0.5} />
      </mesh>

      {/* Front Solid Bumper & Integrated Air Dam */}
      <mesh position={[l / 2 - 0.05, 0.16, 0]} castShadow>
        <boxGeometry args={[0.15, 0.22, w - 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Rear Solid Camper Double Bumper */}
      <mesh position={[-l / 2 - 0.04, 0.18, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, w - 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Birch Plywood Camper Floor */}
      <mesh position={[cabinStartX / 2 - cabLength / 4, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[cargoLength + 0.5, w - 0.04]} />
        <meshStandardMaterial color="#e5dcd0" roughness={0.55} metalness={0.1} />
      </mesh>

      {/* =========================================================
          2. TRANSLUCENT CAR PAINT BODY SHELL (Glassmorphism + Clearcoat)
          ========================================================= */}
      <group>
        {/* Continuous Solid Left Side Wall - High-Fidelity Transparent Physical paint */}
        <mesh position={[-0.2, h / 2 + 0.1, -w / 2]} castShadow receiveShadow>
          <boxGeometry args={[l - 0.3, h - 0.2, 0.06]} />
          <meshPhysicalMaterial 
            color={brandConfig.bodyColor} 
            transparent 
            opacity={0.14} 
            roughness={0.1} 
            metalness={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Solid Double Back Doors - Translucent Physical paint */}
        <mesh position={[-(cargoLength / 2) - 0.22 - cabinStartX / 2 + cabLength / 4, h / 2 + 0.1, 0]} castShadow>
          <boxGeometry args={[0.04, h - 0.2, w]} />
          <meshPhysicalMaterial 
            color={brandConfig.bodyColor} 
            transparent 
            opacity={0.14} 
            roughness={0.1} 
            metalness={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Solid High Roof - Translucent Physical paint */}
        <mesh position={[cabinStartX / 2 - cabLength / 4, h + 0.02, 0]} castShadow>
          <boxGeometry args={[cargoLength + 0.5, 0.05, w]} />
          <meshPhysicalMaterial 
            color={brandConfig.bodyColor} 
            transparent 
            opacity={0.14} 
            roughness={0.1} 
            metalness={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Solid Slid Open Side Door - Translucent Physical paint */}
        <mesh position={[cabinStartX / 2 - cabLength / 4 - cargoLength / 3, h / 2 + 0.08, w / 2 + 0.03]} castShadow>
          <boxGeometry args={[1.25, h - 0.25, 0.02]} />
          <meshPhysicalMaterial 
            color={brandConfig.bodyColor} 
            transparent 
            opacity={0.14} 
            roughness={0.1} 
            metalness={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </group>

      {/* =========================================================
          3. AERODYNAMIC FRONT CABIN (High-Fidelity Curvature Detail)
          ========================================================= */}
      <group position={[l / 2 - cabLength / 2, 0.58, 0]}>
        {/* Solid Front Hood - Translucent Physical paint */}
        <mesh position={[cabLength / 2 - brandConfig.noseLength / 2, -0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[brandConfig.noseLength, brandConfig.hoodHeight - 0.45, w - 0.06]} />
          <meshPhysicalMaterial 
            color={brandConfig.bodyColor} 
            transparent 
            opacity={0.16} 
            roughness={0.1} 
            metalness={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Aerodynamically Curved Windshield & Pillars */}
        <group position={[cabLength / 4 - 0.1, 0.35, 0]} rotation={[0, 0, -brandConfig.windshieldAngle]}>
          <mesh castShadow>
            <boxGeometry args={[0.02, 0.8, w - 0.08]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.85} roughness={0.02} metalness={0.95} />
          </mesh>
          <mesh position={[-0.01, 0, 0]}>
            <boxGeometry args={[0.04, 0.82, w - 0.04]} />
            <meshPhysicalMaterial color={brandConfig.bodyColor} transparent opacity={0.16} roughness={0.1} metalness={0.8} />
          </mesh>
        </group>

        {/* Solid Front Roof Shroud over Cockpit */}
        <mesh position={[-cabLength / 4, 0.65, 0]} castShadow>
          <boxGeometry args={[cabLength / 2, 0.22, w]} />
          <meshPhysicalMaterial color={brandConfig.bodyColor} transparent opacity={0.16} roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Glossy Front Window Cutouts */}
        <mesh position={[0.02, 0.15, -w / 2 - 0.005]} castShadow>
          <boxGeometry args={[0.65, 0.35, 0.01]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.85} />
        </mesh>

        {/* ================= Brand-Specific Front Grilles & Logos ================= */}
        <group position={[cabLength / 2 + 0.01 - brandConfig.noseLength / 2, -0.22, 0]}>
          {/* Black Satin Grille Backplate */}
          <mesh castShadow>
            <boxGeometry args={[0.03, 0.28, w * 0.78]} />
            <meshStandardMaterial color="#0f172a" roughness={0.95} />
          </mesh>

          {/* Mercedes Sprinter Double Chrome Grille & Emblem */}
          {brandConfig.grilleStyle === 'sprinter' && (
            <>
              <mesh position={[0.018, 0.06, 0]} castShadow><boxGeometry args={[0.012, 0.02, w * 0.74]} /><meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.05} /></mesh>
              <mesh position={[0.018, -0.06, 0]} castShadow><boxGeometry args={[0.012, 0.02, w * 0.74]} /><meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.05} /></mesh>
              {/* 3D Chrome Star Logo */}
              <mesh position={[0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.015, 24]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.05} />
              </mesh>
            </>
          )}

          {/* Ford Transit Heavy Mesh & Emblem */}
          {brandConfig.grilleStyle === 'transit' && (
            <>
              <mesh position={[0.015, 0, 0]} castShadow><boxGeometry args={[0.01, 0.22, w * 0.72]} /><meshStandardMaterial color="#1e293b" wireframe roughness={0.8} /></mesh>
              {/* Ford Chrome Oval Badge */}
              <mesh position={[0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.012, 16]} />
                <meshStandardMaterial color="#1e3b8b" metalness={0.9} roughness={0.1} />
              </mesh>
            </>
          )}

          {/* Emissive Swept Headlights */}
          <mesh position={[-0.01, 0.05, w * 0.38]} castShadow>
            <boxGeometry args={[0.04, 0.09, 0.14]} />
            <meshStandardMaterial color="#ffffff" emissive="#fffeb4" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[-0.01, 0.05, -w * 0.38]} castShadow>
            <boxGeometry args={[0.04, 0.09, 0.14]} />
            <meshStandardMaterial color="#ffffff" emissive="#fffeb4" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* F. Sleek Wing Mirrors */}
        <group position={[0.2, 0.02, w / 2 + 0.06]}>
          <mesh castShadow><boxGeometry args={[0.04, 0.02, 0.08]} /><meshStandardMaterial color="#0f172a" /></mesh>
          <mesh position={[0, 0.04, 0.04]} castShadow><boxGeometry args={[0.08, 0.2, 0.05]} /><meshStandardMaterial color="#0f172a" /></mesh>
        </group>
        <group position={[0.2, 0.02, -w / 2 - 0.06]}>
          <mesh castShadow><boxGeometry args={[0.04, 0.02, 0.08]} /><meshStandardMaterial color="#0f172a" /></mesh>
          <mesh position={[0, 0.04, -0.04]} castShadow><boxGeometry args={[0.08, 0.2, 0.05]} /><meshStandardMaterial color="#0f172a" /></mesh>
        </group>
      </group>

      {/* =========================================================
          4. HIGH-FIDELITY ALLOY WHEELS SYSTEM (Multi-Component Rims)
          ========================================================= */}
      <group>
        {/* Front Left Wheel */}
        <group position={[wb / 2, 0.32, w / 2 - 0.02]}>
          {/* Outer Black Rubber Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Inner Chrome Alloy Rim Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
          </mesh>
          {/* 3D Rim Spokes for Photorealism */}
          {spokesArray.map((_, idx) => (
            <mesh 
              key={idx}
              rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} 
              position={[0, 0, 0.035]}
              castShadow
            >
              <boxGeometry args={[0.02, 0.18, 0.18]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
            </mesh>
          ))}
        </group>

        {/* Front Right Wheel */}
        <group position={[wb / 2, 0.32, -w / 2 + 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
          </mesh>
          {spokesArray.map((_, idx) => (
            <mesh 
              key={idx}
              rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} 
              position={[0, 0, -0.035]}
              castShadow
            >
              <boxGeometry args={[0.02, 0.18, 0.18]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
            </mesh>
          ))}
        </group>

        {/* Rear Left Wheel */}
        <group position={[-wb / 2, 0.32, w / 2 - 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
          </mesh>
          {spokesArray.map((_, idx) => (
            <mesh 
              key={idx}
              rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} 
              position={[0, 0, 0.035]}
              castShadow
            >
              <boxGeometry args={[0.02, 0.18, 0.18]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
            </mesh>
          ))}
        </group>

        {/* Rear Right Wheel */}
        <group position={[-wb / 2, 0.32, -w / 2 + 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
          </mesh>
          {spokesArray.map((_, idx) => (
            <mesh 
              key={idx}
              rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} 
              position={[0, 0, -0.035]}
              castShadow
            >
              <boxGeometry args={[0.02, 0.18, 0.18]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
            </mesh>
          ))}
        </group>

        {/* Matte Black Wheel Arches */}
        <mesh position={[-wb / 2, 0.38, w / 2 - 0.18]} castShadow>
          <boxGeometry args={[0.82, 0.34, 0.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.95} />
        </mesh>
        <mesh position={[-wb / 2, 0.38, -w / 2 + 0.18]} castShadow>
          <boxGeometry args={[0.82, 0.34, 0.3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.95} />
        </mesh>
      </group>

      {/* =========================================================
          5. SOLID COCKPIT INTERIOR DETAILS
          ========================================================= */}
      <group position={[l / 2 - cabLength * 0.9, 0.48, 0]}>
        {/* Solid Driver Seat */}
        <group position={[0, 0.1, w * 0.24]}>
          <mesh castShadow><boxGeometry args={[0.42, 0.12, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
          <mesh position={[-0.18, 0.28, 0]} castShadow><boxGeometry args={[0.08, 0.52, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
        </group>
        {/* Solid Passenger Seat */}
        <group position={[0, 0.1, -w * 0.24]}>
          <mesh castShadow><boxGeometry args={[0.42, 0.12, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
          <mesh position={[-0.18, 0.28, 0]} castShadow><boxGeometry args={[0.08, 0.52, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
        </group>

        {/* Dashboard Console Block */}
        <mesh position={[0.3, 0.2, 0]} castShadow>
          <boxGeometry args={[0.2, 0.3, w - 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Steering Wheel Ring */}
        <mesh position={[0.22, 0.35, w * 0.24]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <torusGeometry args={[0.15, 0.02, 8, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
