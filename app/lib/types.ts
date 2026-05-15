export interface User {
  id: string;
  name: string;
  role: 'FARMER' | 'AGENT' | 'ADMIN';
  avatarUrl?: string;
  email: string;
  phone: string;
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

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface FarmerProfile extends Farmer {
  verificationStatus: {
    nationalId: VerificationStatus;
    phone: VerificationStatus;
    email: VerificationStatus;
  };
  farmName?: string;
  completionPercentage: number;
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
  nationalId: string;
  password?: string;
  produceType?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  provider: 'google' | 'custom';
  authProvider?: string;
}

export type AgentType = 'STORE' | 'COLLECTION';

export interface Agent extends User {
  role: 'AGENT';
  agentType: AgentType;
  region: string;
  active: boolean;
  totalCollections: number;
  rating: number;
  storeId?: string;
  isVetted?: boolean;
  isVerified?: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  acceptedProduce?: string[];
  nationalId?: string;
}

export interface AgentProfile extends Agent {
  verificationStatus: {
    email: VerificationStatus;
    phone: VerificationStatus;
  };
  commissionEarned: number;
  tier: 1 | 2 | 3;
}

export type CollectionStatus = 'PENDING' | 'VERIFIED' | 'IN_TRANSIT' | 'PICKED_UP' | 'DISPUTED' | 'PAID' | 'PARTIAL';

export interface ProduceCollection {
  id: string;
  farmerId: string;
  agentId: string; // Store Agent ID
  collectionAgentId?: string; // Verifying Agent ID
  produceType: string;
  grade: 'A' | 'B' | 'C';
  weightKg: number;
  pricePerKg: number;
  totalAmount: number;
  status: CollectionStatus;
  timestamp: string;
  verifiedAt?: string;
  imageUrl?: string; // For Visual Weight Verification (Mandatory photo)
  location: {
    lat: number;
    lng: number;
  };
  disputeReason?: string;
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
  category?: string;
  estimatedRequireQuantity?: number;
  lastUpdated: string;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface WeatherData {
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
  humidity: number;
  forecast: string;
}

export interface PayoutRequest {
  id: string;
  agentId: string;
  amount: number;
  collectionIds: string[];
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  timestamp: string;
  processedAt?: string;
}

// --- Marketplace & Loans ---

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}

export interface Order {
  id: string;
  farmerId: string;
  items: {
    productId: string;
    quantity: number;
    priceAtTime: number;
  }[];
  totalAmount: number;
  paymentMode: 'CASH' | 'LOAN';
  status: 'PENDING' | 'PROCESSED' | 'READY_FOR_PICKUP' | 'DELIVERED' | 'CANCELLED';
  timestamp: string;
}

export interface Loan {
  id: string;
  farmerId: string;
  orderId: string;
  principalAmount: number;
  remainingBalance: number;
  status: 'PENDING' | 'ACTIVE' | 'PAID' | 'REJECTED';
  timestamp: string;
  expectedRecoveryDate?: string;
  recoveryHistory: {
    collectionId: string;
    amountRecovered: number;
    timestamp: string;
  }[];
}

// --- Audit & Wastage ---

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  targetId: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
}

export interface WastageRecord {
  storeId: string;
  produceType: string;
  intakeWeight: number;
  warehouseWeight: number;
  shrinkagePercentage: number;
  timestamp: string;
}

export interface ActivationUserInfo {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  userId: string;
}

export interface Permission {
  id: string;
  key: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  value?: string;
  permissions: Permission;
  created_at: string;
}

export function isFarmer(user: User | Farmer | Agent | null): user is Farmer {
  return user !== null && user.role === 'FARMER';
}
