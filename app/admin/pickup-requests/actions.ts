'use server';
import { bffGet, bffPost, bffPatch, bffDelete, BffError } from '@/app/lib/bff';
import type { PickupRequest, PickupRequestTransfer, PickupRequestAuditLog } from '@/app/lib/types';

export async function getPickupRequests(): Promise<PickupRequest[]> {
  return bffGet('/pickup-requests');
}

export async function getPickupRequest(id: string): Promise<PickupRequest> {
  return bffGet(`/pickup-requests/${id}`);
}

export async function getPickupRequestAuditLogs(id: string): Promise<PickupRequestAuditLog[]> {
  return bffGet(`/pickup-requests/${id}/audit`);
}

export async function createPickupRequest(data: { collection_id: string; notes?: string }): Promise<PickupRequest> {
  return bffPost('/pickup-requests', data);
}

export async function approvePickupRequest(id: string, notes?: string): Promise<PickupRequest> {
  return bffPost(`/pickup-requests/${id}/approve`, { notes });
}

export async function assignPickupRequest(id: string, assigned_to: string, notes?: string): Promise<PickupRequest> {
  return bffPost(`/pickup-requests/${id}/assign`, { assigned_to, notes });
}

export async function acceptPickupRequest(id: string): Promise<PickupRequest> {
  return bffPost(`/pickup-requests/${id}/accept`);
}

export async function rejectPickupRequest(id: string, notes?: string): Promise<PickupRequest> {
  return bffPost(`/pickup-requests/${id}/reject`, { notes });
}

export async function transferPickupRequest(id: string, to_agent_id: string, notes?: string): Promise<PickupRequestTransfer> {
  return bffPost(`/pickup-requests/${id}/transfer`, { to_agent_id, notes });
}

export async function completePickupRequest(id: string): Promise<PickupRequest> {
  return bffPost(`/pickup-requests/${id}/complete`);
}

export async function cancelPickupRequest(id: string, notes?: string): Promise<PickupRequest> {
  return bffPost(`/pickup-requests/${id}/cancel`, { notes });
}

export async function acceptTransfer(transferId: string): Promise<void> {
  return bffPost(`/pickup-requests/transfers/${transferId}/accept`);
}

export async function rejectTransfer(transferId: string): Promise<void> {
  return bffPost(`/pickup-requests/transfers/${transferId}/reject`);
}

export async function adminApproveTransfer(transferId: string): Promise<void> {
  return bffPost(`/pickup-requests/transfers/${transferId}/admin-approve`);
}
