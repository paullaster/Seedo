export interface User {
  id: string;
  name: string;
  role: 'FARMER' | 'AGENT' | 'ADMIN';
  avatarUrl?: string;
  email?: string;
  phone?: string;
  password?: string; // For mock auth
  provider: 'google' | 'custom';
  isComplete?: boolean; // To check if multi-step registration is finished
}

export interface Farmer extends User {
  role: 'FARMER';
  nationalId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    placeId?: string;
  };
  farmSize?: number; // in acres
  produceType?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: User | Farmer;
  tokens: AuthTokens;
}

export interface FarmerRegistration {
  name: string;
  email: string;
  phone: string;
  nationalId?: string;
  password?: string;
  produceType?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  provider: 'google' | 'custom';
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

export function isFarmer(user: User | Farmer | Agent | null): user is Farmer {
  return user !== null && user.role === 'FARMER';
}
