import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLocation } from "wouter";
import { setupAuthInterceptor } from "./api";

type UserType = "customer" | "errander";

interface StoredUser {
  id: number;
  name: string;
  email: string;
  mobileNo?: string;
  isSP: boolean;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobileNo: string;
  role: UserType;
  avatar: string;
}

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  updateAvatar: (newAvatar: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const avatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&bold=true`;

/** Parse the stored user from localStorage (set after OTP verify). */
function loadUserFromStorage(): UserProfile | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const stored: StoredUser = JSON.parse(raw);
    return {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      mobileNo: stored.mobileNo ?? "",
      role: stored.isSP ? "errander" : "customer",
      avatar: avatarUrl(stored.name),
    };
  } catch {
    return null;
  }
}

const GUEST: UserProfile = {
  id: 0,
  name: "Guest",
  email: "",
  mobileNo: "",
  role: "customer",
  avatar: avatarUrl("Guest"),
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();

  // Load initial user from storage
  const [user, setUserState] = useState<UserProfile>(() => loadUserFromStorage() ?? GUEST);

  // Reactive isAuthenticated — tracks token presence in state, not on every render
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("token")
  );

  // Logout function — stable reference via useCallback to avoid re-renders
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setUserState(GUEST);
    setIsAuthenticated(false);
    // Clear React Query cache to prevent cross-user data leakage
    import("./queryClient").then(({ queryClient }) => queryClient.clear());
    setLocation("/auth");
  }, [setLocation]);

  // Wire 401 interceptor so the API layer can trigger logout on session expiry
  useEffect(() => {
    setupAuthInterceptor(logout);
  }, [logout]);

  // Re-read from storage when window gains focus (e.g. after OTP verify in a different tab)
  useEffect(() => {
    const handleFocus = () => {
      const fresh = loadUserFromStorage();
      const hasToken = !!localStorage.getItem("token");
      if (fresh && hasToken) {
        setUserState(fresh);
        setIsAuthenticated(true);
      } else if (!hasToken) {
        setUserState(GUEST);
        setIsAuthenticated(false);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const setUser = useCallback((u: UserProfile) => {
    setUserState(u);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify({
      id: u.id,
      name: u.name,
      email: u.email,
      mobileNo: u.mobileNo,
      isSP: u.role === "errander",
    }));
  }, []);

  const updateAvatar = useCallback((newAvatar: string) => {
    setUserState((prev) => ({ ...prev, avatar: newAvatar }));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, updateAvatar, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
