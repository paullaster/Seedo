import { User, Farmer, FarmerRegistration, AuthResponse, AuthTokens, ProduceCollection } from './types';
import { MOCK_COLLECTIONS } from './mock-data';

const SIMULATED_DELAY = 800;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper to call the mock state API
async function callMockDB(action: string, data: any) {
  // Use absolute URL for server-side calls, relative for client
  const baseUrl = typeof window === 'undefined' ? 'http://localhost:3000' : '';
  const res = await fetch(`${baseUrl}/api/mock/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  });
  return res.json();
}

export const apiService = {
  // --- OTP Service ---
  async sendOTP(identity: string): Promise<{ success: boolean; message: string }> {
    const res = await callMockDB('sendOTP', { identity });
    console.log(`[CLIENT API] OTP Sent: ${res.code}`); // Log for dev visibility
    return { success: true, message: 'OTP sent successfully' };
  },

  async verifyOTP(identity: string, code: string): Promise<boolean> {
    const res = await callMockDB('verifyOTP', { identity, code });
    return res.valid;
  },

  async getUser(identity: string): Promise<User | null> {
    // Try to find by email or phone
    const res = await callMockDB('getUser', { email: identity, phone: identity });
    return res.user;
  },

  // --- Auth Actions ---
  async login(identity: string, password?: string, provider: 'google' | 'custom' = 'custom'): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    
    // Check if user exists in Mock DB
    const existingUser = await apiService.getUser(identity);

    const tokens: AuthTokens = {
      accessToken: `at_${Math.random().toString(36).substr(2)}`,
      refreshToken: `rt_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
    };

    if (existingUser) {
      return { user: existingUser, tokens };
    }

    // Fallback for new Google users (or if custom user not found but we want to simulate partial flow)
    const user: User = {
      id: `U${Math.random().toString(36).substr(2, 5)}`,
      name: provider === 'google' ? 'Google User' : identity.split('@')[0],
      email: identity.includes('@') ? identity : 'google_user@example.com',
      phone: !identity.includes('@') ? identity : '+254700000000',
      role: 'FARMER',
      provider,
      isComplete: provider === 'custom' // Google users might need to complete profile
    };

    return { user, tokens };
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    
    const tokens: AuthTokens = {
      accessToken: `at_refreshed_${Math.random().toString(36).substr(2)}`,
      refreshToken: `rt_refreshed_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + 15 * 60 * 1000
    };

    const user: User = {
      id: 'U-REFRESHED',
      name: 'Refreshed User',
      role: 'FARMER',
      provider: 'custom',
      isComplete: true
    };

    return { user, tokens };
  },

  async registerFarmer(data: FarmerRegistration): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

    const user: Farmer = {
      id: `F${Date.now()}`,
      name: data.name || 'Unknown',
      email: data.email,
      phone: data.phone,
      role: 'FARMER',
      provider: data.provider || 'custom',
      nationalId: data.nationalId || '',
      location: data.location || { lat: 0, lng: 0, address: '' },
      produceType: data.produceType || [],
      isComplete: true
    };

    await callMockDB('register', { user });

    const tokens: AuthTokens = {
      accessToken: `at_${Math.random().toString(36).substr(2)}`,
      refreshToken: `rt_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + 15 * 60 * 1000
    };

    return { user, tokens };
  },

  // --- Collection/Payment Actions ---
  async getFarmerCollections(farmerId: string): Promise<ProduceCollection[]> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    // In a real app, this would be an API call
    // For now, filter mock data
    return MOCK_COLLECTIONS.filter(c => c.farmerId === farmerId);
  },
};
