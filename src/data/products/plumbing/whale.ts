import { VanProduct } from '@/types/products';

export const PLUMBING_PRODUCTS: VanProduct[] = [
  {
    id: 'whale-expans-8l',
    manufacturer: 'Whale',
    category: 'plumbing',
    subcategory: 'pump',
    name: 'Whale Expanse 8L High Flow',
    shortDescription: 'Self-priming water pump with steady flow.',
    dimensions: { width: 120, height: 110, depth: 210 },
    weight: 1.5,
    costEstimate: 145,
    technicalSpecs: { 'Flow Rate': '12 L/min', 'Voltage': '12V' },
    compatibleVehicles: ['all'],
    installComplexity: 'moderate',
    tags: ['water', 'essential'],
    defaultPlacementZones: ['interior'],
    plannerBehaviour: 'fixed',
    bomCategory: 'Plumbing Systems',
    isSmart: false,
    tier: 'premium'
  },
  {
    id: 'guzzle-h2o-stealth',
    manufacturer: 'Guzzle H2O',
    category: 'plumbing',
    subcategory: 'filtration',
    name: 'Stealth UV Water Purifier',
    shortDescription: 'LED UV-C water purification system.',
    dimensions: { width: 150, height: 100, depth: 80 },
    weight: 1.2,
    costEstimate: 550,
    technicalSpecs: { 'Flow': '2 GPM', 'Purification': '99.99%' },
    compatibleVehicles: ['all'],
    installComplexity: 'moderate',
    tags: ['uv-filter', 'off-grid'],
    defaultPlacementZones: ['interior'],
    plannerBehaviour: 'fixed',
    bomCategory: 'Water Filtration',
    isSmart: true,
    tier: 'ultimate'
  }
];
