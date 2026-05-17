'use client';

import React from 'react';
import { 
  Box, 
  Layout, 
  Maximize2, 
  MousePointer2, 
  RotateCw, 
  Ruler, 
  Save, 
  Settings, 
  Share2,
  Layers,
  BoxSelect
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { VEHICLE_REGISTRY } from '@/data/vehicles';
import { Truck } from 'lucide-react';

export default function Toolbar() {
  const { activeTool, setActiveTool, activeView, setActiveView } = useUIStore();
  const { vehicle, setVehicle } = useProjectStore();

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'move', icon: BoxSelect, label: 'Move' },
    { id: 'rotate', icon: RotateCw, label: 'Rotate' },
    { id: 'measure', icon: Ruler, label: 'Measure' },
  ];

  return (
    <header className="h-14 border-b border-border bg-white flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <Box className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-charcoal tracking-tight shrink-0">AMPLIOS <span className="font-light">STUDIO</span></span>
        </div>

        <div className="h-6 w-[1px] bg-border shrink-0" />

        {/* Premium Exact Vehicle Selector */}
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer group relative shrink-0">
          <Truck size={14} className="text-primary group-hover:scale-110 transition-transform" />
          <select 
            value={vehicle.id} 
            onChange={(e) => {
              const selected = VEHICLE_REGISTRY.find(v => v.id === e.target.value);
              if (selected) setVehicle(selected);
            }}
            className="bg-transparent text-[10px] font-black uppercase tracking-wider focus:outline-none cursor-pointer pr-4 appearance-none text-charcoal font-black"
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', 
              backgroundPosition: 'right center', 
              backgroundSize: '10px', 
              backgroundRepeat: 'no-repeat' 
            }}
          >
            {VEHICLE_REGISTRY.map(v => (
              <option key={v.id} value={v.id} className="text-black bg-white font-bold uppercase tracking-wider text-[9px]">
                {v.model.replace('-', ' ')} - {v.variant}
              </option>
            ))}
          </select>
        </div>

        <div className="h-6 w-[1px] bg-border shrink-0" />

        <nav className="flex items-center gap-1 p-1 bg-secondary rounded-md">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`p-1.5 rounded transition-all ${
                activeTool === tool.id 
                  ? 'bg-white shadow-sm text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={tool.label}
            >
              <tool.icon size={18} />
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-md">
          <button 
            onClick={() => setActiveView('2d')}
            className={`px-3 py-1 text-xs font-medium rounded ${activeView === '2d' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
          >
            2D
          </button>
          <button 
            onClick={() => setActiveView('split')}
            className={`px-3 py-1 text-xs font-medium rounded ${activeView === 'split' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
          >
            SPLIT
          </button>
          <button 
            onClick={() => setActiveView('3d')}
            className={`px-3 py-1 text-xs font-medium rounded ${activeView === '3d' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
          >
            3D
          </button>
        </div>

        <div className="h-6 w-[1px] bg-border mx-2" />

        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Save size={18} />
          </button>
          <button className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors">
            EXPORT
          </button>
        </div>
      </div>
    </header>
  );
}
