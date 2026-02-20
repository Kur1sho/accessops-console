import type { User } from "../types/users";
import type { AuditEvent, AuditAction } from "../types/audit";
import { addAuditEvent } from "./audit";
import { getUsers, setUsers } from "./db";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function audit(action: AuditAction, actorEmail: string, target: User, meta?: Record<string, unknown>) {
  const event: AuditEvent = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    actor: actorEmail,
    action,
    targetType: "user",
    targetId: target.id,
    targetEmail: target.email,
    meta,
  };
  addAuditEvent(event);
}

export async function updateUser(updated: User, actorEmail: string, action: AuditAction): Promise<User> {
  await sleep(250);

  const all = getUsers();
  setUsers(all.map((u) => (u.id === updated.id ? updated : u)));

  audit(action, actorEmail, updated, { role: updated.role, status: updated.status });

  return updated;
}