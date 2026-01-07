"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface ImpersonatedUser {
  id: string;
  name: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
}

interface ImpersonationState {
  isImpersonating: boolean;
  targetUser: ImpersonatedUser | null;
  startImpersonation: (user: ImpersonatedUser) => void;
  endImpersonation: () => void;
}

const STORAGE_KEY = "admin_impersonation";

const ImpersonationContext = createContext<ImpersonationState | null>(null);

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [targetUser, setTargetUser] = useState<ImpersonatedUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ImpersonatedUser;
        setTargetUser(parsed);
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  const startImpersonation = useCallback((user: ImpersonatedUser) => {
    setTargetUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const endImpersonation = useCallback(() => {
    setTargetUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Don't render children until hydrated to prevent flash
  if (!isHydrated) {
    return null;
  }

  return (
    <ImpersonationContext.Provider
      value={{
        isImpersonating: targetUser !== null,
        targetUser,
        startImpersonation,
        endImpersonation,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation(): ImpersonationState {
  const context = useContext(ImpersonationContext);
  if (!context) {
    throw new Error(
      "useImpersonation must be used within an ImpersonationProvider",
    );
  }
  return context;
}
