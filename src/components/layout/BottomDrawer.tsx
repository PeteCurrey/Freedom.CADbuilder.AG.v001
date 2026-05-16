'use client';

import React from 'react';
import { 
  BarChart3, 
  ListOrdered, 
  AlertTriangle, 
  ChevronDown,
  Scale
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';

export default function BottomDrawer() {
  const { components, vehicle } = useProjectStore();
  const { toggleBottomPanel } = useUIStore();

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const totalCost = components.reduce((sum, c) => sum + c.cost, 0);
  const payloadRemaining = vehicle.payload - totalWeight;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 bg-white border-t border-border z-40 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
        <div className="flex gap-4">
          <button className="text-xs font-bold flex items-center gap-2 border-b-2 border-black pb-1">
            <ListOrdered size={14} /> BILL OF MATERIALS
          </button>
          <button className="text-xs font-bold text-muted-foreground flex items-center gap-2 pb-1 hover:text-foreground">
            <BarChart3 size={14} /> PAYLOAD ANALYSIS
          </button>
        </div>
        <button 
          onClick={toggleBottomPanel}
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* BOM List */}
        <div className="flex-1 overflow-y-auto p-4 border-r border-border">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">COMPONENT</th>
                <th className="pb-2 font-medium">CATEGORY</th>
                <th className="pb-2 font-medium">WEIGHT</th>
                <th className="pb-2 font-medium text-right">EST. COST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {components.map((comp) => (
                <tr key={comp.id} className="hover:bg-secondary/50">
                  <td className="py-2 font-medium">{comp.type}</td>
                  <td className="py-2 text-muted-foreground uppercase text-[10px]">{comp.category}</td>
                  <td className="py-2">{comp.weight} kg</td>
                  <td className="py-2 text-right">£{comp.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Intelligence Sidebar */}
        <div className="w-80 p-4 bg-secondary/20 space-y-6">
          <div>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Scale size={12} /> Payload Status
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Total Build Weight</span>
                <span className="font-bold">{totalWeight} kg</span>
              </div>
              <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${payloadRemaining < 200 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(totalWeight / vehicle.payload) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Remaining: {payloadRemaining} kg</span>
                <span>Limit: {vehicle.payload} kg</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-3 space-y-2 shadow-sm">
            <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={12} /> Optimization Insights
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {payloadRemaining > 500 
                ? "Your weight distribution is healthy. Consider adding solar panels to utilize available payload."
                : "Warning: Rear axle load approaching limit. Consider shifting storage forward."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
