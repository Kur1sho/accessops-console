import { getUsers, setUsers } from "./db";
import { addAuditEvent } from "./audit";
import type { User } from "../types/users";
import type { AuditAction } from "../types/audit";

export function updateUser(updated: User, actorEmail: string, action: AuditAction) {
  const users = getUsers();
  const next = users.map((u) => (u.id === updated.id ? updated : u));
  setUsers(next);

  addAuditEvent({
    id: crypto.randomUUID(),
    action,
    actor: actorEmail,
    targetUserId: updated.id,
    targetEmail: updated.email,
    createdAt: new Date().toISOString(),
  });
}