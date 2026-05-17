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

  // Authentic brand-specific design parameters to match the Vanspace 3D style
  const brandConfig = useMemo(() => {
    switch (vehicle.model) {
      case 'mercedes-sprinter':
        return {
          bodyColor: '#f8fafc', // Gloss Arctic White
          accentColor: '#1e293b',
          noseLength: 1.2,
          noseHeight: 0.98,
          noseWidth: w * 0.94,
          windshieldAngle: 0.58,
          grilleStyle: 'sprinter',
          brandName: 'MERCEDES',
          badgeColor: '#cbd5e1'
        };
      case 'ford-transit':
        return {
          bodyColor: '#e2e8f0', // Frozen White
          accentColor: '#0f172a',
          noseLength: 1.05,
          noseHeight: 1.02,
          noseWidth: w * 0.95,
          windshieldAngle: 0.64,
          grilleStyle: 'transit',
          brandName: 'FORD',
          badgeColor: '#1e3b8b'
        };
      case 'fiat-ducato':
        return {
          bodyColor: '#ffffff', // Italian White
          accentColor: '#334155',
          noseLength: 0.85, // Short nose
          noseHeight: 1.05,
          noseWidth: w * 0.96,
          windshieldAngle: 0.7, // Steep
          grilleStyle: 'ducato',
          brandName: 'FIAT',
          badgeColor: '#991b1b'
        };
      case 'vw-crafter':
        return {
          bodyColor: '#d1d5db', // Indium Grey Metallic
          accentColor: '#1e293b',
          noseLength: 1.15,
          noseHeight: 1.0,
          noseWidth: w * 0.94,
          windshieldAngle: 0.6,
          grilleStyle: 'crafter',
          brandName: 'VOLKSWAGEN',
          badgeColor: '#e2e8f0'
        };
      case 'renault-master':
        return {
          bodyColor: '#f1f5f9',
          accentColor: '#0f172a',
          noseLength: 1.1,
          noseHeight: 1.04,
          noseWidth: w * 0.93,
          windshieldAngle: 0.62,
          grilleStyle: 'master',
          brandName: 'RENAULT',
          badgeColor: '#d97706'
        };
      default:
        return {
          bodyColor: '#ffffff',
          accentColor: '#1f2937',
          noseLength: 1.1,
          noseHeight: 1.0,
          noseWidth: w * 0.94,
          windshieldAngle: 0.62,
          grilleStyle: 'generic',
          brandName: 'VAN',
          badgeColor: '#cbd5e1'
        };
    }
  }, [vehicle.model, w]);

  // Proportional layout calculations
  const cabLength = brandConfig.noseLength + 0.3; // Cab front nose + cabin space
  const cargoLength = l - cabLength;
  const cabinStartX = l / 2 - cabLength;

  return (
    <group>
      {/* =========================================================
          1. REALISTIC SOLID CHASSIS & FLOOR SYSTEM
          ========================================================= */}
      {/* Heavy Black Plastic Underbody Trim */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[l, 0.16, w]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} metalness={0.4} />
      </mesh>

      {/* Rear Solid Stepped Bumper */}
      <mesh position={[-l / 2 - 0.04, 0.18, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, w - 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Front Solid Bumper & Lower Lip */}
      <mesh position={[l / 2 - 0.06, 0.16, 0]} castShadow>
        <boxGeometry args={[0.15, 0.22, brandConfig.noseWidth + 0.06]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Realistic Birch Plywood Interior Floor */}
      <mesh position={[cabinStartX / 2 - cabLength / 4, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[cargoLength + 0.4, w - 0.04]} />
        <meshStandardMaterial color="#dcd3c2" roughness={0.6} metalness={0.1} /> {/* Plywood finish */}
      </mesh>

      {/* =========================================================
          2. FRONT CABIN (100% Solid, Fully Rendered Van Cab - Vanspace Style)
          ========================================================= */}
      <group position={[l / 2 - cabLength / 2, 0.58, 0]}>
        {/* Main Solid Cab Block */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[cabLength, 0.75, w]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>

        {/* Slanted Hood Wedge */}
        <mesh position={[cabLength / 2 - brandConfig.noseLength / 4, -0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[brandConfig.noseLength / 2, 0.45, brandConfig.noseWidth]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>

        {/* Solid Windshield Frame and A-Pillars */}
        <mesh 
          position={[cabLength / 4 - 0.15, 0.55, 0]} 
          rotation={[0, 0, -brandConfig.windshieldAngle]} 
          castShadow
        >
          <boxGeometry args={[0.05, 0.65, w - 0.04]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>

        {/* Windshield Glass Sheet */}
        <mesh 
          position={[cabLength / 4 - 0.12, 0.55, 0]} 
          rotation={[0, 0, -brandConfig.windshieldAngle]} 
          castShadow
        >
          <boxGeometry args={[0.01, 0.62, w - 0.08]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.9} roughness={0.02} metalness={0.95} />
        </mesh>

        {/* Solid Cab Side Windows */}
        <mesh position={[-0.1, 0.2, w / 2]} castShadow>
          <boxGeometry args={[0.7, 0.35, 0.025]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.9} roughness={0.02} metalness={0.95} />
        </mesh>
        <mesh position={[-0.1, 0.2, -w / 2]} castShadow>
          <boxGeometry args={[0.7, 0.35, 0.025]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.9} roughness={0.02} metalness={0.95} />
        </mesh>

        {/* Solid Side Door Panels with Cutout Outlines */}
        <mesh position={[-0.05, -0.15, w / 2 + 0.005]} castShadow>
          <boxGeometry args={[0.9, 0.45, 0.01]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[-0.05, -0.15, -w / 2 - 0.005]} castShadow>
          <boxGeometry args={[0.9, 0.45, 0.01]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Detailed Wing Mirrors */}
        <group position={[0.38, 0.05, w / 2 + 0.06]}>
          <mesh castShadow><boxGeometry args={[0.04, 0.02, 0.08]} /><meshStandardMaterial color="#0f172a" /></mesh>
          <mesh position={[0, 0.04, 0.04]} castShadow><boxGeometry args={[0.08, 0.2, 0.05]} /><meshStandardMaterial color="#0f172a" /></mesh>
        </group>
        <group position={[0.38, 0.05, -w / 2 - 0.06]}>
          <mesh castShadow><boxGeometry args={[0.04, 0.02, 0.08]} /><meshStandardMaterial color="#0f172a" /></mesh>
          <mesh position={[0, 0.04, -0.04]} castShadow><boxGeometry args={[0.08, 0.2, 0.05]} /><meshStandardMaterial color="#0f172a" /></mesh>
        </group>

        {/* ================= Grilles & Brand Accessories ================= */}
        <group position={[cabLength / 2 + 0.01 + brandConfig.noseLength / 4, -0.22, 0]}>
          {/* Heavy Black Grille surround */}
          <mesh castShadow><boxGeometry args={[0.03, 0.28, brandConfig.noseWidth * 0.8]} /><meshStandardMaterial color="#0f172a" /></mesh>
          
          {brandConfig.grilleStyle === 'sprinter' && (
            <>
              <mesh position={[0.018, 0.06, 0]}><boxGeometry args={[0.01, 0.02, brandConfig.noseWidth * 0.76]} /><meshStandardMaterial color="#cbd5e1" metalness={0.9} /></mesh>
              <mesh position={[0.018, -0.06, 0]}><boxGeometry args={[0.01, 0.02, brandConfig.noseWidth * 0.76]} /><meshStandardMaterial color="#cbd5e1" metalness={0.9} /></mesh>
              <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.055, 0.055, 0.01, 16]} /><meshStandardMaterial color="#cbd5e1" metalness={0.9} /></mesh>
            </>
          )}

          {brandConfig.grilleStyle === 'transit' && (
            <>
              <mesh position={[0.015, 0, 0]}><boxGeometry args={[0.01, 0.22, brandConfig.noseWidth * 0.74]} /><meshStandardMaterial color="#1e293b" wireframe /></mesh>
              <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.01, 16]} /><meshStandardMaterial color="#1e3a8a" /></mesh>
            </>
          )}

          {brandConfig.grilleStyle === 'ducato' && (
            <>
              <mesh position={[0.015, 0.02, 0]}><boxGeometry args={[0.01, 0.05, brandConfig.noseWidth * 0.76]} /><meshStandardMaterial color="#1e293b" /></mesh>
              <mesh position={[0.02, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.01, 16]} /><meshStandardMaterial color="#991b1b" /></mesh>
            </>
          )}

          {brandConfig.grilleStyle === 'crafter' && (
            <>
              <mesh position={[0.015, 0.04, 0]}><boxGeometry args={[0.01, 0.015, brandConfig.noseWidth * 0.78]} /><meshStandardMaterial color="#e2e8f0" metalness={0.9} /></mesh>
              <mesh position={[0.015, -0.04, 0]}><boxGeometry args={[0.01, 0.015, brandConfig.noseWidth * 0.78]} /><meshStandardMaterial color="#e2e8f0" metalness={0.9} /></mesh>
            </>
          )}

          {/* Emissive Premium Headlights */}
          <mesh position={[-0.01, 0.06, brandConfig.noseWidth * 0.42]} castShadow>
            <boxGeometry args={[0.04, 0.08, 0.12]} />
            <meshStandardMaterial color="#ffffff" emissive="#fffee8" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[-0.01, 0.06, -brandConfig.noseWidth * 0.42]} castShadow>
            <boxGeometry args={[0.04, 0.08, 0.12]} />
            <meshStandardMaterial color="#ffffff" emissive="#fffee8" emissiveIntensity={1.2} />
          </mesh>
        </group>
      </group>

      {/* =========================================================
          3. CARGO SHELL CUTAWAY (Left Wall + Back Doors + Roof SOLID; Right Wall OPEN)
          ========================================================= */}
      <group position={[cabinStartX / 2 - cabLength / 4, h / 2 + 0.15, 0]}>
        {/* A. SOLID LEFT SIDE WALL (Far Wall, Z < 0) */}
        <mesh position={[0, 0, -w / 2]} castShadow receiveShadow>
          <boxGeometry args={[cargoLength + 0.1, h - 0.2, 0.05]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Inlaid Left campervan windows cutouts */}
        <mesh position={[0.3, 0.35, -w / 2 - 0.01]} castShadow>
          <boxGeometry args={[1.2, 0.4, 0.02]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.95} roughness={0.02} metalness={0.95} />
        </mesh>

        {/* B. SOLID REAR PANEL & OPENING DOORS (Rear, X < 0) */}
        <group position={[-(cargoLength / 2), 0, 0]}>
          {/* Back Door Panel Frame */}
          <mesh position={[-0.02, 0, 0]} castShadow>
            <boxGeometry args={[0.04, h - 0.2, w]} />
            <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.2} metalness={0.7} />
          </mesh>
          
          {/* Back Door Glass Windows */}
          <mesh position={[-0.045, 0.38, w * 0.22]} castShadow><boxGeometry args={[0.01, 0.35, w * 0.32]} /><meshStandardMaterial color="#0f172a" transparent opacity={0.9} /></mesh>
          <mesh position={[-0.045, 0.38, -w * 0.22]} castShadow><boxGeometry args={[0.01, 0.35, w * 0.32]} /><meshStandardMaterial color="#0f172a" transparent opacity={0.9} /></mesh>

          {/* Emissive Taillights */}
          <mesh position={[-0.045, -0.3, w * 0.4]} castShadow><boxGeometry args={[0.01, 0.28, 0.06]} /><meshStandardMaterial color="#ff0000" emissive="#bb0000" emissiveIntensity={0.8} /></mesh>
          <mesh position={[-0.045, -0.3, -w * 0.4]} castShadow><boxGeometry args={[0.01, 0.28, 0.06]} /><meshStandardMaterial color="#ff0000" emissive="#bb0000" emissiveIntensity={0.8} /></mesh>
        </group>

        {/* C. SOLID HIGH ROOF (Top, Y > 0) */}
        <mesh position={[0, (h - 0.25) / 2, 0]} castShadow>
          <boxGeometry args={[cargoLength + 0.1, 0.05, w]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Premium Roof Accessories - Solar Mounting Rails & Fan Dome */}
        <mesh position={[0, (h - 0.2) / 2 + 0.05, w / 2 - 0.08]} castShadow><boxGeometry args={[cargoLength - 0.4, 0.03, 0.02]} /><meshStandardMaterial color="#334155" metalness={0.9} /></mesh>
        <mesh position={[0, (h - 0.2) / 2 + 0.05, -w / 2 + 0.08]} castShadow><boxGeometry args={[cargoLength - 0.4, 0.03, 0.02]} /><meshStandardMaterial color="#334155" metalness={0.9} /></mesh>

        {/* Realistic Offgrid Solar Panels on Roof */}
        <group position={[0.2, (h - 0.2) / 2 + 0.07, 0]}>
          <mesh castShadow><boxGeometry args={[1.5, 0.02, w * 0.72]} /><meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} /></mesh>
          {/* Blue solar grid texture lines */}
          <mesh position={[0, 0.012, 0]}><boxGeometry args={[1.48, 0.005, w * 0.7]} /><meshStandardMaterial color="#1e3a8a" wireframe /></mesh>
        </group>

        {/* D. PREMIUM SLIDING DOOR (Fully Slid Open, Exposing Interior layout) */}
        {/* Slid back panel sitting just outside the rear right wall section */}
        <mesh position={[-cargoLength / 3, 0, w / 2 + 0.03]} castShadow>
          <boxGeometry args={[1.2, h - 0.25, 0.02]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Sliding Rail track trim */}
        <mesh position={[0, -0.05, w / 2 + 0.015]} castShadow>
          <boxGeometry args={[cargoLength, 0.025, 0.01]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>
      </group>

      {/* =========================================================
          4. DETAILED WHEELBASE TIRES & WHEEL ARCHES
          ========================================================= */}
      <group>
        {/* Front Left Tyre */}
        <group position={[wb / 2, 0.32, w / 2 - 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* Front Right Tyre */}
        <group position={[wb / 2, 0.32, -w / 2 + 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* Rear Left Tyre */}
        <group position={[-wb / 2, 0.32, w / 2 - 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* Rear Right Tyre */}
        <group position={[-wb / 2, 0.32, -w / 2 + 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* Internal Floor Wheel Arches inside the cargo space */}
        <mesh position={[-wb / 2, 0.38, w / 2 - 0.18]} castShadow>
          <boxGeometry args={[0.82, 0.44, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>
        <mesh position={[-wb / 2, 0.38, -w / 2 + 0.18]} castShadow>
          <boxGeometry args={[0.82, 0.44, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>
      </group>

      {/* =========================================================
          5. SOLID CABIN DRIVER / PASSENGER CAPTAIN CHAIRS
          ========================================================= */}
      <group position={[l / 2 - cabLength * 1.15, 0.48, 0]}>
        {/* Solid Driver Chair */}
        <group position={[0, 0.1, w * 0.24]}>
          <mesh castShadow><boxGeometry args={[0.42, 0.12, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
          <mesh position={[-0.18, 0.28, 0]} castShadow><boxGeometry args={[0.08, 0.52, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
        </group>
        {/* Solid Passenger Chair */}
        <group position={[0, 0.1, -w * 0.24]}>
          <mesh castShadow><boxGeometry args={[0.42, 0.12, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
          <mesh position={[-0.18, 0.28, 0]} castShadow><boxGeometry args={[0.08, 0.52, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
        </group>
      </group>
    </group>
  );
}
