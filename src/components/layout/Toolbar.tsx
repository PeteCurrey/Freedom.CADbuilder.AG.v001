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

export default function Toolbar() {
  const { activeTool, setActiveTool, activeView, setActiveView } = useUIStore();

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
          <span className="font-semibold text-charcoal tracking-tight">AMPLIOS <span className="font-light">STUDIO</span></span>
        </div>

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
