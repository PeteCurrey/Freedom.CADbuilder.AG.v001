'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';

export default function AIArchitect() {
  const { components, getElectricalStats, getPlumbingStats } = useProjectStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const electrical = getElectricalStats();
  const plumbing = getPlumbingStats();

  return (
    <div className="p-5 space-y-6 bg-slate-900 text-white rounded-[32px] border border-white/10 shadow-2xl overflow-hidden relative">
      
      {/* Glossy Overlay */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 animate-pulse">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest italic">AI Architect</h3>
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Build Optimizer v4.0</p>
          </div>
        </div>
        <BrainCircuit size={20} className="text-white/20" />
      </div>

      <div className="space-y-4 relative z-10">
        
        {/* Smart Suggestions */}
        <section className="space-y-2">
           <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
             <Lightbulb size={12} className="text-amber-400" /> System Recommendations
           </h4>
           
           {/* Recommendation 1: Electrical Sync */}
           {!components.some(c => c.type.includes('Cerbo')) && (
             <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                   <span className="text-[9px] font-black text-primary uppercase">Integration Opportunity</span>
                   <TrendingUp size={10} className="text-emerald-400" />
                </div>
                <div className="text-[11px] font-bold">Sync your Victron System</div>
                <p className="text-[9px] text-white/50 leading-relaxed mt-1">Add a Cerbo GX to unlock remote monitoring and historical power analytics.</p>
                <button className="mt-2 text-[9px] font-black uppercase text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Optimize System <ArrowRight size={10} />
                </button>
             </div>
           )}

           {/* Recommendation 2: Water Filtration */}
           {!plumbing.hasFiltration && plumbing.freshWaterL > 0 && (
             <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                   <span className="text-[9px] font-black text-blue-400 uppercase">Off-Grid Safety</span>
                   <ShieldCheck size={10} className="text-emerald-400" />
                </div>
                <div className="text-[11px] font-bold">UV Purification Upgrade</div>
                <p className="text-[9px] text-white/50 leading-relaxed mt-1">Your 120L water pool lacks UV filtration. We suggest Guzzle H2O for potable safety.</p>
                <button className="mt-2 text-[9px] font-black uppercase text-blue-400 flex items-center gap-1">
                  Add Filtration <ArrowRight size={10} />
                </button>
             </div>
           )}
        </section>

        {/* Predictive Analysis */}
        <section className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
           <h4 className="text-[9px] font-black text-primary uppercase mb-3">Predictive Performance</h4>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <div className="text-[8px] font-bold text-white/40 uppercase mb-1">Charge Recovery</div>
                 <div className="text-xs font-black">4.2 Hours <span className="text-[8px] text-emerald-400">Optimal</span></div>
              </div>
              <div>
                 <div className="text-[8px] font-bold text-white/40 uppercase mb-1">Winter Rating</div>
                 <div className="text-xs font-black">Extreme <span className="text-[8px] text-amber-400">High Load</span></div>
              </div>
           </div>
        </section>

        {/* Ask the Architect Placeholder */}
        <div className="relative">
           <input 
             type="text" 
             placeholder="Ask the architect..." 
             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/20"
           />
           <MessageSquare size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
        </div>

      </div>

      {/* Futuristic Background Element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
    </div>
  );
}
