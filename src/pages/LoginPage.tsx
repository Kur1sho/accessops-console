import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../app/auth/AuthContext";

export function LoginPage() {
  const { session, login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@demo.com");

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", display: "grid", gap: 14 }}>
      <PageHeader
        title="Login"
        description="Demo authentication (admin vs viewer)."
      />

      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          <Input
            label="Email"
            placeholder="admin@demo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Demo accounts: <b>admin@demo.com</b> (admin), <b>viewer@demo.com</b> (viewer)
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button
              onClick={() => {
                login(email);
                nav("/users");
              }}
            >
              Sign in
            </Button>
          </div>

          {session && (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Already signed in as <b>{session.user.email}</b>.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}