import type { User, UsersQuery, UsersResponse, UserRole } from "../types/users";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeUsers(count: number): User[] {
  const first = ["Ava", "Noah", "Mina", "Ken", "Yui", "Ren", "Sara", "Leo", "Hana", "Kai"];
  const last = ["Sato", "Tanaka", "Suzuki", "Watanabe", "Ito", "Yamamoto", "Kobayashi", "Kato"];
  const roles: UserRole[] = ["admin", "viewer"];
  const statuses: User["status"][] = ["active", "invited", "suspended"];

  const now = Date.now();

  return Array.from({ length: count }).map((_, i) => {
    const f = randFrom(first);
    const l = randFrom(last);
    const email = `${f}.${l}.${i}@demo.com`.toLowerCase();
    const createdAt = new Date(now - i * 36e5).toISOString(); // stagger by hour

    return {
      id: crypto.randomUUID(),
      email,
      name: `${f} ${l}`,
      role: randFrom(roles),
      status: randFrom(statuses),
      createdAt,
    };
  });
}

// In-memory dataset
import { getUsers } from "./db";

export async function fetchUsers(q: UsersQuery): Promise<UsersResponse> {
  await sleep(450);

  const page = Math.max(1, q.page || 1);
  const pageSize = [10, 20, 50].includes(q.pageSize) ? q.pageSize : 10;

  const search = (q.search ?? "").trim().toLowerCase();
  const role = q.role ?? "all";
  const sortBy = q.sortBy ?? "createdAt";
  const sortDir = q.sortDir ?? "desc";

  let rows = [...getUsers()];

  // Filter: role
  if (role !== "all") {
    rows = rows.filter((u) => u.role === role);
  }

  // Filter: search
  if (search) {
    rows = rows.filter(
      (u) =>
        u.email.toLowerCase().includes(search) ||
        u.name.toLowerCase().includes(search)
    );
  }

  // Sort
  rows.sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;

    const av = a[sortBy];
    const bv = b[sortBy];

    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const total = rows.length;

  // Pagination
  const start = (page - 1) * pageSize;
  const items = rows.slice(start, start + pageSize);

  return { items, total, page, pageSize };
}