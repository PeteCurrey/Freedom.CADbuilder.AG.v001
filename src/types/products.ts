export type ProductTier = 'standard' | 'premium' | 'ultimate';
export type InstallComplexity = 'basic' | 'moderate' | 'professional' | 'expert';

export interface VanProduct {
  id: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  dimensions: { width: number; height: number; depth: number };
  weight: number;
  costEstimate: number;
  images?: string[];
  technicalSpecs?: Record<string, string | number>;
  
  // Technical Logic
  mountingRequirements?: string[];
  compatibleVehicles: string[]; // 'sprinter-144', 'transit-extended', etc.
  electricalDraw?: { idle: number; max: number; unit: 'W' | 'A' };
  systemRequirements?: string[]; // e.g., ['requires-3000w-inverter']
  installComplexity: InstallComplexity;
  tags: string[];
  
  // Customization
  finishOptions?: string[];
  materialOptions?: string[];
  
  // Planner Metadata
  defaultPlacementZones: ('roof' | 'interior' | 'exterior-rear' | 'exterior-side' | 'undermount')[];
  plannerBehaviour: 'fixed' | 'vent' | 'battery' | 'inverter' | 'rack' | 'lightbar';
  bomCategory: string;
  
  // Future Placeholders
  skuPlaceholder?: string;
  affiliatePlaceholder?: string;
  storePlaceholder?: string;
  
  // AI/Logic
  isSmart: boolean;
  tier: ProductTier;
  upgradeFrom?: string; // id of standard product
}
