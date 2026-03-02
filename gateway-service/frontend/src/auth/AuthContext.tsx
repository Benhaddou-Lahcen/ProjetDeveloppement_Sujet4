import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface AuthUser {
  username: string;
  roles: string[];
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  login: (payload: { token: string; user: AuthUser }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "auth_state";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    console.log("[v0] AuthProvider init - saved:", saved ? "found" : "not found");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { token: string; user: AuthUser };
        setToken(parsed.token);
        setUser(parsed.user);
        console.log("[v0] AuthProvider loaded user:", parsed.user.username);
      } catch (err) {
        console.log("[v0] AuthProvider parse error:", err);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (payload: { token: string; user: AuthUser }) => {
    setToken(payload.token);
    setUser(payload.user);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string) =>
    !!user && user.roles.some((r) => r.toUpperCase() === role.toUpperCase());

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        hasRole,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

