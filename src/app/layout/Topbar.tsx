import "./layout.css";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../auth/AuthContext";

export function Topbar() {
  const { session, logout } = useAuth();

  return (
    <header className="appTopbar">
      <div style={{ fontWeight: 800 }}>AccessOps Console</div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          {session ? `${session.user.email} • ${session.user.role}` : "React + TypeScript"}
        </div>
        {session && (
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}

`const topbarStyle: React.CSSProperties = {
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  borderBottom: "1px solid #e5e7eb",
};`
