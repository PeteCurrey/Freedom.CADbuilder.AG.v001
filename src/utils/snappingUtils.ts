import { VanComponent } from '@/types';

export const SNAP_DISTANCE = 100; // 10cm snapping threshold

export interface SnapZone {
  id: string;
  type: 'roof' | 'rear' | 'side' | 'floor';
  y: number;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export const getSnappingLogic = (
  component: VanComponent, 
  rawPosition: { x: number; y: number; z: number },
  vehicleDimensions: { width: number; height: number; length: number },
  existingComponents: VanComponent[] = []
) => {
  let snappedPosition = { ...rawPosition };

  // 1. ROOF & FLOOR SNAPPING
  const roofHeight = vehicleDimensions.height;
  if (Math.abs(rawPosition.y - roofHeight) < SNAP_DISTANCE) {
    snappedPosition.y = roofHeight;
  } else if (Math.abs(rawPosition.y - 0) < SNAP_DISTANCE) {
    snappedPosition.y = 0;
  }

  // 2. WALL/SIDE SNAPPING (Interior accounts for ~50mm insulation/lining)
  const liningThickness = 50;
  const halfWidth = (vehicleDimensions.width / 2) - liningThickness;
  if (Math.abs(Math.abs(rawPosition.x) - halfWidth) < SNAP_DISTANCE) {
    snappedPosition.x = rawPosition.x > 0 ? halfWidth - (component.dimensions.width / 2) : -halfWidth + (component.dimensions.width / 2);
  }

  // 3. REAR/FRONT BOUNDARY
  const halfLength = (vehicleDimensions.length / 2) - liningThickness;
  if (Math.abs(rawPosition.z - halfLength) < SNAP_DISTANCE) {
    snappedPosition.z = halfLength - (component.dimensions.depth / 2);
  }

  // 4. COMPONENT-TO-COMPONENT SNAPPING (Cabinetry Chain)
  existingComponents.forEach(other => {
    if (other.id === component.id) return;

    // Side-to-side snapping (X-axis)
    const distanceX = Math.abs(rawPosition.x - (other.position.x + other.dimensions.width / 2 + component.dimensions.width / 2));
    if (distanceX < SNAP_DISTANCE) {
      snappedPosition.x = other.position.x + other.dimensions.width / 2 + component.dimensions.width / 2;
    }
    
    // Front-to-back snapping (Z-axis)
    const distanceZ = Math.abs(rawPosition.z - (other.position.z + other.dimensions.depth / 2 + component.dimensions.depth / 2));
    if (distanceZ < SNAP_DISTANCE) {
      snappedPosition.z = other.position.z + other.dimensions.depth / 2 + component.dimensions.depth / 2;
    }
  });

  return snappedPosition;
};
