'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { VanComponent } from '@/types';
import { getMaterialById } from '@/registry/MaterialRegistry';

interface ProceduralFurnitureProps {
  component: VanComponent;
  isSelected: boolean;
}

export default function ProceduralFurniture({ component, isSelected }: ProceduralFurnitureProps) {
  const { width, height, depth } = component.dimensions;
  const w = width / 1000;
  const h = height / 1000;
  const d = depth / 1000;

  const isVictron = component.manufacturer === 'Victron Energy';
  const isLazer = component.manufacturer === 'Lazer Lamps';
  const isDometic = component.manufacturer === 'Dometic';
  const material = component.materialId ? getMaterialById(component.materialId) : null;

  // Custom selection aura ring helper
  const SelectionIndicator = useMemo(() => {
    if (!isSelected) return null;
    return (
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w + 0.03, h + 0.03, d + 0.03]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.65} />
      </mesh>
    );
  }, [isSelected, w, h, d]);

  // =========================================================
  // A. POWER & ELECTRICAL SYSTEMS (High-End Technical Detailing)
  // =========================================================
  if (component.category === 'electrical') {
    return (
      <group>
        {SelectionIndicator}
        
        {/* Main Victron Inverter Charger / Smart Hub Chassis */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w - 0.02, h, d - 0.02]} />
          <meshStandardMaterial 
            color={isVictron ? '#0251a2' : '#334155'} 
            roughness={0.25} 
            metalness={0.8} 
          />
        </mesh>

        {/* Slanted Lower Shroud detailing */}
        <mesh position={[0, h * 0.15, d / 2 - 0.005]} castShadow>
          <boxGeometry args={[w - 0.04, h * 0.2, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Colored Emissive Terminal Lights (Victron charging indicators) */}
        <mesh position={[w * 0.25, h * 0.8, d / 2]} castShadow>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[w * 0.1, h * 0.8, d / 2]} castShadow>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.8} />
        </mesh>

        {/* Heavy Duty Battery Cables (Technical Realism) */}
        <mesh position={[-w * 0.2, h * 0.1, d / 2 + 0.015]} rotation={[0, 0, Math.PI / 12]}>
          <cylinderGeometry args={[0.008, 0.008, 0.12]} />
          <meshStandardMaterial color="#ef4444" roughness={0.6} /> {/* Positive red */}
        </mesh>
        <mesh position={[-w * 0.28, h * 0.1, d / 2 + 0.015]} rotation={[0, 0, -Math.PI / 12]}>
          <cylinderGeometry args={[0.008, 0.008, 0.12]} />
          <meshStandardMaterial color="#090d16" roughness={0.6} /> {/* Negative black */}
        </mesh>
      </group>
    );
  }

  // =========================================================
  // B. CAMPER MATTRESSES & SOFAS (Soft Upholstery Detailing)
  // =========================================================
  if (component.category === 'bed' || component.type?.toLowerCase().includes('bed') || component.type?.toLowerCase().includes('sofa')) {
    const isSofa = component.type?.toLowerCase().includes('sofa');
    
    return (
      <group>
        {SelectionIndicator}

        {/* 1. Structural Birch Plywood Bed Frame Base */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, 0.16, d]} />
          <meshStandardMaterial color="#e5dcd0" roughness={0.8} metalness={0.1} /> {/* Plywood finish */}
        </mesh>
        {/* Recessed black plinth line below frame base */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[w - 0.04, 0.04, d - 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {/* 2. Soft Cushioned Mattress / Upholstery Slab */}
        <group position={[0, 0.21, 0]}>
          {/* Main Mattress mesh */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w - 0.02, 0.14, d - 0.02]} />
            <meshStandardMaterial 
              color={material?.color || '#cbd5e1'} 
              roughness={material?.roughness ?? 0.95} 
              metalness={0} 
            />
          </mesh>
          {/* Bevelled Outer border seams (to break the hard box edges) */}
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[w - 0.01, 0.02, d - 0.01]} />
            <meshStandardMaterial color={material?.color || '#cbd5e1'} roughness={1.0} />
          </mesh>
        </group>

        {/* 3. Fluffy Cozy Pillows (Camper Cozy architectural realism) */}
        {!isSofa && (
          <group position={[w / 2 - 0.25, 0.32, 0]}>
            {/* Left pillow */}
            <mesh position={[0, 0, d * 0.22]} rotation={[0.1, 0, -0.15]} castShadow>
              <boxGeometry args={[0.3, 0.06, 0.4]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.98} />
            </mesh>
            {/* Right pillow */}
            <mesh position={[0, 0, -d * 0.22]} rotation={[-0.1, 0, -0.15]} castShadow>
              <boxGeometry args={[0.3, 0.06, 0.4]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.98} />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  // =========================================================
  // C. PREMIUM KITCHEN CONFIGURATOR (Worktops, Shadow Gaps, Sink & Faucet)
  // =========================================================
  if (component.category === 'kitchen') {
    return (
      <group>
        {SelectionIndicator}

        {/* 1. Recessed Matte Black Kickboard Plinth */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[w - 0.06, 0.08, d - 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.95} />
        </mesh>

        {/* 2. Main Cabinet Carcass & Split Doors (With 0.005m shadow gaps) */}
        <group position={[0, h / 2 + 0.03, 0]}>
          {/* Inner carcass backing */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w - 0.02, h - 0.12, d - 0.02]} />
            <meshStandardMaterial 
              color={material?.color || '#ffffff'} 
              roughness={material?.roughness ?? 0.6}
              metalness={material?.metalness ?? 0}
            />
          </mesh>

          {/* Left Cabinet Door */}
          <mesh position={[-w * 0.23, 0, d / 2 - 0.005]} castShadow>
            <boxGeometry args={[w * 0.45, h - 0.15, 0.015]} />
            <meshStandardMaterial 
              color={material?.color || '#ffffff'} 
              roughness={material?.roughness ?? 0.6}
            />
          </mesh>

          {/* Right Cabinet Door */}
          <mesh position={[w * 0.23, 0, d / 2 - 0.005]} castShadow>
            <boxGeometry args={[w * 0.45, h - 0.15, 0.015]} />
            <meshStandardMaterial 
              color={material?.color || '#ffffff'} 
              roughness={material?.roughness ?? 0.6}
            />
          </mesh>

          {/* Brushed Stainless Silver Handles */}
          <mesh position={[-w * 0.06, 0.12, d / 2 + 0.008]}>
            <cylinderGeometry args={[0.006, 0.006, 0.14]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh position={[w * 0.06, 0.12, d / 2 + 0.008]}>
            <cylinderGeometry args={[0.006, 0.006, 0.14]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* 3. Premium Solid Overhanging Wood Worktop */}
        <group position={[0, h + 0.02, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w + 0.03, 0.04, d + 0.03]} />
            <meshStandardMaterial color="#582f0e" roughness={0.35} metalness={0.1} /> {/* Rich Dark Walnut */}
          </mesh>

          {/* 4. Integrated Camper Sink Basin */}
          <group position={[w * 0.15, 0.025, 0]}>
            {/* Stainless Steel Basin rim */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <ringGeometry args={[w * 0.12, w * 0.14, 32]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Black luxury goose-neck designer faucet */}
            <group position={[0, 0.01, -d * 0.22]}>
              {/* Vertical post */}
              <mesh position={[0, 0.12, 0]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.24]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
              {/* Goose neck curve */}
              <mesh position={[w * 0.04, 0.24, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.08]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    );
  }

  // =========================================================
  // D. MODULAR STORAGE AND LOCKERS (Cabinet door trims & split line grids)
  // =========================================================
  if (component.category === 'storage') {
    return (
      <group>
        {SelectionIndicator}

        {/* Dark Recessed base plinth to anchor visually */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[w - 0.04, 0.06, d - 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {/* Cabinet Main Carcass */}
        <mesh position={[0, h / 2 + 0.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h - 0.06, d]} />
          <meshStandardMaterial 
            color={material?.color || '#ffffff'} 
            roughness={material?.roughness ?? 0.6}
            metalness={material?.metalness ?? 0}
          />
        </mesh>

        {/* Detailed Front Cabinet Split Lines (Shadow Line detailing) */}
        <group position={[0, h / 2 + 0.03, d / 2 + 0.002]}>
          {/* Vertical Split Line */}
          <mesh>
            <boxGeometry args={[0.006, h - 0.1, 0.002]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.65} />
          </mesh>
          {/* Horizontal Split Line */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[w - 0.04, 0.006, 0.002]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.65} />
          </mesh>
        </group>
      </group>
    );
  }

  // =========================================================
  // E. DEFAULT / UNCLASSIFIED COMPONENTS (Clean bevelled panels)
  // =========================================================
  return (
    <group>
      {SelectionIndicator}

      {/* Main Base mesh */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial 
          color={material?.color || '#ffffff'} 
          roughness={material?.roughness ?? 0.5}
          metalness={material?.metalness ?? 0}
        />
      </mesh>
      
      {/* Outer panel outline shadow trims for architectural realism */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w + 0.002, h + 0.002, d + 0.002]} />
        <meshBasicMaterial color="#cbd5e1" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
