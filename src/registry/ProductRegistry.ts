export interface ProductSpec {
  id: string;
  brand: string;
  model: string;
  category: 'electrical' | 'heating' | 'plumbing' | 'ac' | 'power-station' | 'exterior' | 'performance' | 'storage';
  dimensions: { width: number; height: number; depth: number };
  weight: number;
  cost: number;
  description: string;
  technicalSpecs: Record<string, string>;
  isSmart: boolean;
  tier: 'standard' | 'premium' | 'ultimate';
  upgradeFrom?: string;
}

export const PRODUCT_REGISTRY: ProductSpec[] = [
  // ELECTRICAL (VICTRON, FOGSTAR, ROAMER)
  {
    id: 'victron-multiplus-ii-3000',
    brand: 'Victron Energy',
    model: 'MultiPlus-II 12/3000',
    category: 'electrical',
    dimensions: { width: 277, height: 506, depth: 147 },
    weight: 18,
    cost: 1150,
    tier: 'ultimate',
    description: 'Professional grade power management.',
    technicalSpecs: { 'Power': '3000VA', 'Charge': '120A' },
    isSmart: true
  },
  
  // LIGHTING (LAZER & BAJA DESIGNS)
  {
    id: 'lazer-linear-48-elite',
    brand: 'Lazer Lamps',
    model: 'Linear-48 Elite',
    category: 'exterior',
    dimensions: { width: 1282, height: 40, depth: 62 },
    weight: 4.5,
    cost: 1200,
    tier: 'ultimate',
    description: 'The absolute pinnacle of LED light bar technology.',
    technicalSpecs: { 'Lumens': '18000', 'Range': '1500m' },
    isSmart: false
  },
  {
    id: 'baja-designs-lp6-pro',
    brand: 'Baja Designs',
    model: 'LP6 Pro LED',
    category: 'exterior',
    dimensions: { width: 165, height: 165, depth: 80 },
    weight: 2.2,
    cost: 500,
    tier: 'premium',
    description: 'Legendary off-road lighting with IPT (Integrated Peripheral Technology).',
    technicalSpecs: { 'Lumens': '10300', 'Watts': '90W' },
    isSmart: false
  },

  // PERFORMANCE & SUSPENSION (AGILE OFFROAD & VAN COMPASS)
  {
    id: 'agile-rip-kit',
    brand: 'Agile Offroad',
    model: 'RIP Kit (Ride Improvement Package)',
    category: 'performance',
    dimensions: { width: 300, height: 800, depth: 300 },
    weight: 40,
    cost: 2800,
    tier: 'ultimate',
    description: 'The most comprehensive suspension upgrade for Mercedes Sprinters.',
    technicalSpecs: { 'System': 'Custom Leaf + Shocks', 'Handling': 'Maximized' },
    isSmart: false
  },
  {
    id: 'van-compass-falcon-3-3',
    brand: 'Van Compass',
    model: 'Falcon 3.3 Fast Adjust Shocks',
    category: 'performance',
    dimensions: { width: 150, height: 600, depth: 150 },
    weight: 15,
    cost: 1800,
    tier: 'ultimate',
    description: 'Adjustable dampening for varying load and terrain conditions.',
    technicalSpecs: { 'Settings': '3 Positions', 'Mount': 'Bolt-on' },
    isSmart: false
  },

  // EXTERIOR ACCESSORIES (AGENCY 6, AMP, ROAM, BACKWOODS)
  {
    id: 'amp-powerstep-sprinter',
    brand: 'AMP Research',
    model: 'PowerStep Retractable',
    category: 'exterior',
    dimensions: { width: 2000, height: 100, depth: 250 },
    weight: 22,
    cost: 1250,
    tier: 'premium',
    description: 'Electric-powered running board that instantly extends when doors open.',
    technicalSpecs: { 'Capacity': '600 lbs', 'Lighting': 'Integrated LED' },
    isSmart: true
  },
  {
    id: 'roam-rugged-case-83l',
    brand: 'ROAM Adventure Co',
    model: '83L Rugged Case',
    category: 'storage',
    dimensions: { width: 1200, height: 150, depth: 450 },
    weight: 8,
    cost: 399,
    tier: 'premium',
    description: 'Heavy-duty storage for your roof rack or interior.',
    technicalSpecs: { 'Volume': '83L', 'Seals': 'Weatherproof' },
    isSmart: false
  },
  {
    id: 'agency-6-locker-box',
    brand: 'Agency 6',
    model: 'Exterior Locker Box',
    category: 'storage',
    dimensions: { width: 400, height: 500, depth: 300 },
    weight: 12,
    cost: 450,
    tier: 'premium',
    description: 'Precision-engineered external storage for tools and recovery gear.',
    technicalSpecs: { 'Material': 'Aluminum', 'Lock': 'Stainless T-Handle' },
    isSmart: false
  },

  // SPECIALIZED AC (CRUISE N COMFORT)
  {
    id: 'cruise-n-comfort-hd-rt',
    brand: 'Cruise N Comfort',
    model: 'HD R/T 12V DC AC',
    category: 'ac',
    dimensions: { width: 600, height: 300, depth: 500 },
    weight: 25,
    cost: 5200,
    tier: 'ultimate',
    description: 'The highest performance 12V AC on the market. Military grade.',
    technicalSpecs: { 'BTU': '10000+', 'Current': '45-65A' },
    isSmart: true
  },

  // PLUMBING (WHALE, GUZZLE)
  {
    id: 'whale-gp1002',
    brand: 'Whale',
    model: 'High Flow Submersible',
    category: 'plumbing',
    dimensions: { width: 36, height: 108, depth: 36 },
    weight: 0.15,
    cost: 45,
    tier: 'standard',
    description: 'Standard 12V water delivery.',
    technicalSpecs: { 'Flow': '15.8 L/min' },
    isSmart: false
  }
];
