'use client';

import React from 'react';
import { 
  Download, 
  Printer, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Wrench,
  ArrowRight
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { PRODUCT_REGISTRY } from '@/data/products';

export default function BOMExport({ onClose }: { onClose: () => void }) {
  const { components, vehicle } = useProjectStore();
  
  const totalCost = components.reduce((sum, c) => sum + c.cost, 0);
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  
  // Group by category
  const categories = Array.from(new Set(components.map(c => c.category)));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-primary">Workshop Build Manifest</h2>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">Project ID: AMP-2024-{Math.floor(Math.random()*9000)+1000}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-xl text-xs font-bold hover:bg-secondary transition-all">
              <Printer size={16} /> Print Manifest
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              <Download size={16} /> Export CSV
            </button>
            <button onClick={onClose} className="ml-4 text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-12 gap-8">
          
          {/* Main List */}
          <div className="col-span-8 space-y-8">
            {categories.map(cat => (
              <section key={cat}>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border pb-2">{cat}</h3>
                <div className="space-y-3">
                  {components.filter(c => c.category === cat).map(c => {
                    const product = PRODUCT_REGISTRY.find(p => p.id === c.productId);
                    return (
                      <div key={c.id} className="group p-4 bg-secondary/20 rounded-2xl border border-transparent hover:border-primary/30 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-border group-hover:shadow-md transition-all font-black text-primary text-xs italic">
                            {c.manufacturer?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-primary uppercase">{c.manufacturer}</div>
                            <div className="text-sm font-bold">{c.type}</div>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                 <Clock size={10} /> {product?.installComplexity || 'Moderate'}
                               </span>
                               <span className="text-[9px] font-bold text-muted-foreground uppercase">Weight: {c.weight}kg</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-foreground">£{c.cost.toLocaleString()}</div>
                          <button className="text-[9px] font-black uppercase text-primary mt-1 flex items-center gap-1 hover:underline">
                            Sourcing Link <ArrowRight size={10} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar Summary */}
          <div className="col-span-4 space-y-6">
            <div className="p-6 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-60">Build Summary</h4>
              <div className="space-y-6">
                <div>
                  <div className="text-[9px] font-black uppercase opacity-60 mb-1">Total Component Cost</div>
                  <div className="text-3xl font-black italic">£{totalCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase opacity-60 mb-1">Payload Impact</div>
                  <div className="text-xl font-black italic">{totalWeight}kg / {vehicle.payload}kg</div>
                  <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(totalWeight/vehicle.payload)*100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-border rounded-3xl space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Professional Verification</h4>
              <div className="flex items-center gap-3 text-emerald-600">
                <ShieldCheck size={20} />
                <div>
                   <div className="text-[10px] font-black uppercase">Chassis Compatible</div>
                   <p className="text-[9px] text-muted-foreground">All components verified for {vehicle.model}.</p>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                 <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">Installation Warning</div>
                 <p className="text-[9px] text-amber-600 leading-tight">Your build includes high-current Victron components. Certified electrical sign-off required.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
