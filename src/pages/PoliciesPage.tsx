import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { usePoliciesQuery } from "../features/policies/usePoliciesQuery";
import { PolicyBuilderModal } from "../features/policies/PolicyBuilderModal";
import type { Policy } from "../types/policies";
import { deletePolicy } from "../api/policies";

export function PoliciesPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);

  const qc = useQueryClient();
  const policies = usePoliciesQuery();

  async function handleDelete(p: Policy) {
    const ok = confirm(`Delete policy "${p.name}"?`);
    if (!ok) return;

    await deletePolicy(p.id);
    await qc.invalidateQueries({ queryKey: ["policies"] });
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <PageHeader
        title="Policies"
        description="Create and manage access policies."
        right={<Button onClick={() => setOpen(true)}>New Policy</Button>}
      />

      <Card>
        {policies.isLoading && <p>Loading policies…</p>}
        {policies.isError && <p>Failed to load policies.</p>}

        {policies.isSuccess && policies.data.length === 0 && <p>No policies yet.</p>}

        {policies.isSuccess && policies.data.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {policies.data.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 12,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{p.name}</div>

                    <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                      {p.description ?? "—"}
                    </div>

                    <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>
                      Effect: <b>{p.effect.toUpperCase()}</b> • Updated:{" "}
                      {new Date(p.updatedAt).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing(p);
                      }}
                    >
                      Edit
                    </Button>

                    <Button variant="danger" onClick={() => handleDelete(p)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <PolicyBuilderModal
        open={open || !!editing}
        initialPolicy={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}