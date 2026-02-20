import { useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import type { UsersQuery } from "../types/users";
import { useUsersQuery } from "../features/users/useUsersQuery";
import { UsersTable } from "../features/users/UsersTable";
import { InviteUserModal } from "../features/users/InviteUserModal";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UsersQuery["role"]>("all");
  const [sortBy, setSortBy] = useState<UsersQuery["sortBy"]>("createdAt");
  const [sortDir, setSortDir] = useState<UsersQuery["sortDir"]>("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [inviteOpen, setInviteOpen] = useState(false);

  const query = useMemo<UsersQuery>(
    () => ({ page, pageSize, search, role, sortBy, sortDir }),
    [page, pageSize, search, role, sortBy, sortDir]
  );

  const users = useUsersQuery(query);

  const total = users.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function toggleSort(next: UsersQuery["sortBy"]) {
    if (sortBy === next) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(next);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <PageHeader
        title="Users"
        description="Manage users and roles across the console."
        right={<Button onClick={() => setInviteOpen(true)}>Invite User</Button>}
      />

      <Card>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Search
            </span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name or email…"
              style={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(0,0,0,0.12)",
                color: "var(--text)",
                padding: "10px 12px",
                minWidth: 260,
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Role
            </span>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value as any); setPage(1); }}
              style={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(0,0,0,0.12)",
                color: "var(--text)",
                padding: "10px 12px",
              }}
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>

          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <Button variant="secondary" onClick={() => toggleSort("createdAt")}>
              Sort: Created ({sortDir})
            </Button>
            <Button variant="secondary" onClick={() => toggleSort("email")}>
              Sort: Email
            </Button>
            <Button variant="secondary" onClick={() => toggleSort("role")}>
              Sort: Role
            </Button>
          </div>
        </div>

        <InviteUserModal
            open={inviteOpen}
            onClose={() => setInviteOpen(false)}
            currentQuery={query}
        />

        <div style={{ height: 14 }} />

        {users.isLoading && <p>Loading users…</p>}

        {users.isError && (
          <div style={{ display: "grid", gap: 10 }}>
            <p>Failed to load users.</p>
            <div>
              <Button onClick={() => users.refetch()}>Retry</Button>
            </div>
          </div>
        )}

        {users.isSuccess && users.data.items.length === 0 && <p>No users found.</p>}

        {users.isSuccess && users.data.items.length > 0 && (
          <>
            <UsersTable rows={users.data.items} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Page {page} of {totalPages} • {total} total
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Prev
                </Button>
                <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}