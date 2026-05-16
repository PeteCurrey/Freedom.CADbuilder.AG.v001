import { 
  Info, 
  Settings2, 
  Trash2,
  Zap,
  BookOpen,
  Scale,
  DollarSign,
  Hammer,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Palette,
  Check
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { PRODUCT_REGISTRY } from '@/data/products';
import { MATERIAL_REGISTRY } from '@/registry/MaterialRegistry';

export default function SidebarRight() {
  const [activeTab, setActiveTab] = React.useState<'specs' | 'install' | 'materials'>('specs');
  const { selectedComponentId, components, removeComponent, updateComponent } = useProjectStore();
  const selectedComponent = components.find(c => c.id === selectedComponentId);
  const productData = PRODUCT_REGISTRY.find(p => p.id === selectedComponent?.productId);

  return (
    <aside className="w-80 border-l border-border bg-white flex flex-col z-40">
      <div className="flex border-b border-border bg-secondary/10">
        {['specs', 'materials', 'install'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            {tab === 'materials' ? 'Finish' : tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        {!selectedComponent ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Info size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1">Inspector Idle</p>
            <p className="text-[10px] leading-relaxed">Select a premium component to view technical specifications and installation intelligence.</p>
          </div>
        ) : activeTab === 'materials' ? (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <Palette size={14} /> Finish & Materials
            </h3>

            {['wood', 'laminate', 'metal'].map((cat) => (
              <section key={cat}>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">{cat}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {MATERIAL_REGISTRY.filter(m => m.category === cat).map(m => (
                    <button
                      key={m.id}
                      onClick={() => updateComponent(selectedComponent.id, { materialId: m.id })}
                      className={`p-3 rounded-xl border text-left group transition-all relative overflow-hidden ${
                        selectedComponent.materialId === m.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: m.color }} />
                        <span className="text-[10px] font-bold truncate">{m.name}</span>
                      </div>
                      {selectedComponent.materialId === m.id && (
                        <div className="absolute top-1 right-1">
                          <Check size={10} className="text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            ))}
            
            <div className="p-4 bg-secondary/30 rounded-xl border border-dashed border-border text-center">
               <p className="text-[9px] font-bold text-muted-foreground uppercase">Pro Tip</p>
               <p className="text-[10px] leading-relaxed">Selecting premium finishes like Fenix Nero will automatically update the Build Manifest with specific cleaning and care requirements.</p>
            </div>
          </div>
        ) : activeTab === 'specs' ? (
          <div className="space-y-6">
            {/* ... (Specs UI kept) */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-tight text-primary">
                  {productData ? productData.manufacturer : selectedComponent.manufacturer}
                </h3>
                <p className="text-sm font-bold leading-tight">
                  {productData ? productData.name : selectedComponent.type}
                </p>
              </div>
              <button 
                onClick={() => removeComponent(selectedComponent.id)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors border border-transparent hover:border-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {productData && (
              <section className="space-y-4">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  productData.tier === 'ultimate' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className={productData.tier === 'ultimate' ? 'text-amber-600' : 'text-blue-600'} />
                    <span className={`text-[10px] font-black uppercase ${
                      productData.tier === 'ultimate' ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {productData.tier} Performance
                    </span>
                  </div>
                  <span className="text-[9px] font-bold opacity-60 uppercase">{productData.installComplexity} Install</span>
                </div>

                <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                  <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <BookOpen size={12} /> Architect Notes
                  </h4>
                  <p className="text-[11px] text-foreground leading-relaxed italic">
                    {productData.shortDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white border border-border rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Scale size={12} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Weight</span>
                    </div>
                    <div className="text-xs font-black">{productData.weight} kg</div>
                  </div>
                  <div className="p-3 bg-white border border-border rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign size={12} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Est. Cost</span>
                    </div>
                    <div className="text-xs font-black">£{productData.costEstimate}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                   <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Technical Parameters</h4>
                   {Object.entries(productData.technicalSpecs || {}).map(([key, val]) => (
                     <div key={key} className="flex justify-between items-center p-2 rounded-lg bg-secondary/20 border border-border/30">
                        <span className="text-[10px] font-medium text-muted-foreground">{key}</span>
                        <span className="text-[10px] font-bold">{val as string}</span>
                     </div>
                   ))}
                </div>

                {/* Plumbing Intelligence Section */}
                {selectedComponent.category === 'plumbing' && (
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                    <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <Droplets size={12} /> Plumbing Intelligence
                    </h4>
                    {(() => {
                      const stats = useProjectStore.getState().getPlumbingStats();
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Fresh Water Pool</span>
                            <span className="font-bold">{stats.freshWaterL}L</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Flow Performance</span>
                            <span className="font-bold">{stats.pumpFlowRate} L/min</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">UV Filtration</span>
                            <span className={`font-bold ${stats.hasFiltration ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                              {stats.hasFiltration ? 'Active' : 'Not Detected'}
                            </span>
                          </div>
                          {stats.systemWarnings.map((w, i) => (
                            <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-red-500 mt-2">
                              <AlertTriangle size={10} /> {w}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Performance Intelligence Section */}
                {selectedComponent.category === 'performance' && (
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3">
                    <h4 className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                      <Shield size={12} /> Performance Intelligence
                    </h4>
                    {(() => {
                      const stats = useProjectStore.getState().getExteriorPerformanceStats();
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Braking Advantage</span>
                            <span className="font-bold text-emerald-600">+{stats.brakingPerformance}%</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Off-Road Capability</span>
                            <span className="font-bold">{stats.offRoadCapability}/100</span>
                          </div>
                          {stats.systemWarnings.map((w, i) => (
                            <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-red-500 mt-2">
                              <AlertTriangle size={10} /> {w}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Exterior Intelligence Section */}
                {selectedComponent.category === 'exterior' && (
                  <div className="p-4 bg-secondary/50 rounded-2xl border border-border space-y-3">
                    <h4 className="text-[9px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                      <Sun size={12} /> Exterior Intelligence
                    </h4>
                    {(() => {
                      const stats = useProjectStore.getState().getExteriorPerformanceStats();
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Solar Harvest</span>
                            <span className="font-bold text-amber-600">{stats.totalSolarWatts} W</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Luminous Flux</span>
                            <span className="font-bold">{stats.totalLumens} Lumens</span>
                          </div>
                          {stats.systemWarnings.map((w, i) => (
                            <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-red-500 mt-2">
                              <AlertTriangle size={10} /> {w}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                  Source from Amplios Hub <ChevronRight size={14} />
                </button>
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <Hammer size={14} /> AI Install Intelligence
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Manufacturer Guidance</p>
                <p className="text-[11px] leading-relaxed text-emerald-900 italic">
                  "Ensure all high-current connections are made with calibrated torque tools. {productData?.manufacturer} recommends 
                  a minimum 70mm² cable for this {productData?.name} installation."
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Step-by-Step Guide</h4>
                {[
                  { step: 1, title: 'Spatial Clearance', desc: 'Verify 50mm airflow gap around the chassis.' },
                  { step: 2, title: 'Mechanical Mounting', desc: 'Secure using M8 stainless steel bolts to the structural frame.' },
                  { step: 3, title: 'Technical Integration', desc: `Sync with Cerbo GX for ${productData?.isSmart ? 'Remote Management' : 'Basic Monitoring'}.` }
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 p-3 hover:bg-secondary/20 rounded-xl transition-colors border border-transparent hover:border-border">
                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold shrink-0">{s.step}</span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-tight">{s.title}</div>
                      <p className="text-[10px] text-muted-foreground leading-tight">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl border border-dashed border-border">
                 <p className="text-[9px] font-bold uppercase mb-2">Required Tooling</p>
                 <div className="flex flex-wrap gap-2">
                   {['Torque Wrench', 'Hydraulic Crimper', 'Multimeter', 'Drill Driver'].map(t => (
                     <span key={t} className="text-[8px] bg-white px-2 py-1 rounded border border-border font-bold uppercase">{t}</span>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-secondary/10">
        <button className="w-full flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
          <span>AI Build Verification</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  );
}
