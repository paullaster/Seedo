import { Farmer, Agent, ProduceCollection, HarvestNotice, MarketRate, WeatherData } from './types';

export const MOCK_FARMERS: Farmer[] = [
  {
    id: 'F001',
    name: 'Elias Mwaura',
    role: 'FARMER',
    email: 'elias.m@seedo.ag',
    phone: '+254 712 345 678',
    nationalId: 'ID-22998877',
    location: { lat: -1.2921, lng: 36.8219, address: 'Kiambu Zone A' },
    farmSize: 5.5,
    produceType: ['Maize', 'Beans'],
  },
  {
    id: 'F002',
    name: 'Sarah Chebet',
    role: 'FARMER',
    email: 'sarah.c@seedo.ag',
    phone: '+254 722 112 233',
    nationalId: 'ID-33445566',
    location: { lat: -0.5143, lng: 35.2698, address: 'Eldoret North' },
    farmSize: 12.0,
    produceType: ['Wheat', 'Maize'],
  },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'A001',
    name: 'Kevin Omondi',
    role: 'AGENT',
    email: 'kevin.o@seedo.ag',
    phone: '+254 733 998 877',
    region: 'Central Rift',
    active: true,
    totalCollections: 1450,
    rating: 4.8,
  },
  {
    id: 'A002',
    name: 'Lucy Wanjiku',
    role: 'AGENT',
    email: 'lucy.w@seedo.ag',
    phone: '+254 799 554 433',
    region: 'Nairobi Metro',
    active: true,
    totalCollections: 890,
    rating: 4.5,
  },
];

export const MOCK_COLLECTIONS: ProduceCollection[] = [
  {
    id: 'COL-1001',
    farmerId: 'F001',
    agentId: 'A001',
    produceType: 'Maize',
    grade: 'A',
    weightKg: 500,
    pricePerKg: 45,
    totalAmount: 22500,
    status: 'PENDING',
    timestamp: '2025-10-15T08:30:00Z',
    location: { lat: -1.2921, lng: 36.8219 },
  },
  {
    id: 'COL-1002',
    farmerId: 'F002',
    agentId: 'A001',
    produceType: 'Wheat',
    grade: 'B',
    weightKg: 1200,
    pricePerKg: 55,
    totalAmount: 66000,
    status: 'PAID',
    timestamp: '2025-10-14T14:15:00Z',
    location: { lat: -0.5143, lng: 35.2698 },
  },
  {
    id: 'COL-1003',
    farmerId: 'F001',
    agentId: 'A002',
    produceType: 'Beans',
    grade: 'A',
    weightKg: 200,
    pricePerKg: 110,
    totalAmount: 22000,
    status: 'PARTIAL',
    timestamp: '2025-10-16T09:45:00Z',
    location: { lat: -1.2921, lng: 36.8219 },
  },
];

export const MOCK_HARVEST_NOTICES: HarvestNotice[] = [
  {
    id: 'HN-5001',
    farmerId: 'F001',
    produceType: 'Maize',
    estimatedWeightKg: 2000,
    readyDate: '2025-11-01',
    status: 'OPEN',
  },
];

export const MOCK_MARKET_RATES: MarketRate[] = [
  {
    id: 'MR-01',
    produceType: 'Maize',
    pricePerKg: 45.50,
    trend: 'UP',
    lastUpdated: '2025-10-16T08:00:00Z',
  },
  {
    id: 'MR-02',
    produceType: 'Wheat',
    pricePerKg: 54.00,
    trend: 'DOWN',
    lastUpdated: '2025-10-16T08:00:00Z',
  },
  {
    id: 'MR-03',
    produceType: 'Beans',
    pricePerKg: 112.00,
    trend: 'STABLE',
    lastUpdated: '2025-10-16T08:00:00Z',
  },
];

export const MOCK_WEATHER: WeatherData = {
  temp: 24,
  condition: 'Cloudy',
  humidity: 65,
  forecast: 'Rain expected in 2 days',
};
