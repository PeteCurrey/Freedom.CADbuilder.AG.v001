'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Wind,
  Search,
  Plus,
  Shield,
  Sun,
  Layout,
  Droplets,
  Filter,
  ArrowUpRight,
  FileText,
  Sparkles
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { PRODUCT_REGISTRY } from '@/data/products';

const categories = [
  { id: 'electrical', icon: Zap, label: 'Power Systems' },
  { id: 'hvac', icon: Wind, label: 'Climate & Comfort' },
  { id: 'exterior', icon: Sun, label: 'Exterior & Lighting' },
  { id: 'performance', icon: Shield, label: 'Chassis & Armor' },
  { id: 'plumbing', icon: Droplets, label: 'Water Systems' },
  { id: 'storage', icon: Layout, label: 'Racks & Storage' },
];

export default function SidebarLeft() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addComponent } = useProjectStore();

  const handleAddProduct = (product: any) => {
    addComponent({
      id: Math.random().toString(36).substr(2, 9),
      type: product.name,
      category: product.category,
      productId: product.id,
      manufacturer: product.manufacturer,
      brand: product.manufacturer, // backward compat
      tier: product.tier,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: product.dimensions,
      weight: product.weight,
      cost: product.costEstimate,
      metadata: product.isSmart ? { smartSync: true } : {}
    });
  };

  return (
    <aside className="w-80 border-r border-border bg-white flex flex-col z-40 overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product Ecosystem</h2>
        <Filter size={14} className="text-muted-foreground cursor-pointer hover:text-primary" />
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search premium parts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-secondary/30 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {categories.map((cat) => {
            const products = PRODUCT_REGISTRY.filter(p => p.category === cat.id && 
              (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               p.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())));
            
            if (searchQuery && products.length === 0) return null;

            return (
              <div key={cat.id}>
                <button
                  onClick={() => setActiveTab(activeTab === cat.id ? null : cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    activeTab === cat.id ? 'bg-primary text-white' : 'hover:bg-secondary text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon size={18} className={activeTab === cat.id ? 'text-white' : 'text-primary'} />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{cat.label}</span>
                  </div>
                  <span className="text-[10px] opacity-60 font-mono">{products.length}</span>
                </button>

                {activeTab === cat.id && (
                  <div className="mt-2 ml-2 space-y-2 pb-4">
                    {products.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => handleAddProduct(product)}
                        className="p-3 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md cursor-pointer group transition-all relative overflow-hidden"
                      >
                        {product.tier === 'ultimate' && (
                          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                            <div className="absolute top-2 right-[-20px] rotate-45 bg-amber-400 text-[6px] font-black py-0.5 px-6 uppercase text-amber-900">
                              Ultimate
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[8px] font-black uppercase text-primary tracking-tighter">
                            {product.manufacturer}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600">£{product.costEstimate}</span>
                        </div>
                        <div className="text-[11px] font-bold mb-1 flex items-center justify-between">
                          {product.name}
                          <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[9px] text-muted-foreground line-clamp-1 italic">{product.shortDescription}</div>
                        <div className="mt-2 flex gap-1">
                          {product.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[7px] bg-secondary px-1 py-0.5 rounded uppercase font-bold text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button 
          onClick={() => useUIStore.getState().toggleAiPanel()}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
            useUIStore.getState().aiPanelOpen ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'hover:bg-secondary text-primary border-transparent'
          }`}
        >
          <Sparkles size={18} className={useUIStore.getState().aiPanelOpen ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">AI Architect</span>
        </button>
      </div>

      <div className="p-4 border-t border-border bg-secondary/10">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold mb-3 uppercase tracking-widest">
          <span>Build Intelligence</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-bold">System Complexity</span>
            <span className="text-primary font-black">Professional</span>
          </div>
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-bold">Off-Grid Capability</span>
            <span className="text-emerald-600 font-black">
              {(() => {
                const { offGridHours } = useProjectStore.getState().getElectricalStats();
                if (offGridHours > 500) return 'Indefinite';
                const days = Math.floor(offGridHours / 24);
                const hours = Math.floor(offGridHours % 24);
                return `${days}d ${hours}h`;
              })()}
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-bold">Solar Harvesting</span>
            <span className="text-amber-500 font-black">
              {useProjectStore.getState().getExteriorPerformanceStats().totalSolarWatts} W
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
