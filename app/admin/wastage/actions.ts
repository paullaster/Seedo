'use server';

import { bffGet } from '@/app/lib/bff';
import type { WastageRecord } from '@/app/lib/types';

export async function getWastageRecords(): Promise<WastageRecord[]> {
  const result = await bffGet<any>('/wastage');
  const items = result.data || result || [];
  return Array.isArray(items) ? items : [];
}
