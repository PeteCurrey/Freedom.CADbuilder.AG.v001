'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

  // 1. Dynamic photorealistic transparent texture loading with seamless fallback
  const [vanTexture, setVanTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let imgPath = '';
    
    if (vehicle.model === 'mercedes-sprinter') {
      imgPath = '/images/mercedes-sprinter.png';
    } else if (vehicle.model === 'ford-transit') {
      imgPath = '/images/ford-transit.png';
    } else if (vehicle.model === 'fiat-ducato') {
      imgPath = '/images/fiat-ducato.png';
    }

    if (imgPath) {
      loader.load(
        imgPath,
        (loadedTexture) => {
          loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          setVanTexture(loadedTexture);
        },
        undefined,
        () => {
          // If the photorealistic image is missing, fail silently and fall back to clean premium glassmorphism meshes
          setVanTexture(null);
        }
      );
    } else {
      setVanTexture(null);
    }
  }, [vehicle.model]);

  // Brand-specific color profiles (for fallback meshes & cabin accents)
  const brandConfig = useMemo(() => {
    switch (vehicle.model) {
      case 'mercedes-sprinter':
        return {
          bodyColor: '#f8fafc',
          noseLength: 1.15,
          hoodHeight: 0.95,
          windshieldAngle: 0.52,
          grilleStyle: 'sprinter'
        };
      case 'ford-transit':
        return {
          bodyColor: '#cbd5e1',
          noseLength: 1.0,
          hoodHeight: 1.02,
          windshieldAngle: 0.6,
          grilleStyle: 'transit'
        };
      case 'fiat-ducato':
        return {
          bodyColor: '#ffffff',
          noseLength: 0.8,
          hoodHeight: 1.05,
          windshieldAngle: 0.68,
          grilleStyle: 'ducato'
        };
      default:
        return {
          bodyColor: '#ffffff',
          noseLength: 1.0,
          hoodHeight: 0.98,
          windshieldAngle: 0.58,
          grilleStyle: 'generic'
        };
    }
  }, [vehicle.model]);

  const cabLength = brandConfig.noseLength + 0.45;
  const cargoLength = l - cabLength;
  const cabinStartX = l / 2 - cabLength;
  const spokesArray = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <group>
      {/* =========================================================
          1. CHASSIS SYSTEM (Heavy metal structural base)
          ========================================================= */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[l + 0.1, 0.16, w]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0.5} />
      </mesh>

      {/* Birch Plywood Floor base */}
      <mesh position={[cabinStartX / 2 - cabLength / 4, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[cargoLength + 0.5, w - 0.04]} />
        <meshStandardMaterial color="#e5dcd0" roughness={0.55} metalness={0.1} />
      </mesh>

      {/* =========================================================
          2. THE TRANSLUCENT VAN SKIN (HIGH-FIDELITY PHOTOGRAPHIC TEXTURE OVERLAYS)
          ========================================================= */}
      {vanTexture ? (
        <group>
          {/* A. Right Side Translucent Photorealistic Overlay */}
          <mesh position={[0, h / 2 + 0.1, w / 2 + 0.02]} rotation={[0, 0, 0]}>
            <planeGeometry args={[l + 0.6, h + 0.3]} />
            <meshBasicMaterial 
              map={vanTexture} 
              transparent 
              opacity={0.38} // Perfectly balanced to see interior modifications clearly
              side={THREE.DoubleSide} 
              depthWrite={false} // Guarantees interior furniture does not clip
            />
          </mesh>

          {/* B. Left Side Translucent Photorealistic Overlay (Flipped) */}
          <mesh position={[0, h / 2 + 0.1, -w / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[l + 0.6, h + 0.3]} />
            <meshBasicMaterial 
              map={vanTexture} 
              transparent 
              opacity={0.38} 
              side={THREE.DoubleSide} 
              depthWrite={false}
            />
          </mesh>
        </group>
      ) : (
        /* FALLBACK: Premium architectural glassmorphism van shell if textures aren't copied yet */
        <group>
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
          <mesh position={[cabinStartX / 2 - cabLength / 4, h + 0.02, 0]} castShadow>
            <boxGeometry args={[cargoLength + 0.5, 0.05, w]} />
            <meshPhysicalMaterial color={brandConfig.bodyColor} transparent opacity={0.14} roughness={0.1} metalness={0.85} clearcoat={1.0} />
          </mesh>
        </group>
      )}

      {/* =========================================================
          3. CABINET COCKPIT & CAPTAIN SEATS
          ========================================================= */}
      <group position={[l / 2 - cabLength * 0.9, 0.48, 0]}>
        {/* Driver Seat */}
        <group position={[0, 0.1, w * 0.24]}>
          <mesh castShadow><boxGeometry args={[0.42, 0.12, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
          <mesh position={[-0.18, 0.28, 0]} castShadow><boxGeometry args={[0.08, 0.52, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
        </group>
        {/* Passenger Seat */}
        <group position={[0, 0.1, -w * 0.24]}>
          <mesh castShadow><boxGeometry args={[0.42, 0.12, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
          <mesh position={[-0.18, 0.28, 0]} castShadow><boxGeometry args={[0.08, 0.52, 0.44]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh>
        </group>

        {/* Dashboard & Steering Wheel */}
        <mesh position={[0.3, 0.2, 0]} castShadow>
          <boxGeometry args={[0.2, 0.3, w - 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.35, w * 0.24]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <torusGeometry args={[0.15, 0.02, 8, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* =========================================================
          4. ALLOY WHEELS & TIRES
          ========================================================= */}
      <group>
        {/* Front Left Wheel */}
        <group position={[wb / 2, 0.32, w / 2 - 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
          </mesh>
          {spokesArray.map((_, idx) => (
            <mesh key={idx} rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} position={[0, 0, 0.035]} castShadow>
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
            <mesh key={idx} rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} position={[0, 0, -0.035]} castShadow>
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
            <mesh key={idx} rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} position={[0, 0, 0.035]} castShadow>
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
            <mesh key={idx} rotation={[Math.PI / 2, (idx * Math.PI) / 3, 0]} position={[0, 0, -0.035]} castShadow>
              <boxGeometry args={[0.02, 0.18, 0.18]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
