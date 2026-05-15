import { FarmerRegistration, AuthResponse, ProduceCollection, MarketRate, HarvestNotice, PriceHistory, CollectionStatus, Loan, Agent } from './types';

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
};
