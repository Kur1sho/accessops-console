import type { User } from "../types/users";
import { getUsers, setUsers } from "./db";
import { addAuditEvent } from "./audit";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function inviteUser(input: { email: string; name: string; actorEmail: string }): Promise<User> {
  await sleep(500);

  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) throw new Error("Invalid email address.");

    const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name: input.name.trim(),
    role: "viewer",
    status: "invited",
    createdAt: new Date().toISOString(),
    };

    const users = getUsers();
    setUsers([newUser, ...users]);

    addAuditEvent({
      id: crypto.randomUUID(),
      action: "user.invited",
      actor: input.actorEmail,
      targetUserId: newUser.id,
      targetEmail: newUser.email,
      createdAt: new Date().toISOString(),
    });

    return newUser;
}