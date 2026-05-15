'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { apiService } from './api-service';

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
    const userId = (session?.user as any)?.id;
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
      const userPerms = await apiService.getUserPermissions(userId);
      const keys = new Set(
        (Array.isArray(userPerms) ? userPerms : [])
          .filter((up: any) => up?.permissions?.key)
          .map((up: any) => up.permissions.key),
      );
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
