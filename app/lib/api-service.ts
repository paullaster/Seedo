import { User, Farmer, FarmerRegistration, AuthResponse, AuthTokens } from './types';

// Mock DB in memory for the prototype
const MOCK_DB = {
  users: [] as User[],
  otps: new Map<string, { code: string; expires: number }>(),
};

const SIMULATED_DELAY = 800;

export const apiService = {
  // --- OTP Service ---
  async sendOTP(identity: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    MOCK_DB.otps.set(identity, { 
      code, 
      expires: Date.now() + 5 * 60 * 1000 // 5 mins
    });
    console.log(`[MOCK API] OTP for ${identity}: ${code}`);
    return { success: true, message: 'OTP sent successfully' };
  },

  async verifyOTP(identity: string, code: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const stored = MOCK_DB.otps.get(identity);
    if (stored && stored.code === code && stored.expires > Date.now()) {
      MOCK_DB.otps.delete(identity);
      return true;
    }
    return false;
  },

  // --- Auth Actions ---
  async login(identity: string, password?: string, provider: 'google' | 'custom' = 'custom'): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    
    // In a real app, this calls the NestJS backend
    // For mock, we'll return a token and a user
    const tokens: AuthTokens = {
      accessToken: `at_${Math.random().toString(36).substr(2)}`,
      refreshToken: `rt_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
    };

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
    
    // In a real app, send refresh token to backend
    const tokens: AuthTokens = {
      accessToken: `at_refreshed_${Math.random().toString(36).substr(2)}`,
      refreshToken: `rt_refreshed_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + 15 * 60 * 1000
    };

    // Mock user data
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

    const tokens: AuthTokens = {
      accessToken: `at_${Math.random().toString(36).substr(2)}`,
      refreshToken: `rt_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + 15 * 60 * 1000
    };

    return { user, tokens };
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      accessToken: `at_new_${Math.random().toString(36).substr(2)}`,
      refreshToken: `rt_new_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + 15 * 60 * 1000
    };
  }
};
