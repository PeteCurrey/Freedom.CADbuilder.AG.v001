'use client';

import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import Planner2D from '../planner/Planner2D';
import Visualizer3D from '../visualizer/Visualizer3D';

export default function ViewportManager() {
  const { activeView } = useUIStore();

  return (
    <div className="flex-1 relative flex bg-[#fbfbfb]">
      {/* 2D Planner */}
      {(activeView === '2d' || activeView === 'split') && (
        <div 
          className={`relative overflow-hidden transition-all duration-300 ${
            activeView === 'split' ? 'w-1/2 border-r border-border' : 'w-full'
          }`}
        >
          <Planner2D />
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-border">
              2D Planning Canvas
            </span>
          </div>
        </div>
      )}

      {/* 3D Visualizer */}
      {(activeView === '3d' || activeView === 'split') && (
        <div 
          className={`relative transition-all duration-300 ${
            activeView === 'split' ? 'w-1/2' : 'w-full'
          }`}
        >
          <Visualizer3D />
          <div className="absolute top-4 right-4 pointer-events-none">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-border">
              High-Fidelity 3D View
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
