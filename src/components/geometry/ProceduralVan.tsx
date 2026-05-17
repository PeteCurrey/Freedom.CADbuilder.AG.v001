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

  // Custom brand visual and proportion setup
  const brandConfig = useMemo(() => {
    switch (vehicle.model) {
      case 'mercedes-sprinter':
        return {
          shellColor: '#0ea5e9', // Electric Cyan
          wireColor: '#38bdf8',
          fillColor: 'rgba(224, 242, 254, 0.15)', // Highly transparent ice blue
          strokeColor: '#0284c7',
          noseLength: 1.15,
          noseHeight: 0.96,
          noseWidth: w * 0.94,
          windshieldAngle: 0.58,
          grilleRows: 3,
          label: 'Mercedes-Benz Sprinter'
        };
      case 'ford-transit':
        return {
          shellColor: '#64748b', // Slate Blue
          wireColor: '#94a3b8',
          fillColor: 'rgba(241, 245, 249, 0.15)', // Transparent slate white
          strokeColor: '#475569',
          noseLength: 1.0,
          noseHeight: 1.0,
          noseWidth: w * 0.95,
          windshieldAngle: 0.64,
          grilleRows: 4,
          label: 'Ford Transit'
        };
      case 'fiat-ducato':
        return {
          shellColor: '#ef4444', // Red
          wireColor: '#f87171',
          fillColor: 'rgba(254, 226, 226, 0.15)', // Transparent red-white
          strokeColor: '#b91c1c',
          noseLength: 0.8,
          noseHeight: 1.04,
          noseWidth: w * 0.96,
          windshieldAngle: 0.72,
          grilleRows: 2,
          label: 'Fiat Ducato'
        };
      case 'vw-crafter':
        return {
          shellColor: '#a855f7', // Purple
          wireColor: '#c084fc',
          fillColor: 'rgba(243, 232, 255, 0.15)', // Transparent violet
          strokeColor: '#7e22ce',
          noseLength: 1.1,
          noseHeight: 0.98,
          noseWidth: w * 0.94,
          windshieldAngle: 0.6,
          grilleRows: 3,
          label: 'VW Crafter'
        };
      case 'renault-master':
        return {
          shellColor: '#10b981', // Green
          wireColor: '#34d399',
          fillColor: 'rgba(236, 253, 245, 0.15)', // Transparent emerald
          strokeColor: '#047857',
          noseLength: 1.05,
          noseHeight: 1.02,
          noseWidth: w * 0.93,
          windshieldAngle: 0.62,
          grilleRows: 3,
          label: 'Renault Master'
        };
      default:
        return {
          shellColor: '#94a3b8',
          wireColor: '#cbd5e1',
          fillColor: 'rgba(255, 255, 255, 0.15)',
          strokeColor: '#64748b',
          noseLength: 1.1,
          noseHeight: 1.0,
          noseWidth: w * 0.94,
          windshieldAngle: 0.62,
          grilleRows: 3,
          label: 'Van Builder'
        };
    }
  }, [vehicle.model, w]);

  // Procedural canvas vector drawing for the photographic-outline shells
  const sideTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Clear transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Coordinate mapping
    const scale = 200; // pixels per meter
    const startX = 150;
    const groundY = 850;

    const vLength = l * scale;
    const vHeight = h * scale;
    const nLength = brandConfig.noseLength * scale;
    const nHeight = brandConfig.noseHeight * scale;
    const wBase = wb * scale;

    // Draw the beautiful, detailed vector outline of the selected van model!
    ctx.beginPath();
    // 1. Start from rear bumper
    ctx.moveTo(startX, groundY - 50);
    // Rear wall
    ctx.lineTo(startX, groundY - vHeight + 30);
    // Roof curve (Rear corner)
    ctx.arcTo(startX, groundY - vHeight, startX + 50, groundY - vHeight, 40);
    // Roof line
    ctx.lineTo(startX + vLength - nLength - 50, groundY - vHeight);
    
    // Brand Specific Cab roof to windshield transition
    if (vehicle.model === 'mercedes-sprinter') {
      ctx.lineTo(startX + vLength - nLength, groundY - vHeight + 20);
      // Windshield slope
      ctx.lineTo(startX + vLength - nLength + 120, groundY - nHeight);
      // Hood line
      ctx.lineTo(startX + vLength - 30, groundY - nHeight + 10);
      // Nose front curve
      ctx.arcTo(startX + vLength, groundY - nHeight + 20, startX + vLength, groundY - 50, 30);
    } else if (vehicle.model === 'ford-transit') {
      ctx.lineTo(startX + vLength - nLength, groundY - vHeight + 10);
      // Windshield slope (steeper)
      ctx.lineTo(startX + vLength - nLength + 100, groundY - nHeight - 10);
      // Hood line
      ctx.lineTo(startX + vLength - 40, groundY - nHeight);
      // Nose
      ctx.arcTo(startX + vLength, groundY - nHeight + 10, startX + vLength, groundY - 50, 45);
    } else {
      // Fiat Ducato / Default upright nose
      ctx.lineTo(startX + vLength - nLength, groundY - vHeight + 10);
      ctx.lineTo(startX + vLength - nLength + 60, groundY - nHeight);
      ctx.lineTo(startX + vLength - 20, groundY - nHeight + 10);
      ctx.arcTo(startX + vLength, groundY - nHeight + 20, startX + vLength, groundY - 50, 20);
    }

    ctx.lineTo(startX + vLength, groundY - 50); // Lower bumper
    ctx.lineTo(startX + vLength - 120, groundY - 50); // Front wheel arch entry
    // Front Wheel arch
    ctx.arc(startX + vLength - vLength * 0.18, groundY - 50, 70, Math.PI, 0, false);
    // Center floor
    ctx.lineTo(startX + 180, groundY - 50);
    // Rear Wheel arch
    ctx.arc(startX + vLength * 0.22, groundY - 50, 70, Math.PI, 0, false);
    ctx.lineTo(startX, groundY - 50);
    ctx.closePath();

    // Fill with soft semi-transparent brand aesthetic
    ctx.fillStyle = brandConfig.fillColor;
    ctx.fill();

    // Contour line details (Double stroke for high-fidelity technical look)
    ctx.strokeStyle = brandConfig.strokeColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Draw Side Glass Windows (translucent dark glass)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = brandConfig.strokeColor;
    ctx.lineWidth = 3;

    // Driver Cab Window
    ctx.beginPath();
    ctx.moveTo(startX + vLength - nLength - 40, groundY - vHeight + 100);
    ctx.lineTo(startX + vLength - nLength + 80, groundY - vHeight + 100);
    ctx.lineTo(startX + vLength - nLength + 130, groundY - nHeight + 40);
    ctx.lineTo(startX + vLength - nLength - 40, groundY - nHeight + 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sliding Door Window (campervan style)
    ctx.beginPath();
    ctx.roundRect(startX + vLength - nLength - 380, groundY - vHeight + 100, 280, 160, 20);
    ctx.fill();
    ctx.stroke();

    // Rear Side Window
    ctx.beginPath();
    ctx.roundRect(startX + 120, groundY - vHeight + 100, 240, 160, 20);
    ctx.fill();
    ctx.stroke();

    // 3. Sliding Cargo Door Panel Lines
    ctx.strokeStyle = brandConfig.strokeColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX + vLength - nLength - 400, groundY - 60);
    ctx.lineTo(startX + vLength - nLength - 400, groundY - vHeight + 60);
    ctx.lineTo(startX + vLength - nLength - 80, groundY - vHeight + 60);
    ctx.lineTo(startX + vLength - nLength - 80, groundY - 60);
    ctx.stroke();

    // Sliding Door Handle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(startX + vLength - nLength - 130, groundY - vHeight / 2, 40, 15, 4);
    ctx.fill();

    // 4. Wheels (Solid 3D matching rims)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(startX + vLength - vLength * 0.18, groundY - 50, 64, 0, Math.PI * 2);
    ctx.arc(startX + vLength * 0.22, groundY - 50, 64, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(startX + vLength - vLength * 0.18, groundY - 50, 40, 0, Math.PI * 2);
    ctx.arc(startX + vLength * 0.22, groundY - 50, 40, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Tech spec labels & dimensions HUD
    ctx.fillStyle = brandConfig.strokeColor;
    ctx.font = 'bold 36px monospace';
    ctx.fillText(brandConfig.label.toUpperCase(), startX + 50, groundY - vHeight + 80);
    
    ctx.font = '24px monospace';
    ctx.fillText(`L: ${length}mm | W: ${width}mm | H: ${height}mm`, startX + 50, groundY - vHeight + 120);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [vehicle.model, l, h, length, width, height, wb, brandConfig]);

  // Derived layout values
  const cargoHeight = h - 0.25;

  return (
    <group>
      {/* =========================================================
          1. HIGH-TECH GLOWING BLUEPRINT GRID FLOOR
          ========================================================= */}
      {/* Plywood underlay floor */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[l + 0.4, w - 0.04]} />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.85} 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>

      {/* Grid line overlay for technical CAD look */}
      <gridHelper 
        args={[12, 60, brandConfig.wireColor, '#334155']} 
        position={[0, 0.215, 0]} 
      />

      {/* =========================================================
          2. PHOTOREALISTIC TRANSPARENT OUTLINE SHELL (Vanspace Style)
          ========================================================= */}
      {sideTexture && (
        <group>
          {/* A. Near Right-Side Transparent Van Overlay Plane */}
          <mesh position={[0, h / 2 + 0.1, w / 2 + 0.01]} rotation={[0, 0, 0]}>
            <planeGeometry args={[l + 0.8, h + 0.4]} />
            <meshBasicMaterial 
              map={sideTexture} 
              transparent 
              opacity={0.45} 
              side={THREE.DoubleSide} 
            />
          </mesh>

          {/* B. Far Left-Side Transparent Van Overlay Plane */}
          <mesh position={[0, h / 2 + 0.1, -w / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[l + 0.8, h + 0.4]} />
            <meshBasicMaterial 
              map={sideTexture} 
              transparent 
              opacity={0.45} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        </group>
      )}

      {/* =========================================================
          3. TRANSLUCENT 3D FRONT CAB CABIN & ACCENTS
          ========================================================= */}
      <group position={[l / 2 - brandConfig.noseLength / 2, 0.58, 0]}>
        {/* Solid Translucent Cab Block */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[brandConfig.noseLength, 0.75, w]} />
          <meshStandardMaterial 
            color={brandConfig.shellColor} 
            transparent 
            opacity={0.08} 
            roughness={0.1} 
            metalness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Glowing Contour Wireframe */}
        <mesh>
          <boxGeometry args={[brandConfig.noseLength, 0.75, w]} />
          <meshBasicMaterial 
            color={brandConfig.wireColor} 
            wireframe 
            transparent 
            opacity={0.25} 
          />
        </mesh>

        {/* Headlamps (Glowing vector bulbs) */}
        <mesh position={[brandConfig.noseLength / 2 - 0.01, -0.16, brandConfig.noseWidth * 0.42]} castShadow>
          <boxGeometry args={[0.05, 0.08, 0.12]} />
          <meshStandardMaterial color="#fff" emissive={brandConfig.wireColor} emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[brandConfig.noseLength / 2 - 0.01, -0.16, -brandConfig.noseWidth * 0.42]} castShadow>
          <boxGeometry args={[0.05, 0.08, 0.12]} />
          <meshStandardMaterial color="#fff" emissive={brandConfig.wireColor} emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* =========================================================
          4. DETAILED TYRES & WHEEL ARCHES
          ========================================================= */}
      <group>
        {/* Front Left Tyre */}
        <group position={[wb / 2, 0.32, w / 2 - 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshBasicMaterial color={brandConfig.wireColor} wireframe transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Front Right Tyre */}
        <group position={[wb / 2, 0.32, -w / 2 + 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshBasicMaterial color={brandConfig.wireColor} wireframe transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Rear Left Tyre */}
        <group position={[-wb / 2, 0.32, w / 2 - 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshBasicMaterial color={brandConfig.wireColor} wireframe transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Rear Right Tyre */}
        <group position={[-wb / 2, 0.32, -w / 2 + 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
            <meshBasicMaterial color={brandConfig.wireColor} wireframe transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Internal Floor Wheel Arches inside the cargo space */}
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
          5. SOLID CABIN DRIVER / PASSENGER CAPTAIN CHAIRS
          ========================================================= */}
      <group position={[l / 2 - brandConfig.noseLength * 1.15, 0.48, 0]}>
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
