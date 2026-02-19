import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

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

/** Parse the stored user from localStorage (set by auth after OTP verify). */
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
  const [user, setUserState] = useState<UserProfile>(() => loadUserFromStorage() ?? GUEST);

  // Re-read from storage whenever the window gains focus (e.g. after OTP verify)
  useEffect(() => {
    const handleFocus = () => {
      const fresh = loadUserFromStorage();
      if (fresh) setUserState(fresh);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const setUser = (u: UserProfile) => {
    setUserState(u);
    localStorage.setItem("user", JSON.stringify({
      id: u.id, name: u.name, email: u.email,
      mobileNo: u.mobileNo, isSP: u.role === "errander"
    }));
  };

  const updateAvatar = (newAvatar: string) => {
    setUserState((prev) => ({ ...prev, avatar: newAvatar }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState(GUEST);
    setLocation("/auth");
  };

  const isAuthenticated = !!localStorage.getItem("token");

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
