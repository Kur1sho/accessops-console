import type { Policy } from "../types/policies";
import type { AuditEvent } from "../types/audit";
import { getPolicies, setPolicies } from "./policiesStore";
import { addAuditEvent } from "./audit";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function now() {
  return new Date().toISOString();
}

function audit(action: string, actor: string, metadata?: any) {
  const event: AuditEvent = {
    id: crypto.randomUUID(),
    ts: now(),
    action,
    actor,
    ...metadata,
  };

  addAuditEvent(event);
}

export async function fetchPolicies(): Promise<Policy[]> {
  await sleep(250);
  return getPolicies().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function createPolicy(p: Policy): Promise<Policy> {
  await sleep(250);

  const all = getPolicies();
  setPolicies([p, ...all]);

  audit("policy.created", "system", {
    targetId: p.id,
    name: p.name,
  });

  return p;
}

export async function updatePolicy(p: Policy): Promise<Policy> {
  await sleep(250);

  const all = getPolicies();
  setPolicies(all.map((x) => (x.id === p.id ? p : x)));

  audit("policy.updated", "system", {
    targetId: p.id,
    name: p.name,
  });

  return p;
}

export async function deletePolicy(id: string): Promise<void> {
  await sleep(200);

  const all = getPolicies();
  const target = all.find((p) => p.id === id);

  setPolicies(all.filter((p) => p.id !== id));

  audit("policy.deleted", "system", {
    targetId: id,
    name: target?.name,
  });
}