import { create } from 'zustand';
import { ProjectState, VehicleConfig, VanComponent } from '@/types';
import { getSnappingLogic } from '@/utils/snappingUtils';
import { PRODUCT_REGISTRY } from '@/data/products';

const defaultVehicle: VehicleConfig = {
  id: 'v1',
  model: 'mercedes-sprinter',
  variant: 'L2H2',
  dimensions: {
    length: 5932,
    width: 2020,
    height: 2620,
    wheelbase: 3665
  },
  payload: 1200,
  kerbWeight: 2300
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  vehicle: defaultVehicle,
  components: [
    {
      id: 'bed-1',
      type: 'Fixed Double Bed',
      category: 'bed',
      position: { x: -1500, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 1900, height: 900, depth: 1400 },
      metadata: {
        bedType: 'happi-jac',
        mattressSize: 'double',
        elevation: 1200,
        isExtended: false,
        hasUnderBedGarage: true
      },
      weight: 45,
      cost: 850
    },
    {
      id: 'kitchen-1',
      type: 'Linear Galley',
      category: 'kitchen',
      position: { x: 500, y: 0, z: 600 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 1200, height: 900, depth: 600 },
      weight: 35,
      cost: 1200
    }
  ],
  selectedComponentId: null,

  setVehicle: (vehicle) => set({ vehicle }),

  addComponent: (component) => set((state) => ({
    components: [...state.components, component],
    selectedComponentId: component.id
  })),

  updateComponent: (id, updates) => set((state) => {
    const component = state.components.find(c => c.id === id);
    if (!component) return state;

    let finalUpdates = { ...updates };
    
    // Apply Snapping if position is being updated
    if (updates.position) {
      finalUpdates.position = getSnappingLogic(
        component, 
        updates.position as any, 
        state.vehicle.dimensions,
        state.components
      );
    }

    return {
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...finalUpdates } : c
      ),
    };
  }),

  removeComponent: (id) => set((state) => ({
    components: state.components.filter((c) => c.id !== id),
    selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId
  })),

  selectComponent: (id) => set({ selectedComponentId: id }),

  getWeightStats: () => {
    const { components, vehicle } = get();
    const totalAddedWeight = components.reduce((sum, c) => sum + c.weight, 0);
    const totalWeight = vehicle.kerbWeight + totalAddedWeight;
    
    // CoG Calculation (Simplified relative to wheelbase)
    // Kerb weight CoG is roughly 45% from front
    let totalMomentsX = 0;
    let totalMomentsZ = 0;
    
    components.forEach(c => {
      totalMomentsX += c.weight * c.position.x;
      totalMomentsZ += c.weight * c.position.z;
    });

    const cogX = totalMomentsX / (totalAddedWeight || 1);
    const cogZ = totalMomentsZ / (totalAddedWeight || 1);

    // Axle Load Estimate
    // Percentage of weight on rear axle increases as CoG moves back
    const wheelbase = vehicle.dimensions.wheelbase;
    const rearBias = (cogZ + (wheelbase/2)) / wheelbase;
    const rearLoad = totalWeight * Math.max(0.4, Math.min(0.8, rearBias));
    const frontLoad = totalWeight - rearLoad;

    return {
      totalWeight,
      centerOfGravity: { x: cogX, z: cogZ },
      isOverloaded: totalWeight > vehicle.payload,
      axleDistribution: { front: frontLoad, rear: rearLoad }
    };
  },

  getElectricalStats: () => {
    const { components } = get();
    let totalCapacityWh = 0;
    let continuousDrawW = 0;
    let peakDrawW = 0;
    let inverterCapacityW = 0;
    const systemWarnings: string[] = [];

    components.forEach(c => {
      const product = PRODUCT_REGISTRY.find(p => p.id === c.productId);
      if (!product) return;

      // Battery Capacity
      if (product.subcategory === 'battery') {
        const capString = product.technicalSpecs?.['Capacity'] || '0Wh';
        totalCapacityWh += parseInt(capString);
      }

      // Continuous & Peak Draw
      if (product.electricalDraw) {
        continuousDrawW += product.electricalDraw.idle;
        peakDrawW += product.electricalDraw.max;
      }

      // Inverter Capacity
      if (product.plannerBehaviour === 'inverter') {
        inverterCapacityW = product.electricalDraw?.max || 0;
      }
    });

    // Validations
    if (peakDrawW > inverterCapacityW && inverterCapacityW > 0) {
      systemWarnings.push(`Peak load (${peakDrawW}W) exceeds inverter capacity (${inverterCapacityW}W)`);
    }
    if (totalCapacityWh === 0 && continuousDrawW > 0) {
      systemWarnings.push('No battery storage detected for electrical load');
    }

    const offGridHours = continuousDrawW > 0 ? (totalCapacityWh / continuousDrawW) : 999;

    return {
      totalCapacityWh,
      continuousDrawW,
      peakDrawW,
      offGridHours,
      systemWarnings
    };
  },

  getPlumbingStats: () => {
    const { components } = get();
    let freshWaterL = 0;
    let greyWaterL = 0;
    let hasFiltration = false;
    let pumpFlowRate = 0;
    const systemWarnings: string[] = [];

    components.forEach(c => {
      const product = PRODUCT_REGISTRY.find(p => p.id === c.productId);
      if (!product) return;

      if (product.subcategory === 'tank') {
        if (product.name.toLowerCase().includes('fresh')) freshWaterL += parseInt(product.technicalSpecs?.['Volume'] || '0');
        if (product.name.toLowerCase().includes('grey')) greyWaterL += parseInt(product.technicalSpecs?.['Volume'] || '0');
      }

      if (product.subcategory === 'filtration') hasFiltration = true;
      if (product.subcategory === 'pump') pumpFlowRate = Math.max(pumpFlowRate, parseFloat(product.technicalSpecs?.['Flow Rate'] || '0'));
    });

    if (freshWaterL > 0 && pumpFlowRate === 0) systemWarnings.push('Fresh water tanks detected without a pump.');
    if (pumpFlowRate > 0 && freshWaterL === 0) systemWarnings.push('Pump detected without fresh water storage.');

    return { freshWaterL, greyWaterL, hasFiltration, pumpFlowRate, systemWarnings };
  },

  getClimateStats: () => {
    const { components } = get();
    let heatingBTU = 0;
    let coolingBTU = 0;
    const fuelSource: any[] = [];
    let hasHotWater = false;
    const systemWarnings: string[] = [];

    components.forEach(c => {
      const product = PRODUCT_REGISTRY.find(p => p.id === c.productId);
      if (!product) return;

      if (product.category === 'hvac') {
        if (product.subcategory === 'heating') {
          heatingBTU += parseInt(product.technicalSpecs?.['Heating Capacity'] || '0');
          const fuel = product.technicalSpecs?.['Fuel Source'];
          if (fuel && !fuelSource.includes(fuel.toLowerCase())) fuelSource.push(fuel.toLowerCase());
        }
        if (product.subcategory === 'cooling') {
          coolingBTU += parseInt(product.technicalSpecs?.['Cooling Capacity'] || '0');
        }
        if (product.name.toLowerCase().includes('combi') || product.name.toLowerCase().includes('boiler')) hasHotWater = true;
      }
    });

    if (heatingBTU > 0 && heatingBTU < 5000) systemWarnings.push('Low heating capacity for vehicle volume.');
    if (coolingBTU > 0 && coolingBTU < 5000) systemWarnings.push('Low cooling capacity for vehicle volume.');

    return { heatingBTU, coolingBTU, fuelSource, hasHotWater, systemWarnings };
  },

  getExteriorPerformanceStats: () => {
    const { components } = get();
    let totalSolarWatts = 0;
    let totalLumens = 0;
    let brakingPerformance = 0;
    let offRoadCapability = 0;
    let lengthImpactMm = 0;
    const systemWarnings: string[] = [];

    components.forEach(c => {
      const product = PRODUCT_REGISTRY.find(p => p.id === c.productId);
      if (!product) return;

      // Solar Harvesting
      if (product.subcategory === 'solar') {
        totalSolarWatts += parseInt(product.technicalSpecs?.['Solar Watts'] || '0');
      }

      // Lighting Intensity
      if (product.subcategory === 'lighting') {
        totalLumens += parseInt(product.technicalSpecs?.['Lumens'] || '0');
      }

      // Performance Upgrades
      if (product.subcategory === 'brakes') {
        brakingPerformance = Math.max(brakingPerformance, parseInt(product.technicalSpecs?.['Braking Improvement'] || '0'));
      }
      if (product.subcategory === 'wheels' || product.subcategory === 'suspension') {
        offRoadCapability = Math.max(offRoadCapability, parseInt(product.technicalSpecs?.['Off-Road Rating'] || '0'));
      }

      // Physical Impact
      if (product.name.toLowerCase().includes('bumper')) {
        lengthImpactMm += 250; // Average bumper extension
      }
    });

    if (totalLumens > 15000) systemWarnings.push('Extreme lighting output detected. Use only for off-road environments.');
    if (lengthImpactMm > 0) systemWarnings.push(`Vehicle total length increased by ${lengthImpactMm}mm due to exterior armor.`);

    return {
      totalSolarWatts,
      totalLumens,
      brakingPerformance,
      offRoadCapability,
      lengthImpactMm,
      systemWarnings
    };
  },
}));
