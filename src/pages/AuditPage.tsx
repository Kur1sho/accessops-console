import { useMemo, useState } from "react";
import type { AuditEvent } from "../types/audit";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { listAuditEvents } from "../api/audit";

type ActionFilter = "all" | string;

function safeDate(ts: string) {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts : d.toLocaleString();
}

function pillBg(action: string) {
  const a = action.toLowerCase();
  if (a.includes("suspend") || a.includes("deny") || a.includes("deleted")) return "rgba(239,68,68,0.18)";
  if (a.includes("role") || a.includes("updated")) return "rgba(245,158,11,0.18)";
  if (a.includes("invite") || a.includes("created")) return "rgba(59,130,246,0.18)";
  return "rgba(255,255,255,0.08)";
}

function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: tone,
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        borderBottom: "1px solid var(--border)",
        color: "var(--muted)",
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
  colSpan,
}: {
  children: React.ReactNode;
  mono?: boolean;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      style={{
        padding: "10px 12px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
        fontSize: 14,
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

export function AuditPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [q, setQ] = useState("");
  const [actor, setActor] = useState("");
  const [action, setAction] = useState<ActionFilter>("all");
  const [limit, setLimit] = useState(200);

  const data = useMemo(() => {
    void refreshKey;
    const events = listAuditEvents() as AuditEvent[];
    return [...events].sort((a, b) => (a.ts < b.ts ? 1 : -1));
  }, [refreshKey]);

  const actions = useMemo(() => {
    const set = new Set<string>();
    for (const e of data) set.add(String(e.action));
    return ["all", ...Array.from(set).sort()] as ActionFilter[];
  }, [data]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const aa = actor.trim().toLowerCase();

    return data
      .filter((e) => (action === "all" ? true : String(e.action) === action))
      .filter((e) => (aa ? String(e.actor ?? "").toLowerCase().includes(aa) : true))
      .filter((e) => {
        if (!qq) return true;
        return JSON.stringify(e).toLowerCase().includes(qq);
      })
      .slice(0, Math.max(1, limit));
  }, [data, q, actor, action, limit]);

  function exportJson() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 19).replaceAll(":", "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAudit() {
    const ok = confirm("Clear ALL audit events? This cannot be undone in the demo.");
    if (!ok) return;
    localStorage.removeItem("accessops.audit.v1");
    setRefreshKey((k) => k + 1);
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <PageHeader
        title="Audit Log"
        description="Track sensitive actions across the console."
        right={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => setRefreshKey((k) => k + 1)}>
              Refresh
            </Button>
            <Button variant="secondary" onClick={exportJson}>
              Export JSON
            </Button>
            <Button variant="danger" onClick={clearAudit}>
              Clear
            </Button>
          </div>
        }
      />

      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "2fr 1fr 1fr 140px",
              alignItems: "end",
            }}
          >
            <Input
              label="Search"
              placeholder="Search anything…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <Input
              label="Actor"
              placeholder="e.g. admin@demo.com"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
            />

            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Action
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as ActionFilter)}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "rgba(0,0,0,0.12)",
                  color: "var(--text)",
                  fontWeight: 800,
                }}
              >
                {actions.map((a) => (
                  <option key={a} value={a}>
                    {a === "all" ? "All actions" : a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Limit
              </label>
              <input
                type="number"
                min={1}
                max={2000}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value) || 200)}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "rgba(0,0,0,0.12)",
                  color: "var(--text)",
                  fontWeight: 800,
                }}
              />
            </div>
          </div>

          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Showing <b>{filtered.length}</b> of <b>{data.length}</b> events.
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <Th>Time</Th>
                  <Th>Action</Th>
                  <Th>Actor</Th>
                  <Th>Target</Th>
                  <Th>Details</Th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <Td mono>{safeDate(e.ts)}</Td>
                    <Td>
                      <Pill tone={pillBg(String(e.action))}>{String(e.action)}</Pill>
                    </Td>
                    <Td mono>{e.actor ?? "—"}</Td>
                    <Td mono>{e.targetEmail ?? e.targetId ?? "—"}</Td>
                    <Td>
                      <details>
                        <summary style={{ cursor: "pointer", color: "var(--muted)" }}>View</summary>
                        <pre
                          style={{
                            marginTop: 8,
                            padding: 10,
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(0,0,0,0.18)",
                            overflowX: "auto",
                            fontSize: 12,
                            lineHeight: 1.4,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {JSON.stringify(e, null, 2)}
                        </pre>
                      </details>
                    </Td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <Td mono colSpan={5}>
                      No events match your filters.
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}