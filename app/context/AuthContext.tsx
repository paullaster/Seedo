'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Farmer, FarmerRegistration } from '@/app/lib/types';
import { MOCK_FARMERS, MOCK_AGENTS } from '@/app/lib/mock-data';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | Farmer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identity: string, password: string) => Promise<boolean>;
  registerFarmer: (data: FarmerRegistration) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  registerFarmer: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('seedo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identity: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. Check Mock Data (Hardcoded users)
    const mockUser = [...MOCK_FARMERS, ...MOCK_AGENTS].find(u => 
      (u.email === identity || u.phone === identity)
    );

    // 2. Check LocalStorage "Database" (Registered users)
    const localUsersStr = localStorage.getItem('seedo_users_db');
    const localUsers: User[] = localUsersStr ? JSON.parse(localUsersStr) : [];
    const localUser = localUsers.find(u => 
      (u.email === identity || u.phone === identity) && u.password === password
    );

    const foundUser = mockUser || localUser;

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('seedo_user', JSON.stringify(foundUser));
      return true;
    }
    
    // For demo purposes, allow the hardcoded mocks to login without password check if it matches
    if (mockUser) {
       setUser(mockUser);
       localStorage.setItem('seedo_user', JSON.stringify(mockUser));
       return true;
    }

    return false;
  };

  const registerFarmer = async (data: FarmerRegistration): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: Farmer = {
      id: `F${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      nationalId: data.nationalId,
      role: 'FARMER',
      location: data.location,
      produceType: data.produceType,
      password: data.password // Store password for mock auth
    };

    // Save to "DB"
    const localUsersStr = localStorage.getItem('seedo_users_db');
    const localUsers: User[] = localUsersStr ? JSON.parse(localUsersStr) : [];
    localUsers.push(newUser);
    localStorage.setItem('seedo_users_db', JSON.stringify(localUsers));

    // Auto login
    setUser(newUser);
    localStorage.setItem('seedo_user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seedo_user');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, registerFarmer, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
