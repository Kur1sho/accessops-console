import React from "react";
import type { Session } from "../../types/auth";
import { clearSession, loadSession, saveSession } from "../../utils/storage";

type AuthState = {
  session: Session | null;
  setSession: (s: Session | null) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = React.useState<Session | null>(() =>
    loadSession<Session>()
  );

  const setSession = (s: Session | null) => {
    setSessionState(s);
    if (s) saveSession(s);
    else clearSession();
  };

  const logout = () => setSession(null);

  return (
    <AuthContext.Provider value={{ session, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}