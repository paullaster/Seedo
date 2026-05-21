'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { apiService } from './api-service';
import { User, UserPermission } from './types';

interface PermissionContextValue {
  permissions: Set<string>;
  loading: boolean;
  can: (key: string) => boolean;
  refresh: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue>({
  permissions: new Set(),
  loading: true,
  can: () => false,
  refresh: async () => {},
});

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    const userId = (session?.user as User)?.id;
    console.log('fetch hit: ', session);
    if (!userId) {
      setPermissions(new Set());
      setLoading(false);
      return;
    }

    if (fetchedRef.current === userId && permissions.size > 0) {
      setLoading(false);
      return;
    }

    try {
      console.log('user id: ', userId)
      const userPerms = await apiService.getUserPermissions(userId);
      console.log('userPerms: ', userPerms);
      
      const keys = new Set(
        (Array.isArray(userPerms) ? userPerms : [])
          .filter((up: UserPermission) => up?.permissions?.key)
          .map((up: UserPermission) => up.permissions.key),
      );
      console.log('permission keys: ', keys);
      
      setPermissions(keys);
      fetchedRef.current = userId;
    } catch {
      setPermissions(new Set());
    } finally {
      setLoading(false);
    }
  }, [session, permissions.size]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const can = useCallback(
    (key: string) => permissions.has(key),
    [permissions],
  );

  return (
    <PermissionContext.Provider value={{ permissions, loading, can, refresh: fetchPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function useCan(permissionKey: string): boolean {
  const { can, loading } = useContext(PermissionContext);
  if (loading) return false;
  return can(permissionKey);
}

export function usePermissions() {
  return useContext(PermissionContext);
}
