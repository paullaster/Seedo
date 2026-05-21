'use server';
import { bffGet, bffPost, bffPatch, bffDelete } from '@/app/lib/bff';
import type { NumberSeriesConfig, NumberableEntity, NumberSeriesSegment, NumberSeriesHistoryItem } from '@/app/lib/types';

export async function getNumberableEntities(): Promise<NumberableEntity[]> {
  return bffGet('/number-series/entities');
}

export async function getNumberSeriesConfigs(): Promise<NumberSeriesConfig[]> {
  return bffGet('/number-series/configs');
}

export async function getNumberSeriesConfig(id: string): Promise<NumberSeriesConfig> {
  return bffGet(`/number-series/configs/${id}`);
}

export async function getConfigByEntity(entityType: string, entityId?: string): Promise<NumberSeriesConfig | null> {
  const params = entityId ? `?entity_id=${entityId}` : '';
  try {
    return await bffGet(`/number-series/configs/by-entity/${entityType}${params}`);
  } catch {
    return null;
  }
}

export async function createNumberSeriesConfig(data: {
  entity_type: string;
  name: string;
  description?: string;
  segments: NumberSeriesSegment[];
  starting_number?: number;
  is_active?: boolean;
}): Promise<NumberSeriesConfig> {
  return bffPost('/number-series/configs', data);
}

export async function updateNumberSeriesConfig(id: string, data: Partial<{
  name: string;
  description: string;
  segments: NumberSeriesSegment[];
  starting_number: number;
  is_active: boolean;
}>): Promise<NumberSeriesConfig> {
  return bffPatch(`/number-series/configs/${id}`, data);
}

export async function deleteNumberSeriesConfig(id: string): Promise<void> {
  return bffDelete(`/number-series/configs/${id}`);
}

export async function generateNextNumber(data: {
  entity_type: string;
  entity_id?: string;
  manual_value?: number;
  generated_by?: string;
  target_entity_id?: string;
}): Promise<{ number: string }> {
  return bffPost('/number-series/generate', data);
}

export async function previewNumberSeries(entityType: string, segments: NumberSeriesSegment[], starting_number?: number): Promise<{ example: string }> {
  return bffPost('/number-series/preview', { entity_type: entityType, segments, starting_number });
}

export async function getNumberSeriesHistory(configId: string): Promise<NumberSeriesHistoryItem[]> {
  return bffGet(`/number-series/configs/${configId}/history`);
}
