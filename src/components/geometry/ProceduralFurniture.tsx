'use client';

import React from 'react';
import * as THREE from 'three';
import { VanComponent, BedMetadata, KitchenMetadata } from '@/types';
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

  // ELECTRICAL
  if (component.category === 'electrical') {
    return (
      <group>
        <mesh position={[0, h/2, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial 
            color={isVictron ? '#0052a2' : '#334155'} 
            roughness={0.2} 
            metalness={0.6} 
          />
        </mesh>
      </group>
    );
  }

  // EXTERIOR
  if (component.category === 'exterior' && isLazer) {
    return (
      <group>
        <mesh position={[0, h/2, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#111827" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, d/2 + 0.005]}>
          <planeGeometry args={[w * 0.95, h * 0.8]} />
          <meshStandardMaterial color="#f8fafc" emissive="#ffffff" emissiveIntensity={0.6} />
        </mesh>
      </group>
    );
  }

  // KITCHEN & FURNITURE (Material-Aware)
  if (component.category === 'kitchen' || component.category === 'storage') {
    return (
      <group>
        <mesh position={[0, h/2, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial 
            color={material?.color || (isSelected ? '#3b82f6' : '#ffffff')} 
            roughness={material?.roughness ?? 0.5} 
            metalness={material?.metalness ?? 0}
          />
        </mesh>
        {component.category === 'kitchen' && (
          <mesh position={[0, h + 0.01, 0]}>
            <boxGeometry args={[w + 0.02, 0.03, d + 0.02]} />
            <meshStandardMaterial color="#1f2937" roughness={0.1} />
          </mesh>
        )}
      </group>
    );
  }

  // DEFAULT
  return (
    <mesh position={[0, h/2, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial 
        color={material?.color || (isSelected ? '#3b82f6' : '#ffffff')} 
        roughness={material?.roughness ?? 0.5}
        metalness={material?.metalness ?? 0}
        transparent={isSelected && !material}
        opacity={isSelected && !material ? 0.8 : 1}
      />
    </mesh>
  );
}
