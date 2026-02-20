import React from "react";
import { clearSession, loadSession, saveSession } from "../../utils/storage";
import type { Session } from "../../utils/storage";

type AuthContextValue = {
  session: Session | null;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(() => loadSession());

  function login(email: string, _password: string) {
    // Demo auth only: any 8+ char password accepted
    // Role rule: email containing "admin" => admin, else viewer
    const role = email.toLowerCase().includes("admin") ? "admin" : "viewer";

    const next: Session = {
      user: { email, role },
      createdAt: new Date().toISOString(),
    };

    setSession(next);
    saveSession(next);
  }

  function logout() {
    setSession(null);
    clearSession();
  }

  const value: AuthContextValue = { session, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}