import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import type { Policy, ConditionGroup, Condition } from "../../types/policies";
import { createPolicy, updatePolicy } from "../../api/policies";

function newCondition(): Condition {
  return {
    id: crypto.randomUUID(),
    field: "role",
    op: "equals",
    value: "",
  };
}

function newGroup(): ConditionGroup {
  return {
    id: crypto.randomUUID(),
    operator: "AND",
    conditions: [newCondition()],
  };
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function PolicyBuilderModal({
  open,
  onClose,
  initialPolicy,
}: {
  open: boolean;
  onClose: () => void;
  initialPolicy?: Policy | null;
}) {
  const qc = useQueryClient();

  const mode = initialPolicy ? "edit" : "create";
  const title = mode === "edit" ? "Edit Policy" : "Create Policy";

  // A stable key that changes when you switch between different policies (or create)
  const formKey = useMemo(() => initialPolicy?.id ?? "new", [initialPolicy?.id]);

  const [name, setName] = useState(initialPolicy?.name ?? "");
  const [description, setDescription] = useState(initialPolicy?.description ?? "");
  const [effect, setEffect] = useState<"allow" | "deny">(initialPolicy?.effect ?? "deny");
  const [groups, setGroups] = useState<ConditionGroup[]>(
    initialPolicy?.groups ? deepClone(initialPolicy.groups) : [newGroup()]
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reset form whenever we open the modal OR switch which policy is being edited
  useEffect(() => {
    if (!open) return;

    setError(null);
    setSaving(false);

    setName(initialPolicy?.name ?? "");
    setDescription(initialPolicy?.description ?? "");
    setEffect(initialPolicy?.effect ?? "deny");
    setGroups(initialPolicy?.groups ? deepClone(initialPolicy.groups) : [newGroup()]);
  }, [open, formKey]); // <- formKey changes when initialPolicy changes

  function addGroup() {
    setGroups((g) => [...g, newGroup()]);
  }

  function removeGroup(id: string) {
    setGroups((g) => g.filter((x) => x.id !== id));
  }

  function addCondition(groupId: string) {
    setGroups((g) =>
      g.map((grp) =>
        grp.id === groupId ? { ...grp, conditions: [...grp.conditions, newCondition()] } : grp
      )
    );
  }

  function removeCondition(groupId: string, condId: string) {
    setGroups((g) =>
      g.map((grp) =>
        grp.id === groupId
          ? { ...grp, conditions: grp.conditions.filter((c) => c.id !== condId) }
          : grp
      )
    );
  }

  function updateCondition(groupId: string, condId: string, patch: Partial<Condition>) {
    setGroups((g) =>
      g.map((grp) =>
        grp.id === groupId
          ? {
              ...grp,
              conditions: grp.conditions.map((c) => (c.id === condId ? { ...c, ...patch } : c)),
            }
          : grp
      )
    );
  }

  function setGroupOperator(groupId: string, operator: "AND" | "OR") {
    setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, operator } : g)));
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("Policy name is required.");
      return;
    }

    setError(null);
    setSaving(true);

    const now = new Date().toISOString();

    const policy: Policy = {
      id: initialPolicy?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      effect,
      groups,
      createdAt: initialPolicy?.createdAt ?? now,
      updatedAt: now,
    };

    if (initialPolicy) {
      await updatePolicy(policy);
    } else {
      await createPolicy(policy);
    }

    await qc.invalidateQueries({ queryKey: ["policies"] });

    setSaving(false);
    onClose();
  }

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <div style={{ display: "grid", gap: 14 }}>
        <Input label="Policy Name" value={name} onChange={(e) => setName(e.target.value)} />

        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            Effect
          </label>

          <select
            value={effect}
            onChange={(e) => setEffect(e.target.value as "allow" | "deny")}
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
            <option value="allow">Allow</option>
            <option value="deny">Deny</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {groups.map((grp) => (
            <div
              key={grp.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 12,
                display: "grid",
                gap: 10,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <strong>Group</strong>

                  <select
                    value={grp.operator}
                    onChange={(e) => setGroupOperator(grp.id, e.target.value as "AND" | "OR")}
                    style={{
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      background: "rgba(0,0,0,0.12)",
                      color: "var(--text)",
                      padding: "8px 10px",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>

                <Button variant="danger" onClick={() => removeGroup(grp.id)}>
                  Remove Group
                </Button>
              </div>

              {grp.conditions.map((cond) => (
                <div
                  key={cond.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: 10,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
                    <select
                      value={cond.field}
                      onChange={(e) =>
                        updateCondition(grp.id, cond.id, { field: e.target.value as any })
                      }
                      style={{
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "rgba(0,0,0,0.12)",
                        color: "var(--text)",
                        padding: "10px 12px",
                        fontWeight: 800,
                      }}
                    >
                      <option value="role">Role</option>
                      <option value="status">Status</option>
                      <option value="email_domain">Email Domain</option>
                    </select>

                    <select
                      value={cond.op}
                      onChange={(e) =>
                        updateCondition(grp.id, cond.id, { op: e.target.value as any })
                      }
                      style={{
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "rgba(0,0,0,0.12)",
                        color: "var(--text)",
                        padding: "10px 12px",
                        fontWeight: 800,
                      }}
                    >
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                    </select>
                  </div>

                  <Input
                    label="Value"
                    value={cond.value}
                    onChange={(e) => updateCondition(grp.id, cond.id, { value: e.target.value })}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="secondary" onClick={() => removeCondition(grp.id, cond.id)}>
                      Remove Condition
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="secondary" onClick={() => addCondition(grp.id)}>
                Add Condition
              </Button>
            </div>
          ))}

          <Button variant="secondary" onClick={addGroup}>
            Add Group
          </Button>
        </div>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            background: "rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 8 }}>JSON Preview</div>
          <pre
            style={{
              margin: 0,
              overflowX: "auto",
              fontSize: 12,
              lineHeight: 1.4,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {JSON.stringify(
              {
                name: name.trim(),
                description: description.trim() || undefined,
                effect,
                groups,
              },
              null,
              2
            )}
          </pre>
        </div>

        {error && <div style={{ color: "#fca5a5", fontWeight: 800 }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Save Policy"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}