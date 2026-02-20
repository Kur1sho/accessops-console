import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Input } from "../components/ui/Input";
import { useAuth } from "../app/auth/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("password123");

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", display: "grid", gap: 14 }}>
      <PageHeader title="Login" description="Demo authentication (admin vs viewer)." />

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(email, password);
            nav("/users");
          }}
          style={{ display: "grid", gap: 12 }}
        >
          <Input
            label="Email"
            placeholder="admin@demo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            placeholder="min 8 characters"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Demo: any email works. If email contains <b>admin</b> → admin role. Password is demo-only.
          </div>

          <button
            type="submit"
            disabled={password.length < 8}
            style={{
              justifySelf: "end",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(59,130,246,0.22)",
              color: "var(--text)",
              fontWeight: 900,
              cursor: password.length < 8 ? "not-allowed" : "pointer",
              opacity: password.length < 8 ? 0.6 : 1,
            }}
          >
            Sign in
          </button>
        </form>
      </Card>
    </div>
  );
}