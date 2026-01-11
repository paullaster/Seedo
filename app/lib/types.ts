export interface User {
  id: string;
  name: string;
  role: 'FARMER' | 'AGENT' | 'ADMIN';
  avatarUrl?: string;
  email?: string;
  phone?: string;
}

export interface Farmer extends User {
  role: 'FARMER';
  nationalId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  farmSize?: number; // in acres
  produceType?: string[];
}

export interface Agent extends User {
  role: 'AGENT';
  region: string;
  active: boolean;
  totalCollections: number;
  rating: number;
}

export interface ProduceCollection {
  id: string;
  farmerId: string;
  agentId: string;
  produceType: string;
  grade: 'A' | 'B' | 'C';
  weightKg: number;
  pricePerKg: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'PARTIAL';
  timestamp: string;
  imageUrl?: string; // For Visual Weight Verification
  location: {
    lat: number;
    lng: number;
  };
}

export interface HarvestNotice {
  id: string;
  farmerId: string;
  produceType: string;
  estimatedWeightKg: number;
  readyDate: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'COLLECTED';
}

export interface MarketRate {
  id: string;
  produceType: string;
  pricePerKg: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  lastUpdated: string;
}

export interface WeatherData {
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
  humidity: number;
  forecast: string;
}
