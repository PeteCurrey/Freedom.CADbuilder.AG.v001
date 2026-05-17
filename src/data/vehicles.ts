import { VehicleConfig } from '@/types';

export const VEHICLE_REGISTRY: VehicleConfig[] = [
  {
    id: 'sprinter-mwb',
    model: 'mercedes-sprinter',
    variant: 'MWB High Roof (L2H2)',
    dimensions: {
      length: 5932,
      width: 2020,
      height: 2620,
      wheelbase: 3665
    },
    payload: 1350,
    kerbWeight: 2150
  },
  {
    id: 'sprinter-lwb',
    model: 'mercedes-sprinter',
    variant: 'LWB High Roof (L3H2)',
    dimensions: {
      length: 6967,
      width: 2020,
      height: 2620,
      wheelbase: 4325
    },
    payload: 1200,
    kerbWeight: 2300
  },
  {
    id: 'transit-mwb',
    model: 'ford-transit',
    variant: 'MWB Medium Roof (L2H2)',
    dimensions: {
      length: 5531,
      width: 2059,
      height: 2490,
      wheelbase: 3300
    },
    payload: 1420,
    kerbWeight: 2080
  },
  {
    id: 'transit-lwb',
    model: 'ford-transit',
    variant: 'LWB High Roof (L3H3)',
    dimensions: {
      length: 5981,
      width: 2059,
      height: 2786,
      wheelbase: 3750
    },
    payload: 1250,
    kerbWeight: 2250
  },
  {
    id: 'ducato-mwb',
    model: 'fiat-ducato',
    variant: 'MWB High Roof (L2H2)',
    dimensions: {
      length: 5413,
      width: 2050,
      height: 2522,
      wheelbase: 3450
    },
    payload: 1550,
    kerbWeight: 1950
  },
  {
    id: 'ducato-lwb',
    model: 'fiat-ducato',
    variant: 'LWB High Roof (L3H2)',
    dimensions: {
      length: 5998,
      width: 2050,
      height: 2522,
      wheelbase: 4035
    },
    payload: 1400,
    kerbWeight: 2100
  },
  {
    id: 'crafter-mwb',
    model: 'vw-crafter',
    variant: 'MWB High Roof (L3H3)',
    dimensions: {
      length: 5986,
      width: 2040,
      height: 2590,
      wheelbase: 3640
    },
    payload: 1300,
    kerbWeight: 2200
  },
  {
    id: 'crafter-lwb',
    model: 'vw-crafter',
    variant: 'LWB High Roof (L4H3)',
    dimensions: {
      length: 6836,
      width: 2040,
      height: 2590,
      wheelbase: 4490
    },
    payload: 1150,
    kerbWeight: 2350
  },
  {
    id: 'master-mwb',
    model: 'renault-master',
    variant: 'MWB High Roof (L2H2)',
    dimensions: {
      length: 5548,
      width: 2070,
      height: 2499,
      wheelbase: 3682
    },
    payload: 1450,
    kerbWeight: 2050
  }
];
