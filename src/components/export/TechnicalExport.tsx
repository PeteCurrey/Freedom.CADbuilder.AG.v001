'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ArrowLeft,
  Layout as LayoutIcon,
  Zap,
  Droplets,
  Ruler,
  Maximize2
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';

export default function TechnicalExport({ onClose }: { onClose: () => void }) {
  const [activeSheet, setActiveSheet] = useState<'layout' | 'electrical' | 'plumbing' | 'exterior'>('layout');
  const { components, vehicle } = useProjectStore();

  const sheets = [
    { id: 'layout', icon: LayoutIcon, label: 'Floor Plan' },
    { id: 'electrical', icon: Zap, label: 'Electrical Schematic' },
    { id: 'plumbing', icon: Droplets, label: 'Plumbing Layout' },
    { id: 'exterior', icon: Ruler, label: 'Technical Profile' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[110] flex flex-col p-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight italic">Technical Export Studio</h2>
            <p className="text-xs text-white/50 font-bold uppercase tracking-[0.3em]">Engineering Grade Documentation</p>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-all">
              <Printer size={16} /> Print Full Set
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
              <Download size={16} /> Export PDF Bundle
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        
        {/* Sheet Selector */}
        <div className="w-64 flex flex-col gap-2">
          {sheets.map(sheet => (
            <button
              key={sheet.id}
              onClick={() => setActiveSheet(sheet.id as any)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                activeSheet === sheet.id ? 'bg-primary text-white shadow-xl' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <sheet.icon size={20} />
              <span className="text-xs font-black uppercase tracking-widest">{sheet.label}</span>
            </button>
          ))}
          
          <div className="mt-auto p-6 bg-white/5 border border-white/10 rounded-3xl">
             <h4 className="text-[10px] font-black text-white/40 uppercase mb-4">Export Standards</h4>
             <div className="space-y-2">
                <div className="text-[11px] text-white flex items-center justify-between">
                   <span>Scale</span>
                   <span className="font-mono">1:25</span>
                </div>
                <div className="text-[11px] text-white flex items-center justify-between">
                   <span>Units</span>
                   <span className="font-mono">Metric (mm)</span>
                </div>
                <div className="text-[11px] text-white flex items-center justify-between">
                   <span>Format</span>
                   <span className="font-mono">ISO A3</span>
                </div>
             </div>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="flex-1 bg-white rounded-[40px] shadow-inner overflow-hidden relative border-[12px] border-slate-800">
           
           {/* Blueprint Grid Overlay */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} />

           {/* Content Rendering based on Sheet */}
           <div className="h-full w-full p-12 flex flex-col">
              
              {/* Sheet Title Block */}
              <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic leading-none">{activeSheet} DRAWING</h3>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 tracking-widest">AMPLIOS VAN STUDIO / ENGINEERING DEPARTMENT</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400">Sheet No.</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">0{sheets.findIndex(s => s.id === activeSheet) + 1}</p>
                 </div>
              </div>

              {/* Viewport Simulation */}
              <div className="flex-1 relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
                 
                 {/* This would be where the 2D orthographic drawing is rendered */}
                 <div className="relative border-2 border-slate-900/10 p-8">
                    {/* Simulated Vehicle Boundary */}
                    <div className="border-4 border-slate-900 rounded-3xl" 
                         style={{ width: vehicle.dimensions.width / 5, height: vehicle.dimensions.length / 5 }}>
                       
                       {/* Simplified Component Boxes with IDs */}
                       {components.map(c => (
                         <div 
                           key={c.id}
                           className="absolute border-2 border-primary bg-primary/5 flex items-center justify-center text-[8px] font-black text-primary overflow-hidden"
                           style={{
                             width: c.dimensions.width / 5,
                             height: c.dimensions.depth / 5,
                             left: (c.position.x + (vehicle.dimensions.width / 2)) / 5,
                             top: (c.position.z + (vehicle.dimensions.length / 2)) / 5,
                           }}
                         >
                           #{c.id.slice(0,4).toUpperCase()}
                         </div>
                       ))}

                       {/* Dimension Lines Placeholder */}
                       <div className="absolute -left-8 top-0 bottom-0 border-l border-slate-900 flex flex-col justify-center gap-2">
                          <div className="h-px w-2 bg-slate-900" />
                          <span className="text-[10px] font-black rotate-[-90deg]">{vehicle.dimensions.length}mm</span>
                          <div className="h-px w-2 bg-slate-900" />
                       </div>
                    </div>
                 </div>

                 {/* Drawing Overlay Tools */}
                 <div className="absolute bottom-6 left-6 flex gap-2">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                       <Ruler size={16} />
                    </button>
                    <button className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                       <Maximize2 size={16} />
                    </button>
                 </div>
              </div>

              {/* Legend / Key */}
              <div className="mt-8 grid grid-cols-4 gap-4">
                 {components.slice(0, 4).map(c => (
                    <div key={c.id} className="text-[9px] border-l-2 border-primary pl-2">
                       <div className="font-black text-slate-400 uppercase">#{c.id.slice(0,4).toUpperCase()}</div>
                       <div className="font-bold truncate">{c.type}</div>
                    </div>
                 ))}
                 <div className="text-[9px] border-l-2 border-slate-300 pl-2 opacity-50">
                    <div className="font-black uppercase">CHASSIS</div>
                    <div className="font-bold">{vehicle.model}</div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
