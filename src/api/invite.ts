import type { User } from "../types/users";
import type { AuditEvent } from "../types/audit";
import { addAuditEvent } from "./audit";
import { getUsers, setUsers } from "./db";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function inviteUser(input: {
  email: string;
  name: string;
  actorEmail: string;
}): Promise<User> {
  await sleep(250);

  const newUser: User = {
    id: crypto.randomUUID(),
    email: input.email.trim(),
    name: input.name.trim(),
    role: "viewer",
    status: "invited",
    createdAt: new Date().toISOString(),
  };

  const all = getUsers();
  setUsers([newUser, ...all]);

  const event: AuditEvent = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    actor: input.actorEmail,
    action: "user.invited",
    targetType: "user",
    targetId: newUser.id,
    targetEmail: newUser.email,
    meta: { name: newUser.name },
  };

  addAuditEvent(event);

  return newUser;
}