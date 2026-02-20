import type { User } from "../types/users";

const USERS_KEY = "accessops.users.v1";
const SEEDED_KEY = "accessops.seeded.v1";

function load<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeUsers(count: number): User[] {
  const first = ["Ava", "Noah", "Mina", "Ken", "Yui", "Ren", "Sara", "Leo", "Hana", "Kai"];
  const last = ["Sato", "Tanaka", "Suzuki", "Watanabe", "Ito", "Yamamoto", "Kobayashi", "Kato"];
  const roles: User["role"][] = ["admin", "viewer"];
  const statuses: User["status"][] = ["active", "invited", "suspended"];

  const now = Date.now();

  return Array.from({ length: count }).map((_, i) => {
    const f = randFrom(first);
    const l = randFrom(last);
    const email = `${f}.${l}.${i}@demo.com`.toLowerCase();
    const createdAt = new Date(now - i * 36e5).toISOString();

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

export function ensureSeeded() {
  const seeded = load<boolean>(SEEDED_KEY);
  if (seeded) return;

  const users = makeUsers(137);
  save(USERS_KEY, users);
  save(SEEDED_KEY, true);
}

export function getUsers(): User[] {
  ensureSeeded();
  return load<User[]>(USERS_KEY) ?? [];
}

export function setUsers(users: User[]) {
  save(USERS_KEY, users);
}