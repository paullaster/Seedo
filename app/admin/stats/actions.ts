'use server';

export type StatKey = 'tonnage' | 'loans' | 'farmers' | 'wastage';

export interface DashboardStat {
  key: StatKey;
  label: string;
  value: string;
  trend: string;
  color: string;
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  return [
    { key: 'tonnage', label: 'Total Tonnage (Maize)', value: '142.5 Tons', trend: '+12%', color: '#2e7d32' },
    { key: 'loans', label: 'Active Loans', value: 'KES 1.2M', trend: '+5%', color: '#1976d2' },
    { key: 'farmers', label: 'Total Farmers', value: '1,240', trend: '+20%', color: '#ef6c00' },
    { key: 'wastage', label: 'System Wastage', value: '2.4%', trend: '-1.5%', color: '#c62828' },
  ];
}
