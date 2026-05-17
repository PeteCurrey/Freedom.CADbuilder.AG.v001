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

  // Exact styling parameters to replicate modern campervans (Sprinter, Transit, Ducato)
  const brandConfig = useMemo(() => {
    switch (vehicle.model) {
      case 'mercedes-sprinter':
        return {
          bodyColor: '#f8fafc', // Polar White car paint
          accentColor: '#1e293b',
          noseLength: 1.1,
          hoodHeight: 0.95,
          windshieldAngle: 0.52, // Aerodynamic slope
          grilleRows: 3,
          badgeColor: '#cbd5e1',
          hasNoseCurve: true
        };
      case 'ford-transit':
        return {
          bodyColor: '#e2e8f0', // Frozen Silver
          accentColor: '#0f172a',
          noseLength: 1.0,
          hoodHeight: 1.02,
          windshieldAngle: 0.6,
          grilleRows: 4,
          badgeColor: '#1e3b8b',
          hasNoseCurve: false
        };
      case 'fiat-ducato':
        return {
          bodyColor: '#ffffff', // Italian White
          accentColor: '#334155',
          noseLength: 0.8, // Ultra-short front profile
          hoodHeight: 1.05,
          windshieldAngle: 0.68, // Upright windshield
          grilleRows: 2,
          badgeColor: '#991b1b',
          hasNoseCurve: false
        };
      case 'vw-crafter':
        return {
          bodyColor: '#cbd5e1', // Reflex Silver
          accentColor: '#1e293b',
          noseLength: 1.08,
          hoodHeight: 0.98,
          windshieldAngle: 0.55,
          grilleRows: 3,
          badgeColor: '#e2e8f0',
          hasNoseCurve: true
        };
      case 'renault-master':
        return {
          bodyColor: '#f1f5f9',
          accentColor: '#0f172a',
          noseLength: 1.05,
          hoodHeight: 1.0,
          windshieldAngle: 0.58,
          grilleRows: 3,
          badgeColor: '#d97706',
          hasNoseCurve: false
        };
      default:
        return {
          bodyColor: '#ffffff',
          accentColor: '#1f2937',
          noseLength: 1.0,
          hoodHeight: 0.98,
          windshieldAngle: 0.58,
          grilleRows: 3,
          badgeColor: '#cbd5e1',
          hasNoseCurve: false
        };
    }
  }, [vehicle.model]);

  // Calculations for continuous aerodynamic body alignment
  const cabLength = brandConfig.noseLength + 0.45; // Front hood + cabin area
  const cargoLength = l - cabLength;
  const cabinStartX = l / 2 - cabLength;

  return (
    <group>
      {/* =========================================================
          1. HEAVY CHASSIS AND RUNNING GEAR (Black trim & bumpers)
          ========================================================= */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[l + 0.1, 0.16, w]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} metalness={0.4} />
      </mesh>

      {/* Solid Front Lower Bumper & Intake Apron */}
      <mesh position={[l / 2 - 0.05, 0.16, 0]} castShadow>
        <boxGeometry args={[0.15, 0.22, w - 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Solid Rear Double-Step Bumper */}
      <mesh position={[-l / 2 - 0.04, 0.18, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, w - 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Birch Plywood Floor (Camper Build Base) */}
      <mesh position={[cabinStartX / 2 - cabLength / 4, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[cargoLength + 0.5, w - 0.04]} />
        <meshStandardMaterial color="#dcd3c2" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* =========================================================
          2. CONTINUOUS SOLID WHITE CUTAWAY BODY (Far Left Wall, Z < 0)
          ========================================================= */}
      <group>
        {/* Continuous Solid Left Side Wall spanning the full van length */}
        <mesh position={[-0.2, h / 2 + 0.1, -w / 2]} castShadow receiveShadow>
          <boxGeometry args={[l - 0.3, h - 0.2, 0.06]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>

        {/* Detailed Left Sliding Windows (recessed into the solid wall) */}
        <group position={[-0.2, h / 2 + 0.1, -w / 2 - 0.035]}>
          {/* Main Cabin window */}
          <mesh position={[l * 0.15, 0.25, 0]} castShadow>
            <boxGeometry args={[1.2, 0.42, 0.01]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.9} roughness={0.05} />
          </mesh>
          {/* Rear cargo side window */}
          <mesh position={[-l * 0.2, 0.25, 0]} castShadow>
            <boxGeometry args={[1.1, 0.42, 0.01]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.9} roughness={0.05} />
          </mesh>
        </group>
      </group>

      {/* =========================================================
          3. FULLY DETAILED AERODYNAMIC CABIN (Front Nose, Hood, Windshield)
          ========================================================= */}
      <group position={[l / 2 - cabLength / 2, 0.58, 0]}>
        {/* A. Solid Front Cab Nose */}
        <mesh position={[cabLength / 2 - brandConfig.noseLength / 2, -0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[brandConfig.noseLength, brandConfig.hoodHeight - 0.45, w - 0.06]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>

        {/* B. Sloping Aerodynamic Windshield (Perfect transition to main cargo roof height) */}
        <group position={[cabLength / 4 - 0.1, 0.35, 0]} rotation={[0, 0, -brandConfig.windshieldAngle]}>
          {/* Main Glass Sheet */}
          <mesh castShadow>
            <boxGeometry args={[0.02, 0.8, w - 0.08]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.88} roughness={0.02} metalness={0.95} />
          </mesh>
          {/* Sleek Windshield Frame */}
          <mesh position={[-0.01, 0, 0]}>
            <boxGeometry args={[0.04, 0.82, w - 0.04]} />
            <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
          </mesh>
        </group>

        {/* C. Solid Cabin Front Roof & A-Pillars */}
        <mesh position={[-cabLength / 4, 0.65, 0]} castShadow>
          <boxGeometry args={[cabLength / 2, 0.22, w]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>

        {/* D. Signature Grilles & Headlight Facia */}
        <group position={[cabLength / 2 + 0.01 - brandConfig.noseLength / 2, -0.22, 0]}>
          {/* Dark Grille Shroud */}
          <mesh castShadow>
            <boxGeometry args={[0.03, 0.28, w * 0.78]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Mercedes Sprinter Slats and Star Emblem */}
          {brandConfig.grilleRows === 3 && (
            <>
              <mesh position={[0.018, 0.06, 0]}><boxGeometry args={[0.01, 0.02, w * 0.74]} /><meshStandardMaterial color="#cbd5e1" metalness={0.9} /></mesh>
              <mesh position={[0.018, -0.06, 0]}><boxGeometry args={[0.01, 0.02, w * 0.74]} /><meshStandardMaterial color="#cbd5e1" metalness={0.9} /></mesh>
              <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.055, 0.055, 0.01, 16]} /><meshStandardMaterial color="#cbd5e1" metalness={0.9} /></mesh>
            </>
          )}

          {/* Ford Transit Slat and Oval */}
          {brandConfig.grilleRows === 4 && (
            <>
              <mesh position={[0.015, 0, 0]}><boxGeometry args={[0.01, 0.22, w * 0.72]} /><meshStandardMaterial color="#1e293b" wireframe /></mesh>
              <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.01, 16]} /><meshStandardMaterial color="#1e3a8a" /></mesh>
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

        {/* E. Sleek Wing Mirrors */}
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
          4. TRANSLUCENT CARGO AREA SHELL (Solid High Roof + Back Doors)
          ========================================================= */}
      <group position={[cabinStartX / 2 - cabLength / 4, h / 2 + 0.15, 0]}>
        {/* Solid Roof Plate spanning from rear to windshield edge */}
        <mesh position={[0, (h - 0.25) / 2, 0]} castShadow>
          <boxGeometry args={[cargoLength + 0.5, 0.05, w]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>

        {/* Off-Grid Solar Panels mounted on Roof */}
        <group position={[0.2, (h - 0.2) / 2 + 0.07, 0]}>
          <mesh castShadow><boxGeometry args={[1.6, 0.02, w * 0.74]} /><meshStandardMaterial color="#020617" roughness={0.15} metalness={0.9} /></mesh>
          <mesh position={[0, 0.012, 0]}><boxGeometry args={[1.58, 0.005, w * 0.72]} /><meshStandardMaterial color="#1e3a8a" wireframe /></mesh>
        </group>

        {/* Solid Rear Double Doors Panel */}
        <group position={[-(cargoLength / 2) - 0.22, 0, 0]}>
          {/* Double Door Frame */}
          <mesh position={[-0.02, 0, 0]} castShadow>
            <boxGeometry args={[0.04, h - 0.2, w]} />
            <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
          </mesh>
          {/* Rear Windows */}
          <mesh position={[-0.045, 0.38, w * 0.22]} castShadow><boxGeometry args={[0.01, 0.35, w * 0.3]} /><meshStandardMaterial color="#0f172a" transparent opacity={0.9} /></mesh>
          <mesh position={[-0.045, 0.38, -w * 0.22]} castShadow><boxGeometry args={[0.01, 0.35, w * 0.3]} /><meshStandardMaterial color="#0f172a" transparent opacity={0.9} /></mesh>
          {/* Rear Brake lights */}
          <mesh position={[-0.045, -0.3, w * 0.4]} castShadow><boxGeometry args={[0.01, 0.28, 0.06]} /><meshStandardMaterial color="#ff0000" emissive="#bb0000" emissiveIntensity={0.8} /></mesh>
          <mesh position={[-0.045, -0.3, -w * 0.4]} castShadow><boxGeometry args={[0.01, 0.28, 0.06]} /><meshStandardMaterial color="#ff0000" emissive="#bb0000" emissiveIntensity={0.8} /></mesh>
        </group>

        {/* Premium Sliding Side Door (Sitting slid open, flush against the outside rear wall) */}
        <mesh position={[-cargoLength / 3, -0.05, w / 2 + 0.03]} castShadow>
          <boxGeometry args={[1.25, h - 0.25, 0.02]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.18} metalness={0.7} />
        </mesh>
        {/* Slide Rail track trim */}
        <mesh position={[0, -0.08, w / 2 + 0.015]} castShadow>
          <boxGeometry args={[cargoLength + 0.2, 0.025, 0.01]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>
      </group>

      {/* =========================================================
          5. WHEELS & TIRES SYSTEM (Exactly positioned to wheelbase)
          ========================================================= */}
      <group>
        {/* Front Left Wheel */}
        <group position={[wb / 2, 0.32, w / 2 - 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Front Right Wheel */}
        <group position={[wb / 2, 0.32, -w / 2 + 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rear Left Wheel */}
        <group position={[-wb / 2, 0.32, w / 2 - 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rear Right Wheel */}
        <group position={[-wb / 2, 0.32, -w / 2 + 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Floor Wheel Arches inside the cargo space */}
        <mesh position={[-wb / 2, 0.38, w / 2 - 0.18]} castShadow>
          <boxGeometry args={[0.82, 0.34, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>
        <mesh position={[-wb / 2, 0.38, -w / 2 + 0.18]} castShadow>
          <boxGeometry args={[0.82, 0.34, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>
      </group>

      {/* =========================================================
          6. SOLID CABIN SEATING & STEERING HUB (CAMPER COCKPIT)
          ========================================================= */}
      <group position={[l / 2 - cabLength * 0.9, 0.48, 0]}>
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

        {/* Dashboard Console Hub */}
        <mesh position={[0.3, 0.2, 0]} castShadow>
          <boxGeometry args={[0.2, 0.3, w - 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Steering Wheel */}
        <mesh position={[0.22, 0.35, w * 0.24]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <torusGeometry args={[0.15, 0.02, 8, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
