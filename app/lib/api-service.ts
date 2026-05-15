import { FarmerRegistration, AuthResponse, ProduceCollection, MarketRate, HarvestNotice, PriceHistory, CollectionStatus, Loan, Agent, ActivationUserInfo, Permission, UserPermission } from './types';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    throw new Error('Browser window not set.');
  }
  if (process.env.NEXT_PUBLIC_API_URL) return `${process.env.NEXT_PUBLIC_API_URL}/api`;
  return '/api';
};

const API_URL = getBaseUrl();

export const apiService = {
  async sendOTP(identity: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_URL}/v1/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity }),
    });
    if (!res.ok) throw new Error('Failed to send OTP');
    return res.json();
  },

  async verifyOTP(identity: string, code: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/v1/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, code }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid;
  },

  async registerFarmer(data: FarmerRegistration): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/v1/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }

    return res.json();
  },

  async getFarmerCollections(farmerId: string): Promise<ProduceCollection[]> {
    const res = await fetch(`${API_URL}/v1/collections?farmerId=${farmerId}`);
    if (!res.ok) throw new Error('Failed to fetch collections');
    return res.json();
  },

  async getMarketRates(): Promise<MarketRate[]> {
    const res = await fetch(`${API_URL}/v1/market-rates`);
    if (!res.ok) throw new Error('Failed to fetch market rates');
    return res.json();
  },

  async searchProduce(query: string): Promise<MarketRate[]> {
    const res = await fetch(`${API_URL}/v1/market-rates?search=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search produce');
    return res.json();
  },

  async addMarketRate(rate: Partial<MarketRate>): Promise<MarketRate> {
    const res = await fetch(`${API_URL}/v1/market-rates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rate),
    });
    if (!res.ok) throw new Error('Failed to add produce');
    return res.json();
  },

  async updateMarketRate(id: string, updates: Partial<MarketRate>): Promise<MarketRate> {
    const res = await fetch(`${API_URL}/v1/market-rates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update produce');
    return res.json();
  },

  async deleteMarketRate(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/v1/market-rates/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete produce');
  },

  async getHarvestNotices(farmerId: string): Promise<HarvestNotice[]> {
    const res = await fetch(`${API_URL}/v1/harvest-notices?farmerId=${farmerId}`);
    if (!res.ok) throw new Error('Failed to fetch harvest notices');
    return res.json();
  },

  async getPriceHistory(produceType: string): Promise<PriceHistory[]> {
    const res = await fetch(`${API_URL}/v1/price-history?produceType=${produceType}`);
    if (!res.ok) throw new Error('Failed to fetch price history');
    return res.json();
  },

  async getAgents(filters?: { region?: string; type?: string }): Promise<Agent[]> {
    const params = new URLSearchParams();
    if (filters?.region) params.append('region', filters.region);
    if (filters?.type) params.append('type', filters.type);
    const res = await fetch(`${API_URL}/v1/agents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json();
  },

  async getWastage(): Promise<any[]> {
    const res = await fetch(`${API_URL}/v1/wastage`);
    if (!res.ok) throw new Error('Failed to fetch wastage data');
    return res.json();
  },

  async getAllCollections(): Promise<ProduceCollection[]> {
    const res = await fetch(`${API_URL}/v1/collections`);
    if (!res.ok) throw new Error('Failed to fetch collections');
    return res.json();
  },

  async updateCollectionStatus(id: string, status: CollectionStatus): Promise<void> {
    const res = await fetch(`${API_URL}/v1/collections/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update collection status');
  },

  async processBulkPayout(ids: string[]): Promise<void> {
    const res = await fetch(`${API_URL}/v1/financials/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to process bulk payout');
  },

  async getLoans(): Promise<Loan[]> {
    const res = await fetch(`${API_URL}/v1/loans`);
    if (!res.ok) throw new Error('Failed to fetch loans');
    return res.json();
  },

  async updateLoanStatus(id: string, data: { status?: string; remainingBalance?: number }): Promise<void> {
    const res = await fetch(`${API_URL}/v1/loans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update loan status');
  },

  // Activation & Admin User Creation
  async adminCreateUser(data: { firstName: string; lastName: string; email: string; role: string }): Promise<any> {
    const res = await fetch(`${API_URL}/users/admin-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create user' }));
      throw new Error(err.error || 'Failed to create user');
    }
    return res.json();
  },

  async verifyActivationToken(token: string): Promise<ActivationUserInfo> {
    const res = await fetch(`${API_URL}/activation/verify-token/${encodeURIComponent(token)}`);
    if (!res.ok) throw new Error('Invalid or expired activation link');
    return res.json();
  },

  async activateAccount(data: { token: string; password: string; phoneNumber?: string; nationalId?: string }): Promise<any> {
    const res = await fetch(`${API_URL}/activation/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Activation failed' }));
      throw new Error(err.error || 'Activation failed');
    }
    return res.json();
  },

  // Permissions
  async getPermissions(): Promise<Permission[]> {
    const res = await fetch(`${API_URL}/permissions`);
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  },

  async createPermission(data: { key: string; name: string; description?: string }): Promise<Permission> {
    const res = await fetch(`${API_URL}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create permission' }));
      throw new Error(err.error || 'Failed to create permission');
    }
    return res.json();
  },

  async deletePermission(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/permissions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete permission');
  },

  async assignPermissions(userId: string, permissions: { permissionId: string; value?: string }[]): Promise<any> {
    const res = await fetch(`${API_URL}/permissions/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, permissions }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to assign permissions' }));
      throw new Error(err.error || 'Failed to assign permissions');
    }
    return res.json();
  },

  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    const res = await fetch(`${API_URL}/permissions/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user permissions');
    return res.json();
  },

  async removeUserPermission(userId: string, permissionId: string): Promise<void> {
    const res = await fetch(`${API_URL}/permissions/user/${userId}?permissionId=${permissionId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove permission');
  },
};
