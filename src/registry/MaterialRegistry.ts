export interface MaterialSpec {
  id: string;
  name: string;
  category: 'wood' | 'laminate' | 'fabric' | 'metal' | 'stone';
  color: string;
  roughness: number;
  metalness: number;
  costPerM2: number;
  description: string;
}

export const MATERIAL_REGISTRY: MaterialSpec[] = [
  // WOODS
  {
    id: 'oak-natural',
    name: 'Natural Oak',
    category: 'wood',
    color: '#d4a373',
    roughness: 0.8,
    metalness: 0,
    costPerM2: 85,
    description: 'Classic hardwood with a warm, organic grain.'
  },
  {
    id: 'walnut-dark',
    name: 'Dark Walnut',
    category: 'wood',
    color: '#582f0e',
    roughness: 0.6,
    metalness: 0,
    costPerM2: 120,
    description: 'Premium dark wood for a sophisticated, high-end feel.'
  },
  {
    id: 'birch-ply',
    name: 'Birch Plywood',
    category: 'wood',
    color: '#e9edc9',
    roughness: 0.9,
    metalness: 0,
    costPerM2: 45,
    description: 'The industry standard for durable, lightweight van builds.'
  },

  // LAMINATES (Fenix, etc)
  {
    id: 'fenix-nero',
    name: 'Fenix Nero Ingo',
    category: 'laminate',
    color: '#1a1a1a',
    roughness: 0.95,
    metalness: 0,
    costPerM2: 110,
    description: 'Nano-tech matte material. Anti-fingerprint and highly durable.'
  },
  {
    id: 'fenix-bianco',
    name: 'Fenix Bianco Kos',
    category: 'laminate',
    color: '#f8fafc',
    roughness: 0.95,
    metalness: 0,
    costPerM2: 110,
    description: 'Crisp, ultra-matte white surface.'
  },

  // METALS
  {
    id: 'brushed-aluminum',
    name: 'Brushed Aluminum',
    category: 'metal',
    color: '#94a3b8',
    roughness: 0.3,
    metalness: 0.9,
    costPerM2: 60,
    description: 'Industrial aesthetic, perfect for trim and technical areas.'
  },
  {
    id: 'copper-raw',
    name: 'Raw Copper',
    category: 'metal',
    color: '#b1562e',
    roughness: 0.4,
    metalness: 0.8,
    costPerM2: 150,
    description: 'Bold, distinctive finish that develops a patina over time.'
  },

  // FABRICS
  {
    id: 'tweed-grey',
    name: 'Herringbone Tweed',
    category: 'fabric',
    color: '#475569',
    roughness: 1,
    metalness: 0,
    costPerM2: 55,
    description: 'Durable, textured fabric for upholstery and wall panels.'
  }
];

export const getMaterialById = (id: string) => MATERIAL_REGISTRY.find(m => m.id === id);
