import React, { createContext, useContext, useState, ReactNode } from "react";

type UserType = "customer" | "errander";

interface UserProfile {
  name: string;
  role: UserType;
  avatar: string;
}

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  updateAvatar: (newAvatar: string) => void;
  switchRole: () => void;
}

const defaultCustomerImage = "https://ui-avatars.com/api/?name=Alex+Kemboi&background=random";
const defaultErranderImage = "https://ui-avatars.com/api/?name=Errander+Prime&background=0D8ABC&color=fff";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const searchParams = new URLSearchParams(window.location.search);
  const roleParam = searchParams.get('role') as UserType | null;
  const initialRole = roleParam || "customer";

  const [user, setUser] = useState<UserProfile>({
    name: initialRole === "customer" ? "Alex Kemboi" : "Errander Prime",
    role: initialRole,
    avatar: initialRole === "customer" ? defaultCustomerImage : defaultErranderImage
  });

  const updateAvatar = (newAvatar: string) => {
    setUser(prev => ({ ...prev, avatar: newAvatar }));
  };

  const switchRole = () => {
    setUser(prev => {
      const newRole = prev.role === "customer" ? "errander" : "customer";
      return {
        name: newRole === "customer" ? "Alex Kemboi" : "Errander Prime",
        role: newRole,
        avatar: newRole === "customer" ? defaultCustomerImage : defaultErranderImage
      };
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateAvatar, switchRole }}>
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
