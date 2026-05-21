'use server';
import { bffGet, bffPost, bffPatch, bffDelete } from '@/app/lib/bff';
import type { Batch } from '@/app/lib/types';

export async function getBatches(): Promise<Batch[]> {
  return bffGet('/batches');
}

export async function getBatch(id: string): Promise<Batch> {
  return bffGet(`/batches/${id}`);
}

export async function createBatch(data: {
  produce_id: string;
  warehouse_id: string;
  quantity: number;
  received_date: string;
  source: string;
  bin_id?: string;
  sub_bin_id?: string;
  expiry_date?: string;
  reference_id?: string;
  notes?: string;
  batch_number?: string;
}): Promise<Batch> {
  return bffPost('/batches', data);
}

export async function updateBatch(id: string, data: Partial<{
  produce_id: string;
  warehouse_id: string;
  quantity: number;
  received_date: string;
  source: string;
  bin_id: string;
  sub_bin_id: string;
  expiry_date: string;
  notes: string;
}>): Promise<Batch> {
  return bffPatch(`/batches/${id}`, data);
}

export async function deleteBatch(id: string): Promise<void> {
  return bffDelete(`/batches/${id}`);
}
