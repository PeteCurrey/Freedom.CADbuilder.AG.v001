import { ELECTRICAL_PRODUCTS } from './electrical/victron';
import { EXTERIOR_PRODUCTS } from './exterior/agile_owl';
import { HVAC_PRODUCTS } from './hvac/dometic_webasto';
import { PLUMBING_PRODUCTS } from './plumbing/whale';
import { PERFORMANCE_PRODUCTS } from './performance/alcon_method';
import { VanProduct } from '@/types/products';

export const PRODUCT_REGISTRY: VanProduct[] = [
  ...ELECTRICAL_PRODUCTS,
  ...EXTERIOR_PRODUCTS,
  ...HVAC_PRODUCTS,
  ...PLUMBING_PRODUCTS,
  ...PERFORMANCE_PRODUCTS
];

export const getProductById = (id: string) => PRODUCT_REGISTRY.find(p => p.id === id);

export const getProductsByCategory = (category: string) => 
  PRODUCT_REGISTRY.filter(p => p.category === category);

export const getProductsByManufacturer = (manufacturer: string) => 
  PRODUCT_REGISTRY.filter(p => p.manufacturer === manufacturer);
