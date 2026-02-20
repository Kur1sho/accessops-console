import type { AuditEvent } from "../types/audit";

const AUDIT_KEY = "accessops.audit.v1";

function load(): AuditEvent[] {
  const raw = localStorage.getItem(AUDIT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AuditEvent[];
  } catch {
    return [];
  }
}

function save(events: AuditEvent[]) {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(events));
}

export function getAuditEvents(): AuditEvent[] {
  return load();
}

export function addAuditEvent(event: AuditEvent) {
  const current = load();
  save([event, ...current]);
}

/**
 * Alias used by AuditPage.tsx (same behaviour as getAuditEvents).
 * Keeping both names avoids churn across the codebase.
 */
export function listAuditEvents(): AuditEvent[] {
  return load();
}