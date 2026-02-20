export type PolicyEffect = "allow" | "deny";

export type ConditionField = "role" | "status" | "email_domain";
export type ConditionOp = "equals" | "contains";

export type Condition = {
  id: string;
  field: ConditionField;
  op: ConditionOp;
  value: string;
};

export type ConditionGroup = {
  id: string;
  operator: "AND" | "OR";
  conditions: Condition[];
};

export type Policy = {
  id: string;
  name: string;
  description?: string;
  effect: PolicyEffect;
  groups: ConditionGroup[];
  createdAt: string;
  updatedAt: string;
};