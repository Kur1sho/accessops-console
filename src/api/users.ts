import type { User, UsersQuery, UsersResponse } from "../types/users";
import { getUsers } from "./db";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchUsers(q: UsersQuery): Promise<UsersResponse> {
  await sleep(200);

  const all = getUsers();
  const needle = (q.q ?? "").trim().toLowerCase();

  let rows: User[] = [...all];

  if (needle) {
    rows = rows.filter(
      (u) =>
        u.email.toLowerCase().includes(needle) ||
        u.name.toLowerCase().includes(needle)
    );
  }

  if (q.role && q.role !== "all") rows = rows.filter((u) => u.role === q.role);
  if (q.status && q.status !== "all") rows = rows.filter((u) => u.status === q.status);

  const sortBy = q.sortBy ?? "createdAt";
  const sortDir = q.sortDir ?? "desc";

  rows.sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;

    const av = String(a[sortBy] ?? "");
    const bv = String(b[sortBy] ?? "");

    if (av === bv) return 0;
    return av > bv ? dir : -dir;
  });

  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 10;
  const start = (page - 1) * pageSize;

  return {
    items: rows.slice(start, start + pageSize),
    total: rows.length,
  };
}