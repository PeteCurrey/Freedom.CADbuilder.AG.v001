'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import Toolbar from './Toolbar';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import BottomDrawer from './BottomDrawer';
import ViewportManager from './ViewportManager';
import BOMExport from '../export/BOMExport';
import TechnicalExport from '../export/TechnicalExport';
import AIArchitect from '../ai/AIArchitect';
import { FileText, Ruler } from 'lucide-react';

export default function Workspace() {
  const { leftPanelOpen, rightPanelOpen, bottomPanelOpen } = useUIStore();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTechnicalOpen, setIsTechnicalOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Toolbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {leftPanelOpen && <SidebarLeft />}
        
        <main className="flex-1 relative overflow-hidden flex flex-col">
          <ViewportManager />
          {bottomPanelOpen && <BottomDrawer />}

          {/* AI Architect Overlay */}
          {useUIStore(s => s.aiPanelOpen) && (
            <div className="absolute top-8 left-8 z-50 w-80 animate-in slide-in-from-left-8 duration-500">
              <AIArchitect />
            </div>
          )}
          
          {/* Floating Export Buttons */}
          <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-3 items-end">
            <button 
              onClick={() => setIsTechnicalOpen(true)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/10"
            >
              <Ruler size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest">Technical Drawings</span>
            </button>
            <button 
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all group"
            >
              <FileText size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest">Build Manifest</span>
            </button>
          </div>
        </main>

        {rightPanelOpen && <SidebarRight />}
      </div>

      {isExportOpen && <BOMExport onClose={() => setIsExportOpen(false)} />}
      {isTechnicalOpen && <TechnicalExport onClose={() => setIsTechnicalOpen(false)} />}
    </div>
  );
}
