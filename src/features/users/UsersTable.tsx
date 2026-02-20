import type { User } from "../../types/users";
import { useAuth } from "../../app/auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { useUpdateUserMutation } from "./useUserMutations";

export function UsersTable({ rows }: { rows: User[] }) {
  const { session } = useAuth();
  const isAdmin = session?.user.role === "admin";
  const actor = session?.user.email ?? "unknown";

  const updateMut = useUpdateUserMutation(actor);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr>
            <Th>Email</Th>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </tr>
        </thead>

        <tbody>
          {rows.map((u) => (
            <tr key={u.id}>
              <Td mono>{u.email}</Td>
              <Td>{u.name}</Td>
              <Td>
                <Badge>{u.role}</Badge>
              </Td>
              <Td>
                <StatusBadge status={u.status} />
              </Td>
              <Td>{new Date(u.createdAt).toLocaleString()}</Td>

              <Td>
                {isAdmin ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Button
                      variant="secondary"
                      disabled={updateMut.isPending}
                      onClick={() => {
                        const nextRole = u.role === "admin" ? "viewer" : "admin";
                        updateMut.mutate({
                          user: { ...u, role: nextRole },
                          action: "user.role_changed",
                        });
                      }}
                      title="Toggle user role"
                    >
                      Toggle Role
                    </Button>

                    <Button
                      variant="danger"
                      disabled={updateMut.isPending}
                      onClick={() => {
                        const nextStatus = u.status === "suspended" ? "active" : "suspended";
                        updateMut.mutate({
                          user: { ...u, status: nextStatus },
                          action: nextStatus === "suspended" ? "user.suspended" : "user.reactivated",
                        });
                      }}
                      title={u.status === "suspended" ? "Reactivate user" : "Suspend user"}
                    >
                      {u.status === "suspended" ? "Activate" : "Suspend"}
                    </Button>

                    {updateMut.isError && (
                      <span style={{ color: "#fca5a5", fontWeight: 900, fontSize: 13 }}>
                        Update failed
                      </span>
                    )}
                  </div>
                ) : (
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>—</span>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        borderBottom: "1px solid var(--border)",
        color: "var(--muted)",
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td
      style={{
        padding: "10px 12px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
        fontSize: 14,
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.08)",
        fontSize: 12,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: "active" | "invited" | "suspended" }) {
  const map: Record<typeof status, string> = {
    active: "rgba(34, 197, 94, 0.18)",
    invited: "rgba(59, 130, 246, 0.18)",
    suspended: "rgba(239, 68, 68, 0.18)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: map[status],
        fontSize: 12,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {status}
    </span>
  );
}