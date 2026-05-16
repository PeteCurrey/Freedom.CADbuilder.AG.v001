export type VehicleModel = 
  | 'fiat-ducato' 
  | 'mercedes-sprinter' 
  | 'vw-crafter' 
  | 'ford-transit' 
  | 'renault-master';

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  wheelbase: number;
}

export interface VehicleConfig {
  id: string;
  model: VehicleModel;
  variant: string;
  dimensions: Dimensions;
  payload: number;
  kerbWeight: number;
}

export type ComponentCategory = 
  | 'bed' 
  | 'kitchen' 
  | 'seating' 
  | 'storage' 
  | 'plumbing' 
  | 'electrical'
  | 'heating'
  | 'ac'
  | 'power-station'
  | 'performance'
  | 'exterior'
  | 'hvac'
  | 'connectivity';

export interface BedMetadata {
  bedType: 'fixed' | 'slide-out' | 'happi-jac' | 'folding-bunk' | 'dinette-convert';
  mattressSize: 'single' | 'small-double' | 'double' | 'king' | 'super-king';
  isExtended: boolean;
  elevation: number;
  hasUnderBedGarage: boolean;
  extensionLength?: number;
}

export interface KitchenMetadata {
  layout: 'linear' | 'l-shape' | 'split';
  hobType: 'induction-single' | 'induction-dual' | 'gas-2-burner' | 'none';
  sinkType: 'stainless' | 'black-composite' | 'farmhouse';
  hasCoffeeStation: boolean;
  hasExtension: boolean;
  isExternalSlideout: boolean;
  fridgeType: 'drawer' | 'upright-compact' | 'none';
}

export interface VanComponent {
  id: string;
  type: string;
  category: ComponentCategory;
  productId?: string; 
  manufacturer?: string;
  brand?: string;
  tier?: 'standard' | 'premium' | 'ultimate';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  materialId?: string;
  metadata?: BedMetadata | KitchenMetadata | any;
  weight: number;
  cost: number;
}

export interface ProjectState {
  vehicle: VehicleConfig;
  components: VanComponent[];
  selectedComponentId: string | null;
  setVehicle: (vehicle: VehicleConfig) => void;
  addComponent: (component: VanComponent) => void;
  updateComponent: (id: string, updates: Partial<VanComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  
  // Analytics
  getWeightStats: () => {
    totalWeight: number;
    centerOfGravity: { x: number; z: number };
    isOverloaded: boolean;
    axleDistribution: { front: number; rear: number };
  };

  getElectricalStats: () => {
    totalCapacityWh: number;
    continuousDrawW: number;
    peakDrawW: number;
    offGridHours: number;
    systemWarnings: string[];
  };

  getPlumbingStats: () => {
    freshWaterL: number;
    greyWaterL: number;
    hasFiltration: boolean;
    pumpFlowRate: number; // L/min
    systemWarnings: string[];
  };

  getClimateStats: () => {
    heatingBTU: number;
    coolingBTU: number;
    fuelSource: ('diesel' | 'gas' | 'electric')[];
    hasHotWater: boolean;
    systemWarnings: string[];
  };

  getExteriorPerformanceStats: () => {
    totalSolarWatts: number;
    totalLumens: number;
    brakingPerformance: number; // 0-100
    offRoadCapability: number; // 0-100
    lengthImpactMm: number;
    systemWarnings: string[];
  };
}
