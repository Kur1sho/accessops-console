import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { UsersTable } from "../features/users/UsersTable";
import { InviteUserModal } from "../features/users/InviteUserModal";
import { useUsersQuery } from "../features/users/useUsersQuery";
import type { UsersQuery } from "../types/users";

export function UsersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UsersQuery["role"]>("all");
  const [status, setStatus] = useState<UsersQuery["status"]>("all");
  const [sort, setSort] = useState<UsersQuery["sort"]>("createdAt_desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const query: UsersQuery = useMemo(
    () => ({
      q: search,
      role,
      status,
      sort,
      page,
      pageSize,
    }),
    [search, role, status, sort, page]
  );

  const users = useUsersQuery(query);

  const rows = users.data?.items ?? [];
  const total = users.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <PageHeader
        title="Users"
        description="Invite and manage users with role-based controls."
        right={<Button onClick={() => setInviteOpen(true)}>Invite User</Button>}
      />

      <Card>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search email/name..."
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,0.12)",
              color: "var(--text)",
              minWidth: 220,
            }}
          />

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as any);
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,0.12)",
              color: "var(--text)",
            }}
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,0.12)",
              color: "var(--text)",
            }}
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as any);
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,0.12)",
              color: "var(--text)",
            }}
          >
            <option value="createdAt_desc">Newest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="email_asc">Email A–Z</option>
            <option value="email_desc">Email Z–A</option>
          </select>

          <div style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 13 }}>
            Total: <b>{total}</b>
          </div>
        </div>
      </Card>

      <Card>
        {users.isLoading && <p>Loading users…</p>}
        {users.isError && <p>Failed to load users.</p>}

        {users.isSuccess && (
          <>
            <UsersTable rows={rows} />

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </Button>

              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Page <b>{page}</b> / <b>{totalPages}</b>
              </div>

              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>

      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        currentQuery={query}
      />
    </div>
  );
}