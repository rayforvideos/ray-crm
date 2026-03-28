import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  appId: string | null;
  setToken: (token: string) => void;
  setAppId: (appId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      appId: null,
      setToken: (token) => set({ token }),
      setAppId: (appId) => set({ appId }),
      logout: () => set({ token: null, appId: null }),
    }),
    { name: 'ray-crm-auth' },
  ),
);
