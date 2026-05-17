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

  // Custom visual definitions for each brand to ensure authentic rendering
  const brandConfig = useMemo(() => {
    switch (vehicle.model) {
      case 'mercedes-sprinter':
        return {
          bodyColor: '#f8fafc', // Premium Polar White
          accentColor: '#1e293b', // Slate accents
          noseLength: 1.15,
          noseHeight: 0.95,
          noseWidth: w * 0.92,
          windshieldAngle: 0.58,
          grilleStyle: 'sprinter',
          roofCurve: 0.1,
          hasHighRoof: true,
          windowLayout: 'sprinter'
        };
      case 'ford-transit':
        return {
          bodyColor: '#cbd5e1', // Ingot Silver
          accentColor: '#0f172a', // Obsidian accents
          noseLength: 1.0,
          noseHeight: 1.0,
          noseWidth: w * 0.94,
          windshieldAngle: 0.65, // Steeper
          grilleStyle: 'transit',
          roofCurve: 0.12,
          hasHighRoof: true,
          windowLayout: 'transit'
        };
      case 'fiat-ducato':
        return {
          bodyColor: '#ffffff', // Solid Italian White
          accentColor: '#334155',
          noseLength: 0.78, // Iconic ultra-short nose
          noseHeight: 1.02,
          noseWidth: w * 0.95,
          windshieldAngle: 0.72, // Almost vertical
          grilleStyle: 'ducato',
          roofCurve: 0.05,
          hasHighRoof: false,
          windowLayout: 'ducato'
        };
      case 'vw-crafter':
        return {
          bodyColor: '#94a3b8', // Indium Grey Metallic
          accentColor: '#1e293b',
          noseLength: 1.1,
          noseHeight: 0.98,
          noseWidth: w * 0.93,
          windshieldAngle: 0.6,
          grilleStyle: 'crafter',
          roofCurve: 0.08,
          hasHighRoof: true,
          windowLayout: 'crafter'
        };
      case 'renault-master':
        return {
          bodyColor: '#f1f5f9', // Slate White
          accentColor: '#0f172a',
          noseLength: 1.05,
          noseHeight: 1.03,
          noseWidth: w * 0.92,
          windshieldAngle: 0.62,
          grilleStyle: 'master',
          roofCurve: 0.14,
          hasHighRoof: true,
          windowLayout: 'master'
        };
      default:
        return {
          bodyColor: '#ffffff',
          accentColor: '#1f2937',
          noseLength: 1.0,
          noseHeight: 0.98,
          noseWidth: w * 0.93,
          windshieldAngle: 0.62,
          grilleStyle: 'generic',
          roofCurve: 0.1,
          hasHighRoof: true,
          windowLayout: 'generic'
        };
    }
  }, [vehicle.model, w]);

  // Derived dimensions
  const cargoLength = l - brandConfig.noseLength;
  const cargoHeight = h - 0.25; // Adjusted floor level
  const cargoWidth = w;

  return (
    <group position={[0, 0, 0]}>
      {/* =========================================================
          1. CHASSIS AND UNDERBODY (Dark structure, exhaust, base)
          ========================================================= */}
      <mesh position={[-(brandConfig.noseLength / 2), 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[l - 0.2, 0.12, w - 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.5} />
      </mesh>

      {/* Rear Bumper & step */}
      <mesh position={[-l / 2 - 0.03, 0.22, 0]} castShadow>
        <boxGeometry args={[0.08, 0.15, w - 0.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Front Bumper & Apron (Brand Specific Position) */}
      <mesh position={[l / 2 - 0.05, 0.22, 0]} castShadow>
        <boxGeometry args={[0.15, 0.22, brandConfig.noseWidth + 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* =========================================================
          2. CARGO / LIVING AREA (Translucent Glassmorphism Outer Shell)
          ========================================================= */}
      <group position={[-(brandConfig.noseLength / 2), cargoHeight / 2 + 0.26, 0]}>
        {/* Main Cargo Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[cargoLength, cargoHeight, cargoWidth]} />
          <meshStandardMaterial 
            color={brandConfig.bodyColor} 
            transparent 
            opacity={0.16} 
            roughness={0.1} 
            metalness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Roof Panel (Glossy & Solid to anchor the structure) */}
        <mesh position={[0, cargoHeight / 2 + 0.01, 0]} castShadow>
          <boxGeometry args={[cargoLength + 0.02, 0.04, cargoWidth + 0.02]} />
          <meshStandardMaterial color={brandConfig.bodyColor} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Roof Rails for Premium Camper Look */}
        <mesh position={[0, cargoHeight / 2 + 0.08, cargoWidth / 2 - 0.05]} castShadow>
          <boxGeometry args={[cargoLength - 0.4, 0.04, 0.02]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, cargoHeight / 2 + 0.08, -cargoWidth / 2 + 0.05]} castShadow>
          <boxGeometry args={[cargoLength - 0.4, 0.04, 0.02]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* =========================================================
          3. FRONT CAB / NOSE (Highly Brand-Specific Curves)
          ========================================================= */}
      <group position={[l / 2 - brandConfig.noseLength / 2, brandConfig.noseHeight / 2 + 0.24, 0]}>
        {/* Lower Hood Assembly */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[brandConfig.noseLength, brandConfig.noseHeight, brandConfig.noseWidth]} />
          <meshStandardMaterial 
            color={brandConfig.bodyColor} 
            transparent 
            opacity={0.18} 
            roughness={0.15} 
            metalness={0.8}
          />
        </mesh>

        {/* Upper Windshield Transition (Slanted glass) */}
        <mesh 
          position={[-brandConfig.noseLength * 0.2, brandConfig.noseHeight * 0.72, 0]} 
          rotation={[0, 0, -brandConfig.windshieldAngle]} 
          castShadow
        >
          <boxGeometry args={[0.02, h * 0.52, brandConfig.noseWidth * 0.94]} />
          <meshStandardMaterial color="#0b1329" transparent opacity={0.85} roughness={0.05} metalness={0.95} />
        </mesh>

        {/* Brand Specific Front Grille & Headlight Facia */}
        <group position={[brandConfig.noseLength / 2 + 0.01, -0.05, 0]}>
          {/* Obsidian Grille Backdrop */}
          <mesh castShadow>
            <boxGeometry args={[0.04, 0.38, brandConfig.noseWidth * 0.82]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Mercedes Sprinter Signature Grille */}
          {brandConfig.grilleStyle === 'sprinter' && (
            <>
              {/* Twin Chrome Slats */}
              <mesh position={[0.025, 0.08, 0]}>
                <boxGeometry args={[0.01, 0.025, brandConfig.noseWidth * 0.78]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.05} />
              </mesh>
              <mesh position={[0.025, -0.08, 0]}>
                <boxGeometry args={[0.01, 0.025, brandConfig.noseWidth * 0.78]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.05} />
              </mesh>
              {/* Mercedes Emblem Ring */}
              <mesh position={[0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.065, 0.065, 0.01, 24]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.05} />
              </mesh>
            </>
          )}

          {/* Ford Transit Signature Grille */}
          {brandConfig.grilleStyle === 'transit' && (
            <>
              {/* Heavy Hexagonal Mesh Style */}
              <mesh position={[0.02, 0, 0]}>
                <boxGeometry args={[0.01, 0.28, brandConfig.noseWidth * 0.78]} />
                <meshStandardMaterial color="#1e293b" wireframe roughness={0.7} />
              </mesh>
              {/* Ford Oval */}
              <mesh position={[0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.035, 0.035, 0.012, 16]} />
                <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} />
              </mesh>
            </>
          )}

          {/* Fiat Ducato Signature Grille */}
          {brandConfig.grilleStyle === 'ducato' && (
            <>
              {/* Wide single bar */}
              <mesh position={[0.02, 0.02, 0]}>
                <boxGeometry args={[0.01, 0.06, brandConfig.noseWidth * 0.8]} />
                <meshStandardMaterial color="#334155" roughness={0.9} />
              </mesh>
              {/* Crimson Fiat Roundel */}
              <mesh position={[0.025, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.045, 0.045, 0.01, 16]} />
                <meshStandardMaterial color="#991b1b" metalness={0.8} roughness={0.2} />
              </mesh>
            </>
          )}

          {/* VW Crafter Signature Grille */}
          {brandConfig.grilleStyle === 'crafter' && (
            <>
              {/* Wide parallel horizontal slats */}
              <mesh position={[0.02, 0.06, 0]}>
                <boxGeometry args={[0.01, 0.02, brandConfig.noseWidth * 0.8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
              </mesh>
              <mesh position={[0.02, -0.06, 0]}>
                <boxGeometry args={[0.01, 0.02, brandConfig.noseWidth * 0.8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
              </mesh>
            </>
          )}

          {/* Renault Master Signature Grille */}
          {brandConfig.grilleStyle === 'master' && (
            <>
              {/* Angular logo shroud */}
              <mesh position={[0.02, 0, 0]}>
                <boxGeometry args={[0.015, 0.12, 0.12]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
              </mesh>
            </>
          )}

          {/* Distinct Headlights */}
          <group position={[-0.01, 0.05, 0]}>
            {/* Left Headlamp */}
            <mesh position={[0.02, 0, brandConfig.noseWidth * 0.42]} castShadow>
              <boxGeometry args={[0.04, 0.1, 0.14]} />
              <meshStandardMaterial color="#ffffff" emissive="#fffee4" emissiveIntensity={1.0} roughness={0.1} />
            </mesh>
            {/* Right Headlamp */}
            <mesh position={[0.02, 0, -brandConfig.noseWidth * 0.42]} castShadow>
              <boxGeometry args={[0.04, 0.1, 0.14]} />
              <meshStandardMaterial color="#ffffff" emissive="#fffee4" emissiveIntensity={1.0} roughness={0.1} />
            </mesh>
          </group>
        </group>
      </group>

      {/* =========================================================
          4. CAB WINDOWS & SIDE MIRRORS (High detail trim)
          ========================================================= */}
      <group position={[l / 2 - brandConfig.noseLength * 0.9, brandConfig.noseHeight + 0.1, 0]}>
        {/* Left Side Window */}
        <mesh position={[0, 0, w / 2 - 0.01]} castShadow>
          <boxGeometry args={[0.8, 0.45, 0.01]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.8} roughness={0.1} />
        </mesh>
        {/* Right Side Window */}
        <mesh position={[0, 0, -w / 2 + 0.01]} castShadow>
          <boxGeometry args={[0.8, 0.45, 0.01]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.8} roughness={0.1} />
        </mesh>

        {/* Left Side Mirror */}
        <group position={[0.4, -0.05, w / 2 + 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.04, 0.02, 0.1]} /> {/* Mirror Arm */}
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.05, 0.05]} castShadow>
            <boxGeometry args={[0.1, 0.22, 0.05]} /> {/* Mirror Housing */}
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>

        {/* Right Side Mirror */}
        <group position={[0.4, -0.05, -w / 2 - 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.04, 0.02, 0.1]} /> {/* Mirror Arm */}
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.05, -0.05]} castShadow>
            <boxGeometry args={[0.1, 0.22, 0.05]} /> {/* Mirror Housing */}
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* =========================================================
          5. DETAILED WHEELBASE WHEELS & TIRES
          ========================================================= */}
      <group>
        {/* Front Left Wheel */}
        <group position={[wb / 2, 0.32, w / 2 - 0.04]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.25, 32]} /> {/* Tire */}
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} /> {/* Rim */}
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Front Right Wheel */}
        <group position={[wb / 2, 0.32, -w / 2 + 0.04]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.25, 32]} /> {/* Tire */}
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} /> {/* Rim */}
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rear Left Wheel */}
        <group position={[-wb / 2, 0.32, w / 2 - 0.04]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.25, 32]} /> {/* Tire */}
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} /> {/* Rim */}
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rear Right Wheel */}
        <group position={[-wb / 2, 0.32, -w / 2 + 0.04]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.25, 32]} /> {/* Tire */}
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} /> {/* Rim */}
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* =========================================================
          6. INTERNAL CABIN SEATING (Highly premium interior touch)
          ========================================================= */}
      <group position={[l / 2 - brandConfig.noseLength * 1.3, 0.45, 0]}>
        {/* Driver Seat */}
        <group position={[0, 0.1, w * 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.1, 0.42]} /> {/* Cushion */}
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[-0.18, 0.3, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.42]} /> {/* Backrest */}
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </group>

        {/* Passenger Seat */}
        <group position={[0, 0.1, -w * 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.1, 0.42]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[-0.18, 0.3, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.42]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
