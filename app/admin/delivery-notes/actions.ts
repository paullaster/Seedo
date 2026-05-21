'use server';
import { bffGet, bffPost, bffPatch, bffDelete } from '@/app/lib/bff';
import type { DeliveryNoteHeader } from '@/app/lib/types';

export async function getDeliveryNotes(): Promise<DeliveryNoteHeader[]> {
  return bffGet('/delivery-notes');
}

export async function getDeliveryNote(id: string): Promise<DeliveryNoteHeader> {
  return bffGet(`/delivery-notes/${id}`);
}

export async function createDeliveryNote(data: {
  pickup_request_id: string;
  warehouse_id: string;
  received_by: string;
  delivery_date: string;
  notes?: string;
  lines: {
    produce_id: string;
    quantity_received: number;
    bin_id: string;
    sub_bin_id?: string;
    notes?: string;
  }[];
}): Promise<DeliveryNoteHeader> {
  return bffPost('/delivery-notes', data);
}

export async function confirmDeliveryNote(id: string): Promise<DeliveryNoteHeader> {
  return bffPost(`/delivery-notes/${id}/confirm`);
}

export async function cancelDeliveryNote(id: string): Promise<DeliveryNoteHeader> {
  return bffPost(`/delivery-notes/${id}/cancel`);
}

export async function deleteDeliveryNote(id: string): Promise<void> {
  return bffDelete(`/delivery-notes/${id}`);
}
