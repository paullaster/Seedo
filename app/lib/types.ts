export interface User {
  id: string;
  role: 'FARMER' | 'AGENT' | 'ADMIN' | 'SUPER_ADMIN';
  avatarUrl?: string;
  email: string;
  password?: string;
  auth_provider: 'google' | 'custom';
  isComplete?: boolean;
  first_name?: string;
  last_name?: string;
  national_id?: string;
  phone_number: string;
  username?: string;
  name?: string;
  provider?: string;
  accessToken?: string;
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
  oldValue?: never;
  newValue?: never;
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

// --- Warehouse & Pickup Workflow ---

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location?: string;
  managed_by?: string;
  is_active: boolean;
  users?: { id: string; first_name: string; last_name: string };
  bins?: Bin[];
  created_at: string;
}

export interface Bin {
  id: string;
  warehouse_id: string;
  code: string;
  name: string;
  max_capacity?: number;
  is_active: boolean;
  sub_bins?: SubBin[];
}

export interface SubBin {
  id: string;
  bin_id: string;
  code: string;
  name: string;
  max_capacity?: number;
  is_active: boolean;
}

export interface PickupRequest {
  id: string;
  request_number: string;
  collection_id: string;
  store_agent_id: string;
  approved_by?: string;
  approved_at?: string;
  assigned_to?: string;
  assigned_at?: string;
  status: string;
  notes?: string;
  collection?: any;
  store_agent?: { id: string; first_name: string; last_name: string };
  approving_admin?: { id: string; first_name: string; last_name: string };
  assigned_agent?: { id: string; first_name: string; last_name: string };
  audit_logs?: PickupRequestAuditLog[];
  transfers?: PickupRequestTransfer[];
  created_at: string;
}

export interface PickupRequestAuditLog {
  id: string;
  pickup_request_id: string;
  action: string;
  from_status: string;
  to_status: string;
  actor_id: string;
  actor?: { id: string; first_name: string; last_name: string };
  from_agent_id?: string;
  to_agent_id?: string;
  notes?: string;
  timestamp: string;
}

export interface PickupRequestTransfer {
  id: string;
  pickup_request_id: string;
  from_agent_id: string;
  to_agent_id: string;
  status: string;
  admin_approved_by?: string;
  admin_approved_at?: string;
  notes?: string;
  from_agent?: { id: string; first_name: string; last_name: string };
  to_agent?: { id: string; first_name: string; last_name: string };
  created_at: string;
}

export interface Batch {
  id: string;
  batch_number: string;
  produce_id: string;
  warehouse_id: string;
  bin_id?: string;
  sub_bin_id?: string;
  quantity: number;
  received_date: string;
  expiry_date?: string;
  source: string;
  reference_id?: string;
  notes?: string;
  produce?: any;
  warehouse?: Warehouse;
  bin?: Bin;
  sub_bin?: SubBin;
  created_at: string;
}

export interface DeliveryNoteHeader {
  id: string;
  delivery_note_number: string;
  pickup_request_id: string;
  warehouse_id: string;
  received_by: string;
  delivery_date: string;
  notes?: string;
  status: string;
  pickup_request?: PickupRequest;
  warehouse?: Warehouse;
  lines?: DeliveryNoteLine[];
  created_at: string;
}

export interface DeliveryNoteLine {
  id: string;
  delivery_note_id: string;
  produce_id: string;
  quantity_received: number;
  batch_id: string;
  bin_id: string;
  sub_bin_id?: string;
  notes?: string;
  produce?: any;
  batch?: Batch;
  bin?: Bin;
  sub_bin?: SubBin;
}

export interface NumberSeriesSegment {
  type: 'prefix' | 'separator' | 'date' | 'counter';
  value?: string;
  date_part?: 'yyyy' | 'yy' | 'mm' | 'dd' | 'ww';
  width?: number;
  step?: number;
  mode?: 'auto' | 'manual';
  reset_on_period_flip?: boolean;
  period_start_number?: number;
}

export interface NumberSeriesConfig {
  id: string;
  entity_type: string;
  entity_id: string | null;
  name: string;
  description: string | null;
  segments: NumberSeriesSegment[];
  starting_number: number;
  last_sequence_value: number | null;
  current_period_key: string | null;
  is_active: boolean;
  created_at: string;
}

export interface NumberableEntity {
  entityType: string;
  className: string;
}

export interface NumberSeriesHistoryItem {
  id: string;
  config_id: string;
  number_generated: string;
  sequence_value: number;
  period_key: string | null;
  generated_by: string;
  entity_type: string;
  entity_id: string | null;
  notes: string | null;
  created_at: string;
}