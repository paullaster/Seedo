'use server';
import { bffGet, bffPost, bffPatch, bffDelete } from '@/app/lib/bff';
import type { Warehouse, Bin, SubBin } from '@/app/lib/types';

export async function getWarehouses(): Promise<Warehouse[]> {
  return bffGet('/warehouses');
}

export async function getWarehouse(id: string): Promise<Warehouse> {
  return bffGet(`/warehouses/${id}`);
}

export async function createWarehouse(data: { name: string; code: string; location?: string; managed_by?: string }): Promise<Warehouse> {
  return bffPost('/warehouses', data);
}

export async function updateWarehouse(id: string, data: Partial<{ name: string; code: string; location: string; managed_by: string; is_active: boolean }>): Promise<Warehouse> {
  return bffPatch(`/warehouses/${id}`, data);
}

export async function deleteWarehouse(id: string): Promise<void> {
  return bffDelete(`/warehouses/${id}`);
}

export async function getWarehouseBins(warehouseId: string): Promise<Bin[]> {
  return bffGet(`/warehouses/${warehouseId}/bins`);
}

export async function getBin(id: string): Promise<Bin> {
  return bffGet(`/warehouses/bins/${id}`);
}

export async function createBin(data: { name: string; code: string; warehouse_id: string; max_capacity?: number }): Promise<Bin> {
  return bffPost('/warehouses/bins', data);
}

export async function updateBin(id: string, data: Partial<{ name: string; code: string; max_capacity: number; is_active: boolean }>): Promise<Bin> {
  return bffPatch(`/warehouses/bins/${id}`, data);
}

export async function deleteBin(id: string): Promise<void> {
  return bffDelete(`/warehouses/bins/${id}`);
}

export async function getBinSubBins(binId: string): Promise<SubBin[]> {
  return bffGet(`/warehouses/bins/${binId}/sub-bins`);
}

export async function getSubBin(id: string): Promise<SubBin> {
  return bffGet(`/warehouses/sub-bins/${id}`);
}

export async function createSubBin(data: { name: string; code: string; bin_id: string; max_capacity?: number }): Promise<SubBin> {
  return bffPost('/warehouses/sub-bins', data);
}

export async function updateSubBin(id: string, data: Partial<{ name: string; code: string; max_capacity: number; is_active: boolean }>): Promise<SubBin> {
  return bffPatch(`/warehouses/sub-bins/${id}`, data);
}

export async function deleteSubBin(id: string): Promise<void> {
  return bffDelete(`/warehouses/sub-bins/${id}`);
}
