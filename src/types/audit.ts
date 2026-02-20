export type AuditAction =
  | "user.invited"
  | "user.role_changed"
  | "user.suspended"
  | "user.reactivated";

export type AuditEvent = {
  id: string;
  action: AuditAction;
  actor: string; // email of current session user
  targetUserId: string;
  targetEmail: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};