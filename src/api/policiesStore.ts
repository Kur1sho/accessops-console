import type { Policy } from "../types/policies";

const KEY = "accessops.policies.v1";
const SEEDED = "accessops.policies.seeded.v1";

function load<T>(k: string): T | null {
  const raw = localStorage.getItem(k);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function save<T>(k: string, v: T) {
  localStorage.setItem(k, JSON.stringify(v));
}

function seed(): Policy[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      name: "Block suspended users",
      description: "Deny access when user status is suspended.",
      effect: "deny",
      groups: [
        {
          id: crypto.randomUUID(),
          operator: "AND",
          conditions: [
            { id: crypto.randomUUID(), field: "status", op: "equals", value: "suspended" },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function ensurePoliciesSeeded() {
  const seeded = load<boolean>(SEEDED);
  if (seeded) return;
  save(KEY, seed());
  save(SEEDED, true);
}

export function getPolicies(): Policy[] {
  ensurePoliciesSeeded();
  return load<Policy[]>(KEY) ?? [];
}

export function setPolicies(policies: Policy[]) {
  save(KEY, policies);
}