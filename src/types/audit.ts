export type AuditAction =
  | "user.invited"
  | "user.role_changed"
  | "user.suspended"
  | "user.reactivated"
  | "policy.created"
  | "policy.updated"
  | "policy.deleted"
  | string;

export type AuditEvent = {
  id: string;
  ts: string;

  // who did it
  actor: string;

  // what happened
  action: AuditAction;

  // optional target info
  targetType?: "user" | "policy" | "system";
  targetId?: string;
  targetEmail?: string;

  // any extra info
  meta?: Record<string, unknown>;
};